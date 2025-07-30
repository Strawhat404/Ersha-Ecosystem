-- Sample Data for AgroGebeya Supabase Database
-- Run these INSERT statements in your Supabase SQL Editor after creating the schema

-- Insert sample loan offers first (no dependencies)
INSERT INTO loan_offers (bank_name, loan_type, amount_min, amount_max, interest_rate, term_months, requirements, eligibility_criteria)
VALUES 
  ('Development Bank of Ethiopia', 'Agricultural Equipment Loan', 50000.00, 500000.00, 8.5, 24, 
   ARRAY['6 months sales history', 'Collateral: Equipment', 'Credit score > 600'], 
   '{"min_credit_score": 600, "min_monthly_income": 5000, "max_age": 65, "required_documents": ["ID", "Business License", "Bank Statements"]}'::jsonb),
  ('Commercial Bank of Ethiopia', 'Working Capital Loan', 25000.00, 200000.00, 12.0, 18, 
   ARRAY['3 months sales history', 'Income verification'], 
   '{"min_credit_score": 550, "min_monthly_income": 3000, "max_age": 60, "required_documents": ["ID", "Income Statement"]}'::jsonb);

-- Insert weather data
INSERT INTO weather_data (region, woreda, temperature, humidity, rainfall, wind_speed, wind_direction, pressure, uv_index, visibility, weather_condition, forecast_data, advisory_text, data_source)
VALUES 
  ('Oromia', 'Jimma', 22.5, 75, 12.3, 8.2, 'SW', 1013.2, 6, 15.0, 'Partly Cloudy', 
   '{"daily": [{"date": "2024-03-16", "temp_max": 24, "temp_min": 18, "condition": "Sunny", "rainfall": 0}, {"date": "2024-03-17", "temp_max": 23, "temp_min": 17, "condition": "Cloudy", "rainfall": 2.1}, {"date": "2024-03-18", "temp_max": 22, "temp_min": 16, "condition": "Rain", "rainfall": 8.5}]}'::jsonb, 
   'Good conditions for coffee farming. Consider light irrigation due to recent rainfall.', 'Ethiopian Meteorological Agency');

-- Insert advisory content
INSERT INTO advisory_content (title, content, excerpt, category, crop_type, region, season, difficulty, read_time, author_name, author_role, tags, images, featured, verified, views, likes, bookmarks)
VALUES 
  ('Integrated Pest Management for Coffee Plants', 'Comprehensive guide to managing pests in coffee plantations using sustainable methods...', 'Learn effective strategies to control coffee berry borer and leaf rust while maintaining organic certification.', 'pest_control', 'coffee', 'oromia', 'dry', 'intermediate', 8, 'Dr. Alemayehu Bekele', 'Agricultural Extension Officer', 
   ARRAY['organic', 'sustainable', 'coffee berry borer', 'leaf rust'], 
   ARRAY['https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=200'], 
   true, true, 1250, 340, 89);

-- Insert news
INSERT INTO news (title, content, excerpt, category, tags, author, source, source_url, image_url, featured, views, published_at)
VALUES 
  ('New Coffee Export Opportunities Open for Ethiopian Farmers', 'Recent trade agreements have created new opportunities for Ethiopian coffee farmers to export directly...', 'Government announces new initiatives to support direct coffee exports, potentially increasing farmer profits by 30%.', 'Market News', 
   ARRAY['coffee', 'export', 'trade', 'farmers'], 
   'Ethiopian Coffee Association', 'Ministry of Agriculture', 'https://example.com/news/coffee-export', 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=200', 
   true, 2150, '2024-03-15T09:00:00Z');

-- Note: Products, Orders, Payments, and Deliveries require user profiles first
-- These will be created when users sign up through the application

-- You can also add some additional sample data:

