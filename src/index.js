import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Room_Create from "./pages/Room_Create";
import Room_List from "./pages/Room_List";
import Room from "./pages/Room";
import Box_Create from "./pages/Box_Create";

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
      </Route>
      <Route path="box">
        <Route path="create" element={<Box_Create />}></Route>
      </Route>
    </Routes>
  </BrowserRouter>
);
