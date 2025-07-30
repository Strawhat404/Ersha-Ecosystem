# Enhanced Authentication & Verification System

This document describes the enhanced authentication and verification system for the Ersha Ecosystem, featuring Fayda OIDC integration with PKCE flow and role-based user validation.

## 🎯 Overview

The enhanced authentication system provides:

1. **Role-based User Registration**: Three user types with specific validation requirements
2. **Fayda OIDC Integration**: National ID verification using Ethiopia's eSignet system
3. **Verification-based Access Control**: Restricted services require verified users
4. **PKCE OAuth Flow**: Secure authorization code flow with proof key for code exchange

## 👥 User Types & Registration Requirements

### 1. Farmer
- **Required Fields**: Standard user fields + `farm_size`
- **Optional Fields**: `farm_size_unit`, `woreda`, `kebele`
- **Verification**: Required for marketplace transactions and financial services

### 2. Buyer/Merchant
- **Required Fields**: Standard user fields (no `farm_size`)
- **Optional Fields**: `woreda`, `kebele`
- **Verification**: Required for marketplace transactions and financial services

### 3. Agricultural Business
- **Required Fields**: Standard user fields + `business_license_number`
- **Optional Fields**: `woreda`, `kebele`
- **Verification**: Required for marketplace transactions and financial services

## 🔐 Verification Status

All users start with `verification_status = "not_verified"` and must complete Fayda verification to access restricted services.

### Verification Statuses:
- `not_verified`: Default status for new users
- `pending`: Verification in progress
- `verified`: Successfully verified with Fayda
- `failed`: Verification failed

## 🛂 Fayda OIDC Integration

### Configuration

The system uses the following Fayda eSignet endpoints:

```env
CLIENT_ID=crXYIYg2cJiNTaw5t-peoPzCRo-3JATNfBd5A86U8t0
REDIRECT_URI=http://localhost:3000/callback
AUTHORIZATION_ENDPOINT=https://esignet.ida.fayda.et/authorize
TOKEN_ENDPOINT=https://esignet.ida.fayda.et/v1/esignet/oauth/v2/token
USERINFO_ENDPOINT=https://esignet.ida.fayda.et/v1/esignet/oidc/userinfo
ALGORITHM=RS256
CLIENT_ASSERTION_TYPE=urn:ietf:params:oauth:client-assertion-type:jwt-bearer
PRIVATE_KEY=<your-private-key>
```

### OIDC Flow with PKCE

1. **Authorization Request**: Generate PKCE challenge and redirect to Fayda
2. **User Authentication**: User authenticates with Fayda (OTP, biometric, etc.)
3. **Authorization Code**: Fayda returns authorization code to callback URL
4. **Token Exchange**: Exchange code for access token using PKCE verifier
5. **User Info**: Retrieve user information using access token
6. **Verification**: Update user verification status and store Fayda data

### Test Credentials

```plaintext
Test Fayda FIN: 6140798523917519
OTP: 111111
```

## 🔒 Restricted Services

The following services require verified users:

1. **Loans and Financial Transactions**
2. **Marketplace Buying and Selling**
3. **Payment-related Activities**

### Permission Classes

- `IsVerifiedUser`: Full access control
- `IsVerifiedUserOrReadOnly`: Read access for all, write for verified users
- `IsVerifiedUserForFinancial`: Financial services only
- `IsVerifiedUserForMarketplace`: Marketplace transactions only
- `IsVerifiedUserForPayments`: Payment activities only

## 📡 API Endpoints

### Authentication

#### Enhanced Registration
```http
POST /api/users/register/enhanced/
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "first_name": "John",
  "last_name": "Doe",
  "password": "password123",
  "password_confirm": "password123",
  "phone": "+251900000000",
  "region": "Addis Ababa",
  "user_type": "farmer",
  "farm_size": "5.5",
  "farm_size_unit": "hectares"
}
```

#### Verification Status
```http
GET /api/users/verification-status/
Authorization: Bearer <token>
```

### Fayda OIDC

#### Get Authorization URL
```http
GET /api/users/fayda/enhanced/auth-url/
Authorization: Bearer <token>
```

Response:
```json
{
  "authorization_url": "https://esignet.ida.fayda.et/authorize?...",
  "state": "random_state_string"
}
```

