from rest_framework import serializers
from .models import Product, Sizes, Ingredients

class SizesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sizes
        fields = ['size', 'grams', 'price']

class IngredientsSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        remove_fields = kwargs.pop('remove_fields', None)
        super(IngredientsSerializer, self).__init__(*args, **kwargs)

        if remove_fields:
            # for multiple fields in a list
            for field_name in remove_fields:
                self.fields.pop(field_name)
    class Meta:
        model = Ingredients
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    name = serializers.SlugRelatedField(read_only=True, slug_field='name')
    sizes = SizesSerializer(many=True, read_only=True)
    ingredients = IngredientsSerializer(many=True, read_only=True)

    
    class Meta:
        model = Product
        fields = ['id','name', 'product_type', 'sizes', 'ingredients', 'img_url', 'description']
