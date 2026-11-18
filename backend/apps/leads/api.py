from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import filters, mixins, permissions, serializers, viewsets
from rest_framework.pagination import PageNumberPagination
from .models import Lead

WRITABLE = ("name", "phone", "source", "campaign", "treatment", "preferred_period", "status", "next_contact_at", "appointment_at")

class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = ("id",) + WRITABLE + ("created_at", "updated_at", "created_by", "updated_by")
        read_only_fields = ("id", "created_at", "updated_at", "created_by", "updated_by")

    def to_internal_value(self, data):
        unknown = set(data) - set(WRITABLE)
        if unknown:
            raise serializers.ValidationError({"fields": "Campos não permitidos. Envie somente os campos comerciais documentados."})
        return super().to_internal_value(data)

    def validate(self, attrs):
        candidate = Lead()
        for field in WRITABLE:
            if field in attrs:
                setattr(candidate, field, attrs[field])
            elif self.instance:
                setattr(candidate, field, getattr(self.instance, field))
        try:
            candidate.full_clean()
        except DjangoValidationError as error:
            raise serializers.ValidationError(error.message_dict)
        attrs["name"] = candidate.name
        attrs["phone"] = candidate.phone
        return attrs

class CommercialPermissions(permissions.DjangoModelPermissions):
    perms_map = {**permissions.DjangoModelPermissions.perms_map,
        "GET": ["%(app_label)s.view_%(model_name)s"],
        "HEAD": ["%(app_label)s.view_%(model_name)s"],
        "OPTIONS": ["%(app_label)s.view_%(model_name)s"]}

class LeadPagination(PageNumberPagination):
    page_size = 25

class LeadViewSet(mixins.ListModelMixin, mixins.CreateModelMixin, mixins.RetrieveModelMixin,
                  mixins.UpdateModelMixin, viewsets.GenericViewSet):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
    permission_classes = [CommercialPermissions]
    pagination_class = LeadPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "phone", "campaign"]
    http_method_names = ["get", "post", "patch", "head", "options"]

    def get_queryset(self):
        query = super().get_queryset()
        for field in ("status", "source"):
            value = self.request.query_params.get(field)
            if value:
                query = query.filter(**{field: value})
        return query

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)
