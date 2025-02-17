import { useContext, useState } from "react";
import "./sideba.scss";
import { Link } from "react-router-dom";
import axios from "axios";
import config from "../../../BaseURL";
const Sideba = () => {
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

  return (
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
            <Link className="button" to="/admin/activity">
              Active
            </Link>
            <Link className="button" to="/admin/not-active-act/">
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
            <Link className="button" to={`/admin/active-user/${0}`}>
              Active
            </Link>
            <Link className="button" to="/admin/not-active-user/">
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
            <Link className="button" to="/admin/booking/">
              Reserved
            </Link>

            <Link className="button" to="/admin/arrived/">
              Arrived
            </Link>

            <Link className="button" to="/admin/notarrived/">
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
            <Link className="button" to="/admin/chat/">
              Message
            </Link>
            <Link className="button" to="/admin/chatbot/">
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
            <Link className="button" to="/admin/pendingposts/">
              Pending Posts
            </Link>

            <Link className="button" to={`/admin/posts/${0}/${0}`}>
              Posts
            </Link>
          </div>
        )}
      </div>

      <Link className="button" to="/admin/bio/">
        <i className="bi bi-fingerprint"></i> Biodiversity
      </Link>

      <Link className="button" to="/admin/announcement/">
        <i className="bi bi-megaphone"></i> Announcement
      </Link>

      <Link className="button" to="/admin/terms-condations/">
        <i className="bi bi-book-half"></i> Terms and conditions
      </Link>
      {/* <Link className="button" to="/admin/reports/">
        <i className="bi bi-exclamation-circle"></i> Reports
      </Link> */}

      <Link className="button" to={`/admin/reviews`}>
        <i className="bi bi-star-half"></i> Activity Reviews
      </Link>

      <Link className="button" to={`/admin/fees`}>
        <i className="bi bi-star-half"></i> Fees
      </Link>

      <button className="button" onClick={handleLogoutt}>
        <i className="bi bi-box-arrow-left" style={{ color: "red" }}></i>{" "}
        <span style={{ color: "red" }}>Logout</span>
      </button>
    </div>
  );
};

export default Sideba;
