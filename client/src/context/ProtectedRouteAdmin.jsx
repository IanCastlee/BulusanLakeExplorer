import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../BaseURL";

export const ProtectedRouteAdminContext = createContext();

const ProtectedRouteAdmin = ({ children }) => {
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
          console.error("Status: User not signed in");
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
      if (userInfo.acc_type !== "admin_111") {
        navigate("/");
      }
    }
  }, [loading, userInfo, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ProtectedRouteAdminContext.Provider value={userid}>
      {children}
    </ProtectedRouteAdminContext.Provider>
  );
};

export default ProtectedRouteAdmin;
