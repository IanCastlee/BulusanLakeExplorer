import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import config from "../../BaseURL";
import pp from "../../assets/user (8).png";
import "./comment.scss";

import { invalidWords } from "../../badwords";
import { SidebarContext } from "../../context/Sidebarcontext";
import Signup from "../../pages/signup/Signup";
import { CommentCountContext } from "../../context/CommentCountProvider ";

const Comment = ({ closeComment, selectedPost }) => {
  const [commentData, setCommentData] = useState("");
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSignUp, setShowSignUp] = useState(false);
  const [showModalSignIn, setShowModalSignIn] = useState(false);

  const { setCommentCount } = useContext(CommentCountContext);
  const { userid } = useContext(SidebarContext);
  const chatEndRef = useRef(null);

  const [showDelete, setShowDelete] = useState(false);
  const [showDletetedMsg, setshowDletetedMsg] = useState(false);

  // Function to check for invalid words and return them
  const getInvalidWords = (comment) => {
    const words = comment.toLowerCase().split(/\s+/);
    const foundWords = words.filter((word) => invalidWords.includes(word));
    return [...new Set(foundWords)]; // Remove duplicates
  };

  //onchange
  const handleChangeComment = (e) => {
    setCommentData(e.target.value);
    setErrorMessage("");
  };

  // /handleHideModalSignAfterClicked
  const handleHideModalSignAfterClicked = () => {
    setShowModalSignIn(false);
    setShowSignUp(true);
  };
  // Post comment
  const handlePostComment = async (e) => {
    e.preventDefault();

    if (userid == 0) {
      setShowModalSignIn(true);
      return;
    }

    const invalidWordsFound = getInvalidWords(commentData);

    if (invalidWordsFound.length > 0) {
      setErrorMessage(
        `Your comment contains inappropriate words: ${invalidWordsFound.join(
          ", "
        )}. Please revise it.`
      );
      return;
    }

    const formData = new FormData();
    formData.append("comment", commentData);
    formData.append("post_id", selectedPost);

    axios
      .post(`${config.apiBaseUrl}backend/postComment.php`, formData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.success) {
          getComments();
          setCommentData("");
          setErrorMessage("");
        } else {
          console.log("Error : ", response.data.error);
        }
      })
      .catch((error) => {
        console.log("Error : ", error);
      });
  };

  // Get comments
  const getComments = () => {
    axios
      .get(
        `${config.apiBaseUrl}backend/getComments.php?post_id=${selectedPost}`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setComments(response.data.comments);
        setIsLoading(false);
        console.log("first:::", response.data.pid);
        setCommentCount(response.data.comments.length);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log("Error : ", error);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    getComments();
  }, [selectedPost]);

  // Auto-scroll to the bottom when chatData updates
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments]);

  //handleDeleteComment
  const handleDeleteComment = (comment_id) => {
    const formdata = new FormData();
    formdata.append("comment_id", comment_id);
    axios
      .post(`${config.apiBaseUrl}backend/deleteComment.php`, formdata, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.success) {
          setComments((prevComments) =>
            prevComments.filter((post) => post.comment_id !== comment_id)
          );
          getComments();
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

  //handleMoreClick
  const handleMoreClick = (comment_id) => {
    if (showDelete == comment_id) {
      setShowDelete(!showDelete);
      return;
    }
    setShowDelete(comment_id);
  };
  return (
    <>
      <div className="righttt">
        <div className="top2">
          <div className="top">
            <span className="comment-count">
              {comments && comments.length > 0
                ? comments.length +
                  (comments.length > 1 ? " comments" : " comment")
                : "No comments yet"}
            </span>
          </div>
        </div>
        <div className="comments">
          <div ref={chatEndRef}></div>

          {isLoading ? (
            <span className="loader"></span>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <div className="card" key={comment.comment_id}>
                <div className="pp-name-review">
                  <img
                    src={
                      comment.profilePic
                        ? `${config.apiBaseUrl}backend/uploads/${comment.profilePic}`
                        : pp
                    }
                    alt=""
                  />
                  <div className="name-review">
                    <span>{comment.username}</span>
                    <p>{comment.comment}</p>
                  </div>
                </div>
                <div className="bot">
                  <p>{comment.createdAt}</p>

                  <div className="more-wrapper">
                    {userid == comment.user_id && (
                      <i
                        className="bi bi-three-dots"
                        onClick={() => handleMoreClick(comment.comment_id)}
                      ></i>
                    )}
                    {showDelete === comment.comment_id && (
                      <div className="more-wrapper">
                        <div
                          style={{ cursor: "pointer" }}
                          className="rectangle"
                        >
                          <span
                            className="remove"
                            onClick={() =>
                              handleDeleteComment(comment.comment_id)
                            }
                          >
                            Delete
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="nocomments-wrapper">
              <i className="bi bi-chat-text-fill"></i>
              <p>No comments yet</p>
            </div>
          )}
        </div>

        <div className="input-wrapper">
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <div className="input">
            <textarea
              name=""
              placeholder="Share your comment"
              value={commentData}
              onChange={handleChangeComment}
            ></textarea>
            <i
              className="bi bi-file-arrow-up-fill"
              onClick={handlePostComment}
            ></i>
          </div>
        </div>
      </div>
      <div className="overlay-comment" onClick={closeComment}></div>

      {showModalSignIn && (
        <div className="signin-first-modal">
          <p>You need to sign in first.</p>

          <div className="buttons">
            <button
              style={{ color: "blue" }}
              onClick={handleHideModalSignAfterClicked}
            >
              Sign In
            </button>
            <button onClick={() => setShowModalSignIn(false)}>Cancel</button>
          </div>
        </div>
      )}

      {showSignUp && <Signup closeModal={() => setShowSignUp(false)} />}
      {showDletetedMsg && (
        <div className="comment-deleted-msg">
          <p>Comment Deleted</p>
        </div>
      )}
    </>
  );
};

export default Comment;
