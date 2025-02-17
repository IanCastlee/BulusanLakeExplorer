import "./announcement.scss";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sideba from "../components/sidebar/Sideba";
import config from "../../BaseURL";

import "react-datepicker/dist/react-datepicker.css";

const Announcementa = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingInsert, setLoadingInsert] = useState(false);
  const [addData, setAddData] = useState({
    title: "",
    announcement: "",
    date: "",
    id: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [nullTitle, setNullTitle] = useState(false);
  const [nullAnnouncement, setNullAnnouncemnet] = useState(false);
  const [nullDate, setNullDate] = useState(false);

  //handleUpdateClick
  const handleUpdateClick = (announcement) => {
    setEditData(announcement);
    setAddData({
      title: announcement.ttl,
      announcement: announcement.announcement,
      date: announcement.date,
      id: announcement.announcement_id,
    });
    setShowModal(true);
  };

  const handleUpdateAnnouncement = async (e) => {
    e.preventDefault();

    setLoadingUpdate(true);

    const formData = new FormData();
    formData.append("announcement", addData.announcement);
    formData.append("title", addData.title);
    formData.append("date", addData.date);
    formData.append("announ_id", addData.id);

    try {
      const response = await axios.post(
        `${config.apiBaseUrl}backend/ADMIN_PHP/updateAnnouncement.php`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setAddData({ title: "", announcement: "", date: "" });
        setShowModal(false);
        setEditData(null);
        getAnnouncementf();
        setLoadingUpdate(false);
      } else {
        setLoadingUpdate(false);
        console.error("Error:", response.data.error);
      }
    } catch (error) {
      setLoadingUpdate(false);
      console.error("Error:", error);
    }
  };

  //handleChange
  const handleChange = (e) => {
    setNullTitle(false);
    setNullAnnouncemnet(false);
    setNullDate(false);
    const { name, value } = e.target;
    setAddData((prevData) => ({ ...prevData, [name]: value }));
  };

  //handleAddAnnouncement
  const handleAddAnnouncement = async (e) => {
    e.preventDefault();

    if (
      addData.title === "" ||
      addData.announcement === "" ||
      addData.date === ""
    ) {
      if (addData.title === "") {
        setNullTitle(true);
      }

      if (addData.announcement === "") {
        setNullAnnouncemnet(true);
      }

      if (addData.date === "") {
        setNullDate(true);
      }

      return;
    }

    setLoadingInsert(true);

    const formData = new FormData();
    formData.append("announcement", addData.announcement);
    formData.append("title", addData.title);
    formData.append("date", addData.date);

    try {
      const response = await axios.post(
        `${config.apiBaseUrl}backend/ADMIN_PHP/postAnnouncement.php`,
        formData,
        { withCredentials: true }
      );
      if (response.data.success) {
        setAddData({ title: "", announcement: "", date: "" });
        setShowModal(false);
        getAnnouncementf();
        setLoadingInsert(false);
      } else {
        setLoadingInsert(false);
        console.error("Error:", response.data.error);
      }
    } catch (error) {
      setLoadingInsert(false);
      console.error("Error:", error);
    }
  };

  //handleUpdateStatus
  const handleUpdateStatus = (announ_id) => {
    const formData = new FormData();
    formData.append("announ_id", announ_id);
    axios
      .post(
        `${config.apiBaseUrl}backend/ADMIN_PHP/updateAnnouncementStatus.php`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          setData((prevData) =>
            prevData.filter((announce) => announce.announ_id !== announ_id)
          );
          getAnnouncementf();
        } else {
          console.log(response.data.error);
        }
      });
  };

  //getAnnouncementf
  const getAnnouncementf = () => {
    axios
      .get(`${config.apiBaseUrl}backend/ADMIN_PHP/getAnnouncement.php`)
      .then((response) => {
        console.log("Fetch announcements response:", response.data);
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching announcements:", error);
      });
  };

  useEffect(() => {
    getAnnouncementf();
  }, []);

  const handleChangePage = (newPage) => setPage(newPage);
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  const filteredData = data.filter(
    (user) =>
      user.announcement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.createdAt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(data.length / rowsPerPage);

  //closeModal
  const closeModal = () => {
    setShowModal(false);
    setEditData(null);
    setAddData({ title: "", announcement: "" });
  };

  return (
    <>
      <div className="auser-active">
        <Sideba />
        <div className="user-content">
          <div className="top">
            <div className="left">
              <h6>Announcement</h6>
            </div>
            <div className="right2">
              <div className="search">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <i className="bi bi-search"></i>
              </div>
              <button onClick={() => setShowModal(true)}>
                Add announcement <i className="bi bi-plus"></i>
              </button>
            </div>
          </div>
          <div className="active">
            {data.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Announcement</th>
                    <th>Date Announced</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((data) => (
                      <tr
                        className={`${
                          data.status === "Active announcement" ? "green" : ""
                        }`}
                        key={data.announcement_id}
                      >
                        <td>{data.ttl}</td>
                        <td>{data.createdAt}</td>
                        <td>{data.status}</td>
                        <td>
                          <button
                            style={{
                              backgroundColor:
                                data.status === "Active announcement"
                                  ? "red"
                                  : "transparent",
                            }}
                            className="btn-ban"
                            onClick={() =>
                              handleUpdateStatus(data.announcement_id)
                            }
                          >
                            {data.status === "Active announcement"
                              ? "Remove"
                              : "Not Active"}
                          </button>
                          {data.status === "Active announcement" ? (
                            <button
                              className="btn-update"
                              onClick={() => handleUpdateClick(data)}
                            >
                              Update
                            </button>
                          ) : (
                            ""
                          )}
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
      {showModal && (
        <div className="add-announ-modl">
          <div className="topm">
            <h6>{editData ? "Update announcement" : "Add new announcement"}</h6>
            <i className="bi bi-x-lg close2" onClick={closeModal}></i>
          </div>
          <input
            type="text"
            name="id"
            value={addData.id}
            onChange={handleChange}
            style={{ display: "none" }}
          />
          <input
            className="title"
            type="text"
            name="title"
            onChange={handleChange}
            value={addData.title}
            placeholder="Announcement title"
            style={{ border: nullTitle ? "2px solid red" : "" }}
          />

          <textarea
            style={{
              height: "300px",
              padding: "10px",
              border: nullAnnouncement ? "2px solid red" : "",
            }}
            name="announcement"
            value={addData.announcement}
            onChange={handleChange}
            placeholder="Announcement"
          ></textarea>

          <div className="date-wrapper">
            <span>Not Availble Date</span>
            <input
              type="date"
              name="date"
              value={addData.date}
              onChange={handleChange}
              style={{ border: nullDate ? "2px solid red" : "" }}
            />
          </div>

          <button
            onClick={
              editData ? handleUpdateAnnouncement : handleAddAnnouncement
            }
          >
            {editData
              ? `${loadingUpdate ? "Updating..." : "Update"}`
              : `${loadingInsert ? "Inserting..." : "Add"}`}
          </button>
        </div>
      )}

      {showModal && <div className="overlay"></div>}
    </>
  );
};

export default Announcementa;
