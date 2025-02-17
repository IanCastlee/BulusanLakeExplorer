import "./addact.scss";
import axios from "axios";
import { useState } from "react";
import config from "../../../BaseURL";
import defaultImage from "../../../assets/image-gallery.png";

const Addactivity = ({ closeAddact, getActivities }) => {
  const [response, setResponse] = useState("");
  const [imageURL, setImageURL] = useState(null);
  const [loading, setLoading] = useState(false);

  const [actData, setAct] = useState({
    name: "",
    price: "",
    pricing_details: "",
    discount: "",
    resfee: "",
    duration: "",
    maxreservation: "",
    quantity: "",
    tagline: "",
    important_notice: "",
    description: "",
    noteReservation: "",
    image: "",
  });

  const [emptname, setEmptname] = useState(false);
  const [emptprice, setEmptprice] = useState(false);
  const [emptpricing_details, setpricing_details] = useState(false);
  const [emptdiscount, setEmptdiscount] = useState(false);
  const [emptresfee, setResfee] = useState(false);
  const [emptduration, setEmptduration] = useState(false);
  const [emptmaxreservation, setEmptmaxreservation] = useState(false);
  const [emptquantity, setEmptquantity] = useState(false);
  const [empttagline, setEmpttagline] = useState(false);
  const [emptimportant_notice, setEmptimportant_notice] = useState(false);
  const [emptdescription, setEmptdescription] = useState(false);
  const [emptnoteReservation, setEmptnoteReservation] = useState(false);
  const [emptimage, setEmptimage] = useState(false);

  const handleActChange = (e) => {
    const { name, value } = e.target;

    setEmptname(false);
    setEmptprice(false);
    setpricing_details(false);
    setEmptdiscount(false);
    setResfee(false);
    setEmptduration(false);
    setEmptmaxreservation(false);
    setEmptquantity(false);
    setEmpttagline(false);
    setEmptimportant_notice(false);
    setEmptdescription(false);
    setEmptnoteReservation(false);

    setAct((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setEmptimage(false);

    setAct((prevData) => ({
      ...prevData,
      image: file,
    }));
    setImageURL(URL.createObjectURL(file));
  };

  const handleActSubmit = async (e) => {
    e.preventDefault();

    if (
      actData.name === "" ||
      actData.price === "" ||
      actData.pricing_details === "" ||
      actData.discount === "" ||
      actData.resfee === "" ||
      actData.duration === "" ||
      actData.maxreservation === "" ||
      actData.quantity === "" ||
      actData.tagline === "" ||
      actData.important_notice === "" ||
      actData.description === "" ||
      actData.noteReservation === "" ||
      actData.image === ""
    ) {
      if (actData.name === "") {
        setEmptname(true);
      }
      if (actData.price === "") {
        setEmptprice(true);
      }
      if (actData.pricing_details === "") {
        setpricing_details(true);
      }
      if (actData.discount === "") {
        setEmptdiscount(true);
      }
      if (actData.resfee === "") {
        setResfee(true);
      }
      if (actData.duration === "") {
        setEmptduration(true);
      }
      if (actData.maxreservation === "") {
        setEmptmaxreservation(true);
      }
      if (actData.quantity === "") {
        setEmptquantity(true);
      }
      if (actData.tagline === "") {
        setEmpttagline(true);
      }
      if (actData.important_notice === "") {
        setEmptimportant_notice(true);
      }
      if (actData.description === "") {
        setEmptdescription(true);
      }
      if (actData.noteReservation === "") {
        setEmptnoteReservation(true);
      }
      if (actData.image === "") {
        setEmptimage(true);
      }

      return;
    }

    const formData = new FormData();
    formData.append("name", actData.name);
    formData.append("price", actData.price);
    formData.append("pricing_details", actData.pricing_details);
    formData.append("discount", actData.discount);
    formData.append("resfee", actData.resfee);
    formData.append("duration", actData.duration);
    formData.append("maxreservation", actData.maxreservation);
    formData.append("quantity", actData.quantity);
    formData.append("tagline", actData.tagline);
    formData.append("note", actData.important_notice);
    formData.append("description", actData.description);
    formData.append("noteReservation", actData.noteReservation);
    formData.append("image", actData.image);

    setLoading(true);

    try {
      const response = await axios.post(
        `${config.apiBaseUrl}backend/ADMIN_PHP/Addact.php`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setAct({
          name: "",
          price: "",
          pricing_details: "",
          discount: "",
          resfee: "",
          duration: "",
          maxreservation: "",
          quantity: "",
          tagline: "",
          important_notice: "",
          description: "",
          noteReservation: "",
          image: "",
        });
        setResponse(response.data.message);
        setLoading(false);
        getActivities();
        closeAddact();
      } else {
        console.log("__", response.data);
      }
    } catch (error) {
      setLoading(false);
      console.error(
        "Error uploading activity:",
        error.response || error.message
      );
      setResponse("Error uploading activity");
    }
  };

  return (
    <>
      <div className="add-activity">
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
              style={{ border: emptname ? "2px solid red" : "" }}
            />
            <input
              type="text"
              name="price"
              value={actData.price}
              onChange={handleActChange}
              placeholder="Price"
              style={{ border: emptprice ? "2px solid red" : "" }}
            />
            <textarea
              name="pricing_details"
              value={actData.pricing_details}
              onChange={handleActChange}
              placeholder="Pricing Details"
              style={{ border: emptpricing_details ? "2px solid red" : "" }}
            ></textarea>
            <input
              type="text"
              name="discount"
              value={actData.discount}
              onChange={handleActChange}
              placeholder="Discount"
              style={{ border: emptdiscount ? "2px solid red" : "" }}
            />
            <input
              type="text"
              name="resfee"
              value={actData.resfee}
              onChange={handleActChange}
              placeholder="Reservation Fee"
              style={{ border: emptresfee ? "2px solid red" : "" }}
            />
            <input
              type="text"
              name="duration"
              value={actData.duration}
              onChange={handleActChange}
              placeholder="Duration"
              style={{ border: emptduration ? "2px solid red" : "" }}
            />
            <input
              type="number"
              name="maxreservation"
              value={actData.maxreservation}
              onChange={handleActChange}
              placeholder="Maximum Reservation"
              style={{ border: emptmaxreservation ? "2px solid red" : "" }}
            />
            <input
              type="number"
              name="quantity"
              value={actData.quantity}
              onChange={handleActChange}
              placeholder="Rides quantity"
              style={{ border: emptquantity ? "2px solid red" : "" }}
            />
            <textarea
              name="tagline"
              value={actData.tagline}
              onChange={handleActChange}
              placeholder="Tag line"
              style={{ border: empttagline ? "2px solid red" : "" }}
            ></textarea>
            <textarea
              name="important_notice"
              value={actData.important_notice}
              onChange={handleActChange}
              placeholder="Important Notice"
              style={{ border: emptimportant_notice ? "2px solid red" : "" }}
            ></textarea>
            <textarea
              name="description"
              value={actData.description}
              onChange={handleActChange}
              placeholder="Description"
              style={{ border: emptdescription ? "2px solid red" : "" }}
            ></textarea>
            <textarea
              name="noteReservation"
              value={actData.noteReservation}
              onChange={handleActChange}
              placeholder="Note for reservation slot"
              style={{ border: emptnoteReservation ? "2px solid red" : "" }}
            ></textarea>
            <input
              id="file-upload"
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            <label htmlFor="file-upload" className="act-img">
              <img src={imageURL || defaultImage} alt="Selected" />
              {emptimage && (
                <p
                  style={{ color: "red", fontSize: "12px", marginLeft: "50px" }}
                >
                  Activity Image is required
                </p>
              )}
            </label>
            <button type="submit">{loading ? "Inserting..." : "Submit"}</button>
          </div>
        </form>
      </div>
      <div className="overlay-addact"></div>
    </>
  );
};

export default Addactivity;
