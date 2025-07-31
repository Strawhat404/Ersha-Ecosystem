import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';
import 'package:ersha_ecosystem_mobile/src/common/common_banner_appbar.dart';
import 'package:ersha_ecosystem_mobile/src/common/common_drawer.dart';

class PaymentScreen extends StatefulWidget {
  const PaymentScreen({super.key});

  @override
  State<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  int _activeTab = 0;

  // Mock data
  final double balance = 8540.50;
  final double pendingPayouts = 1890.50;
  final List<Map<String, dynamic>> transactions = [
    {
      'id': 'TXN001',
      'type': 'sale',
      'amount': 2450.00,
      'status': 'completed',
      'date': '2024-03-15',
      'party': 'Addis Market Hub',
      'product': 'Premium Fresh Carrots',
      'quantity': '500kg',
      'method': 'M-Pesa',
      'escrowStatus': 'released',
    },
    {
      'id': 'TXN002',
      'type': 'purchase',
      'amount': 1890.50,
      'status': 'pending',
      'date': '2024-03-14',
      'party': 'Highland Coffee Growers',
      'product': 'Ethiopian Coffee Beans',
      'quantity': '100kg',
      'method': 'CBE Birr',
      'escrowStatus': 'holding',
    },
    {
      'id': 'TXN003',
      'type': 'sale',
      'amount': 3200.00,
      'status': 'completed',
      'date': '2024-03-13',
      'party': 'Fresh Foods Ltd',
      'product': 'Sweet Red Apples',
      'quantity': '800kg',
      'method': 'Bank Transfer',
      'escrowStatus': 'released',
    },
  ];

