import React, { useEffect, useState } from "react";
import axios from "axios";
import "./index.scss";

import bgimage from "../../assets/bg.jpg";
import Sidebar from "../../components/sidebar/Sidebar";
import { Link } from "react-router-dom";
import config from "../../BaseURL";

const Index = ({ showSidebar2, setSidebar, notifCount }) => {
  const [activities, setActivities] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerPage = 3;
  const slideInterval = 5000; // 5 seconds

  useEffect(() => {
    axios
      .get(`${config.apiBaseUrl}backend/getActivities.php`) // Replace with your actual endpoint
      .then((response) => {
        setActivities(response.data); // Assuming your PHP returns JSON array of activities
      })
      .catch((error) => {
        console.error("Error fetching activities:", error);
      });
  }, []); // Empty dependency array ensures this runs once on component mount

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % activities.length);
    }, slideInterval);
    return () => clearInterval(interval);
  }, [activities.length]);

  const handleNext = () => {
    if (currentPage < Math.ceil(activities.length / itemsPerPage) - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const displayedActivities = activities.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className="index-main">
      <Sidebar
        showSidebar2={showSidebar2}
        setSidebar={setSidebar}
        notifCount={notifCount}
      />
      <div className="index-content">
        <div className="bg-img">
          <div className="overlay-bg">
            <div className="banner-wrapper">
              <p>Do you wan't to experience being prioritized?</p>
              <button className="btn-booknow">Book Now</button>
            </div>
          </div>
          {activities.length > 0 ? (
            <img
              src={`${config.apiBaseUrl}backend/ADMIN_PHP/uploads/${activities[currentSlide].image}`}
              alt="Slideshow"
            />
          ) : (
            <img src={bgimage} alt="Background" />
          )}
        </div>

        <div className="act-wrapper">
          <h6>Available Lake Activities</h6>

          <div className="activities">
            {currentPage > 0 && (
              <i
                className="bi bi-chevron-compact-left left_icon"
                onClick={handlePrev}
              ></i>
            )}
            {displayedActivities.map((activity) => (
              <Link
                to={`/act-info/${activity.act_id}`}
                key={activity.act_id}
                className="card"
              >
                <img
                  src={`${config.apiBaseUrl}backend/ADMIN_PHP/uploads/${activity.image}`}
                  alt={activity.name}
                />
                <span>{activity.name}</span>
              </Link>
            ))}
            {currentPage < Math.ceil(activities.length / itemsPerPage) - 1 && (
              <i
                className="bi bi-chevron-compact-right right_icon"
                onClick={handleNext}
              ></i>
            )}
          </div>
        </div>

        <div className="map_w">
          <iframe
            width="100%"
            height="400"
            frameorder="0"
            id="gmap_canvas"
            src="https://maps.google.com/maps?width=550&amp;height=400&amp;hl=en&amp;q=bulusan%20Lake%20Philippines+()&amp;t=&amp;z=12&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
          ></iframe>
          <a href="https://masterarbeitschreiben.com/">
            Masterarbeit Ghostwriter
          </a>
          <script
            type="text/javascript"
            src="https://embedmaps.com/google-maps-authorization/script.js?id=91da756ab627eac722b31fb6cf350f170601b393"
          ></script>
        </div>
      </div>
    </div>
  );
};

export default Index;
