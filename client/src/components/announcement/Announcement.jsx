import React, { useEffect, useState } from "react";
import "./announcement.scss";
import axios from "axios";
import config from "../../BaseURL";

const Announcement = ({ close }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`${config.apiBaseUrl}backend/getAnnouncement.php`, {
        withCredentials: true,
      })
      .then((response) => {
        setData(response.data);
        console.log("announcement : ", response.data);
      })
      .catch((error) => {
        console.log("error : ", "Failed to fetch data", error);
      });
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="announcement">
      <div className="announcement-top">
        <h3>Bulusan Lake announcement</h3>

        <i className="bi bi-x-lg close2" onClick={close}></i>
      </div>

      {data.length > 0 ? (
        data.map((d) => (
          <div className="content" key={d.announcement_id}>
            <div className="title-wrapper">
              <i className="bi bi-megaphone-fill loud"></i>
              <span className="title">{d.ttl}</span>
            </div>
            <div className="announcement-wrapper">
              <p>{d.announcement}</p>
            </div>

            <div className="bot">
              <p>Date posted : {formatDate(d.createdAt)}</p>
            </div>
          </div>
        ))
      ) : (
        <p>NO DATA</p>
      )}
    </div>
  );
};

export default Announcement;
