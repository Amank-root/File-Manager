from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Address

class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'is_staff', 'is_active')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'phone_number')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'password1', 'password2'),
        }),
    )

class AddressAdmin(admin.ModelAdmin):
    list_display = ('user', 'address_type', 'city', 'country', 'is_default')
    list_filter = ('address_type', 'is_default')
    search_fields = ('user__email', 'city', 'country')

admin.site.register(User, CustomUserAdmin)
admin.site.register(Address, AddressAdmin)
