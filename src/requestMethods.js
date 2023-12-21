import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL_RETAIL = "http://localhost:1489/api";
const BASE_URL_USER = "http://localhost:1489/user";
const BASE_URL_BOT = "http://localhost:1489/bot";
// const BASE_URL_BOT = "https://devserver.brusvyana.com.ua/bot"; //test server
// const BASE_URL_RETAIL = "https://devserver.brusvyana.com.ua/api"; // test server
// const BASE_URL_USER = "https://devserver.brusvyana.com.ua/user"; // test server

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

export function createUserAxiosRequest(url = BASE_URL_RETAIL) {
    let baseUrl = url;
    if (url === "user") {
        baseUrl = BASE_URL_USER;
    }
    if (url === "bot") {
        baseUrl = BASE_URL_BOT;
    }
    // console.log(baseUrl);
    const api = axios.create({
        baseURL: baseUrl,
        headers: { token: `${USERNAME} ${TOKEN}` },
        rejectUnauthorized: false, // asdasdasdasdasd
    });
    api.interceptors.response.use(
        (response) => response,
        (error) => {
            //handle error at top level
            if (error.response.data === "Token is not valid!") {
                // logoutUser(dispatch);
                Cookies.remove("login");
                window.location.reload();
            }
            throw error;
        }
    );
    return api;
}

// export const userRequestRetail = axios.create({
//   baseURL: BASE_URL_RETAIL,
//   headers: { token: `${USERNAME} ${TOKEN}` },
// });
