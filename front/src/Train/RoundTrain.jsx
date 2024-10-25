// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import { Button, Box, Typography, Modal, Grid, Dialog, DialogContent, DialogActions, Alert,DialogTitle,  Accordion, AccordionSummary, AccordionDetails, Snackbar } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import AddIcon from "@mui/icons-material/Add";
// import RemoveIcon from "@mui/icons-material/Remove";
// import jsPDF from "jspdf";

// const RoundTrain = () => {
//   const location = useLocation();
//   const { formData } = location.state;
//   const [outboundPassengerCount, setOutboundPassengerCount] = useState({});
//   const [outboundTotalFare, setOutboundTotalFare] = useState(0);
//   const [returnPassengerCount, setReturnPassengerCount] = useState({});
//   const [returnTotalFare, setReturnTotalFare] = useState(0);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [confirmModalOpen, setConfirmModalOpen] = useState(false); // Confirm modal state
//   const [modalReservations, setModalReservations] = useState({
//     outboundRes: [],
//     returnRes: [],
//     totalFare: 0,
//   });
//   const [isReserved, setIsReserved] = useState(false);
//   const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);

//   const [outboundTrips, setOutboundTrips] = useState([]);
//   const [returnTrips, setReturnTrips] = useState([]);
//   const [reservedCoaches, setReservedCoaches] = useState({}); // Track reserved coaches

//   const trips = {
//     outbound: outboundTrips,
//     return: returnTrips,
//   };

//   useEffect(() => {
//     const initialPassengerCounts = {};
//     [...outboundTrips, ...returnTrips].forEach((train) => {
//       train.coaches.forEach((coach) => {
//         initialPassengerCounts[`${train.trainName}-${coach.coachName}`] = 0;
//       });
//     });
//     setOutboundPassengerCount(initialPassengerCounts);
//     setReturnPassengerCount(initialPassengerCounts);
//   }, [outboundTrips, returnTrips]);

//   useEffect(() => {
//     const fetchOutboundTrainData = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:5000/api/train/search?source=${formData.source}&destination=${formData.destination}`
//         );
//         if (!response.ok) {
//           throw new Error("Error fetching outbound trains");
//         }
//         const data = await response.json();
//         setOutboundTrips(data);
//       } catch (error) {
//         console.error(error.message);
//       }
//     };

//     const fetchReturnTrainData = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:5000/api/train/search?source=${formData.destination}&destination=${formData.source}`
//         );
//         if (!response.ok) {
//           throw new Error("Error fetching return trains");
//         }
//         const data = await response.json();
//         setReturnTrips(data);
//       } catch (error) {
//         console.error(error.message);
//       }
//     };

//     fetchOutboundTrainData();
//     fetchReturnTrainData();
//   }, [formData.source, formData.destination]);

//   const incrementCount = (type, trainName, coachName, fare) => {
//     const setPassengerCount =
//       type === "outbound" ? setOutboundPassengerCount : setReturnPassengerCount;
//     const setTotalFare =
//       type === "outbound" ? setOutboundTotalFare : setReturnTotalFare;

//     setPassengerCount((prev) => {
//       const currentCount = prev[`${trainName}-${coachName}`] || 0;
//       const coach = trips[type]
//         .find((t) => t.trainName === trainName)
//         ?.coaches.find((c) => c.coachName === coachName);

//       if (coach && currentCount < coach.noOfSeatsAvailable) {
//         const newCount = currentCount + 1;
//         setTotalFare((prevTotal) => prevTotal + fare);
//         return {
//           ...prev,
//           [`${trainName}-${coachName}`]: newCount,
//         };
//       } else {
//         alert("No more available seats.");
//         return prev;
//       }
//     });
//   };

//   const decrementCount = (type, trainName, coachName, fare) => {
//     const setPassengerCount =
//       type === "outbound" ? setOutboundPassengerCount : setReturnPassengerCount;
//     const setTotalFare =
//       type === "outbound" ? setOutboundTotalFare : setReturnTotalFare;

