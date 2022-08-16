// import axios from "axios";
import { publicRequestRetail } from "../requestMethods";
import { getCatalogs,getCategories, getAllProducts, getProducts, loadinGo, errorGo } from "./retailRedux";

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
    //   console.log(res.data);
      const { categories } = res.data;
      let allProducts = []
      if(categories.length > 0){
        allProducts = categories.reduce((acc, curr) => {
            return acc.concat(curr.products);
        }, []);
      }
      dispatch(getAllProducts(allProducts));
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


  async function fetchProducts(dispatch, ids) {
    dispatch(loadinGo());

    try {
        const res = await publicRequestRetail.get(`/products/ids`, { params: { ids } });
        // console.log(res.data);
        dispatch(getProducts(res.data))
    } catch (err) {
        console.log(err)
        dispatch(errorGo());
    }
  }

  function  thereIsNoProducts (dispatch){
    dispatch(getProducts([]))
  }


  export { getAllCataloges, getCategoriesOfCatalog, fetchProducts, thereIsNoProducts }
