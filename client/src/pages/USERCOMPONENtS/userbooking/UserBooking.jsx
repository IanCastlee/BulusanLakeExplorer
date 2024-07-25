import React, { useEffect, useState } from "react";
import "./userbooking.scss";

import nodatabg from "../../../assets/paper (2).png";

import Sidebar from "../../../components/sidebar/Sidebar";
import axios from "axios";
import { useParams } from "react-router-dom";
import config from "../../../BaseURL";

const UserBooking = ({ showSidebar2, setSidebar }) => {
  const { id } = useParams();

  const [userBookingData, setBookingData] = useState([]);
  const [userPendingData, setPendingData] = useState([]);
  const [totalApprovedPrice, setTotalApprovedPrice] = useState(0);
  const [showModalConfirm, setModalConfirm] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(false);

  // GET APPROVED BOOKING
  useEffect(() => {
    axios
      .get(`${config.apiBaseUrl}backend/getUserBooking.php?id=${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setBookingData(response.data);
        console.log("Approved bookings: ", response.data);
      })
      .catch((error) => {
        console.log("Error fetching approved bookings: ", error);
      });
  }, [id]);

  // GET PENDING BOOKING
  useEffect(() => {
    axios
      .get(`${config.apiBaseUrl}backend/getUserPendingBooking.php?id=${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setPendingData(response.data);
        console.log("Pending bookings: ", response.data);
      })
      .catch((error) => {
        console.log("Error fetching pending bookings: ", error);
      });
  }, [id]);

  // Calculate total approved price whenever userBookingData changes
  useEffect(() => {
    if (userBookingData.length > 0) {
      const totalPrice = userBookingData.reduce((total, bookingData) => {
        return total + parseFloat(bookingData.total_price);
      }, 0);
      setTotalApprovedPrice(totalPrice);
    } else {
      setTotalApprovedPrice(0);
    }
  }, [userBookingData]);

  const redirectBooking = (e) => {
    e.preventDefault();
    window.location.href = "/";
  };

  //cancel booking

  const handleCancelBooking = (booked_id) => {
    axios
      .post(`${config.apiBaseUrl}backend/cancelBooking.php`, {
        booked_id: booked_id,
      })
      .then((response) => {
        if (response.data.success) {
          setBookingData((prevBooking) =>
            prevBooking.filter((booking) => booking.booked_id !== booked_id)
          );

          setPendingData((prevPendingBooking) =>
            prevPendingBooking.filter(
              (pbooking) => pbooking.booked_id !== booked_id
            )
          );

          setModalConfirm(false);
        } else {
          console.log(response.data.error);
        }
      });
  };

  return (
    <>
      <div className="index">
        <Sidebar showSidebar2={showSidebar2} setSidebar={setSidebar} />

        <div className="index-content2">
          {userBookingData.length != 0 && userPendingData != 0 && (
            <div className="title">
              <span>My Booking</span>
            </div>
          )}
          <div className="approved">
            {userBookingData.length > 0 ? <h6>Approved</h6> : ""}
            {userBookingData.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Booked Date</th>
                    <th>Activity</th>
                    <th>Participants</th>
                    <th>Total Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {userBookingData.map((bookingData) => (
                    <tr key={bookingData.booked_id}>
                      <td>{bookingData.booked_date}</td>
                      <td>{bookingData.name}</td>
                      <td>{bookingData.no_participant}</td>
                      <td>{bookingData.total_price}</td>
                      <td>
                        <i
                          className="bi bi-x-lg"
                          style={{ color: "red", cursor: "pointer" }}
                          onClick={() => {
                            setSelectedBookingId(pendingBookingData.booked_id);
                            setModalConfirm(true);
                          }}
                        ></i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              ""
            )}
          </div>

          {userBookingData.length > 0 ? (
            <div className="computation-wrapper">
              <h6>Expected Expenses</h6>
              {userBookingData
                ? userBookingData.map((booking) => (
                    <div className="card" key={booking.booked_id}>
                      <div className="act-wrapper">
                        <span>{booking.name} </span>
                        <span className="a_price">₱ {booking.total_price}</span>
                      </div>
                    </div>
                  ))
                : ""}
              <hr />
              <span className="total-price">
                <span>Total</span>
                <span>₱ {totalApprovedPrice}.00</span>
              </span>
            </div>
          ) : (
            ""
          )}

          <div className="pending">
            {userPendingData.length > 0 ? <h6>Pending</h6> : ""}

            {userPendingData.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Booked Date</th>
                    <th>Activity</th>
                    <th>Participants</th>
                    <th>Total Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {userPendingData.map((pendingBookingData) => (
                    <tr key={pendingBookingData.booked_id}>
                      <td>{pendingBookingData.booked_date}</td>
                      <td>{pendingBookingData.name}</td>
                      <td>{pendingBookingData.no_participant}</td>
                      <td>{pendingBookingData.total_price}</td>
                      <td>
                        <i
                          className="bi bi-x-lg"
                          style={{ color: "red", cursor: "pointer" }}
                          onClick={() => {
                            setSelectedBookingId(pendingBookingData.booked_id);
                            setModalConfirm(true);
                          }}
                        ></i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              ""
            )}
          </div>
          {userBookingData.length === 0 && userPendingData.length === 0 && (
            <div className="no-booking">
              <span>NO BOOKING YET</span>
              <img src={nodatabg} alt="" />
              {/* <button onClick={redirectBooking}>Book Now</button> */}
            </div>
          )}
        </div>
      </div>

      {showModalConfirm && selectedBookingId && (
        <div className="cofirm-cancel-booking">
          <p className="top">Are you sure you wan't to cancel this booking?</p>

          <div className="bot">
            <button
              className="btn-cancel-booking"
              onClick={() => handleCancelBooking(selectedBookingId)}
            >
              Cancel Booking
            </button>
            <button
              className="btn-cancel"
              onClick={() => setModalConfirm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserBooking;
