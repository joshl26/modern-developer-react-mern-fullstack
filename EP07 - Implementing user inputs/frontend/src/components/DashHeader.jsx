import React from "react";
import { Link } from "react-router-dom";

const DashHeader = () => {
  const content = (
    <header className="dash-header">
      <div className="dash-header__container">
        <Link to="/dash">
          <h1 className="dash-header__title">My Notes</h1>
        </Link>
      </div>
      <nav className="dash-header__nav"></nav>
    </header>
  );
  return content;
};

export default DashHeader;
