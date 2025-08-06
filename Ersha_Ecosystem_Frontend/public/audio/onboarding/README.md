# Onboarding Audio Files

This directory contains audio files for the voice-guided onboarding tour.

## Required Audio Files

### English Audio Files
- `welcome.mp3` - Welcome message and introduction
- `verification.mp3` - Explanation of verification process
- `marketplace.mp3` - Introduction to marketplace features
- `post-product.mp3` - How to post products
- `orders.mp3` - Managing orders and logistics
- `weather.mp3` - Weather information features
- `advisory.mp3` - Expert advisory services
- `completion.mp3` - Tour completion message

### Amharic Audio Files
- `welcome-am.mp3` - Welcome message in Amharic
- `verification-am.mp3` - Verification explanation in Amharic
- `marketplace-am.mp3` - Marketplace introduction in Amharic
- `post-product-am.mp3` - Product posting guide in Amharic
- `orders-am.mp3` - Order management in Amharic
- `weather-am.mp3` - Weather features in Amharic
- `advisory-am.mp3` - Advisory services in Amharic
- `completion-am.mp3` - Completion message in Amharic

## Audio Specifications

- **Format**: MP3
- **Quality**: 128kbps or higher
- **Duration**: 10-30 seconds per file
- **Language**: Clear, slow-paced speech
- **Tone**: Friendly and encouraging
- **Background**: Minimal or no background music

## Recording Guidelines

1. **Clear Pronunciation**: Speak slowly and clearly
2. **Simple Language**: Use simple, everyday words
3. **Cultural Sensitivity**: Consider local dialects and expressions
4. **Encouraging Tone**: Make users feel welcome and capable
5. **Consistent Voice**: Use the same voice actor for all files

## Fallback System

If audio files are not available, the system will automatically fall back to:
1. Text-to-speech using the browser's speech synthesis
2. Visual text display with highlighting
3. Keyboard navigation support

## File Naming Convention

- English: `[step-name].mp3`
- Amharic: `[step-name]-am.mp3`
- Example: `welcome.mp3`, `welcome-am.mp3`

## Integration

The audio files are automatically loaded by the OnboardingContext based on the user's language preference. The system will:

1. Check for the appropriate audio file
2. Play the audio if available
3. Fall back to text-to-speech if not available
4. Display visual text as a final fallback

## Accessibility Notes

- All audio content is also available as text
- Users can control audio playback (play, pause, repeat)
- Volume controls are available
- Audio can be disabled entirely
- Visual indicators show when audio is playing 