import "./biosearch.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import config from "../../BaseURL";

const Biosearch = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState({
    type: "",
    characteristic: "",
  });
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false); // New state to track if a search has been performed

  const [showInfoModal, setShowInfoModal] = useState(false);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery((prevQuery) => ({
      ...prevQuery,
      [name]: value,
    }));
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    // Trim the input values
    const trimmedQuery = {
      type: searchQuery.type.trim(),
      characteristic: searchQuery.characteristic.trim(),
    };

    // Check if both search fields are empty
    if (!trimmedQuery.type && !trimmedQuery.characteristic) {
      setResults([]); // Set results to empty array if fields are empty
      return;
    }

    try {
      const response = await axios.get(
        `${config.apiBaseUrl}backend/searchBiodiversity.php`,
        {
          params: trimmedQuery,
          withCredentials: true,
        }
      );
      setResults(response.data);
      setHasSearched(true); // Mark that a search has been performed
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  // Handle the back icon click
  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="bio-search">
        <div className="containerb">
          <div className="biosearch-top">
            <div className="leftb">
              <i
                className="bi bi-arrow-left-short back-icon"
                onClick={handleBackClick}
              ></i>

              <i
                className="bi bi-info-circle"
                onClick={() => setShowInfoModal(true)}
              ></i>
            </div>
          </div>
          <div className="search-input-wrapper">
            <input
              type="text"
              name="type"
              placeholder="Type (e.g., Bird)"
              value={searchQuery.type}
              onChange={handleSearchChange}
            />
            <input
              type="text"
              name="characteristic"
              placeholder="Characteristics(e.g. yellow )"
              value={searchQuery.characteristic}
              onChange={handleSearchChange}
            />
            <i className="bi bi-search" onClick={handleSearchSubmit}></i>
          </div>

          <div className="result">
            <div className="result-wrapper">
              {!hasSearched ? (
                <p
                  style={{
                    fontSize: "20px",
                    marginTop: "100px",
                    color: "gray",
                    textAlign: "center",
                    marginLeft: "20px",
                  }}
                >
                  Hurry up! Search what you saw. <br />
                  <i className="bi bi-search" style={{ fontSize: "40px" }}></i>
                </p>
              ) : results.length === 0 ? (
                <p
                  style={{
                    fontSize: "20px",
                    marginTop: "100px",
                    color: "lightgray",
                  }}
                >
                  No results found
                </p>
              ) : (
                results.map((result) => (
                  <Link
                    key={result.bio_id}
                    to={`/bio-details/${result.bio_id}`}
                    className="card"
                  >
                    <img
                      src={`${config.apiBaseUrl}backend/ADMIN_PHP/bioimages/${result.image}`}
                      alt={result.name}
                    />
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      {showInfoModal && (
        <div className="modal-info">
          <div className="top">
            {" "}
            <span>About Biodiversity Search</span>
            <i className="bi bi-x" onClick={() => setShowInfoModal(false)}></i>
          </div>
          <p>
            There may be instances where the system does not provide a response.
            This could be because some biodiversity in Bulusan Lake has not yet
            been included in our database, as our records are still being
            updated to reflect the vast variety of species in the area.
            Additionally, it is possible that the system could not process your
            query due to an incorrect input. To improve your chances of finding
            a result, please double-check your spelling or provide a more
            detailed description of what you are searching for. Thank you for
            your understanding as we continue to enhance our database to better
            serve you.
          </p>

          <p>Thank you for your understanding!</p>
        </div>
      )}
      {showInfoModal && <div className="modal-info-overlay"></div>}{" "}
    </>
  );
};

export default Biosearch;
