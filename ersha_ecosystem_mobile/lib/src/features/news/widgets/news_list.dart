import 'package:flutter/material.dart';

class NewsList extends StatelessWidget {
  const NewsList({super.key});

  @override
  Widget build(BuildContext context) {
    final newsItems = [
      {
        'title': 'Ethiopian Farmers Adopt New Irrigation Techniques',
        'summary': 'Innovative irrigation methods are boosting crop yields in Oromia and Amhara regions.',
        'imageUrl': 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=300&fit=crop',
        'date': 'July 30, 2025',
      },
      {
        'title': 'Climate-Smart Agriculture Gains Momentum',
        'summary': 'Farmers are embracing climate-resilient crops and practices to adapt to changing weather.',
        'imageUrl': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
        'date': 'July 28, 2025',
      },
      {
        'title': 'Market Prices for Teff Reach New Highs',
        'summary': 'Teff prices surge due to increased demand and limited supply in local markets.',
        'imageUrl': 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400&h=300&fit=crop',
        'date': 'July 25, 2025',
      },
    ];
    return ListView.separated(
      physics: const NeverScrollableScrollPhysics(),
      shrinkWrap: true,
      itemCount: newsItems.length,
      separatorBuilder: (context, index) => const SizedBox(height: 16),
      itemBuilder: (context, index) {
        final item = newsItems[index];
        return Card(
          elevation: 4,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              ClipRRect(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
                child: Image.network(
                  item['imageUrl']!,
                  height: 160,
                  width: double.infinity,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) => Container(
                    height: 160,
                    color: Colors.grey[200],
                    child: const Icon(Icons.image, size: 40, color: Colors.grey),
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(item['title']!, style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    Text(item['summary']!, style: Theme.of(context).textTheme.bodyMedium),
                    const SizedBox(height: 8),
                    Text(item['date']!, style: TextStyle(color: Colors.green[700], fontSize: 12)),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
