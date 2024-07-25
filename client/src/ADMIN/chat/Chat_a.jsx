import "./chat_a.scss";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import config from "../../BaseURL";
import pp from "../../assets/hckr.webp";
import nomsg from "../../assets/chat (12).png";

const Chat_a = () => {
  const [messageData, setMessagedata] = useState("");
  const [isSendBtnDisabled, setIsSendBtnDisabled] = useState(true);
  const [chatData, setChatData] = useState([]);
  const [connectedData, setconnectedData] = useState([]);
  const [convoData, setconvoData] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [currid, setCurrUid] = useState(0);

  const textareaRef = useRef(null);

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
        } else {
          console.log("error : ", response.data.error);
        }
      })
      .catch((error) => {
        console.error("Error in submission", error);
      });
  };

  //get chats
  useEffect(() => {
    if (selectedUserId !== null) {
      axios
        .get(
          `${config.apiBaseUrl}backend/getChats.php?userid=${selectedUserId}`,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          setChatData(response.data.chats);
          setCurrUid(response.data.currid);
          console.log("Chats: ", response.data.chats);
        })
        .catch((error) => {
          console.log("Error: ", "Failed to fetch data");
        });
    }
  }, [selectedUserId]);

  //get connected
  useEffect(() => {
    axios
      .get(`${config.apiBaseUrl}backend/ADMIN_PHP/getConnected.php`, {
        withCredentials: true,
      })
      .then((response) => {
        setconnectedData(response.data.connectedUser);
        console.log("ConnectedUser: ", response.data.connectedUser);
      })
      .catch((error) => {
        console.log("Failed on data fetching", error);
      });
  }, []);

  //get conversation
  useEffect(() => {
    axios
      .get(`${config.apiBaseUrl}backend/ADMIN_PHP/getConversationlist.php`, {
        withCredentials: true,
      })
      .then((response) => {
        setconvoData(response.data.convo);
        console.log("Convo: ", response.data.convo);
      })
      .catch((error) => {
        console.log("Failed on data fetching", error);
      });
  }, []);

  const selectedUser = convoData.find(
    (convodata) => convodata.user_0 === selectedUserId
  );
  return (
    <>
      <div className="chat_a">
        <div className="chat_a-left">
          <div className="left-top">
            <h6>Chats</h6>
          </div>

          <div className="left-wrapper">
            {convoData ? (
              convoData.map((convodata) => (
                <div
                  className="card"
                  key={convodata.convo_id}
                  onClick={() => setSelectedUserId(convodata.user_0)}
                >
                  <div className="pp-name">
                    <img src={pp} alt="" />
                    <div className="name-msg">
                      <span className="name">{convodata.fullname}</span>
                      <p>{convodata.message}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Loading</p>
            )}
          </div>
        </div>

        <div className="chat_a-content">
          <div className="chat-content">
            <div className="topc">
              <span className="top-left">
                {selectedUser ? selectedUser.fullname : "No conversation"}
              </span>
            </div>

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
                      <span className="date">{chat.createdAt}</span>
                    </div>
                  ))
                ) : (
                  <div className="no-msg">
                    <img src={nomsg} alt="" />
                    <span>Start Conversation</span>
                  </div>
                )}
              </div>

              <div className="input-wrapper1">
                <div className="input-wrapper2">
                  <i className="bi bi-file-earmark-image-fill img-i"></i>
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
          </div>

          <div className="chat_a-right">
            <div className="right-top">
              <h6>Connected</h6>
            </div>

            <div className="right-wrapper">
              {connectedData ? (
                connectedData.map((cdata) => (
                  <div className="card" key={cdata.convo_id}>
                    <div className="pp-name">
                      <img src={pp} alt="" />
                      <span className="name">{cdata.fullname}</span>

                      <div className="active-icon"></div>
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
    </>
  );
};

export default Chat_a;
