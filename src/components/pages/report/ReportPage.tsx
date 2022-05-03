import * as React from "react";

import { useNavigate } from "react-router-dom";

import { supervisionType, fullObservationType } from "../../../types";

import LeafletMapMulti from "./LeafletMapReportPage";

import axios from "axios";

// @ts-ignore
import icon from "../../../assets/icon.png";

// @ts-ignore
import Pdf from "react-to-pdf";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: 22,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 22,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontStyle: "italic",
  },
}));

const allObservationTypes = {
  gruppeSau: "gruppeSau",
  rovdyr: "rovdyr",
  skadetSau: "skadetSau",
  dodSau: "dodSau",
};

const allPredatorTypes = {
  jerv: "jerv",
  gaupe: "gaupe",
  bjorn: "bjorn",
  ulv: "ulv",
  orn: "orn",
  annet: "annet",
};

interface ReportPageProps {
  supervisions: supervisionType[];
  handlePdfGenerated: () => void;
}

const ref = React.createRef();

const ReportPage: React.FC<ReportPageProps> = ({
  supervisions,
  handlePdfGenerated,
}) => {
  const navigate = useNavigate();

  const [isMapsReady, setIsMapsReady] = React.useState<boolean>(false);
  const [userData, setUserData] = React.useState();

  React.useEffect(() => {
    const authToken = window.sessionStorage.getItem("authToken");

    if (!authToken) {
      navigate("/");
    } else {
      axios
        .get("https://master-herd-api.herokuapp.com/user/", {
          headers: {
            Authorization: "Token " + authToken,
          },
        })
        .then(async (response) => {
          setUserData(response.data);
        })
        .catch((e) => {
          setUserData({
            // @ts-ignore
            username: "N/A",
            email: "N/A",
            full_name: "N/A",
            gaards_number: "N/A",
            bruks_number: "N/A",
            municipality: "N/A",
          });
        });
    }
  }, []);

  React.useEffect(() => {
    if (isMapsReady && userData) {
      document.getElementById("downloadPdfBtn")!.click();
    }
  }, [isMapsReady, userData]);

  const checkIfAllMapsRendered = async () => {
    if (
      !document.getElementById("report-map") &&
      document.getElementById("downloadPdfBtn")
    ) {
      setIsMapsReady(true);
    }
  };

  const createDateString = (dateIso: string) => {
    const localeDateArray = new Date(dateIso)
      .toLocaleDateString("no-no")
      .split(".");

    return (
      // Day
      localeDateArray[0] +
      "/" +
      // Month
      localeDateArray[1] +
      "/" +
      // Year
      localeDateArray[2].substring(2, 4)
    );
  };

  const createHourMinuteString = (dateIso: string) => {
    const localeTimeArray = new Date(dateIso)
      .toLocaleTimeString("no-no")
      .split(":");

    return (
      // Hour
      localeTimeArray[0] +
      ":" +
      // Minute
      localeTimeArray[1]
    );
  };

  const calculateTotalOkAdultSheep = (supervision: supervisionType) => {
    let totalSheep = 0;

    for (let observation of supervision.allObservations) {
      totalSheep += calculateTotalSheepbyType("fargePaSau", observation);
      totalSheep += calculateTotalSheepbyType("fargePaSoye", observation);
    }
    return totalSheep;
  };

  const calculateTotalOkLambs = (supervision: supervisionType) => {
    let totalSheep = 0;

    for (let observation of supervision.allObservations) {
      totalSheep += calculateTotalSheepbyType("fargePaLam", observation);
    }
    return totalSheep;
  };

  const calculateTotalSheepbyType = (
    sheepType: string,
    observation: fullObservationType
  ) => {
    return (
      // @ts-ignore
      observation["observationDetails"]["gruppeSau"][sheepType]["hvitOrGra"] +
      // @ts-ignore
      observation["observationDetails"]["gruppeSau"][sheepType]["brun"] +
      // @ts-ignore
      observation["observationDetails"]["gruppeSau"][sheepType]["sort"]
    );
  };

  const calculateTotalInjuredSheep = (supervision: supervisionType) => {
    let totalSheep = 0;

    for (let observation of supervision.allObservations) {
      if (
        observation.observationDetails.alle.typeObservasjon ===
        allObservationTypes.skadetSau
      ) {
        totalSheep += 1;
      }
    }
    return totalSheep;
  };

  const calculateTotalDeadSheep = (supervision: supervisionType) => {
    let totalSheep = 0;

    for (let observation of supervision.allObservations) {
      if (
        observation.observationDetails.alle.typeObservasjon ===
        allObservationTypes.dodSau
      ) {
        totalSheep += 1;
      }
    }
    return totalSheep;
  };

  const calculateTotalWolverines = (supervision: supervisionType) => {
    let totalWolverines = 0;

    for (let observation of supervision.allObservations) {
      if (
        observation.observationDetails.alle.typeObservasjon ===
          allObservationTypes.rovdyr &&
        observation.observationDetails.rovdyr.typeRovdyr ===
          allPredatorTypes.jerv
      ) {
        totalWolverines += 1;
      }
    }
    return totalWolverines;
  };

  const calculateTotalPredatorsExcludingWolverine = (
    supervision: supervisionType
  ) => {
    let totalPredators = 0;

    for (let observation of supervision.allObservations) {
      if (
        observation.observationDetails.alle.typeObservasjon ===
          allObservationTypes.rovdyr &&
        observation.observationDetails.rovdyr.typeRovdyr !==
          allPredatorTypes.jerv
      ) {
        totalPredators += 1;
      }
    }
    return totalPredators;
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Pdf
        targetRef={ref}
        filename="Tilsynsrapport.pdf"
        scale={0.52}
        onComplete={handlePdfGenerated}
      >
        {/* @ts-ignore */}
        {({ toPdf }) => (
          <button onClick={toPdf} hidden id="downloadPdfBtn">
            Generate pdf
          </button>
        )}
      </Pdf>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          margin: "auto",
          justifyContent: "center",
          alignContent: "center",
          paddingTop: "160px",
        }}
      >
        <Box sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>
      </div>
      <h1 style={{ textAlign: "center", marginBottom: "500px" }}>
        Laster ned tilsynsrapport...
      </h1>
      {/* @ts-ignore */}
      <div ref={ref} style={{ width: "100%" }}>
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              margin: "auto",
              justifyContent: "center",
              alignContent: "center",
              paddingTop: "250px",
            }}
          >
            <img src={icon} width={800}></img>
          </div>
          <h1
            style={{
              textAlign: "center",
              fontSize: "60px",
              marginBottom: "60px",
              marginTop: "-60px",
            }}
          >
            Oppsummerende Rapport for <br></br>Tilsyn av Frittbeitende Sau
          </h1>

          <p
            style={{
              textAlign: "center",
              fontSize: "35px",
              marginBottom: "60px",
              marginTop: "160px",
            }}
          >
            {/* @ts-ignore */}
            Tilsyn utført av {userData?.full_name}
          </p>
          <p
            style={{
              textAlign: "center",
              fontSize: "35px",
              marginTop: "60px",
            }}
          >
            {/* @ts-ignore */}
            {userData?.municipality} kommune
          </p>
          <p
            style={{
              textAlign: "center",
              fontSize: "35px",
              marginTop: "60px",
            }}
          >
            {/* @ts-ignore */}
            Gårdsnummer: {userData?.gaards_number}
          </p>
          <p
            style={{
              textAlign: "center",
              fontSize: "35px",
              marginTop: "-30px",
              marginBottom: "500px",
            }}
          >
            {/* @ts-ignore */}
            Bruksnummer: {userData?.bruks_number}
          </p>
        </div>

        <h1
          style={{
            textAlign: "center",
            fontSize: "60px",
            marginBottom: "60px",
            paddingTop: "100px",
          }}
        >
          Tilsynsturer | Tabell
        </h1>

        <div style={{ margin: "30px" }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Dato utført</StyledTableCell>
                  <StyledTableCell>Start-tid</StyledTableCell>
                  <StyledTableCell>Slutt-tid</StyledTableCell>
                  <StyledTableCell>Friske voksne sau</StyledTableCell>
                  <StyledTableCell>Friske lam</StyledTableCell>
                  <StyledTableCell>Skadde sau</StyledTableCell>
                  <StyledTableCell>Døde sau</StyledTableCell>
                  <StyledTableCell>Jerv</StyledTableCell>
                  <StyledTableCell>Øvrige rovdyr</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {supervisions.map((supervision) => (
                  <StyledTableRow key={supervision.whenStarted}>
                    <StyledTableCell component="th" scope="row">
                      {createDateString(supervision.whenStarted)}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {createHourMinuteString(supervision.whenStarted)}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {createHourMinuteString(supervision.whenEnded)}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {calculateTotalOkAdultSheep(supervision)}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {calculateTotalOkLambs(supervision)}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {calculateTotalInjuredSheep(supervision)}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {calculateTotalDeadSheep(supervision)}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {calculateTotalWolverines(supervision)}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {calculateTotalPredatorsExcludingWolverine(supervision)}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
                <StyledTableRow key={"totalRow"}>
                  <StyledTableCell component="th" scope="row">
                    <b>Total</b>
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    N/A
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    N/A
                  </StyledTableCell>
                  <StyledTableCell align="right" scope="row">
                    N/A
                  </StyledTableCell>
                  <StyledTableCell align="right" scope="row">
                    N/A
                  </StyledTableCell>
                  <StyledTableCell align="right" scope="row">
                    {supervisions.reduce(function (acc, supervision) {
                      return acc + calculateTotalInjuredSheep(supervision);
                    }, 0)}
                  </StyledTableCell>
                  <StyledTableCell align="right" scope="row">
                    {supervisions.reduce(function (acc, supervision) {
                      return acc + calculateTotalDeadSheep(supervision);
                    }, 0)}
                  </StyledTableCell>
                  <StyledTableCell align="right" scope="row">
                    {supervisions.reduce(function (acc, supervision) {
                      return acc + calculateTotalWolverines(supervision);
                    }, 0)}
                  </StyledTableCell>
                  <StyledTableCell align="right" scope="row">
                    {supervisions.reduce(function (acc, supervision) {
                      return (
                        acc +
                        calculateTotalPredatorsExcludingWolverine(supervision)
                      );
                    }, 0)}
                  </StyledTableCell>
                </StyledTableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <h1
          style={{
            textAlign: "center",
            fontSize: "60px",
            marginBottom: "80px",
            marginTop: "150px",
          }}
        >
          Tilsynsturer | Kart
        </h1>
        {supervisions.map((supervision: supervisionType) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "50px",
                margin: "30px",
                marginBottom: "70px",
              }}
            >
              <div
                style={{
                  width: "50%",
                  height: "400px",
                  border: "2px solid #333333",
                }}
              >
                <LeafletMapMulti
                  supervision={supervision}
                  checkIfAllMapsRendered={checkIfAllMapsRendered}
                ></LeafletMapMulti>
                <div
                  style={{
                    textAlign: "right",
                    marginTop: "-22px",
                    marginRight: "2px",
                    fontWeight: "bold",
                  }}
                >
                  Leaflet | Kartverket
                </div>
              </div>
              <div
                style={{
                  width: "50%",
                  height: "400px",
                  display: "flex",
                  flexDirection: "row",
                  margin: "auto",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginTop: "15px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        marginRight: "30px",
                        fontWeight: "bold",
                        fontSize: "30px",
                      }}
                    >
                      Dato:
                    </div>
                    <div
                      style={{
                        fontSize: "30px",
                      }}
                    >
                      {createDateString(supervision.whenStarted)}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        marginRight: "5px",
                        fontWeight: "bold",
                        fontSize: "30px",
                      }}
                    >
                      Start:
                    </div>
                    <div
                      style={{
                        fontSize: "30px",
                      }}
                    >
                      {createHourMinuteString(supervision.whenStarted)}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        marginRight: "5px",
                        fontWeight: "bold",
                        fontSize: "30px",
                      }}
                    >
                      Slutt:
                    </div>
                    <div
                      style={{
                        fontSize: "30px",
                      }}
                    >
                      {createHourMinuteString(supervision.whenEnded)}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "30px",
                    }}
                  >
                    <div
                      style={{
                        marginRight: "35px",
                        fontWeight: "bold",
                        fontSize: "30px",
                      }}
                    >
                      Skadde sau:
                    </div>
                    <div
                      style={{
                        fontSize: "30px",
                      }}
                    >
                      {calculateTotalInjuredSheep(supervision)}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        marginRight: "35px",
                        fontWeight: "bold",
                        fontSize: "30px",
                      }}
                    >
                      Døde sau:
                    </div>
                    <div
                      style={{
                        fontSize: "30px",
                      }}
                    >
                      {calculateTotalDeadSheep(supervision)}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      marginTop: "55px",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        marginRight: "35px",
                        fontWeight: "bold",
                        fontSize: "30px",
                      }}
                    >
                      Antall jerv:
                    </div>
                    <div
                      style={{
                        fontSize: "30px",
                      }}
                    >
                      {calculateTotalWolverines(supervision)}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        marginRight: "35px",
                        fontWeight: "bold",
                        fontSize: "30px",
                      }}
                    >
                      Øvrige rovdyr:
                    </div>
                    <div
                      style={{
                        fontSize: "30px",
                      }}
                    >
                      {calculateTotalPredatorsExcludingWolverine(supervision)}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    width: "0px",
                    marginLeft: "20px",
                    marginRight: "20px",
                    marginTop: "auto",
                    marginBottom: "auto",
                    height: "95%",
                    borderLeft: "2px solid #AAAAAA",
                  }}
                ></div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginTop: "15px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        marginRight: "35px",
                        fontWeight: "bold",
                        fontSize: "30px",
                      }}
                    >
                      Friske voksne sau:
                    </div>
                    <div
                      style={{
                        fontSize: "30px",
                      }}
                    >
                      {calculateTotalOkAdultSheep(supervision)}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        marginRight: "35px",
                        fontWeight: "bold",
                        fontSize: "30px",
                      }}
                    >
                      Friske lam:
                    </div>
                    <div
                      style={{
                        fontSize: "30px",
                      }}
                    >
                      {calculateTotalOkLambs(supervision)}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "40px",
                    }}
                  >
                    <div
                      style={{
                        marginRight: "5px",
                        fontSize: "20px",
                      }}
                    >
                      <i>Startpunkt</i>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        marginRight: "20px",
                        fontWeight: "bold",
                        fontSize: "30px",
                      }}
                    >
                      Lengdegrad:
                    </div>
                    <div
                      style={{
                        fontSize: "30px",
                      }}
                    >
                      {supervision.fullPath[0].longitude}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        marginRight: "20px",
                        fontWeight: "bold",
                        fontSize: "30px",
                      }}
                    >
                      Breddegrad:
                    </div>
                    <div
                      style={{
                        fontSize: "30px",
                      }}
                    >
                      {supervision.fullPath[0].latitude}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "30px",
                    }}
                  >
                    <div
                      style={{
                        marginRight: "5px",
                        fontSize: "20px",
                      }}
                    >
                      <i>Sluttpunkt</i>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        marginRight: "35px",
                        fontWeight: "bold",
                        fontSize: "30px",
                      }}
                    >
                      Lengdegrad:
                    </div>
                    <div
                      style={{
                        fontSize: "30px",
                      }}
                    >
                      {
                        supervision.fullPath[supervision.fullPath.length - 1]
                          .longitude
                      }
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        marginRight: "35px",
                        fontWeight: "bold",
                        fontSize: "30px",
                      }}
                    >
                      Breddegrad:
                    </div>
                    <div
                      style={{
                        fontSize: "30px",
                      }}
                    >
                      {
                        supervision.fullPath[supervision.fullPath.length - 1]
                          .latitude
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReportPage;
