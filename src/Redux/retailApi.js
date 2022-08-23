// import axios from "axios";
import { publicRequestRetail } from "../requestMethods";
import { getCatalogs,getCategories, getAllProducts, getProducts, loadinGo, errorGo, clearCatalogGo, fetchLoadingGo, fetchLoadingStop } from "./retailRedux";

// axios.defaults.baseURL = 'http://localhost:1338/api';





async function getAllCataloges(dispatch, answer) {
    dispatch(loadinGo());
    try {
    //   console.log(user)
      const res = await publicRequestRetail.get("/catalog");
    //   console.log(res);
      dispatch(getCatalogs(res.data));
      answer(res.data[0]?._id)
    } catch (error) {
      console.log(error.response.data);
      dispatch(errorGo());
    }
  }



async function getCategoriesOfCatalog(dispatch, id, answer) {
    dispatch(loadinGo());
    try {
    //   console.log(user)
      const res = await publicRequestRetail.get(`/catalog/${id}/categories`);
      // console.log(res.data);
      const { categories } = res.data;
      // let allProducts = []
      // if(categories.length > 0){
      //   allProducts = categories.reduce((acc, curr) => {
      //       return acc.concat(curr.products);
      //   }, []);
      // }
      // dispatch(getAllProducts(allProducts.length));
      dispatch(getCategories(categories));
    } catch (error) {
      console.log(error.response.data);
      if(error.response.data.message === "Catalog not found"){
        answer("Catalog not found")
      }else{
        dispatch(errorGo());
      }
    }
  }
  async function lengthOfAllCatalogProducts(dispatch, catalogId){
    try{
      const res = await publicRequestRetail.get(`/catalog/catalogProducts`, { params: { id: catalogId } });
      
      dispatch(getAllProducts(res.data));
    }catch{
      dispatch(errorGo());

    }

  }


  async function fetchProducts(dispatch, ids) {
    dispatch(fetchLoadingGo());

    try {
        const res = await publicRequestRetail.get(`/products/ids`, { params: { ids } });
        // console.log(res.data);
        dispatch(getProducts(res.data))
        dispatch(fetchLoadingStop());
        
    } catch (err) {
        console.log(err)
        dispatch(errorGo());
    }
  }

  async function fetchProductsByCategory(dispatch, category) {
    dispatch(loadinGo());

    try {
        const res = await publicRequestRetail.get(`/products/category`, { params: { category } });
        // console.log(res.data);
        dispatch(getProducts(res.data.products))
        dispatch(getAllProducts(res.data.count));

    } catch (err) {
        console.log(err)
        dispatch(errorGo());
    }
  }

  async function changePageQuery(dispatch, options, limit = null) {
    dispatch(loadinGo());
    try {
        const res = await publicRequestRetail.get(`/products/query`, { params: { options, limit } });
        // console.log(res.data);
        dispatch(getProducts(res.data))
        // dispatch(getAllProducts(res.data.count));

    } catch (err) {
        console.log(err)
        dispatch(errorGo());
    }
  }



  function  thereIsNoProducts (dispatch){
    dispatch(getProducts([]))
  }


  function clearCatalog(dispatch) {
    dispatch(clearCatalogGo())
  }

  export { getAllCataloges, getCategoriesOfCatalog, fetchProducts, thereIsNoProducts, clearCatalog, fetchProductsByCategory, lengthOfAllCatalogProducts, changePageQuery }
