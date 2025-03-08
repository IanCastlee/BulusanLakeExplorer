import { useContext, useEffect, useState } from "react";
import "./mybooking.scss";
import { motion } from "framer-motion";
import axios from "axios";
import config from "../../../BaseURL";
import { Link, useParams } from "react-router-dom";
import bg from "../../../assets/bg.jpg";
import { SidebarContext } from "../../../context/Sidebarcontext";

const Mybooking = () => {
  const { id } = useParams();
  const { setUpdateBookedData } = useContext(SidebarContext);

  const [showModalConfirm, setModalConfirm] = useState(false);

  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [selectedBookingDetails, setSelectedBookingDetails] = useState({
    name: "",
    booked_date: "",
    user_id: "",
  });

  const [userBookingData, setBookingData] = useState([]);
  const [userPendingData, setPendingData] = useState([]);
  const [userPreviousData, setPreviousData] = useState([]);
  const [bookedViewData, setBookedViewData] = useState(null);

  const [showPending, setPending] = useState(false);
  const [showApproved, setApproved] = useState(true);
  const [showPrevious, setPrevious] = useState(false);

  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);

  const [showGuide, setshowGuide] = useState(false);

  const [showViewReservation, setShowViewReservation] = useState(false);

  const [showModalReason, setShowModalReason] = useState(false);
  const [cancelData, setCancelData] = useState({
    booked_id: "",
    name: "",
    booked_date: "",
    date: "",
    user_id: "",
    email: "",
    reason: "",
  });

  const selectedData_cancel = (
    booked_id,
    name,
    booked_date,
    user_id,
    email
  ) => {
    setShowModalReason(true);
    setCancelData((prevData) => ({
      ...prevData,
      booked_id: booked_id,
      name: name,
      booked_date: booked_date,
      user_id: user_id,
      email: email,
    }));
  };

  console.log("sjdsjdhj", cancelData.email);

  //handleSubmitDecline
  const handleSubmitCancel = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("user_id", cancelData.user_id);
    formData.append("booked_id", cancelData.booked_id);
    formData.append("email", cancelData.email);
    formData.append("booked_date", cancelData.booked_date);
    formData.append("name", cancelData.name);
    formData.append("reason", cancelData.reason);

    formData.append("title", "Reservation Cancelled");
    formData.append(
      "content",
      `We regret to inform you that your ${cancelData.name} booking scheduled for ${cancelData.booked_date}, has been successfully canceled due to unforeseen weather conditions.<br/><br/>`
    );

    axios
      .post(`${config.apiBaseUrl}backend/postCancelbooking.php`, formData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.success) {
          console.log("True :", response.data);
          getUserBooking();
          axios
            .post(`${config.apiBaseUrl}backend/sendMail.php`, formData, {
              withCredentials: true,
            })
            .then((resEmail) => {
              console.log("Email sent : ", resEmail.data.message);
            })
            .catch((error) => {
              console.log("Error : ", error);
            });

          setShowModalReason(false);
        } else {
          console.log("False: ", response.data);
        }
      })
      .catch((error) => {
        console.log("Error :", error);
      });
  };

  const handleClickedToUpdate = (booked) => {
    console.log(booked);
    setUpdateBookedData({
      act_id: booked.act_id,
      booked_id: booked.booked_id,
      participant: booked.no_participant,
      date: booked.booked_date,
    });
  };

  // GET APPROVED BOOKING
  const getUserBooking = () => {
    axios
      .get(`${config.apiBaseUrl}backend/getUserBooking.php?id=${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        setBookingData(response.data);
        setLoading1(false);
      })
      .catch((error) => {
        setLoading1(false);
        console.log("Error fetching approved bookings: ", error);
      });
  };

  useEffect(() => {
    setLoading1(true);
    getUserBooking();
  }, [id]);

  // GET PENDING BOOKING
  useEffect(() => {
    setLoading2(true);
    axios
      .get(`${config.apiBaseUrl}backend/getUserPendingBooking.php?id=${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setPendingData(response.data);
        setLoading2(false);
      })
      .catch((error) => {
        setLoading2(false);
        console.log("Error fetching pending bookings: ", error);
      });
  }, [id]);

  // GET ARRIVED BOOKING
  useEffect(() => {
    setLoading3(true);
    axios
      .get(`${config.apiBaseUrl}backend/getUserArrivedBooking.php?id=${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setPreviousData(response.data);
        setLoading3(false);
      })
      .catch((error) => {
        setLoading3(false);
        console.log("Error fetching pending bookings: ", error);
      });
  }, [id]);

  const handleViewReservation = (booked_id) => {
    setShowViewReservation(true);
    axios
      .get(`${config.apiBaseUrl}backend/getViewReserved.php?id=${booked_id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setBookedViewData(response.data.reservationDetails);
      })
      .catch((error) => {
        console.log("error : ", error);
      });
  };

  const handleApprovedActive = () => {
    setApproved(true);
    setPending(false);
    setPrevious(false);
  };

  const handlePendingActive = () => {
    setApproved(false);
    setPending(true);
    setPrevious(false);
  };

  const handlePreviousActive = () => {
    setApproved(false);
    setPending(false);
    setPrevious(true);
  };

  //format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const dateBook = new Date(dateString);
    return dateBook.toLocaleDateString(undefined, options);
  };

  // Trigger modal with selected booking details
  const handleShowConfirmModal = (booked_id, name, booked_date, user_id) => {
    setSelectedBookingId(booked_id);
    setSelectedBookingDetails({ name, booked_date, user_id });
    setModalConfirm(true);
  };

  //cancel booking
  const handleCancelBooking = () => {
    const formdata = new FormData();
    formdata.append("booked_id", selectedBookingId);
    formdata.append("booked_date", selectedBookingDetails.booked_date);
    formdata.append("name", selectedBookingDetails.name);
    formdata.append("user_id", selectedBookingDetails.user_id);

    axios
      .post(`${config.apiBaseUrl}backend/cancelBooking.php`, formdata)
      .then((response) => {
        if (response.data.success) {
          setBookingData((prevBooking) =>
            prevBooking.filter(
              (booking) => booking.booked_id !== selectedBookingId
            )
          );

          setPendingData((prevPendingBooking) =>
            prevPendingBooking.filter(
              (pbooking) => pbooking.booked_id !== selectedBookingId
            )
          );

          setModalConfirm(false);

          const bookingData = {
            userId: selectedBookingDetails.user_id,
            act_name: selectedBookingDetails.name,
            booked_date: selectedBookingDetails.booked_date,
            updated_date: selectedBookingDetails.booked_date,

            content_: `New slot for ${
              selectedBookingDetails.name
            } is available on ${formatDate(
              selectedBookingDetails.booked_date
            )}.`,
            title_: `Reservation Slot for ${selectedBookingDetails.name}`,
          };

          axios
            .post(`${config.apiBaseUrl}backend/sendMails.php`, bookingData, {
              withCredentials: true,
            })
            .then((res) => {
              console.log("Emails sent successfully.");
              console.log("EMAILS :", res.data.emails);
              console.log(res.data);
            })
            .catch((error) => {
              console.log("Error : ", error);
            });
        } else {
          console.log(response.data.error);
        }
      })
      .catch((error) => {
        console.log("Error in request:", error);
      });
  };

  const year = new Date().getFullYear();

  return (
    <>
      <div className="mybooking">
        <div className="navbar-booking">
          <div className="buttons">
            <Link
              className={`button ${showApproved ? "active" : ""}`}
              onClick={handleApprovedActive}
            >
              Reserved
            </Link>
            {/* <Link
              className={`button ${showPending ? "active" : ""}`}
              onClick={handlePendingActive}
            >
              Pending
            </Link> */}
            <Link
              className={`button ${showPrevious ? "active" : ""}`}
              onClick={handlePreviousActive}
            >
              Previous
            </Link>
          </div>
        </div>
        <div className="mybooking-content">
          {showApproved && (
            <div className="approved-wrapper">
              <div className="approved">
                <div className="top">
                  <button
                    className="how-to-use"
                    onClick={() => setshowGuide(true)}
                  >
                    Read Reservation Process
                  </button>
                  {userBookingData.length > 0 && <span></span>}
                </div>

                <div className="content">
                  {loading1 ? (
                    <span className="loader">Please wait...</span>
                  ) : userBookingData.length > 0 ? (
                    userBookingData.map((booked) => (
                      <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ borderRadius: "0" }}
                        className="card"
                        key={booked.booked_id}
                      >
                        <div className="topp">
                          <span>Date booked : {booked.createdAt}</span>
                        </div>

                        <div className="card-left-right">
                          <div className="card-left">
                            <span>Activity name - {booked.name}</span>
                            <span>
                              Date scheduled - {formatDate(booked.booked_date)}
                            </span>
                            <span>Time scheduled - {booked.booked_times}</span>
                            <span>
                              Number of participant - {booked.no_participant}
                            </span>

                            <div
                              className="pricee"
                              style={{
                                border: "1px solid gray",
                                padding: "5px",
                                borderRadius: "6px",
                                display: "flex",
                                flexDirection: "column",
                                maxWidth: "fitContent",
                              }}
                            >
                              <span style={{ marginTop: "10px" }}>
                                Total price ------ ₱{" "}
                                {Math.round(
                                  Number(booked.total_price || 0)
                                ).toLocaleString(undefined, {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0,
                                })}
                                .00
                              </span>
                              <span>
                                Paid Fee -------- ₱{" "}
                                {Math.round(
                                  Number(booked.reservation_fee || 0)
                                ).toLocaleString(undefined, {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0,
                                })}
                                .00
                              </span>
                              <span>
                                Balance -------- ₱{" "}
                                {Math.round(
                                  Number(booked.total_price || 0) -
                                    Number(booked.reservation_fee || 0)
                                ).toLocaleString(undefined, {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0,
                                })}
                                .00
                              </span>
                            </div>
                          </div>

                          <div className="card-right">
                            {/* <Link
                            className="btn-update"
                            onClick={() => handleClickedToUpdate(booked)}
                            to={`/booknow/${booked.act_id}`}
                          >
                            Change schedule
                          </Link> */}
                            <button
                              className="btn-view"
                              onClick={() =>
                                handleViewReservation(booked.booked_id)
                              }
                            >
                              VIEW DETAILS
                            </button>

                            {/* <button
                              style={{ color: "#fff" }}
                              className="btn-cancel"
                              // onClick={() =>
                              //   handleShowConfirmModal(
                              //     booked.booked_id,
                              //     booked.name,
                              //     booked.booked_date,
                              //     booked.user_id
                              //   )
                              // }
                              onClick={() =>
                                selectedData_cancel(
                                  booked.booked_id,
                                  booked.name,
                                  booked.booked_date,
                                  booked.user_id,
                                  booked.email
                                )
                              }
                            >
                              CANCEL BOOKING
                            </button> */}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p>
                      {" "}
                      <i className="bi bi-list-columns"></i> No reservation yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {showPending && (
            <div className="pendingg-wrapper">
              <div className="pendingg">
                <div className="top">
                  {userPendingData.length > 0 && <span>Pending</span>}
                </div>

                <div className="content">
                  {loading2 ? (
                    <span className="loader">Please wait...</span>
                  ) : userPendingData.length > 0 ? (
                    userPendingData.map((booked) => (
                      <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ borderRadius: "0" }}
                        className="card"
                        key={booked.booked_id}
                      >
                        <div className="card-left">
                          <span>Activity name - {booked.name}</span>
                          <span>
                            Date scheduled -{formatDate(booked.booked_date)}
                          </span>
                          <span>
                            Time scheduled - {booked.booked_times} <br />{" "}
                          </span>

                          <span>
                            Number of participant -{booked.no_participant}
                          </span>
                          <span>Total price - Php {booked.total_price}</span>
                        </div>

                        <div className="card-right">
                          {/* <Link
                            className="btn-update"
                            onClick={() => handleClickedToUpdate(booked)}
                            to={`/booknow/${booked.act_id}`}
                          >
                            Change schedule
                          </Link> */}
                          <button
                            style={{ color: "#fff" }}
                            className="btn-cancel"
                            onClick={() =>
                              handleShowConfirmModal(
                                booked.booked_id,
                                booked.name,
                                booked.booked_date,
                                booked.user_id
                              )
                            }
                          >
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p>
                      {" "}
                      <i className="bi bi-list-columns"></i> No pending
                      reservation yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {showPrevious && (
            <div className="previous-wrapper">
              <div className="previous">
                <div className="top">
                  {userPreviousData.length > 0 && <span></span>}
                </div>

                <div className="content">
                  {loading3 ? (
                    <span className="loader">Please wait...</span>
                  ) : userPreviousData.length > 0 ? (
                    userPreviousData.map((booked) => (
                      <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ borderRadius: "0" }}
                        className="card"
                        key={booked.booked_id}
                      >
                        <div className="card-left">
                          <div className="wrapper-info">
                            Activity name -{booked.name}
                          </div>
                          <div className="wrapper-info">
                            Date scheduled -{formatDate(booked.booked_date)}
                          </div>
                          <span className="wrapper-info">
                            Time scheduled - {booked.booked_times}
                          </span>

                          <div className="wrapper-info">
                            Number of participant -{booked.no_participant}
                          </div>
                          <div className="wrapper-info">
                            Total price - Php {booked.total_price}
                          </div>
                        </div>

                        <div className="card-right">
                          {/* <button
                            className="btn-cancel"
                            onClick={() =>
                              handleShowConfirmModal(
                                booked.booked_id,
                                booked.name,
                                booked.booked_date,
                                booked.user_id
                              )
                            }
                          >
                            Cancel
                          </button> */}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p>
                      {" "}
                      <i className="bi bi-list-columns"></i> No pending
                      reservation yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="footerr">
            <div className="top">
              <span>Contact Us</span>
            </div>

            <div className="content">
              <div className="rightt">
                <span>📍 Location: Bulusan Sorsogon, Philippines</span>
                <span>📞 Phone: +63 960 505 0988</span>
                <span>📧 Email: bulusanlake4704@gmail.com</span>{" "}
              </div>

              <div className="left">
                <div className="title">
                  <h6>🌐 Follow Us</h6>
                </div>
                <a
                  href="https://web.facebook.com/bulusanlake/?_rdc=1&_rdr#"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <span>
                    <i
                      className="bi bi-facebook"
                      style={{ color: "blue", fontSize: "14px" }}
                    ></i>{" "}
                    Facebook
                  </span>
                </a>{" "}
                <br />
                <a
                  href="https://www.instagram.com/explore/locations/258605306/bulusan-lakebulusan-sorsogon/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <span>
                    <i
                      className="bi bi-instagram"
                      style={{ color: "orange", fontSize: "14px" }}
                    ></i>{" "}
                    Instagram
                  </span>
                </a>
              </div>
            </div>
            <div className="bot">
              <span>
                © {year} Bulusan Lake Explorer. All rights reserved. Developed
                by Ian Castillo
              </span>
            </div>
          </div>
        </div>
      </div>
      {showViewReservation && (
        <div className="modal-view">
          <div className="img-wrapper">
            <img src={bg} alt="" />

            <div className="overlay">
              <div className="info-wrapper">
                <div className="toppp">
                  <h6>
                    <p>Reservation ID : </p>
                    {bookedViewData && bookedViewData.booked_id}
                  </h6>

                  <span>
                    {" "}
                    Booked: {bookedViewData && bookedViewData.createdAt}
                  </span>
                </div>

                <span className="status">
                  {bookedViewData && bookedViewData.status}
                </span>

                <span className="tourist">
                  <p>Booked by :</p>
                  {bookedViewData && bookedViewData.fullname}
                </span>
                <span className="name">
                  {bookedViewData && bookedViewData.name}
                </span>
                <span className="booked_date">
                  {bookedViewData && formatDate(bookedViewData.booked_date)}
                </span>
                <div className="booked_timee">
                  {bookedViewData && bookedViewData.booked_times ? (
                    <div className="booked-times-column">
                      {bookedViewData.booked_times.map((time, index) => (
                        <div key={index} style={{ fontSize: "14px" }}>
                          {time}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span>No booked times available</span>
                  )}
                </div>

                <span className="no_participant">
                  All participant :{" "}
                  {bookedViewData && bookedViewData.no_participant}
                </span>
                <span className="price" style={{ marginTop: "20px" }}>
                  Total price ------ ₱{" "}
                  {bookedViewData &&
                    new Intl.NumberFormat("en-PH", {
                      minimumFractionDigits: 0, // Remove decimals
                      maximumFractionDigits: 0, // Remove decimals
                    }).format(Math.round(bookedViewData.total_price))}
                  .00
                </span>

                <span className="price">
                  Paid Fee -------- ₱{" "}
                  {bookedViewData &&
                    new Intl.NumberFormat("en-PH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(bookedViewData.reservation_fee)}
                </span>

                <span className="price" style={{ color: "yellow" }}>
                  Balance -------- ₱{" "}
                  {bookedViewData &&
                    new Intl.NumberFormat("en-PH", {
                      minimumFractionDigits: 0, // Remove decimals
                      maximumFractionDigits: 0, // Remove decimals
                    }).format(
                      Math.round(
                        bookedViewData.total_price -
                          bookedViewData.reservation_fee
                      )
                    )}
                  .00
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      {showViewReservation && (
        <div className="modal-view-overlay">
          <i
            className="bi bi-x"
            onClick={() => setShowViewReservation(false)}
          ></i>

          <span>Please take a screenshot</span>
        </div>
      )}
      {showModalConfirm && (
        <div className="cofirm-cancel-booking">
          <p className="top">
            Are you sure you wan't to cancel your reservation?
          </p>

          <div className="bot">
            <button
              className="btn-cancel-booking"
              onClick={handleCancelBooking}
            >
              Yes
            </button>
            <button
              className="btn-cancel"
              onClick={() => setModalConfirm(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {(showModalConfirm || showGuide) && (
        <div className="overlay-cancel-confirm"></div>
      )}
      {showGuide && (
        <div className="guide">
          <div className="top">
            <span>Reservation Process</span>
            <i className="bi bi-x-lg" onClick={() => setshowGuide(false)}></i>
          </div>

          <div className="content">
            <div className="one">
              <p>
                Welcome to BulusanLakeExplorer App! This guide will help you
                with what to do after you've made a reservation for one of our
                activities.
              </p>
            </div>

            <div className="two">
              <div className="t">Step-by-Step Guide</div>
              <p>
                Reservation Confirmation Screenshot: After making a reservation,
                you will receive a confirmation with your Reservation ID and
                other important details. Please take a screenshot of this
                confirmation, as it will serve as your proof of reservation upon
                arriving at Bulusan Lake.
              </p>
            </div>

            <div className="three">
              <div className="t">
                What to Do When You Arrive at Bulusan Lake
              </div>
              <div className="ps">
                <p className="p1">
                  Find the Staff in Charge: Look for the staff responsible for
                  handling reservations.
                </p>
                <div className="p2">
                  Show Your Screenshot: Show the staff your screenshot
                  containing the reservation details.
                </div>

                <div className="p3">
                  Make Your Payment: Once your reservation has been confirmed,
                  you will settle your balance directly at Bulusan Lake. The
                  total amount will be based on the reservation details you
                  received, including the number of participants.
                </div>

                <div className="p4">
                  Start Your Activity: After making the payment, the staff will
                  assign an assistant to guide you through your activity. The
                  assistant will help ensure that you have a safe and enjoyable
                  experience.
                </div>

                <div className="p5">
                  <div className="t">Important Reminders</div>

                  <div className="ps">
                    <p>
                      Ensure that your screenshot clearly shows all the
                      reservation details such as Reservation ID, Name, Date,
                      Activity, Participants, and Total Price.
                    </p>

                    <p>
                      You will not be able to participate in any activity
                      without presenting your reservation confirmation.
                    </p>

                    <p>
                      Payment must be made on-site after showing the screenshot.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showModalReason && (
        <div className="modal-reason">
          <div className="top">
            <i className="bi bi-pen-fill"></i>
            Cancel Reservation
          </div>

          <div className="suggestions">
            {/* <h5>Suggested Reasons:</h5> */}
            <ul>
              <li
                onClick={() =>
                  setCancelData({
                    ...cancelData,
                    reason: "Family Emergency",
                  })
                }
              >
                <i className="bi bi-circle-fill"></i> Family Emergency
              </li>
              <li
                onClick={() =>
                  setCancelData({
                    ...cancelData,
                    reason: "Transportation Problems",
                  })
                }
              >
                <i className="bi bi-circle-fill"></i> Transportation Problems
              </li>
              <li
                onClick={() =>
                  setCancelData({
                    ...cancelData,
                    reason: "Transportation Problems",
                  })
                }
              >
                <i className="bi bi-circle-fill"></i> Transportation Problems
              </li>
              <li
                onClick={() =>
                  setCancelData({
                    ...cancelData,
                    reason: "Personal Schedule Conflict",
                  })
                }
              >
                <i className="bi bi-circle-fill"></i> Personal Schedule Conflict
              </li>
              <li
                onClick={() =>
                  setCancelData({
                    ...cancelData,
                    reason: "Weather Conditions",
                  })
                }
              >
                <i className="bi bi-circle-fill"></i> Weather Conditions
              </li>
              <li
                onClick={() =>
                  setCancelData({
                    ...cancelData,
                    reason: "Health Issues",
                  })
                }
              >
                <i className="bi bi-circle-fill"></i> Health Issues
              </li>
              <li
                onClick={() =>
                  setCancelData({
                    ...cancelData,
                    reason: "Financial Reasons",
                  })
                }
              >
                <i className="bi bi-circle-fill"></i> Financial Reasons
              </li>
            </ul>
          </div>

          <div className="content">
            <textarea
              name="reason"
              onChange={(e) =>
                setCancelData({ ...declineData, reason: e.target.value })
              }
              value={cancelData.reason}
              placeholder="Please provide your reason for cancellation"
            ></textarea>
          </div>

          <div className="bot">
            <span className="btn-decline" onClick={handleSubmitCancel}>
              <i className="bi bi-send"></i>SEND AND CANCEL
            </span>

            <span
              className="btn-close"
              onClick={() => setShowModalReason(false)}
            >
              <i className="bi bi-x-circle"></i> CLOSE
            </span>
          </div>
        </div>
      )}
      {showModalReason && <div className="modaloverlay_reason"></div>}{" "}
    </>
  );
};

export default Mybooking;
