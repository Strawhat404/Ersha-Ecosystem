import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';
import 'package:ersha_ecosystem_mobile/src/common/common_banner_appbar.dart';
import 'package:ersha_ecosystem_mobile/src/common/common_drawer.dart';

class LogisticsTrackingScreen extends StatefulWidget {
  const LogisticsTrackingScreen({super.key});

  @override
  State<LogisticsTrackingScreen> createState() => _LogisticsTrackingScreenState();
}

class _LogisticsTrackingScreenState extends State<LogisticsTrackingScreen> {
  int _activeTab = 0;

  // Mock data
  final List<Map<String, dynamic>> deliveries = [
    {
      'id': 'DEL001',
      'orderId': 'ORD2024001',
      'product': 'Premium Fresh Carrots',
      'quantity': '500kg',
      'origin': 'Oromia Farm',
      'destination': 'Addis Market Hub',
      'status': 'in_transit',
      'estimatedDelivery': '2024-03-16',
      'trackingNumber': 'TR123456789ET',
      'provider': 'FastFreight Ethiopia',
      'cost': 450.00,
      'distance': '85km',
      'currentLocation': 'Bishoftu Checkpoint',
      'progress': 65,
    },
    {
      'id': 'DEL002',
      'orderId': 'ORD2024002',
      'product': 'Ethiopian Coffee Beans',
      'quantity': '100kg',
      'origin': 'Highland Coffee Growers',
      'destination': 'Hawassa Distribution',
      'status': 'delivered',
      'estimatedDelivery': '2024-03-14',
      'trackingNumber': 'TR987654321ET',
      'provider': 'EthioLogistics',
      'cost': 280.00,
      'distance': '45km',
      'currentLocation': 'Hawassa Warehouse',
      'progress': 100,
    },
    {
      'id': 'DEL003',
      'orderId': 'ORD2024003',
      'product': 'Sweet Red Apples',
      'quantity': '800kg',
      'origin': 'AwashAgro Industry',
      'destination': 'Fresh Foods Ltd',
      'status': 'pending',
      'estimatedDelivery': '2024-03-17',
      'trackingNumber': 'TR555666777ET',
      'provider': 'RapidTransport',
      'cost': 720.00,
      'distance': '120km',
      'currentLocation': 'Awaiting Pickup',
      'progress': 0,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const CommonBannerAppBar(),
      drawer: const CommonDrawer(),
      body: Column(
        children: [
          // Hero Section
          Container(
            width: double.infinity,
            padding: const EdgeInsets.fromLTRB(16, 40, 16, 32),
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFF052e16), Color(0xFF14532d)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                const Text(
                  "Logistic Tracking",
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.white),
                ),
                const SizedBox(height: 12),
                Text(
                  "Track your agricultural deliveries, monitor progress, and manage logistics with ease.",
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 15, color: Colors.white70),
                ),
              ],
            ),
          ),
          _buildStatsCards(),
          _buildTabs(),
          Expanded(child: _buildTabContent()),
        ],
      ),
      backgroundColor: const Color(0xFFF6F6F6),
    );
  }

  Widget _buildStatsCards() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          _infoCard('Active Deliveries', deliveries.where((d) => d['status'] == 'in_transit').length.toString(), Iconsax.truck_fast, Colors.blue),
          _infoCard('Delivered', deliveries.where((d) => d['status'] == 'delivered').length.toString(), Iconsax.check, Colors.green),
          _infoCard('Pending', deliveries.where((d) => d['status'] == 'pending').length.toString(), Iconsax.warning_2, Colors.orange),
          _infoCard('Avg Cost', 'ETB ${_avgCost()}', Iconsax.trend_up, Colors.purple),
        ],
      ),
    );
  }

  String _avgCost() {
    if (deliveries.isEmpty) return '0';
    final total = deliveries.fold(0.0, (sum, d) => sum + (d['cost'] as double));
    return (total / deliveries.length).toStringAsFixed(0);
  }

  Widget _infoCard(String title, String value, IconData icon, Color color) {
    return Card(
      color: color.withOpacity(0.1),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Container(
        width: 90,
        height: 110,
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 6),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: color, size: 20),
            const SizedBox(height: 6),
            Text(value, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: color)),
            const SizedBox(height: 2),
            Text(title, style: TextStyle(fontSize: 9, color: color.withOpacity(0.7))),
          ],
        ),
      ),
    );
  }

  Widget _buildTabs() {
    final tabs = ['Track Deliveries', 'Cost Calculator', 'Service Providers'];
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(tabs.length, (i) {
            final isActive = _activeTab == i;
            return Padding(
              padding: const EdgeInsets.symmetric(horizontal: 4.0),
              child: ElevatedButton(
                onPressed: () => setState(() => _activeTab = i),
                style: ElevatedButton.styleFrom(
                  backgroundColor: isActive ? Colors.blue[800] : Colors.white,
                  foregroundColor: isActive ? Colors.white : Colors.blue,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  elevation: isActive ? 4 : 0,
                ),
                child: Text(tabs[i]),
              ),
            );
          }),
        ),
      ),
    );
  }

  Widget _buildTabContent() {
    switch (_activeTab) {
      case 0:
        return _buildTracking();
      case 1:
        return Center(child: Text('Cost Calculator (Coming Soon)'));
      case 2:
        return Center(child: Text('Service Providers (Coming Soon)'));
      default:
        return Container();
    }
  }

  Widget _buildTracking() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: deliveries.length,
      itemBuilder: (context, index) {
        final delivery = deliveries[index];
        return Card(
          margin: const EdgeInsets.symmetric(vertical: 8),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(delivery['product'], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    Chip(label: Text(delivery['status'].toString().replaceAll('_', ' ').toUpperCase())),
                  ],
                ),
                const SizedBox(height: 8),
                Text('Order #${delivery['orderId']} • ${delivery['quantity']}'),
                Text('Tracking: ${delivery['trackingNumber']}'),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Icon(Iconsax.map, size: 16, color: Colors.blue),
                    const SizedBox(width: 4),
                    Text('From: ${delivery['origin']}'),
                    const SizedBox(width: 12),
                    Icon(Iconsax.map_1, size: 16, color: Colors.green),
                    const SizedBox(width: 4),
                    Text('To: ${delivery['destination']}'),
                  ],
                ),
                const SizedBox(height: 8),
                Text('Provider: ${delivery['provider']}'),
                Text('Cost: ETB ${delivery['cost']}'),
                Text('Expected: ${delivery['estimatedDelivery']}'),
                Text('Current: ${delivery['currentLocation']}'),
                const SizedBox(height: 8),
                LinearProgressIndicator(
                  value: (delivery['progress'] as int) / 100,
                  backgroundColor: Colors.grey[300],
                  color: Colors.blue,
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    ElevatedButton(
                      onPressed: () {},
                      child: const Text('Track Live'),
                    ),
                    const SizedBox(width: 8),
                    OutlinedButton(
                      onPressed: () {},
                      child: const Text('Contact Driver'),
                    ),
                    const SizedBox(width: 8),
                    TextButton(
                      onPressed: () {},
                      child: const Text('View Details'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
