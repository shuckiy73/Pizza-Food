
from django.urls import path
from .views import ProductGroupApiView

urlpatterns = [
    path('products-list/', ProductGroupApiView.as_view())
]
