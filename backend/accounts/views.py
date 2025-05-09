from .utils import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserGoogleSerialzer
from .models import AppUser

class LoginWithGoogle(APIView):
    def post(self, request):
        if 'code' in request.data.keys():
            code = request.data['code']
            id_token = get_google_id_token(code)
            user = authenticate_or_create_user(id_token)
            refresh = get_jwt_token(user)
            serializer = UserGoogleSerialzer(user)
            
            return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user': serializer.data
                })

        return Response(status=status.HTTP_400_BAD_REQUEST)


class CheckEmail(APIView):
    def post(self, request):
        try:
            AppUser.objects.get(email=request.data)
            return Response({"error":"user with this username already exist"}, status=status.HTTP_400_BAD_REQUEST)
        except AppUser.DoesNotExist:
            return Response({"success": "username is available"}, status=status.HTTP_200_OK)