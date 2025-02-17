import "./search.scss";
import { useContext, useEffect, useRef, useState } from "react";
import pp from "../../assets/user (8).png";
import Comment from "../../components/comment/Comment";
import { Upload } from "../../components/upload/Upload";
import Sidebarcontext, { SidebarContext } from "../../context/Sidebarcontext";
import axios from "axios";
import config from "../../BaseURL";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { CommentCountContext } from "../../context/CommentCountProvider ";

import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.extend(relativeTime);

import Signup from "../signup/Signup";
const Search = () => {
  const [showInput, setInput] = useState(false);
  //close signupmodal
  const closeSignupModal = () => {
    setInput(false);
  };

  const [searchData, setSearchData] = useState("");

  const [showRight, setRight] = useState(false);
  const [showUpload, setUpload] = useState(false);
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
  const { userid } = useContext(SidebarContext);
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

  useEffect(() => {
    console.log(searchData);
  });

  const handleGetPost = () => {
    if (!searchData) {
      console.error("Search data is empty or undefined!");
      return; // Prevent sending the request if searchData is not defined
    }
    console.log("GGGG", searchData);
    axios
      .get(
        `${
          config.apiBaseUrl
        }backend/getPostsSearch.php?searchdata=${encodeURIComponent(
          searchData
        )}`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setPosts(response.data.posts);
        setLoading(false);
        console.log("response.data.posts:", response.data.posts);
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
                  setShowResponse({ post_id, message: "Thank you" });
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
  return (
    <>
      <div className="search">
        <div className="searchbar">
          <input
            type="text"
            value={searchData}
            placeholder="Search (e.g Kayak, Balsa, Boating)"
            onChange={(e) => setSearchData(e.target.value)}
          />
          <button onClick={handleGetPost}>Search</button>
        </div>
        <div className="feed">
          <div className="lefttt">
            {loading ? (
              <>
                <p style={{ marginTop: "50px" }}>
                  <i
                    style={{ fontSize: "60px", color: "gray" }}
                    className="bi bi-search"
                  ></i>
                </p>
              </>
            ) : posts && posts.length > 0 ? (
              posts.map((post) => {
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
                          expandedCaptions[post.post_id] ? "expanded" : ""
                        }`}
                      >
                        {post.caption} <br />
                        {post.hashtag}
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
                        </div>

                        <div
                          className={`response-wrapper ${
                            showResponse?.post_id === post.post_id ? "show" : ""
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
                            {post.likes_count === 0 ? "" : post.likes_count}
                          </p>
                        </div>
                        <div
                          className="icon"
                          onClick={() => handleCommentClick(post.post_id)}
                        >
                          <i className="bi bi-chat"></i>
                          <p>
                            {post.comment_count < 1 ? "" : post.comment_count}
                          </p>
                        </div>
                        <div className="icon">
                          {post.user_id == userid && (
                            <i
                              className="bi bi-three-dots-vertical"
                              onClick={() => handleMoreClick(post.post_id)}
                            ></i>
                          )}

                          {showModalMore === post.post_id && (
                            <div className="more-wrapper">
                              <div className="triangle"></div>
                              <div className="rectangle">
                                {post.user_id === userid ? (
                                  <span
                                    className="remove"
                                    onClick={() =>
                                      handleDeletePost(post.post_id)
                                    }
                                  >
                                    {loadingDel ? "Deleting.." : "Delete"}
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
              <p>No results found</p>
            )}
          </div>

          {showRight && (
            <Comment
              closeComment={() => setRight(false)}
              selectedPost={selectedPost}
            />
          )}
        </div>
      </div>
      {showUpload && (
        <Upload
          closeUploadModal={() => setUpload(false)}
          handleGetPost={handleGetPost}
        />
      )}
      {showSignIn && <Signup closeModal={() => setShowSignin(false)} />}
      {(showSignIn || showInput) && <div className="overlay"></div>}

      {showModalReport && (
        <div className="modal-report">
          <span className="title">Why are you reporting this post?</span>

          <span className="reason1" onClick={handleReasonClick}>
            <i className="bi bi-chevron-right"></i>Post not related to Bulusan
            lake
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
  );
};

export default Search;
