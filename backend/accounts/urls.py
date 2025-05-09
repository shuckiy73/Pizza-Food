from django.urls import path
from .views import LoginWithGoogle, CheckEmail

urlpatterns = [
    path('login-with-google/', LoginWithGoogle.as_view()),
    path('check-email/', CheckEmail.as_view())
]