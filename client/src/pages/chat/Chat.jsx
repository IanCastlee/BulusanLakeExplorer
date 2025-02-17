import "./chat.scss";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import config from "../../BaseURL";
import Fuse from "fuse.js";
import { useNavigate } from "react-router-dom";
import eyybot from "../../assets/chatbot.png";
import pp from "../../assets/chat-bot.png";
import ppadmin from "../../assets/admin.png";

const Chat = () => {
  const [messageData, setMessageData] = useState("");
  const [isSendBtnDisabled, setIsSendBtnDisabled] = useState(true);
  const [chatData, setChatData] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [chatbotData, setChatBotData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [typing, setTyping] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const [showInfoModal, setShowInfoModal] = useState(false);

  const navigate = useNavigate();
  const textareaRef = useRef(null);
  const chatEndRef = useRef(null);

  const [length_, setLength_] = useState(0);
  const [prevLength, setPrevLength] = useState(0);

  const [reload, setReload] = useState(false);

  //---------------------------------
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [showMessageMark, setshowMessageMark] = useState(false);
  //
  const handleClickMessage = (click_msg) => {
    if (isModalVisible === click_msg) {
      setIsModalVisible(true);
      return;
    }
    setIsModalVisible(click_msg);
  };

  //------------------------------------------------

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleClickScroll = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setIsSendBtnDisabled(messageData.trim() === "");
    if (textareaRef.current) {
      textareaRef.current.style.height = "30px";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [messageData]);

  const handleSubmitMessage = async (e, currentMessageData = messageData) => {
    if (e) e.preventDefault();

    if (!currentMessageData.trim() && !imageFile) {
      return;
    }

    setIsSending(true);
    const formData = new FormData();
    formData.append("msgdata", currentMessageData);
    formData.append("fileImg", imageFile);
    formData.append("selectedUserId", 27);

    try {
      const response = await axios.post(
        `${config.apiBaseUrl}backend/postChat.php`,
        formData,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setMessageData(""); // Clear input after successful submission
        setIsSending(false);
        fetchChats();
        handleBotResponse(currentMessageData);
      } else {
        console.log(response.data.error);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const fetchChats = async () => {
    try {
      const response = await axios.get(
        `${config.apiBaseUrl}backend/getChats.php?userid=${27}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.chats.length === 0) {
        // Add welcome message if there are no previous conversations
        const welcomeMessages = [
          {
            user_id: 27,
            message:
              "Hi Explorer! 😊 Welcome to the Bulusan Lake information bot. How can I help you today? Whether you need information about activities, directions, or anything else, I’m here to assist!",
          },
          {
            user_id: 27,
            message:
              "I recommend using the suggested questions related to your question for a more accurate response.",
          },
        ];
        console.log(
          "No previous chats found. Displaying welcome messages:",
          welcomeMessages
        );
        setChatData(welcomeMessages);
      } else {
        setChatData(response.data.chats);
        setLength_(response.data.chats.length);
        // if (response.data.chats.length > prevLength) {
        //   // Scroll to the bottom if new messages are added
        //   chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        // } else {
        //   // If no new messages, do nothing (or log the status)
        //   console.log("No new messages, no need to scroll.");
        // }

        // setPrevLength(response.data.chats.length);
      }
    } catch (error) {
      console.log("Failed to fetch chats:", error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  // Fetch chats every 3 seconds
  // // useEffect(() => {
  // //   fetchChats();
  // //   const intervalId = setInterval(fetchChats, 3000);
  // //   return () => clearInterval(intervalId);
  // // }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatData, chatData]);

  const handleBackClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    axios
      .get(`${config.apiBaseUrl}backend/ADMIN_PHP/getChatBot.php`, {
        withCredentials: true,
      })
      .then((response) => {
        setChatBotData(response.data);
      })
      .catch((error) => {
        console.log("Error on fetching  : ", error);
      });
  }, []);

  const fuse = new Fuse(chatbotData, {
    keys: ["query"],
    includeScore: true,
    threshold: 0.4,
  });

  useEffect(() => {
    if (messageData.trim() !== "") {
      const results = fuse.search(messageData);
      setSuggestions(results.map((result) => result.item.query).slice(0, 3));
    } else {
      setSuggestions([]);
    }
  }, [messageData]);

  //------------------------------------------------------------------------------------------------
  const handleBotResponse = async (userMessage) => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

    const results = fuse.search(userMessage);
    const botResponse = results[0]?.item;

    let typingTimeoutId;

    typingTimeoutId = setTimeout(() => {
      setTyping(true);
    }, 1000);

    if (botResponse) {
      setChatData((prevChatData) => [
        ...prevChatData,
        { user_id: 0, message: botResponse.response, msg_id: Date.now() },
      ]);

      setTimeout(async () => {
        const formData = new FormData();
        formData.append("msgdataChatBot", botResponse.response);
        formData.append("selectedUserId", 27);

        try {
          const response = await axios.post(
            `${config.apiBaseUrl}backend/postChat.php`,
            formData,
            { withCredentials: true }
          );

          if (response.data.success) {
            fetchChats();
            setTimeout(() => {
              chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100); // Adding a slight delay to ensure chat data is updated
            console.log("Message : ", response.data.message);
          } else {
            console.log(response.data.error);
          }
        } catch (error) {
          console.log("Error sending bot response:", error);
        } finally {
          clearTimeout(typingTimeoutId);
          setTyping(false);
        }
      }, 3000);
    } else {
      clearTimeout(typingTimeoutId);
      setTyping(false);
      setChatData((prevChatData) => [...prevChatData]);

      const formData = new FormData();
      formData.append(
        "msgdataChatBot",
        "I don't have information on that question right now. Please mark your message as 'unreplied' so our admin can review and respond."
      );
      formData.append("selectedUserId", 27);

      try {
        const response = await axios.post(
          `${config.apiBaseUrl}backend/postChat.php`,
          formData,
          { withCredentials: true }
        );

        if (response.data.success) {
          setTimeout(() => {
            fetchChats();
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 1000);
        } else {
          console.log(response.data.error);
        }
      } catch (error) {
        console.log("Error sending bot response:", error);
      }
    }
  };

  //--------------------------------------------------------------------------------------

  useEffect(() => {
    if (typing) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [typing]);

  const handleSuggestionClick = (suggestion) => {
    setMessageData(suggestion);

    // Use a callback to ensure that `handleSubmitMessage` uses the updated `messageData`
    setTimeout(() => {
      handleSubmitMessage(null, suggestion); // Pass the suggestion as a parameter
    }, 0);
  };

  //handleDeleteMessage
  const handleDeleteMessage = (msg_id) => {
    console.log("clicked");
    axios
      .post(`${config.apiBaseUrl}backend/deleteChat.php?msg_id=${msg_id}`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log("Deleted successfully");
        if (response.data.success) {
          setChatData((prevChatData) =>
            prevChatData.filter((data) => data.msg_id !== msg_id)
          );
        } else {
          console.log("Error deleting:", response.data.error);
        }
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  };

  //handleUnrepliedMessage
  const handleUnrepliedMessage = (msg_id) => {
    const formdata = new FormData();
    formdata.append("msg_id", msg_id);
    axios
      .post(`${config.apiBaseUrl}backend/unrepliedChat.php`, formdata, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.success) {
          console.log("UnrepliedChat successfully");
          setshowMessageMark(true);
          setMessageData("");
          setTimeout(() => {
            setshowMessageMark(false);
          }, 2000);
        } else {
          console.log("Error updating message:", response.data.error);
        }
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  };

  //handleReload
  const handleReload = () => {
    window.location.reload();
    setReload(true);

    setTimeout(() => {
      setReload(false);
    }, 1000);
  };

  return (
    <>
      <div className="chat">
        {/* // <h6>BulusanLakeExplorer Chat</h6> */}
        <div className="chat-content">
          <div className="topc">
            <div className="t-left">
              <img src={eyybot} alt="" />
              <span className="top-left">BuluBot</span>
            </div>

            <div className="right-buttons">
              <i
                className="bi bi-arrow-left-short back"
                onClick={handleBackClick}
              ></i>
              <i
                className={`bi bi-arrow-clockwise ${reload ? "reload" : ""}`}
                onClick={handleReload}
              ></i>

              <i
                className="bi bi-info-circle"
                onClick={() => setShowInfoModal(!showInfoModal)}
              ></i>
            </div>
          </div>

          <div className="chat-box">
            <div className="chat-wrapper">
              {chatData.length > 0 ? (
                chatData.map((cdata) => (
                  <div
                    onClick={() => handleClickMessage(cdata.msg_id)}
                    className={cdata.user_id === 27 ? "admin" : "user"}
                    key={cdata.msg_id}
                  >
                    {cdata.user_id !== 27 &&
                      isModalVisible === cdata.msg_id && (
                        <div className="modal-action">
                          <div className="content">
                            <span
                              className="unreplied"
                              onClick={() =>
                                handleUnrepliedMessage(cdata.msg_id)
                              }
                            >
                              Unreplied
                              {cdata.notanswered == 0 && (
                                <i
                                  className="bi bi-check"
                                  style={{ color: "green", fontSize: "20px" }}
                                ></i>
                              )}
                            </span>
                            <span
                              className="delete"
                              onClick={() => handleDeleteMessage(cdata.msg_id)}
                            >
                              Delete
                            </span>
                          </div>
                        </div>
                      )}
                    {cdata.user_id === 27 &&
                      (cdata.notanswered == 2 ? (
                        <img src={ppadmin} alt="" className="icon-chatbot" />
                      ) : (
                        <img src={pp} alt="" className="icon-chatbot" />
                      ))}
                    <div className="chat-card">
                      <p className="msg">{cdata.message}</p>
                    </div>
                    <div className="c-bot">
                      <p>Sent</p>
                    </div>
                    <div ref={chatEndRef} />{" "}
                    {/* This is where the ref is attached */}
                  </div>
                ))
              ) : (
                <div className="no-msg">
                  <i className="bi bi-chat-square-quote-fill"></i>
                  <span>Start Conversation</span>
                </div>
              )}
              {isSending && (
                <div className="sending">
                  <div className="chat-card">
                    <p className="msg">{messageData}</p>
                    <span className="s">sending...</span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef}></div>

              {typing && <div className="loader"></div>}
            </div>

            <div className="input-wrapper1">
              {suggestions.length > 0 && (
                <div className="suggestions">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                      {index < suggestions.length - 1 && ","}
                    </div>
                  ))}
                </div>
              )}

              <div className="input-wrapper2">
                <textarea
                  name="message"
                  placeholder="Message"
                  value={messageData}
                  onChange={(e) => setMessageData(e.target.value)}
                  ref={textareaRef}
                  onClick={handleClickScroll}
                ></textarea>
                <i
                  className={`bi bi-send-fill sendicon ${
                    isSendBtnDisabled && imageFile === null ? "disabled" : ""
                  }`}
                  onClick={isSendBtnDisabled ? null : handleSubmitMessage}
                ></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showMessageMark && (
        <div className="messageEnrep">
          <p>Sent Succesfully</p>
        </div>
      )}
      {showInfoModal && (
        <div className="modal-info">
          <div className="top">
            {" "}
            <span>About BuluBot</span>
            <i className="bi bi-x" onClick={() => setShowInfoModal(false)}></i>
          </div>
          <p>
            Please be informed that there are instances where the chatbot may
            encounter questions it cannot answer accurately. If this happens,
            you can mark these as Unanswered Questions. This will notify the
            admin, allowing them to review and respond to the user's question
            directly.
          </p>

          <p>Thank you for your understanding!</p>
        </div>
      )}
      {showInfoModal && <div className="modal-info-overlay"></div>}{" "}
    </>
  );
};

export default Chat;
