import "./bioddetail.scss";
import img from "../../assets/bg.jpg";

const Biodetail = () => {
  return (
    <>
      <div className="bio-details">
        <div className="topb">
          <div className="leftb">
            <img src={img} alt="" />
          </div>

          <div className="rightb">
            <h6>Name</h6>
            <div className="d-wrapper">
              <span>Scientific name :</span>
              <p>Ototototay</p>
            </div>

            <div className="d-wrapper">
              <span>Type :</span>
              <p>Bird</p>
            </div>

            <div className="d-wrapper">
              <p>Indengered Species</p>
            </div>

            <div className="about">
              <span className="title">About</span>

              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Molestiae, cum delectus necessitatibus illo, nihil, magni
                provident quos nulla veritatis optio esse ab aliquam earum ex
                dicta voluptate consequuntur aperiam! Tempore consequatur
                obcaecati cum ex? Quam, vero. Enim quae magni ea perferendis,
                quidem nam culpa quisquam voluptate vitae! Culpa, voluptates
                maxime.
              </p>

              <button>More info...</button>
            </div>
          </div>
        </div>
        <div className="botb"></div>
      </div>
    </>
  );
};

export default Biodetail;
