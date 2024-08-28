import React from "react";
import "../styles/Admin.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
const Admin = () => {
  const nav = useNavigate();
  return (
    <div className="containerAdmin">
      <h2>Admin - Quản lý bài viết</h2>
      <button className="btn iconBack" onClick={()=>{nav("/", { replace: true })}}>
        <FontAwesomeIcon icon={faAngleLeft} className="icon"/>
      </button>
      <div className="w-100">
        <Link to="manageBlog" className="text-light btn btn-primary w-25 m-5">
          Manager
        </Link>
        <Link to="addBlog" className="text-light btn btn-primary w-25 m-5">
          Add
        </Link>
      </div>
      <Outlet />
    </div>
  );
};

export default Admin;
