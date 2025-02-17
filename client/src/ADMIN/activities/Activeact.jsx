import "./activeact.scss";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Addactivity from "../components/addact/Addactivity";
import Sideba from "../components/sidebar/Sideba";
import config from "../../BaseURL";

const Activeact = () => {
  const [activityData, setActivityData] = useState([]);
  const [showAddAct, setAddAct] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const [showUpdateModal, setShowModalUpdate] = useState(false);
  const [imageURL, setImageURL] = useState(null);

  const [showModalAsk, setshowModalAsk] = useState(false);
  const [selecetdData, setselecetdData] = useState({
    act_id: " ",
    name: "",
  });

  const selecetdUser = (act_id, name) => {
    setshowModalAsk(true);
    setselecetdData((prev) => ({
      ...prev,
      act_id: act_id,
      name: name,
    }));
  };

  const [actData, setAct] = useState({
    name: "",
    price: "",
    quantity: "",
    discount: "",
    reservation_fee: "",
    duration: "",
    maxreservation: "",
    pricing_details: "",
    tagline: "",
    important_notice: "",
    description: "",
    noteReservation: "",
    image: null,
    act_id: "",
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAct((prevData) => ({
      ...prevData,
      image: file,
    }));
    setImageURL(URL.createObjectURL(file));
  };

  const handleActChange = (e) => {
    const { name, value } = e.target;
    setAct((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //handleUpdate
  const handleUpdate = (activity) => {
    setAct({
      name: activity.name,
      price: activity.price,
      quantity: activity.quantity,
      discount: activity.discount,
      reservation_fee: activity.reservation_fee,
      duration: activity.duration,
      maxreservation: activity.maxreservation,
      pricing_details: activity.pricing_details,
      tagline: activity.tagline,
      important_notice: activity.important_notice,
      description: activity.description,
      noteReservation: activity.note,
      image: activity.image,
      act_id: activity.act_id,
    });

    setShowModalUpdate(true);
  };

  //handleUpdateAct
  const handleUpdateAct = async (e) => {
    e.preventDefault();

    setLoadingUpdate(true);

    const formData = new FormData();
    formData.append("name", actData.name);
    formData.append("price", actData.price);
    formData.append("quantity", actData.quantity);
    formData.append("discount", actData.discount);
    formData.append("resfee", actData.reservation_fee);
    formData.append("duration", actData.duration);
    formData.append("maxreservation", actData.maxreservation);
    formData.append("pricing_details", actData.pricing_details);
    formData.append("tagline", actData.tagline);
    formData.append("note", actData.important_notice);
    formData.append("description", actData.description);
    formData.append("noteReservation", actData.noteReservation);
    formData.append("image", actData.image);
    formData.append("act_id", actData.act_id);

    try {
      const response = await axios.post(
        `${config.apiBaseUrl}backend/ADMIN_PHP/updateActivity.php`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      console.log(response.data);
      if (response.data.success) {
        setLoadingUpdate(false);
        setShowModalUpdate(false);
        getActivities();
      } else {
        setLoadingUpdate(false);
        console.error("Error:", response.data.message);
      }
    } catch (error) {
      setLoadingUpdate(false);
      console.error("Error:", error);
    }
  };

  //getActivities

  const getActivities = () => {
    axios
      .get(`${config.apiBaseUrl}backend/getActivities.php`)
      .then((response) => {
        setActivityData(response.data);
        setLoading(false);
        console.log(response.data);
      })
      .catch((error) => {
        console.log("Error on fetching  : ", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getActivities();
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

  //handleSetAsNotActive
  const handleSetAsNotActive = () => {
    const formData = new FormData();
    formData.append("act_id", selecetdData.act_id);
    axios
      .post(
        `${config.apiBaseUrl}backend/ADMIN_PHP/updateActivityStatusNA.php`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          getActivities();
          setselecetdData({
            act_id: "",
            name: "",
          });
          setshowModalAsk(false);
        } else {
          console.log(response.data.error);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {});
  };

  return (
    <>
      <div className="aactivity">
        <Sideba />
        <div className="activity-content">
          <div className="top">
            <div className="left">
              <h6>Activities</h6>
              <Link className="opp" to="/admin/not-active-act/">
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
              <button onClick={() => setAddAct(!showAddAct)}>ADD NEW</button>
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
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      <div className="loader"></div>
                    </td>
                  </tr>
                ) : (
                  filteredActivityData
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
                        <td style={{ width: "200px" }}>
                          <button
                            className="btn-ban"
                            // onClick={() => handleSetAsNotActive(data.act_id)}
                            onClick={() => selecetdUser(data.act_id, data.name)}
                          >
                            {/* {loadingIds[data.act_id]
                              ? "Updating..."
                              : "NOT ACTIVE"} */}
                            NOT ACTIVE
                          </button>

                          <button
                            className="btn-update"
                            onClick={() => handleUpdate(data)}
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))
                )}
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
      {showAddAct && (
        <Addactivity
          getActivities={getActivities}
          closeAddact={() => setAddAct(false)}
        />
      )}
      {showUpdateModal && (
        <div className="uupdate-act">
          <div className="act-top">
            <h6>UPDATE ACTIVITY</h6>
            <i
              className="bi bi-x-square-fill"
              onClick={() => setShowModalUpdate(false)}
            ></i>
          </div>
          <form>
            <div className="inputs">
              <div className="top-inputs">
                <div className="left-inputs">
                  <span className="label">Activity name</span>
                  <input
                    type="text"
                    name="name"
                    value={actData.name}
                    onChange={handleActChange}
                    placeholder="Name"
                  />
                  <span className="label">Price</span>
                  <input
                    type="text"
                    name="price"
                    value={actData.price}
                    onChange={handleActChange}
                    placeholder="Price"
                  />
                  <span className="label">Rides quantity</span>

                  <input
                    type="number"
                    name="quantity"
                    value={actData.quantity}
                    onChange={handleActChange}
                    placeholder="Rides quantity"
                  />
                </div>

                <div className="right-inputs">
                  <span className="label">Discount</span>
                  <input
                    type="text"
                    name="discount"
                    value={actData.discount}
                    onChange={handleActChange}
                    placeholder="Discount"
                  />

                  <span className="label">Reservation Fee</span>
                  <input
                    type="text"
                    name="reservation_fee"
                    value={actData.reservation_fee}
                    onChange={handleActChange}
                    placeholder="Reservation Fee"
                  />
                  <span className="label">Time duration</span>
                  <input
                    type="text"
                    name="duration"
                    value={actData.duration}
                    onChange={handleActChange}
                    placeholder="Duration"
                  />

                  <span className="label">Maximum reservation per day</span>
                  <input
                    type="number"
                    name="maxreservation"
                    value={actData.maxreservation}
                    onChange={handleActChange}
                  />
                </div>
              </div>

              <span className="label">Pricing and Reservation Fee Details</span>
              <textarea
                name="pricing_details"
                value={actData.pricing_details}
                onChange={handleActChange}
                placeholder="Pricing Details"
              ></textarea>

              <span className="label">Tag line</span>
              <textarea
                name="tagline"
                value={actData.tagline}
                onChange={handleActChange}
                placeholder="Tag line"
              ></textarea>

              <span className="label">Important Notice</span>
              <textarea
                name="important_notice"
                value={actData.important_notice}
                onChange={handleActChange}
                placeholder="Important Notice"
              ></textarea>

              <span className="label">Description</span>
              <textarea
                name="description"
                value={actData.description}
                onChange={handleActChange}
                placeholder="Description"
              ></textarea>

              <span className="label">Note for reservation slot</span>
              <textarea
                name="noteReservation"
                value={actData.noteReservation}
                onChange={handleActChange}
                placeholder="Note for reservation slot"
              ></textarea>
              <input
                id="file-upload"
                accept="image/*"
                type="file"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
            <label htmlFor="file-upload" className="act-img">
              <img
                style={{ height: "120px", width: "120px" }}
                src={
                  imageURL ||
                  `${config.apiBaseUrl}backend/ADMIN_PHP/uploads/${actData.image}`
                }
                alt="Selected"
              />
            </label>
            <button
              style={{ backgroundColor: "blue" }}
              onClick={handleUpdateAct}
            >
              {loadingUpdate ? "Updating..." : "UPDATE"}
            </button>
          </form>
        </div>
      )}
      {showUpdateModal && <div className="overlay-addact"></div>}

      {showModalAsk && (
        <div className="ask-modal">
          <p>
            Are you sure you want to set{" "}
            <span style={{ color: "blue" }}> {selecetdData.name}</span> as not
            active ?{" "}
          </p>

          <div className="bot">
            <button className="btn-del" onClick={handleSetAsNotActive}>
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

export default Activeact;
