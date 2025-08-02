import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Truck, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Navigation,
  DollarSign,
  Weight,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const LogisticsOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Mock orders data
  const ordersData = [
    {
      id: 'ORD-001',
      orderNumber: 'AGR-2024-001',
      client: {
        name: 'Green Valley Farm',
        contact: 'John Smith',
        phone: '+1 (555) 123-4567',
        email: 'john@greenvalley.com',
        address: '123 Farm Road, Valley District'
      },
      pickup: {
        address: '456 Warehouse St, Industrial Zone',
        date: '2024-08-02',
        time: '09:00 AM',
        contact: 'Mike Johnson'
      },
      delivery: {
        address: '123 Farm Road, Valley District',
        date: '2024-08-02',
        time: '02:00 PM',
        instructions: 'Leave at main gate if no one available'
      },
      items: [
        { name: 'Organic Fertilizer', quantity: 50, unit: 'bags', weight: '25kg each' },
        { name: 'Seeds - Corn', quantity: 10, unit: 'packets', weight: '1kg each' }
      ],
      status: 'in_transit',
      priority: 'high',
      value: 1250.00,
      distance: '45 km',
      estimatedDuration: '2.5 hours',
      createdAt: '2024-08-01T10:30:00Z',
      notes: 'Handle with care - fragile items included'
    },
    {
      id: 'ORD-002',
      orderNumber: 'AGR-2024-002',
      client: {
        name: 'Sunrise Agriculture',
        contact: 'Sarah Wilson',
        phone: '+1 (555) 987-6543',
        email: 'sarah@sunrise-ag.com',
        address: '789 Country Lane, North Valley'
      },
      pickup: {
        address: '321 Supply Center, Downtown',
        date: '2024-08-03',
        time: '08:00 AM',
        contact: 'Tom Brown'
      },
      delivery: {
        address: '789 Country Lane, North Valley',
        date: '2024-08-03',
        time: '11:30 AM',
        instructions: 'Call upon arrival'
      },
      items: [
        { name: 'Irrigation Equipment', quantity: 1, unit: 'set', weight: '150kg' },
        { name: 'PVC Pipes', quantity: 20, unit: 'pieces', weight: '5kg each' }
      ],
      status: 'pending',
      priority: 'medium',
      value: 2800.00,
      distance: '32 km',
      estimatedDuration: '1.8 hours',
      createdAt: '2024-08-01T14:15:00Z',
      notes: 'Equipment requires careful handling'
    },
    {
      id: 'ORD-003',
      orderNumber: 'AGR-2024-003',
      client: {
        name: 'Mountain View Ranch',
        contact: 'David Lee',
        phone: '+1 (555) 456-7890',
        email: 'david@mountainview.com',
        address: '555 Ranch Road, Mountain District'
      },
      pickup: {
        address: '777 Feed Store, Central Ave',
        date: '2024-08-01',
        time: '03:00 PM',
        contact: 'Lisa Garcia'
      },
      delivery: {
        address: '555 Ranch Road, Mountain District',
        date: '2024-08-01',
        time: '05:30 PM',
        instructions: 'Delivered successfully'
      },
      items: [
        { name: 'Livestock Feed', quantity: 100, unit: 'bags', weight: '20kg each' },
        { name: 'Supplements', quantity: 5, unit: 'containers', weight: '10kg each' }
      ],
      status: 'delivered',
      priority: 'low',
      value: 1800.00,
      distance: '28 km',
      estimatedDuration: '1.5 hours',
      createdAt: '2024-08-01T08:00:00Z',
      notes: 'Regular monthly delivery'
    },
    {
      id: 'ORD-004',
      orderNumber: 'AGR-2024-004',
      client: {
        name: 'Fresh Fields Farm',
        contact: 'Emily Chen',
        phone: '+1 (555) 321-0987',
        email: 'emily@freshfields.com',
        address: '999 Organic Way, East Side'
      },
      pickup: {
        address: '111 Equipment Depot, South End',
        date: '2024-08-02',
        time: '01:00 PM',
        contact: 'Robert Kim'
      },
      delivery: {
        address: '999 Organic Way, East Side',
        date: '2024-08-02',
        time: '04:00 PM',
        instructions: 'Urgent delivery - time sensitive'
      },
      items: [
        { name: 'Greenhouse Panels', quantity: 12, unit: 'panels', weight: '15kg each' },
        { name: 'Climate Control Unit', quantity: 1, unit: 'unit', weight: '75kg' }
      ],
      status: 'delayed',
      priority: 'high',
      value: 3500.00,
      distance: '52 km',
      estimatedDuration: '3.2 hours',
      createdAt: '2024-08-01T16:45:00Z',
      notes: 'Weather delay - rescheduled for tomorrow'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_transit': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'delayed': return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'in_transit': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'delayed': return <AlertTriangle className="w-4 h-4" />;
      case 'cancelled': return <AlertTriangle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = ordersData.filter(order => {
    const matchesSearch = order.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.client.contact.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'priority': {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      case 'status':
        return a.status.localeCompare(b.status);
      case 'value':
        return b.value - a.value;
      default:
        return 0;
    }
  });

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600 mt-1">Track and manage all delivery orders</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <span className="text-sm text-gray-600">
            {filteredOrders.length} of {ordersData.length} orders
          </span>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search orders, clients, or order numbers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="delayed">Delayed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="status">Sort by Status</option>
              <option value="value">Sort by Value</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {sortedOrders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            {/* Order Header */}
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Package className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{order.orderNumber}</h3>
                      <p className="text-sm text-gray-600">{order.client.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status.replace('_', ' ')}</span>
                    </span>
                    
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                      {order.priority}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleOrderExpansion(order.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {expandedOrder === order.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{order.distance}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{order.estimatedDuration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">${order.value.toFixed(2)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{new Date(order.pickup.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Expanded Order Details */}
            <AnimatePresence>
              {expandedOrder === order.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-100"
                >
                  <div className="p-6 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Pickup Details */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Pickup Details</h4>
                        <div className="space-y-2">
                          <div className="flex items-start space-x-2">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                            <span className="text-sm text-gray-600">{order.pickup.address}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{order.pickup.date} at {order.pickup.time}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{order.pickup.contact}</span>
                          </div>
                        </div>
                      </div>

                      {/* Delivery Details */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Delivery Details</h4>
                        <div className="space-y-2">
                          <div className="flex items-start space-x-2">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                            <span className="text-sm text-gray-600">{order.delivery.address}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{order.delivery.date} at {order.delivery.time}</span>
                          </div>
                          <div className="flex items-start space-x-2">
                            <AlertTriangle className="w-4 h-4 text-gray-400 mt-0.5" />
                            <span className="text-sm text-gray-600">{order.delivery.instructions}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="mt-6">
                      <h4 className="font-medium text-gray-900 mb-3">Items</h4>
                      <div className="space-y-2">
                        {order.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Package className="w-4 h-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-900">{item.name}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-sm text-gray-600">{item.quantity} {item.unit}</span>
                              <p className="text-xs text-gray-500">{item.weight}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    {order.notes && (
                      <div className="mt-6">
                        <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                        <p className="text-sm text-gray-600 bg-white p-3 rounded-lg">{order.notes}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-6 flex items-center space-x-3">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_transit">In Transit</option>
                        <option value="delivered">Delivered</option>
                        <option value="delayed">Delayed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm">
                        Update Status
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                        Contact Client
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {sortedOrders.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default LogisticsOrders;
