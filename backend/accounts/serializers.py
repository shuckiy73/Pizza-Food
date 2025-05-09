from djoser.serializers import UserCreateSerializer, ActivationSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import serializers
from django.contrib.auth import get_user_model
User = get_user_model()


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['user'] = {
            "email": user.email,
            "first_name": user.first_name,
            "second_name": user.second_name,
            "img_url": user.img_url
        }   
        # ...

        return token

class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ['id', 'first_name', 'second_name', 'email', 'password']

class UserGoogleSerialzer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'second_name', 'email', 'img_url']


class MyActivationSerializer(ActivationSerializer):
    def validate(self, attrs):
        attrs = super(MyActivationSerializer, self).validate(attrs)
        self.user.is_verified = True
        return attrs