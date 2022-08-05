// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// let refresh = false;

// axios.interceptors.response.use(
//   (res) => {
//     return res;
//   },
//   async (error) => {
//     if (error.response.status == 401 && !refresh) {
//       refresh = true;
//       await axios
//         .get("http://localhost:3001/refreshToken", { withCredentials: true })
//         .then(() => {
//           axios.request(error.config).then((res) => {
//             console.log("pq 1");
//             return res;
//           });
//         })
//         .catch((e) => {
//           localStorage.clear("type");
//           localStorage.clear("id_society");
//           localStorage.clear("color");
//           useNavigate("/");
//           return e;
//         });
//     }
//     refresh = false;
//     console.log("pq 2");
//     return error;
//   }
// );
import axios from "axios";
import { replace } from "lodash";
import { useNavigate } from "react-router-dom";
import { history } from "../index";
let refresh = false;

axios.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error) => {
    if (error.response.status == 401 && !refresh) {
      refresh = true;
      try {
        const refreshed = await axios.get(
          "http://localhost:3001/refreshToken",
          {
            withCredentials: true,
          }
        );
        if (refreshed.response.status > 200) throw new Error("refreshed");
        return await axios.request(error.config);
      } catch (e) {
        localStorage.clear("type");
        localStorage.clear("id_society");
        localStorage.clear("color");
        history.replace("/");
        return error;
      }
    }
    refresh = false;
    return error;
  }
);
