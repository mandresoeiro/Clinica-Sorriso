from django.contrib import admin
from .models import Lead

@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ("name", "phone", "source", "treatment", "preferred_period", "status", "next_contact_at", "appointment_at", "updated_at")
    list_filter = ("status", "source", "treatment", "preferred_period", ("next_contact_at", admin.EmptyFieldListFilter))
    search_fields = ("name", "phone", "campaign")
    ordering = ("-created_at",)
    date_hierarchy = "created_at"
    readonly_fields = ("created_at", "updated_at", "created_by", "updated_by", "acknowledged_at")
    fieldsets = (
        ("Contato", {"fields": ("name", "phone"), "description": "Somente organização comercial. Não cadastrar exames, diagnósticos ou prontuários."}),
        ("Solicitação", {"fields": ("treatment", "preferred_period", "acknowledged_at")}),
        ("Origem", {"fields": ("source", "campaign")}),
        ("Acompanhamento", {"fields": ("status", "next_contact_at", "appointment_at"),
            "description": "Agendamentos são registros manuais, sujeitos à confirmação e controle de disponibilidade pela recepção."}),
        ("Registro", {"fields": ("created_at", "updated_at", "created_by", "updated_by")}),
    )

    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        obj.updated_by = request.user
        super().save_model(request, obj, form, change)
