from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from accounts.models import AppUser
from rest_framework_simplejwt.tokens import AccessToken
import urllib
import requests
import jwt



def get_jwt_token(user):
    token = RefreshToken.for_user(user)
    return token

def authenticate_or_create_user(id_token):
    try:
        user = AppUser.objects.get(email=id_token['email'])
        if not user.img_url:
            user.img_url = id_token['picture']
            user.save()
    except AppUser.DoesNotExist:
        user = AppUser.objects.create_user(
            email=id_token['email'],
            first_name=id_token['given_name'],
            second_name=id_token['family_name'],
            img_url=id_token['picture'],
            provider='google'
        )
        
    return user

def get_google_id_token(code):
    token_endpoint = "https://oauth2.googleapis.com/token"
    payload = {
        'code': code,
        'client_id': settings.CLIENT_ID,
        'client_secret': settings.CLIENT_SECRET,
        'redirect_uri': settings.REDIRECT_URI,
        'grant_type': 'authorization_code',
    }

    body = urllib.parse.urlencode(payload)
    headers = {
        'content-type': 'application/x-www-form-urlencoded',
    }

    response = requests.post(token_endpoint, data=body, headers=headers)
    if response.ok:
        id_token = response.json()['id_token']
        return jwt.decode(id_token, options={"verify_signature": False})
    else:
        print(response.json())
        return None