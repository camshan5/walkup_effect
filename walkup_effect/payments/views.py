import stripe
from django.conf import settings
from django.http import JsonResponse
from django.urls import reverse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView, CreateView

from walkup_effect.payments.models import Payment

STRIPE_PUBLIC_KEY = settings.STRIPE_PUBLISHABLE_KEY

stripe.api_key = settings.STRIPE_SECRET_KEY


# @csrf_exempt
# def create_checkout_session(request):  # sourcery skip: last-if-guard
#     if request.method == "GET":
#         success_url = (
#             request.build_absolute_uri(reverse("payments:success"))
#             + "?session_id={CHECKOUT_SESSION_ID}"  # for stripe session
#         )
#         cancel_url = request.build_absolute_uri(reverse("payments:cancelled"))
#
#         try:
#             # For details checkout the Stripe docs:
#             #   -> https://stripe.com/docs/api/checkout/sessions/create
#
#             line_items = {
#                 "name": "Cameron",  # request.object.name,
#                 "quantity": 1,
#                 "currency": "usd",
#                 "amount": 100 * 20,  # self.object.amount,
#             }
#
#             session = stripe.checkout.Session.create(
#                 success_url=success_url,  # self.success_url,
#                 cancel_url=cancel_url,  # self.cancel_url,
#                 payment_method_types=["card"],
#                 mode="payment",
#                 line_items=[line_items],
#             )
#
#             print(session)
#             return JsonResponse({"sessionId": session["id"]})
#
#         except Exception as e:
#             return JsonResponse({"error": str(e)})


class PaymentCreateView(CreateView):
    model = Payment
    fields = ("name", "amount")
    template_name = "payments/home.html"
    success_url = "/payments/"


class StripeConfigView(View):
    public_key = STRIPE_PUBLIC_KEY

    def get(self, request):
        try:
            stripe_config = {"publicKey": self.public_key}
            return JsonResponse(stripe_config, safe=False)

        except Exception as e:
            return JsonResponse({"error": str(e)})


class CheckoutSessionView(View):
    """Creates a new Checkout Session for the order."""

    stripe.api_key = settings.STRIPE_SECRET_KEY

    def get(self, request):
        try:
            session = self.checkout_session(request)

            return JsonResponse({"sessionId": session["id"]})

        except Exception as e:
            return JsonResponse({"error": str(e)})

    @staticmethod
    def checkout_session(request):
        success_url = (
            request.build_absolute_uri(reverse("payments:success"))
            + "?session_id={CHECKOUT_SESSION_ID}"  # for stripe session
        )
        cancel_url = request.build_absolute_uri(reverse("payments:cancelled"))

        line_items = {
            "name": "Cameron",
            "quantity": 1,
            "currency": "usd",
            "amount": 20 * 100,  # amount in pennies
        }

        return stripe.checkout.Session.create(
            success_url=success_url,
            cancel_url=cancel_url,
            payment_method_types=["card"],
            mode="payment",
            line_items=[line_items],
        )


class SuccessView(TemplateView):
    template_name = "payments/success.html"


class CancelledView(TemplateView):
    template_name = "payments/cancelled.html"
