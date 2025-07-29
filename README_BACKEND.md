# Ersha Ecosystem - Django Backend

## Overview

This is the Django backend for the Ersha Ecosystem agricultural advisory system. It provides comprehensive APIs for expert consultation, advisory content, training courses, and downloadable resources.

## Features

### Advisory System Components

1. **Expert Consultation**
   - Expert profiles with ratings and availability
   - Consultation booking and management
   - Multi-language support (Amharic, English, Oromo)

2. **Advisory Content**
   - Comprehensive agricultural guides
   - Categorized by crop type, region, season, difficulty
   - Like and bookmark functionality
   - View tracking and analytics

3. **Training Courses**
   - Structured learning modules
   - Free and paid courses
   - Difficulty levels and duration tracking
   - Rating and review system

4. **Resources**
   - Downloadable PDFs, tools, and guides
   - File size and download tracking
   - Categorized resources (health, tools, planning, etc.)

## Technology Stack

- **Framework**: Django 5.2.4
- **API**: Django REST Framework 3.16.0
- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: Django built-in authentication
- **CORS**: django-cors-headers
- **Filtering**: django-filter

## Project Structure

```
Ersha-Ecosystem/
├── advisory/                    # Advisory app
│   ├── models.py               # Database models
│   ├── serializers.py          # API serializers
│   ├── views.py                # API views
│   ├── urls.py                 # URL routing
│   ├── admin.py                # Admin interface
│   └── management/             # Management commands
│       └── commands/
│           └── populate_advisory_data.py
├── ersha_backend/              # Main project
│   ├── settings.py             # Django settings
│   ├── urls.py                 # Main URL configuration
│   └── wsgi.py                 # WSGI configuration
├── manage.py                   # Django management script
└── README_BACKEND.md           # This file
```

## Installation & Setup

### Prerequisites

- Python 3.8+
- pip
- virtualenv (recommended)

### Installation Steps

1. **Clone the repository**
   ```bash
   cd Ersha-Ecosystem
   ```

2. **Create virtual environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations**
   ```bash
   python manage.py migrate
   ```

5. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

6. **Populate sample data**
   ```bash
   python manage.py populate_advisory_data
   ```

7. **Run development server**
   ```bash
   python manage.py runserver
   ```

## API Endpoints

### Base URL
```
http://localhost:8000/api/advisory/
```

### Expert Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/experts/` | GET | List all experts |
| `/experts/{id}/` | GET | Get expert details |
| `/experts/available/` | GET | Get available experts only |
| `/experts/featured/` | GET | Get featured experts only |

**Query Parameters:**
- `specialization`: Filter by specialization
- `availability`: Filter by availability status
- `region`: Filter by region
- `verified`: Filter verified experts
- `featured`: Filter featured experts
- `search`: Search in name, specialization, bio
- `ordering`: Sort by rating, experience_years, consultation_price, created_at

### Advisory Content Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/advisory-content/` | GET | List all advisory content |
| `/advisory-content/{id}/` | GET | Get content details |
| `/advisory-content/featured/` | GET | Get featured content |
| `/advisory-content/verified/` | GET | Get verified content |
| `/advisory-content/{id}/like/` | POST | Like/unlike content |
| `/advisory-content/{id}/bookmark/` | POST | Bookmark/unbookmark content |

**Query Parameters:**
- `category`: Filter by category
- `crop_type`: Filter by crop type
- `region`: Filter by region
- `season`: Filter by season
- `difficulty`: Filter by difficulty level
- `featured`: Filter featured content
- `verified`: Filter verified content
- `search`: Search in title, content, excerpt, author_name, tags
- `ordering`: Sort by published_at, views, likes, bookmarks, created_at

### Course Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/courses/` | GET | List all courses |
| `/courses/{id}/` | GET | Get course details |
| `/courses/featured/` | GET | Get featured courses |
| `/courses/free/` | GET | Get free courses only |

**Query Parameters:**
- `category`: Filter by category
- `difficulty`: Filter by difficulty level
- `is_free`: Filter free/paid courses
- `featured`: Filter featured courses
- `search`: Search in title, description, author_name
- `ordering`: Sort by published_at, views, rating, price, duration_minutes

### Resource Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/resources/` | GET | List all resources |
| `/resources/{id}/` | GET | Get resource details |
| `/resources/{id}/download/` | POST | Record download |
| `/resources/featured/` | GET | Get featured resources |

**Query Parameters:**
- `resource_type`: Filter by resource type
- `category`: Filter by category
- `featured`: Filter featured resources
- `search`: Search in title, description
- `ordering`: Sort by downloads, created_at, file_size_bytes

