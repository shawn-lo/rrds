from django.conf.urls import include, url
from django.views.decorators.csrf import csrf_exempt
from api.views import (
    DbsListAPIView,
    TablesListAPIView,
    MastersListCreateAPIView,
    MasterAPIView,
    DetailsListCreateAPIView,
    DetailsAPIView,
    FileUploadView,
    LoginView,
)

app_name = 'api'

urlpatterns = [
    # /dbs
    url(r'^dbs$', DbsListAPIView.as_view(), name='dbs-list'),
    # /dbs/[db_name]/tbs
    url(r'^dbs/(?P<db_name>\w+)$', TablesListAPIView.as_view(), name='tbs-list'),

    # masters list and details
    # /dbs/[db_name]/tbs/[master_name]/records
    url(r'^dbs/(?P<db_name>\w+)/(?P<master_name>\w+)$', MastersListCreateAPIView.as_view(), name='master_create_list'),
    # /dbs/[db_name]/tbs/[master_name]/[record_id]
    url(r'^dbs/(?P<db_name>\w+)/(?P<master_name>\w+)/(?P<master_id>\d+)$', MasterAPIView.as_view(), name='master_crud'),

    # details list and details
    # /dbs/[db_name]/[master_name]/[record_id]/[detail_name]
    url(r'^dbs/(?P<db_name>\w+)/(?P<master_name>\w+)/(?P<master_id>\d+)/(?P<detail_name>\w+)$',
        DetailsListCreateAPIView.as_view(), name='detail_create_list'),
    # /dbs/[db_name]/[master_name]/[record_id]/[detail_name]/[detail_id]
    url(r'^dbs/(?P<db_name>\w+)/(?P<master_name>\w+)/(?P<master_id>\d+)/(?P<detail_name>\w+)/(?P<detail_id>\d+)$',
        DetailsAPIView.as_view(), name='detail_crud'),

    # /dbs/[db_name]/[master_name]/[master_id]/upload_files/[file_name]
    url(r'^docs$',
        FileUploadView.as_view(), name='file_upload'),

    # /login
    url(r'^login$', LoginView.as_view(), name='login'),
]
