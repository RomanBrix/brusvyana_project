import axios from "axios";
import { loginFailure, loginStart, loginSuccess } from "./userRedux";

axios.defaults.baseURL = 'http://localhost:1337/api';
// axios.defaults.headers.common['token'] = state.user.token;



async function login(dispatch, login, password) {
    dispatch(loginStart());
    try {
    //   console.log(user)
      const res = await axios.post("/auth/login", {login, password});
      console.log(res);
      dispatch(loginSuccess(res.data));
    } catch (error) {
      console.log(error.response.data);
      dispatch(loginFailure());
    }
  }



  export { login }
