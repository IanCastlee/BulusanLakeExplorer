import { useState } from "react";
import "./dashboard.scss";
import Sideba from "../components/sidebar/Sideba";

const Dashboard = () => {
  const [closeSignin, setSignin] = useState(true);
  const [showAddAct, setAddAct] = useState(false);

  const closeSign = () => {
    setSignin(false);
  };
  return (
    <>
      <div className="dashboard">
        <Sideba />
        <div className="dash-content">
          <button onClick={() => setAddAct(!showAddAct)}>add</button>
        </div>
      </div>

      {/* {closeSignin && <Signin closeSign={closeSign} />} */}
    </>
  );
};

export default Dashboard;
