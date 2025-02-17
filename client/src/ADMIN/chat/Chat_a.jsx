import "./chat_a.scss";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import config from "../../BaseURL";
import pp from "../../assets/user (8).png";
import nomsg from "../../assets/chat (12).png";
import { SidebarContext } from "../../context/Sidebarcontext";

const Chat_a = () => {
  const [showLeft, setShowLeft] = useState(false);
  const [showRigt, setShowRight] = useState(false);

  const [messageData, setMessagedata] = useState("");
  const [isSendBtnDisabled, setIsSendBtnDisabled] = useState(true);
  const [chatData, setChatData] = useState([]);
  const [connectedData, setconnectedData] = useState([]);
  const [convoData, setconvoData] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [currid, setCurrUid] = useState(0);

  const textareaRef = useRef(null);
  const chatEndRef = useRef(null); // Reference for the end of chat

  const [unrepliedData, setUnRepliedData] = useState([]);
  const [showModalUnreply, setShowUnReply] = useState(false);
  const [showTextArea, setTextArea] = useState(false);

  const [unrepliedCount, setUnrepliedCount] = useState(null);

  const [showUnrep, setShowUnrep] = useState(false);
  const [showConn, setShowConn] = useState(true);

  const handleGetSelectUnreplied = (unreplied_click) => {
    setSelectedUserId(unreplied_click);
    setShowUnrep(true);
    setShowConn(false);
  };

  const handleGetSelectConnected = (con_click) => {
    setSelectedUserId(con_click);
    setShowConn(true);
    setShowUnrep(false);
  };

  const [reply, setReply] = useState("");
  const [replyData, setReplyData] = useState({
    msg_id: "",
    message: "",
    user_id: "",
    convo_id: "",
  });

  //handleSubmitReply
  const handleShowInput = (msg_id, message, user_id, convo_id) => {
    setReplyData({
      msg_id,
      message,
      user_id,
      convo_id,
    });
    if (showTextArea === msg_id) {
      setTextArea(true);

      return;
    }

    setTextArea(msg_id);
  };

  //handleSubmitReply
  const handleSubmitReply = (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("msg_id", replyData.msg_id);
    formdata.append("message", replyData.message);
    formdata.append("user_id", replyData.user_id);
    formdata.append("convo_id", replyData.convo_id);
    formdata.append("reply", reply);

    axios
      .post(`${config.apiBaseUrl}backend/ADMIN_PHP/addReply.php`, formdata, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.success) {
          // Fetch unreplied messages
          getUnrepliedMesage();
          handleGetChats();
          getConversationList();
          setReply("");
        } else {
          console.log(response.data);
        }
      })
      .catch((error) => {
        console.log("error : ", error);
      });
  };

  //input field customization
  useEffect(() => {
    setIsSendBtnDisabled(messageData.trim() === "");
    messageData.trim() !== ""
      ? (textareaRef.current.style.borderRadius = "15px")
      : (textareaRef.current.style.borderRadius = "25px");
    // Resize textarea based on content
    if (textareaRef.current) {
      textareaRef.current.style.height = "30px";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [messageData]);

  //handle chat submit
  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    console.log("Button clicked");

    const formData = new FormData();
    formData.append("msgdata", messageData);
    formData.append("selectedUserId", selectedUserId);

    axios
      .post(`${config.apiBaseUrl}backend/postChat.php`, formData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.success) {
          setMessagedata("");
          handleGetChats();
        } else {
          console.log("error : ", response.data.error);
        }
      })
      .catch((error) => {
        console.error("Error in submission", error);
      });
  };

  //get chats
  const handleGetChats = () => {
    if (selectedUserId !== null) {
      axios
        .get(
          `${config.apiBaseUrl}backend/ADMIN_PHP/getChats.php?userid=${selectedUserId}`,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          setChatData(response.data.chats);
          setCurrUid(response.data.currid);
        })
        .catch((error) => {
          console.log("Error: ", "Failed to fetch data");
        });
    }
  };

  useEffect(() => {
    handleGetChats();
  }, [selectedUserId]);

  //get connected
  useEffect(() => {
    axios
      .get(`${config.apiBaseUrl}backend/ADMIN_PHP/getConnected.php`, {
        withCredentials: true,
      })
      .then((response) => {
        setconnectedData(response.data.convo);
      })
      .catch((error) => {
        console.log("Failed on data fetching", error);
      });
  }, []);

  //get conversation
  const getConversationList = () => {
    axios
      .get(`${config.apiBaseUrl}backend/ADMIN_PHP/getConversationlist.php`, {
        withCredentials: true,
      })
      .then((response) => {
        setconvoData(response.data.convo);
      })
      .catch((error) => {
        console.log("Failed on data fetching", error);
      });
  };

  useEffect(() => {
    getConversationList();
  }, []);

  const selectedUser = convoData.find(
    (convodata) => convodata.user_0 === selectedUserId
  );

  const selectedUser2 = connectedData.find(
    (cdata) => cdata.user_0 === selectedUserId
  );

  // Auto-scroll to the bottom when chatData updates
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatData]);

  //get conversation
  const getUnrepliedMesage = () => {
    axios
      .get(
        `${config.apiBaseUrl}backend/ADMIN_PHP/getUnrepliedMesage.php?userid=${selectedUserId}`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setUnRepliedData(response.data.chats);
        setUnrepliedCount(response.data.chats.length);
      })
      .catch((error) => {
        console.log("Failed on data fetching", error);
      });
  };

  useEffect(() => {
    getUnrepliedMesage();
  }, [selectedUserId]);

  //handleReload
  const handleReload = () => {
    // getUnrepliedMesage();
    // getConversationList();
    window.location.reload();
  };

  return (
    <>
      <div className="chat_a">
        <div className={`chat_a-left ${showLeft ? "show" : ""}`}>
          <div className="left-top">
            <h6>Unreplied Questions</h6>
            <i className="bi bi-arrow-clockwise" onClick={handleReload}></i>
            <i
              className="bi bi-x-lg close"
              onClick={() => setShowLeft(false)}
            ></i>
          </div>

          <div className="left-wrapper">
            {convoData && convoData.length > 0 ? (
              convoData.map((convodata) => (
                <div
                  className="card"
                  key={convodata.convo_id}
                  onClick={() => {
                    handleGetSelectUnreplied(convodata.user_0);
                    setShowLeft(false);
                  }}
                >
                  <div className="pp-name">
                    <img
                      src={
                        convodata.profilePic
                          ? `${config.apiBaseUrl}backend/uploads/${convodata.profilePic}`
                          : pp
                      }
                      alt=""
                    />
                    <div className="name-msg">
                      <span className="name">{convodata.username}</span>
                      <p>{convodata.message}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <></> // Empty fragment to prevent rendering "No conversations available"
            )}
          </div>
        </div>

        <div className="chat_a-content">
          <div className="chat-content">
            <div className="top-mobile">
              <button onClick={() => setShowLeft(true)}>Unreplied</button>
              <button onClick={() => setShowRight(true)}>Connected</button>
            </div>
            <div className="topc">
              <span className="top-left">
                {selectedUser
                  ? selectedUser.username
                  : selectedUser2
                  ? selectedUser2.username
                  : "No conversation"}
              </span>

              {selectedUser && (
                <div className="right">
                  <button>Unreplied</button>
                  {unrepliedCount < 1 ? (
                    " "
                  ) : (
                    <div className="note">{unrepliedCount}</div>
                  )}
                </div>
              )}
            </div>

            {showConn && (
              <div className="chat-box">
                <div className="chat-wrapper">
                  {chatData.length > 0 ? (
                    chatData.map((chat, index) => (
                      <div
                        key={index}
                        className={
                          currid === chat.user_id ? "sender" : "reciever"
                        }
                      >
                        <div className="chat-card">
                          <p>{chat.message}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-msg">
                      <img src={nomsg} alt="" />
                    </div>
                  )}

                  <div ref={chatEndRef}></div>
                </div>

                <div className="input-wrapper1">
                  <div className="input-wrapper2">
                    <textarea
                      name="message"
                      placeholder="Message"
                      value={messageData}
                      onChange={(e) => setMessagedata(e.target.value)}
                      ref={textareaRef}
                    ></textarea>
                    <i
                      className={`bi bi-send-fill sendicon ${
                        isSendBtnDisabled ? "disabled" : ""
                      }`}
                      onClick={isSendBtnDisabled ? null : handleSubmitMessage}
                    ></i>
                  </div>
                </div>
              </div>
            )}

            {showUnrep && (
              <div className="modal-unreplied">
                <div className="content">
                  <div className="chats">
                    {unrepliedData &&
                      unrepliedData.map((c) => {
                        return (
                          <div className="card" key={c.msg_id}>
                            <p> {c.message}</p>

                            <div className="bot">
                              <span
                                onClick={() =>
                                  handleShowInput(
                                    c.msg_id,
                                    c.message,
                                    c.user_id,
                                    c.convo_id
                                  )
                                }
                              >
                                reply
                              </span>
                            </div>

                            {showTextArea === c.msg_id && (
                              <div className="textarea">
                                <textarea
                                  placeholder="Response"
                                  value={reply}
                                  onChange={(e) => setReply(e.target.value)}
                                ></textarea>

                                <button onClick={handleSubmitReply}>
                                  <i className="bi bi-send-fill"></i> Send
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={`chat_a-right ${showRigt ? "show" : ""}`}>
            <div className="right-top">
              <h6>Connected</h6>

              <i className="bi bi-x-lg" onClick={() => setShowRight(false)}></i>
            </div>

            <div className="right-wrapper">
              {connectedData ? (
                connectedData.map((cdata) => (
                  <div
                    className="card"
                    key={cdata.convo_id}
                    // onClick={() => setSelectedUserId(cdata.user_0)}
                    onClick={() => {
                      handleGetSelectConnected(cdata.user_0);
                      setShowRight(false);
                    }}
                  >
                    <div className="pp-name">
                      <img
                        src={
                          cdata.profilePic
                            ? `${config.apiBaseUrl}backend/uploads/${cdata.profilePic}`
                            : pp
                        }
                        alt=""
                      />
                      <div className="wrapper-name">
                        <span className="name">{cdata.username}</span>
                        <p>{cdata.message}</p>
                      </div>

                      {/* <div className="active-icon"></div> */}
                    </div>
                  </div>
                ))
              ) : (
                <p>Loading</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {showModalUnreply && <div className="overlay"></div>}
    </>
  );
};

export default Chat_a;
