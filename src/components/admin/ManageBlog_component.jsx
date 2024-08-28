import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase.config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRemove } from "@fortawesome/free-solid-svg-icons";
// import { blogAPI } from "../../service/blogAPI";

export const ManageBlog_component = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, "posts"));
      //   console.log(querySnapshot.docs[0].data());

      setPosts(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };

    fetchPosts();
    console.log(posts);
  }, []);

  const deletPost = async (id) => {
    try {
      const docRef = doc(db, "posts", id); // "posts" là collectionName
      await deleteDoc(docRef);
      console.log(`Post with ID ${id} has been deleted.`);
      alert(`Post with ID ${id} has been deleted.`);
      const newPost = posts.filter((item) => item.id != id);
      setPosts(newPost);
    } catch (error) {
      alert(`"Error deleting post:  ${error}`);
      console.error("Error deleting post: ", error);
    }
  };
  return (
    <div className="manageContainer">
      {posts == "" || posts.length == 0 ? (
        <></>
      ) : (
        posts.map((post, i) => {
          return (
            <div key={i} className="itemManage d-flex w-75 m-3">
              <div className="w-100 text-left ">
                <p>ID: {post.id}</p>
                <p>{post.title}</p>
              </div>
              <button
                className="btn"
                onClick={() => {
                  deletPost(post.id);
                }}
              >
                <FontAwesomeIcon icon={faRemove} className="" />
              </button>
            </div>
          );
        })
      )}
    </div>
  );
};
