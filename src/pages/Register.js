// pages/Register.js
import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [taxNumber, setTaxNumber] = useState("");
  const [identityNumber, setIdentityNumber] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [hospitalMail, setHospitalMail] = useState("");
  const [hospitalPhone, setHospitalPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState(0);
  const [district, setDistrict] = useState(0);
  const [error, setError] = useState("");

  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    axiosInstance
      .get(`${process.env.REACT_APP_API_URL}/cities`)
      .then((v) => {
        setCities(v.data);
        console.log(v);
      })
      .catch(() => {});
  }, []);

  const handleCityChange = (event) => {
    const cityId = event.target.value;
    setCity(cityId);
    setDistrict(0);
    axiosInstance
      .get(`${process.env.REACT_APP_API_URL}/cities/${cityId}/districts`)
      .then((v) => {
        setDistricts(v.data);
        console.log(v);
      })
      .catch(() => {});
  };

  const handleDistrictChange = (event) => {
    const districtId = event.target.value;
    setDistrict(districtId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/auth/register`,
        {
          name,
          email,
          password,
          phone,
          taxNumber,
          hospitalName,
          hospitalMail,
          hospitalPhone,
          address,
          city,
          district,
          identityNumber,
        }
      );
      nav("/");
    } catch (error) {
      setError("Kullanıcı oluşturulamadı");
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      }
    }
  };

  return (
    <div className="container min-vh-100 justify-content-center align-items-center d-flex flex-column">
      <h2 className="mb-3">KAYIT OL</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="" style={{ minWidth: "70%" }}>
        <form onSubmit={handleSubmit} className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h3>Hastane Bilgileri</h3>
                <div className="mb-2">
                  <label htmlFor="hospitalName" className="form-label">
                    Hastane Adı
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="hospitalName"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    required
                  />
                </div><div className="mb-2">
                  <label htmlFor="taxNumber" className="form-label">
                    Vergi No
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="taxNumber"
                    value={taxNumber}
                    onChange={(e) => setTaxNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="hospitalMail" className="form-label">
                    Mail Adresi
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="hospitalMail"
                    value={hospitalMail}
                    onChange={(e) => setHospitalMail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="hospitalPhone" className="form-label">
                    Telefon Numarası
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="hospitalPhone"
                    value={hospitalPhone}
                    onChange={(e) => setHospitalPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="city" className="form-label">
                    İl
                  </label>
                  <select
                    className="form-control form-select"
                    id="city"
                    onChange={handleCityChange}
                    required
                  >
                    <option value="">Seçiniz</option>
                    {cities.map((city) => (
                      <option value={city.ID} key={city.ID}>
                        {city.Name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label htmlFor="district" className="form-label">
                    İlçe
                  </label>
                  <select
                    className="form-control form-select"
                    id="district"
                    value={district}
                    onChange={handleDistrictChange}
                    required
                  >
                    <option value="">Seçiniz</option>
                    {districts.map((district) => (
                      <option value={district.ID} key={district.ID}>
                        {district.Name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label htmlFor="address" className="form-label">
                    Adres
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h3>Yetkili Bilgileri</h3>
                <div className="mb-2">
                  <label htmlFor="name" className="form-label">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="email" className="form-label">
                    Mail Adresi
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="identityNumber" className="form-label">
                    TC Kimlik No
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="identityNumber"
                    value={identityNumber}
                    onChange={(e) => setIdentityNumber(e.target.value)}
                    maxLength={11}
                    required
                  />
                </div>
                <div className="mb-2">
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
                  />
                </div>
                <div className="mb-2">
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
              </div>
            </div>
          </div>
          <div className="col-12 justify-content-center d-flex">
            <button type="submit" className="btn btn-primary mt-3 px-5">
              Kayıt Ol
            </button>
          </div>
        </form>
        <div className="mb-3">
          <a href="/">Zaten üye misin? Giriş Yap</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
