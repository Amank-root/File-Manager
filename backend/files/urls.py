from django.urls import path
from .views import (
    FileUploadView,
    FileListView,
    FileDownloadView,
    FileDeleteView,
    FileDashboardView,
    GlobalDashboardView
)

urlpatterns = [
    path('upload/', FileUploadView.as_view(), name='file_upload'),
    path('list/', FileListView.as_view(), name='file_list'),
    path('download/<int:file_id>/', FileDownloadView.as_view(), name='file_download'),
    path('delete/<int:pk>/', FileDeleteView.as_view(), name='file_delete'),
    path('dashboard/', FileDashboardView.as_view(), name='file_dashboard'),
    path('global-dashboard/', GlobalDashboardView.as_view(), name='global_dashboard'),
] 