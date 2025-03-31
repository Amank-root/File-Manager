from django.contrib import admin
from .models import File

class FileAdmin(admin.ModelAdmin):
    list_display = ('filename', 'user', 'file_type', 'upload_date', 'size')
    list_filter = ('file_type', 'upload_date')
    search_fields = ('filename', 'user__email')
    readonly_fields = ('upload_date', 'size', 'file_type')

admin.site.register(File, FileAdmin)
