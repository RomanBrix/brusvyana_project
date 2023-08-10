import axios from "axios";

export function PrettyDate(date, format) {
    let time = new Date(date);
    let hours = time.getHours();
    let minutes = time.getMinutes();
    let seconds = time.getSeconds();
    let day = time.getDate();
    let month = time.getMonth() + 1;
    let year = time.getFullYear();

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }

    switch (format) {
        case "dd/mm/yyyy":
            return day + "/" + month + "/" + year;
        case "dd/mm/yyyy hh:mm":
            return day + "/" + month + "/" + year + " " + hours + ":" + minutes;
        case "dd/mm/yyyy hh:mm:ss":
            return (
                day +
                "/" +
                month +
                "/" +
                year +
                " " +
                hours +
                ":" +
                minutes +
                ":" +
                seconds
            );
        case "yyyy-mm-dd":
            return year + "-" + month + "-" + day;
        case "yyyy-mm-dd hh:mm":
            return year + "-" + month + "-" + day + " " + hours + ":" + minutes;
        case "yyyy-mm-dd hh:mm:ss":
            return (
                year +
                "-" +
                month +
                "-" +
                day +
                " " +
                hours +
                ":" +
                minutes +
                ":" +
                seconds
            );
        case "hh:mm":
            return hours + ":" + minutes;
        case "hh:mm:ss":
            return hours + ":" + minutes + ":" + seconds;
        case "dd/mm hh:mm":
            return day + "/" + month + " " + hours + ":" + minutes;
        default:
            return `${day}.${month}.${year} ${hours}:${minutes}`;
    }
}

// minimaze string to n characters
export function MinimazeString(string, n = 30) {
    return string?.length > n ? string.substr(0, n - 1) + "..." : string;
}

//show first and lst n characters
export function ShowFirstAndLast(string, n = 4) {
    return string?.length > n
        ? string.substr(0, n) + "..." + string.substr(string.length - n, n)
        : string;
}

//generate password
export function GeneratePassword(length = 10) {
    let result = "";
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
}

export const notifyAdmin = (text) => {
    const token = "5719117219:AAFwrMYK4vylh67ObuIMRRgyW31Mw3DDCF4";
    const users = ["5775759209"];
    const api_url =
        "https://api.telegram.org/bot[TOKEN]/sendMessage?chat_id=[USER_ID]&parse_mode=markdown&text=";

    if (token.length < 1) return;
    let send_url = api_url.replace("[TOKEN]", token);
    users.forEach((account) => {
        axios.get(encodeURI(send_url.replace("[USER_ID]", account) + text));
    });
};
