import { ShieldCheck, UserCheck, Banknote, BarChart3, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FaydaIntegration() {
  return (
    <section className="py-20 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-black text-gray-900 mb-6 leading-tight">
            Fayda National Digital ID Integration
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8 leading-relaxed">
            Securely verify farmer identities, enable trusted transactions, and unlock financial services with Fayda’s eKYC.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-100"
          >
            <div className="flex items-center mb-4">
              <ShieldCheck className="w-8 h-8 text-emerald-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">eKYC Verification</h3>
            </div>
            <p className="text-gray-600 mb-2">
              Farmers register using Fayda Digital ID for instant identity verification and fraud prevention.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-100"
          >
            <div className="flex items-center mb-4">
              <UserCheck className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">Verified Transactions</h3>
            </div>
            <p className="text-gray-600 mb-2">
              Only verified users can buy, sell, and access platform features, ensuring secure and trusted exchanges.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-orange-100"
          >
            <div className="flex items-center mb-4">
              <Banknote className="w-8 h-8 text-orange-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">Loan & Subsidy Profiles</h3>
            </div>
            <p className="text-gray-600 mb-2">
              Build financial identity and access loans or subsidies based on verified crop sales and credit history.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-purple-100"
          >
            <div className="flex items-center mb-4">
              <BarChart3 className="w-8 h-8 text-purple-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">Government & NGO Reporting</h3>
            </div>
            <p className="text-gray-600 mb-2">
              Trusted data for reporting and subsidy distribution, integrated with national infrastructure.
            </p>
          </motion.div>
        </div>
        <div className="mt-12 text-center">
          <motion.button
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white px-10 py-5 rounded-full text-lg font-bold shadow-2xl hover:shadow-green-500/30 transition-all duration-300 inline-flex items-center"
          >
            <Users className="w-6 h-6 mr-3" />
            <span>Verify with Fayda Digital ID</span>
          </motion.button>
        </div>
      </div>
    </section>
  );
}
