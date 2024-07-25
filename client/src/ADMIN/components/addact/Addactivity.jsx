import "./addact.scss";
import axios from "axios";
import img from "../../../assets/bg.jpg";
import { useState } from "react";

const Addactivity = ({ closeAddact }) => {
  const [response, setResponse] = useState("");

  const [actData, setAct] = useState({
    name: "",
    price: "",
    duration: "",
    image: null,
  });

  const handleActChange = (e) => {
    const { name, value } = e.target;

    setAct((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handlFileChange = (e) => {
    setAct((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  const handleActSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", actData.name);
    formData.append("price", actData.price);
    formData.append("duration", actData.duration);
    formData.append("image", actData.image);

    try {
      const response = await axios.post(
        "http://localhost/BULUSANLAEK_ADMIN/backend/Addact.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setResponse(response.data.message);
      } else {
        setResponse(response.data.message);
      }
    } catch (error) {
      console.error("Error uploading activity:", error);
    }
  };
  return (
    <>
      <div className="add-act">
        <span>{response}</span>

        <div className="act-top">
          <h6>ADD ACTIVITY</h6>

          <i className="bi bi-x-square-fill" onClick={closeAddact}></i>
        </div>
        <form onSubmit={handleActSubmit}>
          <div className="inputs">
            <input
              type="text"
              name="name"
              value={actData.name}
              onChange={handleActChange}
              placeholder="Name"
            />
            <input
              type="text"
              name="price"
              value={actData.price}
              onChange={handleActChange}
              placeholder="Price"
            />

            <input
              type="text"
              name="duration"
              value={actData.duration}
              onChange={handleActChange}
              placeholder="Duration"
            />

            <label htmlFor="file-upload">
              <i className="bi bi-file-earmark-image"></i>
              Add Image
            </label>
            <input
              id="file-upload"
              type="file"
              style={{ display: "none" }}
              onChange={handlFileChange}
            />

            <button type="submit">Submit</button>
          </div>

          <div className="act-img">
            <img src={img} alt="" />
          </div>
        </form>
      </div>
      <div className="overlay-addact"></div>
    </>
  );
};

export default Addactivity;
