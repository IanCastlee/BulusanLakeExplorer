import React, { useState } from "react";
import "./signup.scss";
import axios from "axios";
import Signin from "../signin/Signin";
import { useEffect } from "react";
import config from "../../BaseURL";

const Signup = ({ closeModal }) => {
  const [isloadingUp, setLoaderUp] = useState(false);
  const [messageUp, setMessageUp] = useState("");

  const [showSignIn, setSignIn] = useState(false);
  const [showSignUp, setSignUp] = useState(true);
  const toggleSignIn = () => {
    setSignIn(true);
    setSignUp(false);
  };
  const toggleSignUp = () => {
    setSignIn(false);
    setSignUp(true);
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

    setErrorMessages((prevErrors) => ({
      ...prevErrors,
      [name]: " ",
    }));

    setSignUpData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //reset  button label if theres have a changes in input
  useEffect(() => {
    setMessageUp("Sign Up");
  }, [signUpData]);

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

    if (signUpData.password !== signUpData.confirmPassword) {
      setMessageUp("Passwords and confirm password not matched!");
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
        setMessageUp("Registration successful!");
        setLoaderUp(false);
      } else {
        setMessageUp(response.data.message);
        setLoaderUp(false);
      }
    } catch (error) {
      setMessageUp("Invalid : " + response.message);
    }
  };

  return (
    <>
      <div className="signup">
        <div className="close-button">
          <i className="bi bi-x-lg" onClick={closeModal}></i>
        </div>

        {/* singup */}
        {showSignUp && (
          <Signin toggleSignIn={toggleSignIn} closeModal={closeModal} />
        )}

        {/* signin */}
        {showSignIn && (
          <div className="signup-wrapper">
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
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={signUpData.password}
                onChange={handleSignUpChange}
              />
              <span className="err">{errorMessages.confirmPassword}</span>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={signUpData.confirmPassword}
                onChange={handleSignUpChange}
              />
              <button type="submit" disabled={isloadingUp}>
                {isloadingUp ? (
                  <div className="loader"></div>
                ) : (
                  messageUp || "Sign Up"
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default Signup;
