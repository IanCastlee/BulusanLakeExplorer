import "./pendingbook.scss";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sideba from "../components/sidebar/Sideba";
import config from "../../BaseURL";

const Pendingbook = () => {
  const [pendingBook, setPendingBook] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get(`${config.apiBaseUrl}backend/ADMIN_PHP/getPendingBook.php`)
      .then((response) => {
        setPendingBook(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log("Error on fetching  : ", error);
      });
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
  const handleConfirm = (booked_id) => {
    axios
      .post(`${config.apiBaseUrl}backend/ADMIN_PHP/updatePendingBooked.php`, {
        booked_id: booked_id,
      })
      .then((response) => {
        if (response.data.success) {
          setPendingBook((prevBookings) =>
            prevBookings.filter((booking) => booking.booked_id !== booked_id)
          );
        } else {
          console.log(response.data.error);
        }
      });

    console.log("first", booked_id);
  };

  return (
    <>
      <div className="user-active">
        <Sideba />
        <div className="user-content">
          <div className="top">
            <div className="left">
              <h6>Pending Booked</h6>

              <Link className="opp" to="/admin/booking/">
                <i className="bi bi-arrow-left-right"></i>
              </Link>
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
                        <td>{data.booked_date}</td>
                        <td>{data.no_participant}</td>
                        <td>{data.price}</td>
                        <td>{data.total_price}</td>
                        <td>
                          <button
                            className="confirm"
                            onClick={() => handleConfirm(data.booked_id)}
                          >
                            Confirm
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <h6>No Pending yet</h6>
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
    </>
  );
};

export default Pendingbook;
