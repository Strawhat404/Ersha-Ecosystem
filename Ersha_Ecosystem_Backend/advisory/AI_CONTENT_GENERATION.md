# AI Content Generation for Agricultural Advisory

This document describes the AI-powered content generation feature that creates personalized agricultural advisory reports using Google's Gemini API.

## Overview

The AI content generation system leverages Google's Gemini Pro model to create comprehensive, personalized agricultural advisory reports based on user-provided data including:

- Current weather conditions
- Crop information and farming activities
- Market research and pricing data
- Sales analysis and performance metrics
- Logistics and supply chain information
- Recent agricultural news and policy updates

## Features

### 1. Multi-Step Data Collection
The system collects comprehensive data through a user-friendly 3-step process:

**Step 1: Weather Information**
- Farm location
- Temperature, humidity, rainfall
- Wind speed and weather forecast

**Step 2: Crop Information**
- Crop type and variety
- Planting date and growth stage
- Area under cultivation
- Expected yield

**Step 3: Market & Sales Data**
- Current market prices
- Demand and supply analysis
- Sales performance metrics
- Revenue and pricing trends

### 2. AI-Powered Content Generation
- Uses Google Gemini Pro for natural language generation
- Creates structured, professional PDF reports
- Includes actionable recommendations
- Tailored to Ethiopian agricultural context

### 3. Report Structure
Generated reports include:

- **Executive Summary**: Overview of key findings
- **Weather Analysis**: Farming recommendations based on current conditions
- **Crop-Specific Guidance**: Detailed advice for specific crops
- **Market Analysis**: Pricing strategy and market insights
- **Sales Performance**: Analysis of recent sales data
- **Logistics Recommendations**: Supply chain optimization advice
- **Policy & News Impact**: Recent developments affecting agriculture
- **Action Items**: Specific next steps for farmers

### 4. PDF Generation
- Professional formatting with ReportLab
- Branded with Ersha Ecosystem styling
- Includes generation timestamp and metadata
- Optimized for readability and printing

## Technical Implementation

### Backend Components

#### 1. AIContentGenerator Service (`advisory/services.py`)
```python
class AIContentGenerator:
    def __init__(self):
        # Initialize Gemini API client
        
    def generate_agricultural_report(self, user_data):
        # Main method for generating reports
        
    def _build_agricultural_prompt(self, user_data):
        # Construct comprehensive prompt for Gemini
        
    def _parse_ai_response(self, response_text):
        # Parse and structure AI response
        
    def _generate_pdf(self, content_data, user_data):
        # Create professional PDF report
        
    def _save_pdf(self, pdf_buffer, title):
        # Save PDF to storage and return URL
```

#### 2. Enhanced Resource Model
The Resource model has been extended with AI-specific fields:

```python
class Resource(models.Model):
    # ... existing fields ...
    
    # AI Generation fields
    is_ai_generated = models.BooleanField(default=False)
    ai_generation_data = models.JSONField(default=dict, blank=True)
    ai_model_used = models.CharField(max_length=100, blank=True)
    generated_for_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    generation_timestamp = models.DateTimeField(null=True, blank=True)
```

#### 3. API Endpoints
New endpoints added to ResourceViewSet:

- `POST /api/advisory/resources/generate_ai_content/` - Generate new AI content
- `GET /api/advisory/resources/my_ai_resources/` - Get user's AI-generated resources
- `GET /api/advisory/resources/ai_generated/` - Get all AI-generated resources

### Frontend Components

#### 1. AIGenerationModal (`AIGenerationModal.jsx`)
- Multi-step form for data collection
- Real-time validation and error handling
- Progress indicators and loading states
- Success feedback and download options

#### 2. Enhanced Advisory Component
- AI generation section with prominent call-to-action
- Visual indicators for AI-generated resources
- Integration with existing resource management

## Setup and Configuration

### 1. Environment Variables
Add the following to your `.env` file:

```env
# AI Content Generation
GEMINI_API_KEY=your-gemini-api-key-here
```

### 2. Dependencies
The following packages are required:

```txt
google-generativeai==0.3.2
reportlab==4.0.7
```

### 3. Database Migration
Run the following commands:

```bash
python manage.py makemigrations advisory
python manage.py migrate
```

## Usage

### 1. User Flow
1. User navigates to Advisory → Resources section
2. Clicks "Generate Report" button
3. Completes 3-step data collection form
4. AI generates personalized report
5. User downloads PDF report
6. Report appears in resources list with AI indicator

### 2. API Usage
```javascript
// Generate AI content
const response = await fetch('/api/advisory/resources/generate_ai_content/', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    weather: { /* weather data */ },
    crop: { /* crop data */ },
    market: { /* market data */ },
    sales: { /* sales data */ },
    logistics: { /* logistics data */ },
    news: [ /* news items */ ]
  })
});

const generatedResource = await response.json();
```

## Security and Privacy

### 1. Authentication
- All AI generation endpoints require authentication
- User data is associated with authenticated user
- Generated resources are linked to user account

### 2. Data Handling
- User data is stored securely in database
- AI generation data is preserved for audit trail
- No sensitive data is logged or exposed

### 3. Rate Limiting
- Consider implementing rate limiting for AI generation
- Monitor API usage and costs
- Set appropriate limits per user

## Error Handling

### 1. Common Errors
- **Missing API Key**: Ensure GEMINI_API_KEY is set
- **Invalid Data**: Validate required fields
- **API Limits**: Handle Gemini API rate limits
- **PDF Generation**: Handle file creation errors

### 2. User Feedback
- Clear error messages for users
- Loading states during generation
- Success confirmation with download options

## Monitoring and Analytics

### 1. Usage Tracking
- Track number of AI-generated reports
- Monitor generation success rates
- Analyze user engagement with AI features

### 2. Performance Metrics
- Generation time tracking
- PDF file size monitoring
- API response time analysis

## Future Enhancements

### 1. Advanced Features
- Multi-language support (Amharic, Oromo)
- Image generation for reports
- Historical trend analysis
- Integration with weather APIs

### 2. Personalization
- User preference learning
- Customizable report templates
- Seasonal recommendations
- Crop-specific optimizations

### 3. Integration
- Weather API integration
- Market data feeds
- News API integration
- Logistics platform integration

## Troubleshooting

### 1. Common Issues
- **Gemini API Errors**: Check API key and quotas
- **PDF Generation Failures**: Verify ReportLab installation
- **Storage Issues**: Check file permissions and disk space
- **Memory Issues**: Monitor memory usage during generation

### 2. Debug Mode
Enable debug logging for AI generation:

```python
import logging
logging.getLogger('advisory.services').setLevel(logging.DEBUG)
```

## Support

For issues related to AI content generation:

1. Check the logs for detailed error messages
2. Verify environment configuration
3. Test API connectivity
4. Review user data format
5. Contact development team with specific error details

## License

This feature is part of the Ersha Ecosystem and follows the same licensing terms as the main project. 