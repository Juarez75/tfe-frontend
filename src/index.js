import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import RoomCreate from "./pages/Room_Create";
import RoomList from "./pages/Room_List";
import Room from "./pages/Room";
import RoomModify from "./pages/Room_Modify";
import BoxCreate from "./pages/Box_Create";
import BoxModify from "./pages/Box_Modify";
import Box from "./pages/Box";
import ObjectCreate from "./pages/Object_Create";
import ObjectModify from "./pages/Object_Modify";
import BoxList from "./pages/Box_List";
import ObjectList from "./pages/Object_List";
import Profile from "./pages/Profile";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />}></Route>
      <Route path="/register" element={<Register />}></Route>
      <Route path="room">
        <Route path="create" element={<RoomCreate />}></Route>
        <Route path="list" element={<RoomList />}></Route>
        <Route path=":id" element={<Room />}></Route>
        <Route path="modify/:id" element={<RoomModify />}></Route>
      </Route>
      <Route path="box">
        <Route path="create/:id" element={<BoxCreate />}></Route>
        <Route path="modify/:id" element={<BoxModify />}></Route>
        <Route path=":id" element={<Box />}></Route>
        <Route path="list" element={<BoxList />}></Route>
      </Route>
      <Route path="object">
        <Route path="create/:id" element={<ObjectCreate />}></Route>
        <Route path="modify/:id" element={<ObjectModify />}></Route>
        <Route path="list" element={<ObjectList />}></Route>
      </Route>
      <Route path="/profile" element={<Profile />}></Route>
    </Routes>
  </BrowserRouter>
);
