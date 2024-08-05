// pages/Person.js
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import axiosInstance from "../axiosConfig";
import { Button, Form, Modal } from "react-bootstrap";

const Person = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    identityNumber: "",
    phone: "",
    jobGroupId: "",
    titleId: "",
    hospitalClinicId: "",
  });
  const [jobGroups, setJobGroups] = useState([]);
  const [titles, setTitles] = useState([]);
  const [filterTitles, setFilterTitles] = useState([]);
  const [hospitalClinics, setHospitalClinics] = useState([]);
  const [personnels, setPersonnels] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    identityNumber: "",
    jobGroupId: "",
    titleId: "",
  });
  const [totalPages, setTotalPages] = useState(1);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    if (name === "jobGroupId") {
      try {
        const response = axiosInstance
          .get(`/api/titles/${value}`)
          .then((response) => {
            setFilterTitles(response.data);
          })
          .catch((error) =>
            console.error("Error fetching filter titles:", error)
          );
      } catch (error) {
        console.error("Error fetching titles:", error);
      }
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const fetchPersonnels = async () => {
    try {
      axiosInstance
        .get("/api/persons", {
          params: {
            page: currentPage,
            limit: 10,
            firstName: filters.firstName,
            lastName: filters.lastName,
            identityNumber: filters.identityNumber,
            jobGroupId: filters.jobGroupId,
            titleId: filters.titleId,
          },
        })
        .then((response) => {
          setPersonnels(response.data.data);
          setTotalPages(response.data.totalPages);
        })
        .catch((error) => console.error("Error fetching persons:", error));
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };
  const fetchDatas = async () => {
    try {
      const [jobGroupsRes, hospitalClinicsRes] = await Promise.all([
        axiosInstance.get("/api/jobgroups"),
        axiosInstance.get("/api/hospitalclinics"),
      ]);

      setJobGroups(jobGroupsRes.data);
      setHospitalClinics(hospitalClinicsRes.data.clinics);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchDatas();
  }, []);

  useEffect(() => {
    fetchPersonnels();
  }, [currentPage, filters]);

  useEffect(() => {
    axiosInstance
      .get(`/api/titles/${formData.jobGroupId}`)
      .then((response) => setTitles(response.data))
      .catch((error) => console.error("Error fetching persons:", error));
  }, [formData.jobGroupId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "jobGroupId") {
      const selectedGroup = jobGroups.find((group) => group.ID == value);
      console.log(selectedGroup);
      axiosInstance
        .get(`/api/titles/${selectedGroup.ID}`)
        .then((response) => setTitles(response.data))
        .catch((error) => console.error("Error fetching persons:", error));
    }
  };

  const handleDelete = async (personId) => {
    if (window.confirm("Bu personeli silmek istediğinize emin misiniz?")) {
      try {
        await axiosInstance.delete(`/api/persons/${personId}`);
        fetchPersonnels();
      } catch (error) {
        console.error("Error deleting person:", error);
      }
    }
  };
  const handleEdit = (person) => {
    setFormData({
      firstName: person.FirstName,
      lastName: person.LastName,
      identityNumber: person.IdentityNumber,
      phone: person.Phone,
      jobGroupId: person.JobGroup?.ID || "",
      titleId: person.Title?.ID || "",
      hospitalClinicId: person.HospitalClinic?.ID || "",
    });
    setShowModal(true);
    setEditingPersonId(person.ID);
  };

  const [editingPersonId, setEditingPersonId] = useState(null);
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const jobGroupId = formData.get("jobGroupId");
    const titleId = formData.get("titleId");
    const hospitalClinicId = formData.get("hospitalClinicId");

    if (jobGroupId) {
      formData.set("jobGroupId", parseInt(jobGroupId, 10));
    }
    if (titleId) {
      formData.set("titleId", parseInt(titleId, 10));
    }
    if (hospitalClinicId) {
      formData.set("hospitalClinicId", parseInt(hospitalClinicId, 10));
    }

    try {
      if (editingPersonId) {
        await axiosInstance.put(`/api/persons/${editingPersonId}`, formData);
      } else {
        await axiosInstance.post("/api/persons", formData);
      }
      setShowModal(false);
      setFormData({
        firstName: "",
        lastName: "",
        identityNumber: "",
        phone: "",
        jobGroupId: "",
        titleId: "",
        hospitalClinicId: "",
      });
      setError("");
      fetchPersonnels();
      setEditingPersonId(null);
    } catch (error) {
      console.error("Error saving person", error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      }
    }
  };
  return (
    <Layout>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Personeller</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group mr-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => {setShowModal(true); setEditingPersonId(null);}}
            >
              Yeni Personel Oluştur
            </button>
          </div>
        </div>
      </div>

      <div>
        <form className="d-flex gap-2">
          <input
            type="text"
            name="firstName"
            placeholder="Ad"
            value={filters.firstName}
            onChange={handleFilterChange}
            className="form-control"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Soyad"
            value={filters.lastName}
            onChange={handleFilterChange}
            className="form-control"
          />
          <input
            type="text"
            name="identityNumber"
            placeholder="TC Kimlik Numarası"
            value={filters.identityNumber}
            onChange={handleFilterChange}
            className="form-control"
          />
          <select
            name="jobGroupId"
            value={filters.jobGroupId}
            onChange={handleFilterChange}
            className="form-control form-select"
          >
            <option value="">Meslek Grubu</option>
            {jobGroups.map((group) => (
              <option key={group.ID} value={group.ID}>
                {group.Name}
              </option>
            ))}
          </select>
          <select
            name="titleId"
            value={filters.titleId}
            onChange={handleFilterChange}
            disabled={!filterTitles}
            className="form-control form-select"
          >
            <option value="">Ünvan</option>
            {filterTitles &&
              filterTitles.map((title) => (
                <option key={title.ID} value={title.ID}>
                  {title.Name}
                </option>
              ))}
          </select>
        </form>

        <div className="table-responsive mt-4">
          <table className="table table-bordered table-striped table-sm">
            <thead>
              <tr>
                <th>Ad</th>
                <th>TC Kimlik Numarası</th>
                <th>Telefon</th>
                <th>Meslek Grubu</th>
                <th>Ünvan</th>
                <th>Klinik</th>
              </tr>
            </thead>
            <tbody>
              {personnels &&
                personnels.map((person) => (
                  <tr key={person.ID}>
                    <td>
                      {person.FirstName} {person.LastName}
                    </td>
                    <td>{person.IdentityNumber}</td>
                    <td>{person.Phone}</td>
                    <td>{person?.JobGroup?.Name ?? "-"}</td>
                    <td>{person?.Title?.Name ?? "-"}</td>
                    <td>{person?.HospitalClinic?.Polyclinic?.Name ?? "-"}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => handleEdit(person)}
                      >
                        Düzenle
                      </button>
                      <button
                        className="btn btn-sm btn-danger ml-2"
                        onClick={() => handleDelete(person.ID)}
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="d-flex gap-1">
          {Array.from({ length: totalPages }).map((_, index) => (
            <Button
              color="primary"
              size="sm"
              key={index}
              onClick={() => handlePageChange(index + 1)}
              disabled={currentPage === index + 1}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setFormData({
            firstName: "",
            lastName: "",
            identityNumber: "",
            phone: "",
            jobGroupId: "",
            titleId: "",
            hospitalClinicId: "",
          });
          setError("");
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{editingPersonId ? "Personel Düzenle" : "Yeni Personel"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="firstName">
              <Form.Label>Ad</Form.Label>
              <input
                type="text"
                className="form-control"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="lastName">
              <Form.Label>Soyad</Form.Label>
              <input
                type="text"
                className="form-control"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="identityNumber">
              <Form.Label>TC Kimlik Numarası</Form.Label>
              <input
                type="text"
                className="form-control"
                name="identityNumber"
                value={formData.identityNumber}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="phone">
              <Form.Label>Telefon</Form.Label>
              <input
                type="text"
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="jobGroupId">
              <Form.Label>Meslek Grubu</Form.Label>
              <select
                className="form-control form-select"
                name="jobGroupId"
                value={formData.jobGroupId}
                onChange={handleInputChange}
                required
              >
                <option value="">Seçiniz</option>
                {jobGroups.map((group) => (
                  <option key={group.ID} value={group.ID}>
                    {group.Name}
                  </option>
                ))}
              </select>
            </Form.Group>
            <Form.Group controlId="titleId">
              <Form.Label>Ünvan</Form.Label>
              <select
                className="form-control form-select"
                name="titleId"
                value={formData.titleId}
                onChange={handleInputChange}
              >
                <option value="">Seçiniz</option>
                {titles &&
                  titles.map((title) => (
                    <option key={title.ID} value={title.ID}>
                      {title.Name}
                    </option>
                  ))}
              </select>
            </Form.Group>
            <Form.Group controlId="lastName">
              <Form.Label>Klinik</Form.Label>
              <select
                className="form-control form-select"
                name="hospitalClinicId"
                value={formData.hospitalClinicId}
                onChange={handleInputChange}
              >
                <option value="">Seçiniz</option>
                {hospitalClinics &&
                  hospitalClinics.map((clinic) => (
                    <option key={clinic.id} value={clinic.id}>
                      {clinic?.polyclinic}
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
      {/* {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header d-flex justify-content-between">
                <h5 className="modal-title">Personel Bilgileri</h5>
                <button
                  type="button"
                  className="close btn btn-sm btn-icon btn-danger"
                  onClick={() => setShowModal(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="px-2 mt-2">
                  {error && <div className="alert alert-danger">{error}</div>}
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Ad</label>
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Soyad</label>
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>TC Kimlik Numarası</label>
                    <input
                      type="text"
                      className="form-control"
                      name="identityNumber"
                      value={formData.identityNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Telefon</label>
                    <input
                      type="text"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Meslek Grubu</label>
                    <select
                      className="form-control form-select"
                      name="jobGroupId"
                      value={formData.jobGroupId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seçiniz</option>
                      {jobGroups.map((group) => (
                        <option key={group.ID} value={group.ID}>
                          {group.Name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Ünvan</label>
                    <select
                      className="form-control form-select"
                      name="titleId"
                      value={formData.titleId}
                      onChange={handleInputChange}
                    >
                      <option value="">Seçiniz</option>
                      {titles &&
                        titles.map((title) => (
                          <option key={title.ID} value={title.ID}>
                            {title.Name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Klinik</label>
                    <select
                      className="form-control form-select"
                      name="hospitalClinicId"
                      value={formData.hospitalClinicId}
                      onChange={handleInputChange}
                    >
                      <option value="">Seçiniz</option>
                      {hospitalClinics &&
                        hospitalClinics.map((clinic) => (
                          <option key={clinic.id} value={clinic.id}>
                            {clinic?.polyclinic}
                          </option>
                        ))}
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary mt-3">
                    Kaydet
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </Layout>
  );
};

export default Person;
