import "./booknow.scss";

import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import config from "../../BaseURL";
import { SidebarContext } from "../../context/Sidebarcontext";

const Booknow = () => {
  const { theme } = useContext(SidebarContext);

  const { id } = useParams();
  const notifOpacity1 = useRef(null);

  const [showConfirm, setConfirm] = useState(false);
  const [showMessage, setMessage] = useState(false);
  const [actData, setActData] = useState(false);
  const [userid, setuserID] = useState(0);
  const [participant, setParticipant] = useState("");
  const [dateBook, setDateBook] = useState("");
  const [participanEmpty, setParticipantEmpty] = useState("");
  const [dateBookErr, setDateBookErr] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  //show the modal booking confirmation
  const modalConfirm = (e) => {
    e.preventDefault();

    const currentDate = new Date().toISOString().split("T")[0];
    const tenDaysFromNow = new Date();
    tenDaysFromNow.setDate(tenDaysFromNow.getDate() + 10);
    const tenDaysFromNowFormatted = tenDaysFromNow.toISOString().split("T")[0];

    let valid = true;

    if (!participant) {
      setParticipantEmpty("Input number of participant");
      valid = false;
    }

    if (!dateBook) {
      setDateBookErr("Date is required");
      valid = false;
    } else if (dateBook === currentDate) {
      setDateBookErr("You cannot book this date because it's the current date");
      valid = false;
    } else if (dateBook > tenDaysFromNowFormatted) {
      setDateBookErr("You cannot book more than 10 days in advance");
      valid = false;
    } else if (dateBook < currentDate) {
      setDateBookErr("You cannot book a date before today");
      valid = false;
    }

    if (valid) {
      setDateBookErr("");
      setParticipantEmpty("");
      setConfirm(true);
      setTotalPrice(participant * actData.price);
    }
  };

  //closeMessag
  const toggleCloseMessage = (e) => {
    e.preventDefault();
    notifOpacity1.current.style.opacity = 0;
    notifOpacity1.current.style.display = "none";
  };

  //get current activity details
  useEffect(() => {
    axios
      .get(`${config.apiBaseUrl}backend/Actdetails.php?id=${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setActData(response.data.actid);
        setuserID(response.data.userid);
      })
      .catch((error) => {
        console.error("There was an problem in fetching data", error);
      });
  }, [id]);

  //format date

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };

    const dateBook = new Date(dateString);

    return dateBook.toLocaleDateString(undefined, options);
  };

  //submit booking
  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    console.log("Submitting booking...");

    const bookingData = {
      participant,
      dateBook: formatDate(dateBook),
      totalPrice,
      actId: actData.act_id,
      userId: userid,
    };
    try {
      console.log(bookingData);
      const response = await axios.post(
        `${config.apiBaseUrl}backend/postBooking.php`,
        bookingData,
        {
          withCredentials: true,
        }
      );

      console.log("Response from server:", response.data); // Check response from server

      if (response.data.success) {
        console.log(response.data.message);
        // Optionally show a success message or redirect
        notifOpacity1.current.style.opacity = 1;
        notifOpacity1.current.style.display = "block";
        setConfirm(false);
      } else {
        console.error("Booking failed: ", response.data.message);
        // Show an error message to the user
      }
    } catch (error) {
      console.error("Error during booking: ", error);
      // Handle network or other errors
    }
  };

  return (
    <>
      <div className={`booknow ${theme}`}>
        {actData ? (
          <>
            <div className="left-book">
              <img
                src={`${config.apiBaseUrl}backend/ADMIN_PHP/uploads/${actData.image}`}
                alt=""
              />
            </div>

            <div className="right-book">
              <div className="info">
                <h6>{actData.name}</h6>
                <span>Price - {actData.price}</span>
                <span>Duration - {actData.duration}</span>
              </div>

              <div className="form">
                <span style={{ color: "red" }}>
                  {participanEmpty && participanEmpty}
                </span>
                <input
                  type="number"
                  placeholder="Number of participant"
                  value={participant}
                  onChange={(e) => {
                    setParticipant(e.target.value);
                    if (e.target.value) {
                      setParticipantEmpty("");
                    }
                  }}
                />
                <span style={{ color: "red" }}>
                  {dateBookErr && dateBookErr}
                </span>{" "}
                <input
                  type="date"
                  value={dateBook}
                  onChange={(e) => {
                    setDateBook(e.target.value);
                    if (e.target.value) {
                      setDateBookErr("");
                    }
                  }}
                />
                <button onClick={modalConfirm}>Book</button>
              </div>
            </div>
          </>
        ) : (
          <p>field to load</p>
        )}
      </div>

      {showConfirm && (
        <>
          <div className="overlay-confirm"></div>
          <form className="confirm-booking" onSubmit={handleSubmitBooking}>
            <div className="top">
              <span>Cofirm your booking</span>
            </div>

            <div className="booked-info">
              <span>{actData.name}</span>
              <span>Participant - {participant}</span>
              <span>Date - {formatDate(dateBook)}</span>
              <span>price - Php {actData.price}</span>
              <span>Total price - Php {totalPrice}</span>

              <input type="hidden" name="participant_o" value={participant} />
              <input type="hidden" name="date_o" value={formatDate(dateBook)} />
              <input type="hidden" name="total_o" value={totalPrice} />
            </div>

            <div className="bot">
              <button type="submit" className="confirm">
                Confirm
              </button>
              <button className="cancel" onClick={() => setConfirm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </>
      )}

      <div
        className={`message-card ${showMessage ? "" : "show"}`}
        ref={notifOpacity1}
      >
        <p>
          Your reservation has been sent. We will send a notification after the
          admin read your reservation.
        </p>

        <div className="bottom">
          <Link className="btn-view" to={`/mybooking/${userid}`}>
            View Booking
          </Link>
          <button className="btn-close" onClick={toggleCloseMessage}>
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default Booknow;
