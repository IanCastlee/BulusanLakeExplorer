import { useState } from "react";
import "./sidebar.scss";
import { Link } from "react-router-dom";
import axios from "axios";
const Sideba = () => {
  const [btnActivity, setBtnActivity] = useState(false);
  const [btnUsers, setUsers] = useState(false);
  const [btnReservation, setReservartion] = useState(false);

  const toggleAct = () => {
    setBtnActivity(!btnActivity);
    setReservartion(false);
    setUsers(false);
  };
  const toggleUser = () => {
    setUsers(!btnUsers);
    setReservartion(false);
    setBtnActivity(false);
  };
  const toggleReserv = () => {
    setReservartion(!btnReservation);
    setBtnActivity(false);
    setUsers(false);
  };

  //HANDLE LOGOUT
  const handleLogout = async () => {
    try {
      const respose = await axios.post(
        "http://localhost/sheep/backend/logout.php",
        {},
        {
          withCredentials: true,
        }
      );

      if (respose.data.success) {
        console.log(respose.data.message);
        window.location.href = "/";
      } else {
        console.error("Logout failed : ", respose.data.message);
      }
    } catch (error) {
      console.log("Error in logging out", error);
    }
  };

  return (
    <div className="sidebar">
      <Link className="button" to="/admin/">
        <i className="bi bi-window-split"></i> Dashboard
      </Link>
      {/* Activities */}
      <div className="card">
        <button onClick={toggleAct}>
          <i className="bi bi-activity"></i>Activities
        </button>

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
        <button onClick={toggleUser}>
          <i className="bi bi-people"></i>Users
        </button>

        {btnUsers && (
          <div className="btn-act-wrapper">
            <Link className="button" to="/admin/active-user/">
              Active
            </Link>
            <Link className="button" to="/admin/not-active-user/">
              Bin
            </Link>
          </div>
        )}
      </div>
      {/* Booking */}
      <div className="card">
        <button onClick={toggleReserv}>
          <i className="bi bi-calendar2"></i>Reservation
        </button>

        {btnReservation && (
          <div className="btn-act-wrapper">
            <Link className="button" to="/admin/pending/">
              Pending
            </Link>
            <Link className="button" to="/admin/booking/">
              Reserved
            </Link>

            <Link className="button" to="/admin/canceled/">
              Canceled
            </Link>
          </div>
        )}
      </div>
      <Link className="button" to="/admin/biodiversity/">
        <i className="bi bi-fingerprint"></i> Biodiversity
      </Link>

      <Link className="button" to="/admin/chat/">
        <i className="bi bi-chat-dots"></i> Chat
      </Link>
      <Link className="button" onClick={handleLogout}>
        <i className="bi bi-window-split"></i> Logout
      </Link>
    </div>
  );
};

export default Sideba;
