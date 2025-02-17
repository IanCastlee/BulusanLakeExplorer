import "./addbiodiversity.scss";
import axios from "axios";
import defaultImage from "../../assets/image-gallery.png";
import { useEffect, useState } from "react";
import config from "../../BaseURL";

const Addbiodiversity = ({ getBiodiversity, closeAddact }) => {
  const [type, setType] = useState("");
  const [gType, setGetType] = useState([]);
  const [response, setResponse] = useState("");
  const [msg, setMsg] = useState("");
  const [imageURL, setImageURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const [nullType, setNullType] = useState(false);
  const [nullName, setNullName] = useState(false);
  const [nullSName, setNullSName] = useState(false);
  const [nullAbout, setNullAbout] = useState(false);
  const [nullChar, setNullChar] = useState(false);
  const [nullImage, setNullImage] = useState(false);

  const [reqImage, setReqImage] = useState("");
  const [bioData, setBio] = useState({
    type: "",
    name: "",
    sname: "",
    about: "",
    characteristic: "",
    image: null,
  });

  const handleBioChange = (e) => {
    const { name, value } = e.target;

    setNullType(false);
    setNullName(false);
    setNullSName(false);
    setNullAbout(false);
    setNullChar(false);
    setNullImage(false);

    setBio((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handlFileChange = (e) => {
    const file = e.target.files[0];
    setBio((prevData) => ({
      ...prevData,
      image: file,
    }));
    setImageURL(URL.createObjectURL(file));
    setReqImage(null);
  };

  const handleBioSubmit = async (e) => {
    e.preventDefault();

    if (
      bioData.type === "" ||
      bioData.name === "" ||
      bioData.sname === "" ||
      bioData.about === "" ||
      bioData.characteristic === "" ||
      bioData.image === null
    ) {
      if (bioData.type === "") {
        setNullType(true);
      }
      if (bioData.name === "") {
        setNullName(true);
      }
      if (bioData.sname === "") {
        setNullSName(true);
      }
      if (bioData.about === "") {
        setNullAbout(true);
      }
      if (bioData.characteristic === "") {
        setNullChar(true);
      }
      if (bioData.image === null) {
        setNullImage(true);
      }

      return;
    }

    setLoading2(true);

    const formData = new FormData();
    formData.append("type", bioData.type);
    formData.append("name", bioData.name);
    formData.append("sname", bioData.sname);
    formData.append("about", bioData.about);
    formData.append("characteristic", bioData.characteristic);
    formData.append("image", bioData.image);

    try {
      const response = await axios.post(
        `${config.apiBaseUrl}backend/ADMIN_PHP/postBiodiversity.php`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setBio({
          type: "",
          name: "",
          sname: "",
          about: "",
          characteristic: "",
          image: null,
        });

        getBiodiversity();
        closeAddact();
        setResponse(response.data.message);
        setLoading2(false);
      } else {
        setLoading2(false);
        console.log(response.data.error);
      }
    } catch (error) {
      setLoading2(false);
      console.error("Error uploading Biodiversity:", error);
    }
  };

  //handleSubmitType
  const handleSubmitType = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("type", type);

    axios
      .post(`${config.apiBaseUrl}backend/ADMIN_PHP/postType.php`, formData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.success) {
          setType("");
          getType();
          setMsg("Added successfully");
          setLoading(false);
        } else {
          setLoading(false);
          console.log("error : ", response.data.error);
        }
        setMsg(response.data.message);
        setType("");
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error in submission", error);
      });
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

  useEffect(() => {
    setTimeout(() => {
      setMsg("");
    }, 4000);
  });
  return (
    <>
      <div className="add-act">
        <span>{response}</span>

        <div className="act-top">
          <h6>ADD BIODIVERSITY</h6>

          <i className="bi bi-x-square-fill" onClick={closeAddact}></i>
        </div>
        <form>
          <div className="inputs">
            <div className="drop-down">
              <label htmlFor="dropdown">Choose type</label>

              <select
                style={{
                  fontSize: "12px",
                  border: nullType ? "2px solid red" : "",
                }}
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

              <span style={{ color: "gray" }}>OR</span>
              <span>{msg}</span>
              <div className="add-new-type-w">
                <input
                  type="text"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  placeholder="Add new type"
                />
                <button style={{ color: "#fff" }} onClick={handleSubmitType}>
                  {loading ? "Inserting..." : "Add"}
                </button>
              </div>
            </div>

            <input
              type="text"
              name="name"
              value={bioData.name}
              onChange={handleBioChange}
              placeholder="Name"
              required
              style={{ border: nullName ? "2px solid red" : "" }}
            />
            <input
              type="text"
              name="sname"
              value={bioData.sname}
              onChange={handleBioChange}
              placeholder="Scientific name"
              required
              style={{ border: nullSName ? "2px solid red" : "" }}
            />

            <textarea
              name="about"
              value={bioData.about}
              id=""
              onChange={handleBioChange}
              placeholder="About"
              style={{ border: nullAbout ? "2px solid red" : "" }}
            ></textarea>

            <textarea
              name="characteristic"
              value={bioData.characteristic}
              onChange={handleBioChange}
              placeholder="Characteristic"
              style={{ border: nullChar ? "2px solid red" : "" }}
            ></textarea>

            <input
              id="file-upload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handlFileChange}
            />
            <label
              htmlFor="file-upload"
              className="act-img"
              style={{ border: nullImage ? "2px solid red" : "" }}
            >
              <img src={imageURL || defaultImage} alt="Selected" />{" "}
              {reqImage && (
                <span
                  style={{
                    fontSize: "12px",
                    color: "red",
                    marginLeft: "100px",
                  }}
                >
                  {reqImage}
                </span>
              )}
            </label>
            <button style={{ color: "#fff" }} onClick={handleBioSubmit}>
              {loading2 ? "Submiting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
      <div className="overlay-addact"></div>
    </>
  );
};

export default Addbiodiversity;
