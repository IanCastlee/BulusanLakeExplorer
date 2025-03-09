import React, { useContext, useEffect, useRef, useState } from "react";
import "./navbar.scss";
import profileimage from "../../assets/user (8).png";
import { Link, useNavigate } from "react-router-dom";
import Weather from "../weather/Weather";
import Announcement from "../announcement/Announcement";
import { SidebarContext } from "../../context/Sidebarcontext";
import config from "../../BaseURL";
import Signup from "../../pages/signup/Signup";
import axios from "axios";
import pp from "../../assets/chat-bot.png";
import blsnlogo from "../../assets/logo (500 x 500 px) (1).png";
// import blsnlogo from "../../assets/bldnxplrlogo.png";

const Navbar = ({ hide, hideIcons, showSidebar, className, scrollY }) => {
  const { userInfo, userid, unclicked, fetchUserData, theme, toggleTheme } =
    useContext(SidebarContext);

  const navigate = useNavigate();

  const [openWeather, setWeather] = useState(false);
  const [openAnnouncement, setAnnouncement] = useState(false);
  const [showSignin, setShowSignin] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [activeHome, setActiveHome] = useState(false);
  const [activePin, setActivePin] = useState(false);
  const [activeCloude, setActiveCloude] = useState(false);
  const [activeImage, setActiveImage] = useState(false);
  const [activeMsg, setActiveMsg] = useState(false);
  const [activeAnnoun, setActiveAnoun] = useState(false);
  const [activeNotif, setActiveNotif] = useState(false);
  const [activeFess, setActiveFees] = useState(false);

  const closePin = () => {
    setActivePin(false);
    setAnnouncement(false);
  };

  const closeWeather = () => {
    setActiveCloude(false);
    setWeather(false);
  };

  const ActiveHome = () => {
    handleFullscreen();

    setActiveHome(true);
    setActiveImage(false);
    setActiveMsg(false);
    setActiveAnoun(false);
    setActiveCloude(false);
    setActivePin(false);
    setActiveNotif(false);
    setActiveFees(false);
  };

  const ActivePin = () => {
    handleFullscreen();
    setActiveHome(false);
    setActivePin(true);
    setActiveCloude(false);
    setActiveImage(false);
    setActiveMsg(false);
    setActiveAnoun(false);
    setActiveNotif(false);
    setActiveFees(false);

    setAnnouncement(true);
    setWeather(false);
  };

  const ActiveCloude = () => {
    setActiveHome(false);
    setActivePin(false);
    setActiveCloude(true);
    setActiveImage(false);
    setActiveMsg(false);
    setActiveAnoun(false);
    setActiveNotif(false);
    setActiveFees(false);

    setWeather(true);
    setAnnouncement(false);
  };

  const ActiveImage = () => {
    handleFullscreen();
    setActiveHome(false);
    setActiveImage(true);
    setActiveMsg(false);
    setActiveAnoun(false);
    setActiveCloude(false);
    setActivePin(false);
    setActiveNotif(false);
    setActiveFees(false);
  };

  const ActiveMsg = () => {
    setActiveHome(false);
    setActiveImage(false);
    setActiveMsg(true);
    setActiveCloude(false);
    setActivePin(false);
    setActiveAnoun(false);
    setActiveNotif(false);
    setActiveFees(false);
  };

  const ActiveAnnoun = () => {
    setActiveHome(false);
    setActiveImage(false);
    setActiveMsg(false);
    setActiveCloude(false);
    setActivePin(false);
    setActiveAnoun(true);
    setActiveNotif(false);
    setActiveFees(false);
  };

  const ActiveNotif = () => {
    setActiveHome(false);
    setActiveImage(false);
    setActiveMsg(false);
    setActiveAnoun(false);
    setActiveCloude(false);
    setActivePin(false);
    setActiveNotif(true);
    setActiveFees(false);
  };
  const ActiveFees = () => {
    setActiveHome(false);
    setActiveImage(false);
    setActiveMsg(false);
    setActiveAnoun(false);
    setActiveCloude(false);
    setActivePin(false);
    setActiveNotif(false);
    setActiveFees(true);
  };

  const weatherIcon = useRef(null);
  const announceIcon = useRef(null);

  useEffect(() => {
    if (className) {
      setActiveHome(true);
    }
  }, [className]);

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

  console.log("HHHH", scrollY);
  return (
    <>
      <div
        className={`navbar ${hide ? "show" : ""} ${className} ${
          scrollY ? "scrolled" : ""
        }`}
      >
        <div className="nav-left">
          {hide && (
            <Link
              className="icon"
              onClick={showSidebar}
              style={{ position: "relative" }}
            >
              <i className="bi bi-list"></i>

              {unclicked > 0 && (
                <div
                  style={{
                    position: "absolute",
                    padding: "3px",
                    height: "13px",
                    width: "13px",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "red",
                    borderRadius: "50%",
                    top: "-10px",
                    border: "1px solid white",
                    left: "2px",
                    zIndex: 999,
                  }}
                >
                  <p style={{ fontSize: "10px", color: "#fff" }}>{unclicked}</p>
                </div>
              )}
            </Link>
          )}

          <div className={`logo-wrapper ${hide ? "s" : ""}`}>
            <img src={blsnlogo} alt="" />
          </div>
        </div>

        <div className="nav-right">
          <div className="icon-wrapper">
            {hide && (
              <Link className="icon" to="/bio-search/">
                <i className={`bi bi-search search ${className}`}></i>
              </Link>
            )}

            <Link className="icon" to="/home/" onClick={ActiveHome}>
              <i
                className={`bi bi-house ${className} ${
                  activeHome ? "active" : ""
                }`}
              ></i>
              <div className="tooltip">Home</div>
            </Link>

            <Link className="icon" onClick={ActiveCloude}>
              <i
                className={`bi bi-cloud-sun ${className} ${
                  activeCloude ? "active" : ""
                }`}
                ref={weatherIcon}
              ></i>
              <div className="tooltip">Weather</div>
            </Link>
            <Link
              className="icon"
              onClick={() => {
                navigate("/feed/");
                ActiveImage();
              }}
            >
              <i
                className={`bi bi-image ${className} ${
                  activeImage ? "active" : ""
                }`}
              ></i>
              <div className="tooltip">Feed</div>
            </Link>

            {hide && (
              <Link
                className={`iconfees  ${hide ? "s" : ""}`}
                to="/fees/"
                onClick={ActiveFees}
              >
                <i
                  className={`bi bi-cash-coin ${className} ${
                    activeFess ? "active" : ""
                  }`}
                ></i>
                <div className="tooltip">Fees</div>
              </Link>
            )}

            {userid != 0 ? (
              <div className="sidebar-bottom-wrapper">
                <Link
                  to="/message/"
                  style={{ position: "relative" }}
                  className="icon-wrapper"
                  onClick={ActiveMsg}
                >
                  <img
                    src={pp}
                    alt=""
                    style={{ width: "35px", height: "35px" }}
                  />
                  <div className="tooltip">Chatbot</div>
                </Link>

                <Link
                  className="icon-wrapper"
                  to={`/mybooking/${userid}`}
                  onClick={ActiveAnnoun}
                >
                  <i
                    className={`bi bi-calendar2-event  ${className} ${
                      activeAnnoun ? "active" : ""
                    }`}
                  ></i>

                  <div className="tooltip">Reservation</div>
                </Link>
                <Link
                  style={{ position: "relative" }}
                  className="icon-wrapper"
                  to="/notification/"
                  onClick={ActiveNotif}
                >
                  <i
                    className={`bi bi-bell ${className} ${
                      activeNotif ? "active" : ""
                    }`}
                  ></i>
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
                        border: "1px solid white",
                        right: "8px",
                        zIndex: 999,
                      }}
                      className="dot"
                    >
                      <p style={{ fontSize: "8px", color: "#fff" }}>
                        {unclicked}
                      </p>
                    </div>
                  )}

                  <div className="tooltip">Notification</div>
                </Link>
              </div>
            ) : (
              ""
            )}

            {userid != 0 ? (
              <>
                <Link
                  className="wrapper"
                  onClick={() => setShowProfileModal(!showProfileModal)}
                >
                  <div className="profile">
                    <img
                      src={
                        userInfo.profilePic
                          ? `${config.apiBaseUrl}backend/uploads/${userInfo.profilePic}`
                          : profileimage
                      }
                      alt=""
                    />
                    <span>{userInfo.username.split(" ")[0]}</span>
                  </div>

                  {showProfileModal && (
                    <div className={`modal-profile ${className}`}>
                      <Link
                        className={`icon-wrapper ${className}`}
                        to={`/user-profile/${userInfo.user_id}`}
                      >
                        <i className="bi bi-person"></i> Profile{" "}
                      </Link>

                      <Link
                        className={`icon-wrapper ${className}`}
                        onClick={toggleTheme}
                      >
                        <i
                          className={`${
                            theme === "dark"
                              ? "bi bi-brightness-high"
                              : "bi bi-moon"
                          }`}
                        ></i>{" "}
                        {theme === "dark" ? "Light" : "Dark"}{" "}
                      </Link>

                      <Link
                        className={`icon-wrapper ${className}`}
                        onClick={handleLogout}
                      >
                        <i className="bi bi-box-arrow-left"></i> Logout{" "}
                      </Link>
                    </div>
                  )}
                </Link>
              </>
            ) : (
              <>
                <button
                  className="btn-singin"
                  onClick={() => setShowSignin(!showSignin)}
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {openWeather && <Weather closeWeather={closeWeather} />}
      {openAnnouncement && <Announcement close={closePin} />}
      {showSignin && <div className="overlay"></div>}
      {showSignin && <Signup closeModal={() => setShowSignin(false)} />}
    </>
  );
};

export default Navbar;
