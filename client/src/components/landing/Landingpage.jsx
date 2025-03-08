import "./Landing.scss";
import imglog from "../../assets/bldnxplrlogo.png";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export const Landingpage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      console.log("PRINT ME");
      navigate("/home/");
    }, 3000);
  }, []);
  return (
    <div className="landing">
      <div className="landing-conatainer">
        <img src={imglog} alt="" />
      </div>

      <div className="footer">
        <span>Developed by : Ian Castillo</span>
      </div>
    </div>
  );
};
