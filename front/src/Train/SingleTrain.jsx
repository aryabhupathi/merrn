import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Snackbar,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import jsPDF from "jspdf";
import { useLocation } from "react-router-dom";
import { train } from "../data"; // Assuming this is your train data
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const SingleTrain = () => {
  const location = useLocation();
  const { formData } = location.state;
  const [trips, setTrips] = useState([]);
  const [outboundPassengerCount, setOutboundPassengerCount] = useState({});
  const [outboundReservations, setOutboundReservations] = useState([]);
  const [outboundTotalFare, setOutboundTotalFare] = useState(0);
  const [outboundSnackbarOpen, setOutboundSnackbarOpen] = useState(false);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDownloadButton, setShowDownloadButton] = useState(false);
  const [reservedCoaches, setReservedCoaches] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const initialOutboundCounts = {};
    train.forEach((train) => {
      train.coaches.forEach((coach) => {
        initialOutboundCounts[`${train.trainName}-${coach.coachName}`] = 0;
      });
    });
    setOutboundPassengerCount(initialOutboundCounts);
  }, []);

  useEffect(() => {
    const fetchTrainData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/train/search?source=${formData.source}&destination=${formData.destination}`
        );
        if (!response.ok) {
          throw new Error("Error fetching trains");
        }
        const data = await response.json();
        setTrips(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchTrainData();
  }, [formData.source, formData.destination]);

  const incrementCount = (trainName, coachName, fare, noOfSeatsAvailable) => {
    const currentCount =
      outboundPassengerCount[`${trainName}-${coachName}`] || 0;
    if (currentCount >= noOfSeatsAvailable) {
      return; // Exit early if no more seats are available
    }

    // Update outboundPassengerCount state
    setOutboundPassengerCount((prev) => ({
      ...prev,
      [`${trainName}-${coachName}`]: currentCount + 1,
    }));

    // Update total fare
    setOutboundTotalFare((prevTotal) => prevTotal + fare);
  };

  const decrementCount = (trainName, coachName, fare) => {
    setOutboundPassengerCount((prev) => {
      const currentCount = prev[`${trainName}-${coachName}`] || 0;
      if (currentCount > 0) {
        setOutboundTotalFare((prevTotal) => prevTotal - fare); // Deduct fare only if decrementing
        return { ...prev, [`${trainName}-${coachName}`]: currentCount - 1 };
      }
      return prev;
    });
  };

  // const handleReserve = async (train) => {
  //   const newReservations = {};
  //   const newReservedCoaches = { ...reservedCoaches };
  
  //   let hasUpdatedSeats = false; // To track if any coach was updated
  
  //   // Track updated trips
  //   const updatedTrips = trips.map((trip) => {
  //     if (trip.trainName === train.trainName) {
  //       // Loop over each coach and update available seats
  //       const updatedCoaches = trip.coaches.map(async (coach) => {
  //         const count =
  //           outboundPassengerCount[`${trip.trainName}-${coach.coachName}`] || 0;
  
  //         if (count > 0) {
  //           const totalFareForCoach = count * coach.fare;
  //           newReservations[`${trip.trainName}-${coach.coachName}`] = {
  //             trainName: trip.trainName,
  //             coachName: coach.coachName,
  //             count,
  //             totalFareForCoach,
  //           };
  //           newReservedCoaches[`${trip.trainName}-${coach.coachName}`] = true;
  
  //           // Calculate new available seats
  //           const updatedSeats = coach.noOfSeatsAvailable - count;
  
  //           // Ensure seats do not go negative
  //           if (updatedSeats >= 0) {
  //             // Call API to update the seats in the database
  //            updateSeatsInDatabase(
  //               trip.trainName,
  //               coach.coachName,
  //               updatedSeats
  //             );
  
  //             hasUpdatedSeats = true; // Mark as updated
  //             return {
  //               ...coach,
  //               noOfSeatsAvailable: updatedSeats, // Update available seats in UI
  //             };
  //           }
  //         }
  
  //         return coach;
  //       });
  
  //       return { ...trip, coaches: updatedCoaches };
  //     }
  //     return trip;
  //   });
  
  //   if (hasUpdatedSeats) {
  //     setTrips(updatedTrips); // Update trips state with new available seats
  //     setOutboundReservations((prev) => [
  //       ...prev,
  //       ...Object.values(newReservations),
  //     ]);
  //     setReservedCoaches(newReservedCoaches);
  //     setOutboundSnackbarOpen(true);
  //     setIsModalOpen(true);
  
  //     // Reset seat count after reservation
  //     const resetCounts = { ...outboundPassengerCount };
  //     train.coaches.forEach((coach) => {
  //       resetCounts[`${train.trainName}-${coach.coachName}`] = 0;
  //     });
  //     setOutboundPassengerCount(resetCounts); // Reset seat counts
  //   } else {
  //     alert("Please select at least 1 passenger.");
  //   }
  // };
  
  const handleReserve = async (train) => {
    const newReservations = {};
    const newReservedCoaches = { ...reservedCoaches };
  
    let hasUpdatedSeats = false; // To track if any coach was updated
  
    // Track updated trips
    const updatedTrips = await Promise.all(
      trips.map(async (trip) => {
        if (trip.trainName === train.trainName) {
          // Loop over each coach and update available seats
          const updatedCoaches = await Promise.all(
            trip.coaches.map(async (coach) => {
              const count =
                outboundPassengerCount[`${trip.trainName}-${coach.coachName}`] ||
                0;
  
              if (count > 0) {
                const totalFareForCoach = count * coach.fare;
                newReservations[`${trip.trainName}-${coach.coachName}`] = {
                  trainName: trip.trainName,
                  coachName: coach.coachName,
                  count,
                  totalFareForCoach,
                };
                newReservedCoaches[`${trip.trainName}-${coach.coachName}`] = true;
  
                // Calculate new available seats
                const updatedSeats = coach.noOfSeatsAvailable - count;
  
                // Ensure seats do not go negative
                if (updatedSeats >= 0) {
                  // Call API to update the seats in the database
                  await updateSeatsInDatabase(
                    trip.trainName,
                    coach.coachName,
                    updatedSeats
                  );
  
                  hasUpdatedSeats = true; // Mark as updated
                  return {
                    ...coach,
                    noOfSeatsAvailable: updatedSeats, // Update available seats in UI
                  };
                }
              }
  
              return coach;
            })
          );
  
          return { ...trip, coaches: updatedCoaches };
        }
        return trip;
      })
    );
  
    if (hasUpdatedSeats) {
      setTrips(updatedTrips); // Update trips state with new available seats
      setOutboundReservations((prev) => [
        ...prev,
        ...Object.values(newReservations),
      ]);
      setReservedCoaches(newReservedCoaches);
      setOutboundSnackbarOpen(true);
      setIsModalOpen(true);
  
      // Reset seat count after reservation
      const resetCounts = { ...outboundPassengerCount };
      train.coaches.forEach((coach) => {
        resetCounts[`${train.trainName}-${coach.coachName}`] = 0;
      });
      setOutboundPassengerCount(resetCounts); // Reset seat counts
    } else {
      alert("Please select at least 1 passenger.");
    }
  };
  
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

      const result = await response.json();

      if (!response.ok) {
        console.error("Failed to update seats:", result.message);
      }
    } catch (error) {
      console.error("Error updating seats in database:", error);
    }
  };

  const handleCloseSnackbar = () => {
    setOutboundSnackbarOpen(false);
  };

  const handleConfirmBooking = () => {
    setIsModalOpen(false);
    setShowDownloadButton(true);
    setSuccessSnackbarOpen(true);
    setTimeout(() => setSuccessSnackbarOpen(false), 2000);
    setShowDownloadButton(true);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Reservation Details", 20, 20);

    outboundReservations.forEach((reservation, index) => {
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
    resetState();
  };

  const resetState = () => {
    setOutboundPassengerCount({});
    setOutboundReservations([]);
    setOutboundTotalFare(0);
    setReservedCoaches({});
  };

  const renderTrip = () => {
    return trips.map((train, index) => (
      <Accordion key={index}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ color: "blue", fontWeight: "bold" }}>
            {train.trainName}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              backgroundColor: "#f9f9f9",
              border: "1px solid lightgray",
              borderRadius: "4px",
              padding: 2,
            }}
          >
            <Typography variant="body1" sx={{ color: "red" }}>
              Route: {train.source} to {train.destination}
            </Typography>
            <Typography variant="body1" sx={{ color: "green" }}>
              Timings: {train.startTime} -- {train.endTime}
            </Typography>
            <Typography variant="body1" sx={{ color: "orange" }}>
              Stops: {train.stops.join(", ")}
            </Typography>

            <Grid container spacing={2}>
              {train.coaches.map((coach, coachIndex) => (
                <Grid item xs={12} sm={6} md={2} key={coachIndex}>
                  <Box
                    sx={{
                      backgroundColor: "#f0f4ff",
                      padding: 2,
                      borderRadius: "8px",
                      height: "150px",
                    }}
                  >
                    <Typography variant="h6">{coach.coachName}</Typography>
                    <Typography>Seats: {coach.noOfSeatsAvailable}</Typography>
                    <Typography>Fare: ${coach.fare}</Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 2,
                      }}
                    >
                      <Button
                        onClick={() =>
                          incrementCount(
                            train.trainName,
                            coach.coachName,
                            coach.fare,
                            coach.noOfSeatsAvailable
                          )
                        }
                      >
                        <AddIcon fontSize="small" />
                      </Button>
                      <Typography>
                        {
                          outboundPassengerCount[
                            `${train.trainName}-${coach.coachName}`
                          ]
                        }
                      </Typography>
                      <Button
                        onClick={() =>
                          decrementCount(
                            train.trainName,
                            coach.coachName,
                            coach.fare
                          )
                        }
                      >
                        <RemoveIcon fontSize="small" />
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Typography variant="h5" sx={{ textAlign: "center", mt: 4 }}>
              Total Fare: ${outboundTotalFare}
            </Typography>

            <Box sx={{ textAlign: "center", mt: 4 }}>
              {!showDownloadButton ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleReserve(train)}
                  disabled={
                    reservedCoaches[`${train.trainName}-${train.coachName}`]
                  }
                >
                  Reserve Seats
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => downloadPDF()}
                  disabled={
                    reservedCoaches[`${train.trainName}-${train.coachName}`]
                  }
                >
                  Download
                </Button>
              )}
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    ));
  };

  return (
    <Box
      sx={{
        backgroundImage:
          "url(../../train.jpg)" /* Replace with your image path */,
        backgroundSize: "cover" /* Ensure the image covers the entire area */,
        backgroundRepeat: "no-repeat" /* Prevent repeating the image */,
        backgroundPosition: "center" /* Center the image */,
        backgroundAttachment: "fixed" /* Make the background fixed */,
        minHeight:
          "100vh" /* Ensure the container is at least the height of the viewport */,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          background:
            "linear-gradient(to right, violet, indigo, blue, green, yellow, orange, red)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textAlign: "center",
          margin: 0,
          paddingTop: 2,
        }}
      >
        Available Trains from {formData.source} to {formData.destination}
      </Typography>
      <Box>
        {renderTrip()}

        <Snackbar
          open={outboundSnackbarOpen}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          message="Tickets reserved successfully!"
        />
        <Snackbar
          open={successSnackbarOpen}
          message="Booking confirmed successfully!"
          autoHideDuration={2000}
        />
        {error && <Snackbar
          open={successSnackbarOpen}
          message="aagu voi"
          autoHideDuration={2000}
        />}
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <DialogTitle>Confirm Outbound Booking</DialogTitle>
          <DialogContent>
            {outboundReservations.length > 0 ? (
              outboundReservations.map((reservation, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="h6">{reservation.trainName}</Typography>
                  <Typography>Coach: {reservation.coachName}</Typography>
                  <Typography>Passengers: {reservation.count}</Typography>
                  <Typography>
                    Total Fare: ${reservation.totalFareForCoach}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography>No reservations found.</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmBooking}>Confirm</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default SingleTrain;
