from django.contrib import admin
from django.db.models import JSONField
from django_json_widget.widgets import JSONEditorWidget
from .models import Order
# Register your models here.


@admin.register(Order)
class YourModelAdmin(admin.ModelAdmin):
    list_display = ['created', 'email', 'phone', 'paymentType', 'paid_status']
    formfield_overrides = {
        JSONField: {'widget': JSONEditorWidget},
    }