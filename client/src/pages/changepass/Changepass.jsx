import axios from "axios";
import { useEffect, useState } from "react";
import config from "../../BaseURL";

const Changepass = ({ toggleSI, openCP, usedEmail, usedPassword }) => {
  console.log("useSignin CP : ", usedEmail);
  console.log("usePassword CP : ", usedPassword);

  const [loading, setloading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageErr, setMessageErr] = useState("");
  const [errors, setErrors] = useState({});

  const [OTPdata, setOTPdata] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [showCP, setShowCP] = useState(true);
  const [messageOTP, setMessageOTP] = useState("");
  const [messageOTPerr, setMessageOTPerr] = useState("");
  const [resendOTPLoader, setResendOTPLoader] = useState(false);

  const [showSignInButton, setShowSignInButton] = useState(false);
  const [invalidPasswordMessage, setInvalidPasswordMessage] = useState("");

  const [emailNotExist, setEmailNotExist] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  //handleShowSignin
  const handleShowSignin = () => {
    toggleSI();
  };

  useEffect(() => {
    if (openCP == 1) {
      handlesetShowOtp();
    }
  }, [openCP]);

  const handlesetShowOtp = () => {
    setShowOtp(true);
    setShowCP(false);
  };

  const handlesetShowCP = () => {
    setShowOtp(false);
    setShowCP(true);
  };

  const [data, setData] = useState({
    email: "",
    password: "",
    cpassword: "",
  });

  //handleChange
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessage("");
    setMessageErr("");
    setEmailNotExist("");
    setInvalidPasswordMessage("");
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  //handleSubmit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (data.email.trim() === "") newErrors.email = "Email is required";
    if (data.password.trim() === "")
      newErrors.password = "Password is required";
    if (data.cpassword.trim() === "")
      newErrors.cpassword = "Confirm Password is required";
    if (data.password !== data.cpassword)
      newErrors.cpassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const passwordCriteria = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/;

    if (!passwordCriteria.test(data.password)) {
      setInvalidPasswordMessage(
        "Password must be at least 8 characters long and include a capital letter and a number."
      );
      setLoaderUp(false);

      return;
    }

    setloading(true);
    const formdata = new FormData();
    formdata.append("email", data.email);
    formdata.append("password", data.password);

    axios
      .post(`${config.apiBaseUrl}backend/changePassword.php`, formdata, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.success) {
          setMessage(response.data.message);
          setMessageErr(response.data.messageErr);
          setloading(false);
          handlesetShowOtp();
        } else {
          setloading(false);
          setEmailNotExist(response.data.messageErr);
        }
      })
      .catch((error) => {
        console.log(error);
        setloading(false);
      });
  };

  //handleSubmit
  const handleReSubmit = (e) => {
    e.preventDefault();

    setResendOTPLoader(true);

    // Validation
    const newErrors = {};
    if (data.email.trim() === "") newErrors.email = "Email is required";
    if (data.password.trim() === "")
      newErrors.password = "Password is required";
    if (data.cpassword.trim() === "")
      newErrors.cpassword = "Confirm Password is required";
    if (data.password !== data.cpassword)
      newErrors.cpassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setloading(true);
    const formdata = new FormData();
    formdata.append("email", data.email);
    formdata.append("password", data.password);

    axios
      .post(`${config.apiBaseUrl}backend/changePassword.php`, formdata, {
        withCredentials: true,
      })
      .then((response) => {
        setMessage(response.data.message);
        setMessageErr(response.data.messageErr);
        setloading(false);
        handlesetShowOtp();
        setResendOTPLoader(false);
        setMessageOTP("OTP succesfully sent to your mail");
      })
      .catch((error) => {
        console.log(error);
        setloading(false);
        setResendOTPLoader(false);
      });
  };

  //handleReSubmitSignIn
  const handleReSubmitSignIn = (e) => {
    e.preventDefault();

    setResendOTPLoader(true);

    setloading(true);
    const formdata = new FormData();
    formdata.append("email", usedEmail);
    formdata.append("password", usedPassword);

    axios
      .post(`${config.apiBaseUrl}backend/changePassword.php`, formdata, {
        withCredentials: true,
      })
      .then((response) => {
        setMessage(response.data.message);
        setMessageErr(response.data.messageErr);
        setloading(false);
        handlesetShowOtp();
        setResendOTPLoader(false);
        setMessageOTP("OTP succesfully sent to your mail");
      })
      .catch((error) => {
        console.log(error);
        setloading(false);
        setResendOTPLoader(false);
      });
  };

  //handleSubmitOTP
  const handleSubmitOTP = async (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("otp", OTPdata);

    try {
      const response = await axios.post(
        `${config.apiBaseUrl}backend/verify.php`,
        formdata,
        { withCredentials: true }
      );

      if (response.data.success) {
        setMessageOTP(response.data.message);
        setShowSignInButton(true);
        !openCP;
      } else {
        setMessageOTPerr(response.data.message);
        setShowSignInButton(false);
      }
    } catch (error) {
      setShowSignInButton(false);
      console.log("Error : ", error);
    }
  };

  // Toggle showPassword state when checkbox is checked
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  console.log("UsedEMail", usedEmail);

  return (
    <>
      {showCP && (
        <div className="cp-wrapper">
          <div className="top">
            <h6>Change password</h6>
          </div>
          <form onSubmit={handleSubmit}>
            <span className="err">{errors.email}</span>
            {emailNotExist && <span className="err">P{emailNotExist}</span>}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={data.email}
              onChange={handleChange}
            />
            <span className="err">{errors.password}</span>
            {invalidPasswordMessage && (
              <span className="err">{invalidPasswordMessage}</span>
            )}
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="New password"
              value={data.password}
              onChange={handleChange}
            />
            <span className="err">{errors.cpassword}</span>
            <input
              type={showPassword ? "text" : "password"}
              name="cpassword"
              placeholder="Confirm password"
              value={data.cpassword}
              onChange={handleChange}
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
              {loading ? <span className="loader"></span> : "Change password"}
            </button>
            {message && <p className="messsage">{message}</p>}
            {messageErr && <p className="messsageErr">{messageErr}</p>}
          </form>
        </div>
      )}

      {showOtp && (
        <div className="otp-wrapper">
          <div className="title2">
            <span className="top">Verify your account</span>

            {messageOTP && <span className="messageOTP">{messageOTP}</span>}
            {messageOTPerr && (
              <span className="messageOTPerr">{messageOTPerr}</span>
            )}

            {showSignInButton && (
              <span
                style={{
                  cursor: "pointer",
                  backgroundColor: "blue",
                  color: "#fff",
                  fontSize: "12px",
                  border: "none",
                  borderRadius: "3px",
                  padding: "8px 8px",
                }}
                className="signin"
                onClick={handleShowSignin}
              >
                Sign In
              </span>
            )}

            <span className="bot">
              Your OTP was sent to your emial :{" "}
              {openCP == 1 ? usedEmail : data.email}
            </span>
          </div>
          <input
            required
            type="text"
            autoComplete="one-time-code"
            inputMode="numeric"
            maxLength="4"
            pattern="\d{4}"
            onChange={(e) => {
              setOTPdata(e.target.value);
              setMessageOTPerr("");
              setMessageOTP("");
            }}
            value={OTPdata}
          ></input>

          <button className="btn-submitotp" onClick={handleSubmitOTP}>
            Submit
          </button>
          <span>
            Don't get the code?{" "}
            <strong
              onClick={openCP == 1 ? handleReSubmitSignIn : handleReSubmit}
            >
              {resendOTPLoader ? "Sending request..." : "  send again"}
            </strong>
          </span>
        </div>
      )}
    </>
  );
};

export default Changepass;
