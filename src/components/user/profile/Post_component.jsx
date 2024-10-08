import React, { useEffect, useState } from "react";
import styles from "./PostStyle.module.scss";
import clsx from "clsx";
import { postAPI } from "../../../service/postAPI";
import { userStore } from "../../../zustand/store";
import { useParams } from "react-router-dom";
import { extractText } from "../../../utils/extractText";
import { getFirstImageSrc } from "../../../utils/getImage";
import { timeAgo } from "../../../utils/format_time";

export const Post_component = () => {
  const { userName } = useParams();
  const [post, setPost] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const data = await postAPI.getPostByUID(userName.substring(1));
        if (data.status === 200) {
          setPost(data.data);
          console.log(data.data);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  return (
    <div className={clsx(styles.container)}>
      {post !== "" ? (
        post.map((item) => (
          <div className={clsx(styles.itemContainer, "j_between")}>
            <div>
              <h5>{item.title}</h5>
              <div dangerouslySetInnerHTML={{ __html: extractText(item.content, 60) }}></div>
              <p className="p">{`${item.author} . ${timeAgo(
                item.createdAt
              )}`}</p>
            </div>
            <div style={{ height: '100px' }}>
              {getFirstImageSrc(item.content) !== null && (
                <img
                  src={getFirstImageSrc(item.content)}
                  alt="img"
                  height={"100px"}
                />
              )}
            </div>
          </div>
        ))
      ) : (
        <></>
      )}
    </div>
  );
};