//     setPassengerCount((prev) => {
//       const currentCount = prev[`${trainName}-${coachName}`] || 0;
//       if (currentCount > 0) {
//         const newCount = currentCount - 1;
//         setTotalFare((prevTotal) => prevTotal - fare);
//         return {
//           ...prev,
//           [`${trainName}-${coachName}`]: newCount,
//         };
//       }
//       return prev;
//     });
//   };
//   const handleConfirmBooking = () => {
//     setIsModalOpen(false);
//     setIsReserved(true); // Update reservation state
//     setSuccessSnackbarOpen(true);
//     setTimeout(() => {
//       setSuccessSnackbarOpen(false);
//     }, 2000);
//   };
//   const handleReserve = () => {
//     const newReservations = [];
//     const newReservedCoaches = { ...reservedCoaches };

//     const collectReservations = (tripType, passengerCount) => {
//       trips[tripType].forEach((trip) => {
//         trip.coaches.forEach((coach) => {
//           const count = passengerCount[`${trip.trainName}-${coach.coachName}`] || 0;
//           if (count > 0) {
//             const totalFareForCoach = count * coach.fare;
//             newReservations.push({
//               tripType,
//               trainName: trip.trainName,
//               coachName: coach.coachName,
//               count,
//               totalFareForCoach,
//             });
//             newReservedCoaches[`${trip.trainName}-${coach.coachName}`] = true;
//           }
//         });
//       });
//     };

//     collectReservations("outbound", outboundPassengerCount);
//     collectReservations("return", returnPassengerCount);

//     if (newReservations.length > 0) {
//       setModalReservations({
//         outboundRes: newReservations.filter((res) => res.tripType === "outbound"),
//         returnRes: newReservations.filter((res) => res.tripType === "return"),
//         totalFare: newReservations.reduce((acc, res) => acc + res.totalFareForCoach, 0),
//       });
//       setConfirmModalOpen(true); // Open confirmation modal
//     } else {
//       alert("Please select at least 1 passenger.");
//     }
//   };

//   const confirmReservation = async () => {
//     let hasUpdatedSeats = false;

//     const updateSeatsInDatabase = async (trainName, coachName, updatedSeats) => {
//       try {
//         const response = await fetch(
//           `http://localhost:5000/api/train/update-trainseats`,
//           {
//             method: "PUT",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               trainName,
//               coachName,
//               updatedSeats,
//             }),
//           }
//         );

//         if (!response.ok) {
//           console.error("Failed to update seats");
//         }
//       } catch (error) {
//         console.error("Error updating seats in database:", error);
//       }
//     };

//     const updateTrips = async (tripType, passengerCount) => {
//       const updatedTrips = trips[tripType].map((trip) => {
//         const updatedCoaches = trip.coaches.map((coach) => {
//           const count = passengerCount[`${trip.trainName}-${coach.coachName}`] || 0;
//           if (count > 0) {
//             const updatedSeats = coach.noOfSeatsAvailable - count;
//             if (updatedSeats >= 0) {
//              updateSeatsInDatabase(trip.trainName, coach.coachName, updatedSeats);
//               hasUpdatedSeats = true;
//               return { ...coach, noOfSeatsAvailable: updatedSeats };
//             }
//           }
//           return coach;
//         });

//         return { ...trip, coaches: updatedCoaches };
//       });

//       return updatedTrips;
//     };

//     const updatedOutboundTrips = await updateTrips("outbound", outboundPassengerCount);
//     const updatedReturnTrips = await updateTrips("return", returnPassengerCount);

//     if (hasUpdatedSeats) {
//       setOutboundTrips(updatedOutboundTrips);
//       setReturnTrips(updatedReturnTrips);
//       setConfirmModalOpen(false);
//       setIsModalOpen(true); // Show confirmation modal after reservation
//     }
//   };

//   const downloadPDF = () => {
//     const { outboundRes, returnRes } = modalReservations;
//     const reservationsToDownload = [...outboundRes, ...returnRes];
//     if (reservationsToDownload.length === 0) return;

