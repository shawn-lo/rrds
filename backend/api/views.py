import jwt,json
from rest_framework.response import Response
from django.http import HttpResponseRedirect
from rest_framework.reverse import reverse
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework.generics import (
    ListAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.views import APIView

from rest_framework.parsers import FileUploadParser, FormParser, MultiPartParser

from django.conf import settings

from Accounts.models import Employees
from Accounts.api.serializers import AccountSerializer
from Documents.models import Documents
from Documents.api.serializers import DocumentSerializer

from Accounts.models import Employees

masterSerializerMap = {
    'accounts': AccountSerializer,
}

masterModelMap = {
    'accounts': Employees,
}

detailSerializerMap = {
    'docs': DocumentSerializer,
}

detailModelMap = {
    'docs': Documents,
}

detailForeignKey = {
    'docs': 'emp_no',
}


class DbsListAPIView(ListAPIView):
    def get_serializer_class(self):
        master_name = self.kwargs['master_name']
        return masterSerializerMap[master_name]

    def get_queryset(self):
        master_name = self.kwargs['master_name']
        return masterModelMap[master_name].objects.all()


class TablesListAPIView(ListAPIView):
    lookup_url_kwarg = 'db_name'

    def get_serializer_class(self):
        master_name = self.kwargs['master_name']
        return masterSerializerMap[master_name]

    def get_queryset(self):
        master_name = self.kwargs['master_name']
        return masterModelMap[master_name].objects.all()


class MastersListCreateAPIView(ListCreateAPIView):
    # renderer_classes = [TemplateHTMLRenderer]

    def get_serializer_class(self):
        return masterSerializerMap[self.kwargs['master_name']]

    def get_queryset(self):
        print('The db name is %s and the tb name is %s' % (self.kwargs['db_name'], self.kwargs['master_name']))
        queryset = masterModelMap[self.kwargs['master_name']].objects.all()
        limit = self.request.query_params.get('limit', None)
        orderby = self.request.query_params.get('orderby', None)
        like = self.request.query_params.get('like', None)
        page = self.request.query_params.get('page', None)
        if page is not None:
            print('Call sys pagination filter')
            return self.filter_queryset(masterModelMap[self.kwargs['master_name']].objects.all())

        # naive implementation of each filter
        if limit is not None:
            print('Limit filter detected.')
            queryset = masterModelMap[self.kwargs['master_name']].objects.all()[:int(limit)]
            return queryset

        if orderby is not None:
            print('OrderBy filter detected.')
            order_filters = orderby.split(',')
            orders = []
            for orderFilter in order_filters:
                arr = orderFilter.split(':')
                filter = arr[0]
                order = arr[1]
                if order == 'desc':
                    filter = '-' + filter
                orders.append(filter)
            queryset = masterModelMap[self.kwargs['master_name']].objects.order_by(*orders)
            return queryset

        if like is not None:
            print('Like search filter detected.')
            queryset = masterModelMap[self.kwargs['master_name']].objects.all()
            if like == 'true':
                print('True')
                for key, value in self.request.query_params.items():
                    if key != 'like':
                        queryset = masterModelMap[self.kwargs['master_name']].objects.filter(
                            **{key + '__contains': value})
                        return queryset
            else:
                print('False')
                for key, value in self.request.query_params.items():
                    if key != 'like':
                        queryset = masterModelMap[self.kwargs['master_name']].objects.filter(**{key: value})
                        return queryset
            return queryset
        print('The request query params: ')
        print(self.request.query_params)
        if len(self.request.query_params) != 0:
            q_objects = Q()
            for key, value in self.request.query_params.items():
                q_objects.add(Q(**{key: value}), Q.AND)
            queryset = masterModelMap[self.kwargs['master_name']].objects.filter(q_objects)
            print(queryset)
            return queryset
        else:
            print(self.request.query_params)
            print('No filters detected!!!')

        return queryset

    # List all records with pagination
    def list(self, request, *args, **kwargs):
        # queryset = self.filter_queryset(self.get_queryset())
        queryset = self.get_queryset()
        empty_serializer = self.get_serializer()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            data = {'serializer': serializer.data, 'empty_form': empty_serializer}
            return self.get_paginated_response(data)

        serializer = self.get_serializer(queryset, many=True)
        print('The form is: ', empty_serializer)
        return Response({'results': serializer.data, 'empty': empty_serializer.data})

    # Create a new record
    def create(self, request, *args, **kwargs):
        db_name = self.kwargs['db_name']
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            master_name = self.kwargs['master_name']
            # important to use ** below
            masterModelMap[master_name].objects.create(**serializer.validated_data)
            print('\nIn MastersListCreateAPIView -> create()\nCreate a new record successfully!!!')
            print('The valid data is ', serializer.validated_data)
            print('\n')
            return HttpResponseRedirect(
                reverse('api:records_create_list', args=[db_name, master_name], request=request))
            # return Response(serializer.validated_data)
        else:
            Response('Master could not be created with received data.')


class MasterAPIView(RetrieveUpdateDestroyAPIView):
    lookup_url_kwarg = 'master_id'

    def get_serializer_class(self):
        master_name = self.kwargs['master_name']
        return masterSerializerMap[master_name]

    def get_queryset(self):
        db_name = self.kwargs['db_name']
        master_name = self.kwargs['master_name']
        master_id = self.kwargs['master_id']

        print('The db name is %s, the tb name is %s and the record ID is %s' % (db_name, master_name, master_id))
        return masterModelMap[master_name].objects.all()

    # Retrieve a single record
    def retrieve(self, request, *args, **kwargs):
        master_name = self.kwargs['master_name']
        queryset = masterModelMap[master_name].objects.all()
        print('The queryset is ', queryset)
        user = get_object_or_404(queryset, pk=self.kwargs['master_id'])
        print('The user is ', user)
        serializer = masterSerializerMap[master_name](user)
        return Response({'serializer': serializer.data})

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        print('In update, request data is', request.data)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if not serializer.is_valid():
            print(serializer.errors)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        # return HttpResponseRedirect(reverse('api:records_create_list', args=[db_name, master_name], request=request))
        return Response({'serializer': serializer.data})

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    # Update completely
    def put(self, request, *args, **kwargs):
        print('Call put here')
        return self.update(request, *args, **kwargs)

    # Update partially
    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    # Delete
    def delete(self, request, *args, **kwargs):
        print('delete successfully')
        return self.destroy(request, *args, **kwargs)


'''
    Next, implement details REST API methods
'''


class DetailsListCreateAPIView(ListCreateAPIView):
    # lookup_url_kwarg = 'detail_name'

    def get_serializer_class(self):
        return detailSerializerMap[self.kwargs['detail_name']]

    def get_queryset(self):
        detail_name = self.kwargs['detail_name']
        master_id = self.kwargs['master_id']
        print('The db name is %s and the tb name is %s' % (self.kwargs['db_name'], self.kwargs['master_name']))
        queryset = detailModelMap[detail_name].objects.filter(**{detailForeignKey[detail_name]: master_id})
        print('In detail, the queryset is ', queryset)
        return queryset

    # List all records with pagination
    def list(self, request, *args, **kwargs):
        # queryset = self.filter_queryset(self.get_queryset())
        queryset = self.get_queryset()
        empty_serializer = self.get_serializer()
        print(empty_serializer.data)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            data = {'serializer': serializer.data, 'empty_form': empty_serializer}
            return self.get_paginated_response(data)

        serializer = self.get_serializer(queryset, many=True)
        print('The form is: ', empty_serializer)
        print('There are %d records.', len(serializer.data))
        return Response({'results': serializer.data, 'empty': empty_serializer.data, 'counts': len(serializer.data)})

    # Create a new record
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            detail_name = self.kwargs['detail_name']
            # important to use ** below
            detailModelMap[detail_name].objects.create(**serializer.validated_data)
            print('\nIn MastersListCreateAPIView -> create()\nCreate a new record successfully!!!')
            print('The valid data is ', serializer.validated_data)
            print('\n')
            # return HttpResponseRedirect(reverse('api:records_create_list', args=[db_name, master_name], request=request))
            return Response(serializer.validated_data)
        else:
            Response('Master could not be created with received data.')


class DetailsAPIView(RetrieveUpdateDestroyAPIView):
    # serializer_class = PostSerializer
    lookup_url_kwarg = 'detail_id'

    # renderer_classes = [TemplateHTMLRenderer]

    def get_serializer_class(self):
        detail_name = self.kwargs['detail_name']
        return detailSerializerMap[detail_name]

    def get_queryset(self):
        detail_name = self.kwargs['detail_name']

        return detailModelMap[detail_name].objects.all()

    # Retrieve a single record
    def retrieve(self, request, *args, **kwargs):
        detail_name = self.kwargs['detail_name']
        queryset = detailModelMap[detail_name].objects.all()
        counts = queryset.count()
        print('The queryset is ', queryset)
        user = get_object_or_404(queryset, pk=self.kwargs['detail_id'])
        print('The user is ', user)
        serializer = detailSerializerMap[detail_name](user)
        return Response({'serializer': serializer.data, 'counts': counts})

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        print('In update, request data is', request.data)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if not serializer.is_valid():
            print(serializer.errors)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        # return HttpResponseRedirect(reverse('api:records_create_list', args=[db_name, master_name], request=request))
        return Response({'serializer': serializer.data})

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    # Update completely
    def put(self, request, *args, **kwargs):
        print('Call put here')
        return self.update(request, *args, **kwargs)

    # Update partially
    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    # Delete
    def delete(self, request, *args, **kwargs):
        print('delete successfully')
        return self.destroy(request, *args, **kwargs)


class FileUploadView(APIView):
    # parser_classes = (FileUploadParser,)

    def post(self, request, format=None):
        file_obj = request.data['file']
        file_path = settings.MEDIA_ROOT + file_obj.name
        print('FILE!!!', file_obj)
        destination = open(file_path, 'wb+')
        for chunk in file_obj.chunks():
            destination.write(chunk)
            destination.close()

        return Response(status=204)


class LoginView(APIView):

    def post(self, request, *args, **kwargs):
        if not request.data:
            return Response({'Error': "Please provide username/password"}, status="400")

        userid = request.data['userid']
        # password = request.data['password']
        try:
            user = Employees.objects.get(emp_no=userid)
        except Employees.DoesNotExist:
            return Response({'Error': "Invalid username/password"}, status="400")
        if user:
            payload = {
                'emp_no': user.emp_no,
                'birth_date': str(user.birth_date),
                'name': user.first_name + ' ' + user.last_name,
            }
            print(payload)
            jwt_token = {'token': jwt.encode(payload, "SECRET_KEY")}

            return Response({'jwt_token': jwt_token})
        else:
            return Response(
                json.dumps({'Error': "Invalid credentials"}),
                status=400,
                content_type="application/json"
            )
