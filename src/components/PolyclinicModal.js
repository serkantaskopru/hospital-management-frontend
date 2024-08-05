// components/PolyclinicModal.js
import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";
import { Button, Form, Modal } from "react-bootstrap";
const PolyclinicModal = ({ show, handleClose, updateTable }) => {
  const [polyclinics, setPolyclinics] = useState([]);
  const [selectedPolyclinic, setSelectedPolyclinic] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    if (show) {
      axiosInstance
        .get("/api/polyclinics")
        .then((response) => setPolyclinics(response.data))
        .catch((error) => console.error("Error fetching polyclinics:", error));
      console.log(polyclinics);
    }
  }, [show]);

  const handleSubmit = (event) => {
    event.preventDefault();
    axiosInstance
      .post("/api/hospitalclinics/create", { polyclinicId: selectedPolyclinic })
      .then(() => {
        handleClose();
        updateTable();
      })
      .catch((error) => {
        console.error("Error adding polyclinic:", error);
        if (error.response && error.response.data && error.response.data.error) {
          setError(error.response.data.error);
        }
      });
  };
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Yeni Poliklinik</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formIdentityNumber">
            <Form.Label>Poliklinik Seçin</Form.Label>
            <select
              id="polyclinicSelect"
              className="form-control form-select"
              value={selectedPolyclinic}
              onChange={(e) => setSelectedPolyclinic(e.target.value)}
            >
              <option value="">Seçiniz...</option>
              {polyclinics.map((polyclinic) => (
                <option key={polyclinic.ID} value={polyclinic.ID}>
                  {polyclinic.Name}
                </option>
              ))}
            </select>
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-4">
            Oluştur
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default PolyclinicModal;
