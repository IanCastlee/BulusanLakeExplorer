import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import config from "../BaseURL";

export const SidebarContext = createContext();

const Sidebarcontext = ({ children }) => {
  const [userInfo, setUserInfo] = useState({});
  const [userid, setUserId] = useState(0);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

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
          console.error("Error: Missing user info or user id in response data");
        }
      })
      .catch((error) => {
        console.error("Error fetching user info:", error);
      });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // NOTIFICATION DATA
  const [notifData, setNotifData] = useState([]);
  const [clickedCards, setClickedCards] = useState([]);
  const [notifCount, setNotifCount] = useState(0);

  // Fetch notifications data
  useEffect(() => {
    axios
      .get(`${config.apiBaseUrl}backend/getCanceledBookingNotif.php`, {
        withCredentials: true,
      })
      .then((response) => {
        setNotifData(response.data);
      })
      .catch((error) => {
        console.log("Error on fetching notifications: ", error);
      });
  }, []);

  // Retrieve clicked card IDs from session storage when userid changes
  useEffect(() => {
    if (userid) {
      const savedClickedCards = sessionStorage.getItem(
        `clickedCards_${userid}`
      );
      setClickedCards(savedClickedCards ? JSON.parse(savedClickedCards) : []);
    }
  }, [userid]);

  // Clear clicked cards from session storage if notifData is empty
  useEffect(() => {
    if (notifData.length === 0) {
      sessionStorage.removeItem(`clickedCards_${userid}`);
      setClickedCards([]);
    }
  }, [notifData, userid]);

  const handleCardClick = (id) => {
    setClickedCards((prevClickedCards) => {
      const newClickedCards = prevClickedCards.includes(id)
        ? prevClickedCards
        : [...prevClickedCards, id];

      // Save the updated clicked cards to session storage, specific to the user
      sessionStorage.setItem(
        `clickedCards_${userid}`,
        JSON.stringify(newClickedCards)
      );

      // Update notification count
      setNotifCount(notifData.length - newClickedCards.length);

      return newClickedCards;
    });
  };

  // Update notifCount when notifData or clickedCards change
  useEffect(() => {
    setNotifCount(notifData.length - clickedCards.length);
  }, [notifData, clickedCards]);

  return (
    <SidebarContext.Provider
      value={{
        userInfo,
        userid,
        notifData,
        notifCount,
        setNotifCount,
        handleCardClick,
        clickedCards,
        fetchUserData,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export default Sidebarcontext;
