# 🚀 Quick Chapa Setup Guide

## ⚡ 5-Minute Setup

### Step 1: Get Your Chapa API Key
1. Go to [https://chapa.co](https://chapa.co)
2. Sign up or log in to your account
3. Navigate to **Dashboard > API Keys**
4. Copy your **Public Key** (starts with `CHAPUBK_`)

### Step 2: Configure Environment
1. Create a `.env` file in the frontend directory:
```bash
cd Ersha_Ecosystem_Frontend
touch .env
```

2. Add your Chapa API key to the `.env` file:
```env
VITE_CHAPA_PUBLIC_KEY=CHAPUBK_your_actual_key_here
VITE_APP_URL=http://localhost:3000
```

### Step 3: Restart Development Server
```bash
npm run dev
```

## 🧪 Test Mode vs Production

### Test Mode (Current)
- ✅ No real money involved
- ✅ Use test cards: `4242424242424242`
- ✅ Perfect for development

### Production Mode
1. Update `src/config/payment.js`:
   ```javascript
   TEST_MODE: false // Change from true to false
   ```
2. Use your production API key
3. Test with real payments

## 🔧 Troubleshooting

### "Invalid API Key" Error
- ✅ Check that your API key starts with `CHAPUBK_`
- ✅ Ensure the key is copied correctly (no extra spaces)
- ✅ Verify your Chapa account is active

### "Business can't accept payments" Error
- ✅ Complete your Chapa account verification
- ✅ Add business information in Chapa dashboard
- ✅ Contact Chapa support if needed

## 📞 Support

- **Chapa Support**: support@chapa.co
- **Documentation**: https://developer.chapa.co
- **Dashboard**: https://chapa.co/dashboard

## 🎯 Next Steps

After setup:
1. Test the payment flow
2. Configure webhooks for payment notifications
3. Set up production environment
4. Add payment analytics

---

**Need help?** Check the full setup guide in `CHAPA_SETUP.md` 