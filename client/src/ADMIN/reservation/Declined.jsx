// import "./declined.scss";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Sideba from "../components/sidebar/Sideba";
// import config from "../../BaseURL";

// import pp from "../../assets/user (8).png";

// const Declined = () => {
//   const [canceled, setCanceled] = useState([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [searchTerm, setSearchTerm] = useState("");

//   const [showModalView, setShowModalView] = useState(false);
//   const [showModalViewImage, setShowModalViewImage] = useState(false);
//   const [modalViewImage, setModalViewImage] = useState("");
//   const [selectedRowData, setSelectedRowData] = useState({
//     fullname: "",
//     address: "",
//     name: "",
//     booked_date: "",
//     no_participant: "",
//     price: "",
//     total_price: "",
//     reason: "",
//     profilePic: "",
//   });

//   const selected_row_data = (
//     fullname,
//     address,
//     name,
//     booked_date,
//     no_participant,
//     price,
//     total_price,
//     reason,
//     profilePic
//   ) => {
//     setSelectedRowData({
//       fullname: fullname,
//       address: address,
//       name: name,
//       booked_date: booked_date,
//       no_participant: no_participant,
//       price: price,
//       total_price: total_price,
//       reason: reason,
//       profilePic: profilePic,
//     });

//     setShowModalView(true);
//   };

//   useEffect(() => {
//     axios
//       .get(`${config.apiBaseUrl}backend/ADMIN_PHP/getDeclinedBook.php`)
//       .then((response) => {
//         setCanceled(response.data);
//         console.log(response.data);
//       })
//       .catch((error) => {
//         console.log("Error on fetching  : ", error);
//       });
//   }, []);

//   const handleChangePage = (newPage) => {
//     setPage(newPage);
//   };

//   const handleRowsPerPageChange = (event) => {
//     setRowsPerPage(Number(event.target.value));
//     setPage(0);
//   };

//   //search
//   const handleSearchChange = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   const filteredCanceledData = canceled.filter(
//     (cbook) =>
//       String(cbook.fullname).toLowerCase().includes(searchTerm.toLowerCase()) ||
//       String(cbook.address).toLowerCase().includes(searchTerm.toLowerCase()) ||
//       String(cbook.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
//       String(cbook.booked_date)
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase()) ||
//       String(cbook.no_participant)
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase()) ||
//       String(cbook.price).toLowerCase().includes(searchTerm.toLowerCase()) ||
//       String(cbook.reason).toLowerCase().includes(searchTerm.toLowerCase()) ||
//       String(cbook.profilePic)
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase()) ||
//       String(cbook.total_price).toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const totalPages = Math.ceil(canceled.length / rowsPerPage);

//   //format date
//   const formatDate = (dateString) => {
//     const options = { year: "numeric", month: "long", day: "numeric" };
//     const dateBook = new Date(dateString);
//     return dateBook.toLocaleDateString(undefined, options);
//   };
//   return (
//     <>
//       <div className="cancelled">
//         <Sideba />
//         <div className="user-content">
//           <div className="top">
//             <div className="left">
//               <h6>Declined Reservation</h6>
//             </div>

//             <div className="right2">
//               <div className="search">
//                 <input
//                   type="text"
//                   placeholder="Search"
//                   value={searchTerm}
//                   onChange={handleSearchChange}
//                 />{" "}
//                 <i className="bi bi-search"></i>
//               </div>
//             </div>
//           </div>
//           <div className="active">
//             {canceled.length > 0 ? (
//               <table>
//                 <thead>
//                   <tr>
//                     <th>No</th>
//                     <th>Fullname</th>
//                     <th>Activity</th>
//                     <th>Date Booked</th>
//                     <th>Participant</th>
//                     <th>Totol Price</th>
//                     <th>Reason</th>
//                     <th>Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredCanceledData
//                     .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                     .map((data) => (
//                       <tr key={data.booked_id}>
//                         <td>{data.booked_id}</td>
//                         <td>{data.fullname}</td>
//                         <td>{data.name}</td>
//                         <td>{formatDate(data.booked_date)}</td>
//                         <td>{data.no_participant}</td>
//                         <td>{data.total_price}</td>
//                         <td>{data.reason}</td>
//                         <td
//                           style={{
//                             display: "flex",
//                             gap: "10px",
//                             width: "fitContent",
//                             justifyContent: "center",
//                           }}
//                         >
//                           <span
//                             style={{
//                               fontSize: "12px",
//                               backgroundColor: "#fff",
//                               color: "#000",
//                               width: "70px",
//                               borderRadius: "3px",
//                               padding: "3px",
//                               border: "1px solid gray",
//                             }}
//                             className="confirm"
//                             onClick={() => handleConfirm(data.booked_id)}
//                           >
//                             Declined
//                           </span>

