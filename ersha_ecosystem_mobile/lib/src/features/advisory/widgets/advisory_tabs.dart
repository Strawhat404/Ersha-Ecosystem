import 'package:flutter/material.dart';

class AdvisoryTabs extends StatelessWidget {
  final String activeTab;
  final ValueChanged<String> onTabChanged;
  const AdvisoryTabs({super.key, required this.activeTab, required this.onTabChanged});

  @override
  Widget build(BuildContext context) {
    final tabs = [
      {'id': 'advice', 'label': 'Expert Advice'},
      {'id': 'courses', 'label': 'Training Courses'},
      {'id': 'resources', 'label': 'Resources'},
    ];
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      color: Colors.white,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 4),
        child: SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: tabs.map((tab) {
              final isActive = tab['id'] == activeTab;
              return Padding(
                padding: const EdgeInsets.symmetric(horizontal: 4),
                child: ChoiceChip(
                  label: Text(tab['label']!),
                  selected: isActive,
                  onSelected: (_) => onTabChanged(tab['id']!),
                  selectedColor: Colors.green[600],
                  backgroundColor: Colors.green[50],
                  labelStyle: TextStyle(
                    color: isActive ? Colors.white : Colors.green[900],
                    fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
                  ),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
              );
            }).toList(),
          ),
        ),
      ),
    );
  }
}
