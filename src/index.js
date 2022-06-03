import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./style.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import RoomList from "./pages/BasicUser/Room_List";
import Room from "./pages/BasicUser/Room";
import Box from "./pages/BasicUser/Box";
import ObjectModify from "./pages/BasicUser/Object_Modify";
import BoxList from "./pages/BasicUser/Box_List";
import ObjectList from "./pages/BasicUser/Object_List";
import Profile from "./pages/Profile";
import Search from "./pages/BasicUser/Search";
import UserList from "./pages/SocietyUser/User_List";
import User from "./pages/SocietyUser/User";
import Personalize from "./pages/SocietyUser/Personalize";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
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
      </Route>
      <Route path="object">
        <Route path="modify/:id" element={<ObjectModify />}></Route>
        <Route path="list" element={<ObjectList />}></Route>
      </Route>
      <Route path="/profile" element={<Profile />}></Route>
      <Route path="/search" element={<Search />}></Route>
      <Route path="society">
        <Route path="users" element={<UserList />}></Route>
        <Route path="user/:id" element={<User />}></Route>
        <Route path="personalize" element={<Personalize />}></Route>
      </Route>
    </Routes>
  </BrowserRouter>
);
