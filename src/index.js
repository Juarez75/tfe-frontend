import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./style.css";
import "./interceptor/axios.js";

import Login from "./pages/CommonPage/Login";
import Register from "./pages/CommonPage/Register";
import RoomList from "./pages/BasicUser/Room_List";
import Room from "./pages/BasicUser/Room";
import Box from "./pages/BasicUser/Box";
import BoxList from "./pages/BasicUser/Box_List";
import ObjectList from "./pages/BasicUser/Object_List";
import Profile from "./pages/CommonPage/Profile";
import Search from "./pages/BasicUser/Search";
import UserList from "./pages/SocietyUser/User_List";
import User from "./pages/SocietyUser/User";
import Personalize from "./pages/SocietyUser/Personalize";
import Pdf from "./pages/SocietyUser/Pdf";
import { createBrowserHistory } from "history";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import QrReader from "./pages/CommonPage/QrReader";
import BoxByQR from "./pages/CommonPage/BoxByQR";
export const history = createBrowserHistory({ window });
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <HistoryRouter history={history}>
    <Routes>
      <Route path="/" element={<Login />}></Route>
      <Route path="/register" element={<Register />}></Route>
      <Route path="room">
        <Route path="list" element={<RoomList />}></Route>
        <Route path=":id" element={<Room />}></Route>
      </Route>
      <Route path="box">
        <Route path=":id" element={<Box />}></Route>
        <Route path="list" element={<BoxList />}></Route>
        <Route path="QR/:id" element={<BoxByQR />}></Route>
      </Route>
      <Route path="object">
        <Route path="list" element={<ObjectList />}></Route>
      </Route>
      <Route path="/profile" element={<Profile />}></Route>
      <Route path="/search" element={<Search />}></Route>
      <Route path="/scanQR" element={<QrReader />}></Route>
      <Route path="society">
        <Route path="pdf/:id" element={<Pdf />}></Route>
        <Route path="users" element={<UserList />}></Route>
        <Route path="user/:id" element={<User />}></Route>
        <Route path="personalize" element={<Personalize />}></Route>
      </Route>
    </Routes>
  </HistoryRouter>
);
