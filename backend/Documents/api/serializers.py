from rest_framework.serializers import ModelSerializer
from Documents.models import Documents


class DocumentSerializer(ModelSerializer):
    class Meta:
        model = Documents
        fields = '__all__'