//                           <span
//                             style={{
//                               fontSize: "12px",
//                               backgroundColor: "green",
//                               color: "#fff",
//                               width: "70px",
//                               borderRadius: "3px",
//                               cursor: "pointer",
//                               padding: "3px",
//                             }}
//                             className="btn-cancel"
//                             // onClick={() => handleConfirm(data.booked_id)}
//                             onClick={() =>
//                               selected_row_data(
//                                 data.fullname,
//                                 data.address,
//                                 data.name,
//                                 data.booked_date,
//                                 data.no_participant,
//                                 data.price,
//                                 data.total_price,
//                                 data.reason,
//                                 data.profilePic
//                               )
//                             }
//                           >
//                             View
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                 </tbody>
//               </table>
//             ) : (
//               <tr>
//                 <td colSpan="5" style={{ textAlign: "center" }}>
//                   No data available
//                 </td>
//               </tr>
//             )}
//             {canceled.length > 0 ? (
//               <div className="pagination">
//                 <button
//                   onClick={() => handleChangePage(page - 1)}
//                   disabled={page === 0}
//                 >
//                   Previous
//                 </button>
//                 <span>
//                   Page {page + 1} of {totalPages}
//                 </span>
//                 <button
//                   onClick={() => handleChangePage(page + 1)}
//                   disabled={page >= totalPages - 1}
//                 >
//                   Next
//                 </button>
//                 <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
//                   <option value={10}>10</option>
//                   <option value={15}>15</option>
//                   <option value={25}>25</option>
//                   <option value={50}>50</option>
//                   <option value={100}>100</option>
//                 </select>
//               </div>
//             ) : (
//               ""
//             )}
//           </div>
//         </div>
//       </div>
//       {showModalView && (
//         <div className="view-alldata">
//           <div className="top">
//             <span>Declined Reservation</span>

//             <i
//               className="bi bi-x-square-fill"
//               onClick={() => setShowModalView(false)}
//             ></i>
//           </div>

//           <div className="content">
//             <div className="e">
//               <img
//                 src={
//                   selectedRowData.profilePic
//                     ? `${config.apiBaseUrl}backend/uploads/${selectedRowData.profilePic}`
//                     : pp
//                 }
//                 alt=""
//                 onClick={() => {
//                   setModalViewImage(selectedRowData.profilePic);
//                   setShowModalViewImage(true);
//                 }}
//               />
//             </div>

//             <div className="f">
//               <span>Booked By : {selectedRowData.fullname}</span>
//               <span>Address : {selectedRowData.address}</span>
//             </div>

//             <div className="s">
//               <span>Booked Date : {selectedRowData.booked_date}</span>
//               <span>
//                 Number of Participant : {selectedRowData.no_participant}
//               </span>
//               <span>Activity Price : {selectedRowData.price}</span>
//               <span>Total Price : {selectedRowData.total_price}</span>

//               <span style={{ marginTop: "10px" }}>
//                 Reason for Declining : {selectedRowData.reason}
//               </span>
//             </div>
//           </div>
//         </div>
//       )}
//       {showModalView && (
//         <div
//           onClick={() => {
//             setShowModalViewImage(false);
//           }}
//           className="view-alldata-overlay"
//         ></div>
//       )}{" "}
//       {showModalViewImage && (
//         <div className="view-image">
//           <img
//             src={
//               modalViewImage
//                 ? `${config.apiBaseUrl}backend/uploads/${modalViewImage}`
//                 : pp
//             }
//             alt=""
//           />{" "}
//         </div>
//       )}{" "}
//     </>
//   );
// };

// export default Declined;
