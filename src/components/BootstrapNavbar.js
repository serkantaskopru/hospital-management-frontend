import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import { useEffect, useState } from 'react';
  

const BootstrapNavbar = () => {
  const nav = useNavigate();
  const [user, setUser] = useState([]);
  const getUserData = async () => {
    setUser(JSON.parse(localStorage.getItem("user")))
  };
  useEffect(() => {
    getUserData();
  },[])
  const handleLogout = async () => {
    try {
      axiosInstance
        .post("/auth/logout")
        .then(() => {
          localStorage.removeItem("token");
          nav("/");
        })
        .catch(() => {});
        
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <Navbar expand="lg" className="bg-body-tertiary" style={{maxHeight: 80}}>
      <Container className='d-flex justify-content-between'>
        <Navbar.Brand href="#home">{user?.Staff?.Hospital?.Name}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className='flex justify-content-end'>
          <Nav className="">
            <NavDropdown title={user?.Email} id="basic-nav-dropdown">
              <NavDropdown.Item href="#" onClick={handleLogout}>
              Çıkış Yap
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BootstrapNavbar;