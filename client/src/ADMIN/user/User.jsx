import "./user.scss";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Sideba from "../components/sidebar/Sideba";
import config from "../../BaseURL";

const User = () => {
  const { id } = useParams();
  console.log("ID : ", id);
  const [userdata, setUserData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState(id === "0" ? "" : id); // Default search term is 'id' unless 'id' is 0

  const [showModalAsk, setshowModalAsk] = useState(false);
  const [selecetdUserData, setselecetdUserData] = useState({
    user_id: " ",
    username: "",
  });

  const selecetdUser = (user_id, username) => {
    setshowModalAsk(true);
    setselecetdUserData((prev) => ({
      ...prev,
      user_id: user_id,
      username: username,
    }));
  };

  const getActiveUsers = () => {
    axios
      .get(`${config.apiBaseUrl}backend/ADMIN_PHP/getActiveUsers.php`)
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.log("Error on fetching  : ", error);
      });
  };

  useEffect(() => {
    getActiveUsers();
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
      String(user.user_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(userdata.length / rowsPerPage);

  //handleRemoveUser
  const handleRemoveUser = (user_id) => {
    axios
      .post(`${config.apiBaseUrl}backend/ADMIN_PHP/updateUserStatusNA.php`, {
        user_id: selecetdUserData.user_id,
      })
      .then((response) => {
        getActiveUsers();
        if (response.data.success) {
          setselecetdUserData({
            user_id: "",
            username: "",
          });
          setshowModalAsk(false);
        } else {
          console.log(response.data.error);
        }
      });
  };

  return (
    <>
      <div className="uactive">
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
                    <th>ID</th>
                    <th>Username</th>
                    <th>Fullname</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUserData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((data) => (
                      <tr key={data.user_id}>
                        <td style={{ fontWeight: "700" }}>{data.user_id}</td>
                        <td>{data.username}</td>
                        <td>{data.fullname}</td>
                        <td>{data.email}</td>
                        <td>{data.address}</td>
                        <td>{(data.verify_status = 1 ? "Verified" : "")}</td>
                        <td>
                          <button
                            className="btn-ban"
                            onClick={() =>
                              selecetdUser(data.user_id, data.username)
                            }
                          >
                            Set AS Not Active
                          </button>
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

      {showModalAsk && (
        <div className="ask-modal">
          <p>
            Are you sure you want to set{" "}
            <span style={{ color: "blue" }}> {selecetdUserData.username}</span>{" "}
            as not active ?{" "}
          </p>

          <div className="bot">
            <button className="btn-del" onClick={handleRemoveUser}>
              Set As Not Active
            </button>
            <button
              className="btn-cancel"
              onClick={() => setshowModalAsk(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showModalAsk && <div className="ask-modal-overlay"></div>}
    </>
  );
};

export default User;
