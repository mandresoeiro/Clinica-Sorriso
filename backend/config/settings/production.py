from django.core.exceptions import ImproperlyConfigured
from .base import *  # noqa: F403

if len(SECRET_KEY) < 50 or SECRET_KEY.startswith('development-'):  # noqa: F405
    raise ImproperlyConfigured('Defina DJANGO_SECRET_KEY forte e exclusiva para produção.')
if not ALLOWED_HOSTS or '*' in ALLOWED_HOSTS:  # noqa: F405
    raise ImproperlyConfigured('Defina DJANGO_ALLOWED_HOSTS com os hosts oficiais.')
if not DATABASES['default']['PASSWORD']:  # noqa: F405
    raise ImproperlyConfigured('Defina POSTGRES_PASSWORD para produção.')
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 3600
SECURE_HSTS_INCLUDE_SUBDOMAINS = False
SECURE_HSTS_PRELOAD = False
CSRF_TRUSTED_ORIGINS = [value.strip() for value in os.environ.get('DJANGO_CSRF_TRUSTED_ORIGINS', '').split(',') if value.strip()]
# Não confiar em X-Forwarded-Proto até configurar um proxy que remova cabeçalhos externos.

# Ativar somente com Gunicorn em rede privada atrás do Nginx fornecido.
TRUST_NGINX_HEADERS = os.environ.get("TRUST_NGINX_HEADERS", "false").lower() == "true"
if TRUST_NGINX_HEADERS:
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
