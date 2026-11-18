from django.contrib.auth.models import AbstractUser, UserManager as DjangoUserManager
from django.db import models

class UserManager(DjangoUserManager):
    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault('role', 'administrator')
        return super().create_superuser(username, email, password, **extra_fields)

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMINISTRATOR = 'administrator', 'Administrador'
        RECEPTION = 'reception', 'Recepção'

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.RECEPTION)
    objects = UserManager()
