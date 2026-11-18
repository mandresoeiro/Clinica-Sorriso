from django.http import HttpResponse
from django.test import RequestFactory, SimpleTestCase, override_settings
from .proxy import TrustedNginxMiddleware

class ProxyTests(SimpleTestCase):
    def request(self):
        return RequestFactory().get("/", REMOTE_ADDR="127.0.0.1", HTTP_X_CLINIC_CLIENT_IP="203.0.113.8")
    def test_headers_ignored_by_default(self):
        request=self.request()
        TrustedNginxMiddleware(lambda r: HttpResponse())(request)
        self.assertEqual(request.META["REMOTE_ADDR"],"127.0.0.1")
    @override_settings(TRUST_NGINX_HEADERS=True)
    def test_only_valid_address_is_accepted_when_enabled(self):
        request=self.request()
        TrustedNginxMiddleware(lambda r: HttpResponse())(request)
        self.assertEqual(request.META["REMOTE_ADDR"],"203.0.113.8")
        request.META["HTTP_X_CLINIC_CLIENT_IP"]="forged, values"
        TrustedNginxMiddleware(lambda r: HttpResponse())(request)
        self.assertEqual(request.META["REMOTE_ADDR"],"invalid-proxy")
