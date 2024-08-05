// pages/Polyclinic.js
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import PolyclinicModal from "../components/PolyclinicModal";
import axiosInstance from "../axiosConfig";
import { Table } from "react-bootstrap";
const Polyclinic = () => {
  const [showModal, setShowModal] = useState(false);
  const [polyclinics, setPolyclinics] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [staffCounts, setStaffCounts] = useState({});
  const [error, setError] = useState("");
  const fetchPolyclinics = async () => {
    try {
      const response = await axiosInstance.get("/api/polyclinics");
      console.log(response.data);
      setPolyclinics(response.data);
    } catch (error) {
      console.error("Error fetching polyclinics:", error);
    }
  };

  const fetchTableData = async () => {
    try {
      const response = await axiosInstance.get("/api/hospitalclinics");
      setClinics(response.data.clinics);
      console.log(clinics);
    } catch (error) {
      console.error("Error fetching clinic data", error);
      setError("Klinikler alınırken hata oluştu");
    }
  };

  useEffect(() => {
    handleTableUpdate();
  }, []);

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleTableUpdate = () => {
    fetchTableData();
  };
  return (
    <Layout>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Poliklinik</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group mr-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setShowModal(true)}
            >
              Yeni Poliklinik Oluştur
            </button>
          </div>
        </div>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Klinik</th>
            <th>Personel Sayısı</th>
            <th>Meslek Grupları</th>
          </tr>
        </thead>
        <tbody>
          {clinics.map((clinic) => (
            <tr key={clinic.ID}>
              <td>{clinic?.polyclinic}</td>
              <td>{clinic?.personCount}</td>
              <td>
                {clinic?.jobGroups?.map((jobGroup) => (
                  <tr key={jobGroup.id}>
                    <td>{jobGroup?.name}:</td>
                    <td>{jobGroup?.count}</td>
                  </tr>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <PolyclinicModal
        show={showModal}
        handleClose={handleModalClose}
        updateTable={handleTableUpdate}
      />
    </Layout>
  );
};

export default Polyclinic;
