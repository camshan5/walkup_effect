from django.urls import path

from . import views


app_name = "payments"

urlpatterns = [
    path("", views.PaymentCreateView.as_view(), name="home"),
    path("config/", views.StripeConfigView.as_view()),
    path("create-checkout-session/", views.CheckoutSessionView.as_view()),
    path("success/", views.SuccessView.as_view(), name="success"),
    path("cancelled/", views.CancelledView.as_view(), name="cancelled"),
]
