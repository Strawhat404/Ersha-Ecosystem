# Ersha Ecosystem Backend

This is the backend service for the Ersha Ecosystem, providing a comprehensive agriculture marketplace platform with Fayda OIDC integration and agricultural advisory services.

## 🚀 Migration Status

✅ **Successfully migrated from `server/` directory to `Ersha_Ecosystem_Backend/`**

✅ **Successfully integrated advisory system from backup backend**

All backend code, configurations, and dependencies have been moved and integrated, including:
- Django project structure
- All Django apps (users, marketplace, orders, core, advisory)
- Docker configurations (docker-compose.yml, Dockerfile)
- Environment configurations (.env, .env.example)
- Requirements and dependencies
- Media files and static assets
- Agricultural advisory system with expert consultation, courses, and resources

## 📁 Project Structure

```
Ersha_Ecosystem_Backend/
├── agriculture_marketplace/     # Main Django project settings
│   ├── settings.py             # Django settings configuration
│   ├── urls.py                 # Main URL routing
│   ├── wsgi.py                 # WSGI configuration
│   └── asgi.py                 # ASGI configuration
├── users/                      # User management app
│   ├── models.py               # Custom User model
│   ├── views.py                # User views and authentication
│   ├── serializers.py          # User serializers
│   └── urls.py                 # User URL patterns
├── marketplace/                # Marketplace functionality
│   ├── models.py               # Product and marketplace models
│   ├── views.py                # Marketplace views
│   ├── serializers.py          # Marketplace serializers
│   └── urls.py                 # Marketplace URL patterns
├── orders/                     # Order management
│   ├── models.py               # Order and notification models
│   ├── views.py                # Order views
│   ├── serializers.py          # Order serializers
│   └── urls.py                 # Order URL patterns
├── core/                       # Core functionality
│   ├── permissions.py          # Custom permissions
│   └── fayda.py               # Fayda OIDC integration
├── advisory/                   # Agricultural advisory system
│   ├── models.py               # Expert, content, courses, resources models
│   ├── views.py                # Advisory API views
│   ├── serializers.py          # Advisory serializers
│   ├── urls.py                 # Advisory URL patterns
│   ├── admin.py                # Admin interface for advisory
│   └── management/             # Management commands
│       └── commands/
│           └── populate_advisory_data.py
├── media/                      # Media files storage
├── manage.py                   # Django management script
├── requirements.txt            # Python dependencies
├── docker-compose.yml          # Docker services configuration
├── Dockerfile                  # Docker image configuration
├── .env                        # Environment variables (not in git)
├── .env.example               # Environment variables template
└── .gitignore                 # Git ignore rules
```

## 🛠️ Setup Instructions

### Prerequisites

- Python 3.11+
- Docker and Docker Compose
- PostgreSQL (if running locally)
- Redis (if running locally)

### Option 1: Local Development Setup

1. **Clone and navigate to the backend directory:**
   ```bash
   cd Ersha_Ecosystem_Backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run database migrations:**
   ```bash
   python manage.py migrate
   ```

6. **Create superuser (optional):**
   ```bash
   python manage.py createsuperuser
   ```

7. **Populate advisory data (optional):**
   ```bash
   python manage.py populate_advisory_data
   ```

8. **Run the development server:**
   ```bash
   python manage.py runserver
   ```

### Option 2: Docker Setup (Recommended)

1. **Navigate to the backend directory:**
   ```bash
   cd Ersha_Ecosystem_Backend
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Build and start services:**
   ```bash
   docker-compose up --build
   ```

4. **Run migrations (in a new terminal):**
   ```bash
   docker-compose exec web python manage.py migrate
   ```

5. **Create superuser (optional):**
   ```bash
   docker-compose exec web python manage.py createsuperuser
   ```

6. **Populate advisory data (optional):**
   ```bash
   docker-compose exec web python manage.py populate_advisory_data
   ```

## 🌐 API Documentation

Once the server is running, you can access:

- **API Base URL:** http://localhost:8000/api/
- **Admin Interface:** http://localhost:8000/admin/
- **Swagger Documentation:** http://localhost:8000/swagger/
- **ReDoc Documentation:** http://localhost:8000/redoc/

## 🔧 Key Features

### Authentication & Authorization
- JWT-based authentication
- Custom User model
- Fayda OIDC integration for Ethiopian eID
- Role-based permissions

### Marketplace Functionality
- Product management
- Category management
- Shopping cart functionality
- Product search and filtering

### Order Management
- Order creation and tracking
- Payment integration
- Order status management
- Notification system

### Agricultural Advisory System
- **Expert Consultation**: Expert profiles, booking, and consultation management
- **Advisory Content**: Comprehensive agricultural guides with categories and filtering
- **Training Courses**: Structured learning modules with difficulty levels
- **Resources**: Downloadable PDFs, tools, and guides
- **User Engagement**: Bookmarking, liking, and view tracking
- **Multi-language Support**: Amharic, English, Oromo

### Core Features
- RESTful API design
- Comprehensive API documentation
- File upload handling
- CORS configuration
- Database optimization

## 🔐 Environment Variables

Key environment variables to configure:

```env
# Django Settings
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=agriculture_marketplace
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432

# Redis
REDIS_URL=redis://localhost:6379/0

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Fayda OIDC Configuration
CLIENT_ID=your-fayda-client-id
PRIVATE_KEY=your-fayda-private-key
REDIRECT_URI=http://localhost:3000/callback
AUTHORIZATION_ENDPOINT=https://esignet.ida.fayda.et/authorize
TOKEN_ENDPOINT=https://esignet.ida.fayda.et/v1/esignet/oauth/v2/token
USERINFO_ENDPOINT=https://esignet.ida.fayda.et/v1/esignet/oidc/userinfo
```

## 🧪 Testing

Run tests to ensure everything is working:

```bash
# Local testing
python manage.py test

# Docker testing
docker-compose exec web python manage.py test
```

## 📦 Dependencies

Key dependencies include:
- Django 5.2.4
- Django REST Framework 3.16.0
- Django REST Framework Simple JWT 5.3.0
- PostgreSQL adapter (psycopg)
- Django CORS Headers 4.7.0
- Django Filter 25.1
- Pillow (image processing)
- DRF YASG (API documentation)

## 🔄 Migration Notes

- All Django apps have been preserved with their original functionality
- Advisory system has been successfully integrated from backup backend
- User model references have been updated to use custom User model
- Database migrations are included and ready to run
- Docker configurations have been updated for the new directory structure
- Environment variables and secrets have been preserved
- Media files and static assets have been moved

## 🚀 Deployment

For production deployment:

1. Update environment variables for production
2. Set `DEBUG=False`
3. Configure production database
4. Set up proper CORS origins
5. Configure static file serving
6. Set up SSL/TLS certificates

## 📞 Support

For issues or questions related to the backend migration or setup, please refer to the project documentation or contact the development team.

---

**Migration and integration completed successfully!** 🎉 