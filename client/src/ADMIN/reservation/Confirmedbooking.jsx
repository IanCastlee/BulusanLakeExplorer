import "./confirm.scss";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sideba from "../components/sidebar/Sideba";
import config from "../../BaseURL";

const Confirmedbooking = () => {
  const [confirmBook, setConfirmBook] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const [clickedRow, setClickedRow] = useState(null);
  const [clickedRowArrived, setClickedRowArrived] = useState(null);
  const [clickedRowArrived2, setClickedRowArrived2] = useState(null);
  const [loader, setLoader] = useState(false);
  const [loader2, setLoader2] = useState(false);

  //getConfirmBook
  const getConfirmBook = () => {
    axios
      .get(`${config.apiBaseUrl}backend/ADMIN_PHP/getConfirmBook.php`, {
        withCredentials: true,
      })
      .then((response) => {
        setConfirmBook(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log("Error on fetching  : ", error);
      });
  };
  useEffect(() => {
    getConfirmBook();
  }, []);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  // Search
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const dateBook = new Date(dateString);
    return dateBook.toLocaleDateString(undefined, options);
  };

  // Filter the data based on the selected filter type
  const filteredConfirmData = confirmBook
    .filter((cbooking) => {
      const today = new Date().toISOString().split("T")[0]; // Get today's date in 'YYYY-MM-DD' format
      if (filterType === "today") {
        return cbooking.booked_date === today; // Only show today's records
      }
      return true; // Show all records when "All" is selected
    })
    .filter(
      (cbooking) =>
        String(cbooking.booked_id)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        String(cbooking.fullname)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        String(cbooking.address)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        String(cbooking.name)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        String(cbooking.booked_date)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        String(cbooking.no_participant)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        String(cbooking.price)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        String(cbooking.total_price)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );

  const totalPages = Math.ceil(filteredConfirmData.length / rowsPerPage);

  const handleArrived = (email2, booked_id, name, act_id, user_id) => {
    console.log("Email : ;", email2);

    setLoader(true);
    setClickedRowArrived(booked_id);

    const notifdata = new FormData();
    notifdata.append("email2", email2);
    notifdata.append("booked_id", booked_id);
    notifdata.append("booked_id2", booked_id);
    notifdata.append("act_id2", act_id);
    notifdata.append("userid2", user_id);
    notifdata.append("title2", "Share your Feedback");
    notifdata.append(
      "content2",
      `Thank you for joining us on our ${name} adventure! We hope you had a great time. Your feedback is incredibly valuable to us, and we would love to hear about your experience. It will help us improve and ensure that future activities are even more enjoyable. We look forward to your insights and hope to see you again soon for another exciting experience!`
    );

    axios
      .post(`${config.apiBaseUrl}backend/ADMIN_PHP/updateArrivedBooked.php`, {
        booked_id: booked_id,
        name: name,
      })
      .then((response) => {
        if (response.data.success) {
          setConfirmBook((prevBookings) =>
            prevBookings.filter((booking) => booking.booked_id !== booked_id)
          );
          setLoader(false);

          // Send email after successful booking update
          axios
            .post(
              `${config.apiBaseUrl}backend/ADMIN_PHP/sendMail_a2.php`,
              notifdata,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            )
            .then((resEmail) => {
              console.log("Email sent:- ", resEmail.data.message);
            })
            .catch((error) => {
              console.error(
                "Email error: ",
                error.response ? error.response.data : error.message
              );
            });
        } else {
          console.error("Update failed: ", response.data.error);
          setLoader(false);
        }
      })
      .catch((error) => {
        console.error(
          "Update error: ",
          error.response ? error.response.data : error.message
        );
        setLoader(false);
      });

    console.log("Booking ID processed: ", booked_id);
  };

  //handleUpdateNotArrived
  const handleUpdateNotArrived = (booked_id) => {
    setLoader2(true);
    setClickedRowArrived2(booked_id);

    const formData = new FormData();
    formData.append("booked_id", booked_id);

    axios
      .post(
        `${config.apiBaseUrl}backend/ADMIN_PHP/updateNotArrivedBooked_2.php`,
        formData,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.success) {
          setLoader2(false);
          getConfirmBook();
        } else {
          console.error("Update failed: ", response.data.error);
          setLoader2(false);
        }
      })
      .catch((error) => {
        console.error(
          "Update error: ",
          error.response ? error.response.data : error.message
        );
        setLoader(false);
      });
  };
  return (
    <>
      <div className="confirmed">
        <Sideba />
        <div className="user-content">
          <div className="top">
            <div className="left">
              <h6>Reserved</h6>

              <div className="buttons">
                {/* <Link className="button" to="/admin/pending/">
                  Pending
                </Link> */}
                <Link className="button" to="/admin/arrived/">
                  Arrived
                </Link>
              </div>
            </div>

            <div className="right2">
              <div className="buttons">
                <span onClick={() => setFilterType("today")}>Today</span>
                <span onClick={() => setFilterType("all")}>All</span>
              </div>

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
            {filteredConfirmData.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Fullname</th>
                    <th>Activity</th>
                    <th>Date Booked</th>
                    <th>Participant</th>
                    <th>Price</th>
                    <th>Totol Price</th>
                    <th>Res Fee/Paid</th>
                    <th>Balance to Pay</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredConfirmData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((data) => (
                      <tr
                        key={data.booked_id}
                        style={{
                          backgroundColor:
                            clickedRow === data.booked_id ? "gray" : "white",
                          cursor: "pointer",
                        }}
                        onClick={() => setClickedRow(data.booked_id)}
                      >
                        {" "}
                        <td
                          style={{
                            color: clickedRow === data.booked_id ? "#fff" : "",
                          }}
                        >
                          {data.booked_id}
                        </td>
                        <td
                          style={{
                            color: clickedRow === data.booked_id ? "#fff" : "",
                          }}
                        >
                          {data.fullname}
                        </td>
                        <td
                          style={{
                            color: clickedRow === data.booked_id ? "#fff" : "",
                          }}
                        >
                          {data.name}
                        </td>
                        <td
                          style={{
                            color: clickedRow === data.booked_id ? "#fff" : "",
                          }}
                        >
                          {formatDate(data.booked_date)}
                        </td>
                        <td
                          style={{
                            color: clickedRow === data.booked_id ? "#fff" : "",
                          }}
                        >
                          {data.no_participant}
                        </td>
                        <td
                          style={{
                            color: clickedRow === data.booked_id ? "#fff" : "",
                          }}
                        >
                          ₱ {Math.floor(data.price)}.00
                        </td>
                        <td
                          style={{
                            fontWeight: "500",
                            fontSize: "14px",
                            color: clickedRow === data.booked_id ? "#fff" : "",
                          }}
                        >
                          ₱ {Math.floor(data.total_price)}.00
                        </td>
                        <td
                          style={{
                            fontWeight: "500",
                            fontSize: "14px",
                            color:
                              clickedRow === data.booked_id ? "#fff" : "gray",
                          }}
                        >
                          ₱ {Math.floor(data.reservation_fee)}.00
                        </td>
                        <td
                          style={{
                            fontWeight: "500",
                            fontSize: "14px",
                            color:
                              clickedRow === data.booked_id ? "#fff" : "gray",
                          }}
                        >
                          ₱{" "}
                          {Math.floor(data.total_price - data.reservation_fee)}
                          .00
                        </td>
                        <td
                          style={{
                            color:
                              clickedRow === data.booked_id ? "#fff" : "gray",
                          }}
                        >
                          <button
                            style={{
                              backgroundColor: "green",
                              color: "#fff",
                              border: "none",
                              borderRadius: "3px",
                              cursor: "pointer",
                              fontSize: "12px",
                              padding: "3px 6px",
                              marginLeft: "5px",
                            }}
                            onClick={() =>
                              handleArrived(
                                data.email,
                                data.booked_id,
                                data.name,
                                data.act_id,
                                data.user_id
                              )
                            }
                          >
                            {loader
                              ? `${
                                  clickedRowArrived == data.booked_id
                                    ? "Please wait.."
                                    : "Arrived"
                                }`
                              : "Arrived"}
                          </button>

                          <button
                            style={{
                              backgroundColor: "gray",
                              color: "#fff",
                              border: "none",
                              borderRadius: "3px",
                              cursor: "pointer",
                              fontSize: "12px",
                              padding: "3px 6px",
                              marginLeft: "8px",
                            }}
                            onClick={() =>
                              handleUpdateNotArrived(data.booked_id)
                            }
                          >
                            {loader2
                              ? `${
                                  clickedRowArrived2 == data.booked_id
                                    ? "Please wait.."
                                    : "Not Arrived"
                                }`
                              : "Not Arrived"}{" "}
                          </button>

                          <Link
                            to={`/admin/active-user/${data.user_id}`}
                            style={{
                              backgroundColor: "blue",
                              color: "#fff",
                              border: "none",
                              borderRadius: "3px",
                              cursor: "pointer",
                              fontSize: "12px",
                              padding: "3px 6px",
                              marginLeft: "5px",
                            }}
                          >
                            Go to User
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <p>No results found</p>
            )}
          </div>

          <div className="pagination">
            <button
              style={{
                backgroundColor: "green",
                fontSize: "12px",
                color: "#fff",
                padding: "1px 10px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              disabled={page === 0}
              onClick={() => handleChangePage(page - 1)}
            >
              Previous
            </button>
            <span>{`Page ${page + 1} of ${totalPages}`}</span>
            <button
              style={{
                backgroundColor: "green",
                fontSize: "12px",
                color: "#fff",
                padding: "1px 10px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              disabled={page + 1 === totalPages}
              onClick={() => handleChangePage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Confirmedbooking;
