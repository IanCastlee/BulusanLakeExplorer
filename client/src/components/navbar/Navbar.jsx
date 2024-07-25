import React, { useRef, useEffect, useState } from "react";
import "./navbar.scss";
import { Link } from "react-router-dom";
import Weather from "../weather/Weather";
import Announcement from "../announcement/Announcement";

const Navbar = ({ hide, hideIcons, showSidebar }) => {
  //hide/show modal
  const [openWeather, setWeather] = useState(false);
  const [openAnnouncement, setAnnouncement] = useState(false);

  //change icon state (click)
  const weatherIcon = useRef(null);
  const announceIcon = useRef(null);

  const weather = () => {
    setWeather(!openWeather);
    setAnnouncement(false);
  };
  const announcement = () => {
    setAnnouncement(!openAnnouncement);
    setWeather(false);
  };

  // //announce change color
  // useEffect(() => {
  //   if (announceIcon.current) {
  //     announceIcon.current.style.color = openAnnouncement ? "#b0b3b8" : "#fff";
  //   }
  // }, [openAnnouncement]);
  console.log("sdssdsdsd", hideIcons);
  console.log("first", hide);
  return (
    <>
      <div className={`navbar ${hide ? "show" : ""}`}>
        <div className="nav-left">
          {hide && (
            <Link className="icon" onClick={showSidebar}>
              <i className="bi bi-list"></i>
              {/* <i class="bi bi-menu-button"></i>{" "} */}
            </Link>
          )}

          <div className={`logo-wrapper ${hide ? "s" : ""}`}>
            <h6>
              <Link to="/">BulusanLake</Link>{" "}
            </h6>
            <p>explorer</p>
          </div>
        </div>

        <div
          style={{ display: "flex", flexDirection: hide ? "column" : "" }}
          className="nav-right"
        >
          <div className="icon-wrapper">
            <Link className="icon" to="/bio-search/">
              <i className="bi bi-search"></i>
            </Link>
            <Link className="icon" onClick={announcement}>
              <i className="bi bi-pin-angle" ref={announceIcon}></i>
            </Link>
            <Link className="icon" onClick={weather}>
              <i className="bi bi-cloud-sun" ref={weatherIcon}></i>
            </Link>

            <Link className="icon" to="/feed/">
              <i className="bi bi-image"></i>
            </Link>
          </div>
        </div>
      </div>
      {openWeather && <Weather />}
      {openAnnouncement && <Announcement />}
    </>
  );
};

export default Navbar;
