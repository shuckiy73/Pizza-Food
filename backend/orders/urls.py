
from django.urls import path
from .views import OrderCreateApiView, OrderListApiView

urlpatterns = [
    path('create-order/', OrderCreateApiView.as_view()),
    path('list-orders/', OrderListApiView.as_view())
]