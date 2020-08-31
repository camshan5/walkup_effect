from django.db import models


class Payment(models.Model):
    name = models.CharField(max_length=255)
    quantity = models.IntegerField(default=1)
    currency = models.CharField(default="usd", max_length=25)
    amount = models.IntegerField()

    def __str__(self):
        return self.name
