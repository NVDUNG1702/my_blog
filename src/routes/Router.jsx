// src/AppRouter.js
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import HomePage from "../pages/Home.page";
import Blog from "../pages/Blog.page";
import Admin from "../pages/Admin.page";
import AddBlog_component from "../components/admin/AddBlog_component";
import { ManageBlog_component } from "../components/admin/ManageBlog_component";
import LoginPage from "../pages/Login.page";
import { userStore } from "../zustand/store";
import Profile_component from "../components/user/Profile_component";
import User from "../pages/User.page";
import Home_component from "../components/user/Home_component";
import Chat_components from "../components/user/Chat_components";
import Follow_component from "../components/user/Follow_component";
import Notification_component from "../components/user/Notification_component";
import AddPost_component from "../components/user/AddPost_component";
import { Post_component } from "../components/user/profile/Post_component";
import EditProfile_component from "../components/user/EditProfile_component";
import Note_component from "../components/user/profile/Note_component";
import NoteDetaile_component from "../components/user/NoteDetaile_component";
import ListChat_component from "../components/user/chat/ListChat_component";
import ChatBox_component from "../components/user/chat/ChatBox_component";

function AppRouter() {
  const user = userStore((state) => state.user);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/page" element={<Blog />} />
        {Object.keys(user).length == 0 ? (
          <Route path="/login" element={<LoginPage />} />
        ) : (
          <></>
        )}
        <Route path="/userpanel" element={<User />}>
          <Route path=":userName/profile" element={<Profile_component />}>
            <Route index element={<Navigate to="post" replace />} />
            <Route path="post" element={<Post_component />} />
            <Route path="note" element={<Note_component />} />
          </Route>
          <Route path="home" element={<Home_component />} />
          <Route path="chat" element={<Chat_components />} >
            <Route index element={<Navigate to="list" replace />} />
            <Route path="list" element={<ListChat_component />} />
            <Route path=":userName" element={<ChatBox_component />} />
          </Route>
          <Route path="follow" element={<Follow_component />} />
          <Route path="notification" element={<Notification_component />} />
          <Route path="addPost" element={<AddPost_component />} />
          <Route path="editProfile" element={<EditProfile_component />} />
          <Route
            path=":userName/note/:idNote"
            element={<NoteDetaile_component />}
          />
        </Route>
        <Route path="/admin" element={<Admin />}>
          <Route path="addBlog" element={<AddBlog_component />} />
          <Route path="manageBlog" element={<ManageBlog_component />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
