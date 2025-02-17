import "./bio.scss";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sideba from "../components/sidebar/Sideba";
import config from "../../BaseURL";
import Addbiodiversity from "./Addbiodiversity";

const Bio = () => {
  const [data, setData] = useState([]);
  const [showAddAct, setAddAct] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showUpdateModal, setShowModalUpdate] = useState(false);
  const [gType, setGetType] = useState([]);
  const [type, setType] = useState("");
  const [imageURL, setImageURL] = useState(null);

  const [bioData, setBio] = useState({
    type: "",
    name: "",
    sname: "",
    about: "",
    characteristic: "",
    image: null,
    bio_id: "",
  });

  const getBiodiversity = () => {
    axios
      .get(`${config.apiBaseUrl}backend/getBiod.php`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log("Full Response: ", response);
        if (response.data && response.data.bio) {
          setData(response.data.bio);
        } else {
          console.warn("Bio data is undefined or not in expected format.");
          setData([]); // Ensure data is always an array
        }
      })
      .catch((error) => {
        console.error("Error on fetching: ", error);
      });
  };

  //handleSelected
  const handleSelected = (bio) => {
    setBio({
      type: bio.type,
      name: bio.name,
      sname: bio.sname,
      about: bio.about,
      characteristic: bio.characteristic,
      image: bio.image,
      bio_id: bio.bio_id,
    });

    setShowModalUpdate(true);
  };

  const handleBioChange = (e) => {
    const { name, value } = e.target;
    setBio((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //handle getType
  const getType = () => {
    axios
      .get(`${config.apiBaseUrl}backend/ADMIN_PHP/getType.php`, {
        withCredentials: true,
      })
      .then((response) => {
        setGetType(response.data.types);
      })
      .catch((error) => {
        console.log("Error: ", "Failed to fetch data", error);
      });
  };

  useEffect(() => {
    getType();
  }, []);

  const handlFileChange = (e) => {
    const file = e.target.files[0];
    setBio((prevData) => ({
      ...prevData,
      image: file,
    }));
    setImageURL(URL.createObjectURL(file));
  };

  //handleUpdateAct
  const handleUpdateBio = async (e) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData();
    formData.append("type", bioData.type);
    formData.append("name", bioData.name);
    formData.append("sname", bioData.sname);
    formData.append("about", bioData.about);
    formData.append("characteristic", bioData.characteristic);
    formData.append("image", bioData.image); // Ensure this is the correct file object
    formData.append("bio_id", bioData.bio_id);

    try {
      const response = await axios.post(
        `${config.apiBaseUrl}backend/ADMIN_PHP/updateBiodivirsity.php`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        getBiodiversity();
        setShowModalUpdate(false);
        setLoading(false);
      } else {
        setLoading(false);
        console.error("Error:", response.data.message);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
    }
  };

  // const getBiodiversity = () => {
  //   axios
  //     .get(`${config.apiBaseUrl}backend/ADMIN_PHP/getBiod.php`, {
  //       withCredentials: true,
  //     })
  //     .then((response) => {
  //       setData(response.data.bio || []); // Ensure data is always an array
  //       console.log("Bio DATAA: ", response.data.bio);
  //     })
  //     .catch((error) => {
  //       console.log("Error on fetching: ", error);
  //     });
  // };

  useEffect(() => {
    getBiodiversity();
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

  const filteredData = (data || []).filter(
    (d) =>
      String(d.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(d.sname).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(d.type).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  //handleRemove{}
  const handleRemove = (bio_id) => {
    const data = new FormData();
    data.append("bio_id", bio_id);
    axios
      .post(`${config.apiBaseUrl}backend/deleteBiodiversity.php`, data, {
        withCredentials: true,
      })
      .then((response) => {
        console.log("first", response.data);
        if (response.data.success) {
          setData((prevData) =>
            prevData.filter((item) => item.bio_id !== bio_id)
          );
        }
      })
      .catch((error) => {
        console.log("Error : ", error);
      });
  };

  return (
    <>
      <div className="biosearch">
        <Sideba />
        <div className="activity-content">
          <div className="top">
            <div className="left">
              <h6>Lake Biodiversity</h6>
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
                  <th>Name</th>
                  <th>Scientific Name</th>
                  <th>Type</th>
                  <th>Image</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((data) => (
                    <tr key={data.bio_id}>
                      <td>{data.name}</td>
                      <td>{data.sname}</td>
                      <td>{data.type}</td>
                      <td>
                        <img
                          style={{ height: "30px", width: "30px" }}
                          src={`${config.apiBaseUrl}backend/ADMIN_PHP/bioimages/${data.image}`}
                          alt=""
                        />
                      </td>
                      <td>
                        <button
                          className="btn-ban"
                          onClick={() => handleRemove(data.bio_id)}
                        >
                          Remove
                        </button>

                        <button
                          className="btn-update"
                          onClick={() => handleSelected(data)}
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {filteredData.length > 0 && (
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
      {showAddAct && (
        <Addbiodiversity
          getBiodiversity={getBiodiversity}
          closeAddact={() => setAddAct(false)}
        />
      )}
      {showUpdateModal && (
        <div className="update-bio">
          <div className="act-top">
            <h6>UPDATE </h6>
            <i
              className="bi bi-x-square-fill"
              onClick={() => setShowModalUpdate(false)}
            ></i>
          </div>
          <form onSubmit={handleUpdateBio}>
            <div className="inputs">
              <div className="drop-down">
                <label htmlFor="dropdown">Choose type</label>

                <select
                  style={{ fontSize: "12px" }}
                  name="type"
                  id="dropdown"
                  value={bioData.type}
                  onChange={handleBioChange}
                  className="combo-box"
                  required
                >
                  <option
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "white",
                    }}
                    value=""
                  >
                    Select Type
                  </option>
                  {gType &&
                    gType.map((t) => (
                      <option
                        key={t.type}
                        style={{ fontSize: "12px" }}
                        value={t.type}
                      >
                        {t.type}
                      </option>
                    ))}
                </select>
              </div>

              <input
                type="text"
                name="name"
                value={bioData.name}
                onChange={handleBioChange}
                placeholder="Name"
                required
              />
              <input
                type="text"
                name="sname"
                value={bioData.sname}
                onChange={handleBioChange}
                placeholder="Scientific name"
                required
              />

              <textarea
                name="about"
                value={bioData.about}
                id=""
                onChange={handleBioChange}
                placeholder="About"
              ></textarea>

              <textarea
                name="characteristic"
                value={bioData.characteristic}
                onChange={handleBioChange}
                placeholder="Characteristic"
              ></textarea>

              <input
                id="file-upload"
                type="file"
                style={{ display: "none" }}
                onChange={handlFileChange}
              />
              <label htmlFor="file-upload" className="act-img">
                <img
                  src={
                    imageURL ||
                    `${config.apiBaseUrl}backend/ADMIN_PHP/bioimages/${bioData.image}`
                  }
                  alt="Selected"
                />
              </label>
              <button style={{ color: "#fff" }} type="submit">
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      )}

      {showUpdateModal && <div className="overlay"></div>}
    </>
  );
};

export default Bio;
