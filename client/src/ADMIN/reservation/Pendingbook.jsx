import "./pendingbook.scss";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sideba from "../components/sidebar/Sideba";
import config from "../../BaseURL";
import pp from "../../assets/user (8).png";

const Pendingbook = () => {
  const [pendingBook, setPendingBook] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const [showModalReason, setShowModalReason] = useState(false);

  const [showModalView, setShowModalView] = useState(false);
  const [showModalViewImage, setShowModalViewImage] = useState(false);
  const [modalViewImage, setModalViewImage] = useState("");
  const [selectedRowData, setSelectedRowData] = useState({
    fullname: "",
    address: "",
    name: "",
    booked_date: "",
    no_participant: "",
    price: "",
    total_price: "",
    profilePic: "",
    booked_times: [],
    valid_id_image: "",

    user_id: "",
    booked_id: "",
    email: "",
  });

  const selected_row_data = (
    fullname,
    address,
    name,
    booked_date,
    no_participant,
    price,
    total_price,
    profilePic,
    booked_times,
    valid_id_image,
    user_id,
    booked_id,
    email
  ) => {
    setSelectedRowData({
      fullname: fullname,
      address: address,
      name: name,
      booked_date: booked_date,
      no_participant: no_participant,
      price: price,
      total_price: total_price,
      profilePic: profilePic,
      booked_times: booked_times,
      valid_id_image: valid_id_image,

      user_id: user_id,
      booked_id: booked_id,
      email: email,
    });

    setShowModalView(true);
  };

  const [declineData, setDeclineData] = useState({
    user_id: "",
    booking_id: "",
    email: "",
    date: "",
    time: "",
    name: "",
    reason: "",
  });

  const selectedData_decline = (
    user_id,
    booking_id,
    email,
    date,
    time,
    name
  ) => {
    setShowModalReason(true);
    setDeclineData((prevData) => ({
      ...prevData,
      user_id: user_id,
      booking_id: booking_id,
      email: email,
      date: date,
      time: time,
      name: name,
    }));
  };

  // console.log("user_id", declineData.user_id);
  // console.log("booking_id", declineData.booking_id);
  // console.log("email", declineData.email);
  // console.log("date", declineData.date);
  // console.log("time", declineData.time);
  // console.log("name", declineData.name);

  //handleSubmitDecline
  const handleSubmitDecline = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("user_id", declineData.user_id);
    formData.append("booking_id", declineData.booking_id);
    formData.append("email", declineData.email);
    formData.append("date", declineData.date);
    formData.append("time", declineData.time);
    formData.append("name", declineData.name);
    formData.append("reason", declineData.reason);
    formData.append("title", "Declined Reservation");
    formData.append(
      "content",
      `We regret to inform you that your reservation for ${declineData.name} on ${declineData.date} at ${declineData.time} has been declined due to the following reason: (${declineData.reason}).<br/><br/>
We apologize for any inconvenience this may cause. If you would like to reserve again, just click the button below.<br/><br/>
Thank you for your understanding, and we hope to assist you with your future reservations.<br/><br/>`
    );

    axios
      .post(
        `${config.apiBaseUrl}backend/ADMIN_PHP/postDeclinebooking.php`,
        formData,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.success) {
          console.log("True :", response.data);
          getPending();

          axios
            .post(
              `${config.apiBaseUrl}backend/ADMIN_PHP/sendMail_a.php`,
              formData,
              {
                withCredentials: true,
              }
            )
            .then((resEmail) => {
              console.log("Email sent : ", resEmail.data.message);
            })
            .catch((error) => {
              console.log("Error : ", error);
            });
          setShowModalReason(false);
          setShowModalView(false);
          setDeclineData = useState({
            user_id: "",
            booking_id: "",
            email: "",
            date: "",
            time: "",
            name: "",
            reason: "",
          });
        } else {
          console.log("False: ", response.data);
        }
      })
      .catch((error) => {
        console.log("Error :", error);
      });
  };

  //getPending
  const getPending = () => {
    axios
      .get(`${config.apiBaseUrl}backend/ADMIN_PHP/getPendingBook.php`)
      .then((response) => {
        setPendingBook(response.data);
        console.log("Pending :", response.data);
      })
      .catch((error) => {
        console.log("Error on fetching  : ", error);
      });
  };

  useEffect(() => {
    getPending();
  }, []);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  //search
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPendingData = pendingBook.filter(
    (pbook) =>
      String(pbook.booked_id)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(pbook.fullname).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(pbook.address).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(pbook.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(pbook.booked_date)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(pbook.no_participant)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(pbook.price).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(pbook.total_price).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(pendingBook.length / rowsPerPage);

  //confirm pending
  const handleConfirm = (
    booked_id,
    userID,
    email,
    actName,
    participant,
    totalPrice
  ) => {
    const notifdata = new FormData();
    notifdata.append("booked_id", booked_id);
    notifdata.append("userID", userID);
    notifdata.append("email", email);
    notifdata.append("title", "Reservation Approval");
    notifdata.append(
      "body",
      `Your reservation for ${actName} has been approved.`
    );
    notifdata.append(
      "content",
      `Your reservation for ${actName} has been approved. <br/> <br/>
      ${
        actName === "Balsa"
          ? ""
          : `Number of participants: ${participant} <br/>`
      }
      Total price: Php ${totalPrice}. <br/> <br/>
      Please make sure to take a screenshot of your reservation details, as this will serve as proof of your booking. <br/><br/>
      Thank you! 😊 😊 😊`
    );

    axios
      .post(
        `${config.apiBaseUrl}backend/ADMIN_PHP/updatePendingBooked.php`,
        notifdata,
        { withCredentials: true }
      )
      .then((response) => {
        if (response.data.success) {
          setPendingBook((prevBooking) =>
            prevBooking.filter((booking) => booking.booked_id !== booked_id)
          );

          axios
            .post(
              `${config.apiBaseUrl}backend/ADMIN_PHP/sendMail_a.php`,
              notifdata,
              {
                withCredentials: true,
              }
            )
            .then((resEmail) => {
              console.log("Email sent : ", resEmail.data.message);
            })
            .catch((error) => {
              console.log("Error : ", error);
            });
        } else {
          console.log("ERROR :", response.data.error);
        }
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  };

  //format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const dateBook = new Date(dateString);
    return dateBook.toLocaleDateString(undefined, options);
  };

  return (
    <>
      <div className="pending">
        <Sideba />
        <div className="user-content">
          <div className="top">
            <div className="left">
              <h6>Pending</h6>

              <div className="buttons">
                <Link className="button" to="/admin/booking/">
                  Confirmed
                </Link>
                <Link className="button" to="/admin/arrived/">
                  Arrived
                </Link>
              </div>
            </div>

            <div className="right2">
              <div className="search">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />{" "}
                <i className="bi bi-search"></i>
              </div>
            </div>
          </div>
          <div className="active">
            {pendingBook.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Fullname</th>
                    <th>Address</th>
                    <th>Activity</th>
                    <th>Date Booked</th>
                    <th>Participant</th>
                    <th>Price</th>
                    <th>Totol Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPendingData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((data) => (
                      <tr key={data.booked_id}>
                        <td>{data.booked_id}</td>
                        <td>{data.fullname}</td>
                        <td>{data.address}</td>
                        <td>{data.name}</td>
                        <td>{formatDate(data.booked_date)}</td>
                        <td>{data.no_participant}</td>
                        <td>{data.price}</td>
                        <td>{data.total_price}</td>
                        <td
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            justifyContent: "center",
                          }}
                        >
                          <button
                            style={{
                              backgroundColor: "red",
                              color: "#fff",
                              border: "none",
                              borderRadius: "3px",
                              cursor: "pointer",
                              fontSize: "12px",
                              padding: "3px 6px",
                            }}
                            onClick={() =>
                              selectedData_decline(
                                data.user_id,
                                data.booked_id,
                                data.email,
                                data.booked_date,
                                data.booked_times,
                                data.name
                              )
                            }
                          >
                            Decline
                          </button>
                          <button
                            style={{
                              backgroundColor: "blue",
                              color: "#fff",
                              border: "none",
                              borderRadius: "3px",
                              cursor: "pointer",
                              fontSize: "12px",
                              padding: "3px 6px",
                            }}
                            className="confirm"
                            onClick={() =>
                              handleConfirm(
                                data.booked_id,
                                data.user_id,
                                data.email,
                                data.name,
                                data.no_participant,
                                data.total_price
                              )
                            }
                          >
                            Confirm
                          </button>

                          <button
                            style={{
                              backgroundColor: "green",
                              color: "#fff",
                              border: "none",
                              borderRadius: "3px",
                              cursor: "pointer",
                              fontSize: "12px",
                              padding: "3px 6px",
                            }}
                            className="confirm"
                            onClick={() =>
                              selected_row_data(
                                data.fullname,
                                data.address,
                                data.name,
                                data.booked_date,
                                data.no_participant,
                                data.price,
                                data.total_price,
                                data.profilePic,
                                data.booked_times,
                                data.valid_id_image,

                                data.user_id,
                                data.booked_id,
                                data.email
                              )
                            }
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              // <tr>
              //   <td colSpan="5" style={{ textAlign: "center" }}>
              //     No data available
              //   </td>
              // </tr>
              <p>No data available</p>
            )}
            {pendingBook.length > 0 ? (
              <div className="pagination">
                <button
                  onClick={() => handleChangePage(page - 1)}
                  disabled={page === 0}
                >
                  Previous
                </button>
                <span>
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  onClick={() => handleChangePage(page + 1)}
                  disabled={page >= totalPages - 1}
                >
                  Next
                </button>
                <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      {showModalReason && (
        <div
          className="modal-reason"
          style={{ backgroundColor: "#000", width: "495px" }}
        >
          <div className="top">
            <i className="bi bi-pen-fill"></i>
            Decline Reservation
          </div>

          <div className="suggestions">
            {/* <h5>Suggested Reasons:</h5> */}
            <ul>
              <li
                onClick={() =>
                  setDeclineData({
                    ...declineData,
                    reason: "Not using valid ID",
                  })
                }
              >
                <i className="bi bi-caret-right-fill"></i> Not using valid ID
              </li>
              <li
                onClick={() =>
                  setDeclineData({
                    ...declineData,
                    reason: "Information not matching valid ID information",
                  })
                }
              >
                <i className="bi bi-caret-right-fill"></i> Information not
                matching valid ID information
              </li>

              {/* Add more suggestions as needed */}
            </ul>
          </div>

          <div className="content">
            <textarea
              name="reason"
              onChange={(e) =>
                setDeclineData({ ...declineData, reason: e.target.value })
              }
              value={declineData.reason}
              placeholder="write your reason for declining"
            ></textarea>
          </div>

          <div className="bot">
            <span className="btn-decline" onClick={handleSubmitDecline}>
              <i className="bi bi-send"></i>SEND AND DECLINE
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
      {showModalView && (
        <div className="view-alldata">
          <div className="top">
            <span>Pending Reservation</span>

            <i
              className="bi bi-x-square-fill"
              onClick={() => setShowModalView(false)}
            ></i>
          </div>

          <div className="content">
            <div className="e">
              <div className="profilePic">
                <span>User Profile Picture</span>
                <img
                  src={
                    selectedRowData.profilePic
                      ? `${config.apiBaseUrl}backend/uploads/${selectedRowData.profilePic}`
                      : pp
                  }
                  alt=""
                  onClick={() => {
                    setModalViewImage(selectedRowData.profilePic);
                    setShowModalViewImage(true);
                  }}
                />
              </div>

              <div className="valid_id">
                <span>Valid ID</span>

                {selectedRowData.valid_id_image !== "" ? (
                  <img
                    src={`${config.apiBaseUrl}backend/uploads/${selectedRowData.valid_id_image}`}
                    alt=""
                  />
                ) : (
                  <p>No Valid ID</p>
                )}
              </div>
            </div>

            <div className="f">
              <span>Booked By : {selectedRowData.fullname}</span>
              <span>Address : {selectedRowData.address}</span>
            </div>

            <div className="s">
              <span>Activity Name : {selectedRowData.name}</span>
              <span>Booked Date : {selectedRowData.booked_date}</span>
              <span className="booked_date">
                {selectedRowData && selectedRowData.booked_times ? (
                  <div className="booked-times-column">
                    {selectedRowData.booked_times.map((time, index) => (
                      <div key={index} style={{ fontSize: "14px" }}>
                        {time}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span>No booked times available</span>
                )}
              </span>
              <span>
                Number of Participant : {selectedRowData.no_participant}
              </span>
              <span>Activity Price : {selectedRowData.price}</span>
              <span>Total Price : {selectedRowData.total_price}</span>
            </div>

            <div className="b">
              <button className="btn-approved">Approved</button>
              <button
                className="btn-decline"
                onClick={() =>
                  selectedData_decline(
                    selectedRowData.user_id,
                    selectedRowData.booked_id,
                    selectedRowData.email,
                    selectedRowData.booked_date,
                    selectedRowData.booked_times,
                    selectedRowData.name
                  )
                }
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
      {showModalView && (
        <div
          onClick={() => {
            setShowModalViewImage(false);
          }}
          className="view-alldata-overlay"
        ></div>
      )}{" "}
    </>
  );
};

export default Pendingbook;
