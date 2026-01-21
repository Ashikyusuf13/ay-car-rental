import React from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/user/Home";
import { Route, Routes, useLocation } from "react-router-dom";
import Cardetails from "./pages/user/Cardetails";
import Login from "./components/Login";
import Loading from "./components/Loading";
import CarList from "./pages/user/CarList";
import Mybooking from "./pages/user/Mybooking";
import Dashboard from "./pages/owner/Dashboard";
import Addcars from "./pages/owner/Addcars";
import Managebookings from "./pages/owner/Managebookings";
import Managecar from "./pages/owner/Managecar";
import Footer from "./components/Footer";
import Owner from "./pages/owner/Owner";

const App = () => {
  const location = useLocation();

  return (
    <>
      {!(
        location.pathname.includes("/dashboard") ||
        location.pathname.includes("/login")
      ) && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/car-details/:id" element={<Cardetails />} />
        <Route path="/loading/:input" element={<Loading />} />
        <Route path="/car-list" element={<CarList />} />
        <Route path="/my-bookings" element={<Mybooking />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Owner />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="Add-car" element={<Addcars />} />
          <Route path="Manage-bookings" element={<Managebookings />} />
          <Route path="Manage-cars" element={<Managecar />} />
        </Route>
      </Routes>

      {!(
        location.pathname.includes("/dashboard") ||
        location.pathname.includes("/login")
      ) && <Footer />}
    </>
  );
};

export default App;
