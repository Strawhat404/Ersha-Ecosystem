import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError

User = get_user_model()

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = None
        self.room_group_name = None
        
        # Get token from query parameters
        query_string = self.scope.get('query_string', b'').decode('utf-8')
        token = None
        
        # Parse query string to get token
        for param in query_string.split('&'):
            if param.startswith('token='):
                token = param.split('=')[1]
                break
        
        if not token:
            await self.close(code=4001)  # Unauthorized
            return
            
        # Validate token and get user
        try:
            access_token = AccessToken(token)
            self.user = await self.get_user(access_token['user_id'])
            if not self.user:
                raise Exception('User not found')
                
            # Set room group name for this user
            self.room_group_name = f'notifications_{self.user.id}'
            
            # Join room group
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            
            await self.accept()
            
        except (TokenError, Exception) as e:
            print(f'WebSocket connection error: {str(e)}')
            await self.close(code=4001)  # Unauthorized
    
    @database_sync_to_async
    def get_user(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None
    
    async def disconnect(self, close_code):
        # Leave room group
        if hasattr(self, 'room_group_name') and self.room_group_name:
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
    
    # Receive message from WebSocket
    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            if message_type == 'join_farmer_room' and self.user and self.user.user_type == 'farmer':
                # Add to farmer-specific room
                farmer_room = f'farmer_{self.user.id}'
                await self.channel_layer.group_add(
                    farmer_room,
                    self.channel_name
                )
                await self.send(text_data=json.stringify({
                    'type': 'system_message',
                    'message': f'Joined farmer room for user {self.user.id}'
                }))
                
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'error': 'Invalid JSON format'
            }))
    
    # Send notification to WebSocket
    async def send_notification(self, event):
        notification = event['notification']
        
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'notification',
            'notification': notification
        }))