  final List<Map<String, dynamic>> paymentMethods = [
    {
      'type': 'mobile',
      'provider': 'M-Pesa',
      'number': '+251-9**-***-789',
      'isDefault': true,
      'verified': true,
    },
    {
      'type': 'bank',
      'provider': 'Commercial Bank of Ethiopia',
      'account': '****-****-1234',
      'isDefault': false,
      'verified': true,
    },
    {
      'type': 'digital',
      'provider': 'HelloCash',
      'number': '+251-9**-***-456',
      'isDefault': false,
      'verified': false,
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
                  "Payment Dashboard",
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.white),
                ),
                const SizedBox(height: 12),
                Text(
                  "Manage your finances, track transactions, and handle payments securely.",
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 15, color: Colors.white70),
                ),
              ],
            ),
          ),
          _buildBalanceCards(),
          _buildTabs(),
          Expanded(child: _buildTabContent()),
        ],
      ),
      backgroundColor: const Color(0xFFF6F6F6),
    );
  }

  Widget _buildBalanceCards() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          _infoCard('Total Balance', 'ETB ${balance.toStringAsFixed(2)}', Iconsax.wallet_2, Colors.teal),
          _infoCard('Monthly Income', 'ETB ${(balance + pendingPayouts).toStringAsFixed(2)}', Iconsax.trend_up, Colors.orange),
          _infoCard('Pending Payments', 'ETB ${pendingPayouts.toStringAsFixed(2)}', Iconsax.clock, Colors.purple),
        ],
      ),
    );
  }

  Widget _infoCard(String title, String value, IconData icon, Color color) {
    return Card(
      color: color.withOpacity(0.1),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Container(
        width: 120,
        height: 140,
        padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 12),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: color, size: 32),
            const SizedBox(height: 10),
            Text(value, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: color)),
            const SizedBox(height: 4),
            Text(title, style: TextStyle(fontSize: 11, color: color.withOpacity(0.7))),
          ],
        ),
      ),
    );
  }

  Widget _buildTabs() {
    final tabs = ['Overview', 'Transactions', 'Payment Methods'];
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: List.generate(tabs.length, (i) {
          final isActive = _activeTab == i;
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4.0),
            child: ElevatedButton(
              onPressed: () => setState(() => _activeTab = i),
              style: ElevatedButton.styleFrom(
                backgroundColor: isActive ? const Color(0xFF14532d) : Colors.white,
                foregroundColor: isActive ? Colors.white : Colors.teal,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                elevation: isActive ? 4 : 0,
              ),
              child: Text(tabs[i]),
            ),
          );
        }),
      ),
    );
  }

  Widget _buildTabContent() {
    switch (_activeTab) {
      case 0:
        return _buildOverview();
      case 1:
        return _buildTransactions();
      case 2:
        return _buildPaymentMethods();
      default:
        return Container();
    }
  }

  Widget _buildOverview() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text('Quick Actions', style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            _actionButton('Request Payout', Iconsax.money_send, Colors.teal),
            _actionButton('Add Payment Method', Iconsax.card, Colors.blue),
            _actionButton('Generate Invoice', Iconsax.document, Colors.purple),
            _actionButton('View Reports', Iconsax.chart, Colors.orange),
          ],
        ),
        const SizedBox(height: 24),
        Text('Recent Transactions', style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 12),
        ...transactions.take(3).map((txn) => _transactionTile(txn)),
      ],
    );
  }

  Widget _actionButton(String label, IconData icon, Color color) {
    return Column(
      children: [
        CircleAvatar(
          backgroundColor: color.withOpacity(0.2),
          child: Icon(icon, color: color),
        ),
        const SizedBox(height: 4),
        Text(label, style: TextStyle(fontSize: 12, color: color)),
      ],
    );
  }

  Widget _buildTransactions() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Transaction History', style: Theme.of(context).textTheme.titleMedium),
            Row(
              children: [
                TextButton(onPressed: () {}, child: const Text('Export CSV')),
                ElevatedButton(onPressed: () {}, child: const Text('Download Report')),
              ],
            ),
          ],
        ),
        const SizedBox(height: 12),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: DataTable(
            columns: const [
              DataColumn(label: Text('ID')),
              DataColumn(label: Text('Type')),
              DataColumn(label: Text('Product')),
              DataColumn(label: Text('Amount')),
              DataColumn(label: Text('Status')),
              DataColumn(label: Text('Escrow')),
              DataColumn(label: Text('Date')),
              DataColumn(label: Text('Actions')),
            ],
            rows: transactions.map((txn) => DataRow(cells: [
              DataCell(Text(txn['id'])),
              DataCell(Text(txn['type'])),
              DataCell(Text(txn['product'])),
              DataCell(Text('ETB ${txn['amount'].toStringAsFixed(2)}')),
              DataCell(Text(txn['status'])),
              DataCell(Text(txn['escrowStatus'])),
              DataCell(Text(txn['date'])),
              DataCell(TextButton(onPressed: () {}, child: const Text('View'))),
            ])).toList(),
          ),
        ),
      ],
    );
  }

  Widget _buildPaymentMethods() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Payment Methods', style: Theme.of(context).textTheme.titleMedium),
            ElevatedButton(onPressed: () {}, child: const Text('Add New Method')),
          ],
        ),
        const SizedBox(height: 12),
        ...paymentMethods.map((method) => Card(
          margin: const EdgeInsets.symmetric(vertical: 8),
          child: ListTile(
            leading: Icon(
              method['type'] == 'mobile' ? Iconsax.mobile :
              method['type'] == 'bank' ? Iconsax.bank : Iconsax.card,
              color: Colors.teal,
            ),
            title: Text(method['provider']),
            subtitle: Text(method['type'] == 'bank' ? method['account'] ?? '' : method['number'] ?? ''),
            trailing: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (method['verified'])
                  Chip(label: const Text('Verified'), backgroundColor: Colors.green[100]),
                if (method['isDefault'])
                  Chip(label: const Text('Default'), backgroundColor: Colors.teal[100]),
              ],
            ),
          ),
        )),
        const SizedBox(height: 24),
        Text('Add Payment Method', style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            _methodOption('M-Pesa', Iconsax.mobile, 'Mobile money transfer'),
            _methodOption('Bank Account', Iconsax.bank, 'Direct bank transfer'),
            _methodOption('Digital Wallet', Iconsax.card, 'HelloCash, Telebirr'),
          ],
        ),
      ],
    );
  }

  Widget _methodOption(String label, IconData icon, String desc) {
    return Column(
      children: [
        CircleAvatar(
          backgroundColor: Colors.teal.withOpacity(0.2),
          child: Icon(icon, color: Colors.teal),
        ),
        const SizedBox(height: 4),
        Text(label, style: const TextStyle(fontSize: 12, color: Colors.teal)),
        Text(desc, style: const TextStyle(fontSize: 10, color: Colors.grey)),
      ],
    );
  }

  Widget _transactionTile(Map<String, dynamic> txn) {
    return Card(
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: txn['type'] == 'sale' ? Colors.teal[100] : Colors.orange[100],
          child: Icon(
            txn['type'] == 'sale' ? Iconsax.arrow_down_1 : Iconsax.arrow_up_1,
            color: txn['type'] == 'sale' ? Colors.teal : Colors.orange,
          ),
        ),
        title: Text(txn['product']),
        subtitle: Text(txn['party']),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('${txn['type'] == 'sale' ? '+' : '-'}ETB ${txn['amount'].toStringAsFixed(2)}', style: const TextStyle(fontWeight: FontWeight.bold)),
            Text(txn['status'], style: TextStyle(color: txn['status'] == 'completed' ? Colors.green : Colors.orange, fontSize: 12)),
          ],
        ),
      ),
    );
  }
}
