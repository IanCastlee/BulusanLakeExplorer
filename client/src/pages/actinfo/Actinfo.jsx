import "./actinfo.scss";
import axios from "axios";

import { Link, useParams } from "react-router-dom";

import pp from "../../assets/user (8).png";
import { useContext, useEffect, useRef, useState } from "react";
import Signup from "../signup/Signup";
import config from "../../BaseURL";
import { SidebarContext } from "../../context/Sidebarcontext";

import { invalidWords } from "../../badwords";

const Actinfo = () => {
  //get activity id from URL
  const { userid, theme } = useContext(SidebarContext);
  useEffect(() => {
    console.log("Current Theme: ", theme);
  }, [theme]);
  const { id } = useParams();
  const messageS = useRef(null);

  const [showInput, setInput] = useState(false);
  const [showAddReview, setShowAddReview] = useState(false);
  const [activity, setActivity] = useState(null);
  const [activities, setActivities] = useState([]);
  const [reviewData, setReviewData] = useState("");
  const [reviews, setReviews] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [loadingDel, setLoadingDel] = useState(false);

  const [isExpanded, setIsExpanded] = useState(false);

  const [rating, setRating] = useState(0);
  const [ratingErr, setRatingErr] = useState("");
  const [feedbackMessge, setFeedbackMessage] = useState("");
  const [showmodalAlreadySent, setShowmodalAlreadySent] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [notefeedbackModal, setnotefeedbackModal] = useState(false);

  const [showModalAllReviews, setshowModalAllReviews] = useState(false);

  const handleStarClick = (value) => {
    setRating(value);
    setRatingErr("");
  };

  const handleMoreClick = (review_id) => {
    if (showMore === review_id) {
      setShowMore(true);
      return;
    }
    setShowMore(review_id);
  };

  //handleDeleteReview

  const handleDeleteReview = (review_id) => {
    setLoadingDel(true);

    const formdata = new FormData();
    formdata.append("review_id", review_id);
    axios
      .post(`${config.apiBaseUrl}backend/deleteReview.php`, formdata, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.success) {
          setReviews((prevReviews) =>
            prevReviews.filter((post) => post.review_id !== review_id)
          );
          setLoadingDel(false);
          fetchReviews();
        } else {
          console.log(response.data.error);
        }
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };

  const chatEndRef = useRef(null); // Reference for the end of chat

  // Function to check for invalid words and return them
  const getInvalidWords = (review) => {
    const words = review.toLowerCase().split(/\s+/);
    const foundWords = words.filter((word) => invalidWords.includes(word));
    return [...new Set(foundWords)]; // Remove duplicates
  };

  //handle change review
  const handleReviewChange = (e) => {
    setReviewData(e.target.value);
    setErrorMessage("");
  };

  //postReview
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    const invalidWordsFound = getInvalidWords(reviewData);

    if (rating === 0) {
      setRatingErr("Please rate first");
      return;
    }

    if (invalidWordsFound.length > 0) {
      setErrorMessage(
        `Your comment contains inappropriate word : '${invalidWordsFound.join(
          "', "
        )}. Please revise it.`
      );
      return;
    }

    const formData = new FormData();
    formData.append("review", reviewData);
    formData.append("rate", rating);
    formData.append("act_id", id);

    try {
      const response = await axios.post(
        `${config.apiBaseUrl}backend/postReview.php`,
        formData,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        fetchReviews();
        setReviewData("");
        setRating(0);
        setShowmodalAlreadySent(true);
        setShowAddReview(false);
        setFeedbackMessage(
          "Your feedback has been sent successfully. Thank you for your cooperation."
        );
        setTimeout(() => {
          setShowmodalAlreadySent(false);
        }, 4000);
      } else {
        if (response.data.message) {
          setFeedbackMessage(response.data.message);
          setShowmodalAlreadySent(true);
          setReviewData("");
          setRating(0);
          setShowAddReview(false);
          setTimeout(() => {
            setShowmodalAlreadySent(false);
          }, 4000);
        } else {
          setErrorMessage(response.data.errors.join(", "));
        }
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  //close signupmodal
  const closeSignupModal = () => {
    setInput(false);
  };

  useEffect(() => {
    axios
      .get(`${config.apiBaseUrl}backend/Actdetails.php?id=${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setActivity(response.data.actid);
      })
      .catch((error) => {
        console.error("Error fetching : ", error);
      });
  }, [id]);

  // Get chats
  // Get chats
  const fetchReviews = () => {
    axios
      .get(`${config.apiBaseUrl}backend/getReviews.php?act_id=${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        const reviews = response.data.reviews;
        setReviews(reviews);
        console.log("reviews  : ", reviews);

        // Calculate the total rating
        const totalRating = reviews.reduce(
          (acc, review) => acc + review.rating,
          0
        );

        // Calculate and format the average rating to one decimal place
        const averageRating = (totalRating / reviews.length || 0).toFixed(1);
        console.log("Average Rating: ", averageRating);

        // You can store the average rating in state if needed
        setAverageRating(averageRating);

        setLoading(false);
      })
      .catch((error) => {
        console.log("error : ", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  //get activities
  useEffect(() => {
    axios
      .get(`${config.apiBaseUrl}backend/getOtherAct.php?id=${id}`)
      .then((response) => {
        setActivities(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching activities:", error);
        setLoading(false);
      });
  }, [id]);

  // Auto-scroll to the bottom when chatData updates
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showAddReview]);

  //if  user signedin

  const handleIfUsersignedIn = () => {
    if (userid === 0) {
      setInput(true);
      setShowAddReview(false);
      setnotefeedbackModal(false);
      set;
    } else {
      setShowAddReview(!showAddReview);
      setInput(false);
      setnotefeedbackModal(false);
    }
  };

  return (
    <>
      <div className={`act-info ${theme}`}>
        <div className="act-info-container">
          {loading ? (
            <span className="loader"></span>
          ) : activity ? (
            <>
              <div className="act-info-wrapper">
                <div className="img-info">
                  <div className="left-wrapper">
                    <img
                      // src={`../../../../backend/uploads/${activity.image}`}
                      src={`${config.apiBaseUrl}backend/ADMIN_PHP/uploads/${activity.image}`}
                      alt=""
                    />
                  </div>

                  <div className="info">
                    <div className="rating-wrapper">
                      <div
                        className="rating"
                        onClick={() => setnotefeedbackModal(true)}
                      >
                        Rating :{" "}
                        {averageRating == 0 ? (
                          ""
                        ) : (
                          <i className="bi bi-star-fill"></i>
                        )}
                        {averageRating == 0 ? (
                          "No feedback yet"
                        ) : (
                          <span> {averageRating} / 5.0</span>
                        )}
                      </div>
                    </div>{" "}
                    <div className="info2">
                      <h6>{activity.name}</h6>
                      <span style={{ display: "flex" }}>
                        <i
                          className="bi bi-tag"
                          tyle={{ marginRight: "5px" }}
                        ></i>{" "}
                        <span>Price</span> - ₱{activity.price} per ride{" "}
                        <p
                          style={{
                            color: "gray",
                            fontSize: "12px",
                            marginLeft: "5px",
                          }}
                        >
                          {activity.name === "Balsa"
                            ? "(max of 8 person)"
                            : activity.name === "Kayak"
                            ? "(for 1 participant)"
                            : activity.name === "Boating"
                            ? "(max of 6 person)"
                            : ""}
                        </p>
                      </span>

                      <p>
                        <i
                          className="bi bi-alarm"
                          style={{ marginRight: "5px" }}
                        ></i>
                        <span>Ride Duration</span> - {activity.duration} minutes
                        {/* per ride */}
                      </p>
                      {activity.discount > 0 && (
                        <p className="discount">
                          <i
                            className="bi bi-bookmark-dash"
                            style={{ marginRight: "5px" }}
                          ></i>
                          {activity.discount}% discount per ride
                        </p>
                      )}

                      <span className="price-details-wrapper">
                        <span className="price-det">
                          Pricing and Reservation Fee
                        </span>
                        <p>{activity.pricing_details}</p>
                      </span>
                    </div>
                    {userid === 0 ? (
                      <button
                        className="btn-book"
                        onClick={() => setInput(true)}
                      >
                        Reserve now{" "}
                      </button>
                    ) : (
                      <Link
                        className="btn-book"
                        to={`/booknow/${activity.act_id}`}
                      >
                        Reserve now
                      </Link>
                    )}
                  </div>
                </div>

                <div className="rating-wrapper">
                  <div
                    className="rating"
                    onClick={() => setnotefeedbackModal(true)}
                  >
                    Rating :{" "}
                    {averageRating == 0 ? (
                      ""
                    ) : (
                      <i className="bi bi-star-fill"></i>
                    )}
                    {averageRating == 0 ? (
                      "No feedback yet"
                    ) : (
                      <span> {averageRating} / 5.0</span>
                    )}
                  </div>
                </div>

                <div className="note">
                  <p>
                    <strong className="ttl">Important notice </strong>{" "}
                    {activity.important_notice}
                  </p>
                </div>

                <p className={`about ${isExpanded ? "expand" : ""}`}>
                  <strong className="ttl">Description </strong>{" "}
                  {activity.description}{" "}
                </p>
                <strong onClick={() => setIsExpanded(!isExpanded)}>
                  {isExpanded ? "Read less" : "Read more"}
                </strong>
              </div>
            </>
          ) : (
            <p>Check you internet connection</p>
          )}

          <div className="other-act-title">
            <span>Other Activities</span>
          </div>
          <div className="other-act">
            <div className="other-act-wrapper">
              {loading ? (
                <span className="loader"></span>
              ) : (
                activities &&
                activities.map((act) => (
                  <div key={act.act_id}>
                    <Link to={`/act-info/${act.act_id}`} className="card">
                      <img
                        src={`${config.apiBaseUrl}backend/ADMIN_PHP/uploads/${act.image}`}
                        alt=""
                      />
                      <span>{act.name}</span>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="feedback">
          <div className="top">
            <div className="left">
              <div className="name-count">
                <span className="a-name">{activity && activity.name}</span>
                <span>
                  {reviews
                    ? "Review" +
                      (reviews.length > 1 ? "s" : "") +
                      " (" +
                      reviews.length +
                      ")"
                    : " (No reviews yet)"}
                </span>
              </div>

              {reviews && reviews.length > 1 && (
                <span
                  className="btn-all-reviews"
                  onClick={() => setshowModalAllReviews(true)}
                >
                  All reviews
                </span>
              )}
            </div>

            <button onClick={handleIfUsersignedIn}>Add feedback</button>
          </div>

          <div className="reviews">
            <div ref={chatEndRef}></div>
            {loading ? (
              <>
                <div className="placeholder-r">
                  <div className="left-pp-name">
                    <div className="imgpp"></div>
                    <div className="namerev"></div>
                  </div>

                  <div className="right-review">
                    <div className="phar"></div>
                    <div className="phar"></div>
                    <div className="phar"></div>
                  </div>
                </div>
                <div className="placeholder-r">
                  <div className="left-pp-name">
                    <div className="imgpp"></div>
                    <div className="namerev"></div>
                  </div>

                  <div className="right-review">
                    <div className="phar"></div>
                    <div className="phar"></div>
                    <div className="phar"></div>
                  </div>
                </div>
                <div className="placeholder-r">
                  <div className="left-pp-name">
                    <div className="imgpp"></div>
                    <div className="namerev"></div>
                  </div>

                  <div className="right-review">
                    <div className="phar"></div>
                    <div className="phar"></div>
                    <div className="phar"></div>
                  </div>
                </div>

                <div className="placeholder-r">
                  <div className="left-pp-name">
                    <div className="imgpp"></div>
                    <div className="namerev"></div>
                  </div>

                  <div className="right-review">
                    <div className="phar"></div>
                    <div className="phar"></div>
                    <div className="phar"></div>
                  </div>
                </div>
              </>
            ) : (
              reviews &&
              reviews.map((review) => (
                <div className="card" key={review.review_id}>
                  <div className="pp-name-review">
                    <img
                      src={
                        review.profilePic
                          ? `${config.apiBaseUrl}backend/uploads/${review.profilePic}`
                          : pp
                      }
                      alt=""
                    />

                    <div className="name-review">
                      <div className="name-wrapper-dot">
                        <span>{review.username}</span>

                        <div className="bot">
                          {review.user_id == userid ? (
                            <i
                              className="bi bi-three-dots-vertical"
                              onClick={() => handleMoreClick(review.review_id)}
                            ></i>
                          ) : (
                            ""
                          )}

                          {showMore === review.review_id && (
                            <div className="more-wrapper">
                              <div className="triangle"></div>
                              <div
                                style={{ cursor: "pointer" }}
                                className="rectangle"
                              >
                                <span
                                  className="remove"
                                  onClick={() =>
                                    handleDeleteReview(review.review_id)
                                  }
                                >
                                  Delete
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="wrating-date">
                        <div className="rating">
                          {[1, 2, 3, 4, 5].map((star, index) => (
                            <i
                              key={index}
                              className={`bi ${
                                star <= review.rating
                                  ? "bi-star-fill"
                                  : "bi-star"
                              }`}
                            ></i>
                          ))}
                        </div>

                        <p>{review.createdAt}</p>
                      </div>
                      <p>{review.review}</p>
                    </div>
                  </div>
                  {/* HEREEEE */}
                </div>
              ))
            )}
          </div>

          {/* <div className="input-wrapper">
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            {showAddReview && (
              <div className="input">
                <textarea
                  name=""
                  placeholder="Add feedback"
                  value={reviewData}
                  onChange={handleReviewChange}
                ></textarea>
                <i
                  className="bi bi-file-arrow-up-fill"
                  onClick={handleSubmitReview}
                ></i>
              </div>
            )}
          </div> */}
        </div>

        <p className={`message ${showInput ? "show" : ""}`} ref={messageS}>
          You need to sign in first
        </p>
      </div>
      {(showInput || notefeedbackModal || showAddReview) && (
        <div className="overlay"></div>
      )}
      {showInput && <Signup closeModal={closeSignupModal} />}
      {/* Rate */}
      {showAddReview && (
        <div className="rate-modal">
          <div className="container">
            <div className="top">
              <span>
                Rate {activity && activity.name} based on your experience
              </span>

              <i
                className="bi bi-x-lg"
                onClick={() => setShowAddReview(false)}
              ></i>
            </div>
            <div className="statement">
              <p>
                Please share your feedback to help us improve and provide a
                better experience for everyone.
              </p>
            </div>

            <div className="rate-star">
              <div className="star">
                <div className="starcount">
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                </div>
                <span>Very Satisfied</span>
              </div>

              <div className="star">
                <div className="starcount">
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                </div>
                <span>Satisfied</span>
              </div>

              <div className="star">
                <div className="starcount">
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                </div>
                <span>Neutral</span>
              </div>

              <div className="star">
                <div className="starcount">
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                </div>
                <span>Unsatisfied</span>
              </div>

              <div className="star">
                <div className="starcount">
                  <i className="bi bi-star-fill"></i>
                </div>
                <span>Very Unsatisfied</span>
              </div>
            </div>

            <div className="rating">
              <h6>Share your feedback</h6>

              <div className="card">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div
                    key={star}
                    className="r"
                    onClick={() => handleStarClick(star)}
                  >
                    <i
                      className={`bi ${
                        rating >= star
                          ? "bi-star-fill text-warning"
                          : "bi-star text-muted"
                      }`}
                    ></i>

                    <p style={{ fontSize: "12px", color: "gray" }}>({star})</p>
                  </div>
                ))}
              </div>
              {ratingErr && (
                <p style={{ color: "red", fontSize: "12px" }}>{ratingErr}</p>
              )}

              <input
                type="number"
                className="rate-number"
                value={rating}
                readOnly
                style={{ display: "none" }}
              />
              {errorMessage && <p className="error-message">{errorMessage}</p>}

              <textarea
                name=""
                value={reviewData}
                onChange={handleReviewChange}
                placeholder="Share your experience"
              ></textarea>
              <button onClick={handleSubmitReview}>Submit Feedback</button>
            </div>
          </div>
        </div>
      )}
      {/* Rate end */}
      {/* already sent feedback */}
      {showmodalAlreadySent && (
        <div className="already">
          <p>{feedbackMessge}</p>
        </div>
      )}
      {/* already sent feedback end*/}
      {notefeedbackModal && (
        <div className="notefeedback">
          <div className="top">
            <span>How rating are calculated</span>
          </div>

          <div className="content">
            <p>
              Ratings are based on recent reviews from people who have
              participated in this activity. Your feedback helps us improve and
              offer better experiences.
            </p>

            <div className="bot">
              <button onClick={handleIfUsersignedIn}>Add feedback</button>
              <button onClick={() => setnotefeedbackModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
      {showModalAllReviews && (
        <div className="all-reviews-modal">
          <div className="top">
            <h6>{activity && activity.name} Reviews</h6>

            <span onClick={() => setshowModalAllReviews(false)}>Close</span>
          </div>
          <div className="content">
            <div className="reviews">
              <div ref={chatEndRef}></div>
              {loading ? (
                <>
                  <div className="placeholder-r">
                    <div className="left-pp-name">
                      <div className="imgpp"></div>
                      <div className="namerev"></div>
                    </div>

                    <div className="right-review">
                      <div className="phar"></div>
                      <div className="phar"></div>
                      <div className="phar"></div>
                    </div>
                  </div>
                  <div className="placeholder-r">
                    <div className="left-pp-name">
                      <div className="imgpp"></div>
                      <div className="namerev"></div>
                    </div>

                    <div className="right-review">
                      <div className="phar"></div>
                      <div className="phar"></div>
                      <div className="phar"></div>
                    </div>
                  </div>
                  <div className="placeholder-r">
                    <div className="left-pp-name">
                      <div className="imgpp"></div>
                      <div className="namerev"></div>
                    </div>

                    <div className="right-review">
                      <div className="phar"></div>
                      <div className="phar"></div>
                      <div className="phar"></div>
                    </div>
                  </div>

                  <div className="placeholder-r">
                    <div className="left-pp-name">
                      <div className="imgpp"></div>
                      <div className="namerev"></div>
                    </div>

                    <div className="right-review">
                      <div className="phar"></div>
                      <div className="phar"></div>
                      <div className="phar"></div>
                    </div>
                  </div>
                </>
              ) : (
                reviews &&
                reviews.map((review) => (
                  <div className="card" key={review.review_id}>
                    <div className="pp-name-review">
                      <img
                        src={
                          review.profilePic
                            ? `${config.apiBaseUrl}backend/uploads/${review.profilePic}`
                            : pp
                        }
                        alt=""
                      />

                      <div className="name-review">
                        <div className="name-wrapper-dot">
                          <span>{review.username}</span>

                          <div className="bot">
                            {review.user_id == userid ? (
                              <i
                                className="bi bi-three-dots-vertical"
                                onClick={() =>
                                  handleMoreClick(review.review_id)
                                }
                              ></i>
                            ) : (
                              ""
                            )}

                            {showMore === review.review_id && (
                              <div className="more-wrapper">
                                <div className="triangle"></div>
                                <div
                                  style={{ cursor: "pointer" }}
                                  className="rectangle"
                                >
                                  <span
                                    className="remove"
                                    onClick={() =>
                                      handleDeleteReview(review.review_id)
                                    }
                                  >
                                    Delete
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="wrating-date">
                          <div className="rating">
                            {[1, 2, 3, 4, 5].map((star, index) => (
                              <i
                                key={index}
                                className={`bi ${
                                  star <= review.rating
                                    ? "bi-star-fill"
                                    : "bi-star"
                                }`}
                              ></i>
                            ))}
                          </div>

                          <p>{review.createdAt}</p>
                        </div>
                        <p>{review.review}</p>
                      </div>
                    </div>
                    {/* HEREEEE */}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      {showModalAllReviews && <div className="all-reviews-modal-overlay"></div>}{" "}
    </>
  );
};

export default Actinfo;
