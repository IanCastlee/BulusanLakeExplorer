import React, { useState } from "react";
import "./signup.scss";
import axios from "axios";
import Signin from "../signin/Signin";
import config from "../../BaseURL";

const Signup = ({ closeModal }) => {
  const [isloadingUp, setLoaderUp] = useState(false);
  const [messageUp, setMessageUp] = useState("");
  const [messageErr, setMessageErr] = useState("");

  const [openCP, setOpenCP] = useState(0);
  const [invalidPasswordMessage, setInvalidPasswordMessage] = useState("");

  const [showSignIn, setSignIn] = useState(false);
  const [showSignUp, setSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const toggleSignIn = () => {
    setSignIn(true);
    setSignUp(false);
  };

  const toggleSignUpShowCP = () => {
    setSignIn(false);
    setSignUp(true);
    setOpenCP(1);
  };

  const toggleSignUp = () => {
    setSignIn(false);
    setSignUp(true);
  };

  const toggleHideSigin = () => {
    setSignIn(false);
  };

  // signup
  const [signUpData, setSignUpData] = useState({
    username: "",
    fullname: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  //validate input field
  const [errorMessages, setErrorMessages] = useState({
    username: "",
    fullname: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;

    setMessageErr("");
    setMessageUp("");
    setInvalidPasswordMessage("");
    setErrorMessages((prevErrors) => ({
      ...prevErrors,
      [name]: " ",
    }));

    setSignUpData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setLoaderUp(true);
    setMessageUp("");

    //validate input field
    const errors = {};
    Object.keys(signUpData).forEach((key) => {
      if (signUpData[key].trim() === "") {
        errors[key] = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        } is required`;
      }
    });

    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      setLoaderUp(false);
      return;
    }

    // Gmail validation
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(signUpData.email)) {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        email: "Please enter a valid Gmail address.",
      }));
      setLoaderUp(false);
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      setMessageUp("Passwords and confirm password not matched!");
      setLoaderUp(false);
      return;
    }

    const passwordCriteria = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/;

    if (!passwordCriteria.test(signUpData.password)) {
      setInvalidPasswordMessage(
        "Password must be at least 8 characters long and include a capital letter and a number."
      );
      setLoaderUp(false);

      return;
    }

    try {
      const response = await axios.post(
        `${config.apiBaseUrl}backend/Signup.php`,
        // "/backend/Signup.php",

        {
          username: signUpData.username,
          fullname: signUpData.fullname,
          address: signUpData.address,
          email: signUpData.email,
          password: signUpData.password,
        }
      );

      if (response.data.success) {
        setMessageUp(response.data.message);
        setLoaderUp(false);
        setMessageErr(response.data.messageErr);
        toggleSignUpShowCP();
        // setUsedEmail(response.data.email);
      } else {
        setMessageErr(response.data.messageErr);
        setLoaderUp(false);
      }
    } catch (error) {
      setMessageUp("Invalid : " + response.message);
    }
  };

  // Toggle showPassword state when checkbox is checked
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  return (
    <>
      <div className="signup">
        <div className="close-button">
          <i className="bi bi-x-lg" onClick={closeModal}></i>
        </div>

        {/* singup */}
        {showSignUp && (
          <Signin
            toggleSignIn={toggleSignIn}
            toggleHideSigin={toggleHideSigin}
            closeModal={closeModal}
            toggleSignUp={toggleSignUp}
            openCP={openCP}
            usedEmail={signUpData.email}
            usedPassword={signUpData.password}
          />
        )}

        {/* signin */}
        {showSignIn && (
          <div className="signup-wrapper">
            <span className="loader"></span>

            <div className="top">
              <h6>Log your account</h6>|
              <span onClick={toggleSignUp}>Sign In</span>
            </div>
            <form onSubmit={handleSignUpSubmit}>
              <span className="err">{errorMessages.username}</span>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={signUpData.username}
                onChange={handleSignUpChange}
              />
              <span className="err">{errorMessages.fullname}</span>
              <input
                type="text"
                name="fullname"
                placeholder="Fullname"
                value={signUpData.fullname}
                onChange={handleSignUpChange}
              />
              <span className="err">{errorMessages.address}</span>
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={signUpData.address}
                onChange={handleSignUpChange}
              />
              <span className="err">{errorMessages.email}</span>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={signUpData.email}
                onChange={handleSignUpChange}
              />
              <span className="err">{errorMessages.password}</span>
              {invalidPasswordMessage && (
                <span className="err">{invalidPasswordMessage}</span>
              )}
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={signUpData.password}
                onChange={handleSignUpChange}
              />
              <span className="err">{errorMessages.confirmPassword}</span>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm password"
                value={signUpData.confirmPassword}
                onChange={handleSignUpChange}
              />
              <div className="showpass">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={togglePasswordVisibility}
                />
                <span onClick={togglePasswordVisibility}>Show password</span>
              </div>
              <button type="submit" disabled={isloadingUp}>
                {isloadingUp ? <span className="loader"></span> : "Sign Up"}
              </button>

              {messageUp && (
                <p style={{ color: "red" }} className="message">
                  {messageUp}
                </p>
              )}
              {messageErr && (
                <p style={{ color: "red" }} className="messageErr">
                  {messageErr}
                </p>
              )}
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default Signup;
