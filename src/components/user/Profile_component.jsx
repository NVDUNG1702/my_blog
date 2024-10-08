import React, { useEffect, useState } from "react";
import styles from "./ProfileStyle.module.scss";
import clsx from "clsx";
import { userStore } from "../../zustand/store";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { ReactComponent as IconAvatar } from "../../assets/svg_menu/user_.svg";
import { Button, createTheme } from "@mui/material";
import { ReactComponent as IconMenuDost } from "../../assets/svg_menu/menu-dots.svg";
import { ReactComponent as IconHeart } from "../../assets/svg_menu/heart.svg";
import { ReactComponent as IconEye } from "../../assets/svg_menu/eye.svg";
import { menuProfile } from "../../data/menuProfile";
import { useMediaQuery } from "react-responsive";
import { authAPI } from "../../service/auth";
let theme = createTheme({
  // Theme customization goes here as usual, including tonalOffset and/or
  // contrastThreshold as the augmentColor() function relies on these
});
theme = createTheme(theme, {
  // Custom colors created with augmentColor go here
  palette: {
    salmon: theme.palette.augmentColor({
      color: {
        main: "#FF5733",
      },
      name: "salmon",
    }),
  },
});

const Profile_component = () => {
  const user = userStore((state) => state.user);
  const { userName } = useParams();
  const [avatar, setAvatar] = useState(true);
  const [focusedMenu, setFocusedMenu] = useState(0);
  const nav = useNavigate();
  const location = useLocation();
  const [userFind, setUserFind] = useState(null);
  const responsive = useMediaQuery({ minWidth: 370 });
  const [follow, setFollow] = useState(false);
  useEffect(() => {
    (async () => {
      const res = await authAPI.getProfile(userName.substring(1));
      // console.log(res.data, user);
      // console.log(userName.substring(1), user.userName);

      if (userName.substring(1) !== user.userName && res.status === 200) {
        const resCheckFollow = await authAPI.checkFollow(res.data.id);

        if (resCheckFollow.status === 200) {
          setFollow(resCheckFollow.isFollowing);
          // console.log(resCheckFollow);

        }
      }
      if (res.status === 200) {
        setUserFind(res.data)
      }
    })()
  }, [userName]);


  const handleFollow = async () => {
    const res = await authAPI.follow(userFind.id);
    if (res.status === 201) {
      setFollow(true);
    } else if (res.status === 200) {
      setFollow(false);
    }
  }
  return (
    <div
      style={{ width: "100%", height: "100%", overflow: "scroll" }}
      className="j_center"
    >
      {
        userFind && (
          <div className={clsx(styles.container)}>
            <div
              className={clsx("j_between pt-5", {
                [styles.flex_column]: !responsive,
              })}
            >
              <div>
                <p className={clsx("p fs-5 fw-bold")}>{userFind.fullName ? userFind.fullName : userFind.userName}</p>
                <p
                  className={clsx("p fs-6 fw-medium text-decoration-underline")}
                  style={{ cursor: "pointer" }}
                >
                  {userName}
                </p>
              </div>
              <div className={clsx("j_center", styles.avatar)}>
                {avatar ? (
                  <img
                    onError={() => setAvatar(false)}
                    onLoad={() => setAvatar(true)}
                    src={userFind.avatar}
                    alt=""
                    width={"100%"}
                  />
                ) : (
                  <IconAvatar />
                )}
              </div>
            </div>
            <div
              className={clsx("pb-3", {
                ["d-flex j_around py-2"]: !responsive,
              })}
            >
              <p className="fw-medium">
                <IconEye width={"20px"} height={"20px"} /> 333
              </p>
              <p className="fw-medium">
                <IconHeart width={"20px"} height={"20px"} /> {" 1k"}
              </p>
            </div>
            <div className={clsx("w-100 j_between")}>
              <Button
                variant="contained"
                // color="#FF5733"
                sx={{
                  backgroundColor: "#00b7ff",
                  "&:hover": { backgroundColor: "#009ad7" },
                  width: "40%",
                  fontWeight: "bold",
                }}
                onClick={() => {
                  if (user.id === userFind.id) {
                    nav("/userpanel/addPost");
                  } else {
                    handleFollow()
                  }
                }}
              >
                {user.id === userFind.id ? 'New post' : `${follow ? 'Un Follow' : 'follow'}`}
              </Button>
              <Button
                variant="contained"
                // color="#FF5733"
                sx={{
                  backgroundColor: "#ababab",
                  "&:hover": { backgroundColor: "#bbbbbb" },
                  width: "40%",
                  fontWeight: "bold",
                }}
                onClick={() => {
                  if (user.id === userFind.id) {
                    nav("/userpanel/editProfile");
                  } else{
                    nav(`/userpanel/chat/@${userFind.userName}`)
                  }
                }}
              >
                {user.id === userFind.id ? 'Edit profile' : 'Message'}
              </Button>
              <Button
                variant="contained"
                // color="#FF5733"
                sx={{
                  backgroundColor: "#ababab",
                  "&:hover": { backgroundColor: "#bbbbbb" },
                }}
              >
                <IconMenuDost width={"25px"} height={"25px"} fill="white" />
              </Button>
            </div>

            <div className="w-100 j_center pt-3">
              {menuProfile.map((item) => {
                return (
                  <div
                    className={clsx("text-center", styles.itemMenuProfile, {
                      [styles.itemMenuFocused]:
                        location.pathname.split("/").pop() === item.nav,
                    })}
                    key={item.id}
                    onClick={() => {
                      setFocusedMenu(item.id);
                      nav(item.nav);
                    }}
                  >
                    <p>{item.title}</p>
                  </div>
                );
              })}
            </div>
            <div style={{ width: "100%" }}>
              <Outlet />
            </div>
          </div>
        )
      }
    </div>
  );
};

export default Profile_component;
