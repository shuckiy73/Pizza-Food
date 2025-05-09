from rest_framework import serializers
from .models import Order

class OrderSerializer(serializers.ModelSerializer):
    created = serializers.SerializerMethodField()

    def get_created(self, obj):
        return obj.created.strftime(r"%d/%m/%Y, at %H:%M:%S")

    class Meta:
        model = Order 
        fields = '__all__'
