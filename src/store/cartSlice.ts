// src/store/cartSlice.js

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
    id: string;
    name: string;
    quantity: number;
    price: number;  // Optional: if you want to store price or other properties
    imageUrl?: string;
    category?: string;
}

interface CartState {
    items: CartItem[];
    totalPrice: number;
    totalCount: number;
}

const initialState: CartState = {
  items: [],
  totalPrice: 0,
  totalCount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload;
      const existingItem = state.items.find((i:any) => i.id === item.id);
      state.totalPrice+=item.price;
      state.totalCount+=1;
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        state.items.push(item);
      }
    },
    incrementQuantity: (state, action) => {
      const itemId = action.payload;
      const existingItem = state.items.find((i) => i.id === itemId);

      if (existingItem) {
        existingItem.quantity += 1;
      }
    },
    decrementQuantity: (state, action: PayloadAction<String>) => {
      const itemId = action.payload;
      const existingItem = state.items.find((i) => i.id === itemId);
      if (existingItem) state.totalPrice-=existingItem.price;
      state.totalCount-=1;
      if (existingItem && existingItem.quantity > 1) {
        existingItem.quantity -= 1;
      } else {
        state.items = state.items.filter((i) => i.id !== itemId);
      }
    },
    removeItem: (state, action) => {
      const itemId = action.payload;
      const existingItem = state.items.find((i) => i.id === itemId);
      if(existingItem) {
        state.totalPrice-=existingItem.price*existingItem.quantity;
        state.totalCount-=existingItem.quantity;
      }
      state.items = state.items.filter((i) => i.id !== itemId);
    },
    emptyCart: (_state, _action) => initialState,
  },
});

export const { addItem, incrementQuantity, decrementQuantity, removeItem, emptyCart } = cartSlice.actions;
export default cartSlice.reducer;
