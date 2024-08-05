import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Polyclinic from "./pages/Polyclinic";
import Person from "./pages/Person";
import StaffPage from "./pages/StaffPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/poliklinik"
          element={<PrivateRoute element={<Polyclinic />} />}
        />
        <Route
          path="/personel"
          element={<PrivateRoute element={<Person />} />}
        />
        <Route
          path="/yetkili"
          element={<PrivateRoute element={<StaffPage />} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
