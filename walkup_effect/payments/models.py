from django.db import models
from django.urls import reverse
from django.conf import settings


class Payment(models.Model):
    name = models.CharField(max_length=255)
    quantity = models.IntegerField(default=1)
    currency = models.CharField(default="usd", max_length=25)
    amount = models.IntegerField()

    def __str__(self):
        return f"{self.name} ({self.id})"

    # def get_absolute_url(self):
    #     """returns a url string -> {url:name, 'kwargs'}"""
    #     # return reverse("payments:home")
    #
    #     return reverse(f"https://checkout.stripe.com/pay/{self.public_key}")
