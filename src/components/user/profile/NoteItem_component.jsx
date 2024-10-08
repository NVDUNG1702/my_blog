import React, { useEffect, useState } from "react";
import {
  ChatBubbleOutline,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";
import clsx from "clsx";
import { timeAgo } from "../../../utils/format_time";
import styles from "./NoteStyle.module.scss";
import { noteAPI } from "../../../service/noteAPI";
import { useNavigate } from "react-router-dom";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { userStore } from "../../../zustand/store";

const videoExtensions = ["mp4", "webm", "avi", "mov", "mkv"];

const NoteItem = React.memo(({ item, userAvatar, userName, userFullName, deleteItem }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.like);
  const nav = useNavigate();
  const user = userStore(state => state.user);

  // console.log(item);


  const [anchorEl, setAnchorEl] = useState(null);

  const handleShowAnchorEl = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const handleShowNote = () => {
    // nav("/user/note/1");
    nav(`/userpanel/@${userName}/note/${item.id}`);
  };

  const removeNoteByID = async (event) => {
    event.stopPropagation();
    const res = await noteAPI.deleteNoteByID(item.id);
    if (res.status === 200 || res.status === 404) {
      deleteItem(item.id)
      Swal.fire({
        // position: "top-end",
        icon: "success",
        title: "SignIn success",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  useEffect(() => {
    (async () => {
      const res = await noteAPI.checkLike(item.id);
      if (res.status === 200) {
        setIsLiked(res.check);
      }
    })();
  }, []);

  const handleLike = async (event) => {
    event.stopPropagation();
    try {
      const res = await noteAPI.likeNote(item.id);
      console.log(res);

      if (res.status === 201) {
        setIsLiked(true);
        setLikeCount(likeCount + 1);
      } else if (res.status === 200) {
        setIsLiked(false);
        setLikeCount(likeCount - 1);
      }
    } catch (error) { }

    // Call API to update like status here
  };

  const media = JSON.parse(item.media);

  return (
    <div
      key={item.id}
      className={clsx("d-flex py-3", styles.containerItem)}
      onClick={handleShowNote}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          overflow: "hidden",
          position: "relative",
        }}
        className={clsx("rounded-circle")}
      >
        {userAvatar !== " " && (
          <img
            src={userAvatar}
            alt="avt"
            width={"36px"}
            style={{ position: "absolute", top: -10 }}
          />
        )}
      </div>
      <div className={clsx("ps-2", styles.containerContentRight)}>
        <div className="j_between">
          <div>
            <span className="fw-medium">{userFullName}</span>
            <span className="text-black-50">{`${" "}  ${timeAgo(
              item.createdAt
            )}`}</span>
          </div>
          <div>
            <IconButton
              aria-label="more"
              aria-controls="menu_note"
              aria-haspopup="true"
              onClick={handleShowAnchorEl}
            >
              {/* <MoreVertIcon /> */}
              <FontAwesomeIcon icon={faEllipsisV} />
            </IconButton>
          </div>
        </div>
        <div className="j_center flex_column">
          <p className="w-100 text-start">{item.content}</p>
          {media && videoExtensions.includes(media.type) ? (
            <video
              controls
              width={"100%"}
              className="rounded"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <source src={media.linkMedia} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={media.linkMedia}
              alt="Preview"
              width="80%"
              style={{ minHeight: "150px" }}
              className={clsx("rounded", styles.img, styles.imgItem)}
              onClick={(event) => {
                event.stopPropagation();
              }}
            />
          )}
        </div>
        <div className="py-2 d-flex">
          <div
            onClick={handleLike}
            style={{ cursor: "pointer" }}
            className={clsx(styles.like, "j_center ")}
          >
            {isLiked ? (
              <Favorite
                fontSize="small"
                style={{ color: "red", paddingRight: "5px" }}
              />
            ) : (
              <FavoriteBorder
                fontSize="small"
                style={{ paddingRight: "5px" }}
              />
            )}
            <span>{" " + likeCount}</span>
          </div>
          <div className={clsx(styles.like, "ms-5 ")}>
            <ChatBubbleOutline
              fontSize="small"
              style={{ paddingRight: "5px" }}
            />
            <span>{" " + item.comment}</span>
          </div>
        </div>
      </div>
      <Menu
        id="menu_note"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {user.userName === userName && <MenuItem onClick={removeNoteByID}>remove note</MenuItem>}
        <MenuItem>add favorite</MenuItem>
      </Menu>
    </div>
  );
});

export default NoteItem;
