from django.conf import settings
from django.contrib import admin
from django.urls import include, path, re_path
from rest_framework.routers import DefaultRouter
from apps.leads.api import LeadViewSet
from apps.leads.intake import intake, intake_config, local_site
from apps.core.views import health, readiness, current_user, administrator_status

router = DefaultRouter()
router.register("leads", LeadViewSet, basename="lead")

urlpatterns = [
    path("api/v1/contact/config/", intake_config),
    path("api/v1/contact/requests/", intake),
    path("api/v1/", include(router.urls)),
    path('admin/', admin.site.urls),
    path('api/v1/health/', health, name='health'),
    path('api/v1/ready/', readiness, name='ready'),
    path('api/v1/me/', current_user, name='me'),
    path('api/v1/administration/', administrator_status, name='administration'),
]
if settings.DEBUG:
    urlpatterns.append(path('api-auth/', include('rest_framework.urls')))
admin.site.site_header = 'Odonto Personnallite | Administração'
admin.site.site_title = 'Odonto Personnallite'

urlpatterns += [path("", local_site), re_path(r"^(?P<path>.*)$", local_site)]
