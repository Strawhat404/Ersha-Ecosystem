import 'package:flutter/material.dart';

class ExpertCard extends StatelessWidget {
  final String name;
  final String specialization;
  final String experience;
  final double rating;
  final String bio;
  final String availability;
  final String imageUrl;
  final VoidCallback? onTap;

  const ExpertCard({
    super.key,
    required this.name,
    required this.specialization,
    required this.experience,
    required this.rating,
    required this.bio,
    required this.availability,
    required this.imageUrl,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(24),
      onTap: onTap,
      child: Card(
        elevation: 6,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        color: Colors.white,
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(40),
                child: Image.network(
                  imageUrl,
                  width: 80,
                  height: 80,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) => Container(
                    width: 80,
                    height: 80,
                    color: Colors.grey[200],
                    child: const Icon(Icons.person, size: 40, color: Colors.grey),
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(name, style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 4),
                    Text(specialization, style: TextStyle(color: Colors.green[700], fontWeight: FontWeight.w500)),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Icon(Icons.star, color: Colors.amber, size: 18),
                        Text(rating.toString(), style: TextStyle(color: Colors.amber[800], fontWeight: FontWeight.bold)),
                        const SizedBox(width: 8),
                        Text(experience, style: TextStyle(color: Colors.grey[600])),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(bio, style: TextStyle(color: Colors.grey[800], fontSize: 13)),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Icon(Icons.circle, color: availability == 'Available' ? Colors.green : Colors.red, size: 12),
                        const SizedBox(width: 4),
                        Text(availability, style: TextStyle(color: availability == 'Available' ? Colors.green : Colors.red)),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
