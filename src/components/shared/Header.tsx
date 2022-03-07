import React from "react";

import iconLandscape from "../../assets/iconLandscape.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface HeaderProps {
  handleBackClicked?: () => void;
}

const Header: React.FC<HeaderProps> = ({ handleBackClicked }) => {
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
      {!handleBackClicked && <div></div>}

      <a href="/tilsynsturer">
        <img src={iconLandscape} alt="Logo" style={{ height: "60px" }} />
      </a>
      <div style={handleBackClicked ? { width: "105px" } : {}}></div>
    </div>
  );
};

export default Header;
