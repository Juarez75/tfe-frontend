import axios from "axios";
import { useNavigate } from "react-router-dom";
let refresh = false;

axios.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    if (error.response.status == 401 && !refresh) {
      refresh = true;
      axios
        .get("http://localhost:3001/refreshToken", { withCredentials: true })
        .then(() => {
          return axios.request(error.config);
        })
        .catch((e) => {
          console.log("test");
          localStorage.clear("type");
          localStorage.clear("id_society");
          localStorage.clear("color");
          useNavigate("/");
          return e;
        });
    }
    refresh = false;
    return error;
  }
);
