import "./signin.scss";
import axios from "axios";

import { useContext, useEffect, useState } from "react";
import config from "../../BaseURL";
import { SidebarContext } from "../../context/Sidebarcontext";
import Changepass from "../changepass/Changepass";

const Signin = ({
  toggleSignIn,
  toggleSignUp,
  toggleHideSigin,
  closeModal,
  openCP,
  usedEmail,
  usedPassword,
}) => {
  const { fetchUserData } = useContext(SidebarContext);
  const [showChangepass, setShowChangepass] = useState(false);

  const [notVerifyMsg, setNotVerifyMsg] = useState("");

  const [loading, setloading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageErr, setMessageErr] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [signinData, setSignInData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (openCP == 1) {
      toggleChangeP();
    }
  }, [openCP]);

  const toggleChangeP = () => {
    setShowChangepass(true);
    toggleHideSigin();
  };

  const toggleSI = () => {
    setShowChangepass(false);
  };

  const handleSigninChange = (e) => {
    const { name, value } = e.target;

    setErrorMessages((prevErrs) => ({
      ...prevErrs,
      [name]: "",
    }));

    setNotVerifyMsg("");
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

  const handleSigninSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    setMessage("");

    // Input validation
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
      setMessage("Sign In");

      return;
    }

    try {
      const response = await axios.post(
        `${config.apiBaseUrl}backend/Signin.php`,
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
          fetchUserData();
          closeModal();
          closeModal();
        }
        closeModal();
        setShowChangepass(false);
        setMessageErr(response.data.messageErr);
        setMessage(response.data.message);
      } else {
        setMessageErr(response.data.messageErr);
        //setShowModalNotVer(true);
      }
    } catch (error) {
      console.error("There was an error!", error);
    } finally {
      setloading(false);
    }
  };

  // Toggle showPassword state when checkbox is checked
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  return (
    <>
      {showChangepass ? (
        <Changepass
          toggleSI={toggleSI}
          openCP={openCP}
          usedEmail={usedEmail}
          usedPassword={usedPassword}
        />
      ) : (
        <div className="signin-wrapper">
          <span className="errNotver">{notVerifyMsg}</span>

          {/* <span className="loader"></span> */}

          <div className="top">
            <h6>Create your account</h6>|
            <span onClick={toggleSignIn}>Sign Up</span>
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
              type={showPassword ? "text" : "password"}
              name="password"
              value={signinData.password}
              onChange={handleSigninChange}
              placeholder="Password"
            />

            <div className="showpass">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={togglePasswordVisibility}
              />
              <span onClick={togglePasswordVisibility}>Show password</span>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? <span className="loader"></span> : "Sign In"}
            </button>

            <span
              style={{ color: "blue", fontWeight: "500" }}
              className="dont_acc"
              onClick={toggleChangeP}
            >
              Forgot password?{" "}
            </span>

            {message && <p className="message">{message}</p>}
            {messageErr && <p className="messageErr">{messageErr}</p>}
          </form>
        </div>
      )}
    </>
  );
};

export default Signin;
