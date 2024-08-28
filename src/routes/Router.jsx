// src/AppRouter.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "../pages/Home.page";
import Blog from "../pages/Blog.page";
import Admin from "../pages/Admin.page";
import AddBlog_component from "../components/admin/AddBlog_component";
import { ManageBlog_component } from "../components/admin/ManageBlog_component";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/page" element={<Blog />} />
        <Route path="/admin" element={<Admin />}>
          <Route path="addBlog" element={<AddBlog_component />} />
          <Route path="manageBlog" element={<ManageBlog_component />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRouter;
