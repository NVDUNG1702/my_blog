import React, { useEffect, useState } from "react";
import styles from "../styles/LoginStyle.module.scss";
import clsx from "clsx";
import { useMediaQuery } from "react-responsive";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { auth } from "../firebase.config";
import {
  createUserWithEmailAndPassword,
  signInWithCustomToken,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Swal from "sweetalert2";
import { userStore } from "../zustand/userStore";
import { useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";
import { authAPI } from "../service/auth";

const LoginPage = () => {
  const nav = useNavigate();

  const [signIn, setSignIn] = useState(true);
  const responsive = useMediaQuery({ minWidth: 650 });

  const setUser = userStore((state) => state.setUser);
  const user = userStore((state) => state.user);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [otp, setOtp] = useState("");

  const resertData = () => {
    setName("");
    setEmail("");
    setPass("");
  };

  useEffect(() => {
    resertData();
  }, [signIn]);

  useEffect(() => {
    if (Object.keys(user).length !== 0) {
      nav("/");
    }
  }, [user]);

  const validation = () => {
    let isValid = true;

    if (!signIn) {
      if (name.trim() === "") {
        toast.error("Tên không được để trống!");
        isValid = false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.trim() === "" || !emailRegex.test(email)) {
      toast.error("Email không hợp lệ!");
      isValid = false;
    }

    if (pass.trim().length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự!");
      isValid = false;
    }

    return isValid;
  };

  const handleSignUp = async (e) => {
    if (validation()) {
      if (validation) {
        const res = await authAPI.register(email, pass, name, otp);
        if (res.status == 201) {
          Swal.fire({
            icon: "success",
            title: "SignUp success",
            showConfirmButton: false,
            timer: 1500,
          });
          setShowFromOTP(false);
          setOtp("");
          resertData();
        } else {
          Swal.fire({
            icon: "error",
            title: "SignUp error",
            showConfirmButton: false,
            timer: 1500,
          });
          setOtp("");
        }
      }
    }
  };

  const handleSignIn = async () => {
    if (validation) {
      const res = await authAPI.login(email, pass);
      console.log(res);

      if (res.status == 200) {
        const { user } = res;
        const refreshToken = res.REFRESH_TOKEN;
        const accessToken = res.ACCESS_TOKEN;
        // console.log("user: ", user);
        // console.log(refreshToken);
        // console.log(accessToken);

        localStorage.setItem("refreshToken", refreshToken.token);
        localStorage.setItem("accessToken", accessToken.token);
        setUser(user);
        Swal.fire({
          // position: "top-end",
          icon: "success",
          title: "SignIn success",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: res.error,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
    // console.log(user);
    // console.log(localStorage.getItem("accessToken"));
    // console.log(localStorage.getItem("refreshToken"));
  };

  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePassChange = (e) => setPass(e.target.value);

  const [timeOut, setTimeOut] = useState(0);
  const [showFormOTP, setShowFromOTP] = useState(false);
  useEffect(() => {
    if (timeOut === 0) return;

    const intervalId = setInterval(() => {
      setTimeOut((prevTime) => prevTime - 1);
    }, 1000);

    // Cleanup interval khi component unmount hoặc khi thời gian hết
    return () => clearInterval(intervalId);
  }, [timeOut]);

  // Chuyển đổi thời gian thành định dạng "mm:ss"
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const senOTP = async () => {
    if (validation()) {
      const res = await authAPI.sendOTP(email);
      setOtp("");
      if (res == 200) {
        setShowFromOTP(true);
        toast.success("Vui lòng kiểm tra email của bạn!");
      } else {
        toast.error(res.error);
      }
    }
  };

  return (
    <div className="j_center fullBox">
      <div className={styles.container}>
        {/* Sign Up Container */}
        {responsive ? (
          <>
            <div
              className={`${styles.signUpContainer} ${
                signIn ? styles.signUpContainerActive : ""
              } `}
            >
              <form className={styles.form}>
                <h1 className={styles.title}>Create Account</h1>
                <input
                  type="text"
                  placeholder="Name"
                  className={styles.input}
                  value={name}
                  onChange={handleNameChange}
                />
                <input
                  type="email"
                  placeholder="Email"
                  className={styles.input}
                  value={email}
                  onChange={handleEmailChange}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className={styles.input}
                  value={pass}
                  onChange={handlePassChange}
                />
                <button
                  type="button"
                  className={styles.button}
                  onClick={senOTP}
                >
                  Sign Up
                </button>
              </form>
            </div>

            {/*  */}
            <div
              className={`${styles.signInContainer} ${
                signIn ? "" : styles.signInContainerActive
              }`}
            >
              <form className={styles.form}>
                <h1 className={styles.title}>Sign in</h1>
                <input
                  type="email"
                  placeholder="Email"
                  className={styles.input}
                  value={email}
                  onChange={handleEmailChange}
                />
                {/* <div className={styles.input}> */}
                <input
                  type="password"
                  placeholder="Password"
                  className={clsx(styles.input)}
                  value={pass}
                  onChange={handlePassChange}
                />
                {/* </div> */}
                <a href="#" className={styles.anchor}>
                  Forgot your password?
                </a>
                <button
                  type="button"
                  className={clsx(styles.button, "btn bg-primary")}
                  onClick={handleSignIn}
                >
                  Sign In
                </button>
              </form>
            </div>
          </>
        ) : (
          <div>
            <div
              className={`${styles.signUpContainer} ${
                signIn ? styles.signUpContainerActive : ""
              } w-100 ${!signIn ? styles.translateX0 : ""}`}
            >
              <form className={styles.form}>
                <h1 className={styles.title}>Create Account</h1>
                <input
                  type="text"
                  placeholder="Name"
                  className={styles.input}
                  value={name}
                  onChange={handleNameChange}
                />
                <input
                  type="email"
                  placeholder="Email"
                  className={styles.input}
                  value={email}
                  onChange={handleEmailChange}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className={styles.input}
                  value={pass}
                  onChange={handlePassChange}
                />
                <span className="mb-3">
                  You have an account,{" "}
                  <span
                    onClick={() => {
                      setSignIn(!signIn);
                    }}
                    className="text-decoration-underline"
                  >
                    login now
                  </span>
                </span>
                <button
                  className={styles.button}
                  type="button"
                  onClick={senOTP}
                >
                  Sign Up
                </button>
              </form>
            </div>
            <div
              className={`${styles.signInContainer} ${
                signIn ? "" : styles.signInContainerActive
              } w-100 ${!signIn ? styles.translateX100 : ""}`}
            >
              <form className={styles.form}>
                <h1 className={styles.title}>Sign in</h1>
                <input
                  type="email"
                  placeholder="Email"
                  className={styles.input}
                  value={email}
                  onChange={handleEmailChange}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className={styles.input}
                  value={pass}
                  onChange={handlePassChange}
                />
                <div className="j_around w-100 mb-5">
                  <span className="">
                    you don't have acount,{" "}
                    <span
                      onClick={() => {
                        setSignIn(!signIn);
                      }}
                      className="text-decoration-underline"
                    >
                      sign up now
                    </span>
                  </span>
                  <a href="#" className={clsx(styles.anchor, "")}>
                    Forgot your password?
                  </a>
                </div>
                <button
                  type="button"
                  className={clsx(styles.button, "btn bg-primary mt-3")}
                  onClick={handleSignIn}
                >
                  Sign In
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Overlay Container */}
        {responsive && (
          <div
            className={`${styles.overlayContainer} ${
              signIn ? "" : styles.overlayContainerActive
            }`}
          >
            <div
              className={`${styles.overlay} ${
                signIn ? "" : styles.overlayActive
              }`}
            >
              {/* Left Overlay Panel */}
              <div
                className={`${styles.leftOverlayPanel} ${
                  signIn ? "" : styles.leftOverlayPanelActive
                }`}
              >
                <h1 className={styles.title}>Welcome Back!</h1>
                <p className={styles.paragraph}>
                  To keep connected with us please login with your personal info
                </p>
                <button
                  className={clsx(styles.ghostButton, "btn btn-outline-light")}
                  onClick={() => setSignIn(true)}
                >
                  Sign In
                </button>
              </div>

              {/* Right Overlay Panel */}
              <div
                className={`${styles.rightOverlayPanel} ${
                  signIn ? "" : styles.rightOverlayPanelActive
                }`}
              >
                <h1 className={styles.title}>Hello, Friend!</h1>
                <p className={styles.paragraph}>
                  Enter your personal details and start your journey with us
                </p>
                <button
                  className={clsx(styles.ghostButton, "btn btn-outline-light")}
                  onClick={() => setSignIn(false)}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer style={{ width: "200px", height: "100px" }} />
      {showFormOTP && (
        <div className={clsx(styles.optContainer, "j_center")}>
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderSeparator={<span>-</span>}
            renderInput={(props) => (
              <input {...props} className={clsx(styles.otpInput)} />
            )}
          />
          <div className="mt-4 fw-semibold">
            {timeOut != 0 ? (
              <p>Thời gian hết hạn otp: {formatTime(timeOut)}</p>
            ) : (
              <p
                className="text-decoration-underline no_click"
                onClick={senOTP}
              >
                Gửi lại otp
              </p>
            )}
          </div>
          <Button className="mt-5" onClick={handleSignUp}>
            Save
          </Button>
          <button
            className=" btn no_click "
            style={{ position: "absolute", top: "20px", left: "20px" }}
            onClick={() => {
              setShowFromOTP(false);
            }}
            type="button"
          >
            <FontAwesomeIcon icon={faX} size="lg" />
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
