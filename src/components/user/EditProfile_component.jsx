import React, { useState } from "react";
import styles from "./EditProfileStyle.module.scss";
import clsx from "clsx";
import { Button, TextField, styled } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authAPI } from "../../service/auth";
import { userStore } from "../../zustand/store";
import { Clear, Delete } from "@mui/icons-material";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const EditProfile_component = () => {
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    bio: "",
    phoneNumber: "",
  });

  const update = userStore((state) => state.update);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log(file);

    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleValidation = () => {
    const { fullName, userName, phoneNumber } = formData;

    // Full Name validation
    if (!fullName) {
      toast.error("Họ tên không được để trống.");
      return false;
    }
    if (!userName) {
      toast.error("Tên người dùng không được để trống.");
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(userName)) {
      toast.error(
        "Tên người dùng không được chứa khoảng trắng hoặc ký tự đặc biệt ngoài dấu gạch dưới (_)."
      );
      return false;
    }
    if (!phoneNumber) {
      toast.error("Số điện thoại không được để trống.");
      return false;
    }
    if (!/^\d{10,15}$/.test(phoneNumber)) {
      toast.error("Số điện thoại phải là số và phải từ 10 đến 15 chữ số.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!handleValidation()) return;

    const data = new FormData();
    if (avatar !== null) {
      data.append("avatars", avatar);
    }
    data.append("fullName", formData.fullName);
    data.append("userName", formData.userName);
    data.append("bio", formData.bio);
    data.append("phoneNumber", formData.phoneNumber);

    const res = await authAPI.update(data);
    if (res.status === 200) {
      setFormData({
        fullName: "",
        userName: "",
        bio: "",
        phoneNumber: "",
      })
      toast.success(res.message);
      update(res.data);
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className={clsx(styles.container)}>
      <div className={clsx("j_between ")}>
        <p className={clsx("fs-2 fw-bold p")}>Edit Profile</p>
        <Button variant="contained" onClick={handleSubmit}>
          Done
        </Button>
      </div>

      <div className={clsx(styles.formContainer, "")}>
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          className="mb-4"
        >
          Upload avatar
          <VisuallyHiddenInput
            type="file"
            onChange={handleFileChange}
            accept="image/*"
          />
        </Button>
        {preview && (
          <div className={clsx(styles.containerImage, "j_center mb-2")}>
            <img
              src={preview}
              alt="Avatar Preview"
              width={"150px"}
              className=""
            />

            <div
              className={clsx(styles.iconDelete)}
              onClick={() => {
                setAvatar(null);
                setPreview(null)
              }}
            >
              <Clear fontSize="small" className={clsx(styles.iconDelete)} />
            </div>
          </div>
        )}

        {/* <h6>Full name:</h6> */}
        <TextField
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          fullWidth
          className="mb-4"
        />

        {/* <h6>User name:</h6> */}
        <TextField
          label="User Name"
          name="userName"
          value={formData.userName}
          onChange={handleInputChange}
          fullWidth
          className="mb-4"
        />

        {/* <h6>Bio</h6> */}
        <TextField
          label="Bio"
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          multiline
          rows={4}
          fullWidth
          className="mb-4"
        />

        {/* <h6>Phone number:</h6> */}
        <TextField
          label="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          fullWidth
          className="mb-4"
        />

        {/* Toast Notification */}
        <ToastContainer position="top-right" autoClose={5000} />
      </div>
    </div>
  );
};

export default EditProfile_component;
