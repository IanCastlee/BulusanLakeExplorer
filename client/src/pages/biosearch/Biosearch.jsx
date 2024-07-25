import "./biosearch.scss";
import img from "../../assets/bg.jpg";
import { Link } from "react-router-dom";

const Biosearch = () => {
  return (
    <>
      <div className="bio-search">
        <div className="containerb">
          <div className="search-input-wrapper">
            <input type="text" placeholder="Search ex. Bird, yellow, small" />
            <i className="bi bi-search"></i>
          </div>

          <div className="result">
            <h6 className="title">Result</h6>

            <div className="result-wrapper">
              <Link to={`/bio-details/${1}`} className="card">
                <img src={img} alt="" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Biosearch;
