import 'package:flutter/material.dart';
import '../widgets/advisory_tabs.dart';
import '../widgets/expert_card.dart';

class AdvisoryScreen extends StatefulWidget {
  const AdvisoryScreen({super.key});

  @override
  State<AdvisoryScreen> createState() => _AdvisoryScreenState();
}

class _AdvisoryScreenState extends State<AdvisoryScreen> {
  String activeTab = 'advice';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFFe0f7fa), Color(0xFFa5d6a7)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 0, vertical: 0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(
                    'Agricultural Advisory Hub',
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: Colors.green[900],
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16),
                  AdvisoryTabs(
                    activeTab: activeTab,
                    onTabChanged: (tab) => setState(() => activeTab = tab),
                  ),
                  const SizedBox(height: 24),
                  if (activeTab == 'advice') ...[
                    // Example expert cards
                    ExpertCard(
                      name: 'Dr. Alemayehu Bekele',
                      specialization: 'Crop Management',
                      experience: '15 years',
                      rating: 4.9,
                      bio: 'Expert in sustainable farming practices and crop rotation techniques.',
                      availability: 'Available',
                      imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop',
                    ),
                    const SizedBox(height: 16),
                    ExpertCard(
                      name: 'Sara Mekonnen',
                      specialization: 'Livestock Management',
                      experience: '12 years',
                      rating: 4.8,
                      bio: 'Specializes in dairy farming and animal nutrition programs.',
                      availability: 'Busy',
                      imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop',
                    ),
                    // Add more ExpertCards as needed
                  ] else if (activeTab == 'courses') ...[
                    // Placeholder for courses
                    Center(child: Text('Training Courses coming soon!', style: TextStyle(color: Colors.green[700]))),
                  ] else if (activeTab == 'resources') ...[
                    // Placeholder for resources
                    Center(child: Text('Resources coming soon!', style: TextStyle(color: Colors.green[700]))),
                  ],
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
