import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./index.scss";
import bgimage from "../../assets/bg.jpg";
import map from "../../assets/lakemap2.jpg";
import Sidebar from "../../components/sidebar/Sidebar";
import { Link } from "react-router-dom";
import config from "../../BaseURL";
import eyybot from "../../assets/chatbot.png";
import { SidebarContext } from "../../context/Sidebarcontext";
import canteen from "../../assets/gps.png";
import image1 from "../../assets/gps.png";
import image2 from "../../assets/gps.png";
import lsIcon from "../../assets/screen (2).png";
import annoucnemnticon from "../../assets/megaphone.png";
import virticon from "../../assets/virtual-tour (1).png";

const Index = ({ showSidebar2, setSidebar, notifCount, handleFullscreen }) => {
  const { userid } = useContext(SidebarContext);

  const [activities, setActivities] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerPage = 5;
  const slideInterval = 7000;

  const [mapInteractionDisabled, setMapInteractionDisabled] = useState(false);

  const [selectedContent, setSelectedContent] = useState(null);
  const [selectedContent2, setSelectedContent2] = useState(null);
  const [selectedContent3, setSelectedContent3] = useState(null);
  const [selectedContent4, setSelectedContent4] = useState(null);
  const [selectedContent5, setSelectedContent5] = useState(null);

  const [contentType, setContentType] = useState(null);
  const [contentType2, setContentType2] = useState(null);
  const [contentType3, setContentType3] = useState(null);
  const [contentType4, setContentType4] = useState(null);
  const [contentType5, setContentType5] = useState(null);

  const [showModalLandScapeMsg, setshowModalLandScapeMsg] = useState(false);

  const [data, setData] = useState([]);

  const [showViewAnnoncement, setshowViewAnnoncement] = useState(false);

  const handleBotClick = () => {
    setMapInteractionDisabled(true);
  };

  useEffect(() => {
    axios
      .get(`${config.apiBaseUrl}backend/getActivities.php`)
      .then((response) => {
        const activitiesWithSayings = response.data.map((activity) => {
          return activity;
        });
        setActivities(activitiesWithSayings);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching activities:", error);
        setLoading(false);
      });
  }, []);

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

  const handleCardClick = (index) => {
    setCurrentSlide(index);
  };

  const displayedActivities = activities.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleDotClick = (content, type) => {
    setContentType(type);
    setSelectedContent(content);
    handleFullscreen();

    setTimeout(() => {
      setshowModalLandScapeMsg(true);

      setTimeout(() => {
        setshowModalLandScapeMsg(false);
      }, 7000); // Hide after 7 seconds
    }, 5000); // Show after 5 seconds
  };

  const closePanorama = () => {
    window.location.reload();
  };

  /////////////////////2
  const handleDotClick2 = (content, type) => {
    setContentType2(type);
    setSelectedContent2(content);
    handleFullscreen();

    setTimeout(() => {
      setshowModalLandScapeMsg(true);

      setTimeout(() => {
        setshowModalLandScapeMsg(false);
      }, 7000); // Hide after 7 seconds
    }, 5000); // Show after 5 seconds
  };

  const closePanorama2 = () => {
    setSelectedContent2(null);
    setContentType2(null);
  };

  /////////////////////3
  const handleDotClick3 = (content, type) => {
    setContentType3(type);
    setSelectedContent3(content);
    handleFullscreen();

    setTimeout(() => {
      setshowModalLandScapeMsg(true);

      setTimeout(() => {
        setshowModalLandScapeMsg(false);
      }, 7000); // Hide after 7 seconds
    }, 5000); // Show after 5 seconds
  };

  const closePanorama3 = () => {
    setSelectedContent3(null);
    setContentType3(null);
  };

  /////////////////////4
  const handleDotClick4 = (content, type) => {
    setContentType4(type);
    setSelectedContent4(content);
    handleFullscreen();

    setTimeout(() => {
      setshowModalLandScapeMsg(true);

      setTimeout(() => {
        setshowModalLandScapeMsg(false);
      }, 7000); // Hide after 7 seconds
    }, 5000); // Show after 5 seconds
  };

  const closePanorama4 = () => {
    setSelectedContent4(null);
    setContentType4(null);
  };

  /////////////////////5
  const handleDotClick5 = (content, type) => {
    setContentType5(type);
    setSelectedContent5(content);
    handleFullscreen();

    setTimeout(() => {
      setshowModalLandScapeMsg(true);

      setTimeout(() => {
        setshowModalLandScapeMsg(false);
      }, 7000); // Hide after 7 seconds
    }, 5000); // Show after 5 seconds
  };

  const closePanorama5 = () => {
    setSelectedContent5(null);
    setContentType5(null);
  };

  //announcement

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

  //handleLandscapeMode
  const handleLandscapeMode = async () => {
    try {
      if (screen.orientation) {
        // Lock the screen orientation to landscape
        await screen.orientation.lock("landscape");
        console.log("Screen locked to landscape mode");
      } else {
        console.error(
          "Screen Orientation API is not supported on this device."
        );
      }
    } catch (error) {
      console.error("Failed to lock screen orientation:", error);
    }
  };

  return (
    <>
      <div className="index-main">
        <div className="sidebar-wrapper">
          <Sidebar
            showSidebar2={showSidebar2}
            setSidebar={setSidebar}
            notifCount={notifCount}
          />
        </div>

        <div className="index-content">
          <div className="bg-img">
            <div className="overlay-bg">
              {data.length > 0 &&
                data.map((d) => (
                  <div className="announcement2" key={d.announcement_id}>
                    <img
                      className="wiggle-img"
                      src={annoucnemnticon}
                      alt=""
                      onClick={() =>
                        setshowViewAnnoncement(!showViewAnnoncement)
                      }
                    />
                    <p
                      onClick={() =>
                        setshowViewAnnoncement(!showViewAnnoncement)
                      }
                    >
                      {data.length} announcemnt{data.length > 1 ? "s" : ""}
                    </p>
                  </div>
                ))}

              <div className="banner-wrapper">
                {activities && activities[currentSlide] && (
                  <>
                    <p>{activities[currentSlide].tagline}</p>

                    {activities[currentSlide].discount > 0 && (
                      <span className="discount">
                        Use our app to reserve a {activities[currentSlide].name}{" "}
                        and get {activities[currentSlide].discount}% discount
                        today
                      </span>
                    )}
                    <Link
                      className="btn-booknow"
                      to={`/act-info/${activities[currentSlide].act_id}`}
                    >
                      Reserve Now
                    </Link>
                  </>
                )}
                {activities.length === 0 && (
                  <>
                    <p>Do you want to experience being prioritized?</p>
                    <button className="btn-booknow">Book Now</button>
                  </>
                )}
              </div>

              <div className="act-wrapper">
                <div className="activities">
                  {currentPage > 0 && (
                    <i
                      className="bi bi-chevron-compact-left left_icon"
                      onClick={handlePrev}
                    ></i>
                  )}

                  {loading ? (
                    <span className="loader"></span>
                  ) : (
                    displayedActivities.map((activity, index) => (
                      <Link
                        key={activity.act_id}
                        className={`card ${
                          activity.image === activities[currentSlide].image
                            ? "large-card"
                            : ""
                        }`}
                        onClick={() =>
                          handleCardClick(
                            activities.findIndex(
                              (a) => a.act_id === activity.act_id
                            )
                          )
                        }
                      >
                        <img
                          src={`${config.apiBaseUrl}backend/ADMIN_PHP/uploads/${activity.image}`}
                          alt={activity.name}
                        />
                        <span>{activity.name}</span>
                      </Link>
                    ))
                  )}
                  {currentPage <
                    Math.ceil(activities.length / itemsPerPage) - 1 && (
                    <i
                      className="bi bi-chevron-compact-right right_icon"
                      onClick={handleNext}
                    ></i>
                  )}
                </div>
              </div>

              <div className="open-wrapper">
                <p>Open Monday to Sunday </p>
                <span>(7:00 AM to 5:00 PM)</span>
              </div>

              {/* annoncement */}
              <div className="announcement">
                <div className="announcement-top">
                  <img
                    src={annoucnemnticon}
                    alt=""
                    className="wiggle-img"
                    onClick={() => setshowViewAnnoncement(!showViewAnnoncement)}
                  />
                  <h3>Bulusan Lake announcement</h3>
                </div>

                {data.length > 0 ? (
                  <>
                    {/* Display the first announcement */}
                    <div className="content" key={data[0].announcement_id}>
                      <div className="title-wrapper">
                        <i className="bi bi-megaphone-fill loud"></i>
                        <span className="title">{data[0].ttl}</span>
                      </div>
                      <div className="announcement-wrapper">
                        <p>{data[0].announcement}</p>
                      </div>

                      <div className="bot">
                        <p>Date posted : {formatDate(data[0].createdAt)}</p>
                      </div>

                      {data.length > 1 && (
                        <p
                          className="other-announcement"
                          onClick={() => setshowViewAnnoncement(true)}
                        >
                          {data.length - 1} more announcement
                          {data.length > 2 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <p>NO DATA</p>
                )}
              </div>
              {/* announcemet */}
            </div>
            {activities.length > 0 && activities[currentSlide] ? (
              <div className="slideshow">
                <img
                  src={`${config.apiBaseUrl}backend/ADMIN_PHP/uploads/${activities[currentSlide].image}`}
                  alt="Slideshow"
                />
              </div>
            ) : (
              <img src={bgimage} alt="Background" />
            )}
          </div>

          <div className="map-container">
            <div className="t">
              <img src={virticon} alt="" />
              <span className="loader"></span>{" "}
            </div>

            <img src={map} alt="Map" className="map" />

            <div
              className="dot1"
              onClick={() =>
                handleDotClick(
                  "https://tour.panoee.net/iframe/672ae6d08484f37faf2831f3",
                  "iframe"
                )
              }
            >
              <span>Entrance</span>
              <img src={canteen} alt="" className="image1" />
              {(selectedContent ||
                selectedContent2 ||
                selectedContent3 ||
                selectedContent4 ||
                selectedContent5) && (
                <div className="landscape-wrapper">
                  {/* <img
                    src={lsIcon}
                    className="dot1LsIcon"
                    alt="Landscape Icon"
                    onClick={handleLandscapeMode}
                    style={{ cursor: "pointer" }}
                  /> */}

                  <i
                    style={{ color: "yellow" }}
                    className="bi bi-x-lg"
                    onClick={closePanorama}
                  ></i>
                </div>
              )}
            </div>
            <div
              className="dot2"
              onClick={() =>
                handleDotClick2(
                  "https://tour.panoee.net/iframe/66f75b67ae7bdf2a0286e09b",
                  "iframe"
                )
              }
            >
              <span>Hanging Bridge</span>
              <img src={image1} alt="" className="image2" />
            </div>
            <div
              className="dot3"
              onClick={() =>
                handleDotClick3(
                  "https://tour.panoee.net/iframe/672c5909dbbf7af7d6fb6fa7",
                  "iframe"
                )
              }
            >
              <span>Fishing Spot1</span>

              <img src={image2} alt="" className="image3" />
            </div>

            <div
              className="dot4"
              onClick={() =>
                handleDotClick4(
                  "https://tour.panoee.net/673451d2499a4035c20c3f10",
                  "iframe"
                )
              }
            >
              <span>Fishing Spot2</span>

              <img src={image2} alt="" className="image4" />
            </div>

            <div
              className="dot5"
              onClick={() =>
                handleDotClick5(
                  "https://tour.panoee.net/67345843499a40871e0c3fa0",
                  "iframe"
                )
              }
            >
              <span>Dancing</span>

              <img src={image2} alt="" className="image4" />
            </div>

            {selectedContent && (
              <div className="content-container" onClick={closePanorama}>
                {contentType === "iframe" ? (
                  <iframe
                    id="tour-embeded"
                    name="hanging bridge"
                    src="https://tour.panoee.net/iframe/672ae6d08484f37faf2831f3"
                    frameBorder="0"
                    width="100%"
                    height="100%"
                    scrolling="no"
                    allowvr="yes"
                    allow="vr; xr; accelerometer; gyroscope; autoplay;"
                    allowFullScreen={false}
                    webkitallowfullscreen="false"
                    mozallowfullscreen="false"
                    loading="eager"
                  ></iframe>
                ) : (
                  <img
                    src={selectedContent}
                    alt="Panorama"
                    className="panorama-image"
                  />
                )}
              </div>
            )}

            {selectedContent2 && (
              <div className="content-container" onClick={closePanorama2}>
                {contentType2 === "iframe" ? (
                  <iframe
                    id="tour-embeded"
                    name="hanging bridge"
                    src="https://tour.panoee.net/iframe/67036f22219b793b2af73318"
                    frameBorder="0"
                    width="100%"
                    height="100%"
                    scrolling="no"
                    allowvr="yes"
                    allow="vr; xr; accelerometer; gyroscope; autoplay;"
                    allowFullScreen={false}
                    webkitallowfullscreen="false"
                    mozallowfullscreen="false"
                    loading="eager"
                  ></iframe>
                ) : (
                  <img
                    src={selectedContent2}
                    alt="Panorama"
                    className="panorama-image"
                  />
                )}
              </div>
            )}

            {selectedContent3 && (
              <div className="content-container" onClick={closePanorama3}>
                {contentType3 === "iframe" ? (
                  <iframe
                    id="tour-embeded"
                    name="hanging bridge"
                    src="https://tour.panoee.net/672c5909dbbf7af7d6fb6fa7"
                    frameBorder="0"
                    width="100%"
                    height="100%"
                    scrolling="no"
                    allowvr="yes"
                    allow="vr; xr; accelerometer; gyroscope; autoplay;"
                    allowFullScreen={false}
                    webkitallowfullscreen="false"
                    mozallowfullscreen="false"
                    loading="eager"
                  ></iframe>
                ) : (
                  <img
                    src={selectedContent3}
                    alt="Panorama"
                    className="panorama-image" // This class will now apply the zoom effect
                  />
                )}
              </div>
            )}

            {selectedContent4 && (
              <div className="content-container" onClick={closePanorama4}>
                {contentType4 === "iframe" ? (
                  <iframe
                    id="tour-embeded"
                    name="hanging bridge"
                    src="https://tour.panoee.net/673451d2499a4035c20c3f10"
                    frameBorder="0"
                    width="100%"
                    height="100%"
                    scrolling="no"
                    allowvr="yes"
                    allow="vr; xr; accelerometer; gyroscope; autoplay;"
                    allowFullScreen={false}
                    webkitallowfullscreen="false"
                    mozallowfullscreen="false"
                    loading="eager"
                  ></iframe>
                ) : (
                  <img
                    src={selectedContent4}
                    alt="Panorama"
                    className="panorama-image" // This class will now apply the zoom effect
                  />
                )}
              </div>
            )}
            {selectedContent5 && (
              <div className="content-container" onClick={closePanorama5}>
                {contentType5 === "iframe" ? (
                  <iframe
                    id="tour-embeded"
                    name="hanging bridge"
                    src="https://tour.panoee.net/67345843499a40871e0c3fa0"
                    frameBorder="0"
                    width="100%"
                    height="100%"
                    scrolling="no"
                    allowvr="yes"
                    allow="vr; xr; accelerometer; gyroscope; autoplay;"
                    allowFullScreen={false}
                    webkitallowfullscreen="false"
                    mozallowfullscreen="false"
                    loading="eager"
                  ></iframe>
                ) : (
                  <img
                    src={selectedContent5}
                    alt="Panorama"
                    className="panorama-image" // This class will now apply the zoom effect
                  />
                )}
              </div>
            )}
          </div>

          <div className="about-us">
            <div className="top">
              <h6>About Us</h6>
            </div>

            <div className="content">
              <span>Welcome to Bulusan Lake Explorer!</span>
              <p>
                Nestled in the heart of Sorsogon, the beautiful Bulusan Lake
                offers a peaceful retreat amidst nature's wonders. Surrounded by
                lush forests, the crystal-clear waters of the lake provide the
                perfect backdrop for relaxation and adventure. Whether you're
                looking for a serene escape or an active exploration, Bulusan
                Lake is a must-visit destination. <br />
                At Bulusan Lake Explorer, we offer a variety of activities to
                help you connect with nature, such as scenic boat rides, nature
                hikes, and cultural tours. Our mission is to provide an
                unforgettable experience while supporting the local community
                and conservation efforts in Sorsogon. <br />
              </p>
            </div>

            <div className="map_w">
              <iframe
                width="100%"
                height="200"
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
          <div className="footer">
            <div className="top">
              <span>Contact Us</span>
            </div>

            <div className="content">
              <div className="rightt">
                <span>📍 Location: Bulusan Sorsogon, Philippines</span>
                <span>📞 Phone: +63 960 505 0988</span>
                <span>📧 Email: bulusanlake4704@gmail.com</span>{" "}
              </div>

              <div className="left">
                <div className="title">
                  <h6>🌐 Follow Us</h6>
                </div>
                <a
                  href="https://web.facebook.com/bulusanlake/?_rdc=1&_rdr#"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <span>
                    <i
                      className="bi bi-facebook"
                      style={{ color: "blue", fontSize: "14px" }}
                    ></i>{" "}
                    Facebook
                  </span>
                </a>{" "}
                <br />
                <a
                  href="https://www.instagram.com/explore/locations/258605306/bulusan-lakebulusan-sorsogon/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <span>
                    <i
                      className="bi bi-instagram"
                      style={{ color: "orange", fontSize: "14px" }}
                    ></i>{" "}
                    Instagram
                  </span>
                </a>
              </div>
            </div>
            <div className="bot">
              <span>
                © 2024 Bulusan Lake Explorer. All rights reserved. Developed by
                SalTech
              </span>
            </div>
          </div>
        </div>
      </div>
      {userid != 0 && (
        <Link to="/message/" className="ask-eyybot" onClick={handleBotClick}>
          <div className="span" to="/message/">
            Ask BuluBot
          </div>
          <img src={eyybot} alt="" />
        </Link>
      )}

      {showViewAnnoncement && (
        <div className="view-more-announcement">
          <div className="announcement-top">
            <h3>Bulusan Lake announcement</h3>
            <i
              className="bi bi-x-lg close2"
              onClick={() => setshowViewAnnoncement(false)}
            ></i>
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
                  <p>Date posted : {d.createdAt}</p>
                </div>
              </div>
            ))
          ) : (
            <p>NO DATA</p>
          )}
        </div>
      )}
      {showViewAnnoncement && <div className="overlay-ann"></div>}

      {showModalLandScapeMsg && (
        <div className="landscape-mode">
          <p>For a better experience, use landscape mode on your device.</p>
        </div>
      )}
    </>
  );
};

export default Index;
