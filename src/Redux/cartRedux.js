import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    loading: false,
    error: false,
    products: [],
    guestUser: null,
    prefferedDeliveryMethod: null,
    prefferedPaymentMethod: null,
  },
  reducers: {
    loadingStart: (state) => {
      state.loading = true;
      state.error = false;
    },
    setUser: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
    },
    setError: (state) => {
      state.loading = false;
      state.error = true;
    },
    acceptOrder: (state, action) => {
      state.loading = false;
      state.error = false;
      state.products = [];
      state.guestUser = action.payload.guestUser;
      state.prefferedDeliveryMethod = action.payload.prefferedDeliveryMethod;
      state.prefferedPaymentMethod = action.payload.prefferedPaymentMethod;
    },
    setProducts:(state, action)=>{
        // console.log(action)
      state.loading = false;
      state.products = action.payload;
    }
  },
});

export const { loadingStart, setUser, setError, setProducts, acceptOrder } = cartSlice.actions;
export default cartSlice.reducer;