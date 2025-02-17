import "./notact.scss";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sideba from "../components/sidebar/Sideba";
import config from "../../BaseURL";

const Notactiveact = () => {
  const [activityData, setActivityData] = useState([]);
  const [showAddAct, setAddAct] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get(`${config.apiBaseUrl}backend/ADMIN_PHP/getNotactiveAct.php`)
      .then((response) => {
        setActivityData(response.data);
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

  const filteredActivityData = activityData.filter(
    (activity) =>
      activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.price.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.duration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.image.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(activityData.length / rowsPerPage);

  //handleSetAsActive
  const handleSetAsActive = (act_id) => {
    const formData = new FormData();
    formData.append("act_id", act_id);

    axios
      .post(
        `${config.apiBaseUrl}backend/ADMIN_PHP/updateActivityStatusA.php`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          setActivityData((prevData) =>
            prevData.filter((act) => act.act_id !== act_id)
          );
        } else {
          console.log(response.data.error);
        }
      });
  };

  return (
    <>
      <div className="nactivity">
        <Sideba />
        <div className="activity-content">
          <div className="top">
            <div className="left">
              <h6>Not active activities</h6>

              <Link className="opp" to="/admin/activity/">
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
          <div className="content">
            <table>
              <thead>
                <tr>
                  <th>Act Name</th>
                  <th>Price</th>
                  <th>Duration</th>
                  <th>Image</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivityData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((data) => (
                    <tr key={data.act_id}>
                      <td>{data.name}</td>
                      <td>{data.price}</td>
                      <td>{data.duration}</td>
                      <td>
                        <img
                          style={{ height: "50px", width: "50px" }}
                          src={`${config.apiBaseUrl}backend/ADMIN_PHP/uploads/${data.image}`}
                          alt=""
                        />
                      </td>
                      <td
                        style={{
                          whiteSpace: "nowrap",
                          padding: "15px",
                          width: "10px",
                        }}
                      >
                        <button
                          style={{ backgroundColor: "green" }}
                          className="btn-ban"
                          onClick={() => handleSetAsActive(data.act_id)}
                        >
                          ACTIVE
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
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
      {showAddAct && <Addactivity closeAddact={() => setAddAct(false)} />}
    </>
  );
};

export default Notactiveact;
