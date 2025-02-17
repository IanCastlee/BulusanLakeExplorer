import "./openimage.scss";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SidebarContext } from "../../../context/Sidebarcontext";
import config from "../../../BaseURL";

const OpenImage = () => {
  const { data2 } = useContext(SidebarContext); // Access data2 from context
  const { img_id } = useParams(); // Get img_id from the URL
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Find the index of the image with the current img_id
    const index = data2.findIndex((img) => img.image_id === parseInt(img_id));

    // Set the current image index
    setCurrentIndex(index >= 0 ? index : 0);
  }, [img_id, data2]);

  const handleNext = () => {
    if (currentIndex < data2.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  if (data2.length === 0) return <p>Loading...</p>; // Show loading indicator if no images

  return (
    <div className="open-image">
      <div className="container">
        {/* Conditionally render the Previous button */}
        {currentIndex > 0 && (
          <span className="span1" onClick={handlePrev}>
            <i className="bi bi-chevron-compact-left"></i>
          </span>
        )}

        <div className="wrapper">
          <img
            src={`${config.apiBaseUrl}backend/uploads/${data2[currentIndex].image_path}`}
            alt=""
          />
        </div>

        {/* Conditionally render the Next button */}
        {currentIndex < data2.length - 1 && (
          <span className="span2" onClick={handleNext}>
            <i className="bi bi-chevron-compact-right"></i>
          </span>
        )}
      </div>
    </div>
  );
};

export default OpenImage;
