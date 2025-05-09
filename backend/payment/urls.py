from django.urls import path
from .views import StripeCheckoutView, stripe_webhook_view, payment_notification


urlpatterns = [
    path('create-checkout-session/', StripeCheckoutView.as_view()),
    path('stripe-webhook/', stripe_webhook_view, name='stripe-webhook'),
    path('payment-notification/', payment_notification)
]