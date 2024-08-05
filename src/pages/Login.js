// pages/Login.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";

const Login = () => {
  const nav = useNavigate();
  const [identifier, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      if (token) {
        axiosInstance
          .get(`${process.env.REACT_APP_API_URL}/auth/verify-token`)
          .then(() => {
            window.location.href = '/poliklinik';
          })
          .catch(() => {});
      }
    };

    checkToken();
  }, []);

  const setUserData = async () => {
    axiosInstance
      .get(`${process.env.REACT_APP_API_URL}/api/protected`)
      .then((c) => {
        console.log(c);
        localStorage.setItem("user", JSON.stringify(c.data?.user));
      })
      .catch(() => {});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        { identifier, password }
      );
      const token = response.data.token;
      localStorage.clear();
      localStorage.setItem("token", token);
      setUserData();
      setTimeout(function(){
        window.location.href = '/poliklinik';
      },1000)
    } catch (error) {
      setError("Geçersiz kullanıcı veya şifre");
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      }
    }
  };

  return (
    <div className="container min-vh-100 justify-content-center align-items-center d-flex flex-column">
      <h2>Giriş Yap</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div style={{ minWidth: "50%" }}>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="identifier" className="form-label">
              E-posta veya Telefon
            </label>
            <input
              type="identifier"
              className="form-control"
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentity(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Şifre
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3 d-flex w-100 justify-content-between">
            <a href="/register">Yeni üyelik oluştur</a>
            <a href="/forgot-password">Şifremi unuttum</a>
          </div>
          <button type="submit" className="btn btn-primary">
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
