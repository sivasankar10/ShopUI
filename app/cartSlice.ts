import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: number;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: { [key: number]: CartItem };
}

const initialState: CartState = {
  items: {},
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const item = action.payload;
      if (state.items[item.id]) {
        state.items[item.id].quantity += 1;
      } else {
        state.items[item.id] = { ...item, quantity: 1 };
      }
    },
    incrementQuantity(state, action: PayloadAction<number>) {
      const id = action.payload;
      if (state.items[id]) {
        state.items[id].quantity += 1;
      }
    },
    decrementQuantity(state, action: PayloadAction<number>) {
      const id = action.payload;
      if (state.items[id]) {
        state.items[id].quantity -= 1;
        if (state.items[id].quantity <= 0) {
          delete state.items[id];
        }
      }
    },
  },
});

export const { addToCart, incrementQuantity, decrementQuantity } = cartSlice.actions;
export default cartSlice.reducer;
