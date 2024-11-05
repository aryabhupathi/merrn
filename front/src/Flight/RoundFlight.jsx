// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   Typography,
//   Snackbar,
//   Alert,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Modal,
// } from "@mui/material";
// import Grid from '@mui/material/Grid2';
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import TicketStepper from "./TicketStepper"; // Ensure this component is set up correctly
// import { useLocation } from "react-router-dom";
// const RoundTripBooking = () => {
//   const location = useLocation();
//   const { formData } = location.state;
//   const [outboundSelectedSeats, setOutboundSelectedSeats] = useState({});
//   const [returnSelectedSeats, setReturnSelectedSeats] = useState({});
//   const [openConfirmModal, setOpenConfirmModal] = useState(false);
//   const [outboundFlight, setOutboundFlight] = useState(null);
//   const [returnFlight, setReturnFlight] = useState(null);
//   const [expanded, setExpanded] = useState({ outbound: false, return: false });
//   const [bookingConfirmed, setBookingConfirmed] = useState(false);
//   const [showMessage, setShowMessage] = useState(false);
//   const [startBooking, setStartBooking] = useState(false);
//   const [totalFare, setTotalFare] = useState({ outbound: 0, return: 0 });
//   const [outboundTrip, setOutboundTrip] = useState([]);
//   const [returnTrip, setReturnTrip] = useState([]);
//   const [error, setError] = useState(null);
//   const [outboundBookedSeats, setOutboundBookedSeats] = useState([]);
//   const [returnBookedSeats, setReturnBookedSeats] = useState([]);
//   // Fetch available outbound flights
//   useEffect(() => {
//     const fetchOutboundFlightData = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:5000/api/flight/search?source=${formData.source}&destination=${formData.destination}`
//         );
//         if (!response.ok) {
//           throw new Error("Error fetching outbound flights");
//         }
//         const data = await response.json();
//         setOutboundTrip(data);
//       } catch (error) {
//         setError(error.message);
//         console.log(error, "Fetch Error");
//       }
//     };
//     fetchOutboundFlightData();
//   }, [formData.source, formData.destination]);
//   // Fetch available return flights
//   useEffect(() => {
//     const fetchReturnFlightData = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:5000/api/flight/search?source=${formData.destination}&destination=${formData.source}`
//         );
//         if (!response.ok) {
//           throw new Error("Error fetching return flights");
//         }
//         const data = await response.json();
//         setReturnTrip(data);
//       } catch (error) {
//         setError(error.message);
//         console.log(error, "Fetch Error");
//       }
//     };
//     fetchReturnFlightData();
//   }, [formData.destination, formData.source]);
//   // Fetch booked seats when an outbound flight is selected
//   const fetchOutboundBookedSeats = async (flightId) => {
//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/flight/bookedSeats?flightId=${flightId}`
//       );
//       if (!response.ok) {
//         throw new Error("Error fetching outbound booked seats");
//       }
//       const data = await response.json();
//       setOutboundBookedSeats(data.bookedSeats || []);
//     } catch (error) {
//       console.error("Error fetching outbound booked seats:", error);
//     }
//   };
//   // Fetch booked seats when a return flight is selected
//   const fetchReturnBookedSeats = async (flightId) => {
//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/flight/bookedSeats?flightId=${flightId}`
//       );
//       if (!response.ok) {
//         throw new Error("Error fetching return booked seats");
//       }
//       const data = await response.json();
//       setReturnBookedSeats(data.bookedSeats || []);
//     } catch (error) {
//       console.error("Error fetching return booked seats:", error);
//     }
//   };
//   const handleCloseSnackbar = () => setShowMessage(false);
//   const handleOutboundFlightSelect = async (flight) => {
//     setOutboundFlight(flight);
//     setOutboundSelectedSeats((prevSeats) => ({
//       ...prevSeats,
//       [flight.flightName]: prevSeats[flight.flightName] || [],
//     }));
//     setBookingConfirmed(false);
//     setStartBooking(false);
//     // Fetch the booked seats for the selected outbound flight
//     await fetchOutboundBookedSeats(flight._id); // Use the correct property for flight ID
//   };
//   const handleReturnFlightSelect = async (flight) => {
//     setReturnFlight(flight);
//     setReturnSelectedSeats((prevSeats) => ({
//       ...prevSeats,
//       [flight.flightName]: prevSeats[flight.flightName] || [],
//     }));
//     setBookingConfirmed(false);
//     setStartBooking(false);
//     // Fetch the booked seats for the selected return flight
//     await fetchReturnBookedSeats(flight._id); // Use the correct property for flight ID
//   };
//   const handleStartBooking = () => {
//     setStartBooking(true);
//   };
//   const handleBookSeats = () => {
//     if (
//       outboundSelectedSeats[outboundFlight.flightName]?.length > 0 &&
//       returnSelectedSeats[returnFlight.flightName]?.length > 0
//     ) {
//       setOpenConfirmModal(true);
//     } else {
//       alert("Please select seats for both flights before booking.");
//     }
//   };
//   const handleTotalFareUpdate = (fare, tripType) => {
//     setTotalFare((prev) => ({ ...prev, [tripType]: fare }));
//   };
//   const handleConfirmBooking = async () => {
//     const outboundPayload = {
//       flightId: outboundFlight._id,
//       seats: outboundSelectedSeats[outboundFlight.flightName] || [],
//       totalFare: totalFare.outbound,
//     };
//     const returnPayload = {
//       flightId: returnFlight._id,
//       seats: returnSelectedSeats[returnFlight.flightName] || [],
//       totalFare: totalFare.return,
//     };
//     if (
//       !outboundPayload.flightId ||
//       outboundPayload.seats.length === 0 ||
//       outboundPayload.totalFare <= 0 ||
//       !returnPayload.flightId ||
//       returnPayload.seats.length === 0 ||
//       returnPayload.totalFare <= 0
//     ) {
//       alert("Flight ID, seats, and total fare are required for both trips.");
//       return;
//     }
//     try {
//       const outboundResponse = await fetch(
//         "http://localhost:5000/api/flight/bookings",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(outboundPayload),
//         }
//       );
//       const returnResponse = await fetch(
//         "http://localhost:5000/api/flight/bookings",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(returnPayload),
//         }
//       );
//       if (outboundResponse.ok && returnResponse.ok) {
//         const outboundData = await outboundResponse.json();
//         const returnData = await returnResponse.json();
//         console.log("Booking confirmed:", outboundData, returnData);
//         setBookingConfirmed(true);
//         setShowMessage(true);
//       } else {
//         const errorDataOutbound = await outboundResponse.json();
//         const errorDataReturn = await returnResponse.json();
//         alert(`Error: ${errorDataOutbound.message} | ${errorDataReturn.message}`);
//       }
//     } catch (error) {
//       console.error("Error during booking:", error);
//       alert("An error occurred while confirming your booking. Please try again.");
//     } finally {
//       setOpenConfirmModal(false);
//     }
//   };
//   const confirmBooking = () => {
//     handleConfirmBooking();
//   };
//   const handleChange = (flightIndex, tripType) => {
//     setExpanded((prev) => ({
//       ...prev,
//       [tripType]: expanded[tripType] === flightIndex ? false : flightIndex,
//     }));
//     if (tripType === "outbound") {
//       handleOutboundFlightSelect(outboundTrip[flightIndex]);
//     } else {
//       handleReturnFlightSelect(returnTrip[flightIndex]);
//     }
//   };
//   return (
//     <Box
//       sx={{
//         padding: 2,
//         backgroundImage: "url(../../flight.webp)",
//         backgroundSize: "cover",
//         backgroundRepeat: "no-repeat",
//         backgroundPosition: "center",
//         backgroundAttachment: "fixed",
//         minHeight: "100vh",
//       }}
//     >
//       <Typography
//         variant="h5"
//         sx={{
//           background: "linear-gradient(to right, red, green, blue)",
//           WebkitBackgroundClip: "text",
//           WebkitTextFillColor: "transparent",
//           textAlign: "center",
//           margin: 0,
//         }}
//       >
//         Available Flights from {formData.source} to {formData.destination} and Back
//       </Typography>
//       <Grid size={{ xs: 12, sm: 9 }} sx={{ padding: 2 }}>
//         <Typography variant="h6" sx={{ mb: 2 }}>Outbound Flights</Typography>
//         {outboundTrip.length > 0 ? (
//           outboundTrip.map((details, index) => (
//             <Accordion
//               key={index}
//               expanded={expanded.outbound === index}
//               onChange={() => handleChange(index, "outbound")}
//               sx={{ mb: 2 }}
//             >
//               <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                 <Typography
//                   variant="h6"
//                   sx={{ color: "blue", fontWeight: "bold" }}
//                 >
//                   {details.flightName}
//                   <span style={{ color: "gray" }}> &#x2794; </span>
//                 </Typography>
//                 <Typography variant="body1" sx={{ color: "green", ml: 2 }}>
//                   Route: {details.source} to {details.destination}
//                   <span style={{ color: "gray" }}> &#x2794; </span>
//                 </Typography>
//                 <Typography variant="body1" sx={{ color: "orange", ml: 2 }}>
//                   Fare per seat: ${details.baseFare}
//                 </Typography>
//               </AccordionSummary>
//               <AccordionDetails>
//                 <Box>
//                   <Box
//                     sx={{
//                       border: "1px solid lightgray",
//                       borderRadius: "4px",
//                       padding: 2,
//                       mb: 2,
//                       backgroundColor: "#f9f9f9",
//                     }}
//                   >
//                     <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                       <Typography variant="body2" sx={{ color: "blue", mr: 1 }}>
//                         Start Time: {details.startTime}
//                       </Typography>
//                       <Typography variant="body2" sx={{ color: "blue" }}>
//                         | End Time: {details.endTime}
//                       </Typography>
//                     </Box>
//                     <Typography variant="body2" sx={{ color: "green", mt: 1 }}>
//                       Stops: {details.stops.join(", ")}
//                     </Typography>
//                     <Typography variant="body2" sx={{ color: "green", mt: 1 }}>
//                       Base Price: ${details.baseFare}
//                     </Typography>
//                     <Button onClick={handleStartBooking}>Proceed</Button>
//                     {startBooking && !bookingConfirmed && (
//                       <TicketStepper
//                         selectedFlight={details}
// seatLayout={details.layout}
//                         seatCategories={details.seatCategories}
//                         onTotalFare={(fare) => handleTotalFareUpdate(fare, "outbound")}
//                         setSelectedSeats={setOutboundSelectedSeats}
//                         bookedSeats={outboundBookedSeats} // Pass the booked seats here
//                       />
//                     )}
//                   </Box>
//                 </Box>
//               </AccordionDetails>
//             </Accordion>
//           ))
//         ) : (
//           <Alert severity="error">No outbound flights found!</Alert>
//         )}
//         <Typography variant="h6" sx={{ mb: 2 }}>Return Flights</Typography>
//         {returnTrip.length > 0 ? (
//           returnTrip.map((details, index) => (
//             <Accordion
//               key={index}
//               expanded={expanded.return === index}
//               onChange={() => handleChange(index, "return")}
//               sx={{ mb: 2 }}
//             >
//               <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                 <Typography
//                   variant="h6"
//                   sx={{ color: "blue", fontWeight: "bold" }}
//                 >
//                   {details.flightName}
//                   <span style={{ color: "gray" }}> &#x2794; </span>
//                 </Typography>
//                 <Typography variant="body1" sx={{ color: "green", ml: 2 }}>
//                   Route: {details.source} to {details.destination}
//                   <span style={{ color: "gray" }}> &#x2794; </span>
//                 </Typography>
//                 <Typography variant="body1" sx={{ color: "orange", ml: 2 }}>
//                   Fare per seat: ${details.baseFare}
//                 </Typography>
//               </AccordionSummary>
//               <AccordionDetails>
//                 <Box>
//                   <Box
//                     sx={{
//                       border: "1px solid lightgray",
//                       borderRadius: "4px",
//                       padding: 2,
//                       mb: 2,
//                       backgroundColor: "#f9f9f9",
//                     }}
//                   >
//                     <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                       <Typography variant="body2" sx={{ color: "blue", mr: 1 }}>
//                         Start Time: {details.startTime}
//                       </Typography>
//                       <Typography variant="body2" sx={{ color: "blue" }}>
//                         | End Time: {details.endTime}
//                       </Typography>
//                     </Box>
//                     <Typography variant="body2" sx={{ color: "green", mt: 1 }}>
//                       Stops: {details.stops.join(", ")}
//                     </Typography>
//                     <Typography variant="body2" sx={{ color: "green", mt: 1 }}>
//                       Base Price: ${details.baseFare}
//                     </Typography>
//                     <Button onClick={handleStartBooking}>Proceed</Button>
//                     {startBooking && !bookingConfirmed && (
//                       <TicketStepper
//                         selectedFlight={details}
//                         seatLayout={details.layout}
//                         seatCategories={details.seatCategories}
//                         onTotalFare={(fare) => handleTotalFareUpdate(fare, "return")}
//                         setSelectedSeats={setReturnSelectedSeats}
//                         bookedSeats={returnBookedSeats} // Pass the booked seats here
//                       />
//                     )}
//                   </Box>
//                 </Box>
//               </AccordionDetails>
//             </Accordion>
//           ))
//         ) : (
//           <Alert severity="error">No return flights found!</Alert>
//         )}
//       </Grid>
//       {/* Confirmation Modal */}
//       <Modal open={openConfirmModal} onClose={() => setOpenConfirmModal(false)}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: 400,
//             bgcolor: "background.paper",
//             boxShadow: 24,
//             p: 4,
//             textAlign: "center",
//           }}
//         >
//           <Typography variant="h6">Confirm Booking?</Typography>
//           <Button
//             variant="contained"
//             color="primary"
//             sx={{ mt: 2 }}
//             onClick={confirmBooking}
//           >
//             Confirm
//           </Button>
//         </Box>
//       </Modal>
//       {/* Snackbar */}
//       <Snackbar
//         open={showMessage}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Alert onClose={handleCloseSnackbar} severity="success">
//           Booking Confirmed!
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };
// export default RoundTripBooking;

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useLocation } from "react-router-dom";
import TicketStepper from "./RoundTicketStepper";

