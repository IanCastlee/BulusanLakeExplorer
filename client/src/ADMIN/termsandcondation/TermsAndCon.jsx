import "./termsandcon.scss";
import Sideba from "../components/sidebar/Sideba";
import { useEffect, useState } from "react";
import config from "../../BaseURL";
import axios from "axios";

const TermsAndCon = () => {
  const [getData, setGetData] = useState(null);
  const [loader, setLoader] = useState(false);
  const [msg, setMsg] = useState("");
  const [showMsg, setShowMsg] = useState("");

  const [data, setData] = useState({
    intro: "",
    defination: "",
    reservationProcess: "",
    payment: "",
    cancellation: "",
    userResponsibilities: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoader(true);

    const formdata = new FormData();
    formdata.append("intro", data.intro);
    formdata.append("defination", data.defination);
    formdata.append("reservationProcess", data.reservationProcess);
    formdata.append("payment", data.payment);
    formdata.append("cancellation", data.cancellation);
    formdata.append("userResponsibilities", data.userResponsibilities);

    try {
      const response = await axios.post(
        `${config.apiBaseUrl}backend/ADMIN_PHP/postTermsCondations.php`,
        formdata,
        { withCredentials: true }
      );
      if (response.data.success) {
        console.log("Data submitted successfully");
        setMsg("Successfully Updated");
        setLoader(false);
        setShowMsg(true);

        setTimeout(() => {
          setShowMsg(false);
        }, 3000);
      } else {
        console.log("Error: ", response.data.error);
        setLoader(false);
      }
    } catch (error) {
      console.error("Error: ", error);
      setLoader(false);
    }
  };

  // Fetch the terms and conditions data
  useEffect(() => {
    axios
      .get(`${config.apiBaseUrl}backend/ADMIN_PHP/getTermsCondations.php`)
      .then((response) => {
        setGetData(response.data.termsData[0] || {});
        console.log("Terms :", response.data.termsData);
      })
      .catch((error) => {
        console.log("Error on fetching: ", error);
      });
  }, []);

  // Update the form data after fetching the terms and conditions data
  useEffect(() => {
    if (getData) {
      setData({
        intro: getData.intro || "",
        defination: getData.defination || "",
        reservationProcess: getData.reservationProcess || "",
        payment: getData.payment || "",
        cancellation: getData.cancellation || "",
        userResponsibilities: getData.userResponsibilities || "",
      });
    }
  }, [getData]);

  return (
    <>
      <div className="terms">
        <Sideba />
        <form onSubmit={handleSubmit} className="terms-content">
          <div className="terms-left">
            <span className="title">Terms and Conditions</span>

            <span className="label">Introduction</span>
            <textarea
              name="intro"
              onChange={handleChange}
              value={data.intro}
              placeholder="Introduction"
              required
            ></textarea>

            <span className="label">Defination</span>
            <textarea
              name="defination"
              onChange={handleChange}
              value={data.defination}
              placeholder="Definition"
              required
            ></textarea>

            <span className="label">Reservation Policy</span>
            <textarea
              name="reservationProcess"
              onChange={handleChange}
              value={data.reservationProcess}
              placeholder="Reservation Process"
              required
            ></textarea>
          </div>

          <div className="terms-right">
            <span className="label">Payment</span>
            <textarea
              name="payment"
              onChange={handleChange}
              value={data.payment}
              placeholder="Payment"
              required
            ></textarea>
            <span className="label">Reservation Fee</span>
            <textarea
              name="cancellation"
              onChange={handleChange}
              value={data.cancellation}
              placeholder="Reservation Fee"
              required
            ></textarea>

            <span className="label">User Responsibilities</span>
            <textarea
              name="userResponsibilities"
              onChange={handleChange}
              value={data.userResponsibilities}
              placeholder="User Responsibilities"
              required
            ></textarea>
            <button type="submit">{loader ? "Updating..." : "Update"}</button>
          </div>
        </form>
      </div>
      {showMsg && <div className="msgModal">{msg}</div>}
    </>
  );
};

export default TermsAndCon;
