import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';
import 'package:ersha_ecosystem_mobile/src/common/common_banner_appbar.dart';
import 'package:ersha_ecosystem_mobile/src/common/common_drawer.dart';

class FaydaIntegrationScreen extends StatelessWidget {
  const FaydaIntegrationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const CommonBannerAppBar(),
      drawer: const CommonDrawer(),
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: _HeroSection(),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  const SizedBox(height: 24),
                  Wrap(
                    spacing: 16,
                    runSpacing: 16,
                    children: const [
                      _FaydaFeatureCard(
                        icon: Icons.verified_user,
                        iconColor: Colors.green,
                        title: 'eKYC Verification',
                        description: 'Farmers register using Fayda Digital ID for instant identity verification and fraud prevention.',
                        borderColor: Colors.green,
                      ),
                      _FaydaFeatureCard(
                        icon: Icons.check_circle,
                        iconColor: Colors.blue,
                        title: 'Verified Transactions',
                        description: 'Only verified users can buy, sell, and access platform features, ensuring secure and trusted exchanges.',
                        borderColor: Colors.blue,
                      ),
                      _FaydaFeatureCard(
                        icon: Icons.attach_money,
                        iconColor: Colors.orange,
                        title: 'Loan & Subsidy Profiles',
                        description: 'Build financial identity and access loans or subsidies based on verified crop sales and credit history.',
                        borderColor: Colors.orange,
                      ),
                      _FaydaFeatureCard(
                        icon: Icons.bar_chart,
                        iconColor: Colors.purple,
                        title: 'Government & NGO Reporting',
                        description: 'Trusted data for reporting and subsidy distribution, integrated with national infrastructure.',
                        borderColor: Colors.purple,
                      ),
                    ],
                  ),
                  const SizedBox(height: 32),
                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF14532d),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 18),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(32)),
                      elevation: 8,
                    ),
                    icon: const Icon(Icons.verified_user, size: 28),
                    label: const Text(
                      'Verify with Fayda Digital ID',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    onPressed: () {},
                  ),
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _HeroSection extends StatelessWidget {
  const _HeroSection();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(16, 60, 16, 50),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF052e16), Color(0xFF14532d)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Column(
        children: [
          const Text(
            "Fayda National Digital ID Integration",
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: Colors.white),
          ),
          const SizedBox(height: 16),
          Text(
            "Securely verify farmer identities, enable trusted transactions, and unlock financial services with Fayda’s eKYC.",
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 16, color: Colors.white.withOpacity(0.9)),
          ),
          const SizedBox(height: 32),
          _buildStats(),
        ],
      ),
    );
  }

  Widget _buildStats() {
    final statsData = [
      {'icon': Iconsax.shield_tick, 'label': "Verified Farmers", 'value': "2,100+"},
      {'icon': Iconsax.document_text, 'label': "eKYC Verifications", 'value': "5,800+"},
      {'icon': Iconsax.money_3, 'label': "Loans Enabled", 'value': "1,200+"},
      {'icon': Iconsax.barcode, 'label': "Digital IDs Linked", 'value': "7,400+"}
    ];

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: statsData.map((stat) {
        return Column(
          children: [
            Container(
              width: 56,
              height: 56,
              margin: const EdgeInsets.only(bottom: 8),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.2),
                shape: BoxShape.circle,
              ),
              child: Icon(stat['icon'] as IconData, color: Colors.white, size: 28),
            ),
            Text(stat['value'] as String, style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
            Text(stat['label'] as String, style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 12)),
          ],
        );
      }).toList(),
    );
  }
}

class _FaydaFeatureCard extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final String title;
  final String description;
  final Color borderColor;

  const _FaydaFeatureCard({
    required this.icon,
    required this.iconColor,
    required this.title,
    required this.description,
    required this.borderColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 320,
      constraints: const BoxConstraints(minHeight: 160),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.85),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: borderColor.withOpacity(0.3), width: 2),
        boxShadow: [BoxShadow(color: borderColor.withOpacity(0.08), blurRadius: 8, offset: Offset(0, 2))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: iconColor, size: 32),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF14532d)),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            description,
            style: const TextStyle(fontSize: 15, color: Colors.black87),
          ),
        ],
      ),
    );
  }
}
