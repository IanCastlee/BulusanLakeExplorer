import React, { useEffect, useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Index from "./pages/index/Index";
import Navbar from "./components/navbar/Navbar";
import Actinfo from "./pages/actinfo/Actinfo";
import Booknow from "./pages/booknow/Booknow";
import Feed from "./pages/feed/Feed";
import UserBooking from "./pages/USERCOMPONENtS/userbooking/UserBooking";
import Navbar2 from "./ADMIN/components/navbar/Navbar2";
import Dashboard from "./ADMIN/dashboard/Dashboard";
import Activeact from "./ADMIN/activities/Activeact";
import Notactiveact from "./ADMIN/activities/Notactiveact";
import User from "./ADMIN/user/User";
import Banned from "./ADMIN/user/Banned";
import Confirmedbooking from "./ADMIN/reservation/Confirmedbooking";
import Pendingbook from "./ADMIN/reservation/Pendingbook";
import Cancelled from "./ADMIN/reservation/Cancelled";
import Notif from "./pages/notif/Notif";
import Sidebarcontext from "./context/Sidebarcontext";
import { SidebarContext } from "./context/Sidebarcontext";
import Sidebar from "./components/sidebar/Sidebar";
import Biosearch from "./pages/biosearch/Biosearch";
import Biodetail from "./pages/biodeatails/Biodetail";
import Biodiversity from "./ADMIN/biodiversity/Biodiversity";
import ViewPostDetails from "./pages/feed/ViewPostDetails";
import Chat from "./pages/chat/Chat";
import Chat_a from "./ADMIN/chat/Chat_a";
const App = () => {
  return (
    <Router>
      <Sidebarcontext>
        <AppContent />
      </Sidebarcontext>
    </Router>
  );
};

const Admin = () => {
  return (
    <>
      <Navbar2 />
      <Routes>
        <Route path="/admin/" element={<Dashboard />} />
        <Route path="/admin/activity/" element={<Activeact />} />
        <Route path="/admin/not-active-act/" element={<Notactiveact />} />

        <Route path="/admin/active-user/" element={<User />} />
        <Route path="/admin/not-active-user/" element={<Banned />} />

        <Route path="/admin/booking/" element={<Confirmedbooking />} />
        <Route path="/admin/pending/" element={<Pendingbook />} />
        <Route path="/admin/canceled/" element={<Cancelled />} />

        <Route path="/admin/biodiversity/" element={<Biodiversity />} />
        <Route path="/admin/chat/" element={<Chat_a />} />
      </Routes>
    </>
  );
};

const AppContent = () => {
  const location = useLocation();

  // Function to check if the current path is within the admin section
  const isAdminRoute = location.pathname.startsWith("/admin");
  const [showSidebar, setSidebar] = useState(false);
  const [notifCount, setNotifCount] = useState(null);

  const toggleSidebar = () => {
    setSidebar(!showSidebar);
  };

  // Check if the current path is the Index page ("/")
  const shouldHideLogo = location.pathname === "/";
  const shouldHideIcons = location.pathname === "/mybooking/";
  const hideNav = location.pathname === "/chat/";

  return isAdminRoute ? (
    <Admin />
  ) : (
    <div className="app-container">
      {!hideNav && (
        <Navbar
          hide={shouldHideLogo}
          hideIcons={shouldHideIcons}
          showSidebar={toggleSidebar}
        />
      )}
      <Routes>
        <Route
          path="/"
          element={
            <Index
              showSidebar2={showSidebar}
              setSidebar={toggleSidebar}
              notifCount={notifCount}
            />
          }
        />
        <Route element={<Sidebar notifCount={notifCount} />} />
        <Route path="/act-info/:id" element={<Actinfo />} />
        <Route path="/booknow/:id" element={<Booknow />} />
        <Route path="/feed/" element={<Feed />} />
        <Route path="/view-post/:post_id" element={<ViewPostDetails />} />
        <Route
          path="/notification/"
          element={<Notif setNotifCount={setNotifCount} />}
        />
        <Route path="/bio-search/" element={<Biosearch />} />
        <Route path="/chat/" element={<Chat />} />
        <Route path="/bio-details/:id" element={<Biodetail />} />
        {/* USERCOMPONENTS */}
        <Route path="/mybooking/:id" element={<UserBooking />} />
      </Routes>
    </div>
  );
};

export default App;
