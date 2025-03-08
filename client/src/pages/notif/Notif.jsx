import "./notif.scss";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import config from "../../BaseURL";
import axios from "axios";
import { SidebarContext } from "../../context/Sidebarcontext";
import { motion } from "framer-motion";
const Notif = () => {
  const { userid, getUnclickedNotif } = useContext(SidebarContext);
  const [notif, setNotif] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [clickedNotif, setClickedNotif] = useState(null);
  const [clickedNotifShow, setClickedNotifShow] = useState(false);

  const [clickedNotifCaption, setClickedNotifCaption] = useState(null);
  const [clickedNotifContent, setClickedNotifContent] = useState(null);
  const [clickedNotifShowCap, setClickedNotifShowCap] = useState(false);

  const clicked_notif = (image_post) => {
    setClickedNotif(image_post);
    setClickedNotifShow(true);
  };

  const clicked_notif_caption = (caption, content) => {
    setClickedNotifCaption(caption);
    setClickedNotifContent(content);
    setClickedNotifShowCap(true);
  };

  const fetchNotif = () => {
    axios
      .get(`${config.apiBaseUrl}backend/getCanceledBookingNotif.php`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log("first", response.data);
        setNotif(response.data.notifications || []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user info:", error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchNotif();
  }, []);

  const handleClickedNotif = (notif_id) => {
    const formdata = new FormData();
    formdata.append("notif_id", notif_id);
    axios
      .post(`${config.apiBaseUrl}backend/updateClickNotif.php`, formdata, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data.success);
        fetchNotif();
        getUnclickedNotif();
      })
      .catch((error) => {
        console.log("Error : ", error);
      });
  };

  return (
    <>
      <div className="notif">
        <div className="wrappern">
          <div className="titlen">
            <h6>Notifications</h6>
          </div>

          <div>
            {isLoading ? (
              <span className="loader"></span>
            ) : notif.length > 0 ? (
              notif.map((n) => (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`card ${n.status === "clicked" ? "clicked" : ""}`}
                  key={n.notif_id}
                  onClick={() => handleClickedNotif(n.notif_id)}
                >
                  <div className="top">
                    {n.title === "Post removal" ||
                    n.title === "Post Approved" ? (
                      <i className="bi bi-image"></i>
                    ) : n.title === "Post Caption Removal" ? (
                      <i className="bi bi-chat-left-text"></i>
                    ) : (
                      <i className="bi bi-calendar2-day"></i>
                    )}
                    <div className="title-wrapper">
                      <span>{n.title}</span>

                      <p>{n.createdAt}</p>
                    </div>
                  </div>
                  <div className="rightn">
                    <p
                      className={`msg ${
                        n.status === "clicked" ? "clicked" : ""
                      }`}
                    >
                      {n.content}
                    </p>
                  </div>
                  <div
                    className="bot"
                    style={{ marginTop: "10px", cursor: "pointer" }}
                  >
                    {n.title === "Post removal" ? (
                      <span
                        className="span"
                        style={{ fontSize: "10px" }}
                        onClick={() => clicked_notif(n.image_post)}
                      >
                        View Image
                      </span>
                    ) : n.title === "Post Approved" ? (
                      <Link
                        className="span"
                        style={{ fontSize: "10px" }}
                        to={`/user-profile/${userid}`}
                      >
                        View Post
                      </Link>
                    ) : n.title === "Post Caption Removal" ? (
                      <span
                        className="span"
                        style={{ fontSize: "10px" }}
                        onClick={() =>
                          clicked_notif_caption(n.caption, n.content)
                        }
                      >
                        View Caption
                      </span>
                    ) : (
                      <span className="span" style={{ fontSize: "10px" }}>
                        {n.status === "clicked"
                          ? "Read"
                          : "Click to mark as read"}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div
                style={{
                  color: "gray",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "200px",
                  flexDirection: "column",
                }}
              >
                <i
                  class="bi bi-bell-fill"
                  style={{ fontSize: "70px", color: "gray" }}
                ></i>
              </div>
            )}
          </div>
        </div>
      </div>
      {clickedNotifShow && (
        <div className="viewImageModal">
          <div className="top">
            <span>Post Removed by Admin</span>

            <i
              className="bi bi-x"
              onClick={() => setClickedNotifShow(false)}
            ></i>
          </div>

          <div className="content">
            <img
              // src={`${config.apiBaseUrl}/backend/uploads/${clickedNotif} `}
              src={`https://bulusanlakeexplorer.kesug.com/backend/uploads/${clickedNotif} `}
              alt=""
            />
          </div>
        </div>
      )}
      {clickedNotifShow && <div className="viewImageModalOverlay"></div>}{" "}
      {clickedNotifShowCap && (
        <div className="viewImageModal">
          <div className="top">
            <span>Caption Removed by Admin</span>

            <i
              className="bi bi-x"
              onClick={() => setClickedNotifShowCap(false)}
            ></i>
          </div>

          <div className="content">
            <p style={{ color: "gray" }}>{clickedNotifContent}</p>
            <p style={{ color: "gray", marginTop: "20px" }}>
              Your Caption : {clickedNotifCaption}
            </p>
          </div>
        </div>
      )}
      {clickedNotifShowCap && <div className="viewImageModalOverlay"></div>}{" "}
    </>
  );
};

export default Notif;
