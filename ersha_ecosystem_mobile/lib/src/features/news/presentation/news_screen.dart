import 'package:flutter/material.dart';
import 'package:ersha_ecosystem_mobile/src/common/common_banner_appbar.dart';
import 'package:ersha_ecosystem_mobile/src/common/common_drawer.dart';
import '../widgets/news_header.dart';
import '../widgets/news_list.dart';

class NewsScreen extends StatefulWidget {
  const NewsScreen({super.key});

  @override
  State<NewsScreen> createState() => _NewsScreenState();
}

class _NewsScreenState extends State<NewsScreen> {
  String searchQuery = "";
  String selectedCategory = "all";
  final List<Map<String, dynamic>> categories = [
    {"id": "all", "name": "All News"},
    {"id": "market", "name": "Market Trends"},
    {"id": "technology", "name": "Farm Tech"},
    {"id": "climate", "name": "Weather & Climate"},
    {"id": "policy", "name": "Policy & Regulations"},
  ];

  // Example articles
  final List<Map<String, dynamic>> articles = [
    {
      "id": 1,
      "title": "Ethiopian Market Prices Surge",
      "excerpt": "Recent trends show a significant increase in crop prices across major regions.",
      "author": "Alemu Tadesse",
      "date": DateTime.now().subtract(const Duration(days: 2)),
      "category": "market",
      "featured": true,
      "readTime": "3 min read",
      "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop"
    },
    {
      "id": 2,
      "title": "New Farm Tech Innovations",
      "excerpt": "Discover the latest tools and technologies revolutionizing Ethiopian agriculture.",
      "author": "Sara Mekonnen",
      "date": DateTime.now().subtract(const Duration(days: 5)),
      "category": "technology",
      "featured": false,
      "readTime": "5 min read",
      "image": "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=600&h=400&fit=crop"
    },
    {
      "id": 3,
      "title": "Climate Change Impact on Crops",
      "excerpt": "Farmers adapt to changing weather patterns with new strategies.",
      "author": "Tesfaye Bekele",
      "date": DateTime.now().subtract(const Duration(days: 1)),
      "category": "climate",
      "featured": false,
      "readTime": "4 min read",
      "image": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&h=400&fit=crop"
    },
    {
      "id": 4,
      "title": "New Agricultural Policy Announced",
      "excerpt": "Government introduces new regulations to support local farmers.",
      "author": "Ministry of Agriculture",
      "date": DateTime.now().subtract(const Duration(days: 3)),
      "category": "policy",
      "featured": true,
      "readTime": "2 min read",
      "image": "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=600&h=400&fit=crop"
    },
  ];

  List<Map<String, dynamic>> get filteredArticles {
    List<Map<String, dynamic>> filtered = articles;
    if (selectedCategory != "all") {
      filtered = filtered.where((a) => a["category"] == selectedCategory).toList();
    }
    if (searchQuery.isNotEmpty) {
      filtered = filtered.where((a) => a["title"].toLowerCase().contains(searchQuery.toLowerCase()) || a["excerpt"].toLowerCase().contains(searchQuery.toLowerCase())).toList();
    }
    filtered.sort((a, b) => b["date"].compareTo(a["date"]));
    return filtered;
  }

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
                  Container(
                    padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 24),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: const Text(
                      "Latest Agricultural News",
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                        letterSpacing: 1.1,
                      ),
                    ),
                  ),
                  const SizedBox(height: 18),
                  const Text(
                    "Stay Informed with Industry Insights",
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    "Get the latest news, market trends, and expert insights to stay ahead in the ever-evolving agricultural landscape.",
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 16, color: Colors.white.withOpacity(0.9)),
                  ),
                  const SizedBox(height: 24),
                  // Search Bar
                  Container(
                    margin: const EdgeInsets.only(bottom: 16),
                    child: TextField(
                      decoration: InputDecoration(
                        hintText: "Search news articles, topics, or keywords...",
                        filled: true,
                        fillColor: Colors.white,
                        prefixIcon: const Icon(Icons.search, color: Color(0xFF14532d)),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: const BorderSide(color: Color(0xFF14532d)),
                        ),
                      ),
                      onChanged: (val) => setState(() => searchQuery = val),
                      style: const TextStyle(color: Color(0xFF14532d)),
                    ),
                  ),
                  // Category Tabs
                  SizedBox(
                    height: 48,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: categories.length,
                      separatorBuilder: (_, __) => const SizedBox(width: 8),
                      itemBuilder: (context, idx) {
                        final cat = categories[idx];
                        final bool selected = selectedCategory == cat["id"];
                        return ChoiceChip(
                          label: Text(
                            cat["name"],
                            style: TextStyle(
                              color: selected ? Colors.white : Colors.black,
                            ),
                          ),
                          selected: selected,
                          selectedColor: const Color(0xFF14532d),
                          backgroundColor: Colors.white.withOpacity(0.15),
                          onSelected: (_) => setState(() => selectedCategory = cat["id"]),
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 24),
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
                  if (filteredArticles.isEmpty)
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 48),
                      child: Column(
                        children: const [
                          Icon(Icons.info_outline, color: Colors.grey, size: 48),
                          SizedBox(height: 12),
                          Text("No articles found", style: TextStyle(color: Colors.grey, fontSize: 18)),
                        ],
                      ),
                    ),
                  if (filteredArticles.isNotEmpty)
                    ...filteredArticles.map((article) => Container(
                      margin: const EdgeInsets.only(bottom: 24, left: 16, right: 16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(24),
                        boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 8, offset: Offset(0, 2))],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          ClipRRect(
                            borderRadius: const BorderRadius.only(topLeft: Radius.circular(24), topRight: Radius.circular(24)),
                            child: Image.network(
                              article["image"],
                              height: 180,
                              width: double.infinity,
                              fit: BoxFit.cover,
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.all(20),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(article["title"], style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFF14532d))),
                                const SizedBox(height: 8),
                                Text(article["excerpt"], style: const TextStyle(fontSize: 16, color: Colors.black87)),
                                const SizedBox(height: 12),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(article["author"], style: const TextStyle(color: Colors.grey)),
                                    Text(article["readTime"], style: const TextStyle(color: Colors.grey)),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    )),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
