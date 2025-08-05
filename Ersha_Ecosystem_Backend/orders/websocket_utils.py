from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json

def send_notification_to_user(user_id, notification_data):
    """
    Send a WebSocket notification to a specific user
    
    Args:
        user_id: ID of the user to send the notification to
        notification_data: Dictionary containing notification data
    """
    channel_layer = get_channel_layer()
    room_name = f'notifications_{user_id}'
    
    async_to_sync(channel_layer.group_send)(
        room_name,
        {
            'type': 'send_notification',
            'notification': notification_data
        }
    )

def send_notification_to_farmer(farmer_id, notification_data):
    """
    Send a WebSocket notification to a specific farmer
    
    Args:
        farmer_id: ID of the farmer to send the notification to
        notification_data: Dictionary containing notification data
    """
    channel_layer = get_channel_layer()
    room_name = f'farmer_{farmer_id}'
    
    async_to_sync(channel_layer.group_send)(
        room_name,
        {
            'type': 'send_notification',
            'notification': notification_data
        }
    )

def broadcast_notification(notification_data, group_name='notifications'):
    """
    Broadcast a notification to all users in a specific group
    
    Args:
        notification_data: Dictionary containing notification data
        group_name: Name of the group to broadcast to (default: 'notifications')
    """
    channel_layer = get_channel_layer()
    
    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            'type': 'send_notification',
            'notification': notification_data
        }
    )
