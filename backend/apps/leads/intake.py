import json
from uuid import UUID
from datetime import timedelta
from django.utils import timezone
from django.db.models import F
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import DatabaseError, IntegrityError, transaction
from django.http import JsonResponse, HttpResponse
from django.utils.crypto import salted_hmac
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from django.views.decorators.http import require_GET, require_POST
from django.middleware.csrf import get_token
from .models import Lead, ContactIntakeQuota

def enabled():
    return getattr(settings, "CONTACT_INTAKE_ENABLED", False) and (settings.DEBUG or getattr(settings, "CONTACT_INTAKE_PRODUCTION_READY", False))

@require_GET
@never_cache
@ensure_csrf_cookie
def intake_config(request):
    if not enabled():
        return JsonResponse({"available": False}, status=503)
    return JsonResponse({"csrfToken": get_token(request)})

@require_POST
@never_cache
@csrf_protect
def intake(request):
    if not enabled():
        return JsonResponse({"status": "unavailable"}, status=503)
    if request.content_type != "application/json":
        return JsonResponse({"status": "invalid"}, status=415)
    if len(request.body) > 4096:
        return JsonResponse({"status": "invalid"}, status=413)
    now = timezone.now()
    bucket = int(now.timestamp()) // 600
    key = salted_hmac("contact-intake", f"{request.META.get('REMOTE_ADDR', 'unknown')}:{bucket}").hexdigest()
    try:
        with transaction.atomic():
            ContactIntakeQuota.objects.filter(expires_at__lte=now).delete()
            ContactIntakeQuota.objects.get_or_create(key=key, defaults={"expires_at": now + timedelta(minutes=20)})
            quota = ContactIntakeQuota.objects.select_for_update().get(key=key)
            if quota.count >= 8:
                response = JsonResponse({"status": "try_later"}, status=429)
                response["Retry-After"] = "600"
                return response
            ContactIntakeQuota.objects.filter(key=key).update(count=F("count") + 1)
    except DatabaseError:
        return JsonResponse({"status": "unavailable"}, status=503)
    try:
        data = json.loads(request.body)
        allowed = {"name", "phone", "source", "campaign", "acknowledged", "website", "request_id", "treatment", "preferred_period"}
        if not isinstance(data, dict) or set(data) - allowed or data.get("acknowledged") is not True:
            raise ValueError()
        if data.get("website"):
            return JsonResponse({"status": "invalid"}, status=400)
        if not isinstance(data.get("request_id"), str):
            raise ValueError()
        request_id = UUID(data["request_id"])
        for field in ("name", "phone", "source", "campaign", "treatment", "preferred_period"):
            if field in data and not isinstance(data[field], str):
                raise ValueError()
        lead = Lead(name=data["name"], phone=data["phone"], source=data.get("source", "site"),
                    campaign=data.get("campaign", ""), request_id=request_id,
                    treatment=data.get("treatment", ""), preferred_period=data.get("preferred_period", ""), acknowledged_at=now)
        lead.full_clean(validate_unique=False)
        lead.intake_fingerprint = salted_hmac("contact-payload", json.dumps([lead.name, lead.phone, lead.source, lead.campaign, lead.treatment, lead.preferred_period])).hexdigest()
        existing = Lead.objects.filter(request_id=request_id).first()
        if existing:
            if existing.intake_fingerprint != lead.intake_fingerprint:
                return JsonResponse({"status": "conflict"}, status=409)
            return JsonResponse({"status": "received"})
        with transaction.atomic():
            lead.save()
    except IntegrityError:
        existing = Lead.objects.filter(request_id=request_id).first()
        if not existing or existing.intake_fingerprint != lead.intake_fingerprint:
            return JsonResponse({"status": "conflict"}, status=409)
    except DatabaseError:
        return JsonResponse({"status": "unavailable"}, status=503)
    except (ValueError, KeyError, TypeError, ValidationError):
        return JsonResponse({"status": "invalid"}, status=400)
    return JsonResponse({"status": "received"}, status=201)

@require_GET
def local_site(request, path=""):
    if not enabled():
        return HttpResponse(status=404)
    if path.split("/", 1)[0] in {"api", "admin", "static"}:
        return HttpResponse(status=404)
    from django.http import FileResponse
    page = settings.BASE_DIR / "frontend" / "index.html"
    if not page.is_file():
        return HttpResponse("A versão local do site ainda não foi compilada.", status=503)
    response = FileResponse(page.open("rb"), content_type="text/html")
    response["Cache-Control"] = "no-store"
    response["X-Robots-Tag"] = "noindex, nofollow"
    return response
