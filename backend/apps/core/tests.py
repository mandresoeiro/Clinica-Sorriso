from unittest.mock import patch
from django.db import DatabaseError
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

class AccessTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.reception = get_user_model().objects.create_user('reception', password='testing-passphrase-123')
        self.admin = get_user_model().objects.create_superuser('owner', password='testing-passphrase-456')

    def test_health_is_public_without_account_data(self):
        self.assertEqual(self.client.get('/api/v1/health/').json(), {'status': 'ok'})

    def test_readiness_checks_database(self):
        self.assertEqual(self.client.get('/api/v1/ready/').status_code, 200)
        with patch('apps.core.views.connection.cursor', side_effect=DatabaseError('private db detail')):
            response = self.client.get('/api/v1/ready/')
        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.json(), {'status': 'unavailable'})

    def test_anonymous_cannot_access_identity_or_administration(self):
        for url in ['/api/v1/me/', '/api/v1/administration/']:
            self.assertEqual(self.client.get(url).status_code, 403)

    def test_reception_can_read_own_profile_but_not_administration(self):
        self.client.force_authenticate(self.reception)
        self.assertEqual(self.client.get('/api/v1/me/').json(), {'username': 'reception', 'role': 'reception'})
        self.assertEqual(self.client.get('/api/v1/administration/').status_code, 403)
        self.assertEqual(self.client.post('/api/v1/me/', {'role': 'administrator'}).status_code, 405)

    def test_superuser_gets_administrator_role_and_access(self):
        self.assertEqual(self.admin.role, 'administrator')
        self.client.force_authenticate(self.admin)
        self.assertEqual(self.client.get('/api/v1/administration/').status_code, 200)

    def test_session_login_and_inactive_account(self):
        self.assertTrue(self.client.login(username='reception', password='testing-passphrase-123'))
        self.assertEqual(self.client.get('/api/v1/me/').status_code, 200)
        self.reception.is_active = False
        self.reception.save()
        self.assertEqual(self.client.get('/api/v1/me/').status_code, 403)
