from django.apps import AppConfig


class AuthenticationAppConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.authentication"

    def ready(self) -> None:
        from .openapi_extensions import OpenApiAuthenticationExtension
