from django.urls import path

from . import views

urlpatterns = [
    path("", views.HomePageView.as_view(), name="home"),
    path("config/", views.StripeConfigView.as_view()),
    path("create-checkout-session/", views.CheckoutSessionView.as_view()),
    path("success/", views.SuccessView.as_view()),
    path("cancelled/", views.CancelledView.as_view()),
]
