import axios from "axios";
import { loginFailure, loginStart, loginSuccess, logut } from "./userRedux";
import Cookie from "js-cookie";
import { changeToken } from "../requestMethods";
axios.defaults.baseURL = 'http://localhost:1337/api';
// axios.defaults.baseURL = 'https://black-work.site:1337/api';
// https://black-work.site:1338/
// axios.defaults.headers.common['token'] = state.user.token;



async function login(dispatch, login, password) {
    dispatch(loginStart());
    try {
    //   console.log(user)
      const res = await axios.post("/auth/login", {login, password});
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
