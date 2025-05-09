from django.db import models
from django.conf import settings
from django.utils import timezone
# Create your models here.


PAYMENT_TYPE_CHOICES = (
    ('cash', 'cash'),
    ('card', 'card')
)


class Order(models.Model):
    email = models.CharField(max_length=60, blank=True)
    first_name = models.CharField(max_length=40)
    second_name = models.CharField(max_length=40)
    phone = models.CharField(max_length=40)
    address = models.CharField(max_length=100)
    comment = models.TextField(max_length=255, blank=True)
    orderItems = models.JSONField(default=dict)
    orderPrice = models.DecimalField(decimal_places=2, max_digits=6)
    paymentType = models.CharField(max_length=60, choices=PAYMENT_TYPE_CHOICES)
    paid_status = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    class Meta:
        ordering = ["-created"]

    def __str__(self) -> str:
        return str(self.created.strftime(r"%m/%d/%Y, %H:%M:%S"))