//     const doc = new jsPDF();
//     doc.text("Reservation Details", 20, 20);

//     reservationsToDownload.forEach((reservation, index) => {
//       doc.text(`Reservation ${index + 1}`, 20, 30 + index * 20);
//       doc.text(`Train: ${reservation.trainName}`, 20, 40 + index * 20);
//       doc.text(`Coach: ${reservation.coachName}`, 20, 50 + index * 20);
//       doc.text(`Passengers: ${reservation.count}`, 20, 60 + index * 20);
//       doc.text(
//         `Total Fare: $${reservation.totalFareForCoach}`,
//         20,
//         70 + index * 20
//       );
//     });

//     doc.save("reservation-details.pdf");
//   };

//   const renderTrip = (tripType) => {
//     const availableTrips = trips[tripType];

//     if (availableTrips.length === 0) {
//       return (
//         <Box
//           sx={{
//             border: "2px solid black",
//             backgroundColor: "#f5849b",
//             display: "flex",
//             justifyContent: "center", // Center the content horizontally
//             padding: 2, // Add some padding
//             borderRadius: "8px", // Optional rounded corners
//           }}
//         >
//           <Typography variant="body1">
//             No trains are available for this trip.
//           </Typography>
//         </Box>
//       );
//     }
//     return availableTrips.map((train, index) => (
//       <Accordion key={index}>
//         <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//         <Typography variant="h6" sx={{ color: "blue", fontWeight: "bold" }}>
//             {train.trainName} ({train.source} to {train.destination})
//           </Typography>
//         </AccordionSummary>
//         <AccordionDetails>
//           <Box
//             sx={{
//               border: "1px solid lightgray", // Set border color
//               borderRadius: "4px", // Rounded corners
//               padding: 2, // Padding inside the box
//               mb: 2, // Margin bottom for spacing
//               backgroundColor: "#f9f9f9", // Light background color
//             }}
//           ><Typography variant="h6" sx={{ color: "blue", fontWeight: "bold" }}>
//             {train.source} to {train.destination}
//           </Typography>
//             <Box sx={{ width: "100%", mb: 2 }}>
//               <Typography variant="body1" sx={{color:'red'}}>
//                 Start Time: {train.startTime}
//               </Typography>
//               <Typography variant="body1" sx={{color:'green'}}>End Time: {train.endTime}</Typography>
//               <Typography variant="body1" sx={{color:'orange'}}>
//                 Stops: {train.stops.join(", ")}
//               </Typography>
//             </Box>
//             <Grid container spacing={3}>
//               {train.coaches.map((coach, coachIndex) => (
//                 <Grid item xs={12} sm={6} md={2} key={coachIndex}>
//                   <Box
//                     sx={{
//                       backgroundColor: "#f0f4ff", // Light blue background for the box
//                       border: "1px solid #ccc",
//                       borderRadius: "8px",
//                       padding: "16px",
//                       display: "flex",
//                       flexDirection: "column",
//                       justifyContent: "space-between",
//                       height: "150px", // Set a fixed height to ensure responsiveness
//                       boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Slight box shadow for better elevation
//                     }}
//                   >
//                     <Typography variant="h6">{coach.coachName}</Typography>
//                     <Typography variant="body2">Seats Available: {coach.noOfSeatsAvailable}</Typography>
//                     <Typography variant="body2">Fare: ${coach.fare}</Typography>
//                     <Box
//                       sx={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center", // Aligns items in a straight line vertically
//                         mt: 2,
//                         border: "1px solid #ddd",
//                         padding: "4px",
//                         borderRadius: "8px",
//                         backgroundColor: "#fff", // Light background for the buttons area
//                       }}
//                     >
//                       <Button
//                         onClick={() =>
//                           incrementCount(
//                             tripType,
//                             train.trainName,
//                             coach.coachName,
//                             coach.fare
//                           )
//                         }
//                         sx={{
//                           minWidth: "36px",
//                           height: "30px", // Reduced height for the button
//                           padding: "0", // Remove padding for a more compact button
//                         }}
//                         variant="contained"
//                         size="small"
//                       >
//                         <AddIcon fontSize="small" />
//                       </Button>
//                       <Typography variant="body2" sx={{ mx: 1 }}>
//                         {tripType === "outbound"
//                           ? outboundPassengerCount[
//                               `${train.trainName}-${coach.coachName}`
//                             ] || 0
//                           : returnPassengerCount[
//                               `${train.trainName}-${coach.coachName}`
//                             ] || 0}{" "}
//                       </Typography>
//                       <Button
//                         onClick={() =>
//                           decrementCount(
//                             tripType,
//                             train.trainName,
//                             coach.coachName,
//                             coach.fare
//                           )
//                         }
//                         sx={{
//                           minWidth: "36px",
//                           height: "30px", // Reduced height for the button
//                           padding: "0", // Remove padding for a more compact button
//                         }}
//                         variant="contained"
//                         size="small"
//                       >
//                         <RemoveIcon fontSize="small" />
//                       </Button>
//                     </Box>
//                   </Box>
//                 </Grid>
//               ))}
//             </Grid>
//           </Box>
//         </AccordionDetails>
//       </Accordion>
//     ));
//   };
//   return (
//     <Box
//       sx={{
//        backgroundImage:"url(../../train2.jpg)", /* Replace with your image path */
//   backgroundSize: 'cover', /* Ensure the image covers the entire area */
//   backgroundRepeat: 'no-repeat', /* Prevent repeating the image */
//   backgroundPosition: 'center', /* Center the image */
//   backgroundAttachment: 'fixed', /* Make the background fixed */
//   minHeight: '100vh',
//   paddingLeft:2,
//   paddingRight:2
//       }}
//     >
//         <Typography variant="h4" p={2} sx={{
//           background:
//             "linear-gradient(to right, violet, indigo, blue, green, yellow, orange, red)",
//           WebkitBackgroundClip: "text",
//           WebkitTextFillColor: "transparent",
//           textAlign: "center",}}>
//           Round Trip Train Reservations
//         </Typography>
      
