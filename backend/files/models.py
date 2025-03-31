from django.db import models
from django.utils import timezone
from users.models import User
import os

def user_directory_path(instance, filename):
    # File will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return f'user_{instance.user.id}/{filename}'

class File(models.Model):
    FILE_TYPES = (
        ('pdf', 'PDF'),
        ('excel', 'Excel'),
        ('txt', 'Text'),
        ('word', 'Word'),
        ('other', 'Other'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='files')
    file = models.FileField(upload_to=user_directory_path)
    filename = models.CharField(max_length=255)
    file_type = models.CharField(max_length=10, choices=FILE_TYPES, default='other')
    upload_date = models.DateTimeField(default=timezone.now)
    size = models.BigIntegerField(default=0)  # in bytes
    
    def __str__(self):
        return f"{self.filename} - {self.user.email}"
    
    def save(self, *args, **kwargs):
        # Set filename and file type based on the uploaded file
        if not self.filename and self.file:
            self.filename = os.path.basename(self.file.name)
        
        # Set file type based on extension
        if self.file:
            ext = os.path.splitext(self.file.name)[1].lower()
            if ext == '.pdf':
                self.file_type = 'pdf'
            elif ext in ['.xlsx', '.xls']:
                self.file_type = 'excel'
            elif ext == '.txt':
                self.file_type = 'txt'
            elif ext in ['.doc', '.docx']:
                self.file_type = 'word'
            else:
                self.file_type = 'other'
                
        # Set file size
        if self.file and hasattr(self.file, 'size'):
            self.size = self.file.size
            
        super().save(*args, **kwargs)
