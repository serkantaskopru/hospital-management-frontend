// pages/StaffPage.js
import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";
import { Table, Button, Form, Modal, Alert } from "react-bootstrap";
import Layout from "../components/Layout";
const StaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "employee",
    identityNumber: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await axiosInstance.get("/api/staff");
      setStaff(response.data.data);
    } catch (err) {
      console.error("Failed to fetch staff:", err);
    }
  };

  const handleShow = (staff = null) => {
    if (staff) {
      setCurrentStaff(staff);
      setFormData({
        name: staff.User.Name,
        email: staff.User.Email,
        password: "",
        phone: staff.User.Phone,
        role: staff.Role,
        identityNumber: staff.IdentityNumber,
      });
      setIsEditing(true);
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        role: "employee",
        identityNumber: "",
      });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updateData = {};

    if (isEditing && currentStaff) {
      if (formData.name !== currentStaff.name) updateData.name = formData.name;
      if (formData.role !== currentStaff.role) updateData.role = formData.role;
      if (formData.identityNumber !== currentStaff.identityNumber)
        updateData.identityNumber = formData.identityNumber;
      if (formData.phone !== currentStaff.phone)
        updateData.phone = formData.phone;
      if (formData.email !== currentStaff.email)
        updateData.email = formData.email;
    }

    try {
      if (isEditing) {
        await axiosInstance.put(`/api/staff/${currentStaff.id}`, updateData);
      } else {
        await axiosInstance.post("/api/staff", formData);
      }
    } catch (error) {
      console.error("Failed to update staff:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      }
    }

    // @ts-ignore
    setFormData({
      name: "",
      role: "",
      identityNumber: "",
      phone: "",
      email: "",
    });
    setIsEditing(false);
    handleClose();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) {
      try {
        await axiosInstance.delete(`/api/staff/${id}`);
        fetchStaff();
      } catch (err) {
        console.error("Failed to delete staff:", err);
      }
    }
  };

  return (
    <Layout>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Alt Kullanıcılar</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group mr-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => handleShow()}
            >
              Yeni Kullanıcı Oluştur
            </button>
          </div>
        </div>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>İsim</th>
            <th>Email</th>
            <th>Telefon</th>
            <th>Yetki</th>
            <th>TC Kimlik</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((staffMember) => (
            <tr key={staffMember.id}>
              <td>{staffMember?.User?.Name}</td>
              <td>{staffMember?.User?.Email}</td>
              <td>{staffMember?.User?.Phone}</td>
              <td>
                {staffMember?.Role === "authorized" ? "Yetkili" : "Çalışan"}
              </td>
              <td>{staffMember?.IdentityNumber}</td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => handleShow(staffMember)}
                >
                  Düzenle
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(staffMember.id)}
                >
                  Sil
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit Staff" : "Add Staff"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={!isEditing}
              />
            </Form.Group>
            <Form.Group controlId="formPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formRole">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="employee">Employee</option>
                <option value="authorized">Authorized</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formIdentityNumber">
              <Form.Label>Identity Number</Form.Label>
              <Form.Control
                type="text"
                name="identityNumber"
                value={formData.identityNumber}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-4">
              {isEditing ? "Update Staff" : "Add Staff"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Layout>
  );
};

export default StaffPage;
