import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import config from "../BaseURL";

export const SidebarContext = createContext();

const Sidebarcontext = ({ children }) => {
  const [userInfo, setUserInfo] = useState({});
  const [userid, setUserId] = useState(0);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const [data2, setData2] = useState([]);

  const [unclicked, setUncliked] = useState(null);

  // const [count, setCount] = useState(0);

  const [updateBookedData, setUpdateBookedData] = useState({
    user_id: "",
    act_id: "",
    booked_id: "",
    date: "",
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  //console.log("Count Reate name__ : ", count);
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
          console.error("Statud : User not signed in");
        }
      })
      .catch((error) => {
        console.error("Error fetching user info:", error);
      });
  };

  useEffect(() => {
    fetchUserData();
  }, [userid]);

  const getUnclickedNotif = () => {
    axios
      .get(
        //  `${config.apiBaseUrl}/backend/getUnclickedNotif.php?userId=${userid}`,
        `https://bulusanlakeexplorer.kesug.com/backend/getUnclickedNotif.php?userId=${userid}`,

        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log("Unclicked : ", response.data.count);
        setUncliked(response.data.count);
      })
      .catch((error) => {
        console.log("ERROR : ", error);
      });
  };
  useEffect(() => {
    getUnclickedNotif();
  }, [userid]);

  return (
    <SidebarContext.Provider
      value={{
        userInfo,
        userid,
        fetchUserData,
        theme,
        toggleTheme,
        setUpdateBookedData,
        updateBookedData,
        setData2,
        data2,
        unclicked,
        setUncliked,
        getUnclickedNotif,
        // setCount,
        // count,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export default Sidebarcontext;
