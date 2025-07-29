// Sample data for seeding the Supabase database
// Run these inserts in your Supabase SQL Editor after creating the schema

export const sampleProfiles = [
  {
    email: 'farmer1@agrogebeya.com',
    full_name: 'Alemayehu Bekele',
    phone: '+251911234567',
    user_type: 'farmer',
    location: 'Jimma Town',
    region: 'Oromia',
    woreda: 'Jimma',
    kebele: 'Kebele 01',
    farm_size: 15.5,
    credit_score: 742,
    total_sales: 125450.75,
    rating: 4.8,
    bio: 'Experienced coffee farmer with 20 years of expertise in organic coffee production.',
    specialties: ['Coffee', 'Organic Farming', 'Beekeeping'],
    languages: ['Amharic', 'Oromo', 'English']
  },
  {
    email: 'buyer1@agrogebeya.com',
    full_name: 'Tigist Alemu',
    phone: '+251923456789',
    user_type: 'buyer',
    location: 'Addis Ababa',
    region: 'Addis Ababa',
    woreda: 'Bole',
    kebele: 'Kebele 03',
    credit_score: 680,
    total_purchases: 89320.50,
    rating: 4.6,
    bio: 'Restaurant owner focused on sourcing fresh, local produce.',
    specialties: ['Restaurant Supply', 'Quality Assurance'],
    languages: ['Amharic', 'English']
  }
];

export const sampleProducts = [
  {
    name: 'Premium Ethiopian Coffee Beans',
    description: 'High-quality Arabica coffee beans from Jimma region. Organic certified with rich flavor profile.',
    category: 'Coffee',
    subcategory: 'Arabica',
    price_per_unit: 450.00,
    unit: 'kg',
    quantity_available: 500,
    minimum_order: 10,
    harvest_date: '2024-02-15',
    expiry_date: '2025-02-15',
    organic: true,
    certified: true,
    grade: 'A',
    origin_region: 'Oromia',
    origin_woreda: 'Jimma',
    storage_method: 'Dry storage at controlled temperature',
    images: [
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300',
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300'
    ],
    tags: ['organic', 'arabica', 'premium', 'certified'],
    featured: true,
    status: 'active'
  },
  {
    name: 'Fresh Carrots',
    description: 'Crisp and sweet carrots grown in highland regions. Perfect for cooking and processing.',
    category: 'Vegetables',
    subcategory: 'Root Vegetables',
    price_per_unit: 25.00,
    unit: 'kg',
    quantity_available: 200,
    minimum_order: 5,
    harvest_date: '2024-03-01',
    expiry_date: '2024-04-01',
    organic: false,
    certified: false,
    grade: 'A',
    origin_region: 'Amhara',
    origin_woreda: 'Bahir Dar',
    storage_method: 'Cold storage',
    images: [
      'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=400&h=300'
    ],
    tags: ['fresh', 'vegetables', 'highland'],
    featured: false,
    status: 'active'
  },
  {
    name: 'Red Onions',
    description: 'Sharp and flavorful red onions. Excellent for cooking and export.',
    category: 'Vegetables',
    subcategory: 'Bulb Vegetables',
    price_per_unit: 18.00,
    unit: 'kg',
    quantity_available: 800,
    minimum_order: 20,
    harvest_date: '2024-02-20',
    expiry_date: '2024-08-20',
    organic: false,
    certified: false,
    grade: 'B',
    origin_region: 'SNNPR',
    origin_woreda: 'Shashemene',
    storage_method: 'Ventilated storage',
    images: [
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300'
    ],
    tags: ['onions', 'red onions', 'cooking'],
    featured: false,
    status: 'active'
  }
];

export const sampleOrders = [
  {
    order_number: 'AGO-2024-001',
    quantity: 50,
    unit_price: 450.00,
    total_amount: 22500.00,
    delivery_fee: 500.00,
    tax_amount: 0.00,
    final_amount: 23000.00,
    status: 'confirmed',
    delivery_address: 'Bole Road, Addis Ababa',
    delivery_region: 'Addis Ababa',
    delivery_phone: '+251923456789',
    delivery_instructions: 'Deliver to back entrance of restaurant',
    estimated_delivery: '2024-03-20',
    notes: 'Quality coffee beans for restaurant use'
  }
];

