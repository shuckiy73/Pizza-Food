from django.contrib import admin
from .models import AppUser
# Register your models here.


@admin.register(AppUser)
class YourModelAdmin(admin.ModelAdmin):
    list_display = ['email', 'first_name', 'second_name', 'is_active']