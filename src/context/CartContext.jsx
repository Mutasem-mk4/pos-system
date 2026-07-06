import { createContext, useContext, useReducer, useCallback } from 'react';
import { calculateOrderTotals } from '../utils/calculations';

/**
 * Cart Context — Manages the current order state
 * 
 * State shape:
 * {
 *   items: [{ productId, name, price, quantity, categoryIcon }],
 *   orderType: 'dine-in' | 'takeaway' | 'direct-sale',
 *   tableNumber: '',
 *   discount: { type: 'percentage' | 'fixed', value: 0 },
 * }
 */

const CartContext = createContext(null);

// Initial cart state
const initialState = {
  items: [],
  orderType: 'direct-sale',
  tableNumber: '',
  discount: { type: 'percentage', value: 0 },
};

// Action types
const ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  SET_ORDER_TYPE: 'SET_ORDER_TYPE',
  SET_TABLE_NUMBER: 'SET_TABLE_NUMBER',
  SET_DISCOUNT: 'SET_DISCOUNT',
  CLEAR_CART: 'CLEAR_CART',
};

function cartReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_ITEM: {
      const { product } = action.payload;
      const existingIndex = state.items.findIndex(
        (item) => item.productId === product.id
      );

      if (existingIndex >= 0) {
        // Item already in cart — increment quantity
        const updatedItems = [...state.items];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + 1,
        };
        return { ...state, items: updatedItems };
      }

      // New item — add to cart
      return {
        ...state,
        items: [
          ...state.items,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            categoryIcon: product.categoryIcon || '',
          },
        ],
      };
    }

    case ACTIONS.REMOVE_ITEM: {
      return {
        ...state,
        items: state.items.filter(
          (item) => item.productId !== action.payload.productId
        ),
      };
    }

    case ACTIONS.UPDATE_QUANTITY: {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.productId !== productId),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        ),
      };
    }

    case ACTIONS.SET_ORDER_TYPE:
      return { ...state, orderType: action.payload };

    case ACTIONS.SET_TABLE_NUMBER:
      return { ...state, tableNumber: action.payload };

    case ACTIONS.SET_DISCOUNT:
      return { ...state, discount: action.payload };

    case ACTIONS.CLEAR_CART:
      return { ...initialState };

    default:
      return state;
  }
}

/**
 * CartProvider — Wraps the app to provide cart state
 */
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Calculate totals whenever state changes
  const totals = calculateOrderTotals(state.items, state.discount);

  // Action helpers
  const addItem = useCallback((product) => {
    dispatch({ type: ACTIONS.ADD_ITEM, payload: { product } });
  }, []);

  const removeItem = useCallback((productId) => {
    dispatch({ type: ACTIONS.REMOVE_ITEM, payload: { productId } });
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    dispatch({ type: ACTIONS.UPDATE_QUANTITY, payload: { productId, quantity } });
  }, []);

  const setOrderType = useCallback((orderType) => {
    dispatch({ type: ACTIONS.SET_ORDER_TYPE, payload: orderType });
  }, []);

  const setTableNumber = useCallback((tableNumber) => {
    dispatch({ type: ACTIONS.SET_TABLE_NUMBER, payload: tableNumber });
  }, []);

  const setDiscount = useCallback((discount) => {
    dispatch({ type: ACTIONS.SET_DISCOUNT, payload: discount });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_CART });
  }, []);

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    ...state,
    totals,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    setOrderType,
    setTableNumber,
    setDiscount,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

/**
 * useCart — Hook to access cart state and actions
 */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
