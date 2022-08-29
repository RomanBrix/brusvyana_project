import axios from "axios";

// const BASE_URL_RETAIL = "http://localhost:1338/api";
// const BASE_URL_BOT = "http://localhost:1339/bot";
const BASE_URL_BOT = "https://black-work.site:1339/bot";
const BASE_URL_RETAIL = "https://black-work.site:1338/api";

// const TOKEN =
//   JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser
//     .accessToken || "";

let user = JSON.parse(localStorage.getItem("persist:root"))?.user;
let currentUser = user && JSON.parse(user).currentUser;
let TOKEN = currentUser?.token;
let USERNAME = currentUser?.username;


export function changeToken(token = undefined, username = undefined) {
  TOKEN = token;
  USERNAME = username;
  console.log(TOKEN);
  return true;
}

export const publicRequestRetail = axios.create({
  baseURL: BASE_URL_RETAIL,
});

export const botPublicRequest = axios.create({
  baseURL: BASE_URL_BOT,
});


export function createUserAxiosRequest(){

  return axios.create({
    baseURL: BASE_URL_RETAIL,
    headers: { token: `${USERNAME} ${TOKEN}`,   },
    rejectUnauthorized : false, // asdasdasdasdasd
  });
}
// export const userRequestRetail = axios.create({
//   baseURL: BASE_URL_RETAIL,
//   headers: { token: `${USERNAME} ${TOKEN}` },
// });
