from rest_framework.serializers import ModelSerializer
from Accounts.models import Employees


class AccountSerializer(ModelSerializer):
    class Meta:
        model = Employees
        fields = '__all__'
