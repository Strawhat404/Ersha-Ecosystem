// Payment Configuration
export const PAYMENT_CONFIG = {
  CHAPA: {
    PUBLIC_KEY: 'CHAPA_PUBLIC_KEY', // Replace with your actual Chapa public key
    BASE_URL: 'https://api.chapa.co/v1/hosted/pay',
    CURRENCY: 'ETB',
    TEST_MODE: true // Set to false for production
  }
};

// Get Chapa public key from environment or use default
export const getChapaPublicKey = () => {
  const publicKey = import.meta.env.VITE_CHAPA_PUBLIC_KEY || PAYMENT_CONFIG.CHAPA.PUBLIC_KEY;
  
  // Check if using placeholder key
  if (publicKey === 'CHAPA_PUBLIC_KEY' || publicKey === 'CHAPUBK_your_actual_public_key_here') {
    console.error('⚠️ Chapa API Key not configured! Please set VITE_CHAPA_PUBLIC_KEY in your .env file');
    console.error('📝 Get your API key from: https://chapa.co/dashboard/api-keys');
    return 'CHAPUBK_test_public_key'; // Fallback for development
  }
  
  return publicKey;
};

// Get callback URLs
export const getCallbackUrls = () => {
  const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
  return {
    callback: `${baseUrl}/api/payments/chapa/callback`,
    return: `${baseUrl}/payment-success`
  };
};

// Validate Chapa configuration
export const validateChapaConfig = () => {
  const publicKey = getChapaPublicKey();
  const isValidKey = publicKey && publicKey.startsWith('CHAPUBK_') && publicKey !== 'CHAPUBK_test_public_key';
  
  if (!isValidKey) {
    return {
      valid: false,
      error: 'Invalid or missing Chapa API key. Please configure VITE_CHAPA_PUBLIC_KEY in your .env file.',
      instructions: [
        '1. Sign up/login to Chapa: https://chapa.co',
        '2. Go to Dashboard > API Keys',
        '3. Copy your Public Key (starts with CHAPUBK_)',
        '4. Add it to your .env file: VITE_CHAPA_PUBLIC_KEY=your_key_here'
      ]
    };
  }
  
  return { valid: true };
}; 