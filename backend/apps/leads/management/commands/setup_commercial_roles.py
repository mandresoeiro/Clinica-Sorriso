from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from django.core.management.base import BaseCommand, CommandError

class Command(BaseCommand):
    help = "Configura permissões comerciais. Atribuição de usuário exige --reception-user."

    def add_arguments(self, parser):
        parser.add_argument("--reception-user")

    def handle(self, *args, **options):
        group, _ = Group.objects.get_or_create(name="Recepção comercial")
        permissions = Permission.objects.filter(content_type__app_label="leads",
            content_type__model="lead", codename__in=["view_lead", "add_lead", "change_lead"])
        if permissions.count() != 3:
            raise CommandError("Aplique as migrações antes de configurar o grupo.")
        group.permissions.set(permissions)
        username = options["reception_user"]
        if username:
            try:
                user = get_user_model().objects.get(username=username)
            except get_user_model().DoesNotExist:
                raise CommandError("Usuário não encontrado.")
            if user.is_superuser or user.role != "reception":
                raise CommandError("Selecione uma conta existente com perfil Recepção, sem superusuário.")
            user.groups.add(group)
            user.is_staff = True
            user.save(update_fields=["is_staff"])
            self.stdout.write("Permissões de recepção atribuídas ao usuário informado.")
        self.stdout.write("Grupo comercial configurado: visualizar, adicionar e alterar contatos; sem excluir ou gerenciar usuários.")
