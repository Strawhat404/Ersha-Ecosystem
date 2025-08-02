# Chapa Payment Integration Setup

This guide explains how to set up Chapa payment gateway integration for the Ersha Ecosystem marketplace.

## Prerequisites

1. Chapa account (sign up at https://chapa.co)
2. Access to your Chapa dashboard
3. Your Chapa public key

## Setup Instructions

### 1. Get Your Chapa Public Key

1. Log in to your Chapa dashboard
2. Navigate to the API Keys section
3. Copy your public key (starts with `CHAPUBK_`)

### 2. Environment Configuration

Create or update your `.env` file in the frontend directory:

```env
# Chapa Payment Configuration
VITE_CHAPA_PUBLIC_KEY=CHAPUBK_your_actual_public_key_here
VITE_APP_URL=http://localhost:3000
```

### 3. Test Mode vs Production Mode

The integration is currently set to test mode. To switch to production:

1. Update `src/config/payment.js`:
   ```javascript
   TEST_MODE: false // Change from true to false
   ```

2. Use your production public key in the environment variables

### 4. Callback URLs Setup

The payment form uses these callback URLs:
- **Callback URL**: `{YOUR_APP_URL}/api/payments/chapa/callback`
- **Return URL**: `{YOUR_APP_URL}/payment-success`

Make sure these endpoints are properly configured in your backend.

## How It Works

### Payment Flow

1. **User adds items to cart** → Cart shows "In Cart" status
2. **User proceeds to checkout** → Fills delivery information
3. **User clicks "Proceed to Payment"** → Order is created in backend
4. **Chapa payment form appears** → User clicks "Pay Now"
5. **User is redirected to Chapa** → Completes payment on Chapa's secure page
6. **User returns to success page** → Payment verification happens

### Cart Item States

- **Not in cart**: Shows "Add to Cart" button (green)
- **In cart**: Shows "✓ In Cart (quantity)" and "Add More" button (blue)
- **Adding**: Shows loading spinner and "Adding..." text

### Security Features

- All payment data is sent directly to Chapa's servers
- No sensitive payment information is stored locally
- Transaction verification happens on the backend
- Unique transaction references for each payment

## Testing

### Test Cards (Test Mode Only)

Use these test cards for testing:
- **Card Number**: 4242424242424242
- **Expiry**: Any future date
- **CVV**: Any 3 digits
- **PIN**: Any 4 digits

### Test Phone Numbers (Mobile Money)

- **Ethiopia**: +251900000000
- **Other countries**: Use any valid phone number format

## Troubleshooting

### Common Issues

1. **"Invalid public key" error**
   - Check that your public key is correct
   - Ensure you're using the right key for test/production mode

2. **Payment form not appearing**
   - Check browser console for JavaScript errors
   - Verify that the order creation API call succeeded

3. **Callback not working**
   - Ensure your backend has the callback endpoint configured
   - Check that the callback URL is accessible

### Debug Mode

To enable debug logging, add this to your `.env`:
```env
VITE_DEBUG_PAYMENTS=true
```

## Production Checklist

Before going live:

- [ ] Switch to production mode in payment config
- [ ] Use production Chapa public key
- [ ] Configure proper callback URLs
- [ ] Test payment flow end-to-end
- [ ] Set up webhook handling for payment notifications
- [ ] Implement proper error handling
- [ ] Add payment analytics tracking

## Support

For Chapa-specific issues, contact Chapa support at support@chapa.co

For application-specific issues, check the application logs and error messages. 