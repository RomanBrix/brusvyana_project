import { createSlice } from "@reduxjs/toolkit";

const retailSlice = createSlice({
  name: "retail",
  initialState: {
    catalogs: [],
    categories: null,
    products: null,
    countAllProducts: null,

    loading: false,
    loadingProduct: true,
    fetchLoading: false,
    error: false,
  },
  reducers: {
    loadinGo: (state) => {
       state.loading = true;
    }, 
    loadingProduct: (state) => {
      state.loadingProduct = true;
    },
    loadingProductStop: (state) => {
      state.loadingProduct = false;
    },
    fetchLoadingGo: (state) => {
       state.fetchLoading = true;
    }, 
    fetchLoadingStop: (state) => {
      state.fetchLoading = false;
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
        state.loadingProduct = false;
        state.fetchLoading = false;
    },
    clearCatalogGo: (state)=>{
        state.products = null;
        state.categories = null;
        state.catalogs = [];
        state.countAllProducts = null;
    }
  },
});

export const { loadinGo, getCatalogs, getCategories, getAllProducts, getProducts, errorGo, clearCatalogGo, fetchLoadingGo, fetchLoadingStop, loadingProduct, loadingProductStop } = retailSlice.actions;
export default retailSlice.reducer;