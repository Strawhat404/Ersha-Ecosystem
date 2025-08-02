# AI Course Generation for Agricultural Education

This document describes the AI-powered course generation feature that creates personalized agricultural learning courses using Google's Gemini API.

## Overview

The AI course generation system leverages Google's Gemini Pro model to create comprehensive, educational agricultural courses based on user data from existing sources including:

- User profile and farming information
- User's products and farming activities
- Sales and order history
- Weather data for user's region
- Recent agricultural news
- User's learning preferences and interactions

## Features

### 1. Personalized Course Recommendations
The system analyzes user data to provide personalized course recommendations based on:
- **Farming Profile**: Region, farm size, farming activities
- **Product Categories**: Types of crops/products the user farms
- **Learning History**: Previous course interactions and preferences
- **Current Context**: Weather conditions and market trends

### 2. AI Course Generation
Users can generate custom courses by:
- Selecting from recommended course topics
- Creating custom course titles and descriptions
- The system automatically gathers all relevant user data

### 3. Comprehensive Course Content
Each generated course includes:
- **Course Overview**: Introduction and learning objectives
- **Structured Modules**: 3 main learning modules with lessons
- **Practical Exercises**: Hands-on activities and assessments
- **Additional Resources**: References and further reading
- **Ethiopian Context**: Localized agricultural practices and examples

### 4. Weekly Recommendation Updates
Course recommendations are updated weekly based on:
- User interactions with existing courses
- Changes in farming activities
- Seasonal agricultural patterns
- Market and weather changes

## Technical Implementation

### Backend Components

#### 1. UserDataService (`advisory/services.py`)
```python
class UserDataService:
    def get_user_profile_data(self)
    def get_user_products(self)
    def get_user_sales_data(self)
    def get_user_weather_data(self)
    def get_relevant_news(self)
    def get_user_interaction_data(self)
    def get_comprehensive_user_data(self)
```

**Data Sources:**
- `users.models.User` and `users.models.Profile`
- `marketplace.models.Product`
- `orders.models.Order`
- `weather.models.WeatherData`
- `news.models.NewsArticle`
- `advisory.models.Course` and `advisory.models.Resource`

#### 2. AIContentGenerator (`advisory/services.py`)
```python
class AIContentGenerator:
    def generate_agricultural_course(self, user_data, course_title, course_description)
    def _build_course_prompt(self, user_data, course_title, course_description)
    def _parse_ai_response(self, response_text)
    def _generate_course_pdf(self, course_data, user_data)
    def _save_pdf(self, pdf_buffer, title)
```

#### 3. Course Model (`advisory/models.py`)
Enhanced with AI generation fields:
```python
class Course(models.Model):
    # AI Generation fields
    is_ai_generated = models.BooleanField(default=False)
    ai_generation_data = models.JSONField(default=dict, blank=True)
    ai_model_used = models.CharField(max_length=100, blank=True)  # e.g., "gemini-2.0-flash"
    generated_for_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='ai_generated_courses')
    generation_timestamp = models.DateTimeField(null=True, blank=True)
    download_url = models.URLField(blank=True)
    file_size = models.CharField(max_length=20, blank=True)
    file_size_bytes = models.BigIntegerField(null=True, blank=True)
```

#### 4. CourseViewSet (`advisory/views.py`)
New API endpoints:
```python
@action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
def generate_ai_course(self, request)

@action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
def get_course_recommendations(self, request)

@action(detail=False, methods=['get'])
def ai_generated(self, request)

@action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
def my_ai_courses(self, request)
```

### Frontend Components

#### 1. CourseGenerationModal (`CourseGenerationModal.jsx`)
- Displays personalized course recommendations
- Shows user farming profile summary
- Allows custom course creation
- Handles course generation and download

#### 2. Advisory Component (`Advisory.jsx`)
- New "AI Courses" tab
- Course grid display with AI generation indicators
- Integration with course generation modal

## API Endpoints

