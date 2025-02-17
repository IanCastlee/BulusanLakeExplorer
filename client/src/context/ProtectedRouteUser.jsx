import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../BaseURL";

export const ProtectedRouteUserContext = createContext();

const ProtectedRouteUser = ({ children }) => {
  const [userid, setUserId] = useState(0);
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user data
  const fetchUserData = () => {
    axios
      .get(`${config.apiBaseUrl}backend/userid.php`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.userInfo && response.data.userid) {
          setUserInfo(response.data.userInfo);
          setUserId(response.data.userid);
        } else {
          // console.error("Status: User not signed in");
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Error fetching user info:", error);
        navigate("/");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (userInfo.acc_type === "admin_111") {
        navigate("/admin/");
      }
    }
  }, [loading, userInfo, navigate]);

  // Show a loading spinner or nothing until the data is fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  return userInfo.acc_type !== "admin_111" ? (
    <ProtectedRouteUserContext.Provider
      value={{
        userInfo,
        userid,
      }}
    >
      {children}
    </ProtectedRouteUserContext.Provider>
  ) : null;
};

export default ProtectedRouteUser;
