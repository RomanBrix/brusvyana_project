import { createSlice } from "@reduxjs/toolkit";

const retailSlice = createSlice({
  name: "retail",
  initialState: {
    catalogs: [],
    categories: null,
    products: null,
    countAllProducts: null,

    loading: false,
    error: false,
  },
  reducers: {
    loadinGo: (state) => {
       state.loading = true;
    }, 
    getCatalogs: (state, action) => {
      // console.log(state);
      // console.log(action.payload);
        state.catalogs = action.payload;
        state.loading = false;
    },
    getCategories: (state, action) => {
        state.categories = action.payload;
        state.loading = false;
    },
    getAllProducts: (state, action) => {
      state.countAllProducts = action.payload;
      state.loading = false;
    },
    getProducts: (state, action) => {
      // console.log(action.payload);
      state.products = action.payload;
      // state.countAllProducts = []
      state.loading = false;
    },
    errorGo: (state)=>{
        state.error = true;
        state.loading = false;
    }
    
  },
});

export const { loadinGo, getCatalogs, getCategories, getAllProducts, getProducts, errorGo } = retailSlice.actions;
export default retailSlice.reducer;