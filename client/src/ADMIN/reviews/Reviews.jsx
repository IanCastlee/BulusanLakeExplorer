import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Sideba from "../components/sidebar/Sideba";
import config from "../../BaseURL";
import "./review.scss";

const Reviews = () => {
  const [reportData, setReportData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const [showModalDelete, setShowModalDelete] = useState(false);
  const [deleteReview_id, setDeleteReview_id] = useState(null);
  const [showdelModalMsg, setShowModaldelMsg] = useState(null);
  const [delMsg, setdelMsg] = useState(null);

  const [loader, setLoader] = useState(false);

  const selectedReviewId = (review_id) => {
    setDeleteReview_id(review_id);
    setShowModalDelete(true);
  };

  //getReview
  const getReview = () => {
    axios
      //.get(`${config.apiBaseUrl}backend/ADMIN_PHP/getReview.php`)
      .get(
        `https://bulusanlakeexplorer.kesug.com/backend/ADMIN_PHP/getReview.php`
      )
      .then((response) => {
        setReportData(response.data);
        console.log("reviews : ", response.data);
      })
      .catch((error) => {
        console.log("Error on fetching  : ", error);
      });
  };

  useEffect(() => {
    getReview();
  }, []);

  //handleDete
  const handleDete = () => {
    setLoader(true);

    const data_id = new FormData();
    data_id.append("review_id", deleteReview_id);

    axios
      .post(
        //`${config.apiBaseUrl}/backend/ADMIN_PHP/deleteReview.php`,
        `https://bulusanlakeexplorer.kesug.com/backend/ADMIN_PHP/deleteReview.php`,
        data_id,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response) {
          setLoader(false);

          setdelMsg(response.data.message);
          setShowModaldelMsg(true);
          setTimeout(() => {
            setShowModaldelMsg(false);
          }, 3000);

          getReview();
          setShowModalDelete(false);
          console.log("True_", response.data);
        } else {
          console.log("False_", response.data);
          setLoader(false);
        }
      })
      .catch((error) => {
        console.log("Error : ", error);
      });
  };

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
          String(report.name)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          String(report.raview)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          String(report.rating).toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const totalPages = Math.ceil(filteredReportData.length / rowsPerPage);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const dateBook = new Date(dateString);
    return dateBook.toLocaleDateString(undefined, options);
  };

  //handleView
  const [selectedReview, setSelectedReview] = useState(null);

  const handleView = (data) => {
    setSelectedReview(data);
  };
  return (
    <>
      <div className="arrived">
        <Sideba />
        <div className="user-content">
          <div className="top">
            <div className="left">
              <h6>Reviews</h6>
              <div className="buttons"></div>
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
                    <th>Activity Name</th>
                    <th>Comment</th>
                    <th>Rating</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReportData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((data) => (
                      <tr key={data.review_id}>
                        <td>{data.name}</td>
                        <td
                          style={{
                            maxWidth: "520px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            textAlign: "start",
                          }}
                        >
                          {data.review}
                        </td>
                        <td>{data.rating}</td>
                        <td
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <span
                            onClick={() => handleView(data)}
                            style={{
                              fontSize: "12px",
                              backgroundColor: "blue",
                              padding: "2px 10px",
                              borderRadius: "3px",
                              cursor: "pointer",
                              border: "none",
                              color: "#fff",
                              fontWeight: "500px",
                            }}
                          >
                            View
                          </span>

                          <span
                            onClick={() => selectedReviewId(data.review_id)}
                            style={{
                              fontSize: "12px",
                              backgroundColor: "red",
                              padding: "2px 10px",
                              borderRadius: "3px",
                              cursor: "pointer",
                              border: "none",
                              color: "#fff",
                              fontWeight: "500px",
                            }}
                          >
                            Delete
                          </span>
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
      {selectedReview && (
        <div className="modal-vieww">
          <div className="top">
            <span>{selectedReview.name}</span>
            <p>{selectedReview.rating}</p>
          </div>
          <div className="content">
            <p>{selectedReview.review}</p>
          </div>
          <div className="bot">
            <span onClick={() => setSelectedReview(null)}>Close</span>
          </div>
        </div>
      )}
      {selectedReview && <div className="modal-vieww-overlay"></div>}
      {showModalDelete && (
        <div className="delete-modal">
          <div className="top">
            <h6>Delete Review</h6>
          </div>

          <div className="content">
            <span>Are you sure you wan't to delete this review?</span>
          </div>

          <div className="bot">
            <button className="btn-delete" onClick={handleDete}>
              {loader ? "Deleting..." : "Delete"}
            </button>

            <button
              className="btn-cancel"
              onClick={() => setShowModalDelete(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {showModalDelete && (
        <div
          className="delete-modal-overlay"
          onClick={() => setShowModalDelete(false)}
        ></div>
      )}{" "}
      {showdelModalMsg && (
        <div className="deleted-message">
          <p>{delMsg}</p>
        </div>
      )}
    </>
  );
};

export default Reviews;
