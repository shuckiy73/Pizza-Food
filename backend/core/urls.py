from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings
from django.urls import path, include, re_path
from django.views.generic import TemplateView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/products/', include('products.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/user/', include('accounts.urls')),
    path('api/stripe/', include('payment.urls')),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    #re_path(r'^.*', TemplateView.as_view(template_name="index.html")),
]


if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_URL)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)