### Course Generation
```
POST /api/advisory/courses/generate_ai_course/
Content-Type: application/json
Authorization: Bearer <token>

{
    "title": "Advanced Maize Farming Techniques",
    "description": "Learn advanced techniques for growing maize in Ethiopian climate conditions"
}
```

### Course Recommendations
```
GET /api/advisory/courses/get_course_recommendations/
Authorization: Bearer <token>

Response:
{
    "recommendations": [
        {
            "title": "Advanced Vegetable Farming Techniques",
            "description": "Learn advanced techniques for growing vegetables...",
            "category": "farming",
            "difficulty": "intermediate",
            "duration": "90 mins",
            "reason": "Based on your vegetable farming activities"
        }
    ],
    "user_data_summary": {
        "region": "Oromia",
        "farm_size": "5.0",
        "product_categories": ["vegetables", "grains"],
        "total_products": 8
    }
}
```

### AI-Generated Courses
```
GET /api/advisory/courses/ai_generated/
GET /api/advisory/courses/my_ai_courses/
```

## Course Structure

Each generated course follows this structure:

1. **Course Overview**
   - Introduction and context
   - Learning objectives
   - Course prerequisites

2. **Module 1: [Topic]**
   - Lesson 1.1: [Specific topic]
   - Lesson 1.2: [Specific topic]
   - Practical examples based on user's farming context

3. **Module 2: [Topic]**
   - Lesson 2.1: [Specific topic]
   - Lesson 2.2: [Specific topic]
   - Ethiopian agricultural context

4. **Module 3: [Topic]**
   - Lesson 3.1: [Specific topic]
   - Lesson 3.2: [Specific topic]
   - Market and economic considerations

5. **Practical Exercises**
   - Hands-on activities
   - Assessment questions
   - Real-world applications

6. **Additional Resources**
   - Further reading materials
   - Local agricultural contacts
   - Government resources

## Data Privacy and Security

- **No New Data Collection**: The system only uses existing user data
- **User Consent**: Users must be authenticated to generate courses
- **Data Retention**: AI generation data is stored for course personalization
- **Secure Storage**: All user data is encrypted and securely stored

## Configuration

### Environment Variables
```bash
# Required for AI course generation
GEMINI_API_KEY=your-gemini-api-key-here
```

### Dependencies
```python
# requirements.txt
google-generativeai==0.3.2
reportlab==4.0.7
```

## Usage Examples

### 1. Generate Course from Recommendation
1. User opens the Advisory section
2. Clicks on "AI Courses" tab
3. Clicks "Generate Course" button
4. Selects a recommended course topic
5. System generates personalized course
6. User downloads the PDF course

### 2. Create Custom Course
1. User opens course generation modal
2. Enters custom course title and description
3. System gathers user data automatically
4. AI generates course content
5. User downloads personalized course

### 3. View Learning Progress
1. User can view all their AI-generated courses
2. Track course views and interactions
3. System updates recommendations based on usage

## Future Enhancements

1. **Interactive Learning**: Add quizzes and assessments within courses
2. **Video Integration**: Include video content in courses
3. **Community Features**: Allow users to share and rate courses
4. **Mobile Optimization**: Optimize course viewing for mobile devices
5. **Offline Access**: Enable offline course downloads
6. **Multi-language Support**: Generate courses in local languages

## Troubleshooting

### Common Issues

1. **Course Generation Fails**
   - Check GEMINI_API_KEY configuration
   - Verify user has sufficient profile data
   - Check API rate limits

2. **No Recommendations**
   - Ensure user has farming profile data
   - Check if user has product listings
   - Verify weather data availability

3. **PDF Download Issues**
   - Check file storage configuration
   - Verify file permissions
   - Check network connectivity

### Error Handling

The system includes comprehensive error handling:
- API failures are gracefully handled
- User-friendly error messages
- Fallback content generation
- Logging for debugging

## Support

For technical support or questions about the AI course generation feature, please refer to the development team or create an issue in the project repository. 