import "./upload.scss";
import pp from "../../assets/hckr.webp";
import { useState } from "react";
import axios from "axios";
import config from "../../BaseURL";

export const Upload = ({ closeUploadModal }) => {
  const [showPublicPrivate, setShowPublicPrivate] = useState(false);
  const [showPosting, setShowPosting] = useState(false);
  const [showPosted, setShowPosted] = useState(false);
  const [files, setFiles] = useState([]);
  const [caption, setCaption] = useState("");
  const [privacy, setPrivacy] = useState("public");

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
    formData.append("privacy", privacy);

    setShowPosting(true); // Show "Posting..." message

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
        setFiles([]);
        setCaption("");
        setPrivacy("public");
        setShowPosting(false); // Hide "Posting..." message
        setShowPosted(true); // Show "Posted" message
        setTimeout(() => {
          setShowPosted(false); // Hide "Posted" message after 2 seconds
          closeModal(); // Close the modal after showing "Posted"
        }, 2000);
      } else {
        console.error("Upload failed", response.data.errors);
        setShowPosting(false); // Hide "Posting..." message if upload fails
      }
    } catch (error) {
      console.error("Upload failed", error);
      setShowPosting(false); // Hide "Posting..." message if upload fails
    }
  };

  return (
    <>
      <div className="upload-modal">
        <div className="upload-container">
          <div className="upload-top">
            <span>Upload your captured</span>
            <i className="bi bi-x-lg" onClick={closeUploadModal}></i>
          </div>

          <div className="info-btnpost">
            <div className="pp-name-privacy">
              <img src={pp} alt="" />

              <div className="name-privacy">
                <span>Name</span>

                <div className="i-text">
                  <i
                    className={`bi bi-shield-check ${
                      privacy === "private"
                        ? "bi bi-shield-check"
                        : "bi bi-globe-americas"
                    }`}
                    onClick={() => setShowPublicPrivate(!showPublicPrivate)}
                  ></i>
                  <p>{privacy}</p>

                  {showPublicPrivate && (
                    <>
                      <div className="triangle"></div>
                      <div className="private-public">
                        <button onClick={() => handlePrivacyChange("public")}>
                          Public
                        </button>
                        <button onClick={() => handlePrivacyChange("private")}>
                          Private
                        </button>
                      </div>
                    </>
                  )}

                  <i
                    className="bi bi-caret-down-fill arrow-down"
                    onClick={() => setShowPublicPrivate(!showPublicPrivate)}
                  ></i>
                </div>
              </div>
            </div>
          </div>

          <div className="input-upload-btn">
            <textarea
              name="caption"
              id="caption"
              placeholder="Add caption"
              value={caption}
              onChange={handleCaptionChange}
            ></textarea>

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
          <p>Posting...</p>
        </div>
      )}

      {/* show after successful post */}
      {showPosted && (
        <div className="posted">
          <p>Succesfully posted</p>
        </div>
      )}
    </>
  );
};
