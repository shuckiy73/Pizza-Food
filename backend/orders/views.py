from django.shortcuts import render
from rest_framework import generics
from .models import Order
from .serializers import OrderSerializer


class OrderListApiView(generics.ListAPIView):
    model = Order.objects.all()
    serializer_class = OrderSerializer

    def get_queryset(self):
        queryset = Order.objects.filter(email=self.request.user)
        return queryset


class OrderCreateApiView(generics.CreateAPIView):
    model = Order
    serializer_class = OrderSerializer