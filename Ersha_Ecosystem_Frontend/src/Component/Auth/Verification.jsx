import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  ShieldCheck, 
  ShieldX, 
  Clock, 
  ExternalLink, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../lib/api';

const Verification = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, profile, refreshUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [verificationStep, setVerificationStep] = useState('initial'); // initial, redirecting, callback, success, error
  const [authUrl, setAuthUrl] = useState(null);
  const [state, setState] = useState(null);

  // Check if this is a callback from Fayda
  const code = searchParams.get('code');
  const returnedState = searchParams.get('state');

  useEffect(() => {
    // If user is already verified, redirect to dashboard
    if (profile?.verification_status === 'verified') {
      navigate('/dashboard');
      return;
    }

    // If this is a callback from Fayda OIDC
    if (code && returnedState) {
      handleCallback();
    }
  }, [code, returnedState, profile?.verification_status, navigate]);

  const handleCallback = async () => {
    setVerificationStep('callback');
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/auth/fayda/enhanced/callback/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          code,
          state: returnedState,
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

  const startVerification = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.getFaydaAuthUrl();
      setAuthUrl(response.authorization_url);
      setState(response.state);
      setVerificationStep('redirecting');
      
      // Redirect to Fayda authorization URL
      window.location.href = response.authorization_url;
    } catch (err) {
      console.error('Failed to get authorization URL:', err);
      setError('Failed to start verification process. Please try again.');
      setVerificationStep('error');
    } finally {
      setLoading(false);
    }
  };

  const getVerificationIcon = (status) => {
    switch (status) {
      case 'verified':
        return <ShieldCheck className="w-8 h-8 text-green-600" />;
      case 'pending':
        return <Clock className="w-8 h-8 text-yellow-600" />;
      case 'failed':
        return <ShieldX className="w-8 h-8 text-red-600" />;
      default:
        return <Shield className="w-8 h-8 text-gray-600" />;
    }
  };

  const getVerificationLabel = (status) => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'pending':
        return 'Pending Verification';
      case 'failed':
        return 'Verification Failed';
      default:
        return 'Not Verified';
    }
  };

  const renderStep = () => {
    switch (verificationStep) {
      case 'redirecting':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Redirecting to Fayda...
            </h3>
            <p className="text-gray-600">
              You will be redirected to the official Fayda Digital ID verification page.
            </p>
          </motion.div>
        );

      case 'callback':
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
            <p className="text-gray-600 mb-6">
              Your identity has been successfully verified with Fayda Digital ID.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Continue to Dashboard
            </button>
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
                onClick={() => {
                  setVerificationStep('initial');
                  setError(null);
                }}
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
            <button
              onClick={() => {
                setVerificationStep('initial');
                setError(null);
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        );

      default:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Verify Your Identity
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              To access all platform features, please verify your identity using your Fayda Digital ID. 
              This ensures secure and trusted transactions.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-900 mb-2">What you'll need:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Your Fayda Digital ID</li>
                <li>• Access to your registered phone number</li>
                <li>• A few minutes to complete the process</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-yellow-900 mb-2">Important:</h4>
              <p className="text-sm text-yellow-800">
                Your Fayda information must match your registered account details (name, phone, email, region). 
                Please ensure your profile information is accurate before proceeding.
              </p>
            </div>

            <button
              onClick={startVerification}
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Starting Verification...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Start Verification</span>
                  <ExternalLink className="w-4 h-4" />
                </>
              )}
            </button>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Identity Verification</h1>
              <p className="text-sm text-gray-600">Fayda Digital ID Integration</p>
            </div>
          </div>
        </div>

        {/* Current Status */}
        {profile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6"
          >
            <div className="flex items-center space-x-3">
              {getVerificationIcon(profile.verification_status)}
              <div>
                <p className="text-sm font-medium text-gray-600">Current Status</p>
                <p className="text-lg font-semibold text-gray-900">
                  {getVerificationLabel(profile.verification_status)}
                </p>
              </div>
            </div>
          </motion.div>
        )}

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

export default Verification; 