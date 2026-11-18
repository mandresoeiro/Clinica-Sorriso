import re
from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator
from django.db import models

class Lead(models.Model):
    class Source(models.TextChoices):
        SITE = "site", "Site / direto"
        INSTAGRAM = "instagram", "Instagram"
        FACEBOOK = "facebook", "Facebook"
        GOOGLE = "google", "Google"
        REFERRAL = "referral", "Indicação"
        OTHER = "other", "Outro"

    class Status(models.TextChoices):
        NEW = "new", "Novo contato"
        CONTACTED = "contacted", "Em atendimento"
        WAITING = "waiting", "Aguardando horário"
        BOOKED = "booked", "Agendado pela recepção"
        ATTENDED = "attended", "Compareceu"
        CLOSED = "closed", "Encerrado"

    name = models.CharField("nome do contato", max_length=100, help_text="Identificação para contato; não inserir informações clínicas.")
    phone = models.CharField("WhatsApp com DDD", max_length=24, help_text="DDD e número completo, sem acrescentar dígitos por suposição.")
    source = models.CharField("origem informada", max_length=20, choices=Source.choices, default=Source.SITE)
    campaign = models.CharField("código da campanha", max_length=60, blank=True,
        validators=[RegexValidator(r"^[a-zA-Z][a-zA-Z0-9_-]{0,59}$", "Use apenas um código, sem nomes ou informações pessoais.")])
    treatment = models.CharField("interesse informado", max_length=40, blank=True, choices=[('clinica_geral', 'Clínica Geral'), ('harmonizacao', 'Harmonização Facial'), ('endodontia', 'Endodontia'), ('ortodontia', 'Ortodontia'), ('protese', 'Prótese Dentária'), ('implante', 'Implante Dentário'), ('avaliacao', 'Quero uma avaliação')])
    preferred_period = models.CharField("período para retorno", max_length=12, blank=True, choices=[('manha', 'Manhã'), ('tarde', 'Tarde'), ('qualquer', 'Sem preferência')])
    acknowledged_at = models.DateTimeField("autorização para retorno", null=True, blank=True, editable=False)
    intake_fingerprint = models.CharField(max_length=64, blank=True, editable=False)
    status = models.CharField("situação", max_length=20, choices=Status.choices, default=Status.NEW)
    next_contact_at = models.DateTimeField("próximo retorno", blank=True, null=True)
    appointment_at = models.DateTimeField("horário confirmado pela recepção", blank=True, null=True,
        help_text="Registro manual. Não verifica disponibilidade nem reserva uma vaga.")
    request_id = models.UUIDField(null=True, blank=True, unique=True, editable=False)
    created_at = models.DateTimeField("criado em", auto_now_add=True)
    updated_at = models.DateTimeField("atualizado em", auto_now=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="created_leads", verbose_name="criado por", editable=False)
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="updated_leads", verbose_name="última alteração por", editable=False)

    class Meta:
        verbose_name = "contato comercial"
        verbose_name_plural = "contatos comerciais"
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["status", "next_contact_at"]), models.Index(fields=["source", "created_at"])]

    def __str__(self):
        return self.name

    def clean(self):
        super().clean()
        self.name = self.name.strip()
        errors = {}
        if len(self.name) < 2:
            errors["name"] = "Informe um nome com pelo menos dois caracteres."
        digits = re.sub(r"\D", "", self.phone)
        local = digits[2:] if len(digits) in (12, 13) and digits.startswith("55") else digits
        if not re.fullmatch(r"[0-9\s()+-]+", self.phone) or not re.fullmatch(r"[1-9][0-9]{9,10}", local):
            errors["phone"] = "Informe um telefone brasileiro completo com DDD."
        else:
            self.phone = digits
        if re.search(r"\d{8}", self.campaign):
            errors["campaign"] = "Não use telefones ou identificadores pessoais no código da campanha."
        if self.status in (self.Status.BOOKED, self.Status.ATTENDED) and not self.appointment_at:
            errors["appointment_at"] = "Informe o horário confirmado pela recepção."
        if errors:
            raise ValidationError(errors)


class ContactIntakeQuota(models.Model):
    """Contador compartilhado entre processos, com validade curta."""
    key = models.CharField(max_length=64, primary_key=True)
    count = models.PositiveIntegerField(default=0)
    expires_at = models.DateTimeField(db_index=True)
