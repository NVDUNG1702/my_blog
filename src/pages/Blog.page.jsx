import React, { useState, useEffect } from "react";
import { db } from "../firebase.config";
import { collection, getDocs } from "firebase/firestore";
import "../styles/Block.css";
import ItemBlog_component from "../components/blog/ItemBlog_component";

const Blog = () => {
  const [posts, setPosts] = useState([]);



  useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, "posts"));
      console.log(querySnapshot.docs[0].data());

      setPosts(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };

    fetchPosts();
    console.log(posts);
  }, []);

  return (
    <div className="containerBlog">
      <h2>Danh sách bài viết</h2>
      {posts.map((post) => (
        <ItemBlog_component item={post} />
      ))}
    </div>
  );
};

export default Blog;
