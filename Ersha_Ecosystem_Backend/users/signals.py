import logging
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, Profile

logger = logging.getLogger(__name__)

# Flag to track if we're in the middle of creating a user
_creating_user = False

# Disabled - profile is now created manually in the serializer
# @receiver(post_save, sender=User)
# def create_user_profile(sender, instance, created, **kwargs):
#     """Create a profile for new users"""
#     global _creating_user
#     if created:
#         _creating_user = True
#         logger.info(f"Creating profile for new user {instance.id} with user_type: {instance.user_type}")
#         try:
#             # Create profile without triggering validation during initial creation
#             profile = Profile(user=instance)
#             profile.save(skip_validation=True)
#             logger.info(f"Profile created successfully for user {instance.id}")
#         except Exception as e:
#             logger.error(f"Error creating profile for user {instance.id}: {e}")
#         finally:
#             _creating_user = False


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """Save the profile when user is saved"""
    global _creating_user
    
    # Skip if we're in the middle of creating a user
    if _creating_user:
        logger.info(f"Skipping profile save during user creation for user {instance.id}")
        return
    
    if hasattr(instance, 'profile'):
        logger.info(f"Saving profile for user {instance.id}")
        instance.profile.save() 