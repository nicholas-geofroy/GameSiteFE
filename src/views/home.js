import React from "react";
import { Link } from "react-router-dom";

const titleSize = "5rem";
const titleLineOneStyle = { color: "var(--p-color)", fontSize: titleSize };
const titleLineTwoStyle = { color: "var(--s-color)", fontSize: titleSize };
const containerStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
  height: "80vh",
};
const lobbyBtnStyle = {
  fontSize: "4rem",
  padding: "5px 30px",
};

const Home = () => {
  return (
    <div style={containerStyle}>
      <div id="title">
        <h1 style={titleLineOneStyle}>Geofroy</h1>
        <h1 style={titleLineTwoStyle}>Games</h1>
      </div>
      <Link to="/lobby">
        <button className="primary button" type="button" style={lobbyBtnStyle}>
          Play
        </button>
      </Link>
    </div>
  );
};

export default Home;
