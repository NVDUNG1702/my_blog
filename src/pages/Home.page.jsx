// src/HomePage.js
import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import Header_components from "../components/home/header/Header_components";
import { userStore } from "../zustand/store";

const HomePage = () => {
  // const navigate = useNavigate();
  const user = userStore((state) => state.user);

  return (
    <div style={st.container}>
      <Header_components />
    </div>
  );
};

const st = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // justifyContent: "center",
    height: "200vh",
    backgroundColor: "#f0f0f0",
  },
  button: {
    margin: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default HomePage;

{
  /* <h1>Welcome to Blog</h1>
      <button onClick={() => navigate("/page")} style={st.button}>
        Go to Blog
      </button>
      <button onClick={() => navigate("/admin")} style={st.button}>
        Go to Admin
      </button> */
}
