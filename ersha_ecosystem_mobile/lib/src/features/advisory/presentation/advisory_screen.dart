import 'package:flutter/material.dart';
import 'package:ersha_ecosystem_mobile/src/common/common_banner_appbar.dart';
import 'package:ersha_ecosystem_mobile/src/common/common_drawer.dart';
import '../widgets/advisory_tabs.dart';
import '../widgets/expert_card.dart';

class AdvisoryScreen extends StatefulWidget {
  const AdvisoryScreen({super.key});

  @override
  State<AdvisoryScreen> createState() => _AdvisoryScreenState();
}

class _AdvisoryScreenState extends State<AdvisoryScreen> {
  // Track booking state and message for each expert by name
  final Map<String, bool> _booked = {};
  final Map<String, String> _messages = {};

  void _showExpertDialog({
    required String name,
    required String specialization,
    required String experience,
    required double rating,
    required String bio,
    required String availability,
    required String imageUrl,
  }) {
    bool isBooked = _booked[name] ?? false;
    String message = _messages[name] ?? '';
    TextEditingController controller = TextEditingController(text: message);

    showDialog(
      context: context,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setState) {
            return AlertDialog(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              title: Text(name),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      CircleAvatar(backgroundImage: NetworkImage(imageUrl), radius: 24),
                      const SizedBox(width: 12),
                      Expanded(child: Text(specialization)),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text('Experience: $experience'),
                  Text('Rating: $rating'),
                  Text('Bio: $bio'),
                  Text('Availability: $availability'),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: isBooked ? Colors.red : Colors.green,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    onPressed: () {
                      setState(() {
                        isBooked = !isBooked;
                      });
                      this.setState(() {
                        _booked[name] = isBooked;
                      });
                    },
                    child: Text(isBooked ? 'Unbook Expert' : 'Book Expert'),
                  ),
                  if (isBooked) ...[
                    const SizedBox(height: 16),
                    TextField(
                      controller: controller,
                      decoration: const InputDecoration(
                        labelText: 'Message to Expert',
                        border: OutlineInputBorder(),
                      ),
                      minLines: 1,
                      maxLines: 3,
                      onChanged: (val) {
                        message = val;
                        this.setState(() {
                          _messages[name] = val;
                        });
                      },
                    ),
                    const SizedBox(height: 8),
                    Align(
                      alignment: Alignment.centerRight,
                      child: ElevatedButton(
                        onPressed: () {
                          Navigator.of(context).pop();
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text('Message sent to $name!')),
                          );
                        },
                        child: const Text('Send'),
                      ),
                    ),
                  ],
                ],
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.of(context).pop(),
                  child: const Text('Close'),
                ),
              ],
            );
          },
        );
      },
    );
  }
  String activeTab = 'advice';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const CommonBannerAppBar(),
      drawer: const CommonDrawer(),
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Container(
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
                    "Agricultural Advisory Hub",
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    "Expert advice, training, and resources for Ethiopian farmers.",
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 16, color: Colors.white.withOpacity(0.9)),
                  ),
                  const SizedBox(height: 24),
                  AdvisoryTabs(
                    activeTab: activeTab,
                    onTabChanged: (tab) => setState(() => activeTab = tab),
                  ),
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 0, vertical: 0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  if (activeTab == 'advice') ...[
                    ExpertCard(
                      name: 'Dr. Alemayehu Bekele',
                      specialization: 'Crop Management',
                      experience: '15 years',
                      rating: 4.9,
                      bio: 'Expert in sustainable farming practices and crop rotation techniques.',
                      availability: 'Available',
                      imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop',
                      onTap: () => _showExpertDialog(
                        name: 'Dr. Alemayehu Bekele',
                        specialization: 'Crop Management',
                        experience: '15 years',
                        rating: 4.9,
                        bio: 'Expert in sustainable farming practices and crop rotation techniques.',
                        availability: 'Available',
                        imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop',
                      ),
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
                      onTap: () => _showExpertDialog(
                        name: 'Sara Mekonnen',
                        specialization: 'Livestock Management',
                        experience: '12 years',
                        rating: 4.8,
                        bio: 'Specializes in dairy farming and animal nutrition programs.',
                        availability: 'Busy',
                        imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop',
                      ),
                    ),
                    // Add more ExpertCards as needed
                  ] else if (activeTab == 'courses') ...[
                    Center(child: Text('Training Courses coming soon!', style: TextStyle(color: Colors.green[700]))),
                  ] else if (activeTab == 'resources') ...[
                    Center(child: Text('Resources coming soon!', style: TextStyle(color: Colors.green[700]))),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
