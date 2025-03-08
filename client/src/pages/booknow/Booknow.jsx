import "./booknow.scss";

import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import config from "../../BaseURL";
import editimg from "../../assets/edit (1).png";
import validImage from "../../assets/credible.png";

// import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Sidebarcontext, { SidebarContext } from "../../context/Sidebarcontext";

const Booknow = () => {
  const [slotMessage, setSlotMessage] = useState("");

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const datePickerRef = useRef(null);

  const { theme, updateBookedData, setUpdateBookedData } =
    useContext(SidebarContext);

  const { id } = useParams();
  const notifOpacity1 = useRef(null);
  const [getData, setGetData] = useState({});

  const [showConfirm, setConfirm] = useState(false);
  const [showMessage, setMessage] = useState(false);
  const [actData, setActData] = useState(false);
  const [userid, setuserID] = useState(0);
  //const [participant, setParticipant] = useState("");
  //const [dateBook, setDateBook] = useState("");
  const [participanEmpty, setParticipantEmpty] = useState("");
  const [dateBookErr, setDateBookErr] = useState("");
  const [totalPrice, setTotalPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showTermsCondation, setShowTermsCondation] = useState(false);

  const [isAgreed, setIsAgreed] = useState(false);
  const [showMessageAgree, setMessageAgree] = useState("");
  const [showAgreeNotif, setShowAgreeNotif] = useState(false);

  const [messageReachedMax, setMessageReachedMax] = useState("");

  const [showAvailableTime, setshowAvailableTime] = useState(false);
  // const [selectedTime, setSelectedTime] = useState("");
  const [selectedTime, setSelectedTime] = useState([]);

  const [bookedCount, setBookedCount] = useState([]);

  const [getTimeSlot, setGetTimeSlot] = useState([]);

  const [getNotAvailableDate, setGetAvailableDate] = useState([]);

  const [loaderTime, setLoaderTime] = useState(false);

  const [getNotLessthanQuantity, setgetNotLessthanQuantity] = useState([]);

  const [closeDate, setCloseDate] = useState([]);
  // const [maxReservation, setMaxReservation] = useState("");

  const [occupiedMsg, setOccupiedMsg] = useState("");
  const [occupiedModal, setOccupiedModal] = useState(false);

  const [showNote, setShowNote] = useState(false);

  const [redBorderPar, setredBorderPar] = useState(false);

  //  const [validIdFile, setValidIdFile] = useState(null);
  const { userInfo } = useContext(SidebarContext);

  //const [chosenImageCP, setChosenImageCP] = useState(null);
  // const [chosenImageURLCP, setChosenImageURLCP] = useState(null);

  // useEffect(() => {
  //   if (userInfo.valid_id_image === "") {
  //     setValidIdFile(true);
  //   }
  // }, [userInfo.valid_id_image]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setChosenImageCP(file);
      setChosenImageURLCP(URL.createObjectURL(file));
    }
  };
  const handleIconClick = () => {
    participant === "" ? setredBorderPar(true) : setIsCalendarOpen(true);
    setBookedCount([]);
    setSelectedTime([]);
  };

  //getNotAvailbleDate
  useEffect(() => {
    axios
      .get(`https://bulusanlakeexplorer.kesug.com/backend/getCLoseDdate.php`, {
        //.get(`${config.apiBaseUrl}/backend/getCLoseDdate.php`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log("DATE NOT AVAILABLE:", response.data.date);
        setCloseDate(response.data.date);
      })
      .catch((error) => {
        console.log(
          "Error_1:",
          error.response ? error.response.data : error.message
        );
      });
  }, []);

  const [dateBook, setDateBook] = useState(updateBookedData?.date || "");
  const [participant, setParticipant] = useState(
    updateBookedData?.participant || ""
  );

  useEffect(() => {
    if (updateBookedData) {
      setDateBook(updateBookedData.date || "");
    }
  }, [updateBookedData]);

  useEffect(() => {
    if (updateBookedData) {
      setParticipant(updateBookedData.participant || "");
    }
  }, [updateBookedData]);

  //handleUpdateBooking{
  const handleUpdateBooking = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const bookingData = {
      participant,
      dateBook: formatDate(dateBook),
      totalPrice,
      actId: actData.act_id,
      userId: userid,
      booked_id: updateBookedData.booked_id,
      act_name: actData.name,
      booked_date: updateBookedData.date,
      updated_date: dateBook,

      content_: `New slot for ${actData.name} is available on ${formatDate(
        updateBookedData.date
      )}.`,
      title_: `Reservation Slot for ${actData.name}`,
    };

    try {
      const response = await axios.post(
        `${config.apiBaseUrl}backend/updateBooking.php`,
        bookingData,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        notifOpacity1.current.style.opacity = 1;
        notifOpacity1.current.style.display = "block";
        setConfirm(false);
        setSubmitting(false);
        setDateBook("");
        setParticipant("");
        setUpdateBookedData({
          user_id: "",
          act_id: "",
          booked_id: "",
          booked_date: "",
        });

        // Now, send the email after booking update success
        try {
          const response_mail = await axios.post(
            `${config.apiBaseUrl}backend/sendMails.php`,
            bookingData,
            {
              withCredentials: true,
            }
          );
          if (response_mail.data.success) {
            console.log("Emails sent successfully.");
            console.log("EMAILS :", response_mail.data.emails);
          } else {
            console.error(
              "Failed to send emails: ",
              response_mail.data.message
            );
          }

          console.log(response_mail);
        } catch (error) {
          console.error("Error during sending email: ", error);
        }
      } else {
        setSubmitting(false);
        console.error("Booking update failed: ", response.data.message);
      }
    } catch (error) {
      setSubmitting(false);
      console.error("Error during booking update: ", error);
    }
  };

  //handleCheckboxChange
  const handleCheckboxChange = (event) => {
    setIsAgreed(event.target.checked);

    setTimeout(() => {
      setShowTermsCondation(false);
    }, 1200);
  };

  const modalConfirm = async (e) => {
    e.preventDefault();

    const datedata = new FormData();
    datedata.append("date", dateBook);
    datedata.append("maxReserve", actData.maxreservation);
    datedata.append("participant", participant);

    try {
      const res = await axios.post(
        `https://bulusanlakeexplorer.kesug.com/backend/postCheckAvailableDate.php`,

        //`${config.apiBaseUrl}backend/postCheckAvailableDate.php`,
        datedata,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        console.log(res.data.message);
        setMessageReachedMax(res.data.message);
        return;
      }

      const currentDate = new Date().toISOString().split("T")[0];
      const tenDaysFromNow = new Date();
      tenDaysFromNow.setDate(tenDaysFromNow.getDate() + 10);
      const tenDaysFromNowFormatted = tenDaysFromNow
        .toISOString()
        .split("T")[0];

      let valid = true;

      if (!participant) {
        setParticipantEmpty("Number of participants is required");
        valid = false;
      }
      if (!dateBook) {
        setDateBookErr("Date is required");
        valid = false;
        return;
      } else if (dateBook === currentDate) {
        setDateBookErr(
          "You cannot book this date because it's the current date"
        );
        valid = false;
        return;
      } else if (dateBook > tenDaysFromNowFormatted) {
        setDateBookErr("You cannot book more than 10 days in advance");
        valid = false;
        return;
      } else if (dateBook < currentDate) {
        setDateBookErr("You cannot book a date before today");
        valid = false;
        return;
      }

      if (!isAgreed) {
        setMessageAgree("You have to agree to the terms and conditions");
        setShowAgreeNotif(true);

        setTimeout(() => {
          setShowAgreeNotif(false);
        }, 1500);
        return;
      }

      if (valid) {
        setDateBookErr("");
        setParticipantEmpty("");

        let calculatedTotalPrice;

        if (actData.name === "Balsa") {
          const basePrice = actData.price; // Base price for 8 participants
          const priceMultiplier = Math.ceil(participant / 8); // Number of groups

          // Calculate total discounted price for each group
          const discountedPricePerGroup =
            basePrice * (1 - actData.discount / 100); // Discount per group
          calculatedTotalPrice = discountedPricePerGroup * priceMultiplier;
        } else if (actData.name === "Boating") {
          const basePrice = actData.price; // Base price for 6 participants
          const priceMultiplier = Math.ceil(participant / 6); // Number of groups

          // Calculate total discounted price for each group
          const discountedPricePerGroup =
            basePrice * (1 - actData.discount / 100); // Discount per group
          calculatedTotalPrice = discountedPricePerGroup * priceMultiplier;
        } else {
          // General price calculation for other activities
          calculatedTotalPrice =
            participant * actData.price * (1 - actData.discount / 100);
        }

        setTotalPrice(calculatedTotalPrice);
        setConfirm(true);
      }
    } catch (error) {
      console.log("Error : ", error);
      setDateBookErr(
        "An error occurred while checking the availability of the date."
      );
    }
  };

  //closeMessage
  const toggleCloseMessage = (e) => {
    e.preventDefault();
    notifOpacity1.current.style.opacity = 0;
    notifOpacity1.current.style.display = "none";
  };

  //get current activity details
  useEffect(() => {
    axios
      .get(`${config.apiBaseUrl}backend/Actdetails.php?id=${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setActData(response.data.actid);

        setuserID(response.data.userid);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was a problem in fetching data", error);
        setLoading(false);
      });
  }, [id]);

  //format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const dateBook = new Date(dateString);
    return dateBook.toLocaleDateString(undefined, options);
  };

  const reservation_fee_decimal = actData.reservation_fee / 100;
  const Resfee = Math.round(totalPrice * reservation_fee_decimal);

  // const ResfeePayment = Math.round(totalPrice * reservation_fee_decimal) * 100;

  const ResfeePayment =
    actData.name === "Kayak" && participant >= 1 && participant <= 5
      ? 10000
      : Math.round(totalPrice * reservation_fee_decimal) * 100;

  const ResfeePaymentServer =
    actData.name === "Kayak" && participant >= 1 && participant <= 5
      ? 100
      : Math.round(totalPrice * reservation_fee_decimal);

  //handleSubmitBooking
  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append("participant", participant);
    formData.append("dateBook", formatDate(dateBook));
    formData.append("timeBooked", JSON.stringify(selectedTime));
    formData.append("totalPrice", totalPrice);
    formData.append("actId", actData.act_id);
    formData.append("userId", userid);
    formData.append("participantCount", JSON.stringify(bookedCount));
    formData.append("resfee", ResfeePaymentServer);
    formData.append("name", actData.name);

    // Email fields
    formData.append("title", `Reservation for ${actData.name}`);
    formData.append(
      "content",
      `
         <div style="font-family: Arial, sans-serif;">
           Thank you for reserving ${
             actData.name
           } with us! Below are the details of your booking: <br/><br/>
           
           <strong>Activity Name:</strong> ${actData.name} <br/>
           <strong>Date:</strong> ${formatDate(dateBook)} <br/>
           <strong>Time:</strong> ${JSON.stringify(selectedTime)}  <br/>
           <strong>Number of Participants:</strong> ${participant}<br/>
           <strong>Price:</strong> ₱${Math.round(totalPrice)}<br/>
           <strong>Reservation Fee Paid:</strong> ₱${Math.round(
             ResfeePaymentServer
           )}<br/>
           <strong>Balance to Pay:</strong> ₱${Math.round(
             totalPrice - ResfeePaymentServer
           )}<br/><br/>
           
           Please ensure to settle the remaining balance upon arrival. We look forward to hosting you and making your experience unforgettable! <br/><br/>
       
           Go to your reservation and click "View Details." Take a screenshot of your reservation details as this will serve as your proof when you arrive at Bulusan Lake.  
         </div>
       `
    );

    formData.append("email", userInfo.email);

    console.log("FormData being sent:", Object.fromEntries(formData.entries()));

    try {
      const response = await axios.post(
        `${config.apiBaseUrl}backend/postBooking.php`,
        formData,
        { withCredentials: true }
      );

      if (response.data.success) {
        setConfirm(false);
        setSubmitting(false);
        setDateBook("");
        setParticipant("");
        setSelectedTime([]);
        handleCheckAvailableDates();
        // Send email after booking
        try {
          const emailResponse = await axios.post(
            `${config.apiBaseUrl}backend/sendMail_Reserved.php`,
            formData,
            { withCredentials: true }
          );
          console.log("Email response:", emailResponse.data.message);
        } catch (emailError) {
          console.error("Error sending email:", emailError);
        }
      } else {
        console.error("Booking failed:", response.data.message);
        setSubmitting(false);
      }
    } catch (error) {
      console.error("Error during booking:", error);
      setSubmitting(false);
    }
  };

  //handleGet
  const handleGetTerms = async () => {
    try {
      const response = await axios.get(
        //`${config.apiBaseUrl}backend/ADMIN_PHP/getTermsCondations.php`,
        `https://bulusanlakeexplorer.kesug.com/backend/ADMIN_PHP/getTermsCondations.php`,

        {
          withCredentials: true,
        }
      );
      setGetData(response.data.termsData[0] || {});
    } catch (error) {
      console.error("Error_2: ", error);
    }
  };

  useEffect(() => {
    handleGetTerms();
  }, []);

  // useEffect(() => {
  //   if (actData.name === "Balsa") {
  //     setParticipant(1);
  //   }
  // }, [actData]);

  // Function to generate available time slots
  const generateTimeSlots = (start, end, interval) => {
    const times = [];
    let currentTime = new Date(start);

    while (currentTime <= end) {
      let hours = currentTime.getHours();
      let minutes = currentTime.getMinutes();
      let period = hours >= 12 ? "PM" : "AM";

      // Convert hours from 24-hour to 12-hour format
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 should be 12

      // Add leading zero to minutes if needed
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

      // Add time slot to array
      times.push(`${hours}:${formattedMinutes} ${period}`);

      // Move the time forward by the interval (duration in minutes)
      currentTime.setMinutes(currentTime.getMinutes() + interval);
    }

    return times;
  };

  // Set the start and end time
  const startTime = new Date();
  startTime.setHours(7, 30, 0);

  const endTime = new Date();
  endTime.setHours(17, 0, 0);

  // Convert actData.duration to an integer and set a default value if necessary
  const durationInMinutes = parseInt(actData.duration, 10); // Default to 35 if NaN

  // Use actData.duration to dynamically set the interval
  const timeSlots = generateTimeSlots(startTime, endTime, durationInMinutes);

  ///////////////////////////////////////////
  const formatDateToLocal = (date) => {
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2); // Month is 0-based, so add 1
    const day = `0${date.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
  };

  const handleCheckAvailableTime = () => {
    const formattedDate = dateBook ? formatDateToLocal(dateBook) : "";

    const data = new FormData();
    data.append("quantity", actData.quantity);
    data.append("act_id", actData.act_id);
    data.append("booked_date", formattedDate);

    console.log("formattedDatet", formattedDate);

    axios
      .post(
        `https://bulusanlakeexplorer.kesug.com/backend/getAvailabletime.php`,
        data,
        {
          //.post(`${config.apiBaseUrl}/backend/getAvailabletime.php`, data, {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log("Response from server:", response.data);
        if (response.data.success) {
          console.log(
            "Not Available times found______________:",
            response.data.data
          );
          console.log("Available times d2__________:", response.data.data2);
          setGetTimeSlot(response.data.data);
          setgetNotLessthanQuantity(response.data.data2);
        } else {
          console.log("Message from server___:", response.data.message);
          console.log("Message from server___2:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error occurred during the request:", error);
      });
  };

  // Effect to handle time slots refresh when dateBook changes
  useEffect(() => {
    if (dateBook) {
      setDateBookErr("");
      setMessageReachedMax("");
      setshowAvailableTime(true);
      setLoaderTime(true);

      // Fetch available time slots for the new dateBook
      setGetTimeSlot([]);
      handleCheckAvailableTime();
    }
  }, [dateBook]);

  //ge notAvailable date
  const handleCheckAvailableDates = () => {
    const formData = new FormData();
    formData.append("maxReservation", actData.maxreservation);
    formData.append("act_id", actData.act_id);
    formData.append("name", actData.name);

    formData.append("qty", actData.quantity);

    axios
      .post(
        `https://bulusanlakeexplorer.kesug.com/backend/getNotAvailableDate.php`,
        formData,
        {
          //.post(`${config.apiBaseUrl}/backend/getNotAvailableDate.php`, formData, {
          withCredentials: true,
        }
      )
      .then((response) => {
        // console.log("Response from server:", response);

        if (response.data.success) {
          console.log(
            "Available dates found:___YYYYYYYYYY",
            response.data.data
          );
          setGetAvailableDate(response.data.data);
        } else {
          console.log("Message from server:", response.data.message);
          console.log("Available dates found:___h", response.data);
        }
      })
      .catch((error) => {
        console.error("Error_3: ", error);
      });
  };

  // console.log(getNotAvailableDate);
  useEffect(() => {
    handleCheckAvailableDates();
  }, [actData]);

  const isDateAvailable = (date) => {
    // Normalize the date to local midnight to avoid timezone issues
    const formattedDate = new Date(date.setHours(0, 0, 0, 0))
      .toISOString()
      .split("T")[0]; // Example: "2024-10-18"

    // Check if the date is in the closeDate or getNotAvailableDate arrays
    return (
      !closeDate.includes(formattedDate) &&
      !getNotAvailableDate.includes(formattedDate)
    );
  };

  ////////////////////////////////

  // const handleTimeSlotClick = (time) => {
  //   const currentIndex = timeSlots.indexOf(time);
  //   let remainingParticipants = participant;
  //   let newSelectedTimes = [];
  //   let newBookedCounts = [];

  //   // Check if the clicked time is valid
  //   if (currentIndex === -1) return;

  //   // Loop through time slots to fulfill the participant count
  //   for (
  //     let i = currentIndex;
  //     remainingParticipants > 0 && i < timeSlots.length;
  //     i++
  //   ) {
  //     const nextTimeSlot = timeSlots[i];

  //     // Skip if the time slot is already filled or unavailable
  //     if (getTimeSlot.includes(nextTimeSlot)) continue;

  //     // Check if the time slot is not already selected
  //     if (!selectedTime.includes(nextTimeSlot)) {
  //       // Check if this time slot has a partial need (from the state: getNotLessthanQuantity)
  //       const timeData = getNotLessthanQuantity.find(
  //         (item) => item.time === nextTimeSlot
  //       );
  //       const neededValue = timeData ? timeData.needed : actData.quantity; // Default to full quantity if not found

  //       // Fill this slot with either the remaining participants or the full slot quantity
  //       const participantsToBook = Math.min(neededValue, remainingParticipants);
  //       newSelectedTimes.push(nextTimeSlot);
  //       newBookedCounts.push(participantsToBook);

  //       // Subtract booked participants from the remaining count
  //       remainingParticipants -= participantsToBook;
  //     }
  //   }

  //   // Update the selected time and booked count states
  //   setSelectedTime((prevTimes) => [...prevTimes, ...newSelectedTimes]);
  //   setBookedCount((prevCounts) => [...prevCounts, ...newBookedCounts]);

  //   // Close the available time slots
  //   setshowAvailableTime(false);
  // };

  const handleTimeSlotClick = (time) => {
    const currentIndex = timeSlots.indexOf(time);
    let remainingParticipants = participant;
    let newSelectedTimes = [];
    let newBookedCounts = [];

    // Check if the clicked time is valid
    if (currentIndex === -1) return;

    // Adjust remainingParticipants if actData.name is "Balsa"
    if (actData.name === "Balsa") {
      if (participant <= 8) {
        remainingParticipants = 1;
      } else if (participant > 8 && participant <= 16) {
        remainingParticipants = 2;
      } else if (participant > 16 && participant <= 24) {
        remainingParticipants = 3;
      } else {
        // Continue increasing by 1 for every range of 8 participants
        remainingParticipants = Math.ceil(participant / 8);
      }
    } else if (actData.name === "Boating") {
      if (participant <= 6) {
        remainingParticipants = 1;
      } else if (participant > 6 && participant <= 12) {
        remainingParticipants = 2;
      } else if (participant > 12 && participant <= 18) {
        remainingParticipants = 3;
      } else {
        // Continue increasing by 1 for every range of 8 participants
        remainingParticipants = Math.ceil(participant / 6);
      }
    }

    // Loop through time slots to fulfill the participant count
    for (
      let i = currentIndex;
      remainingParticipants > 0 && i < timeSlots.length;
      i++
    ) {
      const nextTimeSlot = timeSlots[i];

      // Skip if the time slot is already filled or unavailable
      if (getTimeSlot.includes(nextTimeSlot)) continue;

      // Check if the time slot is not already selected
      if (!selectedTime.includes(nextTimeSlot)) {
        // Check if this time slot has a partial need (from the state: getNotLessthanQuantity)
        const timeData = getNotLessthanQuantity.find(
          (item) => item.time === nextTimeSlot
        );
        const neededValue = timeData ? timeData.needed : actData.quantity; // Default to full quantity if not found

        // Only fill this slot if participants are still remaining
        if (remainingParticipants > 0) {
          const participantsToBook = Math.min(
            neededValue,
            remainingParticipants
          );

          // Update the new selected times and booked counts
          newSelectedTimes.push(nextTimeSlot);
          newBookedCounts.push(participantsToBook);

          // Subtract booked participants from the remaining count
          remainingParticipants -= participantsToBook;
        }
      }
    }

    // Check if there are remaining participants and no available time slots
    if (remainingParticipants > 0) {
      setOccupiedModal(true);
      setOccupiedMsg("Number of participant is more than available slot");
    }

    // Update the selected time and booked count states
    setSelectedTime((prevTimes) => [...prevTimes, ...newSelectedTimes]);
    setBookedCount((prevCounts) => [...prevCounts, ...newBookedCounts]);

    // Close the available time slots
    setshowAvailableTime(false);
  };

  useEffect(() => {
    if (occupiedModal) {
      setSelectedTime([]);
    }
  }, [occupiedModal]);

  const closeModalOccupied = () => {
    setDateBook("");
    setParticipant("");
    setSelectedTime([]);
    setOccupiedModal(false);
  };
  // Define the handleChange function
  const handleChangeDate = (date) => {
    setDateBook(date);
    setSelectedTime([]);
    setGetTimeSlot([]);
    setgetNotLessthanQuantity([]);
  };

  //payment
  // const totalPriceInCents = totalPrice * 100;
  // // If you need to calculate 20% of the total price
  // const twentyPercent = totalPriceInCents * 0.2;
  // const Resfee = totalPrice * 0.2;

  const handlePayment = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("description", `${actData.name} reservation fee payment`);
      formData.append("remarks", "Remarks");
      formData.append("amount", ResfeePayment);
      console.log("amount fee from payment : ", ResfeePayment);
      const response = await axios.post(
        `${config.apiBaseUrl}backend/payment.php`,
        formData,
        { withCredentials: true }
      );

      if (response.data.checkout_url) {
        // Redirect to PayMongo for payment
        window.location.href = response.data.checkout_url;
      } else {
        console.log("Error: Unable to fetch the checkout URL.");
        console.log("Err :", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //handleBothActions
  const handleBothActions = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Trigger payment process
    await handlePayment(e);
    // Trigger booking process
    await handleSubmitBooking(e);
  };

  return (
    <>
      <div className={`booknow ${theme}`}>
        {loading ? (
          <span className="loader"></span>
        ) : actData ? (
          <>
            <div className="left-book">
              <img
                src={`${config.apiBaseUrl}backend/ADMIN_PHP/uploads/${actData.image}`}
                alt=""
              />
            </div>

            <div className="right-book">
              {updateBookedData.user_id != "" && (
                <div className="top">
                  <img src={editimg} alt="" />
                  <h6>Update your reservation</h6>
                </div>
              )}

              <div className="info">
                <h6>{actData.name}</h6>
                <span>
                  <i className="bi bi-tag" style={{ marginRight: "5px" }}></i>
                  Price per ride - <p> ₱{actData.price}</p>
                </span>

                <span>
                  <i className="bi bi-alarm" style={{ marginRight: "5px" }}></i>
                  Ride Duration - <p>{actData.duration} minutes</p>{" "}
                </span>
                {actData.discount > 0 && (
                  <span>
                    <i
                      className="bi bi-bookmark-dash"
                      style={{ marginRight: "5px" }}
                    ></i>
                    Discount -<p>{actData.discount}% per ride</p>
                  </span>
                )}
              </div>

              <div className="form">
                <span style={{ color: "red" }}>
                  {participanEmpty && participanEmpty}
                </span>
                <div
                  style={{
                    borderRadius: "25px",
                    height: "50px",
                    padding: "10px",
                    border: redBorderPar ? "solid 2px red" : "",
                  }}
                  className="partic-wrapper"
                >
                  {/* <input
                    type="number"
                    placeholder="Number of participants"
                    value={participant}
                    min="1" // This sets the minimum value to 0
                    max="50"
                    onChange={(e) => {
                      const value = e.target.value;

                      // Ensure value is not less than 0
                      if (value >= 0) {
                        setParticipant(value);
                        if (value) {
                          setParticipantEmpty("");
                          setMessageReachedMax("");
                          setSelectedTime([]);
                          setDateBook("");
                        }
                      }
                    }}
                  /> */}
                  {slotMessage && (
                    <div className="slot-message">{slotMessage}</div>
                  )}

                  <input
                    type="number"
                    placeholder="Number of participants"
                    value={participant}
                    min="1"
                    max={actData.maxreservation}
                    onChange={(e) => {
                      const value = e.target.value;
                      setredBorderPar(false);
                      // Allow clearing the input
                      if (value === "") {
                        setParticipant("");
                        setParticipantEmpty("");
                        setMessageReachedMax("");
                        setSelectedTime([]);
                        setDateBook("");
                        setBookedCount([]);

                        return;
                      }

                      // Convert value to integer and ensure it is within the allowed range
                      const parsedValue = parseInt(value, 10);

                      if (
                        parsedValue >= 1 &&
                        parsedValue <= actData.maxreservation
                      ) {
                        setParticipant(parsedValue);
                        setParticipantEmpty("");
                        setMessageReachedMax(""); // Clear the message when input changes
                        setSelectedTime([]);
                        setDateBook("");
                      } else if (parsedValue > actData.maxreservation) {
                        setMessageReachedMax(
                          `Only ${actData.maxreservation} slots are available.`
                        );
                      }
                    }}
                  />

                  <i className="bi bi-people"></i>
                </div>
                <span style={{ color: "red" }}>
                  {dateBookErr && dateBookErr}
                </span>

                <span style={{ color: "red" }}>
                  {messageReachedMax && messageReachedMax}
                </span>
                <div
                  style={{
                    borderRadius: "25px",
                    height: "50px",
                    padding: "10px",
                  }}
                  className="partic-wrapper"
                >
                  <div className="date-input">
                    <DatePicker
                      ref={datePickerRef}
                      selected={dateBook}
                      onChange={handleChangeDate}
                      onFocus={() => {
                        handleCheckAvailableDates();
                      }}
                      filterDate={isDateAvailable}
                      minDate={
                        new Date(new Date().setDate(new Date().getDate() + 1))
                      }
                      maxDate={
                        new Date(new Date().setDate(new Date().getDate() + 7))
                      }
                      placeholderText="Select a date"
                      open={isCalendarOpen}
                      onClickOutside={() => setIsCalendarOpen(false)}
                      readOnly
                      calendarContainer={(props) => (
                        <div
                          style={{
                            backgroundColor: "#fff",
                            fontFamily: "Arial, sans-serif",
                            border: "1px solid lightgray",
                            borderRadius: "8px",
                            padding: "10px",
                          }}
                          {...props}
                        />
                      )}
                    />
                  </div>

                  <i
                    className="bi bi-calendar-day"
                    onClick={handleIconClick}
                  ></i>
                </div>

                {/* {validIdFile && (
                  <div className="valid_id">
                    {chosenImageURLCP ? (
                      <label className="choosenImage" htmlFor="file">
                        <img src={chosenImageURLCP} alt="" />
                      </label>
                    ) : (
                      <label htmlFor="file">
                        <i className="bi bi-folder-plus"></i>
                        <span> ADD VALID ID</span>{" "}
                      </label>
                    )}
                    <div className="validId">
                      <select
                        id="validID"
                        name="validID"
                        className="select"
                        style={{ backgroundColor: "transparent" }}
                      >
                        <option value="">Accepted Valid ID</option>
                        <option value="passport">Passport</option>
                        <option value="driver_license">Driver's License</option>
                        <option value="national_id">National ID</option>
                        <option value="social_security">
                          Social Security Card
                        </option>
                        <option value="voter_id">Voter's ID</option>
                        <option value="health_card">
                          Health Insurance Card
                        </option>
                        <option value="student_id">Student ID</option>

                        <option value="senior_citizen_card">
                          Senior Citizen Card
                        </option>
                        <option value="professional_license">
                          Professional License
                        </option>
                        <option value="military_id">Military ID</option>
                      </select>
                    </div>
                    <input
                      type="file"
                      id="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />{" "}
                  </div>
                )} */}

                {selectedTime.length > 0 && (
                  <div className="selectedTime">
                    <span>Selected Time</span>
                    <div className="seltime">
                      {selectedTime.map((time, index) => (
                        <div className="c" key={index}>
                          {time} - {bookedCount[index]} slot
                          {bookedCount[index] > 1 ? "s" : ""}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  className="btn-res"
                  onClick={modalConfirm}
                  style={{
                    backgroundColor:
                      dateBook === "" || participant === ""
                        ? "#5A6C57"
                        : "green",
                    cursor:
                      dateBook === "" || participant === ""
                        ? "not-allowed"
                        : "pointer",
                  }}
                  disabled={dateBook === "" || participant === ""}
                >
                  Reserve
                </button>

                <div className="readme-wrapper">
                  <div className="readme">
                    <p>You need to read and agree to our</p>{" "}
                    <span
                      onClick={() => setShowTermsCondation(!showTermsCondation)}
                    >
                      Terms and Conditions
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p>Check your internet connection</p>
        )}
      </div>

      {showConfirm && (
        <>
          <div className="overlay-confirm"></div>
          <form className="confirm-booking">
            <div className="top">
              <span>Confirm your reservation</span>
            </div>

            <div className="booked-info">
              <span>{actData.name}</span>
              <span>
                <i className="bi bi-people" style={{ marginRight: "5px" }}></i>{" "}
                Participant - {participant}
              </span>
              <span>
                <i
                  className="bi bi-calendar-month"
                  style={{ marginRight: "7px" }}
                ></i>
                Date - {formatDate(dateBook)}
              </span>

              {selectedTime.length > 0 && (
                <div className="selectedTime">
                  <span>
                    <i
                      className="bi bi-alarm"
                      style={{ marginRight: "5px" }}
                    ></i>{" "}
                    Selected time{" "}
                  </span>
                  <div className="seltime">
                    {selectedTime.map((time, index) => (
                      <div className="c" key={index}>
                        {time} - {bookedCount[index]} slot
                        {bookedCount[index] > 1 ? "s" : ""}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <span>
                <i className="bi bi-tag" style={{ marginRight: "5px" }}></i>
                Price - ₱{actData.price}
              </span>

              <div className="bot-desc">
                <p>discounted price</p>
              </div>
              <span>
                Total price - ₱
                {new Intl.NumberFormat("en-US", {
                  style: "decimal",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(Math.round(totalPrice))}
                .00
              </span>

              <span>Reservation Fee - ₱{ResfeePaymentServer.toFixed(2)}</span>

              <input type="hidden" name="participant_o" value={participant} />
              <input type="hidden" name="date_o" value={formatDate(dateBook)} />
              <input type="hidden" name="time_o" value={selectedTime} />
              <input type="hidden" name="total_o" value={totalPrice} />
            </div>

            <div className="bot">
              <button
                className="confirm"
                // onClick={
                //   updateBookedData.act_id != ""
                //     ? handleUpdateBooking
                //     : handleSubmitBooking
                // }
                style={{
                  backgroundColor: "green",
                  color: "#fff",
                  width: "70%",
                }}
                onClick={handleBothActions}
              >
                {submitting
                  ? "Proceeding..."
                  : "Proceed to Reservation Fee Payment"}
              </button>
              <button className="cancel" onClick={() => setConfirm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </>
      )}

      {showTermsCondation && (
        <div className="terms-modal">
          <div className="top">
            <span>Terms and conditions</span>
            <i
              className="bi bi-x"
              onClick={() => setShowTermsCondation(false)}
            ></i>{" "}
          </div>

          <div className="intro">
            <p style={{ whiteSpace: "pre-wrap" }}>{getData.intro}</p>
          </div>

          <div className="defination">
            <span>Defination</span>
            <p style={{ whiteSpace: "pre-wrap" }}>{getData.defination}</p>
          </div>

          <div className="process">
            <span>Reservation Policy</span>
            <p style={{ whiteSpace: "pre-wrap" }}>
              {getData.reservationProcess}
            </p>
          </div>

          <div className="payment">
            <span>Payment</span>
            <p style={{ whiteSpace: "pre-wrap" }}>{getData.payment}</p>
          </div>

          <div className="cancellation">
            <span>Reservation Fee</span>
            <p style={{ whiteSpace: "pre-wrap" }}>{getData.cancellation}</p>
          </div>

          <div className="userResponsibilities">
            <span>User Responsibilities</span>
            <p style={{ whiteSpace: "pre-wrap" }}>
              {getData.userResponsibilities}
            </p>
          </div>

          <div className="agree">
            <input
              type="checkbox"
              id="agreeTerms"
              checked={isAgreed}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="agreeTerms">
              I agree to the Terms and Conditions
            </label>
          </div>
        </div>
      )}
      {showTermsCondation && <div className="terms-overlay"></div>}

      {showAgreeNotif && (
        <div className="agreeTerms-modal">
          <p>{showMessageAgree}</p>
        </div>
      )}

      {showAvailableTime && (
        <div className="availabletimee">
          <div className="top">
            <span>
              Available time slot for your chosen date{" "}
              <p>{dateBook ? formatDate(dateBook) : "Not selected"}</p>
            </span>
            <i
              className="bi bi-x close"
              onClick={() => setshowAvailableTime(false)}
            ></i>
          </div>

          <div className="note-wrappe">
            <span onClick={() => setShowNote(true)}>
              <i
                className="bi bi-info-circle"
                style={{ marginRight: "5px" }}
              ></i>
              Read me{" "}
              {/* <i className="bi bi-caret-down" style={{ marginLeft: "5px" }}></i> */}
            </span>

            {showNote && (
              <div className="contentt">
                <p className="phar" style={{ whiteSpace: "pre-wrap" }}>
                  {actData.note}
                </p>
                <div className="bot">
                  <span onClick={() => setShowNote(false)}>I understand</span>
                </div>
              </div>
            )}
          </div>
          <div className="content">
            {loading ? (
              <span className="loader">Loading...</span>
            ) : (
              <>
                {timeSlots
                  .filter((time) => !getTimeSlot.includes(time))
                  .map((time, index) => {
                    // Find the time object from the getNotLessthanQuantity state
                    const timeData = getNotLessthanQuantity.find(
                      (item) => item.time === time
                    );

                    // Default value for needed if no matching time found
                    const neededValue = timeData
                      ? timeData.needed
                      : actData.quantity; // Default to 3 if no data

                    return (
                      <div key={index} className="time-slot-wrapper">
                        {/* Display the needed value */}
                        <div className="time-needed">
                          <span id="slot">slot: {neededValue}</span>
                        </div>
                        {/* Time slot button */}
                        <div
                          className="time-slot"
                          onClick={() => handleTimeSlotClick(time)}
                          style={{ cursor: "pointer" }}
                        >
                          {time}
                        </div>
                      </div>
                    );
                  })}
                <input
                  type="hidden"
                  name="selectedTime"
                  value={JSON.stringify(selectedTime)}
                />
              </>
            )}
          </div>
        </div>
      )}

      {showAvailableTime && <div className="overlaytime"></div>}

      {occupiedModal && (
        <div className="remainingslotoccupied">
          <p>{occupiedMsg}</p>

          <div className="bot">
            <span onClick={closeModalOccupied}>Ok</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Booknow;
