import { Link } from "react-router-dom";
import "./navbar2.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import config from "../../../BaseURL";

const Navbar2 = ({ className }) => {
  const [showSidebar, setShowSidebar] = useState(false);

  const [btnActivity, setBtnActivity] = useState(false);
  const [btnUsers, setUsers] = useState(false);
  const [btnReservation, setReservartion] = useState(false);
  const [btnChatBot, setChatBot] = useState(false);
  const [btnPosts, setPosts] = useState(false);

  const toggleAct = () => {
    setBtnActivity(!btnActivity);
    setReservartion(false);
    setUsers(false);
    setChatBot(false);
    setPosts(false);
  };
  const toggleUser = () => {
    setUsers(!btnUsers);
    setReservartion(false);
    setBtnActivity(false);
    setChatBot(false);
    setPosts(false);
  };
  const toggleReserv = () => {
    setReservartion(!btnReservation);
    setBtnActivity(false);
    setUsers(false);
    setChatBot(false);
    setPosts(false);
  };

  const toggleChat = () => {
    setChatBot(!btnChatBot);
    setReservartion(false);
    setBtnActivity(false);
    setUsers(false);
    setReservartion(false);
    setPosts(false);
  };

  const togglePosts = () => {
    setPosts(!btnPosts);
    setChatBot(false);
    setReservartion(false);
    setBtnActivity(false);
    setUsers(false);
    setReservartion(false);
  };

  //HANDLE LOGOUT
  const handleLogoutt = async () => {
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}backend/logout.php`,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        console.log(response.data.message);
        window.location.href = "/login";
      } else {
        console.error("Logout failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const [counts, setCounts] = useState({
    notans: 0,
  });

  useEffect(() => {
    // Fetch counts
    axios
      .get(`${config.apiBaseUrl}backend/ADMIN_PHP/count.php`)
      .then((response) => {
        setCounts(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the counts!", error);
      });
  }, []);
  return (
    <>
      <div className={`navbar2 ${className}`}>
        <div className="left2">
          <h6>Bulusan Lake</h6>
          <p>explorer</p>
        </div>
        <div className="right2">
          <Link to="/admin/" className="notif_icon">
            <i className="bi bi-house-door-fill"></i>{" "}
          </Link>

          <Link to={`/admin/chat/`} className="chat_icon">
            <i className="bi bi-chat-left-dots-fill"></i>
            {counts.notans > 0 && <div className="count">{counts.notans}</div>}
          </Link>

          <span className="menu" onClick={() => setShowSidebar(true)}>
            <i className="bi bi-list"></i>
          </span>
        </div>
      </div>

      {showSidebar && (
        <div
          className="mobile-sidebar-overlay"
          onClick={() => setShowSidebar(false)}
        ></div>
      )}

      {showSidebar && (
        <div className="mobile-sidebar">
          <div className="content">
            <h6>BULUSAN LAKE EXPLORER</h6>

            <div className="sideba">
              <Link className="button" to="/admin/">
                <i className="bi bi-window-split"></i> Dashboard
              </Link>
              {/* Activities */}
              <div className="card">
                <div className="button-wrapper">
                  <button onClick={toggleAct}>
                    <i className="bi bi-activity"></i>Activities
                  </button>
                  <i
                    onClick={toggleAct}
                    className={`${
                      btnActivity
                        ? "bi bi-chevron-down down_icon"
                        : "bi bi-chevron-up down_icon"
                    } `}
                  ></i>
                </div>

                {btnActivity && (
                  <div className="btn-act-wrapper">
                    <Link
                      className="button"
                      to="/admin/activity"
                      onClick={() => setShowSidebar(false)}
                    >
                      Active
                    </Link>
                    <Link
                      className="button"
                      to="/admin/not-active-act/"
                      onClick={() => setShowSidebar(false)}
                    >
                      Not Active
                    </Link>
                  </div>
                )}
              </div>
              {/* Users */}
              <div className="card">
                <div className="button-wrapper">
                  <button onClick={toggleUser}>
                    <i className="bi bi-people"></i>Users
                  </button>
                  <i
                    onClick={toggleUser}
                    className={`${
                      btnUsers
                        ? "bi bi-chevron-down down_icon"
                        : "bi bi-chevron-up down_icon"
                    } `}
                  ></i>
                </div>

                {btnUsers && (
                  <div className="btn-act-wrapper">
                    <Link
                      className="button"
                      to={`/admin/active-user/${0}`}
                      onClick={() => setShowSidebar(false)}
                    >
                      Active
                    </Link>
                    <Link
                      className="button"
                      to="/admin/not-active-user/"
                      onClick={() => setShowSidebar(false)}
                    >
                      Not Active
                    </Link>
                  </div>
                )}
              </div>
              {/* Booking */}
              <div className="card">
                <div className="button-wrapper">
                  <button onClick={toggleReserv}>
                    <i className="bi bi-calendar2"></i>Reservation
                  </button>
                  <i
                    onClick={toggleReserv}
                    className={`${
                      btnReservation
                        ? "bi bi-chevron-down down_icon"
                        : "bi bi-chevron-up down_icon"
                    } `}
                  ></i>
                </div>

                {btnReservation && (
                  <div className="btn-act-wrapper">
                    {/* <Link className="button" to="/admin/pending/">
              Pending
            </Link> */}
                    <Link
                      className="button"
                      to="/admin/booking/"
                      onClick={() => setShowSidebar(false)}
                    >
                      Reserved
                    </Link>

                    <Link
                      className="button"
                      to="/admin/arrived/"
                      onClick={() => setShowSidebar(false)}
                    >
                      Arrived
                    </Link>

                    <Link
                      className="button"
                      to="/admin/notarrived/"
                      onClick={() => setShowSidebar(false)}
                    >
                      Not Arrived
                    </Link>

                    {/* <Link className="button" to="/admin/canceled/">
              Canceled
            </Link> */}
                  </div>
                )}
              </div>

              <div className="card">
                <div className="button-wrapper">
                  <button onClick={toggleChat}>
                    <i className="bi bi-chat-dots"></i> Chat
                  </button>
                  <i
                    onClick={toggleChat}
                    className={`${
                      btnChatBot
                        ? "bi bi-chevron-down down_icon"
                        : "bi bi-chevron-up down_icon"
                    } `}
                  ></i>
                </div>

                {btnChatBot && (
                  <div className="btn-act-wrapper">
                    <Link
                      className="button"
                      to="/admin/chat/"
                      onClick={() => setShowSidebar(false)}
                    >
                      Message
                    </Link>
                    <Link
                      className="button"
                      to="/admin/chatbot/"
                      onClick={() => setShowSidebar(false)}
                    >
                      Customize chatbot
                    </Link>
                  </div>
                )}
              </div>

              <div className="card">
                <div className="button-wrapper">
                  <button onClick={togglePosts}>
                    <i className="bi bi-images"></i> Posts
                  </button>
                  <i
                    onClick={togglePosts}
                    className={`${
                      btnPosts
                        ? "bi bi-chevron-down down_icon"
                        : "bi bi-chevron-up down_icon"
                    } `}
                  ></i>
                </div>

                {btnPosts && (
                  <div className="btn-act-wrapper">
                    <Link
                      className="button"
                      to="/admin/pendingposts/"
                      onClick={() => setShowSidebar(false)}
                    >
                      Pending Posts
                    </Link>

                    <Link
                      className="button"
                      to={`/admin/posts/${0}/${0}`}
                      onClick={() => setShowSidebar(false)}
                    >
                      Posts
                    </Link>
                  </div>
                )}
              </div>

              <Link
                className="button"
                to="/admin/bio/"
                onClick={() => setShowSidebar(false)}
              >
                <i className="bi bi-fingerprint"></i> Biodiversity
              </Link>

              <Link
                className="button"
                to="/admin/announcement/"
                onClick={() => setShowSidebar(false)}
              >
                <i className="bi bi-megaphone"></i> Announcement
              </Link>

              <Link
                className="button"
                to="/admin/terms-condations/"
                onClick={() => setShowSidebar(false)}
              >
                <i className="bi bi-book-half"></i> Terms and conditions
              </Link>
              <Link
                className="button"
                to="/admin/reports/"
                onClick={() => setShowSidebar(false)}
              >
                <i className="bi bi-exclamation-circle"></i> Reports
              </Link>

              <Link
                className="button"
                to={`/admin/reviews`}
                onClick={() => setShowSidebar(false)}
              >
                <i className="bi bi-star-half"></i> Activity Reviews
              </Link>

              <Link
                className="button"
                to={`/admin/fees`}
                onClick={() => setShowSidebar(false)}
              >
                <i className="bi bi-star-half"></i> Fees
              </Link>

              <button className="button" onClick={handleLogoutt}>
                <i
                  className="bi bi-box-arrow-left"
                  style={{ color: "red" }}
                ></i>{" "}
                <span style={{ color: "red" }}>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar2;
