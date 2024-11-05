// import React, { useState } from "react";
// import {
//   Box,
//   Button,
//   Checkbox,
//   FormControlLabel,
//   Step,
//   StepLabel,
//   Stepper,
//   Typography,
//   Snackbar,
//   Alert,
// } from "@mui/material";
// import Grid from "@mui/material/Grid2";

// const additionalProducts = [
//   { name: "Extra Baggage", price: 50 },
//   { name: "Meal Plan", price: 30 },
//   { name: "Priority Boarding", price: 20 },
// ];

// const TicketStepper = ({
//   selectedFlight,
//   outboundFlight,
//   returnFlight,
//   seatLayout,
//   seatCategories,
//   selectedSeats,
//   onTotalFare,
//   setSelectedSeats,
//   bookedSeats = [],
// }) => {
//   const steps = ["Select Seats", "Select Additionals", "Review"];
//   const [activeStep, setActiveStep] = useState(0);
//   const [selectedSeatSelections, setSelectedSeatSelections] = useState({});
//   const [additionalSelections, setAdditionalSelections] = useState({});
//   const [totalFare, setTotalFare] = useState(0);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [userLoginWarning, setUserLoginWarning] = useState(false);

//   console.log(outboundFlight, 'opppppppp');
//   console.log(returnFlight, 'rpppppppppppppppppp');
//   // Handle seat selection based on the selected flight
//   const handleSeatSelect = (seat) => {
//     const isSelected = Object.values(selectedSeatSelections)
//       .flat()
//       .includes(seat);
//     const rowMatch = seat.match(/^(\d+)/);
//     const rowIndex = rowMatch ? parseInt(rowMatch[1], 10) : null;
//     const seatCategory =
//       rowIndex !== null
//         ? seatCategories.find((category) => category.rows.includes(rowIndex))
//         : null;

//     if (!seatCategory) return;

//     const farePerSeat = seatCategory.price;

//     setSelectedSeatSelections((prev) => {
//       const updatedSeats = {
//         ...prev,
//         [farePerSeat]: isSelected
//           ? (prev[farePerSeat] || []).filter((s) => s !== seat)
//           : [...(prev[farePerSeat] || []), seat],
//       };

//       const newTotalFare = Object.entries(updatedSeats).reduce(
//         (total, [price, seats]) => total + price * seats.length,
//         0
//       );

//       setTotalFare(newTotalFare);
//       onTotalFare(newTotalFare);

//       setSelectedSeats((prev) => ({
//         ...prev,
//         [selectedFlight._id]: Object.values(updatedSeats).flat(),
//       }));

//       return updatedSeats;
//     });
//   };

//   // Handle additional selections
//   const handleAdditionalSelect = (product, price) => {
//     setAdditionalSelections((prev) => {
//       const isSelected = prev[product] !== undefined;
//       const newSelections = { ...prev };
//       if (isSelected) {
//         delete newSelections[product]; // Deselect product
//       } else {
//         newSelections[product] = price; // Select product
//       }

//       const additionalTotal = Object.values(newSelections).reduce(
//         (total, itemPrice) => total + itemPrice,
//         0
//       );
//       const total = totalFare + additionalTotal;
//       setTotalFare(total);
//       onTotalFare(total);
//       return newSelections;
//     });
//   };

//   const getSeatBorderColor = (seat) => {
//     const seatLabel = typeof seat === "string" ? seat : seat.label;
//     const rowIndex = parseInt(seatLabel.match(/\d+/)[0]) - 1;
//     const category = seatCategories.find((cat) => cat.rows.includes(rowIndex));
//     switch (category?.name) {
//       case "Business":
//         return "red";
//       case "First Class":
//         return "yellow";
//       case "Economy":
//         return "blue";
//       default:
//         return "gray";
//     }
//   };

// const handleConfirmBooking = async () => {
//     if (!outboundFlight || !returnFlight) {
//         alert("Please select both outbound and return flights before confirming the booking.");
//         return;
//     }

//     const outboundSeats = selectedSeats[outboundFlight._id] || [];
//     const returnSeats = selectedSeats[returnFlight._id] || [];

//     // Ensure seats are selected for both outbound and return flights
//     if (outboundSeats.length === 0 || returnSeats.length === 0) {
//         alert("Please select seats for both outbound and return flights.");
//         return;
//     }

