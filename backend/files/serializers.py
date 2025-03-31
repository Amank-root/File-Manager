from rest_framework import serializers
from .models import File

class FileSerializer(serializers.ModelSerializer):
    file_size_display = serializers.SerializerMethodField()
    file_type_display = serializers.SerializerMethodField()
    
    class Meta:
        model = File
        fields = ['id', 'filename', 'file', 'file_type', 'file_type_display', 'upload_date', 'size', 'file_size_display']
        read_only_fields = ['id', 'filename', 'file_type', 'upload_date', 'size', 'file_size_display', 'file_type_display']
    
    def get_file_size_display(self, obj):
        """Return human-readable file size."""
        size_bytes = obj.size
        if size_bytes < 1024:
            return f"{size_bytes} bytes"
        elif size_bytes < 1024 * 1024:
            return f"{size_bytes / 1024:.1f} KB"
        elif size_bytes < 1024 * 1024 * 1024:
            return f"{size_bytes / (1024 * 1024):.1f} MB"
        else:
            return f"{size_bytes / (1024 * 1024 * 1024):.1f} GB"
    
    def get_file_type_display(self, obj):
        """Return display name for file type."""
        return obj.get_file_type_display() 