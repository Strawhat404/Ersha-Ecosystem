from django.core.management.base import BaseCommand
from news.models import NewsArticle
from django.utils import timezone

class Command(BaseCommand):
    help = 'Populate the NewsArticle model with sample news data.'

    def handle(self, *args, **options):
        sample_articles = [
            {
                "title": "Ethiopian Coffee Exports Hit Record Highs in 2024",
                "content": "Ethiopian coffee exports have reached unprecedented levels in the first quarter of 2024, with total export revenues increasing by 35% compared to the same period last year. The surge is attributed to several factors including improved quality control measures, favorable weather conditions, and increased international demand for specialty Ethiopian coffee varieties. The Ethiopian Coffee and Tea Authority reports that premium coffee varieties, particularly those from the Yirgacheffe and Sidamo regions, have seen price increases of up to 40% in international markets. This boom is providing much-needed foreign currency for the country and improving livelihoods for over 4 million smallholder coffee farmers.",
                "excerpt": "Coffee exports from Ethiopia reached unprecedented levels this quarter, driven by strong international demand and improved quality standards.",
                "category": "market",
                "tags": ["Export", "Coffee", "Market Analysis"],
                "author": "Dawit Negash",
                "image_url": "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=250&fit=crop&crop=center",
                "featured": True,
                "published_at": timezone.now(),
            },
            {
                "title": "Revolutionary Drone Technology Transforms Ethiopian Farms",
                "content": "Agricultural technology is revolutionizing farming practices across Ethiopia with the introduction of advanced drone systems. These unmanned aerial vehicles equipped with multispectral cameras and AI-powered analytics are helping farmers monitor crop health, detect pest infestations early, and optimize irrigation patterns. The Ministry of Agriculture, in partnership with tech companies, has launched a pilot program covering 500 farms across different regions. Early results show yield improvements of 20-30% and water usage reduction of up to 25%. The drones can cover large areas quickly, providing farmers with detailed maps showing crop health, soil moisture levels, and areas requiring immediate attention.",
                "excerpt": "New agricultural drones are helping farmers monitor crop health, optimize irrigation, and increase yields across the country.",
                "category": "technology",
                "tags": ["Innovation", "Drones", "Smart Farming"],
                "author": "Sara Mekonnen",
                "image_url": "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=250&fit=crop&crop=center",
                "featured": False,
                "published_at": timezone.now(),
            },
            {
                "title": "Climate Change Adaptation Strategies for Ethiopian Agriculture",
                "content": "As climate change continues to pose challenges to agricultural productivity in Ethiopia, researchers and farmers are developing innovative adaptation strategies. A comprehensive study by the International Food Policy Research Institute reveals that drought-resistant crop varieties, improved water management systems, and diversified farming practices are key to maintaining agricultural productivity. The research highlights successful implementations of climate-smart agriculture techniques that have helped farmers in the Tigray and Amhara regions maintain yields despite irregular rainfall patterns. These strategies include conservation agriculture, agroforestry systems, and the use of indigenous crop varieties that are naturally adapted to local climate conditions.",
                "excerpt": "Experts discuss innovative approaches to help farmers adapt to changing climate patterns and maintain productivity.",
                "category": "climate",
                "tags": ["Climate", "Adaptation", "Sustainability"],
                "author": "Dr. Alemayehu Bekele",
                "image_url": "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=400&h=250&fit=crop&crop=center",
                "featured": True,
                "published_at": timezone.now(),
            },
            {
                "title": "New Agricultural Policy Supports Small-Scale Farmers",
                "content": "The Ethiopian government has unveiled a comprehensive agricultural support package aimed at empowering small-scale farmers and improving food security. The new policy framework includes subsidized access to improved seeds and fertilizers, technical training programs, and enhanced market linkage initiatives. Under this program, over 2 million smallholder farmers will receive direct support through cooperatives and farmer producer organizations. The policy also establishes agricultural service centers in rural areas, providing farmers with access to modern farming equipment, storage facilities, and direct market connections. Financial inclusion measures include low-interest agricultural loans and crop insurance schemes to protect farmers against climate-related risks.",
                "excerpt": "Government announces comprehensive support package including subsidies, training programs, and market access initiatives.",
                "category": "policy",
                "tags": ["Policy", "Support", "Small Farmers"],
                "author": "Ministry of Agriculture",
                "image_url": "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=250&fit=crop&crop=center",
                "featured": False,
                "published_at": timezone.now(),
            },
        ]

        for article in sample_articles:
            NewsArticle.objects.get_or_create(
                title=article["title"],
                defaults=article
            )
        self.stdout.write(self.style.SUCCESS('Sample news articles created.')) 