#### Handle Callback
```http
POST /api/users/fayda/enhanced/callback/
Authorization: Bearer <token>
Content-Type: application/json

{
  "code": "authorization_code_from_fayda",
  "state": "state_from_authorization_request"
}
```

Response:
```json
{
  "message": "Fayda verification completed successfully",
  "user_data": {
    "fayda_id": "6140798523917519",
    "name": "John Doe",
    "given_name": "John",
    "family_name": "Doe",
    "email": "john.doe@fayda.et",
    "phone_number": "+251900000000",
    "birthdate": "1990-01-01",
    "gender": "M",
    "region": "Addis Ababa"
  },
  "verification_status": "verified",
  "is_verified": true
}
```

## 🏗️ Implementation Details

### Models

#### User Model Enhancements
```python
class User(AbstractUser):
    class UserType(models.TextChoices):
        FARMER = 'farmer', 'Farmer'
        BUYER = 'buyer', 'Buyer/Merchant'
        AGRICULTURAL_BUSINESS = 'agricultural_business', 'Agricultural Business'
        ADMIN = 'admin', 'Admin'
    
    class VerificationStatus(models.TextChoices):
        NOT_VERIFIED = 'not_verified', 'Not Verified'
        VERIFIED = 'verified', 'Verified'
        PENDING = 'pending', 'Pending Verification'
        FAILED = 'failed', 'Verification Failed'
    
    verification_status = models.CharField(
        max_length=20,
        choices=VerificationStatus.choices,
        default=VerificationStatus.NOT_VERIFIED
    )
    verified_at = models.DateTimeField(blank=True, null=True)
    fayda_verification_data = models.JSONField(blank=True, null=True)
```

#### Profile Model Enhancements
```python
class Profile(models.Model):
    business_license_number = models.CharField(
        max_length=100, 
        blank=True, 
        null=True,
        help_text="Business license number (required for agricultural businesses)"
    )
    
    def clean(self):
        """Validate profile data based on user type"""
        if self.user.user_type == User.UserType.FARMER and not self.farm_size:
            raise ValidationError("Farm size is required for farmers")
        
        if self.user.user_type == User.UserType.AGRICULTURAL_BUSINESS and not self.business_license_number:
            raise ValidationError("Business license number is required for agricultural businesses")
```

### Fayda OIDC Implementation

#### PKCE Flow
```python
class FaydaOIDC:
    def generate_pkce_pair(self):
        """Generate PKCE code verifier and challenge"""
        code_verifier = base64.urlsafe_b64encode(secrets.token_bytes(32)).decode('utf-8').rstrip('=')
        code_challenge = base64.urlsafe_b64encode(
            hashlib.sha256(code_verifier.encode('utf-8')).digest()
        ).decode('utf-8').rstrip('=')
        return code_verifier, code_challenge
    
    def generate_authorization_url(self, state=None, acr_values='OTP'):
        """Generate authorization URL with PKCE"""
        code_verifier, code_challenge = self.generate_pkce_pair()
        
        # Store code verifier in cache
        cache_key = f"fayda_pkce_{state or 'default'}"
        cache.set(cache_key, code_verifier, timeout=600)
        
        # Build authorization URL
        params = {
            'response_type': 'code',
            'client_id': self.client_id,
            'redirect_uri': self.redirect_uri,
            'scope': 'openid profile email',
            'code_challenge': code_challenge,
            'code_challenge_method': 'S256',
            'acr_values': acr_values
        }
        
        if state:
            params['state'] = state
        
        auth_url = f"{self.authorization_endpoint}?"
        auth_url += "&".join([f"{k}={v}" for k, v in params.items()])
        
        return auth_url, code_verifier
```

## 🚀 Frontend Integration

### Dashboard Verification Alert

```javascript
// Check verification status on dashboard load
const checkVerificationStatus = async () => {
  try {
    const response = await fetch('/api/users/verification-status/', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    const data = await response.json();
    
    if (!data.is_verified) {
      showVerificationAlert(data.verification_status);
    }
  } catch (error) {
    console.error('Error checking verification status:', error);
  }
};

// Show verification alert/button
const showVerificationAlert = (status) => {
  const alertDiv = document.createElement('div');
  alertDiv.className = 'verification-alert';
  alertDiv.innerHTML = `
    <div class="alert alert-warning">
      <strong>Verification Required</strong>
      <p>Your account needs to be verified with Fayda to access restricted services.</p>
      <button onclick="startVerification()" class="btn btn-primary">
        Verify with Fayda
      </button>
    </div>
  `;
  document.body.appendChild(alertDiv);
};
```

