import "./otp.scss";
const [OTPdata, setOTPdata] = useState("");

const otp = () => {
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
      } else {
        setMessageOTPerr(response.data.message);
      }
    } catch (error) {
      console.log("Error : ", error);
    }
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
  return (
    <div className="otp-wrapper">
      <div className="title2">
        <span className="top">Verify your account</span>

        {messageOTP && <span className="messageOTP">{messageOTP}</span>}
        {messageOTPerr && (
          <span className="messageOTPerr">{messageOTPerr}</span>
        )}
        <span className="bot">
          Your OTP was sent to your emial : {data.email}
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
        Don't recieve the code?{" "}
        <strong onClick={handleReSubmit}>
          {resendOTPLoader ? "Sending request..." : "  send again"}
        </strong>
      </span>

      <span className="signin" onClick={handleShowSignin}>
        Sign In
      </span>
    </div>
  );
};

export default otp;
