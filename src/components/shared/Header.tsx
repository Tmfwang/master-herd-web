import React from "react";

import iconLandscape from "../../assets/iconLandscape.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";

interface HeaderProps {
  handleBackClicked?: () => void;
  handleLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ handleBackClicked, handleLogout }) => {
  return (
    <div
      style={{
        display: "flex",
        padding: "5px 10px 5px 10px",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#FFFFFF",
      }}
    >
      {handleBackClicked && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={handleBackClicked}
        >
          <ArrowBackIcon style={{ fontSize: "35px" }}></ArrowBackIcon>
          <h4>Tilbake</h4>
        </div>
      )}
      {!handleBackClicked && (
        <div style={handleLogout ? { width: "105px" } : {}}></div>
      )}

      <a href="/tilsynsturer">
        <img src={iconLandscape} alt="Logo" style={{ height: "60px" }} />
      </a>

      {handleLogout && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={handleLogout}
        >
          <h4>Logg ut</h4>
          <LogoutIcon
            style={{ fontSize: "30px", marginRight: "5px", marginLeft: "5px" }}
          ></LogoutIcon>
        </div>
      )}
      {!handleLogout && (
        <div style={handleBackClicked ? { width: "105px" } : {}}></div>
      )}
    </div>
  );
};

export default Header;
