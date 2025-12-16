/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "reel_cart_v1";

function safeLoad() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const initialState = {
  partnerId: null,
  itemsById: {},
};

function reducer(state, action) {
  switch (action.type) {
    case "HYDRATE": {
      if (!action.payload) return state;
      return {
        partnerId: action.payload.partnerId ?? null,
        itemsById: action.payload.itemsById ?? {},
      };
    }

    case "CLEAR":
      return initialState;

    case "ADD_ITEM": {
      const { partnerId, item } = action.payload;

      // Enforce single-partner cart.
      if (state.partnerId && state.partnerId !== partnerId) {
        return state; // UI should confirm + clear before calling ADD_ITEM
      }

      const existing = state.itemsById[item.foodId];
      const nextQty = (existing?.quantity ?? 0) + 1;

      return {
        partnerId,
        itemsById: {
          ...state.itemsById,
          [item.foodId]: {
            ...existing,
            ...item,
            quantity: nextQty,
          },
        },
      };
    }

    case "SET_QTY": {
      const { foodId, quantity } = action.payload;
      const existing = state.itemsById[foodId];
      if (!existing) return state;

      if (quantity <= 0) {
        const { [foodId]: _removed, ...rest } = state.itemsById;
        const nextPartnerId = Object.keys(rest).length ? state.partnerId : null;
        return { partnerId: nextPartnerId, itemsById: rest };
      }

      return {
        ...state,
        itemsById: {
          ...state.itemsById,
          [foodId]: {
            ...existing,
            quantity,
          },
        },
      };
    }

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: "HYDRATE", payload: safeLoad() });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const items = useMemo(() => Object.values(state.itemsById), [state.itemsById]);
  const totalItems = useMemo(
    () => items.reduce((sum, it) => sum + (it.quantity ?? 0), 0),
    [items]
  );

  const api = useMemo(
    () => ({
      partnerId: state.partnerId,
      itemsById: state.itemsById,
      items,
      totalItems,

      clearCart: () => dispatch({ type: "CLEAR" }),

      addItem: ({ partnerId, item }) => dispatch({ type: "ADD_ITEM", payload: { partnerId, item } }),

      setQty: ({ foodId, quantity }) => dispatch({ type: "SET_QTY", payload: { foodId, quantity } }),
    }),
    [state.partnerId, state.itemsById, items, totalItems]
  );

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
