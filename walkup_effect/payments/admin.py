from django.contrib import admin

from walkup_effect.payments.models import Payment


class PaymentAdmin(admin.ModelAdmin):
    model = Payment
    list_display = ["id", "name", "amount"]


admin.site.register(Payment, PaymentAdmin)
