import React from "react";
import styles from "../styles/LoginStyle.module.scss";
import clsx from "clsx";
import { useMediaQuery } from "react-responsive";
const LoginPage = () => {
  const [signIn, setSignIn] = React.useState(true);
  const responsive = useMediaQuery({ minWidth: 650 });
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
                />
                <input
                  type="email"
                  placeholder="Email"
                  className={styles.input}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className={styles.input}
                />
                <button className={styles.button}>Sign Up</button>
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
                />
                <input
                  type="password"
                  placeholder="Password"
                  className={styles.input}
                />
                <a href="javascript:void(0);" className={styles.anchor}>
                  Forgot your password?
                </a>
                <button className={clsx(styles.button, "btn bg-primary")}>
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
              } w-100 ${signIn ? styles.translateX0 : ""}`}
            >
              <form className={styles.form}>
                <h1 className={styles.title}>Create Account</h1>
                <input
                  type="text"
                  placeholder="Name"
                  className={styles.input}
                />
                <input
                  type="email"
                  placeholder="Email"
                  className={styles.input}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className={styles.input}
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
                <button className={styles.button}>Sign Up</button>
              </form>
            </div>
            <div
              className={`${styles.signInContainer} ${
                signIn ? "" : styles.signInContainerActive
              } w-100 ${signIn ? styles.translateX100 : ""}`}
            >
              <form className={styles.form}>
                <h1 className={styles.title}>Sign in</h1>
                <input
                  type="email"
                  placeholder="Email"
                  className={styles.input}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className={styles.input}
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
                  <a href="javascript:void(0);" className={clsx(styles.anchor, "")}>
                    Forgot your password?
                  </a>
                </div>
                <button className={clsx(styles.button, "btn bg-primary mt-3")}>
                  Sign In
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Sign In Container */}

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
    </div>
  );
};

export default LoginPage;
