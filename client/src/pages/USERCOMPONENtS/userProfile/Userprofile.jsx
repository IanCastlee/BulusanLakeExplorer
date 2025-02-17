import "./userprofile.scss";
import cp from "../../../assets/bg.jpg";
import pp from "../../../assets/user (8).png";

import { Link, useNavigate, useParams } from "react-router-dom"; // Import useHistory
import axios from "axios";
import config from "../../../BaseURL";
import { useContext, useEffect, useState } from "react";
import { SidebarContext } from "../../../context/Sidebarcontext";
import { CommentCountContext } from "../../../context/CommentCountProvider ";
import Commentt from "../../../components/comment/Commentt";
import { Upload } from "../../../components/upload/Upload";

const Userprofile = () => {
  const { id } = useParams();

  const [userBookingData, setBookingData] = useState([]);

  const [showPost, setShowPost] = useState(true);
  const [showBook, setBook] = useState(false);
  const [showUpdate, setUpdate] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  const { userid, setData2 } = useContext(SidebarContext);
  const [data, setData] = useState([]);

  const [chosenImage, setChosenImage] = useState(null);
  const [chosenImageURLPP, setChosenImageURLPP] = useState(null);
  const [showUpdateProfileModal, setShowUpdateProfileModal] = useState(false);

  const [chosenImageCP, setChosenImageCP] = useState(null);
  const [chosenImageURLCP, setChosenImageURLCP] = useState(null);

  const [showActionModal, setShowActionModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [showModalValidIdImg, setShowModalValidIdImg] = useState(false);
  const [validIdImg, setValidIdImg] = useState(false);

  ////////////////////////userpost////////////////////////////

  const [showInput, setInput] = useState(false);
  //close signupmodal
  const closeSignupModal = () => {
    setInput(false);
  };

  const [showRight, setRight] = useState(false);
  // const [showUpload, setUpload] = useState(false);
  const [showSignIn, setShowSignin] = useState(false);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showResponse, setShowResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDel, setLoadingDel] = useState(false);

  const [showModalReport, setShowModalReport] = useState(false);

  const [showModalMore, setShowModalMore] = useState(false);

  const [showDletetedMsg, setshowDletetedMsg] = useState(false);

  const { commentCount } = useContext(CommentCountContext);
  const [reportMsg, setReportMsg] = useState("");
  const [textareaValue, setTextareaValue] = useState("");
  const [report, setReport] = useState({
    post_id: "",
    user_id: "",
  });

  const [expandedCaptions, setExpandedCaptions] = useState({});

  const toggleExpand = (postId) => {
    setExpandedCaptions((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId], // Toggle the specific post's expanded state
    }));
  };

  // Function to handle the click event
  const handleReasonClick = () => {
    setTextareaValue("Not related to Bulusan lake");
  };

  //selectedPostToReport
  const selectedPostToReport = (post_id, user_id) => {
    setReport({ post_id, user_id });
    setShowModalReport(true);
  };

  //handlePostReport
  const handlePostReport = async (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("report", textareaValue);
    formdata.append("post_id", report.post_id);
    formdata.append("user_id", report.user_id);

    axios
      .post(`${config.apiBaseUrl}backend/postReport.php`, formdata, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data.success);
        setTextareaValue("");
        setReport({
          post_id: "",
          user_id: "",
        });
        setShowModalReport(false);
        setReportMsg(response.data.message);
        setTimeout(() => {
          setReportMsg(false);
        }, 3000);
      })
      .catch((error) => {
        console.log("Error : ", error);
      });
  };

  const handleMoreClick = (post_id) => {
    if (showModalMore === post_id) {
      setShowModalMore(true);
      return;
    }
    setShowModalMore(post_id);
  };

  const handleClickUpload = () => {
    if (userid === 0) {
      setShowSignin(true);
      setUpload(false);
    } else {
      setShowSignin(false);
      setUpload(true);
    }
  };

  const handleGetPost = () => {
    axios
      .get(`${config.apiBaseUrl}backend/getUserFeedPosts.php?userId=${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setPosts(response.data.posts);
        setLoading(false);
        console.log("response.data.posts:", response.data.posts);

        // Log comment_count for each post
        response.data.posts.forEach((post) => {
          console.log(
            "comment_count for post",
            post.post_id,
            ":",
            post.comment_count
          );
        });
      })
      .catch((errors) => {
        setLoading(false);
        console.error("Error fetching posts:", errors);
      });
  };

  useEffect(() => {
    handleGetPost();
  }, [commentCount]);

  const getImageClass = (imageCount) => {
    if (imageCount === 1) return "one";
    if (imageCount === 2) return "two";
    if (imageCount === 3) return "three";
    if (imageCount === 4) return "four";
    return "five";
  };

  const handleCommentClick = (post_id) => {
    setSelectedPost(post_id);
    setRight(true);
  };

  const handleLikePost = (post_id) => {
    console.log("user ID click : ", userid);
    if (userid === 0) {
      // User is not signed in
      setShowResponse({
        post_id,
        message: (
          <span
            style={{
              fontWeight: "bold",
              color: "blue",
              fontSize: "14px",
            }}
            onClick={() => setShowSignin(true)}
          >
            Sign In First
          </span>
        ),
      });
      setTimeout(() => {
        setShowResponse(null);
      }, 5000);
      return; // Exit the function early
    }

    const formData = new FormData();
    formData.append("post_id", post_id);
    axios
      .post(`${config.apiBaseUrl}backend/postLike.php`, formData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.success) {
          setPosts((prevPosts) =>
            prevPosts.map((post) => {
              if (post.post_id === post_id) {
                const likesCountAdjustment = response.data.liked ? 1 : -1;

                if (response.data.liked) {
                  setShowResponse({ post_id, message: "" });
                  setTimeout(() => {
                    setShowResponse(null);
                  }, 3000);
                }
                return {
                  ...post,
                  likes_count: post.likes_count + likesCountAdjustment,
                  user_liked: response.data.liked,
                };
              }
              return post;
            })
          );
        } else {
          console.log(response.data.error);
        }
      })
      .catch((error) => {
        console.log("Error : ", error);
      });
  };

  //handleDeletePost
  const handleDeletePost = (post_id) => {
    setLoadingDel(true);

    const formdata = new FormData();
    formdata.append("post_id", post_id);
    axios
      .post(`${config.apiBaseUrl}backend/deletePost.php`, formdata, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.success) {
          setPosts((prevPosts) =>
            prevPosts.filter((post) => post.post_id !== post_id)
          );
          setLoadingDel(false);
          setShowModalMore(false);
          setshowDletetedMsg(true);
          setTimeout(() => {
            setshowDletetedMsg(false);
          }, 2000);
        } else {
          console.log(response.data.error);
        }
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };

  /////////////////////////////userpost///////////////////////////////

  const clickValidId = (validIdImg) => {
    setValidIdImg(validIdImg);
    setShowModalValidIdImg(true);
  };

  const [chosenImageValidID, setChosenImageValidID] = useState(null);
  const [chosenImageURLValidID, setChosenImageURLValidID] = useState(null);
  // handleFileChange3
  const handleFileChange3 = (event) => {
    const file = event.target.files[0];
    if (file) {
      setChosenImageValidID(file);
      setChosenImageURLValidID(URL.createObjectURL(file));
    }
  };

  const [updatedMsg, setUpdatedMsg] = useState("");

  const [userData, setUserData] = useState({
    fullname: "",
    username: "",
    address: "",
    email: "",
  });

  //fetch userInfo and make as value of each field
  useEffect(() => {
    if (userInfo) {
      setUserData({
        fullname: userInfo.fullname,
        username: userInfo.username,
        address: userInfo.address,
        email: userInfo.email,
      });
    }
  }, [userInfo]);

  //handleChangeProfileInfo
  const handleChangeProfileInfo = (e) => {
    const { name, value } = e.target;

    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitUserData = async (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("fullname", userData.fullname);
    formdata.append("username", userData.username);
    formdata.append("address", userData.address);
    formdata.append("image", chosenImageValidID);

    console.log("____", chosenImageValidID);

    axios
      .post(`${config.apiBaseUrl}backend/updateUserInfo.php`, formdata, {
        withCredentials: true,
      })
      .then((response) => {
        //   console.log("STATUS :", response.data.success);
        setUpdatedMsg(response.data.msg);

        setTimeout(() => {
          setUpdatedMsg("");
          window.location.reload();
        }, 2000);
        console.log("====", response.data);
      })
      .catch((error) => {
        console.log("====gg", response.data);

        console.log("Errror : ", error);
      });
  };

  const navigate = useNavigate();

  //handleFileChangePP
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setChosenImage(file);
      setChosenImageURLPP(URL.createObjectURL(file));
      setShowUpdateProfileModal(true);
    }
  };
  //handleFileChangeCP
  const handleFileChangeCP = (event) => {
    const file = event.target.files[0];
    if (file) {
      setChosenImageCP(file);
      setChosenImageURLCP(URL.createObjectURL(file));
    }
  };

  //handlePostProfile
  const handlePostProfile = async (e) => {
    e.preventDefault();

    if (chosenImage) {
      const formData = new FormData();
      formData.append("image", chosenImage);

      try {
        const response = await axios.post(
          `${config.apiBaseUrl}backend/uploadProfileImage.php`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );

        if (response.data.success) {
          console.log("Profile image uploaded successfully");
          setShowUpdateProfileModal(false);
          window.location.reload();
        } else {
          console.error(
            "Error uploading profile image:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Error uploading profile image:", error);
      }
    } else {
      console.log("No image selected");
    }
  };
  //handlePostCoverPhoto
  const handlePostCoverPhoto = async (e) => {
    e.preventDefault();

    if (chosenImageCP) {
      const formData = new FormData();
      formData.append("image", chosenImageCP);

      try {
        const response = await axios.post(
          `${config.apiBaseUrl}backend/uploadCoverImage.php`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );

        if (response.data.success) {
          console.log("Cover image uploaded successfully");
          setChosenImageURLCP(null);
          window.location.reload();
        } else {
          console.error(
            "Error uploading profile image:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Error uploading profile image:", error);
      }
    } else {
      console.log("No image selected");
    }
  };
  // console.log(userInfo);
  ////////////////////////////////////
  // GET APPROVED BOOKING
  useEffect(() => {
    axios
      .get(`${config.apiBaseUrl}backend/getPreviousBooked.php?id=${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setBookingData(response.data);
        //   console.log("Approved bookings: ", response.data);
      })
      .catch((error) => {
        console.log("Error fetching approved bookings: ", error);
      });
  }, [id]);

  // Calculate total approved price whenever userBookingData changes

  //showPostsContent
  const showPostsContent = () => {
    setUpdate(false);
    setBook(false);
    setShowPost(true);
  };

  useEffect(() => {
    setUpdate(false);
    setBook(false);
    setShowPost(true);
  }, [id]);

  //showBookContent
  const showBookContent = () => {
    setUpdate(false);
    setBook(true);
    setShowPost(false);
  };

  //showUpdateContent
  const showUpdateContent = () => {
    setUpdate(true);
    setBook(false);
    setShowPost(false);
  };

  //handleGetUserPost
  const handleGetUserPost = () => {
    axios
      .get(
        `${config.apiBaseUrl}backend/getUserPosts.php`, // Base URL
        {
          params: { userid: id }, // Pass the id as a query parameter
          withCredentials: true, // Include credentials if needed
        }
      )
      .then((response) => {
        setData(response.data.myposts);
        setData2(response.data.myposts);
        console.log("Hello", response.data.myposts);
      })
      .catch((error) => {
        console.log("Error : ", error);
      });
  };

  useEffect(() => {
    handleGetUserPost();
    setShowPost(true);
  }, [id]);

  //back
  const handleBackClick = () => {
    navigate(-1); // Navigate back by one step in the history
  };

  //handleDeactivateAcc
  const [status, setStatus] = useState(null);

  const handleDeactivateAcc = () => {
    const idData = new FormData();
    idData.append("id", id);
    axios
      .post(`${config.apiBaseUrl}backend/updateDeactivateAcc.php`, idData, {
        withCredentials: true,
      })
      .then((response) => {
        //   console.log(response.data.success);
        //   console.log("<Message>", response.data.message);
        //   console.log(response.data);
        setStatus(response.data.message);
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}backend/logout.php`,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        window.location.href = "/";
      } else {
        console.error("Logout failed: ", response.data.message);
      }
    } catch (error) {
      console.log("Error in logging out", error);
    }
  };

  //handleDeleteAccount
  const handleDeleteAccount = () => {
    const idData = new FormData();
    idData.append("id", id);
    axios
      .post(`${config.apiBaseUrl}backend/deleteUserAcc.php`, idData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.success) {
          handleLogout();
        }
      })

      .catch((error) => {
        console.log("Error: ", error);
      });
  };

  //fetchUserData

  const fetchUserData = () => {
    axios
      .get(`${config.apiBaseUrl}backend/userid2.php?user_id=${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.userInfo && response.data.userid) {
          setUserInfo(response.data.userInfo);
          //   setUserId(response.data.userid);
          console.log("+++++", response.data.userInfo);
        } else {
          console.error("Statud : User not signed in");
        }
      })
      .catch((error) => {
        console.error("Error fetching user info:", error);
      });
  };

  useEffect(() => {
    fetchUserData();
  }, [id]);

  console.log("User ID 1", id);
  console.log("User ID 2", userInfo.user_id);

  return (
    <>
      <div className="user-profile">
        <i
          className="bi bi-arrow-left-short close-ui"
          onClick={handleBackClick}
        ></i>

        <div className="user-top">
          <img
            src={
              chosenImageURLCP
                ? chosenImageURLCP
                : userInfo.coverPic
                ? `${config.apiBaseUrl}backend/uploads/${userInfo.coverPic}`
                : cp
            }
            alt=""
          />
          {userid === userInfo.user_id && (
            <label htmlFor="file2" className="label2">
              {" "}
              <i className="bi bi-camera-fill camera_icon2"></i>
            </label>
          )}
          <input
            type="file"
            id="file2"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChangeCP}
          />

          {chosenImageURLCP && (
            <div className="cp-buttons">
              <button className="uploadCP" onClick={handlePostCoverPhoto}>
                Upload
              </button>
              <button
                className="cancelCP"
                onClick={() => setChosenImageURLCP(null)}
              >
                Cancel
              </button>
            </div>
          )}

          <div className="pp-wrapper">
            <img
              className="pp"
              src={
                userInfo.profilePic
                  ? `${config.apiBaseUrl}backend/uploads/${userInfo.profilePic}`
                  : pp
              }
              alt=""
            />

            {userid === userInfo.user_id && (
              <label htmlFor="file">
                {" "}
                <i className="bi bi-camera-fill camera_icon"></i>
              </label>
            )}
            <input
              type="file"
              id="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            {showUpdateProfileModal && (
              <div className="update-profile-modal">
                <div className="choosen-img">
                  <img src={chosenImageURLPP} alt="Chosen profile" />
                </div>

                <div className="buttons">
                  <button
                    className="btn-up-profile"
                    onClick={handlePostProfile}
                  >
                    Upload
                  </button>
                  <button
                    className="btn-cancel"
                    onClick={() => setShowUpdateProfileModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="name-wrapper">
          <span className="name">{userInfo.username}</span>

          <div className="buttons">
            <i
              className={`bi bi-person ${showUpdate ? "active" : ""}`}
              onClick={showUpdateContent}
              style={{ fontSize: "35px" }}
            ></i>

            <i
              className={`bi bi-images ${showPost ? "active" : ""}`}
              onClick={showPostsContent}
            ></i>

            <i
              className={`bi bi-calendar2-day ${showBook ? "active" : ""}`}
              onClick={showBookContent}
            ></i>
          </div>
        </div>
        <div className="user-content">
          <div className="title-wrapper">
            <h6 style={{ fontWeight: "500", marginLeft: "10px" }}>
              {showBook
                ? "Joined Activity"
                : showPost
                ? "Posts"
                : showUpdate
                ? "User Info"
                : ""}
            </h6>
          </div>

          {showPost && (
            <div className="wrapper-post">
              {/* {data &&
                data.map((d) => (
                  <Link
                    to={`/user-viewpost/${d.image_id}/${id}`}
                    className="card"
                    key={d.image_id}
                  >
                    <img
                      className="user-post"
                      src={`${config.apiBaseUrl}backend/uploads/${d.image_path}`}
                      alt=""
                    />
                  </Link>
                ))} */}

              <>
                <div className="feedd">
                  <div className="left">
                    {/* {id && userid == id && (
                      <div className="upload" onClick={handleClickUpload}>
                        <i className="bi bi-file-earmark-image-fill"></i>
                        <input
                          type="text"
                          placeholder="Share your captured"
                          readOnly
                        />
                      </div>
                    )} */}
                    {loading ? (
                      <>
                        <div className="placeholder-wrapper">
                          <div className="img-p"></div>
                          <div className="bot-p">
                            <div className="left-p">
                              <div className="user-p"></div>

                              <div className="name-date">
                                <div className="name"></div>

                                <div className="date"></div>
                              </div>
                            </div>
                            <div className="right-p">
                              <div className="icons-p"></div>
                            </div>
                          </div>
                        </div>
                        <div className="placeholder-wrapper">
                          <div className="img-p"></div>
                          <div className="bot-p">
                            <div className="left-p">
                              <div className="user-p"></div>

                              <div className="name-date">
                                <div className="name"></div>

                                <div className="date"></div>
                              </div>
                            </div>
                            <div className="right-p">
                              <div className="icons-p"></div>
                            </div>
                          </div>
                        </div>
                        <div className="placeholder-wrapper">
                          <div className="img-p"></div>
                          <div className="bot-p">
                            <div className="left-p">
                              <div className="user-p"></div>

                              <div className="name-date">
                                <div className="name"></div>

                                <div className="date"></div>
                              </div>
                            </div>
                            <div className="right-p">
                              <div className="icons-p"></div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : posts ? (
                      posts.map((post) => {
                        // Check if the post has images
                        if (post.images.length === 0) {
                          return null;
                        }

                        const imageCount = post.images.length;
                        const showOverlay = imageCount > 5;
                        const additionalCount = imageCount - 5;

                        return (
                          <div key={post.post_id} className="wrapper">
                            <Link
                              to={`/view-post/${post.post_id}`}
                              className={`post-img-wrapper ${getImageClass(
                                imageCount
                              )}`}
                            >
                              {post.images.slice(0, 5).map((image, index) => (
                                <img
                                  key={index}
                                  src={`${config.apiBaseUrl}backend/uploads/${image}`}
                                  alt={`post-${index}`}
                                  className="post-img"
                                />
                              ))}
                              {showOverlay && (
                                <div className="overlay">
                                  <span>+{additionalCount}</span>
                                </div>
                              )}
                            </Link>
                            <div
                              className="caption"
                              onClick={() => toggleExpand(post.post_id)}
                            >
                              <p
                                className={`caption_c ${
                                  expandedCaptions[post.post_id]
                                    ? "expanded"
                                    : ""
                                }`}
                              >
                                {post.caption}
                              </p>
                            </div>
                            <div className="action">
                              <div className="pp-name-date">
                                <img
                                  src={
                                    post.profilePic
                                      ? `${config.apiBaseUrl}backend/uploads/${post.profilePic}`
                                      : pp
                                  }
                                  alt=""
                                />
                                <div className="name-date">
                                  <Link
                                    className="span"
                                    to={`/user-profile/${post.user_id}`}
                                    style={{ fontSize: "14px" }}
                                  >
                                    {post.username}
                                  </Link>
                                  <p>{post.createdAt}</p>
                                  {/* Updated Date */}
                                </div>

                                <div
                                  className={`response-wrapper ${
                                    showResponse?.post_id === post.post_id
                                      ? "show"
                                      : ""
                                  }`}
                                >
                                  <div
                                    style={{ display: "flex" }}
                                    className="response-like1"
                                  >
                                    <span>
                                      {showResponse?.post_id === post.post_id
                                        ? showResponse.message
                                        : ""}
                                    </span>
                                  </div>
                                  <div className="response-like2"></div>
                                  <div className="response-like3"></div>
                                </div>
                              </div>

                              <div className="icon-btns">
                                <div className="icon">
                                  <i
                                    className={`bi ${
                                      post.user_liked
                                        ? "bi-suit-heart-fill"
                                        : "bi-suit-heart"
                                    }  ${post.user_liked ? "liked" : ""}`}
                                    onClick={() => handleLikePost(post.post_id)}
                                  ></i>
                                  <p>
                                    {post.likes_count === 0
                                      ? ""
                                      : post.likes_count}
                                  </p>
                                </div>{" "}
                                <div
                                  className="icon"
                                  onClick={() =>
                                    handleCommentClick(post.post_id)
                                  }
                                >
                                  <i className="bi bi-chat"></i>
                                  <p>
                                    {post.comment_count < 1
                                      ? ""
                                      : post.comment_count}
                                  </p>
                                </div>
                                <div className="icon">
                                  {post.user_id == userid && (
                                    <i
                                      className="bi bi-three-dots-vertical"
                                      onClick={() =>
                                        handleMoreClick(post.post_id)
                                      }
                                    ></i>
                                  )}

                                  {showModalMore === post.post_id && (
                                    <div className="more-wrapper">
                                      <div className="triangle"></div>
                                      <div className="rectangle">
                                        {post.user_id == userid ? (
                                          <span
                                            className="remove"
                                            onClick={() =>
                                              handleDeletePost(post.post_id)
                                            }
                                          >
                                            {loadingDel
                                              ? "Deleting.."
                                              : "Delete"}
                                          </span>
                                        ) : (
                                          ""
                                        )}

                                        {/* {userid === 0 ? (
                                          <span
                                            className="report"
                                            onClick={() => setInput(true)}
                                          >
                                            Report
                                          </span>
                                        ) : (
                                          post.user_id !== userid && (
                                            <span
                                              className="report"
                                              onClick={() =>
                                                selectedPostToReport(
                                                  post.post_id,
                                                  post.user_id
                                                )
                                              }
                                            >
                                              Report
                                            </span>
                                          )
                                        )} */}
                                      </div>
                                    </div>
                                  )}
                                </div>
                                {showModalMore && (
                                  <div
                                    className="overlay-more"
                                    onClick={() => setShowModalMore(false)}
                                  ></div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p style={{ color: "gray" }}>No posts available</p>
                    )}
                    <span className="no-post">
                      {posts ? posts.length < 1 && "No Post Upload" : ""}
                    </span>
                  </div>
                  {showRight && (
                    <Commentt
                      closeComment={() => setRight(false)}
                      selectedPost={selectedPost}
                    />
                  )}
                </div>
                {/* {showUpload && (
                  <Upload
                    closeUploadModal={() => setUpload(false)}
                    handleGetPost={handleGetPost}
                  />
                )} */}
                {showSignIn && (
                  <Signup closeModal={() => setShowSignin(false)} />
                )}
                {(showSignIn || showInput) && <div className="overlay"></div>}

                {showModalReport && (
                  <div className="modal-report">
                    <span className="title">
                      Why are you reporting this post?
                    </span>

                    <span className="reason1" onClick={handleReasonClick}>
                      <i className="bi bi-chevron-right"></i>Post not related to
                      Bulusan lake
                    </span>

                    <div className="other-reason-wrapper">
                      <p>Reason</p>

                      <div className="textarea-wrapper">
                        <textarea
                          name="other_reason"
                          placeholder="Write your reason..."
                          value={textareaValue}
                          onChange={(e) => setTextareaValue(e.target.value)}
                        ></textarea>
                        <i
                          className="bi bi-file-arrow-up-fill"
                          onClick={handlePostReport}
                        ></i>
                      </div>
                    </div>
                  </div>
                )}
                {showModalReport && (
                  <div
                    className="modal-report-overlay"
                    onClick={() => setShowModalReport(false)}
                  ></div>
                )}
                {reportMsg && (
                  <div className="reportMsg">
                    <p>{reportMsg}</p>
                  </div>
                )}

                {showDletetedMsg && (
                  <div className="post-deleted-msg">
                    <p>Post Deleted</p>
                  </div>
                )}

                {showInput && <Signup closeModal={closeSignupModal} />}
              </>
            </div>
          )}

          {showBook && (
            <div className="wrapper-book">
              <div className="wrapperb">
                {userBookingData ? (
                  userBookingData.map((b) => (
                    <div className="cardb" key={b.act_id}>
                      <img
                        className="act-img"
                        src={`${config.apiBaseUrl}backend/ADMIN_PHP/uploads/${b.image}`}
                        alt=""
                      />
                      <div className="act-infob">
                        <span className="act-name">{b.name}</span>
                        <span className="date">{b.booked_date}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No previous activity</p>
                )}
              </div>
            </div>
          )}

          {showUpdate && (
            <div className="wrapper-profile">
              <div className="wrapperp">
                <div className="input-wrapper">
                  <p>Username</p>
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    onChange={handleChangeProfileInfo}
                    value={userData.username}
                  />
                </div>

                <div className="input-wrapper">
                  <p>Fullname</p>
                  <input
                    type="text"
                    name="fullname"
                    placeholder="Fullname"
                    onChange={handleChangeProfileInfo}
                    value={userData.fullname}
                  />
                </div>

                {userid == id && (
                  <div className="input-wrapper">
                    <p>Address</p>
                    <input
                      type="text"
                      name="address"
                      placeholder="Address"
                      onChange={handleChangeProfileInfo}
                      value={userData.address}
                    />
                  </div>
                )}
                {/* {userInfo.valid_id_image !== "" && userid == id && (
                  <div className="input-wrapper">
                    <div
                      className="top"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "3px",
                      }}
                    >
                      <p>Valid ID</p>{" "}
                      <label htmlFor="file3">
                        <i
                          className="bi bi-pencil-square"
                          style={{ color: "blue", cursor: "pointer" }}
                        ></i>

                        <input
                          type="file"
                          id="file3"
                          accept="image/*"
                          onChange={handleFileChange3}
                          style={{ display: "none" }}
                        />
                      </label>
                    </div>

                    <img
                      src={
                        chosenImageURLValidID
                          ? chosenImageURLValidID
                          : `${config.apiBaseUrl}/backend/uploads/${userInfo.valid_id_image}`
                      }
                      alt="Valid ID"
                      style={{ width: "70px", height: "70px" }}
                      onClick={() => clickValidId(userInfo.valid_id_image)}
                    />
                  </div>
                )} */}

                {userid == userInfo.user_id && (
                  <button className="btn-update" onClick={handleSubmitUserData}>
                    Update
                  </button>
                )}

                {userid == userInfo.user_id && (
                  <div className="account">
                    <div className="top">
                      <h6>User Account</h6>
                    </div>

                    <div className="inputs">
                      <div className="input-wrapper">
                        <p>Email</p>
                        <input
                          type="text"
                          name="email"
                          placeholder="Email"
                          onChange={handleChangeProfileInfo}
                          value={userData.email}
                          readOnly
                        />
                      </div>

                      <div className="bot">
                        <button onClick={() => setShowActionModal(true)}>
                          Action{" "}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <span className="msg-updated">{updatedMsg}</span>
            </div>
          )}
        </div>
      </div>
      {showActionModal && (
        <div className="modal-useraction">
          <div className="top">
            <span>Account action</span>
            <i
              className="bi bi-x-lg"
              onClick={() => setShowActionModal(false)}
            ></i>{" "}
          </div>

          <div className="content">
            {/* <div className="deactivate">
              <span>
                {userInfo.status === 2 || status === 2
                  ? "Activate account"
                  : "Deactivate account"}
              </span>
              <p>
                {userInfo.status === 2 || status == 2
                  ? "Your account is currently deactivated."
                  : "Once you deactivate your account, it will remain inactive until you choose to reactivate it. You will no longer receive notifications."}
              </p>

              <span
                style={{
                  color: userInfo.status == 2 || status === 2 ? "green" : "red",
                }}
                className="btn-deact"
                onClick={handleDeactivateAcc}
              >
                {userInfo.status == 2 || status === 2
                  ? "Activate"
                  : "Deactivate"}
              </span>
            </div> */}

            <div className="delete">
              <span>Delete account permanently</span>
              <p>
                If you delete your account permanently, you will not be able to
                recover your account or any associated information, and you will
                no longer be able to use this email to create a new account.
              </p>

              <span
                className="btn-delete"
                onClick={() => setShowConfirmModal(true)}
              >
                Delete
              </span>
            </div>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="confirm-modal">
          <div className="top">
            <span>Confirm your action</span>
          </div>

          <p>Are you sure you wan't o delete your account?</p>

          <div className="bot">
            <div className="btn-dlt" onClick={handleDeleteAccount}>
              Delete
            </div>
            <div
              className="btn-cncl"
              onClick={() => setShowConfirmModal(false)}
            >
              Cancel
            </div>
          </div>
        </div>
      )}

      {(showActionModal || showModalValidIdImg) && (
        <div
          className="overlay"
          onClick={() => setShowModalValidIdImg(false)}
        ></div>
      )}

      {showModalValidIdImg && (
        <div className="valid_idModal">
          <img
            // src={`${config.apiBaseUrl}/backend/uploads/${validIdImg}`}
            src={`https://bulusanlakeexplorer.kesug.com/backend/uploads/${validIdImg}`}
            alt=""
          />
        </div>
      )}
    </>
  );
};

export default Userprofile;
