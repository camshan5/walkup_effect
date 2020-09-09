from crispy_forms.helper import FormHelper
from django import forms

from walkup_effect.payments.models import Payment


class PaymentModelForm(forms.ModelForm):
    class Meta:
        model = Payment
        fields = ("name", "amount")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_method = "post"
