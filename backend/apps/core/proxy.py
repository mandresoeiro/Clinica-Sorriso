import ipaddress
from django.conf import settings

class TrustedNginxMiddleware:
    """Usar apenas quando Gunicorn recebe tráfego exclusivamente do Nginx privado."""
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if getattr(settings, "TRUST_NGINX_HEADERS", False):
            try:
                address = str(ipaddress.ip_address(request.META.get("HTTP_X_CLINIC_CLIENT_IP", "")))
            except ValueError:
                address = "invalid-proxy"
            request.META["REMOTE_ADDR"] = address
        return self.get_response(request)