const RoundTripBooking = () => {
  const location = useLocation();
  const { formData } = location.state;
  const [outboundSelectedSeats, setOutboundSelectedSeats] = useState([]);
  const [returnSelectedSeats, setReturnSelectedSeats] = useState([]); // State for return selected seats
  const [outboundFlight, setOutboundFlight] = useState(null);
  const [returnFlight, setReturnFlight] = useState(null);
  const [expanded, setExpanded] = useState({ outbound: null, return: null });
  const [showMessage, setShowMessage] = useState(false);
  const [totalFare, setTotalFare] = useState({ outbound: 0, return: 0 });
  const [outboundTrip, setOutboundTrip] = useState([]);
  const [returnTrip, setReturnTrip] = useState([]);
  const [error, setError] = useState(null);
  const [outboundBookedSeats, setOutboundBookedSeats] = useState([]);
  const [returnBookedSeats, setReturnBookedSeats] = useState([]);

  // Fetch available outbound flights
  useEffect(() => {
    const fetchOutboundFlightData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/flight/search?source=${formData.source}&destination=${formData.destination}`
        );
        if (!response.ok) {
          throw new Error("Error fetching outbound flights");
        }
        const data = await response.json();
        setOutboundTrip(data);
      } catch (error) {
        setError(error.message);
        console.log(error, "Fetch Error");
      }
    };
    fetchOutboundFlightData();
  }, [formData.source, formData.destination]);

  // Fetch available return flights
  useEffect(() => {
    const fetchReturnFlightData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/flight/search?source=${formData.destination}&destination=${formData.source}`
        );
        if (!response.ok) {
          throw new Error("Error fetching return flights");
        }
        const data = await response.json();
        setReturnTrip(data);
      } catch (error) {
        setError(error.message);
        console.log(error, "Fetch Error");
      }
    };
    fetchReturnFlightData();
  }, [formData.destination, formData.source]);

  // Fetch booked seats for outbound flight
  const fetchOutboundBookedSeats = async (flightId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/flight/bookedSeats?flightId=${flightId}`
      );
      if (!response.ok) {
        throw new Error("Error fetching outbound booked seats");
      }
      const data = await response.json();
      setOutboundBookedSeats(data.bookedSeats || []);
    } catch (error) {
      console.error("Error fetching outbound booked seats:", error);
    }
  };

  // Fetch booked seats for return flight
  const fetchReturnBookedSeats = async (flightId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/flight/bookedSeats?flightId=${flightId}`
      );
      if (!response.ok) {
        throw new Error("Error fetching return booked seats");
      }
      const data = await response.json();
      setReturnBookedSeats(data.bookedSeats || []);
    } catch (error) {
      console.error("Error fetching return booked seats:", error);
    }
  };

  const handleCloseSnackbar = () => setShowMessage(false);

  const handleOutboundFlightSelect = async (flight) => {
    setOutboundFlight(flight);
    await fetchOutboundBookedSeats(flight._id);
  };

  const handleReturnFlightSelect = async (flight) => {
    setReturnFlight(flight);
    await fetchReturnBookedSeats(flight._id);
  };

  const handleTotalFareUpdate = (fare, tripType) => {
    setTotalFare((prev) => ({
      ...prev,
      [tripType]: fare,
    }));
  };

  // Function to handle accordion state
  const handleAccordionChange = (index, tripType) => {
    setExpanded((prev) => ({
      ...prev,
      [tripType]: prev[tripType] === index ? null : index, // Toggles the accordion
    }));
  };

  return (
    <Box
      sx={{
        padding: 2,
        backgroundImage: "url(../../flight.webp)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          background: "linear-gradient(to right, red, green, blue)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textAlign: "center",
          margin: 0,
        }}
      >
        Available Flights from {formData.source} to {formData.destination} and
        Back
      </Typography>

      <Grid container spacing={2} sx={{ padding: 2 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Outbound Flights
          </Typography>
          {outboundTrip.length > 0 ? (
            outboundTrip.map((details, index) => (
              <Accordion
                key={index}
                expanded={expanded.outbound === index}
                onChange={() => handleAccordionChange(index, "outbound")}
                sx={{ mb: 2 }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  onClick={() => handleOutboundFlightSelect(details)}
                >
                  <Typography variant="body1">{details.flightName}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>Price: {details.price}</Typography>
                  <Typography>Time: {details.departureTime}</Typography>
                  {expanded.outbound === index && outboundFlight && (
                    <TicketStepper
                      selectedFlight={details}
                      seatLayout={details.layout}
                      seatCategories={details.seatCategories}
                      onTotalFare={handleTotalFareUpdate}
                      setSelectedSeats={setOutboundSelectedSeats}
                      bookedSeats={outboundBookedSeats} // Pass the booked seats here
                      outboundFlight={outboundFlight}
                      returnFlight={returnFlight}
                    />
                  )}
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Typography>No outbound flights available</Typography>
          )}
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Return Flights
          </Typography>
          {returnTrip.length > 0 ? (
            returnTrip.map((details, index) => (
              <Accordion
                key={index}
                expanded={expanded.return === index}
                onChange={() => handleAccordionChange(index, "return")}
                sx={{ mb: 2 }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  onClick={() => handleReturnFlightSelect(details)}
                >
                  <Typography variant="body1">{details.flightName}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>Price: {details.price}</Typography>
                  <Typography>Time: {details.departureTime}</Typography>

                  {expanded.return === index && returnFlight && (
                    <TicketStepper
                      selectedFlight={details}
                      seatLayout={details.layout}
                      seatCategories={details.seatCategories}
                      onTotalFare={handleTotalFareUpdate}
                      setSelectedSeats={setReturnSelectedSeats} // Correctly set selected return seats
                      bookedSeats={returnBookedSeats} // Pass the booked seats here
                      returnFlight={returnFlight}
                      outboundFlight={outboundFlight}
                    />
                  )}
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Typography>No return flights available</Typography>
          )}
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <Button
          disabled={!outboundFlight || !returnFlight}
          variant="contained"
          onClick={() => {
            if (
              outboundSelectedSeats.length > 0 &&
              returnSelectedSeats.length > 0
            ) {
              setShowMessage(true);
            } else {
              alert(
                "Please select seats for both outbound and return flights."
              );
            }
          }}
        >
          Confirm Booking
        </Button>
      </Box>

      <Snackbar
        open={showMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Your booking has been confirmed! Total Fare:{" "}
          {totalFare.outbound + totalFare.return}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RoundTripBooking;
