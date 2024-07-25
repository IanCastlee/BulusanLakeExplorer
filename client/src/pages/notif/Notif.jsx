import "./notif.scss";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { SidebarContext } from "../../context/Sidebarcontext";

const Notif = () => {
  const { notifData, handleCardClick, clickedCards } =
    useContext(SidebarContext);

  const [showAll, setShowAll] = useState(false);

  const handleShowMore = () => {
    setShowAll(true);
  };

  const filteredNotifData = showAll ? notifData : notifData.slice(0, 8);

  return (
    <div className="notif">
      <div className="wrappern">
        <div className="titlen">
          <h6>Notifications</h6>
        </div>
        {filteredNotifData.length > 0 ? (
          filteredNotifData.map((notif) => (
            <div
              key={notif.bookedid}
              onClick={() => handleCardClick(notif.bookedid)}
            >
              <div
                className={`card ${
                  clickedCards.includes(notif.bookedid) ? "clicked" : ""
                }`}
              >
                <span>Canceled Booking</span>
                <div className="rightn">
                  <i className="bi bi-journal-x"></i>
                  <p className="msg">{notif.message}</p>
                </div>
                <div className="bot">
                  <Link
                    to={`/mybooking/${notif.userid}`}
                    onClick={() => handleCardClick(notif.bookedid)}
                  >
                    Change schedule
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No notifications yet</p>
        )}
        {!showAll && notifData.length > 8 && (
          <button className="show-more-btn" onClick={handleShowMore}>
            Show more
          </button>
        )}
        <p></p>
      </div>
    </div>
  );
};

export default Notif;
