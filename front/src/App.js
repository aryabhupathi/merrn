import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TicketReservationForm from "./Form/TicketForm";
import BusResults from "./Result/BusResult";
import TrainsResults from "./Result/TrainResult";
import FlightResults from "./Result/FlightResult";
import { AuthProvider } from "./authContext";
import Login from "./Login/Login";
import Signup from "./Login/Signup";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<TicketReservationForm />} />
          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<Signup />} />
          <Route path="/results/bus" element={<BusResults />} />
          <Route path="/results/train" element={<TrainsResults />} />
          <Route path="/results/flight" element={<FlightResults />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
