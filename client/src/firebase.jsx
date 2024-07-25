// // src/firebase.js

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getMessaging, getToken, onMessage } from "firebase/messaging";

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBvks1LRAII2ji_O5UxBYWUN6YRzON9GXQ",
//   authDomain: "pushnotif-9156a.firebaseapp.com",
//   projectId: "pushnotif-9156a",
//   storageBucket: "pushnotif-9156a.appspot.com",
//   messagingSenderId: "72120721607",
//   appId: "1:72120721607:web:6598e001b0e510b0fedee2",
//   measurementId: "G-P1YVHXX3QF",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// // Initialize Firebase Cloud Messaging
// const messaging = getMessaging(app);

// // Function to request permission to receive notifications
// export const requestFirebaseNotificationPermission = async () => {
//   try {
//     const permission = await Notification.requestPermission();
//     if (permission === "granted") {
//       const token = await getToken(messaging, {
//         vapidKey:
//           "BOnpyV77KKOTYYJf7iO0ZvheuHcTBXQi6m5dzzMj5CuAGompzMYvVpswqgeya3irYgoFmv9hNgRhpXpbLx5J7RE",
//       });
//       console.log("FCM Token:", token);
//       return token;
//     } else {
//       console.error("Notification permission denied");
//     }
//   } catch (error) {
//     console.error("Error getting FCM token:", error);
//   }
// };

// // Listener for receiving messages when the app is in the foreground
// onMessage(messaging, (payload) => {
//   console.log("Message received. ", payload);
//   // Customize notification here
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: "/firebase-logo.png",
//   };

//   if (Notification.permission === "granted") {
//     new Notification(notificationTitle, notificationOptions);
//   }
// });

// export { messaging };
// export default app;
