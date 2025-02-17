import "./post.scss";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Sideba from "../components/sidebar/Sideba";
import config from "../../BaseURL";

const Post = () => {
  const { id } = useParams();
  const { reported_id } = useParams();
  console.log("first", id);

  const [userdata, setUserData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState(id === "0" ? "" : id);
  const [notifDeleted, setNotifDeleted] = useState(false);

  const getUserPosts_a = () => {
    axios
      //.get(`${config.apiBaseUrl}backend/ADMIN_PHP/getUserPosts_a.php`)
      .get(
        `https://bulusanlakeexplorer.kesug.com/backend/ADMIN_PHP/getUserPosts_a.php`
      )
      .then((response) => {
        setUserData(response.data);
        console.log("first", response.data);
      })
      .catch((error) => {
        console.log("Error on fetching  : ", error);
      });
  };

  useEffect(() => {
    getUserPosts_a();
  }, []);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  //search
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUserData =
    searchTerm === "0" || searchTerm === ""
      ? userdata
      : userdata.filter(
          (user) =>
            String(user.image_id).toLowerCase() === searchTerm.toLowerCase() ||
            String(user.post_id).toLowerCase() === searchTerm.toLowerCase() ||
            String(user.user_id).toLowerCase() === searchTerm.toLowerCase() ||
            user.image_path.toLowerCase() === searchTerm.toLowerCase()
        );

  const totalPages = Math.ceil(filteredUserData.length / rowsPerPage);

  //handleRemoveUser
  // const handleRemoveUser = (user_id) => {
  //   axios
  //     //  .post(`${config.apiBaseUrl}backend/ADMIN_PHP/updateUserStatusNA.php`, {
  //     .post(
  //       `https://bulusanlakeexplorer.kesug.com/backend/ADMIN_PHP/updateUserStatusNA.php`,
  //       {
  //         user_id: user_id,
  //       }
  //     )
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

  //handleRemovePost
  const handleRemovePost = (image_id) => {
    const dataID = new FormData();
    dataID.append("image_id", image_id);

    axios
      .post(
        //`${config.apiBaseUrl}backend/ADMIN_PHP/deleteImagePost2.php`,
        `https://bulusanlakeexplorer.kesug.com/backend/ADMIN_PHP/deleteImagePost2.php`,
        dataID,
        { withCredentials: true }
      )
      .then((response) => {
        if (response) {
          console.log("___", response.data);
          getUserPosts_a();
        } else {
          console.log("___2", response.data);
        }
      })
      .catch((error) => {
        console.log("Error : ", error);
      });
  };

  return (
    <>
      <div className="puactive">
        <Sideba />
        <div className="user-content">
          <div className="top">
            <div className="left">
              <h6>Posts</h6>

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
                    .map((data) => (
                      <tr key={data.image_id}>
                        <td>{data.image_id}</td>
                        <td>{data.post_id}</td>
                        <td>{data.user_id}</td>
                        <td>
                          {" "}
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
                            onClick={() => handleRemovePost(data.image_id)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
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
          <p>Post Deleted Successfully</p>
        </div>
      )}
    </>
  );
};

export default Post;
