import React, { useEffect, useState } from "react";
// import "../../styles/Header_home.style.css";
import styles from "./Header.module.scss";
import clxs from "clsx";
import logo from "../../../assets/image/logo.png";
import { Button, Nav, NavDropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarsStaggered,
  faEllipsisV,
  faSearch,
  faUser,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import { userStore } from "../../../zustand/store";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { authAPI } from "../../../service/auth";
import Swal from "sweetalert2";
const Header_components = () => {
  const nav = useNavigate();
  const [showHeader, setShowHeader] = useState(true); // Trạng thái để kiểm soát hiển thị header
  const [lastScrollY, setLastScrollY] = useState(0); // Trạng thái để lưu vị trí cuộn trước đó
  // console.log(typeof logo);

  const user = userStore((state) => state.user);
  const setUser = userStore((state) => state.setUser);

  const controlHeader = () => {
    // Lấy vị trí hiện tại của trục Y
    if (window.scrollY === 0) {
      setShowHeader(true);
      return;
    }
    if (window.scrollY > lastScrollY) {
      // Nếu cuộn xuống
      setShowHeader(false); // Ẩn header
    } else {
      // Nếu cuộn lên
      setShowHeader(true); // Hiện header
    }
    // Cập nhật vị trí cuộn
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", controlHeader); // Lắng nghe sự kiện cuộn trang
    return () => {
      window.removeEventListener("scroll", controlHeader); // Gỡ bỏ sự kiện khi component bị hủy
    };
  }, [lastScrollY]);
  useEffect(() => {
    setShowNav(false);
  }, [showHeader]);

  // responsive
  const showRight = useMediaQuery({ minWidth: 1024 });
  const [showMenuRight, setShowMenuRight] = useState(false);
  const handleShowMenuRight = () => {
    setShowMenuRight(!showMenuRight);
  };
  const responsiveNav = useMediaQuery({ minWidth: 568 });

  const [showNav, setShowNav] = useState(false);

  const handleLogin = () => {
    nav("/login");
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleShowAnchorEl = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = async () => {
    const res = await authAPI.logOut();
    setUser({});
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

  const [errorAvatar, setErrorAvatar] = useState(false);

  // console.log(user);
  // console.log(localStorage.getItem("accessToken"));
  // console.log(localStorage.getItem("refreshToken"));
  return (
    <>
      <div
        className={clxs(
          styles.header_container,
          "container w-100 shadow-sm mb-5 rounded mt-3 p-2",
          {
            [styles.header_visible]: showHeader,
            [styles.header_hidden]: !showHeader,
          }
        )}
      >
        <img src={logo} alt="ok" className={clxs(styles.logo)} />
        {responsiveNav && (
          <>
            <Nav className={clxs(styles.containerCenter)}>
              <Nav.Item>
                <Nav.Link className={clxs(styles.textLink, "text-black")}>
                  Trang chủ
                </Nav.Link>
              </Nav.Item>
              <NavDropdown
                title={<span className="text-black">Thể loại</span>}
                id="nav-dropdown"
                className={clxs(styles.textLink, "text-black", styles.dropdown)}
              >
                <NavDropdown.Item eventKey="4.1">Action</NavDropdown.Item>
                <NavDropdown.Item eventKey="4.2">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item eventKey="4.3">
                  Something else here
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item eventKey="4.4">
                  Separated link
                </NavDropdown.Item>
              </NavDropdown>

              <Nav.Item>
                <Nav.Link className={clxs(styles.textLink, "text-black")}>
                  Giới Thiệu
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link className={clxs(styles.textLink, "text-black")}>
                  Liên Hệ
                </Nav.Link>
              </Nav.Item>
            </Nav>

            {showRight ? (
              <div className={clxs(styles.containerRight)}>
                <button className="btn">
                  <FontAwesomeIcon icon={faSearch} size="lg" />
                </button>
                {Object.keys(user).length == 0 ? (
                  <Button style={{ margin: "0 10px" }} onClick={handleLogin}>
                    Login
                  </Button>
                ) : (
                  <button
                    className={clxs(styles.containerIconUser, "j_center")}
                    onClick={() => {
                      nav(`/userpanel`);
                    }}
                  >
                    {!errorAvatar ? (
                      <img
                        className={clxs(styles.avatar)}
                        src={user.avatar}
                        onError={() => {
                          setErrorAvatar(true);
                          console.log("error");
                        }}
                        onLoad={() => {
                          setErrorAvatar(false);
                          console.log("success");
                        }}
                        alt="avatar"
                      />
                    ) : (
                      <FontAwesomeIcon icon={faUser} size="lg" />
                    )}
                  </button>
                )}
              </div>
            ) : (
              <div onClick={handleShowMenuRight} className="j_center">
                <IconButton
                  aria-label="more"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={handleShowAnchorEl}
                >
                  {/* <MoreVertIcon /> */}
                  <FontAwesomeIcon icon={faEllipsisV} />
                </IconButton>
                <Menu
                  id="long-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>Search</MenuItem>
                  {Object.keys(user).length != 0 ? (
                    <>
                      <MenuItem
                        onClick={() => {
                          nav(`/userpanel`);
                        }}
                      >
                        Profile
                      </MenuItem>
                      <MenuItem onClick={handleLogOut}>Logout</MenuItem>
                    </>
                  ) : (
                    <MenuItem onClick={handleLogin}>Login</MenuItem>
                  )}
                </Menu>
              </div>
            )}
          </>
        )}
        {!responsiveNav && (
          <div
            className={clxs("no_click j_center", styles.button)}
            onClick={() => {
              setShowNav(!showNav);
            }}
          >
            <FontAwesomeIcon icon={showNav ? faXmark : faBarsStaggered} />
          </div>
        )}
      </div>
      {
        <>
          <Nav
            className={clxs(
              "shadow-sm mb-5 rounde p-5 w-50",
              styles.navRowContainer,
              {
                [styles.headerVisibleNavRow]: showNav,
                [styles.headerHiddenNavRow]: !showNav,
              }
            )}
          >
            <Nav.Item>
              <Nav.Link className={clxs(styles.textLink, "text-black")}>
                Trang chủ
              </Nav.Link>
            </Nav.Item>
            <NavDropdown
              title={<span className="text-black">Thể loại</span>}
              id="nav-dropdown"
              className={clxs(styles.textLink, "text-black", styles.dropdown)}
            >
              <NavDropdown.Item eventKey="4.1">Action</NavDropdown.Item>
              <NavDropdown.Item eventKey="4.2">Another action</NavDropdown.Item>
              <NavDropdown.Item eventKey="4.3">
                Something else here
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item eventKey="4.4">Separated link</NavDropdown.Item>
            </NavDropdown>

            <Nav.Item className="">
              <Nav.Link className={clxs(styles.textLink, "text-black")}>
                Giới Thiệu
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link className={clxs(styles.textLink, "text-black")}>
                Liên Hệ
              </Nav.Link>
            </Nav.Item>
            <div className={clxs(styles.containerRight, styles.flexColumn)}>
              <button className="btn">
                <FontAwesomeIcon icon={faSearch} size="lg" />
              </button>
              <Button style={{ margin: "0 10px" }} onClick={handleLogin}>
                Login
              </Button>
            </div>
          </Nav>
        </>
      }
    </>
  );
};

export default Header_components;
