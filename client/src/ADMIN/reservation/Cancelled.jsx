import "./cancelled.scss";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sideba from "../components/sidebar/Sideba";
import config from "../../BaseURL";

const Cancelled = () => {
  const [canceled, setCanceled] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get(`${config.apiBaseUrl}backend/ADMIN_PHP/getCancelledBook.php`)
      .then((response) => {
        setCanceled(response.data);
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

  const filteredCanceledData = canceled.filter(
    (cbook) =>
      String(cbook.fullname).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(cbook.address).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(cbook.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(cbook.booked_date)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(cbook.no_participant)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(cbook.price).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(cbook.total_price).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(canceled.length / rowsPerPage);

  return (
    <>
      <div className="user-active">
        <Sideba />
        <div className="user-content">
          <div className="top">
            <div className="left">
              <h6>Canceled Booked</h6>
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
            {canceled.length > 0 ? (
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
                  {filteredCanceledData
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
                            Canceled
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <h6>No Pending yet</h6>
            )}
            {canceled.length > 0 ? (
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

export default Cancelled;
