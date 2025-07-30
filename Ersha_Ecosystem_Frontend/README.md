# 🌾 AgroGebeya Frontend

## 📋 Overview

AgroGebeya is a comprehensive agricultural ecosystem platform providing a complete solution for farmers, buyers, and service providers.

## 🚀 Features

### ✅ Core Features
- 🔐 **User Authentication** (Sign up, Sign in, Profile management)
- 🛍️ **Marketplace** with real products and orders
- 💳 **Payment System** with escrow protection
- 🚚 **Logistics Tracking** with live delivery updates
- 📊 **Analytics Dashboard** with credit scoring
- 🌱 **Advisory Content** with expert recommendations
- 📰 **News & Updates** system
- 🌤️ **Weather Integration** with regional data

## 🛠️ Setup Instructions

### 1. Prerequisites
```bash
# Ensure you have Node.js 18+ installed
node --version

# Clone and navigate to project
cd AgroGebeya
pnpm install

```
### 2. Configure Enviornment 

``` bash
# Create .env file
cp .env.example .env

# Add your backend API credentials
VITE_API_BASE_URL=https://your-api-endpoint.com

```

### 3. Run the application

```bash
pnpm run dev
```
## Project Structure

``` bash
AgroGebeya/
├── src/
│   ├── contexts/
│   │   └── AuthContext.jsx       # Authentication state
│   ├── Component/
│   │   ├── Dashboard/            # Analytics, Payments, Logistics
│   │   ├── Marketplace/          # Products & Trading
│   │   ├── Advisory/             # Farming guides
│   │   └── ...
│   └── ...
├── .env                          # Environment variables
└── README.md                     # This file

```

## 🔧 Key Files Explained

### `src/contexts/AuthContext.jsx`
React context for authentication:
- User state management
- Login/logout functions
- Profile data handling
- Role-based access control

## 🎯 API Usage Examples

### Authentication
```javascript
import { useAuth } from './contexts/AuthContext'

function LoginComponent() {
  const { signIn, user, loading } = useAuth()
  
  const handleLogin = async (email, password) => {
    const { error } = await signIn(email, password)
    if (error) console.error('Login failed:', error)
  }
}
```

### Data Operarions

```javascript
// Get all products
const response = await fetch('/api/products')
const products = await response.json()

// Create new order
const orderResponse = await fetch('/api/orders', {
  method: 'POST',
  body: JSON.stringify({
    buyer_id: user.id,
    product_id: selectedProduct.id,
    quantity: 10
  })
})
```

## 🔒 Security Features

### Authentication
- JWT-based authentication
- Email verification
- Password reset functionality
- Role-based permissions

### Data Validation
- Input sanitization
- Type checking with TypeScript
- Form validation

## 🌟 Features in Action

### Real-time Updates
- Order status changes
- Delivery tracking
- Payment confirmations
- New product listings

### Credit Scoring System
- Automatic calculation based on sales history
- Payment reliability tracking
- Loan eligibility assessment

### Mobile-First Design
- Responsive layouts
- Touch-friendly interfaces
- Offline-ready features
- Progressive Web App (PWA) capabilities

# Happy farming! 🌾