export const samplePayments = [
  {
    transaction_id: 'TXN-2024-001',
    amount: 23000.00,
    currency: 'ETB',
    payment_method: 'mobile_money',
    provider: 'M-Pesa',
    provider_transaction_id: 'MP240315001',
    status: 'completed',
    escrow_status: 'holding',
    payment_date: '2024-03-15T10:30:00Z',
    description: 'Payment for coffee beans order AGO-2024-001'
  }
];

export const sampleDeliveries = [
  {
    tracking_number: 'TRK-2024-001',
    provider_name: 'FastFreight Ethiopia',
    provider_contact: '+251911555666',
    driver_name: 'Dawit Tesfaye',
    driver_phone: '+251922333444',
    vehicle_info: 'Toyota Truck - ET-1-12345',
    pickup_address: 'Jimma Farm, Oromia Region',
    delivery_address: 'Bole Road, Addis Ababa',
    estimated_distance: 346.5,
    estimated_duration: 480, // 8 hours
    status: 'in_transit',
    current_location: 'Welkite Junction',
    progress_percentage: 45,
    pickup_time: '2024-03-15T08:00:00Z',
    cost: 500.00,
    notes: 'Handle with care - coffee beans'
  }
];

export const sampleWeatherData = [
  {
    region: 'Oromia',
    woreda: 'Jimma',
    temperature: 22.5,
    humidity: 75,
    rainfall: 12.3,
    wind_speed: 8.2,
    wind_direction: 'SW',
    pressure: 1013.2,
    uv_index: 6,
    visibility: 15.0,
    weather_condition: 'Partly Cloudy',
    forecast_data: {
      daily: [
        { date: '2024-03-16', temp_max: 24, temp_min: 18, condition: 'Sunny', rainfall: 0 },
        { date: '2024-03-17', temp_max: 23, temp_min: 17, condition: 'Cloudy', rainfall: 2.1 },
        { date: '2024-03-18', temp_max: 22, temp_min: 16, condition: 'Rain', rainfall: 8.5 }
      ]
    },
    advisory_text: 'Good conditions for coffee farming. Consider light irrigation due to recent rainfall.',
    data_source: 'Ethiopian Meteorological Agency'
  }
];

export const sampleAdvisoryContent = [
  {
    title: 'Integrated Pest Management for Coffee Plants',
    content: 'Comprehensive guide to managing pests in coffee plantations using sustainable methods...',
    excerpt: 'Learn effective strategies to control coffee berry borer and leaf rust while maintaining organic certification.',
    category: 'pest_control',
    crop_type: 'coffee',
    region: 'oromia',
    season: 'dry',
    difficulty: 'intermediate',
    read_time: 8,
    author_name: 'Dr. Alemayehu Bekele',
    author_role: 'Agricultural Extension Officer',
    tags: ['organic', 'sustainable', 'coffee berry borer', 'leaf rust'],
    images: ['https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=200'],
    featured: true,
    verified: true,
    views: 1250,
    likes: 340,
    bookmarks: 89
  }
];

export const sampleNews = [
  {
    title: 'New Coffee Export Opportunities Open for Ethiopian Farmers',
    content: 'Recent trade agreements have created new opportunities for Ethiopian coffee farmers to export directly...',
    excerpt: 'Government announces new initiatives to support direct coffee exports, potentially increasing farmer profits by 30%.',
    category: 'Market News',
    tags: ['coffee', 'export', 'trade', 'farmers'],
    author: 'Ethiopian Coffee Association',
    source: 'Ministry of Agriculture',
    source_url: 'https://example.com/news/coffee-export',
    image_url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=200',
    featured: true,
    views: 2150,
    published_at: '2024-03-15T09:00:00Z'
  }
];

