import { setProducts, loadingStart } from "./cartRedux";



async function goSetProducts(dispatch, prodArray) {
    dispatch(loadingStart());
    // console.log(dispatch);
    try{

        dispatch(setProducts(prodArray))
        // setProducts(prodArray)
    }catch(err){
        console.log(err)
    }
  }



  export { goSetProducts }
