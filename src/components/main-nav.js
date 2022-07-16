import { NavLink } from "react-router-dom";
import React from "react";

const MainNav = () => (
  <div className="navbar-nav mr-auto">
    <NavLink
      to="/"
      exact
      className="nav-link"
      activeClassName="router-link-exact-active"
    >
      Home
    </NavLink>
    <NavLink
      to="/lobby"
      exact
      className="nav-link"
      activeClassName="router-link-exact-active"
    >
      Lobby
    </NavLink>
  </div>
);

export default MainNav;
