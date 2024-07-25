import "./actinfo.scss";
import axios from "axios";

import { Link, useParams } from "react-router-dom";

import pp from "../../assets/hckr.webp";
import { useContext, useEffect, useRef, useState } from "react";
import Signup from "../signup/Signup";
import config from "../../BaseURL";
import { SidebarContext } from "../../context/Sidebarcontext";

const Actinfo = () => {
  //get activity id from URL
  const { userid, theme } = useContext(SidebarContext);
  useEffect(() => {
    console.log("Current Theme: ", theme);
  }, [theme]);
  const { id } = useParams();
  const inputField = useRef(null);
  const buttonAddReview = useRef(null);
  const messageS = useRef(null);

  const [showInput, setInput] = useState(false);
  const [activity, setActivity] = useState(null);
  const [activities, setActivities] = useState([]);

  // useEffect(() => {
  //   //show input field if uid is 1 : hide
  //   inputField.current.style.display = userId != 0 ? "flex" : "none";
  //   //hide this button if uid is 0 : show
  //   buttonAddReview.current.style.display = userId != 0 ? "none" : "block";
  // }, [userId]);

  //show input and message if btn feedback clicked
  //check if current user sign in, if not redirect to login

  const message_Input = () => {
    if (userid == 0) {
      setInput(true);
      messageS.current.style.opacity = 1;
      messageS.current.style.display = "block";

      setTimeout(() => {
        messageS.current.style.opacity = 0;
        messageS.current.style.display = "none";
      }, 2000);
    } else {
      setInput(false);
    }
  };

  //close signupmodal
  const closeSignupModal = () => {
    setInput(false);
  };

  useEffect(() => {
    axios
      .get(`${config.apiBaseUrl}backend/Actdetails.php?id=${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setActivity(response.data.actid);
      })
      .catch((error) => {
        console.error("Error fetching : ", error);
      });
  }, [id]);

  //get activities

  useEffect(() => {
    axios
      .get(`${config.apiBaseUrl}backend/getOtherAct.php?id=${id}`) // Replace with your actual endpoint
      .then((response) => {
        setActivities(response.data); // Assuming your PHP returns JSON array of activities
      })
      .catch((error) => {
        console.error("Error fetching activities:", error);
      });
  }, [id]); // Empty dependency array ensures this runs once on component mount

  return (
    <>
      <div className={`act-info ${theme}`}>
        <div className="act-info-container">
          {activity ? (
            <>
              <div className="act-info-wrapper">
                <div className="img-info">
                  <img
                    // src={`../../../../backend/uploads/${activity.image}`}
                    src={`${config.apiBaseUrl}backend/ADMIN_PHP/uploads/${activity.image}`}
                    alt=""
                  />

                  <div className="info">
                    <h6>{activity.name}</h6>
                    <span>Price - {activity.price}</span>
                    <p>Duration - {activity.duration}</p>
                  </div>
                </div>
              </div>
              <Link
                className="btn-book"
                to={userid === 0 ? "#" : `/booknow/${activity.act_id}`}
                onClick={message_Input}
              >
                Book Now
              </Link>
            </>
          ) : (
            <p>Loading </p>
          )}

          <div className="other-act-title">
            <span>Other Activities</span>
          </div>
          <div className="other-act">
            <div className="other-act-wrapper">
              {activities.map((act) => (
                <div key={act.act_id}>
                  <Link to={`/act-info/${act.act_id}`} className="card">
                    <img
                      src={`${config.apiBaseUrl}backend/ADMIN_PHP/uploads/${act.image}`}
                      // src={`../../../../backend/ADMIN_PHP/uploads/${act.image}`}
                      alt=""
                    />
                    <span>{act.name}</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="feedback">
          <div className="top">
            <span>Reviews</span>
            {userid == 0 && (
              <button onClick={message_Input}>Share your feedback</button>
            )}
          </div>

          <div className="reviews">
            <div className="card">
              <div className="pp-name-review">
                <img src={pp} alt="" />
                <div className="name-review">
                  <span>Name</span>
                  <p>Lorem ipsum dolor sit amet.</p>
                </div>
              </div>
              <div className="bot">
                <p>2 mins ago</p>
                <span>more</span>
              </div>
            </div>

            <div className="card">
              <div className="pp-name-review">
                <img src={pp} alt="" />
                <div className="name-review">
                  <span>Name</span>
                  <p>Lorem ipsum dolor sit amet.</p>
                </div>
              </div>
              <div className="bot">
                <p>2 mins ago</p>
                <span>more</span>
              </div>
            </div>

            <div className="card">
              <div className="pp-name-review">
                <img src={pp} alt="" />
                <div className="name-review">
                  <span>Name</span>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Corporis quod asperiores ratione ipsum! Dolorem, omnis.
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Ducimus nulla illo tempora?Lorem ipsum dolor sit, amet
                    consectetur adipisicing elit. Consequuntur, alias.
                  </p>
                </div>
              </div>
              <div className="bot">
                <p>2 mins ago</p>
                <span>more</span>
              </div>
            </div>

            <div className="card">
              <div className="pp-name-review">
                <img src={pp} alt="" />
                <div className="name-review">
                  <span>Name</span>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Corporis quod asperiores ratione ipsum! Dolorem, omnis.
                  </p>
                </div>
              </div>
              <div className="bot">
                <p>2 mins ago</p>
                <span>more</span>
              </div>
            </div>
            <div className="card">
              <div className="pp-name-review">
                <img src={pp} alt="" />
                <div className="name-review">
                  <span>Name</span>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Corporis quod asperiores ratione ipsum! Dolorem, omnis.
                  </p>
                </div>
              </div>
              <div className="bot">
                <p>2 mins ago</p>
                <span>more</span>
              </div>
            </div>
            <div className="card">
              <div className="pp-name-review">
                <img src={pp} alt="" />
                <div className="name-review">
                  <span>Name</span>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Corporis quod asperiores ratione ipsum! Dolorem, omnis.
                  </p>
                </div>
              </div>
              <div className="bot">
                <p>2 mins ago</p>
                <span>more</span>
              </div>
            </div>

            <div className="card">
              <div className="pp-name-review">
                <img src={pp} alt="" />
                <div className="name-review">
                  <span>Name</span>
                  <p>Lorem ipsum dolor sit amet, co.</p>
                </div>
              </div>
              <div className="bot">
                <p>2 mins ago</p>
                <span>more</span>
              </div>
            </div>
          </div>

          {userid != 0 && (
            <div className="input">
              <textarea name="" placeholder="Share your comment"></textarea>
              <i className="bi bi-file-arrow-up-fill"></i>
            </div>
          )}
        </div>

        <p className={`message ${showInput ? "show" : ""}`} ref={messageS}>
          You need to sign in first
        </p>
      </div>
      {showInput && <div className="overlay"></div>}
      {showInput && <Signup closeModal={closeSignupModal} />}
    </>
  );
};

export default Actinfo;
