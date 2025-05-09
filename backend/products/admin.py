from django.contrib import admin
from .models import *
# Register your models here.
admin.site.register(ProductName)
admin.site.register(Types)
admin.site.register(Ingredients)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'product_type', 'img_url',]


@admin.register(Sizes)
class SizesAdmin(admin.ModelAdmin):
    list_display = ['name', 'size', 'grams', 'price']
