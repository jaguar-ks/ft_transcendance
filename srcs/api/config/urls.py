from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

from django.contrib import admin

urlpatterns = [
    path("admin/", admin.site.urls),
    # Schema generation
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    # Swagger UI
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    # Redoc UI
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
    # authentication URLs
    path("api/auth/", include("apps.authentication.urls")),
    # users
    path("api/users/", include("apps.users.urls")),
    # game
    path("api/pongue/", include("apps.pongue.urls")),
]
