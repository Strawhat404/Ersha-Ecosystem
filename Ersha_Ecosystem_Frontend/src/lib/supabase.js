import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Database helper functions
export const db = {
  // Products/Marketplace
  products: {
    getAll: () => supabase.from('products').select('*'),
    getById: (id) => supabase.from('products').select('*').eq('id', id).single(),
    getByCategory: (category) => supabase.from('products').select('*').eq('category', category),
    getByFarmer: (farmerId) => supabase.from('products').select('*').eq('farmer_id', farmerId),
    create: (product) => supabase.from('products').insert(product),
    update: (id, updates) => supabase.from('products').update(updates).eq('id', id),
    delete: (id) => supabase.from('products').delete().eq('id', id)
  },

  // Orders/Transactions
  orders: {
    getAll: () => supabase.from('orders').select(`
      *,
      products(*),
      buyers(id, name, email),
      farmers(id, name, email)
    `),
    getByBuyer: (buyerId) => supabase.from('orders').select('*').eq('buyer_id', buyerId),
    getBySeller: (farmerId) => supabase.from('orders').select('*').eq('farmer_id', farmerId),
    create: (order) => supabase.from('orders').insert(order),
    updateStatus: (id, status) => supabase.from('orders').update({ status }).eq('id', id)
  },

  // Users (Farmers & Buyers)
  users: {
    getProfile: (userId) => supabase.from('profiles').select('*').eq('id', userId).single(),
    updateProfile: (userId, updates) => supabase.from('profiles').update(updates).eq('id', userId),
    getFarmers: () => supabase.from('profiles').select('*').eq('user_type', 'farmer'),
    getBuyers: () => supabase.from('profiles').select('*').eq('user_type', 'buyer')
  },

  // Payments
  payments: {
    getByUser: (userId) => supabase.from('payments').select('*').eq('user_id', userId),
    create: (payment) => supabase.from('payments').insert(payment),
    updateStatus: (id, status) => supabase.from('payments').update({ status }).eq('id', id)
  },

  // Logistics/Deliveries
  deliveries: {
    getByOrder: (orderId) => supabase.from('deliveries').select('*').eq('order_id', orderId),
    getByUser: (userId) => supabase.from('deliveries').select('*').eq('user_id', userId),
    create: (delivery) => supabase.from('deliveries').insert(delivery),
    updateStatus: (id, status, location) => supabase.from('deliveries').update({ 
      status, 
      current_location: location,
      updated_at: new Date().toISOString()
    }).eq('id', id)
  },

  // Weather Data
  weather: {
    getByLocation: (region) => supabase.from('weather_data').select('*').eq('region', region).order('created_at', { ascending: false }).limit(1),
    create: (weatherData) => supabase.from('weather_data').insert(weatherData)
  },

  // Advisory Content
  advisory: {
    getAll: () => supabase.from('advisory_content').select('*').order('created_at', { ascending: false }),
    getByCategory: (category) => supabase.from('advisory_content').select('*').eq('category', category),
    getByCrop: (crop) => supabase.from('advisory_content').select('*').eq('crop_type', crop),
    getByRegion: (region) => supabase.from('advisory_content').select('*').eq('region', region)
  },

  // News
  news: {
    getAll: () => supabase.from('news').select('*').order('published_at', { ascending: false }),
    getRecent: (limit = 10) => supabase.from('news').select('*').order('published_at', { ascending: false }).limit(limit)
  }
}

// Auth helper functions
export const auth = {
  signUp: (email, password, userData) => supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  }),
  
  signIn: (email, password) => supabase.auth.signInWithPassword({
    email,
    password
  }),
  
  signOut: () => supabase.auth.signOut(),
  
  getCurrentUser: () => supabase.auth.getUser(),
  
  onAuthStateChange: (callback) => supabase.auth.onAuthStateChange(callback)
}

// Real-time subscriptions
export const realtime = {
  subscribeToOrders: (callback) => 
    supabase
      .channel('orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, callback)
      .subscribe(),

  subscribeToDeliveries: (callback) =>
    supabase
      .channel('deliveries')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'deliveries' }, callback)
      .subscribe(),

  subscribeToProducts: (callback) =>
    supabase
      .channel('products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, callback)
      .subscribe()
}

export default supabase 