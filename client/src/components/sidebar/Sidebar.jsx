import "./sidebar.scss";
import { Link } from "react-router-dom";
import profileimage from "../../assets/user (8).png";
import { useContext, useState, useEffect } from "react";
import Signup from "../../pages/signup/Signup";
import { SidebarContext } from "../../context/Sidebarcontext";
import axios from "axios";
import config from "../../BaseURL";
import pp from "../../assets/chat-bot.png";

const Sidebar = ({ setSidebar, showSidebar2 }) => {
  const [showSignin, setShowSignin] = useState(false);
  // const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const { userInfo, userid, unclicked, fetchUserData, theme, toggleTheme } =
    useContext(SidebarContext);

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}backend/logout.php`,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        fetchUserData();
        window.location.reload();
      } else {
        console.error("Logout failed: ", response.data.message);
      }
    } catch (error) {
      console.log("Error in logging out", error);
    }
  };

  return (
    <>
      <div
        className={`overlay-sidebar ${showSidebar2 ? "show2" : ""}`}
        onClick={setSidebar}
      ></div>
      <div className={`side-bar ${showSidebar2 ? "show" : ""}`}>
        {userid != 0 ? (
          <Link to={`/user-profile/${userInfo.user_id}`} className="wrapper">
            <div className="profile">
              <img
                src={
                  userInfo.profilePic
                    ? `${config.apiBaseUrl}backend/uploads/${userInfo.profilePic}`
                    : profileimage
                }
                alt=""
              />
              <span>{userInfo.username}</span>
            </div>
          </Link>
        ) : (
          ""
        )}

        {userid != 0 ? (
          <div className="sidebar-bottom-wrapper">
            <Link
              to="/message/"
              style={{ position: "relative" }}
              className="icon-wrapper"
            >
              {/* <i className="bi bi-chat-text"></i> Chat */}
              {/* <div
                style={{
                  position: "absolute",
                  padding: "3px",
                  height: "15px",
                  width: "15px",
                  fontSize: "8px",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "green",
                  borderRadius: "50%",
                  top: 2,
                  border: "1px, solid, white",
                  left: "4px",
                  zIndex: 999,
                }}
                className="dot"
              >
                2
              </div> */}
              <img src={pp} alt="" style={{ width: "30px", height: "30px" }} />
              ChatBot
            </Link>
            <Link className="icon-wrapper" to={`/mybooking/${userid}`}>
              {" "}
              <i className="bi bi-calendar2-event"></i> Reservation{" "}
            </Link>
            <Link className="icon-wrapper" to="/fees/">
              {" "}
              <i className="bi bi-cash-coin"></i> Other fees{" "}
            </Link>
            <Link
              style={{ position: "relative" }}
              className="icon-wrapper"
              to="/notification/"
            >
              <i className="bi bi-bell"></i> Notification
              {unclicked > 0 && (
                <div
                  style={{
                    position: "absolute",
                    padding: "3px",
                    height: "15px",
                    width: "15px",
                    fontSize: "8px",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "red",
                    borderRadius: "50%",
                    top: 2,
                    border: "1px, solid, white",
                    left: "4px",
                    zIndex: 999,
                  }}
                  className="dot"
                >
                  {unclicked}
                </div>
              )}
            </Link>
          </div>
        ) : (
          ""
        )}

        <div className="notSigninComponents">
          {userid == 0 ? (
            <button onClick={() => setShowSignin(!showSignin)}>Sign in</button>
          ) : (
            ""
          )}

          <Link className="icon-wrapper" onClick={toggleTheme}>
            {" "}
            <i
              className={`${
                theme === "dark" ? "bi bi-brightness-high" : "bi bi-moon"
              }`}
            ></i>{" "}
            {theme === "dark" ? "Light" : "Dark"}{" "}
          </Link>

          {userid != 0 ? (
            <Link className="icon-wrapper" onClick={handleLogout}>
              {" "}
              <i className="bi bi-box-arrow-left"></i> Logout{" "}
            </Link>
          ) : (
            ""
          )}
        </div>
      </div>
      {showSignin && <div className="overlay"></div>}
      {showSignin && <Signup closeModal={() => setShowSignin(false)} />}
    </>
  );
};

export default Sidebar;
