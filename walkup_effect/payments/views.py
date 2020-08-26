import stripe
from django.conf import settings
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView
from django.views import View


class HomePageView(TemplateView):
    template_name = "payments/home.html"


class SuccessView(TemplateView):
    template_name = "payments/success.html"


class CancelledView(TemplateView):
    template_name = "payments/cancelled.html"


@csrf_exempt
def stripe_config(request):
    if request.method == "GET":
        stripe_config_ = {"publicKey": settings.STRIPE_PUBLISHABLE_KEY}
        return JsonResponse(stripe_config_, safe=False)


class CheckoutSessionView(View):
    # Create new Checkout Session for the order...
    # -------------------------------------------------------
    # Other optional params include:
    #    * [billing_address_collection] - to display billing
    #        address details on the page.
    #    * [customer] - if you have an existing Stripe
    #        Customer ID.
    #    * [payment_intent_data] - lets capture the payment
    #        later.
    #    * [customer_email] - lets you pre-fill the email
    #        input in the form.
    # -------------------------------------------------------
    # For full details see:
    #   https:#stripe.com/docs/api/checkout/sessions/create

    stripe.api_key = settings.STRIPE_SECRET_KEY
    domain_url = "http://localhost:8000/"
    checkout_session_str = "{CHECKOUT_SESSION_ID}"

    # ?session_id={CHECKOUT_SESSION_ID} means the redirect will have
    # the session ID set as a query param
    success_url = f"{domain_url}payments/success?session_id={checkout_session_str}"
    cancel_url = f"{domain_url}payments/cancelled/"

    @csrf_exempt
    def get(self, request):
        try:
            checkout_session = stripe.checkout.Session.create(
                success_url=self.success_url,
                cancel_url=self.cancel_url,
                payment_method_types=["card"],
                mode="payment",
                line_items=[
                    {
                        "name": "Donation - Tier 1",
                        "quantity": 1,
                        "currency": "usd",
                        "amount": "5000",  # parses to $50.00
                    }
                ],
            )
            return JsonResponse({"sessionId": checkout_session["id"]})

        except Exception as e:
            return JsonResponse({"error": str(e)})
