import React, { useEffect, useRef, useState } from "react";
import { listMessageStore, messageStore, userStore } from "../zustand/store";
import clsx from "clsx";
import styles from "../styles/UserStyle.module.scss";
import TextField from "@mui/material/TextField";
import { dataMenu } from "../data/menuUser";
import { useMediaQuery } from "react-responsive";
import { Badge, Menu } from "@mui/material";
import { ReactComponent as IconHome } from "../assets/svg_menu/home_outline.svg";
import { ReactComponent as IconChat } from "../assets/svg_menu/message_outline.svg";
import { ReactComponent as IconFollow } from "../assets/svg_menu/user_outline.svg";
import { ReactComponent as IconNotification } from "../assets/svg_menu/notification_outline.svg";
import { ReactComponent as IconLogout } from "../assets/svg_menu/logout.svg";
import { ReactComponent as IconPlush } from "../assets/svg_menu/plush.svg";
import { ReactComponent as IconAvatar } from "../assets/svg_menu/user_.svg";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { socketMessage } from "../service/socketMessage";
import { chatAPI } from "../service/chatAPI";
import { authAPI } from "../service/auth";
import Swal from "sweetalert2";

const User = () => {
  const user = userStore((state) => state.user);
  const setUser = userStore((state) => state.setUser);
  const nav = useNavigate();
  const location = useLocation();

  const [showSidebar, setShowSidebar] = useState(true);
  const [avatar, setAvatar] = useState(true);
  const responsiveHeader = useMediaQuery({ minWidth: 380 });
  const [showMenu, setShowMenu] = useState(null);
  // const socketRef = useRef();
  const [isConnected, setIsConnected] = useState(socketMessage.connected);
  const [notifiCountMessage, setNotifiCountMessage] = useState(0);
  const [notifiCount, setNotifiCount] = useState(0);

  const chatList = listMessageStore(state => state.list);
  console.log("chat list: ", chatList);
  const chatListRef = useRef(chatList);
  const setChatList = listMessageStore(state => state.setList);
  const addMessage = messageStore(state => state.addMessage);
  useEffect(() => {
    if (Object.keys(user).length === 0) {
      return;
    }

    (async () => {
      const res = await chatAPI.getListChat();
      // console.log(res);
      if (res.status === 200) {
        setChatList(res.data)
      }

    })()
    socketMessage.on('connect', () => {
      // console.log("connect: ", socketMessage.id);

    });
    socketMessage.emit('registerUser', { id: socketMessage.id, uID: user.id });
    socketMessage.on('receiveMessage', (data) => {


      // const existingChat = chatListRef.current.find(item => item.id === data.status.id);

      // let newChatList;
      // if (existingChat) {
      //   newChatList = chatListRef.current.map(item =>
      //     item.id === data.status.id ? data.status : item
      //   );
      // } else {
      //   newChatList = [...chatListRef.current, data.status];
      // }

      // console.log("newChatList: ", newChatList);

      // Cập nhật danh sách chat mới
      setChatList(data.status);

      // Cập nhật danh sách tin nhắn
      // console.log("new mess: ", data.message);

      addMessage(data.message)

    })


    return () => {
      socketMessage.off('connect');
      socketMessage.off('receiveMessage');
      // socketRef.current.off('disconnect', onDisconnect);
      // socketRef.current.off('foo', onFooEvent);
    };
  }, [user]);

  useEffect(() => {
    chatListRef.current = chatList;
    if (chatList !== '') {


      const notifi = chatList.reduce((notifi, chat) => {
        if (chat.status === 0) {
          return notifi + 1;
        }
        return notifi;
      }, 0);


      setNotifiCountMessage(notifi);
    }
  }, [chatList]);


  const handleCloseMenu = () => {
    setShowMenu(null);
  };

  const handleLogOut = async () => {
    const res = await authAPI.logOut();
    setUser({});
    nav('/')
    localStorage.clear("accessToken");
    localStorage.clear("refreshToken");
    Swal.fire({
      // position: "top-end",
      icon: "success",
      title: "Logout Success",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  return (
    <div
      className={clsx("fullBox", styles.container)}
    // onClick={handleCloseMenu}
    >
      <div className={clsx(styles.headerContainer, "w-100 j_between")}>
        <div
          onClick={() => {
            setShowSidebar(!showSidebar);
          }}
          style={{
            position: "relative",
            zIndex: 10,
            width: "7vw",
            minWidth: "90px",
          }}
          className="j_center"
        >
          <svg
            role="img"
            width="25px"
            height="25px"
            viewBox="0 0 16 18"
            fill="#00b7ff"
            strokeWidth="1.8"
            stroke="none"
            xmlns="http://www.w3.org/2000/svg"
            className="_logo_ncmae_87"
          >
            <g>
              <path d="M16 4H0V6H16V4Z"></path>
              <path d="M0 8V18L7.9993 13.534L16 18V8H0Z"></path>
              <path d="M16 0H0V2H16V0Z"></path>
            </g>
          </svg>
        </div>
        <div
          style={{
            width: "20%",
            minWidth: responsiveHeader ? "300px" : "150px",
          }}
          className={clsx("j_around")}
        >
          {responsiveHeader ? (
            <>
              <TextField
                id="outlined-basic"
                label="Search"
                variant="outlined"
                className={clsx(styles.input)}
              />
              <button
                className={clsx(styles.containerIconUser, 'j_center')}
                onClick={(e) => {
                  setShowMenu(e.currentTarget);
                }}
                style={{ position: "relative" }}
              >
                {avatar ? (
                  <img
                    src={user.avatar}
                    onError={() => {
                      setAvatar(false);
                    }}
                    onLoad={() => {
                      setAvatar(true);
                    }}
                    alt="avatar"
                    width={'50px'}
                  />
                ) : (
                  <IconAvatar />
                )}

                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    backgroundColor: "black",
                    right: 0,
                    borderRadius: "50%",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20px"
                    height="20px"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ffffff"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0" />

                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />

                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        d="M5.70711 9.71069C5.31658 10.1012 5.31658 10.7344 5.70711 11.1249L10.5993 16.0123C11.3805 16.7927 12.6463 16.7924 13.4271 16.0117L18.3174 11.1213C18.708 10.7308 18.708 10.0976 18.3174 9.70708C17.9269 9.31655 17.2937 9.31655 16.9032 9.70708L12.7176 13.8927C12.3271 14.2833 11.6939 14.2832 11.3034 13.8927L7.12132 9.71069C6.7308 9.32016 6.09763 9.32016 5.70711 9.71069Z"
                        fill="#0F0F0F"
                      />{" "}
                    </g>
                  </svg>
                </div>
              </button>
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="35px"
                height="35px"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M11 6C13.7614 6 16 8.23858 16 11M16.6588 16.6549L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                  stroke="#000000"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <div
                onClick={(e) => {
                  setShowMenu(e.currentTarget);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40px"
                  height="40px"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M4 12H20M4 8H20M4 16H12"
                    stroke="#000000"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </>
          )}
        </div>

        <Menu
          id="user_menu"
          anchorEl={showMenu}
          keepMounted
          open={Boolean(showMenu)}
          onClose={handleCloseMenu}
        >
          <div className="p-3">
            <div
              className={clsx(
                "j_around p-3 rounded",
                styles.itemMenuUser,
                styles.hover
              )}
              style={{ cursor: "pointer" }}
              onClick={() => {
                nav(`@${user.userName}/profile`);
                handleCloseMenu();
              }}
            >
              {user.avatar == " " && (
                <img
                  src={user.avatar}
                  alt="avtar"
                  width={"50px"}
                  height={"50px"}
                  style={{
                    backgroundColor: "black",
                    borderRadius: "50%",
                  }}
                />
              )}
              <div className="j_center flex_column p-3">
                <p className="fs-6 fw-semibold p">{user.userName}</p>
                <p className="p">{user.email}</p>
              </div>
            </div>
            <div
              className={clsx(
                styles.itemMenuUser,
                "p-3 rounded j_center flex_column",
                styles.hoverChild
              )}
            >
              <div
                className={clsx("w-100 m-2 p-2 rounded")}
                onClick={() => {
                  nav("home");
                  handleCloseMenu();
                }}
              >
                <IconHome />
                <span className="ms-3">Home</span>
              </div>
              <div
                className={clsx("w-100 m-2 p-2 rounded")}
                onClick={() => {
                  nav("chat");
                  handleCloseMenu();
                }}
              >
                <IconChat />
                <span className="ms-3">Chat</span>
              </div>
              <div
                className={clsx("w-100 m-2 p-2 rounded")}
                onClick={() => {
                  nav("follow");
                  handleCloseMenu();
                }}
              >
                <IconFollow />
                <span className="ms-3">Follow</span>
              </div>
              <div
                className={clsx("w-100 m-2 p-2 rounded")}
                onClick={() => {
                  nav("notification");
                  handleCloseMenu();
                }}
              >
                <IconNotification />
                <span className="ms-3">Notification</span>
              </div>
            </div>
            <div className={clsx("w-100 m-2 p-2 rounded", styles.hover)}
              onClick={handleLogOut}
            >
              <IconLogout />
              <span className="ms-3">Logout</span>
            </div>
            <div className={clsx("w-100 m-2 p-2 rounded", styles.hover)}
              onClick={() => { nav('/') }}
            >
              {/* <IconLogout /> */}
              <span className="ms-3">Goback Home Blog</span>
            </div>
          </div>
        </Menu>
      </div>

      {/* Sidebar */}
      <div
        className={clsx(styles.sidebar, "j_around flex_column pt-3 pb-3", {
          [styles.showSidebar]: showSidebar,
          [styles.hiddenSidebar]: !showSidebar,
        })}
      >

        <div
          style={{ height: "60vh", overflow: "visible", width: "100%" }}
          className={clsx("j_around flex_column")}
        >
          {dataMenu.map((item, i) => {
            const navName = location.pathname.split('/').pop();
            return item.nav === 'chat' || item.nav === 'notification' ? (
              <Badge badgeContent={item.nav === 'chat' ? notifiCountMessage : notifiCount} color="primary" key={i}
              >

                <div
                  className={clsx(styles.itemMenu, "j_center no_click")}
                  style={{ margin: "0" }}
                  onClick={() => {
                    nav(item.nav);
                  }}
                  data-content={item.title}
                  dangerouslySetInnerHTML={{ __html: navName === item.nav ? item.iconFill : item.icon }}
                ></div>
              </Badge>
            ) : (
              <div
                key={i}
                className={clsx(styles.itemMenu, "j_center no_click")}
                onClick={() => {
                  nav(item.nav);


                }}
                dangerouslySetInnerHTML={{
                  __html:
                    navName === item.nav ? item.iconFill : item.icon,
                }}
                data-content={item.title}
              // right={responsiveHeader&&}
              ></div>
            )
          }
          )}
        </div>
        <div className={clsx("j_around flex_column")}>
          <div
            className={clsx(styles.plush, "j_center rounded")}
            onClick={() => {
              nav("addPost");
            }}
          >
            <IconPlush />
          </div>
          <div
            className={clsx(styles.avatar, "j_center mt-2")}
            onClick={() => {
              nav(`@${user.userName}/profile`);
            }}

          >
            {avatar ? (
              <>
                <img
                  onError={() => {
                    setAvatar(false);
                  }}
                  onLoad={() => setAvatar(true)}
                  src={user.avatar}
                  alt="avtar"
                  width={'50px'}
                />
              </>
            ) : (
              <>
                <IconAvatar />
              </>
            )}
          </div>
        </div>
      </div>

      <div
        className={clsx(styles.contentContainer)}
        style={{
          width: showSidebar ? "93vw" : "100vw",
          marginLeft: showSidebar ? "7vw" : "0",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default User;