//     const payload = {
//         outboundFlightId: outboundFlight._id,
//         returnFlightId: returnFlight._id,
//         outboundSeats,
//         returnSeats,
//         totalFare,
//         additionalSelections,
//     };

//     if (!payload.outboundFlightId || !payload.returnFlightId || payload.totalFare <= 0) {
//         alert("Both flights and valid fare are required.");
//         return;
//     }

//     // Logging to troubleshoot
//     console.log("Booking Payload:", payload);

//     try {
//         const response = await fetch("http://localhost:5000/api/flight/bookings", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(payload),
//         });

//         if (response.ok) {
//             const data = await response.json();
//             console.log("Booking confirmed:", data);
//             setSnackbarOpen(true);
//         } else {
//             const errorData = await response.json();
//             alert(`Error: ${errorData.message}`);
//         }
//     } catch (error) {
//         console.error("Error during booking:", error);
//         alert("An error occurred while confirming your booking. Please try again.");
//     }
// };
// const handleNext = () => {
//     if (activeStep === 0 && Object.values(selectedSeatSelections).flat().length === 0) {
//         alert("Please select at least one seat.");
//         return;
//     }
//     if (activeStep === steps.length - 1) {
        
//         handleConfirmBooking();
//     } else {
//         setActiveStep((prev) => prev + 1);
//     }
// };


//   const renderSeats = () => {
//     const columnCount = seatLayout.seatConfiguration[0].length;
//     const transposedLayout = Array(columnCount)
//       .fill()
//       .map((_, colIndex) =>
//         seatLayout.seatConfiguration.map((row) => row[colIndex])
//       );

//     return (
//       <Grid container spacing={2}>
//         <Box
//           display="flex"
//           flexDirection="column"
//           mt={2}
//           sx={{ overflow: "scroll" }}
//         >
//           {transposedLayout.map((seatColumn, columnIndex) => (
//             <Box
//               key={columnIndex}
//               display="flex"
//               flexDirection="row"
//               justifyContent="space-between"
//               mb={2}
//             >
//               {seatColumn.map((seat, rowIndex) => {
//                 const isSelected = Object.values(selectedSeatSelections)
//                   .flat()
//                   .includes(seat);
//                 const isBooked =
//                   Array.isArray(bookedSeats) && bookedSeats.includes(seat);
//                 return (
//                   <Box
//                     key={rowIndex}
//                     textAlign="center"
//                     width="60px"
//                     height="40px"
//                     border={`1px solid ${getSeatBorderColor(seat)}`}
//                     bgcolor={
//                       isSelected
//                         ? "lightgreen"
//                         : isBooked
//                         ? "lightgray"
//                         : "white"
//                     }
//                     onClick={() => !isBooked && handleSeatSelect(seat)}
//                     display="flex"
//                     alignItems="center"
//                     justifyContent="center"
//                     mx={1}
//                     borderRadius={1}
//                     sx={{
//                       cursor: isBooked ? "not-allowed" : "pointer",
//                       opacity: isBooked ? 0.5 : 1,
//                     }}
//                   >
//                     {seat}
//                   </Box>
//                 );
//               })}
//             </Box>
//           ))}
//         </Box>
//       </Grid>
//     );
//   };

//   const renderAdditionals = () => (
//     <Box>
//       {additionalProducts.map((product) => (
//         <Box key={product.name}>
//           <FormControlLabel
//             control={
//               <Checkbox
//                 checked={additionalSelections[product.name] !== undefined}
//                 onChange={() =>
//                   handleAdditionalSelect(product.name, product.price)
//                 }
//               />
//             }
//             label={`${product.name} - $${product.price}`}
//           />
//         </Box>
//       ))}
//     </Box>
//   );

//   const renderReview = () => (
//     <Box>
//       <Typography variant="h6">Review your selections</Typography>
//       <Typography variant="subtitle1">
//         Flight: {selectedFlight?.flightNumber || "N/A"}
//       </Typography>
//       <Typography variant="subtitle1">
//         Selected Seats:{" "}
//         {Object.values(selectedSeatSelections).flat().join(", ") || "None"}
//       </Typography>
//       <Typography variant="subtitle1">
//         Additional Selections:{" "}
//         {Object.keys(additionalSelections).length > 0
//           ? Object.keys(additionalSelections).join(", ")
//           : "None"}
//       </Typography>
//       <Typography variant="subtitle1">Total Fare: ${totalFare}</Typography>
//     </Box>
//   );

