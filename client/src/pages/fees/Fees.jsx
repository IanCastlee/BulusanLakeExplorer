import axios from "axios";
import config from "../../BaseURL";
import "./fee.scss";
import { useEffect, useState } from "react";
import feebg from "../../assets/fees.webp";

const Fees = () => {
  const [data, setData] = useState([]);

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

  return (
    <div className="fee">
      <img src={feebg} alt="" />

      <div className="overlaybgc">
        <div className="container">
          <div className="top">
            <h6>BULUSAN LAKE FEES AND CHARGES</h6>
          </div>

          {data ? (
            data.map((d) => {
              return (
                <div className="wrapper" key={d.fee_id}>
                  <div className="card">
                    <div className="title">
                      <span>Entrance Fees</span>
                    </div>

                    <div className="content">
                      <span>{d.entrance_fee}</span>
                    </div>
                  </div>

                  <div className="card">
                    <div className="title">
                      <span>Invironmental Fee</span>
                    </div>

                    <div className="content">
                      <span>{d.environmental_fee}</span>
                    </div>
                  </div>

                  <div className="card">
                    <div className="title">
                      <span>Parking Fees</span>{" "}
                      <p style={{ color: "gray", fontSize: "12px" }}>
                        (maximum of 4 hours)
                      </p>
                    </div>

                    <div className="content">
                      <span>{d.parking_fee}</span>
                    </div>
                  </div>

                  <div className="card">
                    <div className="title">
                      <span>Shuttle Service Fee</span>
                    </div>

                    <div className="content">
                      <span>{d.shuttle_service_fee}</span>
                    </div>
                  </div>

                  <div className="card">
                    <div className="title">
                      <span>Service Charge</span>
                    </div>

                    <div className="content">
                      <span>{d.service_charge}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p>NO DATA</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Fees;
