import "./chatbot.scss";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sideba from "../components/sidebar/Sideba";
import config from "../../BaseURL";

const Chatbot_ = () => {
  const [chatbotData, setChatBotData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const [addModal, setAddModal] = useState(false);
  const [update, setUpdate] = useState(null);

  const [loader, setLoader] = useState(false);
  const [delRow, setDelRow] = useState(null);

  const [nullQuestion, setNullQuestion] = useState(false);
  const [nullQuery, setNullQuery] = useState(false);

  const [addChat, setAddChat] = useState({
    question: "",
    response: "",
    id: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNullQuery(false);
    setNullQuestion(false);
    setAddChat((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitChat = (e) => {
    e.preventDefault();

    if (addChat.question === "" || addChat.response === "") {
      if (addChat.question === "") {
        setNullQuestion(true);
      }
      if (addChat.response === "") {
        setNullQuery(true);
      }

      return;
    }

    setLoader(true);
    const formData = new FormData();
    formData.append("question", addChat.question);
    formData.append("response", addChat.response);

    console.log(addChat.question);
    console.log(addChat.response);
    axios
      .post(`${config.apiBaseUrl}backend/ADMIN_PHP/postChatBot.php`, formData, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) {
          getChatBot();
          // closeModal();

          setAddChat({
            question: "",
            response: "",
          });

          setLoader(false);
        }
      })
      .catch((error) => {
        console.log("ERROR:", error);
        setLoader(false);
      });
  };

  const getChatBot = () => {
    axios
      .get(`${config.apiBaseUrl}backend/ADMIN_PHP/getChatBot.php`, {
        withCredentials: true,
      })
      .then((response) => {
        setChatBotData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log("Error on fetching  : ", error);
      });
  };

  useEffect(() => {
    getChatBot();
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

  const filteredChatBotData = chatbotData.filter(
    (cb) =>
      String(cb.query).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(cb.response).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(chatbotData.length / rowsPerPage);

  //handleUpdate
  const handleUpdate = (chatBotaData) => {
    setUpdate(chatBotaData);

    setAddChat({
      question: chatBotaData.query,
      response: chatBotaData.response,
      id: chatBotaData.id,
    });

    setAddModal(true);
  };

  const handleUpdateChatBot = async (e) => {
    e.preventDefault();
    setLoader(true);

    const formData = new FormData();
    formData.append("question", addChat.question);
    formData.append("response", addChat.response);
    formData.append("id", addChat.id);

    axios
      .post(`${config.apiBaseUrl}backend/ADMIN_PHP/postChatBot.php`, formData, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) {
          console.log(res.data.msg);
          getChatBot();
          closeModal();
        }
        setLoader(false);
      })
      .catch((error) => {
        console.log("ERROR:", error);
        setLoader(false);
      });
  };

  //closeModal

  const closeModal = () => {
    setAddModal(false);
    setUpdate(null);
    setAddChat({
      question: "",
      response: "",
      id: "",
    });
  };

  //handleDelete
  const handleDelete = (id) => {
    setDelRow(id);
    setLoader(true);
    console.log("first", id);
    const formdata = new FormData();
    formdata.append("delete_id", id);
    axios
      .post(`${config.apiBaseUrl}backend/ADMIN_PHP/postChatBot.php`, formdata, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) {
          getChatBot();
          setLoader(false);
        }
      })
      .catch((error) => {
        console.log("ERROR:", error);
        setLoader(false);
      });
  };
  return (
    <>
      <div className="chatbot">
        <Sideba />
        <div className="user-content">
          <div className="top">
            <div className="left">
              <h6>Costumize ChatBot</h6>
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
              <button onClick={() => setAddModal(true)}>ADD NEW</button>
            </div>
          </div>
          <div className="active">
            {chatbotData.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Question</th>
                    <th>Response</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredChatBotData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((data) => (
                      <tr key={data.id}>
                        <td>{data.query}</td>
                        <td>{data.response}</td>
                        <td
                          style={{
                            width: "200px",
                          }}
                        >
                          <button
                            style={{
                              color: "white",
                              backgroundColor: "red",
                              border: "none",
                              borderRadius: "5px",
                              cursor: "pointer",
                              padding: "2px 5px",
                              marginRight: "5px",
                              fontSize: "12px",
                            }}
                            onClick={() => handleDelete(data.id)}
                          >
                            {delRow && delRow == data.id
                              ? `${loader ? "Deleting..." : "Delete"}`
                              : "Delete"}
                          </button>
                          <button
                            style={{
                              color: "white",
                              backgroundColor: "blue",
                              border: "none",
                              borderRadius: "5px",
                              cursor: "pointer",
                              padding: "2px 5px",
                              fontSize: "12px",
                            }}
                            onClick={() => handleUpdate(data)}
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              // <tr>
              //   <td colSpan="5" style={{ textAlign: "center" }}>
              //     No data available
              //   </td>
              // </tr>
              <p>No data available</p>
            )}
            {chatbotData.length > 0 ? (
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
            ) : (
              ""
            )}
          </div>
        </div>
      </div>

      {addModal && (
        <div className="modal-add-chatbot">
          <div className="top">
            <h6>{update ? "Update ChatBot" : "Add new"}</h6>

            <i className="bi bi-x-lg close2" onClick={closeModal}></i>
          </div>

          <div className="textareas">
            <input
              type="hidden"
              name="id"
              onChange={handleChange}
              value={addChat.id}
            />
            <textarea
              style={{
                height: "80px",
                border: nullQuestion ? "2px solid red" : "",
              }}
              name="question"
              onChange={handleChange}
              value={addChat.question}
              placeholder="Question"
            ></textarea>
            <textarea
              style={{
                height: "150px",
                border: nullQuery ? "2px solid red" : "",
              }}
              name="response"
              onChange={handleChange}
              value={addChat.response}
              placeholder="Response"
            ></textarea>
          </div>

          <div className="bot">
            <button
              className="btn-submit"
              onClick={update ? handleUpdateChatBot : handleSubmitChat}
            >
              {update
                ? `${loader ? "Updating..." : "UPDATE"}`
                : `${loader ? "Inserting..." : "INSERT"}`}
            </button>
          </div>
        </div>
      )}
      {addModal && <div className="overlay"></div>}
    </>
  );
};

export default Chatbot_;
