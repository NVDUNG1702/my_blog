import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { noteAPI } from "../../../service/noteAPI";
import styles from "./NoteStyle.module.scss";
import clsx from "clsx";
import { timeAgo } from "../../../utils/format_time";
import {
  ChatBubbleOutline,
  Favorite,
  FavoriteBorder,
  HeartBrokenOutlined,
} from "@mui/icons-material";
import NoteItem from "./NoteItem_component";

const videoExtensions = ["mp4", "webm", "avi", "mov", "mkv"];
const Note_component = () => {
  const { userName } = useParams();
  const [resNote, setResNote] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await noteAPI.getNoteByUName(userName.substring(1));
        if (data.status === 200) {
          setResNote(data);
          console.log(data);
          
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const deleteNote = (noteId) => {
    setResNote((prevState) => ({
      ...prevState,
      data: prevState.data.filter((note) => note.id !== noteId),
    }));
  };
  return (
    <div className={clsx(styles.container, "")}>
      {resNote !== null && resNote.length !== 0 ? (
        <>
          {resNote.data.map((item) => (
            <NoteItem
              item={item}
              userAvatar={resNote.avatar}
              userFullName={resNote.fullName}
              userName={resNote.userName}
              deleteItem={deleteNote}
            />
          ))}
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Note_component;

// {
//     const media = JSON.parse(item.media);
//     return (
//       <div
//         key={item.id}
//         className={clsx("d-flex py-3", styles.containerItem)}
//       >
//         <div
//           style={{
//             width: "36px",
//             height: "36px",
//             overflow: "hidden",
//             position: "relative",
//           }}
//           className={clsx("rounded-circle")}
//         >
//           {resNote.avatar !== " " && (
//             <img
//               src={resNote.avatar}
//               alt="avt"
//               width={"36px"}
//               style={{ position: "absolute", top: -10 }}
//             />
//           )}
//         </div>
//         <div className={clsx("ps-2", styles.containerContentRight)}>
//           <div>
//             <span className="fw-medium">{resNote.fullName}</span>
//             <span className="text-black-50">{`${" "}  ${timeAgo(
//               item.createdAt
//             )}`}</span>
//           </div>
//           <div className="j_center flex_column">
//             <p className="w-100 text-start">{item.content}</p>
//             {media && videoExtensions.includes(media.type) ? (
//               <video controls width={"100%"} className="rounded">
//                 <source src={media.linkMedia} type="video/mp4" />
//                 Your browser does not support the video tag.
//               </video>
//             ) : (
//               <img
//                 src={media.linkMedia}
//                 alt="Preview"
//                 width="80%"
//                 style={{ minHeight: "150px" }}
//                 className={clsx("rounded", styles.img)}
//               />
//             )}
//           </div>
//           <div className="py-2 d-flex">
//             <div>
//               <FavoriteBorder fontSize="small" />
//               <span>{" " + item.like}</span>
//             </div>
//             <div className="ps-5">
//               <ChatBubbleOutline fontSize="small" />
//               <span>{" " + item.comment}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
