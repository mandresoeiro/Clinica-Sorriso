from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient
from .models import Lead

class CommercialTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user("desk", password="test-passphrase-123")
        self.client = APIClient()
        self.payload = {"name": "Contato demonstrativo", "phone": "(91) 99999-0000", "source": "instagram", "campaign": "perfil"}

    def authorize(self):
        call_command("setup_commercial_roles", reception_user="desk", verbosity=0)
        self.user = get_user_model().objects.get(pk=self.user.pk)
        self.client.force_authenticate(self.user)

    def test_anonymous_and_unpermitted_user_are_blocked(self):
        self.assertEqual(self.client.get("/api/v1/leads/").status_code, 403)
        self.client.force_authenticate(self.user)
        self.assertEqual(self.client.get("/api/v1/leads/").status_code, 403)
        self.assertEqual(self.client.post("/api/v1/leads/", self.payload).status_code, 403)

    def test_reception_creates_updates_and_filters_without_admin_privileges(self):
        self.authorize()
        response = self.client.post("/api/v1/leads/", self.payload)
        self.assertEqual(response.status_code, 201, response.data)
        lead = Lead.objects.get()
        self.assertEqual(lead.phone, "91999990000")
        self.assertEqual(lead.created_by, self.user)
        self.assertEqual(self.client.patch(f"/api/v1/leads/{lead.pk}/", {"status": "contacted"}).status_code, 200)
        self.assertEqual(self.client.get("/api/v1/leads/?status=contacted&source=instagram").data["count"], 1)
        self.assertEqual(self.client.get("/api/v1/leads/?status=closed").data["count"], 0)
        self.assertFalse(self.user.has_perm("accounts.change_user"))
        self.assertFalse(self.user.has_perm("leads.delete_lead"))
        self.assertEqual(self.client.delete(f"/api/v1/leads/{lead.pk}/").status_code, 403)

    def test_booking_requires_manually_confirmed_time(self):
        self.authorize()
        lead = Lead.objects.create(**{**self.payload, "phone": "91999990000"})
        url = f"/api/v1/leads/{lead.pk}/"
        self.assertEqual(self.client.patch(url, {"status": "booked"}).status_code, 400)
        response = self.client.patch(url, {"status": "booked", "appointment_at": timezone.now().isoformat()})
        self.assertEqual(response.status_code, 200, response.data)

    def test_rejects_invalid_phone_and_unrecognized_fields(self):
        self.authorize()
        self.assertEqual(self.client.post("/api/v1/leads/", {**self.payload, "phone": "123"}).status_code, 400)
        self.assertEqual(self.client.post("/api/v1/leads/", {**self.payload, "diagnosis": "not allowed"}).status_code, 400)
        self.assertEqual(self.client.post("/api/v1/leads/", {**self.payload, "created_by": self.user.pk}).status_code, 400)
        self.assertEqual(Lead.objects.count(), 0)

    def test_reception_can_open_contacts_but_not_users_in_admin(self):
        self.authorize()
        self.client.force_authenticate(None)
        self.assertTrue(self.client.login(username="desk", password="test-passphrase-123"))
        self.assertEqual(self.client.get("/admin/leads/lead/").status_code, 200)
        self.assertEqual(self.client.get("/admin/accounts/user/").status_code, 403)
