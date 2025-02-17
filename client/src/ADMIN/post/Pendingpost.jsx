import "./pendingpost.scss";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Sideba from "../components/sidebar/Sideba";
import config from "../../BaseURL";

const Pendingpost = () => {
  const [userdata, setUserData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [notifDeleted, setNotifDeleted] = useState(false);
  const [notifApproved, setNotifApproved] = useState(false);

  const [emptyReason, setEmptyReason] = useState(false);

  const [loader, setLoader] = useState(false);
  const [loader2, setLoader2] = useState(false);
  const [toDelPostId, setToDelPostId] = useState(null);

  ///////////////////////////////////////////////////////////////
  const [showModalReason, setShowModalReason] = useState(false);
  const [showModalCaption, setShowModalCaption] = useState(false);
  const [declineData, setDeclineData] = useState({
    user_id: "",
    image_id: "",
    image_path: "",
    email: "",
    reason: "",
  });

  const [declineCaption, setDeclineCaption] = useState({
    post_id: "",
    user_id: "",
    image_id: "",
    email: "",
    caption: "",
    reason: "",
  });

  const selectedData_decline = (user_id, image_id, image_path, email) => {
    setShowModalReason(true);
    setDeclineData((prevData) => ({
      ...prevData,
      user_id: user_id,
      image_id: image_id,
      image_path: image_path,
      email: email,
    }));
  };

  const [captionSelected, setcaptionSelected] = useState(null);

  const selectedData_declineCaption = (post_id, user_id, email, caption) => {
    setcaptionSelected(caption);

    setShowModalCaption(true);
    setDeclineCaption((prevData) => ({
      ...prevData,
      post_id: post_id,
      user_id: user_id,
      email: email,
      caption: caption,
    }));
  };

  //////////////////////////////////////////////////////////////////////////////

  const getUserPendingPosts = () => {
    axios
      // .get(`${config.apiBaseUrl}backend/ADMIN_PHP/getUserPendingPosts.php`)
      .get(
        `https://bulusanlakeexplorer.kesug.com/backend/ADMIN_PHP/getUserPendingPosts.php`
      )
      .then((response) => {
        setUserData(response.data);
        console.log("firstPP", response.data);
      })
      .catch((error) => {
        console.log("Error on fetching  : ", error);
      });
  };
  useEffect(() => {
    getUserPendingPosts();
  }, []);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  //search

  //handleSearchChange
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUserData = userdata
    ? userdata.filter(
        (user) =>
          String(user.image_id)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          String(user.post_id)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          String(user.user_id)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          user.image_path.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const totalPages = Math.ceil(filteredUserData.length / rowsPerPage);

  //handleRemoveUser
  // const handleRemoveUser = (user_id) => {
  //   axios
  //     .post(`${config.apiBaseUrl}backend/ADMIN_PHP/updateUserStatusNA.php`, {
  //       user_id: user_id,
  //     })
  //     .then((response) => {
  //       if (response.data.success) {
  //         setUserData((prevUsers) =>
  //           prevUsers.filter((user) => user.user_id !== user_id)
  //         );
  //       } else {
  //         console.log(response.data.error);
  //       }
  //     });
  // };

  //handleApprovedPost
  const handleApprovedPost = (
    user_id,
    image_id,
    post_id,
    image_path,
    email
  ) => {
    setToDelPostId(post_id);
    setLoader(true);

    const dataID = new FormData();

    dataID.append("image_id", image_id);
    dataID.append("user_id", user_id);
    dataID.append("post_id", post_id);
    dataID.append("image", image_path);
    dataID.append("title", "Post Approved");
    dataID.append("body", `Your post has been  added to  news feed`);
    axios
      .post(
        // `${config.apiBaseUrl}backend/ADMIN_PHP/approvedImagePost.php`,
        `https://bulusanlakeexplorer.kesug.com/backend/ADMIN_PHP/approvedImagePost.php`,
        dataID,
        { withCredentials: true }
      )
      .then((response) => {
        if (response) {
          setNotifApproved(true);
          setTimeout(() => {
            setNotifApproved(false);
          }, 3000);
          getUserPendingPosts();

          setLoader(false);
        } else {
          console.log("_____2", response.data);
          setLoader(false);
        }
      })
      .catch((error) => {
        console.log("Error : ", error);
        setLoader(false);
      });
  };

  //handleRemovePost
  const handleRemovePost = () => {
    if (declineData.reason === "") {
      setEmptyReason(true);
      return;
    }

    setLoader2(true);

    const dataID = new FormData();
    dataID.append("image_id", declineData.image_id);
    dataID.append("user_id", declineData.user_id);
    dataID.append("email", declineData.email);
    dataID.append("image", declineData.image_path);
    dataID.append("reason", declineData.reason);

    dataID.append("title", "Post removal");
    dataID.append(
      "body",
      `We have deleted your post image due to the following reason (${declineData.reason})`
    );

    axios
      .post(
        `${config.apiBaseUrl}backend/ADMIN_PHP/deleteImagePost.php`,
        dataID,
        { withCredentials: true }
      )
      .then((response) => {
        if (response) {
          console.log("___", response.data);
          setNotifDeleted(true);
          setTimeout(() => {
            setNotifDeleted(false);
          }, 3000);

          getUserPendingPosts();
          setDeclineData({
            user_id: "",
            image_id: "",
            image_path: "",
            email: "",
            reason: "",
          });
          setShowModalReason(false);
          setLoader2(false);
        } else {
          console.log("___2", response.data);
          setLoader2(false);
        }
      })
      .catch((error) => {
        console.log("Error : ", error);
        setLoader2(false);
      });
  };

  //handleRemoveCaption
  const handleRemoveCaption = () => {
    setLoader2(true);
    const formData = new FormData();
    formData.append("post_id", declineCaption.post_id);
    formData.append("user_id", declineCaption.user_id);
    formData.append("image_id", declineCaption.image_id);
    formData.append("email", declineCaption.email);
    formData.append("caption", declineCaption.caption);
    formData.append("reason", declineCaption.reason);

    formData.append("title", "Post Caption Removal");
    formData.append(
      "body",
      `We have deleted your caption in your previous post due to the following reason (${declineCaption.reason})`
    );

    axios
      .post(
        `${config.apiBaseUrl}backend/ADMIN_PHP/removecaption.php`,
        formData,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log("Caption removed successfully", response);
        getUserPendingPosts();
        console.log(response.data);

        setDeclineCaption({
          post_id: "",
          user_id: "",
          image_id: "",
          email: "",
          caption: "",
          reason: "",
        });

        setShowModalCaption(false);
        setLoader2(false);
      })
      .catch((error) => {
        console.error("Error removing caption", error);
        setLoader2(false);
      });
  };

  return (
    <>
      <div className="pactive">
        <Sideba />
        <div className="user-content">
          <div className="top">
            <div className="left">
              <h6>Pending Posts</h6>

              {/* <Link className="opp" to="/admin/not-active-user/">
                <i className="bi bi-arrow-left-right"></i>
              </Link> */}
            </div>

            <div className="right2">
              <div className="search">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />{" "}
                <i className="bi bi-search"></i>
              </div>
            </div>
          </div>
          <div className="active">
            {userdata.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Image ID</th>
                    <th>Post ID</th>
                    <th>Posted BY</th>
                    <th>Image</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUserData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .reduce((acc, data) => {
                      const existingPost = acc.find(
                        (item) => item.post_id === data.post_id
                      );

                      if (existingPost) {
                        // Add the current row to the existing post's rows
                        existingPost.rows.push(data);
                      } else {
                        // Otherwise, create a new post entry with the current row
                        acc.push({ post_id: data.post_id, rows: [data] });
                      }

                      return acc;
                    }, [])
                    .map((post) => {
                      return (
                        <>
                          {/* Render each row for the current post group */}
                          {post.rows.map((data) => (
                            <tr key={data.image_id}>
                              <td>{data.image_id}</td>
                              <td>{data.post_id}</td>
                              <td>{data.user_id}</td>
                              <td>
                                <img
                                  className="hover-img"
                                  style={{ height: "40px", width: "40px" }}
                                  src={`${config.apiBaseUrl}backend/uploads/${data.image_path}`}
                                  alt=""
                                />
                              </td>
                              <td style={{ width: "250px" }}>
                                <button
                                  className="btn-ban"
                                  onClick={() =>
                                    selectedData_decline(
                                      data.user_id,
                                      data.image_id,
                                      data.image_path,
                                      data.email
                                    )
                                  }
                                >
                                  Remove
                                </button>
                                <button
                                  className="btn-approved"
                                  onClick={() =>
                                    handleApprovedPost(
                                      data.user_id,
                                      data.image_id,
                                      data.post_id,
                                      data.image_path,
                                      data.email
                                    )
                                  }
                                >
                                  {loader
                                    ? `${
                                        toDelPostId == data.post_id
                                          ? "Please wait..."
                                          : "Update"
                                      }`
                                    : "Approve"}
                                </button>
                              </td>
                            </tr>
                          ))}

                          {/* Render the caption row with Remove Caption button */}
                          <tr key={`${post.post_id}-caption`}>
                            <td
                              colSpan="6"
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <span
                                  style={{
                                    marginRight: "10px",
                                    fontWeight: "300",
                                    fontSize: "12px",
                                  }}
                                >
                                  Caption:{" "}
                                  {post.rows[0].caption === ""
                                    ? "No Caption"
                                    : post.rows[0].caption}
                                </span>
                                {post.rows[0].caption && (
                                  <button
                                    onClick={() => {
                                      selectedData_declineCaption(
                                        post.post_id,
                                        post.rows[0].user_id,
                                        post.rows[0].email,
                                        post.rows[0].caption
                                      );
                                    }}
                                    style={{
                                      padding: "5px 10px",
                                      backgroundColor: "#f44336",
                                      color: "white",
                                      border: "none",
                                      borderRadius: "5px",
                                      cursor: "pointer",
                                      fontSize: "12px",
                                    }}
                                  >
                                    Remove Caption
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        </>
                      );
                    })}
                </tbody>
              </table>
            ) : (
              <h6>No Data yet</h6>
            )}
            <div className="pagination">
              <button
                onClick={() => handleChangePage(page - 1)}
                disabled={page === 0}
              >
                Previous
              </button>
              <span>
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => handleChangePage(page + 1)}
                disabled={page >= totalPages - 1}
              >
                Next
              </button>
              <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      {notifDeleted && (
        <div className="notifDelete">
          <p>Post deleted successfully</p>
        </div>
      )}
      {notifApproved && (
        <div className="notifDelete">
          <p>Post approved</p>
        </div>
      )}
      {showModalReason && (
        <div className="modal-reason">
          <div className="top">
            <i className="bi bi-pen-fill"></i>
            Remove Post
          </div>

          <div className="suggestions">
            {/* <h5>Suggested Reasons:</h5> */}
            <ul>
              <li
                onClick={() =>
                  setDeclineData({
                    ...declineData,
                    reason: "Post not related to Bulusan Lake",
                  })
                }
              >
                <i className="bi bi-caret-right-fill"></i> Post not related to
                Bulusan Lake
              </li>
              <li
                onClick={() =>
                  setDeclineData({
                    ...declineData,
                    reason: "Repeated content",
                  })
                }
              >
                <i className="bi bi-caret-right-fill"></i> Repeated content
              </li>
            </ul>
          </div>

          <div className="content">
            <textarea
              name="reason"
              onChange={(e) => {
                setDeclineData({ ...declineData, reason: e.target.value });
                setEmptyReason(false);
              }}
              value={declineData.reason}
              placeholder="write your reason for declining"
              style={{ border: emptyReason ? "solid red 3px" : "" }}
            ></textarea>
          </div>

          <div className="bot">
            <span className="btn-decline" onClick={handleRemovePost}>
              <i className="bi bi-send"></i>{" "}
              {loader2 ? "Please wait..." : "SEND AND REMOVE"}
            </span>

            <span
              className="btn-close"
              onClick={() => setShowModalReason(false)}
            >
              <i className="bi bi-x-circle"></i> CLOSE
            </span>
          </div>
        </div>
      )}
      {showModalReason && <div className="modaloverlay_reason"></div>}{" "}
      {showModalCaption && (
        <div className="modal-reason">
          <div className="top">
            <i className="bi bi-pen-fill"></i>
            Remove Caption
          </div>

          <div
            className="div"
            style={{
              width: "100%",
              backgroundColor: "transparent",
              padding: "5px 10px 10px 10px",
              borderRadius: "5px",
            }}
          >
            <span
              style={{ fontSize: "12px", color: "#fff", marginBottom: "20px" }}
            >
              User Caption
            </span>
            <p style={{ fontSize: "12px", color: "lightgrey" }}>
              {captionSelected}
            </p>
          </div>

          <div className="suggestions" style={{ marginTop: "20px" }}>
            {/* <h5>Suggested Reasons:</h5> */}
            <ul>
              <li
                onClick={() =>
                  setDeclineCaption({
                    ...declineCaption,
                    reason:
                      "The caption contains offensive, vulgar, or profane language.",
                  })
                }
              >
                <i className="bi bi-caret-right-fill"></i> The caption contains
                offensive, vulgar, or profane language.
              </li>
              <li
                onClick={() =>
                  setDeclineCaption({
                    ...declineCaption,
                    reason:
                      "The caption includes misleading or false information.",
                  })
                }
              >
                <i className="bi bi-caret-right-fill"></i> The caption includes
                misleading or false information.
              </li>
              <li
                onClick={() =>
                  setDeclineCaption({
                    ...declineCaption,
                    reason:
                      "The caption violates community guidelines or terms of service.",
                  })
                }
              >
                <i className="bi bi-caret-right-fill"></i> The caption violates
                community guidelines or terms of service.
              </li>
              <li
                onClick={() =>
                  setDeclineCaption({
                    ...declineCaption,
                    reason:
                      "The caption promotes hate speech or discriminatory content.",
                  })
                }
              >
                <i className="bi bi-caret-right-fill"></i> The caption promotes
                hate speech or discriminatory content.
              </li>
              <li
                onClick={() =>
                  setDeclineCaption({
                    ...declineCaption,
                    reason:
                      "The caption contains explicit or inappropriate content.",
                  })
                }
              >
                <i className="bi bi-caret-right-fill"></i> The caption contains
                explicit or inappropriate content.
              </li>
              <li
                onClick={() =>
                  setDeclineCaption({
                    ...declineCaption,
                    reason:
                      "The caption includes spam or self-promotional content.",
                  })
                }
              >
                <i className="bi bi-caret-right-fill"></i> The caption includes
                spam or self-promotional content.
              </li>
              <li
                onClick={() =>
                  setDeclineCaption({
                    ...declineCaption,
                    reason:
                      "The caption infringes on intellectual property rights.",
                  })
                }
              >
                <i className="bi bi-caret-right-fill"></i> The caption infringes
                on intellectual property rights.
              </li>
              <li
                onClick={() =>
                  setDeclineCaption({
                    ...declineCaption,
                    reason:
                      "The caption encourages harmful behavior or illegal activities.",
                  })
                }
              >
                <i className="bi bi-caret-right-fill"></i> The caption
                encourages harmful behavior or illegal activities.
              </li>
              <li
                onClick={() =>
                  setDeclineCaption({
                    ...declineCaption,
                    reason:
                      "The caption includes personal attacks or harassment.",
                  })
                }
              >
                <i className="bi bi-caret-right-fill"></i> The caption includes
                personal attacks or harassment.
              </li>
              <li
                onClick={() =>
                  setDeclineCaption({
                    ...declineCaption,
                    reason:
                      "The caption disrupts the integrity of the platform.",
                  })
                }
              >
                <i className="bi bi-caret-right-fill"></i> The caption disrupts
                the integrity of the platform.
              </li>

              {/* Add more suggestions as needed */}
            </ul>
          </div>

          <div className="content">
            <textarea
              name="reason"
              onChange={(e) => {
                setDeclineCaption({
                  ...declineCaption,
                  reason: e.target.value,
                });
                setEmptyReason(false);
              }}
              value={declineCaption.reason}
              placeholder="write your reason for removing.."
              style={{ border: emptyReason ? "solid red 3px" : "" }}
            ></textarea>
          </div>

          <div className="bot">
            <span className="btn-decline" onClick={handleRemoveCaption}>
              <i className="bi bi-send"></i>
              {loader2 ? "Please wait..." : "SEND AND REMOVE"}
            </span>

            <span
              className="btn-close"
              onClick={() => setShowModalCaption(false)}
            >
              <i className="bi bi-x-circle"></i> CLOSE
            </span>
          </div>
        </div>
      )}
      {showModalCaption && <div className="modaloverlay_reason"></div>}{" "}
    </>
  );
};

export default Pendingpost;
