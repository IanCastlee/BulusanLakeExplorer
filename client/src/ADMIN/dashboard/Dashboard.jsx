import { useEffect, useState } from "react";
import "./dashboard.scss";
import Sideba from "../components/sidebar/Sideba";
import bg from "../../assets/bg.jpg";
import user from "../../assets/group (5).png";
import pending from "../../assets/wallet.png";
import approved from "../../assets/file.png";
import act from "../../assets/kayak.png";
import config from "../../BaseURL";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [arrivedBooked, setArrivedBooked] = useState([]);
  const [announcement, setAnnouncement] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(""); // Start with no selected activity
  const [activityNames, setActivityNames] = useState([]); // Store unique activity names

  const [showDataGrid, setShowDataGrid] = useState(false);

  const [counts, setCounts] = useState({
    users: 0,
    activities: 0,
    posts: 0,
    approved: 0,
  });

  const [years, setYears] = useState([]); // State for years
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year

  useEffect(() => {
    // Fetch counts
    axios
      .get(`${config.apiBaseUrl}backend/ADMIN_PHP/count.php`)
      .then((response) => {
        setCounts(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the counts!", error);
      });
  }, []);

  useEffect(() => {
    // Fetch announcements
    axios
      .get(`${config.apiBaseUrl}backend/ADMIN_PHP/getActiveAnnouncement.php`, {
        withCredentials: true,
      })
      .then((response) => {
        setAnnouncement(response.data);
      })
      .catch((error) => {
        console.log("Error fetching announcements:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch arrived bookings
    axios
      .get(`${config.apiBaseUrl}backend/ADMIN_PHP/getArrivedBook.php`)
      .then((response) => {
        const bookings = response.data;
        setArrivedBooked(bookings);
        console.log("Arrived Bookings:", bookings);

        // Extract unique activity names
        const uniqueActivityNames = [
          ...new Set(bookings.map((booking) => booking.name)),
        ];
        setActivityNames(uniqueActivityNames);

        // Extract unique years
        const uniqueYears = [
          ...new Set(
            bookings.map((booking) =>
              new Date(booking.booked_date).getFullYear()
            )
          ),
        ];
        setYears(uniqueYears);

        // Set default selected activity
        if (uniqueActivityNames.length > 0 && !selectedActivity) {
          setSelectedActivity(uniqueActivityNames[0]); // Set the first activity as default
        }

        // Process data for the selected activity and year
        const monthlyData = calculateMonthlyParticipants(
          bookings,
          selectedActivity || uniqueActivityNames[0], // Use default if not yet selected
          selectedYear
        );
        setChartData(monthlyData);
      })
      .catch((error) => {
        console.log("Error fetching arrived bookings:", error);
      });
  }, [selectedActivity, selectedYear]); // Re-fetch data when the selected activity or year changes

  // Helper function to group bookings by month and calculate total participants
  const calculateMonthlyParticipants = (bookings, activity, year) => {
    const monthOrder = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthMap = {};
    monthOrder.forEach((month) => {
      monthMap[month] = 0;
    });

    bookings
      .filter((booking) => {
        const date = new Date(booking.booked_date);
        return (
          booking.name === activity && date.getFullYear() === parseInt(year, 10) // Filter by selected year
        );
      })
      .forEach((booking) => {
        const date = new Date(booking.booked_date);
        const monthIndex = date.getMonth();
        const monthName = monthOrder[monthIndex];

        if (monthMap[monthName] !== undefined) {
          monthMap[monthName] += parseInt(booking.no_participant, 10);
        }
      });

    return monthOrder.map((month) => ({
      name: month,
      participants: monthMap[month],
    }));
  };

  return (
    <div className="dashboard">
      <Sideba />

      <div className="dash-content">
        <div className="wrapper">
          <img src={bg} alt="Background" />

          <div className="overlay">
            <div className="left">
              <div className="top">
                <div className="top-wrapper">
                  <Link
                    to="/admin/booking/"
                    className="card"
                    style={{ backgroundColor: "#93FFD8" }}
                  >
                    <div className="top">
                      <img src={pending} alt="Pending" />
                      <span>Reserved</span>
                    </div>
                    <div className="bott">
                      <h6>{counts.approved}</h6>
                    </div>
                  </Link>

                  <Link
                    to="/admin/pendingposts/"
                    className="card"
                    style={{ backgroundColor: "#93FFD8" }}
                  >
                    <div className="top">
                      <img src={approved} alt="Approved" />
                      <span>Pending Post</span>
                    </div>
                    <div className="bott">
                      <h6>{counts.posts}</h6>
                    </div>
                  </Link>

                  <Link
                    to={`/admin/active-user/${0}`}
                    className="card"
                    style={{ backgroundColor: "#93FFD8" }}
                  >
                    <div className="top">
                      <img src={user} alt="Users" />
                      <span>Users</span>
                    </div>
                    <div className="bott">
                      <h6>{counts.users}</h6>
                    </div>
                  </Link>
                  <Link
                    to="/admin/activity"
                    className="card"
                    style={{ backgroundColor: "#93FFD8" }}
                  >
                    <div className="top">
                      <img src={act} alt="Activities" />
                      <span>Activities</span>
                    </div>
                    <div className="bott">
                      <h6>{counts.activities}</h6>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="bot">
                <div className="content">
                  <div className="topp">
                    <span style={{ fontWeight: "bold" }}>
                      Active Announcement
                    </span>
                    <Link to="/admin/announcement/">
                      <i className="bi bi-info-circle-fill"></i>
                    </Link>
                  </div>
                  {announcement.length > 0 ? (
                    announcement.map((a) => (
                      <div className="div" key={a.announcement_id}>
                        <span className="title">{a.ttl}</span>
                        <p>{a.announcement}</p>
                      </div>
                    ))
                  ) : (
                    <p>No Announcement</p>
                  )}
                </div>
              </div>

              <button
                className="showData"
                onClick={() => setShowDataGrid(true)}
              >
                <i
                  className="bi bi-bar-chart-line-fill"
                  style={{ color: "#fff" }}
                ></i>{" "}
                Show Data
              </button>
            </div>

            <div
              className={`right-overlay ${showDataGrid ? "show" : ""}`}
              onClick={() => setShowDataGrid(false)}
            ></div>
            <div className={`right ${showDataGrid ? "show" : ""}`}>
              <div className="content">
                <h6>Participants per Month ({selectedActivity})</h6>

                {/* Dropdown to select an activity dynamically */}
                <select
                  value={selectedActivity}
                  onChange={(e) => setSelectedActivity(e.target.value)}
                  className="activity-dropdown"
                >
                  {activityNames.map((activity, index) => (
                    <option key={index} value={activity}>
                      {activity}
                    </option>
                  ))}
                </select>

                {/* Dropdown to select a year dynamically */}
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="year-dropdown"
                >
                  {years.map((year, index) => (
                    <option key={index} value={year}>
                      {year}
                    </option>
                  ))}
                </select>

                <ResponsiveContainer width="100%" height="90%">
                  <LineChart data={chartData}>
                    <CartesianGrid stroke="#A9C52F" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "green", fontSize: "10px" }}
                    />
                    <YAxis
                      tick={{ fill: "#000", fontSize: "12px" }}
                      allowDecimals={false}
                      label={{
                        value: "Participants",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="participants"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
