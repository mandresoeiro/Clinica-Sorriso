from .base import *  # noqa: F403

DEBUG = True
SECRET_KEY = SECRET_KEY or 'development-only-not-for-production-personnallite-key'  # noqa: F405
ALLOWED_HOSTS = ALLOWED_HOSTS or ['localhost', '127.0.0.1', '[::1]']  # noqa: F405
WHITENOISE_USE_FINDERS = True
STORAGES['staticfiles']['BACKEND'] = 'django.contrib.staticfiles.storage.StaticFilesStorage'  # noqa: F405
REST_FRAMEWORK['DEFAULT_RENDERER_CLASSES'].append('rest_framework.renderers.BrowsableAPIRenderer')  # noqa: F405

WHITENOISE_ROOT = BASE_DIR / "frontend" if CONTACT_INTAKE_ENABLED else None  # noqa: F405
