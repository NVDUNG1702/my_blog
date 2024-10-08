import React, { useState } from "react";
import styles from "./HomeStyle.module.scss";
import clsx from "clsx";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { noteAPI } from "../../service/noteAPI";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const videoExtensions = ["mp4", "webm", "avi", "mov", "mkv"];
const Home_component = () => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleMediaUpload = (event) => {
    setMedia(" ");
    const file = event.target.files[0];
    console.log(event.target.files);

    if (file) {
      // Lấy tên file và tách phần mở rộng sau dấu chấm
      const fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);

      // Lưu URL và phần mở rộng file vào state
      console.log(fileExtension);

      setMedia({
        url: URL.createObjectURL(file), // Tạo URL của file
        type: fileExtension, // Lưu đuôi file (ví dụ: 'png', 'mp4')
        file: file,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Xử lý đăng bài, bạn có thể gửi dữ liệu đến server tại đây
    const data = new FormData();

    if (media !== null) {
      const file = media.file;
      data.append("media", file);
    }

    data.append("content", content);
    data.append("type", media.type);

    const res = await noteAPI.addNote(data);
    if (res.status === 201) {
      toast.success(res.message);
      setMedia(null);
      setContent("");
    } else {
      toast.error(res.error);
    }
    handleClose(); // Đóng modal sau khi gửi
  };
  return (
    <div className={clsx(styles.container)}>
      <div
        className={clsx(styles.buttonShow, "j_between px-3 p-3 rounded")}
        onClick={handleOpen}
      >
        <p className={clsx("p text-black-50")}>What'on your mind?</p>
        <p className={clsx("p px-4 py-2 bg-primary text-white rounded")}>
          Post
        </p>
      </div>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            // width: 400,
            bgcolor: "background.paper",
            borderRadius: "8px",
            boxShadow: 24,
            p: 4,
            display: "flex",
            alignItems: "center",
          }}
        >
          <form onSubmit={handleSubmit}>
            <Typography variant="h6" component="h2" gutterBottom>
              New Note
            </Typography>
            {/* <TextField
              label="Tiêu đề"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              margin="normal"
            /> */}
            <TextField
              label="Nội dung"
              fullWidth
              multiline
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              margin="normal"
            />
            <Typography variant="body1" gutterBottom>
              Tải lên hình ảnh hoặc video:
            </Typography>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleMediaUpload}
              style={{ marginBottom: "16px" }}
            />

            <div>
              <Button variant="contained" color="primary" type="submit">
                Đăng
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleClose}
                style={{ marginLeft: "8px" }}
              >
                Đóng
              </Button>
            </div>
          </form>
          {media && (
            <div
              style={{ marginBottom: "16px" }}
              className={clsx("ps-3 rounded j_center")}
            >
              {videoExtensions.includes(media.type) ? (
                <video controls height={"200px"} className="rounded">
                  <source src={media.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={media.url}
                  alt="Preview"
                  height="200px"
                  className="rounded"
                />
              )}
            </div>
          )}
        </Box>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default Home_component;
