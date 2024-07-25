import "./chat.scss";

import Sidebar from "../../components/sidebar/Sidebar";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import config from "../../BaseURL";
import nomsg from "../../assets/chat (12).png";

const Chat = () => {
  const [messageData, setMessagedata] = useState("");
  const [isSendBtnDisabled, setIsSendBtnDisabled] = useState(true);
  const [chatData, setChatData] = useState([]);

  const textareaRef = useRef(null);

  //input field customazation
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
    formData.append("selectedUserId", 27);

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
    axios
      .get(`${config.apiBaseUrl}backend/getChats.php?userid=${27}`, {
        withCredentials: true,
      })
      .then((response) => {
        setChatData(response.data.chats);
        console.log("CHATS : ", response.data.chats);
      })
      .catch((error) => {
        console.log("error : ", "Failed to fetch data");
      });
  }, []);

  return (
    <>
      <div className="chat">
        <Sidebar />

        <div className="chat-content">
          <div className="topc">
            <span className="top-left">Bulusan Lake Admin</span>
          </div>

          <div className="chat-box">
            <div className="chat-wrapper">
              {chatData.length > 0 ? (
                chatData.map((cdata) => (
                  <div
                    className={cdata.user_id === 27 ? "admin" : "user"}
                    key={cdata.msg_id}
                  >
                    <div className="chat-card">
                      <p>{cdata.message}</p>
                    </div>

                    <span className="date">3 mins</span>
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
      </div>
    </>
  );
};

export default Chat;
