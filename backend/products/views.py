from rest_framework import generics, status
from .models import Product, Sizes
from .serializers import ProductSerializer
from rest_framework.response import Response
from django.db.models import Prefetch


class ProductGroupApiView(generics.ListAPIView):
    queryset = Product.objects.all().select_related('name').prefetch_related(Prefetch('sizes', queryset=Sizes.objects.all().order_by('size'))).prefetch_related('ingredients')
    serializer_class = ProductSerializer    

    def get(self, request, *args, **kwargs):
      response = super().get(request, *args, **kwargs)
      group = {product["product_type"]: [] for product in response.data}
      {group[product["product_type"]].append(product) for product in response.data}

      return Response(group, status=status.HTTP_200_OK)   
