import "./upload.scss";
import pp from "../../assets/user (8).png";
import { useContext, useState } from "react";
import axios from "axios";
import config from "../../BaseURL";
import { SidebarContext } from "../../context/Sidebarcontext";

export const Upload = ({ closeUploadModal, handleGetPost }) => {
  const { userInfo } = useContext(SidebarContext);

  const [showPublicPrivate, setShowPublicPrivate] = useState(false);
  const [showPosting, setShowPosting] = useState(false);
  const [showPosted, setShowPosted] = useState(false);
  const [files, setFiles] = useState([]);
  const [caption, setCaption] = useState("");
  const [privacy, setPrivacy] = useState("public");

  const [hashtag, setHashtag] = useState("");

  const handleHashtagClick = (tag) => {
    if (!hashtag.includes(tag)) {
      setHashtag((prev) => (prev ? `${prev} ${tag}` : tag));
    }
  };

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  const handlePrivacyChange = (privacySetting) => {
    setPrivacy(privacySetting);
    setShowPublicPrivate(false);
  };

  const handleRemoveImage = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });
    formData.append("caption", caption);
    formData.append("hashtag", hashtag);
    formData.append("privacy", privacy);

    setShowPosting(true);

    try {
      const response = await axios.post(
        `${config.apiBaseUrl}backend/uploadpost.php`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        // Reset states after successful upload
        setFiles([]);
        setCaption("");
        setPrivacy("public");
        setShowPosting(false);
        setShowPosted(true);
        handleGetPost();
        setTimeout(() => {
          setShowPosted(false);
        }, 9000);
      } else {
        setShowPosting(false);
        setFiles([]);
        if (response.data.errors && response.data.errors.length > 0) {
          alert(response.data.errors.join("\n"));
        }
      }
    } catch (error) {
      console.error("Upload failed", error);
      setShowPosting(false);
    }
  };

  return (
    <>
      <div className="upload-modal">
        <div className="upload-container">
          <div className="upload-top">
            <span>Create your post</span>
            <i className="bi bi-x-lg" onClick={closeUploadModal}></i>
          </div>

          <div className="note">
            <p>
              Note: Please ensure that all photos you upload are your own
              original content and are directly related to Bulusan Lake and its
              surroundings.
            </p>
          </div>

          <div className="info-btnpost">
            <div className="pp-name-privacy">
              <img
                src={
                  userInfo.profilePic
                    ? `${config.apiBaseUrl}backend/uploads/${userInfo.profilePic}`
                    : pp
                }
                alt=""
              />

              <div className="name-privacy">
                <span>{userInfo && userInfo.username}</span>

                <div className="i-text"></div>
              </div>
            </div>
          </div>
          <div className="hashtag-wrapper">
            <ul>
              {["#Kayak", "#Balsa", "#Boating", "#Bulusan Lake"].map((tag) => (
                <li key={tag} onClick={() => handleHashtagClick(tag)}>
                  {tag}
                </li>
              ))}
            </ul>
          </div>
          <div className="input-upload-btn">
            <textarea
              name="caption"
              id="caption"
              placeholder="Add caption"
              value={caption}
              onChange={handleCaptionChange}
            ></textarea>
            <input
              type="text"
              value={hashtag}
              onChange={(e) => setHashtag(e.target.value)}
            />
            <div className="btns">
              <div className="btn-text">
                <label htmlFor="file">
                  <i className="bi bi-file-earmark-image-fill"></i>
                  <span>Upload Image</span>
                </label>
                <input
                  type="file"
                  multiple
                  id="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>
              <button onClick={handleSubmit}>POST</button>
            </div>
          </div>

          <div className="image-choosen">
            {files.map((file, index) => (
              <div key={index} className="image-wrapper">
                <img src={URL.createObjectURL(file)} alt={`chosen ${index}`} />

                <i
                  className="bi bi-x-lg close-icon"
                  onClick={() => handleRemoveImage(index)}
                >
                  {" "}
                </i>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="overlay-upload"></div>

      {/* show after user click post */}
      {showPosting && (
        <div className="posting">
          <p>Uploading...</p>
        </div>
      )}

      {/* show after successful post */}
      {showPosted && (
        <div className="posted">
          <p>
            {" "}
            Your post has been successfully uploaded. Please wait while the
            admin reviews it before it appears in the feed.
          </p>
        </div>
      )}
    </>
  );
};
