import React, { useContext, useRef, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";

// Import your components and pages
import Index from "./pages/index/Index";
import Navbar from "./components/navbar/Navbar";
import Actinfo from "./pages/actinfo/Actinfo";
import Booknow from "./pages/booknow/Booknow";
import Feed from "./pages/feed/Feed";
import Navbar2 from "./ADMIN/components/navbar/Navbar2";
import Dashboard from "./ADMIN/dashboard/Dashboard";
import Activeact from "./ADMIN/activities/Activeact";
import Notactiveact from "./ADMIN/activities/Notactiveact";
import User from "./ADMIN/user/User";
import Banned from "./ADMIN/user/Banned";
import Confirmedbooking from "./ADMIN/reservation/Confirmedbooking";
// import Pendingbook from "./ADMIN/reservation/Pendingbook";
// import Cancelled from "./ADMIN/reservation/Cancelled";
import Notif from "./pages/notif/Notif";
import Sidebarcontext from "./context/Sidebarcontext";
import Sidebar from "./components/sidebar/Sidebar";
import Biosearch from "./pages/biosearch/Biosearch";
import Biodetail from "./pages/biodeatails/Biodetail";
import ViewPostDetails from "./pages/feed/ViewPostDetails";
import Chat from "./pages/chat/Chat";
import Chat_a from "./ADMIN/chat/Chat_a";
import Announcementa from "./ADMIN/announcement/Announcementa";
import Userprofile from "./pages/USERCOMPONENtS/userProfile/Userprofile";
import { CommentCountProvider } from "./context/CommentCountProvider ";
import { SidebarContext } from "./context/Sidebarcontext";
import ProtectedRouteAdmin from "./context/ProtectedRouteAdmin";
import ProtectedRouteUser from "./context/ProtectedRouteUser";
import TermsAndCon from "./ADMIN/termsandcondation/TermsAndCon";
import Mybooking from "./pages/USERCOMPONENtS/userbooking/Mybooking";
import Arrived from "./ADMIN/reservation/Arrived";
import Report from "./ADMIN/reports/Report";
import Bio from "./ADMIN/biodiversity/Bio";
import Chatbot_ from "./ADMIN/chat/Chatbot_";
import OpenImage from "./pages/USERCOMPONENtS/userProfile/OpenImage";
import Post from "./ADMIN/post/Post";
import Reviews from "./ADMIN/reviews/Reviews";
import Pendingpost from "./ADMIN/post/Pendingpost";
// import Declined from "./ADMIN/reservation/Declined";
import Payment from "./pages/booknow/Payment";
import Fees from "./pages/fees/Fees";
import Fees_a from "./ADMIN/fees/Fees_a";
import NotArrived from "./ADMIN/reservation/NotArrived";
import Search from "./pages/search/Search";
// import RateMe from "./pages/rating/RateMe";
// import axios from "axios";
// import config from "./BaseURL";

const Admin = () => {
  const location = useLocation();
  const navbarClass = location.pathname === "/admin/" ? "homeNavbar" : "";

  return (
    <>
      <Navbar2 className={navbarClass} />
      <ProtectedRouteAdmin>
        <Routes>
          <Route path="/admin/" element={<Dashboard />} />
          <Route path="/admin/activity/" element={<Activeact />} />
          <Route path="/admin/not-active-act/" element={<Notactiveact />} />
          <Route path="/admin/active-user/:id" element={<User />} />
          <Route path="/admin/not-active-user/" element={<Banned />} />
          <Route path="/admin/booking/" element={<Confirmedbooking />} />
          {/* <Route path="/admin/pending/" element={<Pendingbook />} /> */}
          <Route path="/admin/arrived/" element={<Arrived />} />
          <Route path="/admin/notarrived/" element={<NotArrived />} />
          {/* <Route path="/admin/canceled/" element={<Cancelled />} /> */}
          <Route path="/admin/chat/" element={<Chat_a />} />
          <Route path="/admin/announcement/" element={<Announcementa />} />
          <Route path="/admin/terms-condations/" element={<TermsAndCon />} />
          <Route path="/admin/reports/" element={<Report />} />
          <Route path="/admin/bio/" element={<Bio />} />
          <Route path="/admin/chatbot/" element={<Chatbot_ />} />
          <Route path="/admin/posts/:id/:reported_id" element={<Post />} />
          <Route path="/admin/reviews/" element={<Reviews />} />
          <Route path="/admin/pendingposts/" element={<Pendingpost />} />
          <Route path="/admin/fees/" element={<Fees_a />} />
        </Routes>
      </ProtectedRouteAdmin>
    </>
  );
};

// Move ProtectedRoute outside AppContent
const ProtectedRoute = ({ children }) => {
  const { userid } = useContext(SidebarContext);

  if (userid === 0) {
    return <Navigate to="/" />;
  }
  return children;
};

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const [showSidebar, setSidebar] = useState(false);
  const [notifCount, setNotifCount] = useState(null);

  const toggleSidebar = () => {
    setSidebar(!showSidebar);
  };

  const shouldHideLogo = location.pathname === "/";
  const shouldHideIcons = location.pathname === "/mybooking/";
  const hideNav = location.pathname === "/message/";
  const hideNavbio = location.pathname === "/bio-search/";
  const hideNavbiodetails = /^\/bio-details\/[^/]+$/.test(location.pathname);
  const hideNavuserProfile = /^\/user-profile\/[^/]+$/.test(location.pathname);
  const navbarClass = location.pathname === "/" ? "homeNavbar" : "";

  const appRef = useRef(null);

  const handleFullscreen = () => {
    const width = window.innerWidth;
    const userAgent = navigator.userAgent.toLowerCase();

    if (width <= 789) {
      if (/android|iphone|ipad|ipod/.test(userAgent)) {
        // If device is mobile
        if (appRef.current && appRef.current.requestFullscreen) {
          appRef.current.requestFullscreen().catch((err) => {
            console.error("Fullscreen error:", err);
          });
        } else if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch((err) => {
            console.error("Fullscreen error:", err);
          });
        }
      } else {
        console.log(
          "Fullscreen request ignored. Screen width is less than 789px but not a mobile device."
        );
      }
    } else {
      console.log(
        "Fullscreen request ignored. Screen width is greater than 789px."
      );
    }
  };

  return isAdminRoute ? (
    <Admin />
  ) : (
    <div className="app-container" ref={appRef}>
      {!hideNav && !hideNavbio && !hideNavbiodetails && !hideNavuserProfile && (
        <Navbar
          hide={shouldHideLogo}
          hideIcons={shouldHideIcons}
          showSidebar={toggleSidebar}
          className={navbarClass}
          handleFullscreen={handleFullscreen}
        />
      )}

      <ProtectedRouteUser>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
          >
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <Index
                    showSidebar2={showSidebar}
                    setSidebar={toggleSidebar}
                    notifCount={notifCount}
                    handleFullscreen={handleFullscreen}
                  />
                }
              />
              <Route element={<Sidebar notifCount={notifCount} />} />
              <Route path="/act-info/:id" element={<Actinfo />} />
              <Route
                path="/booknow/:id"
                element={
                  <ProtectedRoute>
                    <Booknow />
                  </ProtectedRoute>
                }
              />
              <Route path="/feed/" element={<Feed />} />
              <Route path="/view-post/:post_id" element={<ViewPostDetails />} />
              <Route
                path="/notification/"
                element={<Notif setNotifCount={setNotifCount} />}
              />
              <Route path="/bio-search/" element={<Biosearch />} />
              <Route path="/message/" element={<Chat />} />
              <Route path="/bio-details/:id" element={<Biodetail />} />
              <Route path="/mybooking/:id" element={<Mybooking />} />
              <Route path="/user-profile/:id" element={<Userprofile />} />
              <Route
                path="/user-viewpost/:img_id/:id"
                element={<OpenImage />}
              />

              <Route path="/payment/" element={<Payment />} />
              <Route path="/fees/" element={<Fees />} />
              <Route path="/search/" element={<Search />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </ProtectedRouteUser>
    </div>
  );
};

const App = () => {
  return (
    <>
      <Router>
        <CommentCountProvider>
          <Sidebarcontext>
            <AppContent />
          </Sidebarcontext>
        </CommentCountProvider>
      </Router>
    </>
  );
};

export default App;