export const sampleLoanOffers = [
  {
    bank_name: 'Development Bank of Ethiopia',
    loan_type: 'Agricultural Equipment Loan',
    amount_min: 50000.00,
    amount_max: 500000.00,
    interest_rate: 8.5,
    term_months: 24,
    requirements: ['6 months sales history', 'Collateral: Equipment', 'Credit score > 600'],
    eligibility_criteria: {
      min_credit_score: 600,
      min_monthly_income: 5000,
      max_age: 65,
      required_documents: ['ID', 'Business License', 'Bank Statements']
    },
    is_active: true
  },
  {
    bank_name: 'Commercial Bank of Ethiopia',
    loan_type: 'Working Capital Loan',
    amount_min: 25000.00,
    amount_max: 200000.00,
    interest_rate: 12.0,
    term_months: 18,
    requirements: ['3 months sales history', 'Income verification'],
    eligibility_criteria: {
      min_credit_score: 550,
      min_monthly_income: 3000,
      max_age: 60,
      required_documents: ['ID', 'Income Statement']
    },
    is_active: true
  }
];

// SQL INSERT statements (to run in Supabase SQL Editor)
export const generateInsertStatements = () => {
  return `
-- Insert sample loan offers first (no dependencies)
INSERT INTO loan_offers (bank_name, loan_type, amount_min, amount_max, interest_rate, term_months, requirements, eligibility_criteria)
VALUES 
${sampleLoanOffers.map(offer => `
  ('${offer.bank_name}', '${offer.loan_type}', ${offer.amount_min}, ${offer.amount_max}, ${offer.interest_rate}, ${offer.term_months}, 
   ARRAY[${offer.requirements.map(r => `'${r}'`).join(', ')}], 
   '${JSON.stringify(offer.eligibility_criteria)}'::jsonb)`).join(',')};

-- Insert weather data
INSERT INTO weather_data (region, woreda, temperature, humidity, rainfall, wind_speed, wind_direction, pressure, uv_index, visibility, weather_condition, forecast_data, advisory_text, data_source)
VALUES 
${sampleWeatherData.map(weather => `
  ('${weather.region}', '${weather.woreda}', ${weather.temperature}, ${weather.humidity}, ${weather.rainfall}, 
   ${weather.wind_speed}, '${weather.wind_direction}', ${weather.pressure}, ${weather.uv_index}, ${weather.visibility}, 
   '${weather.weather_condition}', '${JSON.stringify(weather.forecast_data)}'::jsonb, 
   '${weather.advisory_text}', '${weather.data_source}')`).join(',')};

-- Insert advisory content
INSERT INTO advisory_content (title, content, excerpt, category, crop_type, region, season, difficulty, read_time, author_name, author_role, tags, images, featured, verified, views, likes, bookmarks)
VALUES 
${sampleAdvisoryContent.map(content => `
  ('${content.title}', '${content.content}', '${content.excerpt}', '${content.category}', 
   '${content.crop_type}', '${content.region}', '${content.season}', '${content.difficulty}', 
   ${content.read_time}, '${content.author_name}', '${content.author_role}', 
   ARRAY[${content.tags.map(t => `'${t}'`).join(', ')}], 
   ARRAY[${content.images.map(i => `'${i}'`).join(', ')}], 
   ${content.featured}, ${content.verified}, ${content.views}, ${content.likes}, ${content.bookmarks})`).join(',')};

-- Insert news
INSERT INTO news (title, content, excerpt, category, tags, author, source, source_url, image_url, featured, views, published_at)
VALUES 
${sampleNews.map(news => `
  ('${news.title}', '${news.content}', '${news.excerpt}', '${news.category}', 
   ARRAY[${news.tags.map(t => `'${t}'`).join(', ')}], 
   '${news.author}', '${news.source}', '${news.source_url}', '${news.image_url}', 
   ${news.featured}, ${news.views}, '${news.published_at}')`).join(',')};
`;
};

export default {
  sampleProfiles,
  sampleProducts,
  sampleOrders,
  samplePayments,
  sampleDeliveries,
  sampleWeatherData,
  sampleAdvisoryContent,
  sampleNews,
  sampleLoanOffers,
  generateInsertStatements
}; 