### User Interaction Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/bookmarks/` | GET | Get user bookmarks |
| `/bookmarks/` | POST | Create bookmark |
| `/bookmarks/{id}/` | DELETE | Remove bookmark |
| `/likes/` | GET | Get user likes |
| `/likes/` | POST | Create like |
| `/likes/{id}/` | DELETE | Remove like |
| `/consultations/` | GET | Get user consultations |
| `/consultations/` | POST | Create consultation request |
| `/consultations/{id}/cancel/` | POST | Cancel consultation |

## Data Models

### Expert Model
```python
{
    "id": "uuid",
    "name": "string",
    "specialization": "string",
    "experience_years": "integer",
    "rating": "decimal",
    "bio": "text",
    "availability": "available|busy|unavailable",
    "consultation_price": "decimal",
    "languages": ["array"],
    "certifications": ["array"],
    "profile_image": "url",
    "region": "string",
    "verified": "boolean",
    "featured": "boolean"
}
```

### AdvisoryContent Model
```python
{
    "id": "uuid",
    "title": "string",
    "content": "text",
    "excerpt": "text",
    "category": "string",
    "crop_type": "string",
    "region": "string",
    "season": "dry|rainy|all",
    "difficulty": "beginner|intermediate|advanced",
    "read_time": "integer",
    "author_name": "string",
    "author_role": "string",
    "tags": ["array"],
    "images": ["array"],
    "video_url": "url",
    "download_url": "url",
    "featured": "boolean",
    "verified": "boolean",
    "views": "integer",
    "likes": "integer",
    "bookmarks": "integer",
    "is_bookmarked": "boolean",
    "is_liked": "boolean"
}
```

### Course Model
```python
{
    "id": "uuid",
    "title": "string",
    "description": "text",
    "category": "string",
    "difficulty": "beginner|intermediate|advanced",
    "duration": "string",
    "duration_minutes": "integer",
    "modules": ["array"],
    "author_name": "string",
    "price": "decimal",
    "is_free": "boolean",
    "image": "url",
    "views": "integer",
    "rating": "decimal",
    "featured": "boolean"
}
```

### Resource Model
```python
{
    "id": "uuid",
    "title": "string",
    "description": "text",
    "resource_type": "string",
    "category": "string",
    "file_url": "url",
    "file_size": "string",
    "file_size_bytes": "integer",
    "downloads": "integer",
    "image": "url",
    "featured": "boolean"
}
```

## Authentication

The API uses Django's built-in authentication system. For protected endpoints:

1. **Session Authentication**: Use Django's session-based authentication
2. **Token Authentication**: Can be extended with DRF Token Authentication
3. **Permissions**: 
   - `IsAuthenticatedOrReadOnly`: Most endpoints
   - `IsAuthenticated`: User-specific endpoints (bookmarks, likes, consultations)

## Filtering & Search

All list endpoints support:

- **Filtering**: Use query parameters to filter results
- **Search**: Full-text search across relevant fields
- **Ordering**: Sort by various fields
- **Pagination**: 20 items per page by default

## Admin Interface

Access the Django admin at: `http://localhost:8000/admin/`

Features:
- Complete CRUD operations for all models
- Advanced filtering and search
- Bulk operations
- Export functionality
- User-friendly interface

## Development

### Running Tests
```bash
python manage.py test advisory
```

### Creating Migrations
```bash
python manage.py makemigrations advisory
```

### Applying Migrations
```bash
python manage.py migrate
```

### Populating Sample Data
```bash
python manage.py populate_advisory_data
```

## Production Deployment

### Environment Variables
Create a `.env` file:
```
DEBUG=False
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=your-domain.com
DATABASE_URL=postgresql://user:password@localhost/dbname
```

### Database
For production, use PostgreSQL:
```bash
pip install psycopg2-binary
```

### Static Files
```bash
python manage.py collectstatic
```

### Security
- Set `DEBUG=False`
- Use strong `SECRET_KEY`
- Configure `ALLOWED_HOSTS`
- Enable HTTPS
- Set up proper CORS settings

## API Documentation

### Example Requests

**Get all experts:**
```bash
curl -X GET "http://localhost:8000/api/advisory/experts/"
```

**Get featured advisory content:**
```bash
curl -X GET "http://localhost:8000/api/advisory/advisory-content/featured/"
```

**Like an advisory content:**
```bash
curl -X POST "http://localhost:8000/api/advisory/advisory-content/{id}/like/" \
  -H "Authorization: Session {session_id}"
```

**Search courses:**
```bash
curl -X GET "http://localhost:8000/api/advisory/courses/?search=organic&difficulty=beginner"
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is part of the Ersha Ecosystem.

## Support

For support and questions, please contact the development team. 