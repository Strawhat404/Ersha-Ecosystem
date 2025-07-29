-- AgroGebeya Database Schema for Supabase
-- Run this in your Supabase SQL Editor
-- (Supabase-compatible version - removed superuser-only commands)

-- Create custom types
CREATE TYPE user_type AS ENUM ('farmer', 'buyer', 'merchant', 'admin');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
CREATE TYPE delivery_status AS ENUM ('pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed');
CREATE TYPE payment_method AS ENUM ('mobile_money', 'bank_transfer', 'cash', 'digital_wallet');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    user_type user_type NOT NULL DEFAULT 'farmer',
    location VARCHAR(255),
    region VARCHAR(100),
    woreda VARCHAR(100),
    kebele VARCHAR(100),
    farm_size DECIMAL(10,2), -- in hectares
    profile_image_url TEXT,
    id_number VARCHAR(50),
    business_license VARCHAR(100),
    verification_status BOOLEAN DEFAULT FALSE,
    credit_score INTEGER DEFAULT 500 CHECK (credit_score >= 300 AND credit_score <= 850),
    total_sales DECIMAL(12,2) DEFAULT 0,
    total_purchases DECIMAL(12,2) DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    bio TEXT,
    specialties TEXT[], -- array of specialties
    languages TEXT[] DEFAULT ARRAY['Amharic'], -- languages spoken
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    farmer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    price_per_unit DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50) NOT NULL DEFAULT 'kg', -- kg, piece, bunch, etc.
    quantity_available DECIMAL(10,2) NOT NULL,
    minimum_order DECIMAL(10,2) DEFAULT 1,
    harvest_date DATE,
    expiry_date DATE,
    organic BOOLEAN DEFAULT FALSE,
    certified BOOLEAN DEFAULT FALSE,
    grade VARCHAR(20), -- A, B, C grade
    origin_region VARCHAR(100),
    origin_woreda VARCHAR(100),
    storage_method VARCHAR(100),
    images TEXT[], -- array of image URLs
    tags TEXT[], -- searchable tags
    featured BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active', -- active, sold_out, inactive
    views INTEGER DEFAULT 0,
    favorites INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    buyer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    farmer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    final_amount DECIMAL(12,2) NOT NULL,
    status order_status DEFAULT 'pending',
    delivery_address TEXT NOT NULL,
    delivery_region VARCHAR(100),
    delivery_phone VARCHAR(20),
    delivery_instructions TEXT,
    estimated_delivery DATE,
    actual_delivery DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    payer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    recipient_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'ETB',
    payment_method payment_method NOT NULL,
    provider VARCHAR(100), -- M-Pesa, CBE Birr, etc.
    provider_transaction_id VARCHAR(200),
    status payment_status DEFAULT 'pending',
    escrow_status VARCHAR(20) DEFAULT 'holding', -- holding, released, disputed
    escrow_released_at TIMESTAMP WITH TIME ZONE,
    payment_date TIMESTAMP WITH TIME ZONE,
    description TEXT,
    metadata JSONB, -- additional payment provider data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deliveries table
CREATE TABLE deliveries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tracking_number VARCHAR(100) UNIQUE NOT NULL,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    provider_name VARCHAR(255) NOT NULL,
    provider_contact VARCHAR(100),
    driver_name VARCHAR(255),
    driver_phone VARCHAR(20),
    vehicle_info VARCHAR(255),
    pickup_address TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    estimated_distance DECIMAL(8,2), -- in kilometers
    estimated_duration INTEGER, -- in minutes
    status delivery_status DEFAULT 'pending',
    current_location TEXT,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    pickup_time TIMESTAMP WITH TIME ZONE,
    delivery_time TIMESTAMP WITH TIME ZONE,
    delivery_proof TEXT, -- image URL or signature
    cost DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weather data table
CREATE TABLE weather_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    region VARCHAR(100) NOT NULL,
    woreda VARCHAR(100),
    temperature DECIMAL(5,2), -- in Celsius
    humidity INTEGER, -- percentage
    rainfall DECIMAL(8,2), -- in mm
    wind_speed DECIMAL(5,2), -- in km/h
    wind_direction VARCHAR(10),
    pressure DECIMAL(8,2), -- in hPa
    uv_index INTEGER,
    visibility DECIMAL(5,2), -- in km
    weather_condition VARCHAR(100),
    forecast_data JSONB, -- 7-day forecast
    advisory_text TEXT, -- farming advisory based on weather
    data_source VARCHAR(100) DEFAULT 'Ethiopian Meteorological Agency',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Advisory content table
CREATE TABLE advisory_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    category VARCHAR(100) NOT NULL,
    crop_type VARCHAR(100),
    region VARCHAR(100),
    season VARCHAR(50),
    difficulty VARCHAR(20) DEFAULT 'beginner', -- beginner, intermediate, advanced
    read_time INTEGER, -- estimated reading time in minutes
    author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    author_name VARCHAR(255),
    author_role VARCHAR(255),
    tags TEXT[],
    images TEXT[],
    video_url TEXT,
    download_url TEXT, -- for PDFs, documents
    featured BOOLEAN DEFAULT FALSE,
    verified BOOLEAN DEFAULT FALSE,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    bookmarks INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- News table
CREATE TABLE news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    category VARCHAR(100) NOT NULL,
    tags TEXT[],
    author VARCHAR(255),
    source VARCHAR(255),
    source_url TEXT,
    image_url TEXT,
    featured BOOLEAN DEFAULT FALSE,
    views INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Credit scores and loan tracking
CREATE TABLE credit_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    previous_score INTEGER,
    new_score INTEGER,
    change_reason TEXT,
    factors JSONB, -- detailed factors affecting score
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Loan offers table
CREATE TABLE loan_offers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    bank_name VARCHAR(255) NOT NULL,
    loan_type VARCHAR(255) NOT NULL,
    amount_min DECIMAL(12,2) NOT NULL,
    amount_max DECIMAL(12,2) NOT NULL,
    interest_rate DECIMAL(5,2) NOT NULL,
    term_months INTEGER NOT NULL,
    requirements TEXT[],
    eligibility_criteria JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User loan applications
CREATE TABLE loan_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    loan_offer_id UUID REFERENCES loan_offers(id) ON DELETE SET NULL,
    amount_requested DECIMAL(12,2) NOT NULL,
    purpose TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    bank_response TEXT,
    approved_amount DECIMAL(12,2),
    approved_rate DECIMAL(5,2),
    disbursement_date DATE,
    documents JSONB, -- uploaded document URLs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_farmer ON products(farmer_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_farmer ON orders(farmer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_deliveries_order ON deliveries(order_id);
CREATE INDEX idx_weather_region ON weather_data(region);
CREATE INDEX idx_advisory_category ON advisory_content(category);
CREATE INDEX idx_advisory_crop ON advisory_content(crop_type);
CREATE INDEX idx_news_category ON news(category);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view and edit their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Products policies
CREATE POLICY "Anyone can view products" ON products FOR SELECT USING (TRUE);
CREATE POLICY "Farmers can insert own products" ON products FOR INSERT WITH CHECK (auth.uid() = farmer_id);
CREATE POLICY "Farmers can update own products" ON products FOR UPDATE USING (auth.uid() = farmer_id);
CREATE POLICY "Farmers can delete own products" ON products FOR DELETE USING (auth.uid() = farmer_id);

-- Orders policies
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = farmer_id);
CREATE POLICY "Buyers can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Order participants can update" ON orders FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = farmer_id);

-- Update triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_deliveries_updated_at BEFORE UPDATE ON deliveries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 