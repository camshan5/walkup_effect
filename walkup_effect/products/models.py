from django.db import models


class Product(models.Model):
    PRODUCT_TYPE = (
        (1, "Donation"),
        (2, "Other"),
    )

    name = models.CharField(max_length=255)
    type = models.IntegerField(choices=PRODUCT_TYPE)

    def __str__(self):
        return self.name
