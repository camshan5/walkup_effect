from django.urls import path

from . import views


app_name = "payments"

urlpatterns = [
    # path("", views.PaymentCreateView.as_view(), name="home"),
    path("", views.payment_home, name="home"),
    path("config/", views.StripeConfigView.as_view()),
    path("charge/", views.ChargeView.as_view(), name="charge"),
    path("success/", views.SuccessView.as_view(), name="success"),

    path("cancelled/", views.CancelledView.as_view(), name="cancelled"),
]
