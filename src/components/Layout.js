// components/Layout.js
import React from "react";
import BootstrapNavbar from "./BootstrapNavbar";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  useLocation,
} from "react-router-dom";
const Layout = ({ children }) => {
    const location = useLocation();
  return (
    <div className="container-fluid">
      <div className="min-vh-100">
        <BootstrapNavbar />
        <div className="d-flex container">
          <nav className="col-md-2 d-none d-md-block sidebar mt-4">
            <div className="sidebar-sticky">
              <div className="list-group">
                <Link
                  to="/poliklinik"
                  className={`list-group-item list-group-item-action ${
                    location.pathname === "/poliklinik" ? "active" : ""
                  }`}
                >
                  Poliklinikler
                </Link>
                <Link
                  to="/personel"
                  className={`list-group-item list-group-item-action ${
                    location.pathname === "/personel" ? "active" : ""
                  }`}
                >
                  Personeller
                </Link>
                <Link
                  to="/yetkili"
                  className={`list-group-item list-group-item-action ${
                    location.pathname === "/yetkili" ? "active" : ""
                  }`}
                >
                  Alt Kullanıcılar
                </Link>
              </div>
            </div>
          </nav>

          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
