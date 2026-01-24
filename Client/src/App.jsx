import React from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Home from "./pages/user/Home";
import { Route, Routes, useLocation } from "react-router-dom";
import Cardetails from "./pages/user/Cardetails";
import Login from "./components/Login";
import Loading from "./components/Loading";
import CarList from "./pages/user/CarList";
import Mybooking from "./pages/user/Mybooking";
import BecomeOwner from "./pages/user/BecomeOwner";
import PaymentSuccess from "./pages/user/PaymentSuccess";
import PaymentCancel from "./pages/user/PaymentCancel";
import Dashboard from "./pages/owner/Dashboard";
import Addcars from "./pages/owner/Addcars";
import Managebookings from "./pages/owner/Managebookings";
import Managecar from "./pages/owner/Managecar";
import Footer from "./components/Footer";
import Owner from "./pages/owner/Owner";
import ProtectedOwnerRoute from "./components/ProtectedOwnerRoute";
import ProtectedUserRoute from "./components/ProtectedUserRoute";

const App = () => {
  const location = useLocation();

  // Pages where navbar and footer should be hidden
  const hideNavFooter = [
    "/dashboard",
    "/login",
    "/become-owner",
    "/payment-success",
    "/payment-cancel"
  ];

  const shouldHideNavFooter = hideNavFooter.some(path => location.pathname.includes(path));

  return (
    <>
      {/* Toast Notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10B981',
            },
          },
          error: {
            style: {
              background: '#EF4444',
            },
          },
        }}
      />

      {!shouldHideNavFooter && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/car-details/:id" element={<Cardetails />} />
        <Route path="/loading/:input" element={<Loading />} />
        <Route path="/car-list" element={<CarList />} />
        <Route path="/login" element={<Login />} />

        {/* Payment Routes (Protected) */}
        <Route element={<ProtectedUserRoute />}>
          <Route path="/my-bookings" element={<Mybooking />} />
          <Route path="/become-owner" element={<BecomeOwner />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancel" element={<PaymentCancel />} />
        </Route>

        {/* Protected Owner Routes */}
        <Route element={<ProtectedOwnerRoute />}>
          <Route path="/dashboard" element={<Owner />}>
            <Route index element={<Dashboard />} />
            <Route path="Add-car" element={<Addcars />} />
            <Route path="Manage-bookings" element={<Managebookings />} />
            <Route path="Manage-cars" element={<Managecar />} />
          </Route>
        </Route>
      </Routes>

      {!shouldHideNavFooter && <Footer />}
    </>
  );
};

export default App;
