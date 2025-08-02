import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  ShieldCheck, 
  ShieldX, 
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Callback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshUserProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verificationStep, setVerificationStep] = useState('processing');

  // Get callback parameters from Fayda
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const errorParam = searchParams.get('error');

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if there's an error from Fayda
      if (errorParam) {
        throw new Error(`Fayda authentication error: ${errorParam}`);
      }

      // Check if we have the required parameters
      if (!code || !state) {
        throw new Error('Missing required authentication parameters');
      }

      setVerificationStep('processing');

      // Call the backend to handle the callback
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/auth/fayda/enhanced/callback/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          code,
          state,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Check if this is a verification failure
        if (result.verification_status === 'failed') {
          setError(result.error || 'Verification failed');
          setVerificationStep('verification_failed');
        } else {
          throw new Error(result.error || 'Verification failed');
        }
        return;
      }

      // Refresh user data to get updated verification status
      await refreshUserProfile();
      
      // Check if verification was successful
      if (result.is_verified) {
        setVerificationStep('success');
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 2000);
      } else {
        setError('Verification was not completed successfully');
        setVerificationStep('error');
      }
    } catch (err) {
      console.error('Verification callback error:', err);
      setError(err.message);
      setVerificationStep('error');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (verificationStep) {
      case 'processing':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Processing Verification...
            </h3>
            <p className="text-gray-600">
              Please wait while we verify your identity with Fayda.
            </p>
          </motion.div>
        );

      case 'success':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Verification Successful!
            </h3>
            <p className="text-gray-600 mb-4">
              Your identity has been successfully verified with Fayda Digital ID.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to dashboard...
            </p>
          </motion.div>
        );

      case 'verification_failed':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Identity Verification Failed
            </h3>
            <p className="text-gray-600 mb-4">
              The information from your Fayda Digital ID doesn't match your registered account details.
            </p>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
              <h4 className="font-semibold text-red-900 mb-2">What to check:</h4>
              <ul className="text-sm text-red-800 space-y-1">
                <li>• Your name matches your Fayda registration</li>
                <li>• Your phone number is correct</li>
                <li>• Your email address is accurate</li>
                <li>• Your region/location is properly set</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => navigate('/verification')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="block w-full text-gray-600 hover:text-gray-900 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </motion.div>
        );

      case 'error':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Verification Failed
            </h3>
            <p className="text-gray-600 mb-4">
              {error || 'An error occurred during verification. Please try again.'}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/verification')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="block w-full text-gray-600 hover:text-gray-900 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </motion.div>
        );

      default:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Processing...
            </h3>
            <p className="text-gray-600">
              Please wait while we process your authentication.
            </p>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Authentication Callback</h1>
              <p className="text-sm text-gray-600">Fayda Digital ID Verification</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-8"
        >
          {renderStep()}
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            This verification is powered by Fayda Digital ID, Ethiopia's official digital identity system.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Callback; 