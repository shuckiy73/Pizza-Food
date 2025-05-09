from django.db import models
from orders.models import Order


class PaymentHistory(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    session_id = models.CharField(max_length=255)
    customer_was_notificeted = models.BooleanField(default=False)