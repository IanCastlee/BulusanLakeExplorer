import "./feed.scss";
import { useContext, useEffect, useState } from "react";
import pp from "../../assets/hckr.webp";
import Comment from "../../components/comment/Comment";
import { Upload } from "../../components/upload/Upload";
import { SidebarContext } from "../../context/Sidebarcontext";
import Signup from "../signup/Signup";
import axios from "axios";
import config from "../../BaseURL";
import { Link } from "react-router-dom";

const Feed = () => {
  const [showRight, setRight] = useState(false);
  const [showUpload, setUpload] = useState(false);
  const [showSignIn, setShowSignin] = useState(false);
  const [posts, setPosts] = useState([]);

  const { userid } = useContext(SidebarContext);

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
    axios
      .get(`${config.apiBaseUrl}backend/getPosts.php`, {
        withCredentials: true,
      })
      .then((response) => {
        setPosts(response.data.posts);
        console.log("first", response.data.posts);
      })
      .catch((errors) => {
        console.error("Error fetching posts:", errors);
      });
  }, []);

  // Function to get the class name based on the number of images
  const getImageClass = (imageCount) => {
    if (imageCount === 1) return "one";
    if (imageCount === 2) return "two";
    if (imageCount === 3) return "three";
    if (imageCount === 4) return "four";
    return "five";
  };

  return (
    <>
      <div className="feed">
        <div className="left">
          <div className="upload" onClick={handleClickUpload}>
            <i className="bi bi-file-earmark-image-fill"></i>
            <input
              type="text"
              placeholder="Share your Lake experience"
              readOnly
            />
          </div>

          {posts ? (
            posts.map((post) => {
              const imageCount = post.images.length;
              const showOverlay = imageCount > 5;
              const additionalCount = imageCount - 5;

              return (
                <div key={post.post_id} className="wrapper">
                  <Link
                    to={`/view-post/${post.post_id}`}
                    className={`post-img-wrapper ${getImageClass(imageCount)}`}
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
                  <div className="caption">
                    <p>{post.caption}</p>
                  </div>
                  <div className="action">
                    <div className="pp-name-date">
                      <img src={pp} alt="" />
                      <div className="name-date">
                        <span>{post.username}</span>
                        <p>{post.createdAt}</p>
                      </div>
                    </div>
                    <div className="icon-btns">
                      <div className="icon">
                        <i className="bi bi-suit-heart"></i>
                        <p>3</p>
                      </div>
                      <div
                        className="icon"
                        onClick={() => setRight(!showRight)}
                      >
                        <i className="bi bi-chat"></i>
                        <p>5</p>
                      </div>
                      <div className="icon">
                        <i className="bi bi-three-dots-vertical"></i>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No posts available</p>
          )}
        </div>
        {showRight && <Comment closeComment={() => setRight(false)} />}
      </div>
      {showUpload && <Upload closeUploadModal={() => setUpload(false)} />}
      {showSignIn && <Signup closeModal={() => setShowSignin(false)} />}
    </>
  );
};

export default Feed;
