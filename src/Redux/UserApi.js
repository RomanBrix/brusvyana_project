import axios from "axios";
import { loginFailure, loginStart, loginSuccess, logut } from "./userRedux";
import Cookie from "js-cookie";
import { changeToken, createUserAxiosRequest } from "../requestMethods";

const userRequest  = createUserAxiosRequest('user');

async function login(dispatch, login, password) {
    dispatch(loginStart());
    try {
      // const res = await axios.post("/auth/login", {login, password});
      const res = await userRequest.post("/auth/login", {login, password});
      console.log(res);
      Cookie.set('login', 'ok',{ expires: 1 })
      console.log(res.data)
      changeToken(res.data.token, res.data.username)
      dispatch(loginSuccess(res.data));
    } catch (error) {
      console.log(error.response.data);
      dispatch(loginFailure());
    }
  }

  async function logoutUser(dispatch, ) {
   
    changeToken();
    dispatch(logut());
    
  }



  export { login, logoutUser }
