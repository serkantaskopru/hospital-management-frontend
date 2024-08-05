// pages/ForgotPassword.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";

const ForgotPassword = () => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [resetCode, setResetCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/auth/request-password-reset`,
        { phone }
      );
      setResetCode(response.data.reset_code);
      const reset_code = response.data.reset_code;
      navigate("/reset-password", { state: { phone, reset_code } });
    } catch (error) {
      setError("Şifre sıfırlama isteği hatası");
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      }
    }
  };

  return (
    <div className="container min-vh-100 d-flex flex-column justify-content-center align-items-center">
      <h2>Şifremi Unuttum</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div style={{ minWidth: "50%" }}>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="phone" className="form-label">
              Telefon Numaranız
            </label>
            <input
              type="text"
              className="form-control"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Sıfırlama kodu iste
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
