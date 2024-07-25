import "./signin.scss";
import axios from "axios";

import { useContext, useEffect, useState } from "react";
import config from "../../BaseURL";
import { SidebarContext } from "../../context/Sidebarcontext";

const Signin = ({ toggleSignIn, closeModal }) => {
  const { fetchUserData } = useContext(SidebarContext);

  const [loading, setloading] = useState(false);
  const [message, setMessage] = useState("");

  const [signinData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const handleSigninChange = (e) => {
    const { name, value } = e.target;

    setErrorMessages((prevErrs) => ({
      ...prevErrs,
      [name]: "",
    }));

    setSignInData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //for input validation
  const [errorMessage, setErrorMessages] = useState({
    email: "",
    password: "",
  });

  //reset the button label while updating input
  useEffect(() => {
    setMessage("Sign In");
  }, [signinData]);

  const handleSigninSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    setMessage("");

    //input validation
    const errors = {};
    Object.keys(signinData).forEach((key) => {
      if (signinData[key].trim() === "") {
        errors[key] = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        } is required`;
      }
    });

    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      setloading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${config.apiBaseUrl}backend/Signin.php`,
        // "/backend/Signin.php",

        {
          email: signinData.email,
          password: signinData.password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        if (response.data.isAdmin) {
          window.location.href = "/admin/";
        } else {
          // window.location.reload();
          fetchUserData();
          closeModal();
        }

        setMessage(response.data.message);
        setloading(false);
      } else {
        setMessage(response.data.message);
        setloading(false);
      }
    } catch (error) {
      console.error("There was an error!", error);
      setMessage("There was an error with the login.");
      setloading(false);
    }
  };

  return (
    <div className="signin-wrapper">
      <div className="top">
        <h6>Create your account</h6>|<span onClick={toggleSignIn}>Sign Up</span>
      </div>
      <form onSubmit={handleSigninSubmit}>
        <span className="err">{errorMessage.email}</span>
        <input
          type="text"
          name="email"
          value={signinData.email}
          onChange={handleSigninChange}
          placeholder="Email"
        />
        <span className="err">{errorMessage.password}</span>
        <input
          type="text"
          name="password"
          value={signinData.password}
          onChange={handleSigninChange}
          placeholder="Password"
        />
        <button type="submit" disabled={loading}>
          {loading ? <div className="loader"></div> : message || "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default Signin;
