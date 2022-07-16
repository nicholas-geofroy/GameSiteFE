import React from "react";

import MainNav from "./main-nav";

import "./navbar.css";

const NavBar = () => {
  return (
    <div id="navbar" className="nav-container mb-3">
      <nav className="navbar navbar-expand-md">
        <div className="container">
          <div className="navbar-brand logo" />
          <MainNav />
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
