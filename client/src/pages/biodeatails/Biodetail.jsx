import "./bioddetail.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import config from "../../BaseURL";
import axios from "axios";

const Biodetail = () => {
  const navigate = useNavigate();
  const [biodetailData, setBioDetailsData] = useState([]);

  const [loader, setLoader] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    setLoader(true);
    axios
      .get(`${config.apiBaseUrl}backend/getBioSearchDetails.php?bio_id=${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setBioDetailsData(
          response.data.biodetails ? [response.data.biodetails] : []
        );
        setLoader(false);
      })
      .catch((error) => {
        console.log("Error : ", error);
        setLoader(false);
      });
  }, [id]);

  // Handle the back icon click
  const handleBackClick = () => {
    navigate(-1);
  };
  return (
    <>
      <div className="bio-detail-wrapper">
        {loader ? (
          <span className="loader"></span>
        ) : (
          biodetailData.length > 0 &&
          biodetailData.map((detail) => (
            <div className="bio-details" key={detail.bio_id}>
              <div className="topb">
                <div className="leftb">
                  <img
                    src={`${config.apiBaseUrl}backend/ADMIN_PHP/bioimages/${detail.image}`}
                    alt=""
                  />
                </div>

                <div className="rightb">
                  <h3>{detail.name}</h3>
                  <div className="d-wrapper">
                    <span>Scientific name :</span>
                    <h4>{detail.sname}</h4>
                  </div>

                  <div className="d-wrapper">
                    <span>Type :</span>
                    <h4>{detail.type}</h4>
                  </div>

                  {/* <div className="d-wrapper">
                  <p>Endangered Species</p>
                </div> */}

                  <div className="about">
                    <span className="title">About</span>
                    <p>{detail.about}</p>
                    {/* <button>More info...</button> */}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        <i
          class="bi bi-arrow-left-short back-icon2"
          onClick={handleBackClick}
        ></i>

        <div className="botb">
          <p>
            Image courtesy of{" "}
            <a
              href="https://www.inaturalist.org/places/region-v-bicol-region"
              target="_blank"
              rel="noopener noreferrer"
            >
              iNaturalist
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Biodetail;
