import os
import secrets
import subprocess
import sys
from django.conf import settings
from django.test import SimpleTestCase

class ProductionConfigurationTests(SimpleTestCase):
    def check_production(self, overrides):
        env = os.environ.copy()
        env.update({
            "DJANGO_SETTINGS_MODULE": "config.settings.production",
            "DJANGO_SECRET_KEY": secrets.token_urlsafe(64),
            "DJANGO_ALLOWED_HOSTS": "api.example.invalid",
            "POSTGRES_PASSWORD": "test-configuration-only",
        })
        env.update(overrides)
        return subprocess.run(
            [sys.executable, "manage.py", "check", "--deploy", "--fail-level", "ERROR"],
            cwd=settings.BASE_DIR, env=env, capture_output=True, text=True, timeout=40,
        )

    def test_missing_secret_prevents_production_startup(self):
        result = self.check_production({"DJANGO_SECRET_KEY": ""})
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("DJANGO_SECRET_KEY", result.stderr)

    def test_wildcard_host_prevents_production_startup(self):
        result = self.check_production({"DJANGO_ALLOWED_HOSTS": "*"})
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("DJANGO_ALLOWED_HOSTS", result.stderr)

    def test_explicit_production_configuration_passes_error_checks(self):
        result = self.check_production({})
        self.assertEqual(result.returncode, 0, result.stderr)
