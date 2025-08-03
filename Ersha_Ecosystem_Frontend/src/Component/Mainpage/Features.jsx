import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  BarChart3, 
  Shield, 
  Smartphone,
  CheckCircle
} from 'lucide-react';
import { useLocale } from '../../contexts/LocaleContext';

const Features = () => {
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const { t } = useLocale();

  const features = [
    {
      icon: (
        <motion.div
          className="w-10 h-10 text-white flex items-center justify-center"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <ShoppingBag className="w-8 h-8" />
        </motion.div>
      ),
      title: t('features.directMarketplace.title'),
      description: t('features.directMarketplace.description'),
      benefits: [
        t('features.directMarketplace.benefits.zeroCommission'),
        t('features.directMarketplace.benefits.directCommunication'),
        t('features.directMarketplace.benefits.qualityAssurance'),
        t('features.directMarketplace.benefits.fairPricing')
      ],
      color: "from-teal-400 to-teal-600"
    },
    {
      icon: (
        <motion.div
          className="w-10 h-10 text-white flex items-center justify-center"
          animate={{ 
            y: [0, -8, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <DollarSign className="w-8 h-8" />
        </motion.div>
      ),
      title: t('features.integratedPayments.title'),
      description: t('features.integratedPayments.description'),
      benefits: [
        t('features.integratedPayments.benefits.multipleOptions'),
        t('features.integratedPayments.benefits.instantTransactions'),
        t('features.integratedPayments.benefits.lowFees'),
        t('features.integratedPayments.benefits.fraudProtection')
      ],
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: (
        <motion.div
          className="w-10 h-10 text-white flex items-center justify-center"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <BarChart3 className="w-8 h-8" />
        </motion.div>
      ),
      title: t('features.financialGrowth.title'),
      description: t('features.financialGrowth.description'),
      benefits: [
        t('features.financialGrowth.benefits.creditScore'),
        t('features.financialGrowth.benefits.loanEligibility'),
        t('features.financialGrowth.benefits.salesAnalytics'),
        t('features.financialGrowth.benefits.revenueTracking')
      ],
      color: "from-orange-400 to-orange-600"
    },
    {
      icon: (
        <motion.div
          className="w-10 h-10 text-white flex items-center justify-center"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <TrendingUp className="w-8 h-8" />
        </motion.div>
      ),
      title: t('features.smartAnalytics.title'),
      description: t('features.smartAnalytics.description'),
      benefits: [
        t('features.smartAnalytics.benefits.marketTrends'),
        t('features.smartAnalytics.benefits.pricePredictions'),
        t('features.smartAnalytics.benefits.performanceMetrics'),
        t('features.smartAnalytics.benefits.growthInsights')
      ],
      color: "from-purple-400 to-purple-600"
    },
    {
      icon: (
        <motion.div
          className="w-10 h-10 text-white flex items-center justify-center"
          animate={{ 
            rotate: [0, -10, 10, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Shield className="w-8 h-8" />
        </motion.div>
      ),
      title: t('features.securityTrust.title'),
      description: t('features.securityTrust.description'),
      benefits: [
        t('features.securityTrust.benefits.identityVerification'),
        t('features.securityTrust.benefits.secureTransactions'),
        t('features.securityTrust.benefits.disputeResolution'),
        t('features.securityTrust.benefits.insuranceCoverage')
      ],
      color: "from-green-400 to-green-600"
    },
    {
      icon: (
        <motion.div
          className="w-10 h-10 text-white flex items-center justify-center"
          animate={{ 
            x: [0, 3, -3, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Smartphone className="w-8 h-8" />
        </motion.div>
      ),
      title: t('features.mobileFirst.title'),
      description: t('features.mobileFirst.description'),
      benefits: [
        t('features.mobileFirst.benefits.offlineCapability'),
        t('features.mobileFirst.benefits.pushNotifications'),
        t('features.mobileFirst.benefits.gpsIntegration'),
        t('features.mobileFirst.benefits.voiceCommands')
      ],
      color: "from-pink-400 to-pink-600"
    }
  ];

  const stats = [
    { 
      number: "99.9%", 
      label: t('features.stats.uptimeGuarantee'), 
      icon: (
        <motion.svg 
          className="w-8 h-8 text-teal-600" 
          fill="currentColor" 
          viewBox="0 0 20 20"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
        </motion.svg>
      )
    },
    { 
      number: "24/7", 
      label: t('features.stats.customerSupport'), 
      icon: (
        <motion.svg 
          className="w-8 h-8 text-orange-600" 
          fill="currentColor" 
          viewBox="0 0 20 20"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
        </motion.svg>
      )
    },
    { 
      number: "256-bit", 
      label: t('features.stats.sslEncryption'), 
      icon: (
        <motion.svg 
          className="w-8 h-8 text-purple-600" 
          fill="currentColor" 
          viewBox="0 0 20 20"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
        </motion.svg>
      )
    },
    { 
      number: "50+", 
      label: t('features.stats.paymentMethods'), 
      icon: (
        <motion.svg 
          className="w-8 h-8 text-emerald-600" 
          fill="currentColor" 
          viewBox="0 0 20 20"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path>
          <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"></path>
        </motion.svg>
      )
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-br from-gray-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-6 py-3 rounded-full bg-teal-100 text-teal-800 text-sm font-medium mb-4"
          >
            <motion.svg 
              className="w-5 h-5 mr-2 text-teal-600" 
              fill="currentColor" 
              viewBox="0 0 20 20"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </motion.svg>
            {t('features.whyErshaEcosystem')}
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="heading-lg text-gray-900 mb-6"
          >
            {t('features.empoweringEthiopian')}
            <span className="text-gradient block">{t('features.agricultureTogether')}</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            {t('features.discoverPowerfulFeatures')}
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onHoverStart={() => setHoveredFeature(index)}
              onHoverEnd={() => setHoveredFeature(null)}
              className="group relative"
            >
              <div className="relative card h-full overflow-hidden border-2 border-transparent hover:border-teal-200 transition-all duration-300">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-24 h-24 opacity-5 overflow-hidden rounded-full">
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-400 rounded-full"></div>
                </div>

                {/* Icon Container */}
                <motion.div
                  animate={{
                    scale: hoveredFeature === index ? 1.1 : 1,
                    rotate: hoveredFeature === index ? 5 : 0,
                  }}
                  className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 shadow-lg overflow-hidden`}
                >
                  {feature.icon}
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-teal-700 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                {/* Benefits List */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: hoveredFeature === index ? 1 : 0,
                    height: hoveredFeature === index ? "auto" : 0,
                  }}
                  className="overflow-hidden"
                >
                  <ul className="space-y-2 mb-4">
                    {feature.benefits.map((benefit, idx) => (
                      <motion.li
                        key={benefit}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{
                          opacity: hoveredFeature === index ? 1 : 0,
                          x: hoveredFeature === index ? 0 : -20,
                        }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2 flex-shrink-0"></span>
                        {benefit}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 px-4 bg-gradient-to-r ${feature.color} text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100`}
                >
                  {t('common.learnMore')}
                </motion.button>

                {/* Hover Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-lg`}></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section - "Trusted by Thousands" */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            {t('features.trustedBy')} <span className="text-gradient">{t('features.thousands')}</span>
          </motion.h3>
          <p className="text-lg text-gray-600 mb-12">
            {t('features.joinGrowingCommunity')}
          </p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="card text-center group hover:shadow-xl transition-all duration-300"
              >
                <div className="flex justify-center mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button className="btn-primary bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-lg px-8 py-4 shadow-xl hover:shadow-2xl flex items-center space-x-3 mx-auto">
              <motion.svg 
                className="w-5 h-5" 
                fill="currentColor" 
                viewBox="0 0 20 20"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </motion.svg>
              <span>{t('features.startJourneyToday')}</span>
            </button>
          </motion.div>
          
          <p className="text-gray-500 mt-4">
            {t('features.joinOverFarmers')}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;