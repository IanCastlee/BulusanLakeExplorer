import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Sideba from "../components/sidebar/Sideba";
import config from "../../BaseURL";
import "./report.scss";

const Report = () => {
  const [reportData, setReportData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // const handleGoToUser = (userId) => {
  //   navigate(`/admin/active-user/${userId}`);
  // };

  // const handleGoToPost = (postId, user_id) => {
  //   navigate(`/admin/posts/${postId}/${user_id}`);
  // };

  useEffect(() => {
    axios
      .get(`${config.apiBaseUrl}backend/ADMIN_PHP/getReports.php`)
      .then((response) => {
        setReportData(response.data);
        console.log("Reports : ", response.data);
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

  // Search
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Ensure reportData is defined before filtering
  const filteredReportData = reportData
    ? reportData.filter(
        (report) =>
          String(report.reporter_id)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          String(report.reported_id)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          String(report.post_id)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          String(report.reason).toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const totalPages = Math.ceil(filteredReportData.length / rowsPerPage);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const dateBook = new Date(dateString);
    return dateBook.toLocaleDateString(undefined, options);
  };

  return (
    <>
      <div className="arrived">
        <Sideba />
        <div className="user-content">
          <div className="top">
            <div className="left">
              <h6>Reports</h6>
              <div className="buttons">
                {/* <Link className="button" to="/admin/pending/">
                  Pending
                </Link>
                <Link className="button" to="/admin/booking/">
                  Confirmed
                </Link> */}
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
            {filteredReportData.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Reporter User ID</th>
                    <th>Reported User ID</th>
                    <th>Reported Post ID</th>
                    <th>Reason</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReportData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((data) => (
                      <tr key={data.report_id}>
                        <td>{data.reporter_id}</td>
                        <td>{data.reported_id}</td>
                        <td>{data.post_id}</td>
                        <td
                          style={{
                            maxWidth: "520px",
                            wordWrap: "break-word",
                            whiteSpace: "normal",
                            textAlign: "start",
                          }}
                        >
                          {data.reason}
                        </td>

                        <td>
                          <Link
                            to={`/admin/posts/${data.post_id}/${data.reported_id}`}
                            style={{
                              fontSize: "12px",
                              backgroundColor: "blue",
                              padding: "2px 4px",
                              borderRadius: "2px",
                              cursor: "pointer",
                              border: "none",
                              color: "#fff",
                              fontWeight: "500px",
                            }}
                          >
                            Go to Post
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <p>No data available</p>
            )}
            {filteredReportData.length > 0 && (
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
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Report;