//   return (
//     <Box>
//       <Stepper activeStep={activeStep}>
//         {steps.map((label) => (
//           <Step key={label}>
//             <StepLabel>{label}</StepLabel>
//           </Step>
//         ))}
//       </Stepper>
//       <Box>
//         {activeStep === 0 && renderSeats()}
//         {activeStep === 1 && renderAdditionals()}
//         {activeStep === 2 && renderReview()}
//       </Box>
//       <Box>
//         <Button variant="contained" color="primary" onClick={handleNext}>
//           {activeStep === steps.length - 1 ? "Confirm Booking" : "Next"}
//         </Button>
//       </Box>
//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={6000}
//         onClose={() => setSnackbarOpen(false)}
//       >
//         <Alert onClose={() => setSnackbarOpen(false)} severity="success">
//           Booking confirmed successfully!
//         </Alert>
//       </Snackbar>
//       <Snackbar
//         open={userLoginWarning}
//         autoHideDuration={6000}
//         onClose={() => setUserLoginWarning(false)}
//       >
//         <Alert onClose={() => setUserLoginWarning(false)} severity="warning">
//           You must be logged in to confirm your booking.
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default TicketStepper;

import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Step,
  StepLabel,
  Stepper,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

const additionalProducts = [
  { name: "Extra Baggage", price: 50 },
  { name: "Meal Plan", price: 30 },
  { name: "Priority Boarding", price: 20 },
];