//         <Typography variant="h5"  sx={{ mt: 2,
//           color:'red',
//           textAlign: "center",}}>
//           Outbound Trip
//         </Typography>
//       {renderTrip("outbound")}

//         <Typography variant="h5" sx={{ mt: 2,
//         color:'red',
//           textAlign: "center",}}>
//           Return Trip
//         </Typography>
//       {renderTrip("return")}

//       {isReserved ? ( // Conditional rendering based on reservation confirmation
      
//         <Box sx={{display:'flex', justifyContent:'center'}}>
//         <Button variant="contained" onClick={downloadPDF} sx={{ mt: 4 }}>
//           Download PDF
//         </Button></Box>
//       ) : (
//         <Box sx={{display:'flex', justifyContent:'center'}}>
//         <Button
//           variant="contained"
//           onClick={handleReserve}
//           sx={{ mt: 4, mr: 2 }}
//         >
//           Reserve
//         </Button></Box>
//       )}

//       <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
//         <DialogTitle>Confirm Your Reservations</DialogTitle>
//         <DialogContent>
//           <Typography variant="h6">Outbound Trip</Typography>
//           {modalReservations.outboundRes?.map((res, index) => (
//             <Typography key={index}>
//               {res.count} x {res.trainName} - {res.coachName} = $
//               {res.totalFareForCoach}
//             </Typography>
//           ))}
//           <Typography variant="h6" sx={{ mt: 2 }}>
//             Return Trip
//           </Typography>
//           {modalReservations.returnRes?.map((res, index) => (
//             <Typography key={index}>
//               {res.count} x {res.trainName} - {res.coachName} = $
//               {res.totalFareForCoach}
//             </Typography>
//           ))}
//           <Typography variant="h5" sx={{ mt: 2 }}>
//             Total Fare: ${modalReservations.totalFare}
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
//           <Button onClick={handleConfirmBooking}>Confirm</Button>
//         </DialogActions>
//       </Dialog>

