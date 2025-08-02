import 'package:flutter/material.dart';

class NewsDetailScreen extends StatelessWidget {
  final Map<String, dynamic> article;
  const NewsDetailScreen({super.key, required this.article});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(article['title'] ?? 'News Detail'),
        backgroundColor: const Color(0xFF14532d),
        iconTheme: const IconThemeData(color: Colors.white),
        titleTextStyle: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 20),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            if (article['image'] != null)
              ClipRRect(
                borderRadius: const BorderRadius.only(
                  bottomLeft: Radius.circular(24),
                  bottomRight: Radius.circular(24),
                ),
                child: Image.network(
                  article['image'],
                  height: 240,
                  width: double.infinity,
                  fit: BoxFit.cover,
                ),
              ),
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    article['title'] ?? '',
                    style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Color(0xFF14532d)),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(article['author'] ?? '', style: const TextStyle(color: Colors.grey)),
                      Text(article['readTime'] ?? '', style: const TextStyle(color: Colors.grey)),
                    ],
                  ),
                  const SizedBox(height: 18),
                  Text(
                    article['excerpt'] ?? '',
                    style: const TextStyle(fontSize: 18, color: Colors.black87),
                  ),
                  // You can add more detailed content here if available
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