const TicketStepper = ({
  selectedFlight,
  outboundFlight,
  returnFlight,
  seatLayout,
  seatCategories,
  selectedSeats,
  onTotalFare,
  setSelectedSeats,
  bookedSeats = [],
}) => {
  const steps = ["Select Seats", "Select Additionals", "Review"];
  const [activeStep, setActiveStep] = useState(0);
  const [selectedSeatSelections, setSelectedSeatSelections] = useState({});
  const [additionalSelections, setAdditionalSelections] = useState({});
  const [totalFare, setTotalFare] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [userLoginWarning, setUserLoginWarning] = useState(false);

  // Check if outboundFlight and returnFlight are defined
  if (!outboundFlight || !returnFlight) {
    return <Typography variant="body1">Loading flight information...</Typography>;
  }
// Inside TicketStepper component

const handleSeatSelect = (seat) => {
    const isSelected = Object.values(selectedSeatSelections)
        .flat()
        .includes(seat);
    const rowMatch = seat.match(/^(\d+)/);
    const rowIndex = rowMatch ? parseInt(rowMatch[1], 10) : null;
    const seatCategory =
        rowIndex !== null
            ? seatCategories.find((category) => category.rows.includes(rowIndex))
            : null;

    if (!seatCategory) return;

    const farePerSeat = seatCategory.price;

    setSelectedSeatSelections((prev) => {
        const updatedSeats = {
            ...prev,
            [farePerSeat]: isSelected
                ? (prev[farePerSeat] || []).filter((s) => s !== seat)
                : [...(prev[farePerSeat] || []), seat],
        };

        const newTotalFare = Object.entries(updatedSeats).reduce(
            (total, [price, seats]) => total + price * seats.length,
            0
        );

        setTotalFare(newTotalFare);
        onTotalFare(newTotalFare);

        setSelectedSeats((prev) => ({
            ...prev,
            [selectedFlight._id]: {
                outbound: prev[selectedFlight._id]?.outbound || [],
                return: prev[selectedFlight._id]?.return || [],
                selectedSeats: Object.values(updatedSeats).flat(),
            },
        }));

        return updatedSeats;
    });
};

// Confirm booking logic
const handleConfirmBooking = async () => {
    const outboundSeats = selectedSeats[outboundFlight._id]?.outbound || [];
    const returnSeats = selectedSeats[returnFlight._id]?.return || [];

    // Ensure seats are selected for both outbound and return flights
    if (outboundSeats.length === 0 || returnSeats.length === 0) {
        alert("Please select seats for both outbound and return flights.");
        return;
    }

    const payload = {
        outboundFlightId: outboundFlight._id,
        returnFlightId: returnFlight._id,
        outboundSeats,
        returnSeats,
        totalFare,
        additionalSelections,
    };

    // The rest of the confirm booking logic...
};

  // Handle additional selections
  const handleAdditionalSelect = (product, price) => {
    setAdditionalSelections((prev) => {
      const isSelected = prev[product] !== undefined;
      const newSelections = { ...prev };

      if (isSelected) {
        delete newSelections[product]; // Deselect product
      } else {
        newSelections[product] = price; // Select product
      }

      const additionalTotal = Object.values(newSelections).reduce(
        (total, itemPrice) => total + itemPrice,
        0
      );
      const total = totalFare + additionalTotal;
      setTotalFare(total);
      onTotalFare(total);
      return newSelections;
    });
  };

  const getSeatBorderColor = (seat) => {
    const seatLabel = typeof seat === "string" ? seat : seat.label;
    const rowIndex = parseInt(seatLabel.match(/\d+/)[0]) - 1;
    const category = seatCategories.find((cat) => cat.rows.includes(rowIndex));
    switch (category?.name) {
      case "Business":
        return "red";
      case "First Class":
        return "yellow";
      case "Economy":
        return "blue";
      default:
        return "gray";
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && Object.values(selectedSeatSelections).flat().length === 0) {
      alert("Please select at least one seat.");
      return;
    }
    if (activeStep === steps.length - 1) {
      handleConfirmBooking();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const renderSeats = () => {
    if (!seatLayout || !seatLayout.seatConfiguration) {
      return <Typography variant="body1">Loading seat layout...</Typography>;
    }

    const columnCount = seatLayout.seatConfiguration[0].length;
    const transposedLayout = Array(columnCount)
      .fill()
      .map((_, colIndex) =>
        seatLayout.seatConfiguration.map((row) => row[colIndex])
      );

    return (
      <Grid container spacing={2}>
        <Box display="flex" flexDirection="column" mt={2} sx={{ overflow: "scroll" }}>
          {transposedLayout.map((seatColumn, columnIndex) => (
            <Box key={columnIndex} display="flex" flexDirection="row" justifyContent="space-between" mb={2}>
              {seatColumn.map((seat, rowIndex) => {
                const isSelected = Object.values(selectedSeatSelections).flat().includes(seat);
                const isBooked = Array.isArray(bookedSeats) && bookedSeats.includes(seat);
                return (
                  <Box
                    key={rowIndex}
                    textAlign="center"
                    width="60px"
                    height="40px"
                    border={`1px solid ${getSeatBorderColor(seat)}`}
                    bgcolor={isSelected ? "lightgreen" : isBooked ? "lightgray" : "white"}
                    onClick={() => !isBooked && handleSeatSelect(seat)}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mx={1}
                    borderRadius={1}
                    sx={{
                      cursor: isBooked ? "not-allowed" : "pointer",
                      opacity: isBooked ? 0.5 : 1,
                    }}
                  >
                    {seat}
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>
      </Grid>
    );
  };

  const renderAdditionals = () => (
    <Box>
      {additionalProducts.map((product) => (
        <Box key={product.name}>
          <FormControlLabel
            control={
              <Checkbox
                checked={additionalSelections[product.name] !== undefined}
                onChange={() => handleAdditionalSelect(product.name, product.price)}
              />
            }
            label={`${product.name} - $${product.price}`}
          />
        </Box>
      ))}
    </Box>
  );

  const renderReview = () => (
    <Box>
      <Typography variant="h6">Review your selections</Typography>
      <Typography variant="subtitle1">Flight: {selectedFlight?.flightNumber || "N/A"}</Typography>
      <Typography variant="subtitle1">
        Selected Seats: {Object.values(selectedSeatSelections).flat().join(", ") || "None"}
      </Typography>
      <Typography variant="subtitle1">
        Additional Selections: {Object.keys(additionalSelections).length > 0 ? Object.keys(additionalSelections).join(", ") : "None"}
      </Typography>
      <Typography variant="subtitle1">Total Fare: ${totalFare}</Typography>
    </Box>
  );

  return (
    <Box>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box>
        {activeStep === 0 && renderSeats()}
        {activeStep === 1 && renderAdditionals()}
        {activeStep === 2 && renderReview()}
      </Box>
      <Box>
        <Button variant="contained" color="primary" onClick={handleNext}>
          {activeStep === steps.length - 1 ? "Confirm Booking" : "Next"}
        </Button>
      </Box>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          Booking confirmed successfully!
        </Alert>
      </Snackbar>
      <Snackbar open={userLoginWarning} autoHideDuration={6000} onClose={() => setUserLoginWarning(false)}>
        <Alert onClose={() => setUserLoginWarning(false)} severity="warning">
          You must be logged in to confirm your booking.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TicketStepper;
