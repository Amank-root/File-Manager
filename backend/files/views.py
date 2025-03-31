from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import FileResponse
from django.shortcuts import get_object_or_404
from .models import File
from .serializers import FileSerializer
from django.db.models import Count
from collections import defaultdict
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your views here.

class FileUploadView(generics.CreateAPIView):
    serializer_class = FileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class FileListView(generics.ListAPIView):
    serializer_class = FileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return File.objects.filter(user=self.request.user).order_by('-upload_date')

class FileDownloadView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, file_id):
        file_obj = get_object_or_404(File, id=file_id, user=request.user)
        return FileResponse(file_obj.file, as_attachment=True, filename=file_obj.filename)

class FileDeleteView(generics.DestroyAPIView):
    serializer_class = FileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return File.objects.filter(user=self.request.user)

class FileDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # Total files uploaded by user
        total_files = File.objects.filter(user=user).count()
        
        # Breakdown of file types
        file_types = File.objects.filter(user=user).values('file_type').annotate(count=Count('file_type'))
        file_type_breakdown = {item['file_type']: item['count'] for item in file_types}
        
        # Add display names for file types
        file_type_display = {}
        for file_type, count in file_type_breakdown.items():
            display_name = next((display for code, display in File.FILE_TYPES if code == file_type), file_type)
            file_type_display[display_name] = count
        
        return Response({
            'total_files': total_files,
            'file_type_breakdown': file_type_display,
        })

class GlobalDashboardView(APIView):
    permission_classes = [permissions.IsAdminUser]
    
    def get(self, request):
        # Total files in system
        total_files = File.objects.count()
        
        # Breakdown of file types across all users
        file_types = File.objects.values('file_type').annotate(count=Count('file_type'))
        file_type_breakdown = {item['file_type']: item['count'] for item in file_types}
        
        # Add display names for file types
        file_type_display = {}
        for file_type, count in file_type_breakdown.items():
            display_name = next((display for code, display in File.FILE_TYPES if code == file_type), file_type)
            file_type_display[display_name] = count
        
        # Files per user
        files_per_user = File.objects.values('user__email').annotate(count=Count('id'))
        user_files = {item['user__email']: item['count'] for item in files_per_user}
        
        return Response({
            'total_files': total_files,
            'file_type_breakdown': file_type_display,
            'files_per_user': user_files
        })
