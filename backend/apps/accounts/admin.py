from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class AccountAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (('Perfil funcional', {'fields': ('role',)}),)
    add_fieldsets = UserAdmin.add_fieldsets + (('Perfil funcional', {'fields': ('role',)}),)
    list_display = ('username', 'role', 'is_active', 'is_staff')
