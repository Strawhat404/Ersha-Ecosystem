import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Smartphone, Banknote, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import paymentApi from '../../services/paymentApi';

const PaymentMethodModal = ({ isOpen, onClose, onSuccess, userId }) => {
  const [step, setStep] = useState(1); // 1: Select type, 2: Enter details, 3: Verify
  const [formData, setFormData] = useState({
    method_type: '',
    provider: '',
    account_number: '',
    phone_number: '',
    account_name: '',
    bank_name: '',
    branch_code: '',
    is_default: false
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const methodTypes = [
    {
      type: 'mobile',
      label: 'Mobile Money',
      icon: Smartphone,
      providers: [
        { value: 'm_pesa', label: 'M-Pesa' },
        { value: 'telebirr', label: 'Telebirr' },
        { value: 'hellocash', label: 'HelloCash' }
      ]
    },
    {
      type: 'bank',
      label: 'Bank Account',
      icon: Banknote,
      providers: [
        { value: 'commercial_bank', label: 'Commercial Bank of Ethiopia' },
        { value: 'awash_bank', label: 'Awash Bank' },
        { value: 'dashen_bank', label: 'Dashen Bank' },
        { value: 'bank_of_abyssinia', label: 'Bank of Abyssinia' }
      ]
    },
    {
      type: 'digital',
      label: 'Digital Wallet',
      icon: CreditCard,
      providers: [
        { value: 'chapa', label: 'Chapa' },
        { value: 'amole', label: 'Amole' },
        { value: 'cbe_birr', label: 'CBE Birr' }
      ]
    }
  ];

  const handleMethodTypeSelect = (type) => {
    setFormData(prev => ({ ...prev, method_type: type }));
    setStep(2);
  };

  const handleProviderSelect = (provider) => {
    setFormData(prev => ({ ...prev, provider }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await paymentApi.createPaymentMethod({
        ...formData,
        user_id: userId
      });

      if (result.requires_verification) {
        setStep(3);
      } else {
        setSuccess(true);
        setTimeout(() => {
          onSuccess(result.data);
          onClose();
        }, 2000);
      }
    } catch (error) {
      setError(error.message || 'Failed to create payment method');
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await paymentApi.verifyPaymentMethod(
        formData.id || 'temp_id',
        verificationCode
      );

      setSuccess(true);
      setTimeout(() => {
        onSuccess(result.data);
        onClose();
      }, 2000);
    } catch (error) {
      setError(error.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      method_type: '',
      provider: '',
      account_number: '',
      phone_number: '',
      account_name: '',
      bank_name: '',
      branch_code: '',
      is_default: false
    });
    setVerificationCode('');
    setStep(1);
    setError('');
    setSuccess(false);
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Add Payment Method</h2>
                <p className="text-sm text-gray-600">Step {step} of 3</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {success ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Payment Method Added!
              </h3>
              <p className="text-gray-600">
                Your payment method has been successfully added and verified.
              </p>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Select Payment Method Type
                  </h3>
                  {methodTypes.map((methodType) => (
                    <motion.button
                      key={methodType.type}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleMethodTypeSelect(methodType.type)}
                      className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-teal-300 transition-all duration-300 text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                          <methodType.icon className="w-6 h-6 text-teal-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{methodType.label}</h4>
                          <p className="text-sm text-gray-600">
                            {methodType.providers.map(p => p.label).join(', ')}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Enter Payment Details
                    </h3>
                    <button
                      onClick={() => setStep(1)}
                      className="text-teal-600 hover:text-teal-700 text-sm"
                    >
                      Back
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Provider Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Provider
                      </label>
                      <select
                        name="provider"
                        value={formData.provider}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      >
                        <option value="">Select a provider</option>
                        {methodTypes
                          .find(mt => mt.type === formData.method_type)
                          ?.providers.map(provider => (
                            <option key={provider.value} value={provider.value}>
                              {provider.label}
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Account Details */}
                    {formData.method_type === 'mobile' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleInputChange}
                          placeholder="+251-9XX-XXX-XXX"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>
                    )}

                    {formData.method_type === 'bank' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Account Name
                          </label>
                          <input
                            type="text"
                            name="account_name"
                            value={formData.account_name}
                            onChange={handleInputChange}
                            placeholder="Account holder name"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Account Number
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              name="account_number"
                              value={formData.account_number}
                              onChange={handleInputChange}
                              placeholder="Account number"
                              required
                              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Branch Code (Optional)
                          </label>
                          <input
                            type="text"
                            name="branch_code"
                            value={formData.branch_code}
                            onChange={handleInputChange}
                            placeholder="Branch code"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          />
                        </div>
                      </>
                    )}

                    {formData.method_type === 'digital' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account Number/ID
                        </label>
                        <input
                          type="text"
                          name="account_number"
                          value={formData.account_number}
                          onChange={handleInputChange}
                          placeholder="Digital wallet account number"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>
                    )}

                    {/* Default Payment Method */}
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="is_default"
                        checked={formData.is_default}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                      <label className="text-sm text-gray-700">
                        Set as default payment method
                      </label>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg"
                      >
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <span className="text-sm text-red-700">{error}</span>
                      </motion.div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading || !formData.provider}
                        className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {loading ? 'Adding...' : 'Add Payment Method'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Verify Payment Method
                    </h3>
                    <button
                      onClick={() => setStep(2)}
                      className="text-teal-600 hover:text-teal-700 text-sm"
                    >
                      Back
                    </button>
                  </div>

                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Smartphone className="w-8 h-8 text-blue-600" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      Verification Required
                    </h4>
                    <p className="text-gray-600">
                      We've sent a verification code to your {formData.method_type === 'mobile' ? 'phone number' : 'account'}. 
                      Please enter it below to complete the setup.
                    </p>
                  </div>

                  <form onSubmit={handleVerification} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Verification Code
                      </label>
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        maxLength="6"
                        required
                        className="w-full px-4 py-3 text-center text-2xl font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>

                    {/* Error Message */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg"
                      >
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <span className="text-sm text-red-700">{error}</span>
                      </motion.div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading || verificationCode.length !== 6}
                        className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {loading ? 'Verifying...' : 'Verify & Complete'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentMethodModal; 