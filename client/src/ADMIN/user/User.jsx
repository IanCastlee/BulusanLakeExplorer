import "./user.scss";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sideba from "../components/sidebar/Sideba";
import config from "../../BaseURL";

const User = () => {
  const [userdata, setUserData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get(`${config.apiBaseUrl}backend/getActiveUsers.php`)
      .then((response) => {
        setUserData(response.data);
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

  const filteredUserData = userdata.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(userdata.length / rowsPerPage);

  return (
    <>
      <div className="user-active">
        <Sideba />
        <div className="user-content">
          <div className="top">
            <div className="left">
              <h6>Active Users</h6>

              <Link className="opp" to="/admin/not-active-user/">
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
            {userdata.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Fullname</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUserData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((data) => (
                      <tr key={data.user_id}>
                        <td>{data.username}</td>
                        <td>{data.fullname}</td>
                        <td>{data.email}</td>
                        <td>{data.address}</td>
                        <td>
                          <button className="btn-ban">Delete</button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <h6>No Data yet</h6>
            )}
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
          </div>
        </div>
      </div>
    </>
  );
};

export default User;
