// import "./cancelled.scss";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Sideba from "../components/sidebar/Sideba";
// import config from "../../BaseURL";

// const Cancelled = () => {
//   const [canceled, setCanceled] = useState([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [searchTerm, setSearchTerm] = useState("");

//   const [showModalView, setShowModalView] = useState(false);
//   const [selectedRowData, setSelectedRowData] = useState({
//     fullname: "",
//     address: "",
//     name: "",
//     booked_date: "",
//     no_participant: "",
//     price: "",
//     reservation_fee: "",
//     total_price: "",
//     reason: "",
//   });

//   const selected_row_data = (
//     fullname,
//     address,
//     name,
//     booked_date,
//     no_participant,
//     price,
//     reservation_fee,
//     total_price,
//     reason
//   ) => {
//     setSelectedRowData({
//       fullname: fullname,
//       address: address,
//       name: name,
//       booked_date: booked_date,
//       no_participant: no_participant,
//       price: price,
//       reservation_fee: reservation_fee,
//       total_price: total_price,
//       reason: reason,
//     });

//     setShowModalView(true);
//   };

//   useEffect(() => {
//     axios
//       .get(`${config.apiBaseUrl}backend/ADMIN_PHP/getCancelledBook.php`)
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
//       // String(cbook.address).toLowerCase().includes(searchTerm.toLowerCase()) ||
//       String(cbook.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
//       String(cbook.booked_date)
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase()) ||
//       // String(cbook.no_participant)
//       //   .toLowerCase()
//       //   .includes(searchTerm.toLowerCase()) ||
//       // String(cbook.price).toLowerCase().includes(searchTerm.toLowerCase()) ||
//       // String(cbook.total_price)
//       //   .toLowerCase()
//       //   .includes(searchTerm.toLowerCase()) ||
//       String(cbook.reason).toLowerCase().includes(searchTerm.toLowerCase())
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
//               <h6>Canceled Booked</h6>
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
//                     <th>Reason of cancellation</th>
//                     <th>Action</th>
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
//                             Cancelled
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
//                                 data.reservation_fee,
//                                 data.total_price,
//                                 data.reason,
//                                 data.reason
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
//             <span>Cancelled Reservation</span>

//             <i
//               className="bi bi-x-square-fill"
//               onClick={() => setShowModalView(false)}
//             ></i>
//           </div>

//           <div className="content">
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
//               <span>Reservation Fee : {selectedRowData.reservation_fee}</span>
//               <span>Total Price : {selectedRowData.total_price}</span>

//               <span style={{ marginTop: "10px" }}>
//                 Reason for Cancellation : {selectedRowData.reason}
//               </span>
//             </div>
//           </div>
//         </div>
//       )}
//       {showModalView && (
//         <div
//           onClick={() => setShowModalView(false)}
//           className="view-alldata-overlay"
//         ></div>
//       )}{" "}
//     </>
//   );
// };

// export default Cancelled;