-- More weather data for different regions
INSERT INTO weather_data (region, woreda, temperature, humidity, rainfall, wind_speed, wind_direction, pressure, uv_index, visibility, weather_condition, forecast_data, advisory_text, data_source)
VALUES 
  ('Amhara', 'Bahir Dar', 19.5, 68, 8.1, 6.5, 'NE', 1015.8, 7, 18.0, 'Clear Sky', 
   '{"daily": [{"date": "2024-03-16", "temp_max": 22, "temp_min": 16, "condition": "Sunny", "rainfall": 0}, {"date": "2024-03-17", "temp_max": 21, "temp_min": 15, "condition": "Partly Cloudy", "rainfall": 0}, {"date": "2024-03-18", "temp_max": 20, "temp_min": 14, "condition": "Cloudy", "rainfall": 1.2}]}'::jsonb, 
   'Excellent conditions for vegetable cultivation. Good time for planting carrots and potatoes.', 'Ethiopian Meteorological Agency'),
  ('SNNPR', 'Shashemene', 24.2, 72, 15.6, 9.1, 'SE', 1010.5, 8, 12.0, 'Light Rain', 
   '{"daily": [{"date": "2024-03-16", "temp_max": 26, "temp_min": 20, "condition": "Rain", "rainfall": 12.3}, {"date": "2024-03-17", "temp_max": 25, "temp_min": 19, "condition": "Cloudy", "rainfall": 3.4}, {"date": "2024-03-18", "temp_max": 27, "temp_min": 21, "condition": "Partly Cloudy", "rainfall": 0}]}'::jsonb, 
   'Recent rainfall is beneficial for onion cultivation. Monitor drainage to prevent waterlogging.', 'Ethiopian Meteorological Agency');

-- More advisory content
INSERT INTO advisory_content (title, content, excerpt, category, crop_type, region, season, difficulty, read_time, author_name, author_role, tags, images, featured, verified, views, likes, bookmarks)
VALUES 
  ('Organic Vegetable Farming Techniques', 'Complete guide to growing vegetables without synthetic pesticides and fertilizers. Learn soil preparation, companion planting, and natural pest control methods.', 'Master organic farming techniques for healthier crops and better market prices.', 'farming_techniques', 'vegetables', 'amhara', 'wet', 'beginner', 12, 'Ato Belay Zewde', 'Organic Farming Specialist', 
   ARRAY['organic', 'vegetables', 'soil health', 'natural fertilizers'], 
   ARRAY['https://images.unsplash.com/photo-1445282768818-728615cc910a?w=400&h=200'], 
   true, true, 890, 245, 67),
  ('Post-Harvest Storage Solutions', 'Learn effective storage methods to reduce crop losses and extend shelf life. Covers proper drying, packaging, and storage facility management.', 'Reduce post-harvest losses by up to 40% with proper storage techniques.', 'post_harvest', 'general', 'national', 'dry', 'intermediate', 15, 'Dr. Meron Tadesse', 'Post-Harvest Technology Specialist', 
   ARRAY['storage', 'post-harvest', 'food security', 'value addition'], 
   ARRAY['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=200'], 
   false, true, 1456, 398, 123);

-- More news
INSERT INTO news (title, content, excerpt, category, tags, author, source, source_url, image_url, featured, views, published_at)
VALUES 
  ('Digital Payment Solutions Transform Rural Agriculture', 'Mobile money and digital payment platforms are revolutionizing how farmers receive payments for their produce, reducing transaction costs and improving financial inclusion.', 'New digital payment solutions help farmers receive payments faster and more securely.', 'Technology', 
   ARRAY['fintech', 'mobile money', 'digital payments', 'financial inclusion'], 
   'AgroTech Weekly', 'Ethiopian Fintech Association', 'https://example.com/news/digital-payments', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200', 
   false, 1834, '2024-03-14T11:30:00Z'),
  ('Climate-Smart Agriculture Initiative Launched', 'Ministry of Agriculture launches comprehensive climate-smart agriculture program to help farmers adapt to changing weather patterns and improve resilience.', 'Government invests 2 billion ETB in climate adaptation programs for farmers.', 'Policy', 
   ARRAY['climate change', 'adaptation', 'government policy', 'resilience'], 
   'Ministry of Agriculture', 'Government Press Release', 'https://example.com/news/climate-smart', 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&h=200', 
   true, 2789, '2024-03-13T08:00:00Z');

-- Additional loan offers
INSERT INTO loan_offers (bank_name, loan_type, amount_min, amount_max, interest_rate, term_months, requirements, eligibility_criteria)
VALUES 
  ('Cooperative Bank of Oromia', 'Crop Production Loan', 10000.00, 100000.00, 9.5, 12, 
   ARRAY['Farm registration', 'Cooperative membership', 'Crop insurance'], 
   '{"min_credit_score": 400, "min_monthly_income": 2000, "max_age": 70, "required_documents": ["ID", "Farm Registration", "Cooperative Certificate"]}'::jsonb),
  ('Ethiopian Investment Bank', 'Agribusiness Expansion Loan', 100000.00, 2000000.00, 11.0, 36, 
   ARRAY['Business plan', 'Financial statements', 'Collateral requirement'], 
   '{"min_credit_score": 650, "min_monthly_income": 15000, "max_age": 60, "required_documents": ["Business License", "Tax Clearance", "Audited Financials"]}'::jsonb); 