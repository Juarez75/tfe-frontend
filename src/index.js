import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Room_Create from "./pages/Room_Create";
import Room_List from "./pages/Room_List";
import Room from "./pages/Room";
import Room_Modify from "./pages/Room_Modify";
import Box_Create from "./pages/Box_Create";
import Box_Modify from "./pages/Box_Modify";
import Box from "./pages/Box";
import Object_Create from "./pages/Object_Create";
import Object_Modify from "./pages/Object_Modify";
import Box_List from "./pages/Box_List";
import Object_List from "./pages/Object_List";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />}></Route>
      <Route path="/register" element={<Register />}></Route>
      <Route path="room">
        <Route path="create" element={<Room_Create />}></Route>
        <Route path="list" element={<Room_List />}></Route>
        <Route path=":id" element={<Room />}></Route>
        <Route path="modify/:id" element={<Room_Modify />}></Route>
      </Route>
      <Route path="box">
        <Route path="create/:id" element={<Box_Create />}></Route>
        <Route path="modify/:id" element={<Box_Modify />}></Route>
        <Route path=":id" element={<Box />}></Route>
        <Route path="list" element={<Box_List />}></Route>
      </Route>
      <Route path="object">
        <Route path="create/:id" element={<Object_Create />}></Route>
        <Route path="modify/:id" element={<Object_Modify />}></Route>
        <Route path="list" element={<Object_List />}></Route>
      </Route>
    </Routes>
  </BrowserRouter>
);
