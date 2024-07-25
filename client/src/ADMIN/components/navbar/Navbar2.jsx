import "./navbar2.scss";

const Navbar2 = () => {
  return (
    <div className="navbar2">
      <div className="left2">
        <h6>Bulusan Lake</h6>
        <p>explorer</p>
      </div>
      <div className="right2">
        <span className="notif_icon">
          <i className="bi bi-bell-fill"></i> <div className="count">3</div>
        </span>
        <span className="chat_icon">
          <i className="bi bi-chat-left-dots-fill"></i>
          <div className="count">4</div>
        </span>
        <span className="user_icon">
          <i className="bi bi-person-circle"></i>
        </span>
      </div>
    </div>
  );
};

export default Navbar2;
