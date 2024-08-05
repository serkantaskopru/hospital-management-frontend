// pages/ResetPassword.js
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";

const ResetPassword = () => {
  const location = useLocation();
  console.log(location.state)
  const navigate = useNavigate();
  const [phone, setPhone] = useState(location.state?.phone || "");
  const [code, setCode] = useState(location.state?.reset_code || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Şifreler uyuşmuyor");
      return;
    }

    try {
      await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/auth/reset-password`,
        { phone, code, newPassword, confirmPassword }
      );
      setSuccess("Şifre başarıyla güncellendi");
      setError("");
      navigate("/");
    } catch (error) {
      setError("Şifre sıfırlama hatası");
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      }
    }
  };

  return (
    <div className="container min-vh-100 d-flex flex-column justify-content-center align-items-center">
      <h2>Şifremi Sıfırla</h2>
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <div style={{ minWidth: "50%" }}>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="phone" className="form-label">
              Telefon Numarası
            </label>
            <input
              type="text"
              className="form-control"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              disabled
            />
          </div>
          <div className="mb-3">
            <label htmlFor="code" className="form-label">
              Sıfırlama Kodu
            </label>
            <input
              type="text"
              className="form-control"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="newPassword" className="form-label">
              Yeni Şifre
            </label>
            <input
              type="password"
              className="form-control"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Yeni Şifre Tekrarı
            </label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Şifremi sıfırla
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
