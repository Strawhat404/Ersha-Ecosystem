import React, { createContext, useContext, useEffect, useState } from 'react';
import { cartAPI } from '../lib/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartSummary, setCartSummary] = useState({
    totalItems: 0,
    totalPrice: 0,
    cartItems: []
  });

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await cartAPI.getCart();
      
      // Handle cart summary response structure
      let cartItems = [];
      let totalItems = 0;
      let totalPrice = 0;
      
      if (response && typeof response === 'object') {
        if (response.items && Array.isArray(response.items)) {
          // Cart summary response
          cartItems = response.items;
          totalItems = response.total_items || 0;
          totalPrice = response.total_price || 0;
        } else if (Array.isArray(response)) {
          // Direct array response (fallback)
          cartItems = response;
          totalItems = response.length;
          totalPrice = response.reduce((sum, item) => {
            const price = parseFloat(item.total_price || 0);
            return sum + price;
          }, 0);
        } else if (response.results && Array.isArray(response.results)) {
          // Paginated response (fallback)
          cartItems = response.results;
          totalItems = response.results.length;
          totalPrice = response.results.reduce((sum, item) => {
            const price = parseFloat(item.total_price || 0);
            return sum + price;
          }, 0);
        }
      }
      
      setCartItems(cartItems);
      setCartSummary({ totalItems, totalPrice, cartItems });
    } catch (err) {
      console.error('Failed to load cart:', err);
      setError('Failed to load cart');
      // Set empty cart on error
      setCartItems([]);
      setCartSummary({ totalItems: 0, totalPrice: 0, cartItems: [] });
    } finally {
      setLoading(false);
    }
  };

  const updateCartSummary = (items) => {
    // Calculate summary from items array (fallback method)
    const itemsArray = Array.isArray(items) ? items : [];
    const totalItems = itemsArray.length;
    const totalPrice = itemsArray.reduce((sum, item) => {
      const price = parseFloat(item.total_price || 0);
      return sum + price;
    }, 0);
    setCartSummary({ totalItems, totalPrice, cartItems: items });
  };

  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    setError(null);
    try {
      await cartAPI.addToCart(productId, quantity);
      await loadCart(); // Reload cart to get updated data
      return { success: true };
    } catch (err) {
      console.error('Failed to add to cart:', err);
      setError(err.message || 'Failed to add item to cart');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    setLoading(true);
    setError(null);
    try {
      await cartAPI.updateCartItem(itemId, quantity);
      await loadCart();
      return { success: true };
    } catch (err) {
      console.error('Failed to update cart item:', err);
      setError(err.message || 'Failed to update cart item');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    setLoading(true);
    setError(null);
    try {
      await cartAPI.removeFromCart(itemId);
      await loadCart();
      return { success: true };
    } catch (err) {
      console.error('Failed to remove from cart:', err);
      setError(err.message || 'Failed to remove item from cart');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    setError(null);
    try {
      await cartAPI.clearCart();
      setCartItems([]);
      setCartSummary({ totalItems: 0, totalPrice: 0, cartItems: [] });
      return { success: true };
    } catch (err) {
      console.error('Failed to clear cart:', err);
      setError(err.message || 'Failed to clear cart');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cartItems,
    cartSummary,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    loadCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 