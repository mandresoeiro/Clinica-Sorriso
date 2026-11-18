import json
from uuid import uuid4
from django.core.cache import cache
from django.test import Client, TestCase, override_settings
from .models import Lead

@override_settings(DEBUG=True, CONTACT_INTAKE_ENABLED=True)
class IntakeTests(TestCase):
    def setUp(self):
        cache.clear()
        self.client = Client(enforce_csrf_checks=True)
        self.payload = {"name": "Contato de teste", "phone": "91999990000", "source": "instagram",
                        "campaign": "perfil", "acknowledged": True, "website": "", "request_id": str(uuid4())}

    def token(self):
        return self.client.get("/api/v1/contact/config/").json()["csrfToken"]

    def send(self, payload=None, token=None):
        return self.client.post("/api/v1/contact/requests/", json.dumps(payload or self.payload),
            content_type="application/json", HTTP_X_CSRFTOKEN=token or self.token())

    def test_creates_contact_without_exposing_record_and_deduplicates_retry(self):
        token = self.token()
        response = self.send(token=token)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json(), {"status": "received"})
        self.assertEqual(self.send(token=token).status_code, 200)
        self.assertEqual(Lead.objects.count(), 1)
        lead = Lead.objects.get()
        self.assertEqual(lead.status, "new")
        self.assertIsNone(lead.created_by)
        self.assertEqual(self.client.get("/api/v1/leads/").status_code, 403)

    def test_requires_csrf_and_acknowledgement(self):
        response = self.client.post("/api/v1/contact/requests/", json.dumps(self.payload), content_type="application/json")
        self.assertEqual(response.status_code, 403)
        self.assertEqual(self.send({**self.payload, "acknowledged": False}).status_code, 400)
        self.assertEqual(Lead.objects.count(), 0)

    def test_rejects_clinical_or_privileged_fields_and_invalid_phone(self):
        for payload in [{**self.payload, "diagnosis": "not allowed"}, {**self.payload, "status": "booked"},
                        {**self.payload, "phone": "123"}, {**self.payload, "request_id": "invalid"}]:
            self.assertEqual(self.send(payload).status_code, 400)
        self.assertEqual(Lead.objects.count(), 0)

    def test_honeypot_and_rate_limit_do_not_create_contacts(self):
        token = self.token()
        bait = {**self.payload, "website": "bot"}
        for _ in range(8):
            self.assertEqual(self.send(bait, token).status_code, 400)
        self.assertEqual(self.send(bait, token).status_code, 429)
        self.assertEqual(Lead.objects.count(), 0)

    @override_settings(DEBUG=False)
    def test_capture_remains_disabled_in_production(self):
        self.assertEqual(self.client.get("/api/v1/contact/config/").status_code, 503)
        self.assertEqual(self.client.get("/contato").status_code, 404)

    def test_landing_fields_persist_and_changed_retry_is_rejected(self):
        payload = {**self.payload, "treatment": "implante", "preferred_period": "tarde", "campaign": "humanizado"}
        self.assertEqual(self.send(payload).status_code, 201)
        lead = Lead.objects.get()
        self.assertEqual(lead.treatment, "implante")
        self.assertEqual(lead.preferred_period, "tarde")
        self.assertIsNotNone(lead.acknowledged_at)
        self.assertEqual(self.send({**payload, "preferred_period": "manha"}).status_code, 409)
        self.assertEqual(Lead.objects.count(), 1)

    def test_rejects_invalid_treatment_and_period(self):
        for values in ({"treatment": "diagnostico"}, {"preferred_period": "madrugada"}):
            self.assertEqual(self.send({**self.payload, **values}).status_code, 400)
        self.assertEqual(Lead.objects.count(), 0)

    @override_settings(DEBUG=False, CONTACT_INTAKE_PRODUCTION_READY=True)
    def test_explicit_production_activation_preserves_csrf(self):
        self.assertEqual(self.send().status_code, 201)
        self.assertEqual(self.client.post("/api/v1/contact/requests/", json.dumps(self.payload), content_type="application/json").status_code, 403)

    def test_quota_survives_cache_clear(self):
        from .models import ContactIntakeQuota
        token = self.token()
        for _ in range(8):
            self.send({**self.payload, "website": "bot"}, token)
        cache.clear()
        self.assertEqual(self.send(token=token).status_code, 429)
        self.assertEqual(ContactIntakeQuota.objects.get().count, 8)
