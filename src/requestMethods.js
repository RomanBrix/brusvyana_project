import axios from "axios";

const BASE_URL_RETAIL = "http://localhost:1338/api";
// const TOKEN =
//   JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser
//     .accessToken || "";

const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
const currentUser = user && JSON.parse(user).currentUser;
const TOKEN = currentUser?.token;
const USERNAME = currentUser?.username;


export const publicRequestRetail = axios.create({
  baseURL: BASE_URL_RETAIL,
});

export const userRequestRetail = axios.create({
  baseURL: BASE_URL_RETAIL,
  headers: { token: `${USERNAME} ${TOKEN}` },
});