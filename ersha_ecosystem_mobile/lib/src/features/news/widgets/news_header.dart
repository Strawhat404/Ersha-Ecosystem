import 'package:flutter/material.dart';

class NewsHeader extends StatelessWidget {
  const NewsHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          'Agricultural News',
          style: Theme.of(context).textTheme.headlineMedium?.copyWith(
            fontWeight: FontWeight.bold,
            color: Colors.green[900],
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 8),
        Text(
          'Latest updates and stories from Ethiopia and global agriculture',
          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
            color: Colors.green[700],
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }
}
