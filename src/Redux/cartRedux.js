import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    currentUser: null,
    loading: false,
    error: false,
    products: []
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
    setProducts:(state, action)=>{
        // console.log(action)
      state.loading = false;
      state.products = action.payload;
    }
  },
});

export const { loadingStart, setUser, setError, setProducts } = cartSlice.actions;
export default cartSlice.reducer;