### Verification Flow

```javascript
// Start verification process
const startVerification = async () => {
  try {
    // Get authorization URL
    const response = await fetch('/api/users/fayda/enhanced/auth-url/', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    const data = await response.json();
    
    // Store state for callback
    localStorage.setItem('fayda_state', data.state);
    
    // Redirect to Fayda
    window.location.href = data.authorization_url;
  } catch (error) {
    console.error('Error starting verification:', error);
  }
};

// Handle callback
const handleCallback = async (code, state) => {
  try {
    const response = await fetch('/api/users/fayda/enhanced/callback/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code, state })
    });
    
    const data = await response.json();
    
    if (data.is_verified) {
      showSuccessMessage('Verification completed successfully!');
      // Refresh user data and remove verification alert
      location.reload();
    }
  } catch (error) {
    console.error('Error completing verification:', error);
    showErrorMessage('Verification failed. Please try again.');
  }
};
```

## 🔧 Testing

### Test User Registration

```bash
# Register a farmer
curl -X POST http://localhost:8000/api/users/register/enhanced/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "farmer@example.com",
    "username": "farmer1",
    "first_name": "John",
    "last_name": "Farmer",
    "password": "password123",
    "password_confirm": "password123",
    "phone": "+251900000000",
    "region": "Addis Ababa",
    "user_type": "farmer",
    "farm_size": "5.5",
    "farm_size_unit": "hectares"
  }'

# Register an agricultural business
curl -X POST http://localhost:8000/api/users/register/enhanced/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "business@example.com",
    "username": "agribusiness1",
    "first_name": "Jane",
    "last_name": "Business",
    "password": "password123",
    "password_confirm": "password123",
    "phone": "+251900000001",
    "region": "Addis Ababa",
    "user_type": "agricultural_business",
    "business_license_number": "LIC123456789"
  }'
```

### Test Verification Flow

```bash
# Get authorization URL
curl -X GET http://localhost:8000/api/users/fayda/enhanced/auth-url/ \
  -H "Authorization: Bearer <access_token>"

# Complete verification (after getting code from Fayda)
curl -X POST http://localhost:8000/api/users/fayda/enhanced/callback/ \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "authorization_code_from_fayda",
    "state": "state_from_authorization_request"
  }'
```

## 📋 Migration Guide

### From Legacy System

1. **Update User Types**: Migrate existing `merchant` users to `buyer`
2. **Add Verification Fields**: New users will have verification status
3. **Update Permissions**: Apply verification-based permissions to restricted services
4. **Frontend Updates**: Add verification UI components

### Database Migration

```bash
# Create and apply migrations
python manage.py makemigrations users
python manage.py migrate

# Update existing users (if needed)
python manage.py shell
```

```python
# Update existing merchant users to buyer
from users.models import User
User.objects.filter(user_type='merchant').update(user_type='buyer')
```

## 🔐 Security Considerations

1. **PKCE Flow**: Prevents authorization code interception attacks
2. **State Parameter**: CSRF protection for OAuth flow
3. **JWT Client Assertion**: Secure client authentication
4. **Cache Timeout**: PKCE verifiers expire after 10 minutes
5. **Input Validation**: Role-based field validation
6. **Permission Classes**: Granular access control

## 🚨 Error Handling

### Common Error Scenarios

1. **Verification Required**: User tries to access restricted service
2. **Invalid User Type**: Missing required fields for user type
3. **Fayda API Errors**: Network issues or invalid credentials
4. **Expired PKCE**: Code verifier expired or not found
5. **Duplicate Fayda ID**: Fayda ID already linked to another user

### Error Response Format

```json
{
  "error": "Error message description",
  "verification_status": "not_verified",
  "required_action": "verify_with_fayda"
}
```

## 📞 Support

For issues related to the enhanced authentication system:

1. Check the Django logs for detailed error messages
2. Verify Fayda configuration in settings
3. Test with provided test credentials
4. Review the OIDC flow documentation
5. Contact the development team for assistance

---

**Enhanced Authentication System Implementation Complete!** 🎉 