//       {/* <Snackbar
//         open={successSnackbarOpen}
//         autoHideDuration={2000}
//         onClose={() => setSuccessSnackbarOpen(false)}
//         message="Reservations Confirmed!"
//       /> */}

//       <Snackbar
//         open={successSnackbarOpen}
//         autoHideDuration={3000}
//         onClose={() => setSuccessSnackbarOpen(false)}
//         anchorOrigin={{ vertical: "top", horizontal: "center" }}
//       >
//         <Alert onClose={() => setSuccessSnackbarOpen(false)} severity="success">
//           Booking confirmed successfully!
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default RoundTrain;


import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button, Box, Typography, Dialog, DialogContent, DialogActions, Snackbar, Alert, DialogTitle, Accordion, AccordionSummary, AccordionDetails, Grid } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import jsPDF from "jspdf";

const RoundTrain = () => {
  const location = useLocation();
  const { formData } = location.state;
  const [outboundPassengerCount, setOutboundPassengerCount] = useState({});
  const [outboundTotalFare, setOutboundTotalFare] = useState(0);
  const [returnPassengerCount, setReturnPassengerCount] = useState({});
  const [returnTotalFare, setReturnTotalFare] = useState(0);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false); // Confirm modal state
  const [modalReservations, setModalReservations] = useState({
    outboundRes: [],
    returnRes: [],
    totalFare: 0,
  });
  const [isReserved, setIsReserved] = useState(false);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);

  const [outboundTrips, setOutboundTrips] = useState([]);
  const [returnTrips, setReturnTrips] = useState([]);
  const [reservedCoaches, setReservedCoaches] = useState({}); // Track reserved coaches

  const trips = {
    outbound: outboundTrips,
    return: returnTrips,
  };

  useEffect(() => {
    const fetchTrainData = async (source, destination, setTrips) => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/train/search?source=${source}&destination=${destination}`
        );
        if (!response.ok) throw new Error("Error fetching trains");
        const data = await response.json();
        setTrips(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchTrainData(formData.source, formData.destination, setOutboundTrips);
    fetchTrainData(formData.destination, formData.source, setReturnTrips);
  }, [formData.source, formData.destination]);

  useEffect(() => {
    const initialPassengerCounts = {};
    [...outboundTrips, ...returnTrips].forEach((train) => {
      train.coaches.forEach((coach) => {
        initialPassengerCounts[`${train.trainName}-${coach.coachName}`] = 0;
      });
    });
    setOutboundPassengerCount(initialPassengerCounts);
    setReturnPassengerCount(initialPassengerCounts);
  }, [outboundTrips, returnTrips]);

  const handleCountChange = (type, trainName, coachName, fare, action) => {
    const setPassengerCount =
      type === "outbound" ? setOutboundPassengerCount : setReturnPassengerCount;
    const setTotalFare =
      type === "outbound" ? setOutboundTotalFare : setReturnTotalFare;

    setPassengerCount((prev) => {
      const currentCount = prev[`${trainName}-${coachName}`] || 0;
      const trip = trips[type].find((t) => t.trainName === trainName);
      const coach = trip?.coaches.find((c) => c.coachName === coachName);

      if (coach) {
        const updatedCount =
          action === "increment" && currentCount < coach.noOfSeatsAvailable
            ? currentCount + 1
            : action === "decrement" && currentCount > 0
            ? currentCount - 1
            : currentCount;

        const fareChange = (updatedCount - currentCount) * fare;
        setTotalFare((prevTotal) => prevTotal + fareChange);

        return {
          ...prev,
          [`${trainName}-${coachName}`]: updatedCount,
        };
      }
      return prev;
    });
  };

  const handleReserve = () => {
    const newReservations = [];
    const newReservedCoaches = { ...reservedCoaches };

    const collectReservations = (tripType, passengerCount) => {
      trips[tripType].forEach((trip) => {
        trip.coaches.forEach((coach) => {
          const count =
            passengerCount[`${trip.trainName}-${coach.coachName}`] || 0;
          if (count > 0) {
            const totalFareForCoach = count * coach.fare;
            newReservations.push({
              tripType,
              trainName: trip.trainName,
              coachName: coach.coachName,
              count,
              totalFareForCoach,
            });
            newReservedCoaches[`${trip.trainName}-${coach.coachName}`] = true;
          }
        });
      });
    };

    collectReservations("outbound", outboundPassengerCount);
    collectReservations("return", returnPassengerCount);

    if (newReservations.length > 0) {
      setModalReservations({
        outboundRes: newReservations.filter((res) => res.tripType === "outbound"),
        returnRes: newReservations.filter((res) => res.tripType === "return"),
        totalFare: newReservations.reduce(
          (acc, res) => acc + res.totalFareForCoach,
          0
        ),
      });
      setConfirmModalOpen(true); // Open confirmation modal
    } else {
      alert("Please select at least 1 passenger.");
    }
  };

  const confirmReservation = async () => {
    let hasUpdatedSeats = false;

    const updateSeatsInDatabase = async (trainName, coachName, updatedSeats) => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/train/update-trainseats`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              trainName,
              coachName,
              updatedSeats,
            }),
          }
        );
        if (!response.ok) console.error("Failed to update seats");
      } catch (error) {
        console.error("Error updating seats in database:", error);
      }
    };

    const updateTrips = async (tripType, passengerCount) => {
      const updatedTrips = trips[tripType].map((trip) => {
        const updatedCoaches = trip.coaches.map((coach) => {
          const count =
            passengerCount[`${trip.trainName}-${coach.coachName}`] || 0;
          if (count > 0) {
            const updatedSeats = coach.noOfSeatsAvailable - count;
            if (updatedSeats >= 0) {
              updateSeatsInDatabase(trip.trainName, coach.coachName, updatedSeats);
              hasUpdatedSeats = true;
              return { ...coach, noOfSeatsAvailable: updatedSeats };
            }
          }
          return coach;
        });
        return { ...trip, coaches: updatedCoaches };
      });
      return updatedTrips;
    };

    const updatedOutboundTrips = await updateTrips(
      "outbound",
      outboundPassengerCount
    );
    const updatedReturnTrips = await updateTrips("return", returnPassengerCount);

    if (hasUpdatedSeats) {
      setOutboundTrips(updatedOutboundTrips);
      setReturnTrips(updatedReturnTrips);
      setConfirmModalOpen(false);
      setIsReserved(true);
      setSuccessSnackbarOpen(true); // Open success snackbar
      setTimeout(() => setSuccessSnackbarOpen(false), 2000);
    }
  };

  const downloadPDF = () => {
    const { outboundRes, returnRes } = modalReservations;
    const reservationsToDownload = [...outboundRes, ...returnRes];
    if (reservationsToDownload.length === 0) return;

    const doc = new jsPDF();
    doc.text("Reservation Details", 20, 20);

    reservationsToDownload.forEach((reservation, index) => {
      doc.text(`Reservation ${index + 1}`, 20, 30 + index * 20);
      doc.text(`Train: ${reservation.trainName}`, 20, 40 + index * 20);
      doc.text(`Coach: ${reservation.coachName}`, 20, 50 + index * 20);
      doc.text(`Passengers: ${reservation.count}`, 20, 60 + index * 20);
      doc.text(
        `Total Fare: $${reservation.totalFareForCoach}`,
        20,
        70 + index * 20
      );
    });

    doc.save("reservation-details.pdf");
  };

  const renderTrip = (tripType) => {
    const availableTrips = trips[tripType];
    if (availableTrips.length === 0) {
      return (
        <Box
          sx={{
            border: "2px solid black",
            backgroundColor: "#f5849b",
            display: "flex",
            justifyContent: "center",
            padding: 2,
            borderRadius: "8px",
          }}
        >
          <Typography variant="body1">No trains are available for this trip.</Typography>
        </Box>
      );
    }

    return availableTrips.map((train, index) => (
      <Accordion key={index}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" fontWeight="bold">
            {train.trainName}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Source: {train.source}</Typography>
          <Typography>Destination: {train.destination}</Typography>
          <Typography>Departure Time: {train.departureTime}</Typography>
          <Typography>Arrival Time: {train.arrivalTime}</Typography>
          <Box mt={2}>
            {train.coaches.map((coach, idx) => (
              <Grid container spacing={2} key={idx} alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Typography variant="subtitle1">
                    Coach: {coach.coachName} | Seats: {coach.noOfSeatsAvailable} | Fare: ${coach.fare}
                  </Typography>
                </Grid>
                <Grid item>
                  <Button
                    onClick={() => handleCountChange(tripType, train.trainName, coach.coachName, coach.fare, "decrement")}
                    disabled={reservedCoaches[`${train.trainName}-${coach.coachName}`]}
                  >
                    <RemoveIcon />
                  </Button>
                  <Typography variant="body1" component="span" mx={2}>
                    {tripType === "outbound"
                      ? outboundPassengerCount[`${train.trainName}-${coach.coachName}`] || 0
                      : returnPassengerCount[`${train.trainName}-${coach.coachName}`] || 0}
                  </Typography>
                  <Button
                    onClick={() => handleCountChange(tripType, train.trainName, coach.coachName, coach.fare, "increment")}
                    disabled={reservedCoaches[`${train.trainName}-${coach.coachName}`]}
                  >
                    <AddIcon />
                  </Button>
                </Grid>
              </Grid>
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>
    ));
  };

  return (
    <div style={{ marginTop: "70px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Available Trains
      </Typography>
      <Box mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Outbound Trains
        </Typography>
        {renderTrip("outbound")}
      </Box>
      <Box mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Return Trains
        </Typography>
        {renderTrip("return")}
      </Box>
      <Box sx={{ textAlign: "center", marginTop: "30px" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleReserve}
          disabled={isReserved}
        >
          Reserve
        </Button>
      </Box>

      {/* Confirm Reservation Modal */}
      <Dialog open={confirmModalOpen} onClose={() => setConfirmModalOpen(false)}>
        <DialogTitle>Confirm Reservation</DialogTitle>
        <DialogContent>
          {modalReservations.outboundRes.length > 0 && (
            <>
              <Typography variant="h6" fontWeight="bold">
                Outbound Reservations
              </Typography>
              {modalReservations.outboundRes.map((res, index) => (
                <Typography key={index}>
                  Train: {res.trainName}, Coach: {res.coachName}, Passengers: {res.count}, Total Fare: ${res.totalFareForCoach}
                </Typography>
              ))}
            </>
          )}
          {modalReservations.returnRes.length > 0 && (
            <>
              <Typography variant="h6" fontWeight="bold">
                Return Reservations
              </Typography>
              {modalReservations.returnRes.map((res, index) => (
                <Typography key={index}>
                  Train: {res.trainName}, Coach: {res.coachName}, Passengers: {res.count}, Total Fare: ${res.totalFareForCoach}
                </Typography>
              ))}
            </>
          )}
          <Typography variant="h6" fontWeight="bold">
            Total Fare: ${modalReservations.totalFare}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmModalOpen(false)}>Cancel</Button>
          <Button onClick={confirmReservation}>Confirm</Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar open={successSnackbarOpen} autoHideDuration={2000}>
        <Alert severity="success" sx={{ width: "100%" }}>
          Reservation Successful!
        </Alert>
      </Snackbar>

      {/* Download PDF */}
      {isReserved && (
        <Box sx={{ textAlign: "center", marginTop: "20px" }}>
          <Button variant="contained" onClick={downloadPDF}>
            Download Reservation as PDF
          </Button>
        </Box>
      )}
    </div>
  );
};

export default RoundTrain;
