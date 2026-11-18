from django.db import connection, DatabaseError
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, BasePermission
from rest_framework.response import Response

class IsAdministrator(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return bool(user.is_authenticated and user.is_active and (user.is_superuser or user.role == 'administrator'))

@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def health(request):
    return Response({'status': 'ok'})

@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def readiness(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute('SELECT 1')
    except DatabaseError:
        return Response({'status': 'unavailable'}, status=503)
    return Response({'status': 'ready'})

@api_view(['GET'])
def current_user(request):
    return Response({'username': request.user.username, 'role': request.user.role})

@api_view(['GET'])
@permission_classes([IsAdministrator])
def administrator_status(request):
    return Response({'status': 'ok', 'module': 'administration'})
