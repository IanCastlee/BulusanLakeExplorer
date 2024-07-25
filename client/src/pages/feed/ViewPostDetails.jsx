import "./viewpostdetails.scss";
import { useParams } from "react-router-dom";
import pp from "../../assets/bg.jpg";
import { useEffect, useState } from "react";
import axios from "axios";
import config from "../../BaseURL";

const ViewPostDetails = () => {
  const { post_id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    axios
      .get(`${config.apiBaseUrl}backend/getViewPost.php?post_id=${post_id}`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.success) {
          setPost(response.data.post);
          console.log(response.data.post);
        } else {
          console.error(response.data.errors);
        }
      })
      .catch((error) => {
        console.error("Error fetching post details:", error);
      });
  }, [post_id]);

  if (!post) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="post-details">
        <div className="card">
          <div className="top">
            <div className="wr">
              <div className="pp-name-date">
                <img src={pp} alt="Profile" />
                <div className="name-date">
                  <span>{post[0].username}</span>
                  <p>{new Date(post[0].createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="icon-btns">
                <div className="icon">
                  <i className="bi bi-suit-heart"></i>
                  <p>3</p>
                </div>
                <div className="icon">
                  <i className="bi bi-chat"></i>
                  <p>5</p>
                </div>
                <div className="icon">
                  <i className="bi bi-three-dots-vertical"></i>
                </div>
              </div>
            </div>

            <div className="caption">
              <p>{post[0].caption}</p>
            </div>
          </div>

          <div className="images">
            {post.map((img, index) => (
              <img
                key={index}
                src={`${config.apiBaseUrl}backend/uploads/${img.image_path}`}
                alt={`post-${index}`}
                className="post-img"
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewPostDetails;
