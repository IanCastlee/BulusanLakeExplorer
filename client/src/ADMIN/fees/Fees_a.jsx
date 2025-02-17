import "./fees.scss";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sideba from "../components/sidebar/Sideba";
import config from "../../BaseURL";

const Fees_a = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const [addModal, setAddModal] = useState(false);
  const [update, setUpdate] = useState(null);

  const [loader, setLoader] = useState(false);

  const [addData, setAddData] = useState({
    entrance_fee: "",
    environmental_fee: "",
    parking_fee: "",
    shuttle_service_fee: "",
    service_charge: "",
    fee_id: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAddData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitData = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("entrance_fee", addData.entrance_fee);
    formData.append("environmental_fee", addData.environmental_fee);
    formData.append("parking_fee", addData.parking_fee);
    formData.append("shuttle_service_fee", addData.shuttle_service_fee);
    formData.append("service_charge", addData.service_charge);

    axios
      .post(
        `${config.apiBaseUrl}backend/ADMIN_PHP/postFeesData.php`,
        formData,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data.success) {
          getData();
          setAddData({
            entrance_fee: "",
            environmental_fee: "",
            parking_fee: "",
            shuttle_service_fee: "",
            service_charge: "",
            response: "",
          });
          console.log(res.data);
          setAddModal(false);
        }
      })
      .catch((error) => {
        console.log("ERROR:", error);
      });
  };

  const getData = () => {
    axios
      //.get(`${config.apiBaseUrl}backend/ADMIN_PHP/getLakeFees.php`, {
      .get(
        `https://bulusanlakeexplorer.kesug.com/backend/ADMIN_PHP/getLakeFees.php`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setData(response.data.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log("Error on fetching  : ", error);
      });
  };

  useEffect(() => {
    getData();
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

  const filteredData = data.filter(
    (cb) =>
      String(cb.entrance_fee)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(cb.environmental_fee)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(cb.parking_fee).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(cb.shuttle_service_fee)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(cb.service_charge).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(data.length / rowsPerPage);

  //handleUpdate
  const handleUpdate = (updateData) => {
    setUpdate(updateData);

    setAddData({
      entrance_fee: updateData.entrance_fee,
      environmental_fee: updateData.environmental_fee,
      parking_fee: updateData.parking_fee,
      shuttle_service_fee: updateData.shuttle_service_fee,
      service_charge: updateData.service_charge,
      fee_id: updateData.fee_id,
    });
    setAddModal(true);
  };

  const handleUpdateData = async (e) => {
    e.preventDefault();

    setLoader(true);

    const formData = new FormData();
    formData.append("entrance_fee", addData.entrance_fee);
    formData.append("environmental_fee", addData.environmental_fee);
    formData.append("parking_fee", addData.parking_fee);
    formData.append("shuttle_service_fee", addData.shuttle_service_fee);
    formData.append("service_charge", addData.service_charge);
    formData.append("fee_id", addData.fee_id);

    axios
      .post(
        //`${config.apiBaseUrl}backend/ADMIN_PHP/postFeesData.php`,
        `https://bulusanlakeexplorer.kesug.com/backend/ADMIN_PHP/postFeesData.php`,
        formData,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data.success) {
          console.log(res.data);
          getData();
          closeModal();
          setLoader(false);
        }
      })
      .catch((error) => {
        console.log("ERROR:", error);
        setLoader(false);
      });
  };

  //closeModal

  const closeModal = () => {
    setAddModal(false);
    setUpdate(null);
    setAddData({
      entrance_fee: "",
      environmental_fee: "",
      parking_fee: "",
      shuttle_service_fee: "",
      service_charge: "",
      fee_id: "",
    });
  };

  return (
    <>
      <div className="fchatbot">
        <Sideba />
        <div className="user-content">
          <div className="top">
            <div className="left">
              <h6>Bulusan Lake Fees and Charges</h6>
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
              {/* <button onClick={() => setAddModal(true)}>ADD NEW</button> */}
            </div>
          </div>
          <div className="active">
            {data.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Entrance Fee</th>
                    <th>Environmental Fee</th>
                    <th>Parking Fee</th>
                    <th>Shuttle Service Fee</th>
                    <th>Service Charge Fee</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((data) => (
                      <tr key={data.fee_id}>
                        <td>{data.entrance_fee}</td>
                        <td>{data.environmental_fee}</td>
                        <td>{data.parking_fee}</td>
                        <td>{data.shuttle_service_fee}</td>
                        <td>{data.service_charge}</td>
                        <td
                          style={{
                            width: "200px",
                          }}
                        >
                          <button
                            style={{
                              color: "white",
                              backgroundColor: "blue",
                              border: "none",
                              borderRadius: "5px",
                              cursor: "pointer",
                              padding: "2px 5px",
                              fontSize: "12px",
                            }}
                            onClick={() => handleUpdate(data)}
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              // <tr>
              //   <td colSpan="5" style={{ textAlign: "center" }}>
              //     No data available
              //   </td>
              // </tr>
              <p>No data available</p>
            )}
            {data.length > 0 ? (
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

      {addModal && (
        <div className="modal-add-chatbot">
          <div className="top">
            <h6>{update ? "UDATE DATA" : "ADD NEW DATA"}</h6>

            <i className="bi bi-x-lg close2" onClick={closeModal}></i>
          </div>

          <div className="textareas">
            <input
              type="hidden"
              name="fee_id"
              onChange={handleChange}
              value={addData.fee_id}
            />
            <textarea
              name="entrance_fee"
              onChange={handleChange}
              value={addData.entrance_fee}
              placeholder="Entrance Fee"
            ></textarea>
            <textarea
              name="environmental_fee"
              onChange={handleChange}
              value={addData.environmental_fee}
              placeholder="Environmental Fee"
            ></textarea>
            <textarea
              name="parking_fee"
              onChange={handleChange}
              value={addData.parking_fee}
              placeholder="Parking Fee"
            ></textarea>
            <textarea
              name="shuttle_service_fee"
              onChange={handleChange}
              value={addData.shuttle_service_fee}
              placeholder="Shuttle Service Fee"
            ></textarea>
            <textarea
              name="service_charge"
              onChange={handleChange}
              value={addData.service_charge}
              placeholder="Service Charge"
            ></textarea>
          </div>

          <div className="bot">
            <button
              className="btn-submit"
              onClick={update ? handleUpdateData : handleSubmitData}
            >
              {loader ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      )}
      {addModal && <div className="overlay"></div>}
    </>
  );
};

export default Fees_a;
