// src/HomePage.js
import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div style={st.container}>
      <h1>Welcome to Blog</h1>
      <button onClick={() => navigate("/page")} style={st.button}>
        Go to Blog
      </button>
      <button onClick={() => navigate("/admin")} style={st.button}>
        Go to Admin
      </button>
    </div>
  );
};

const st = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
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
