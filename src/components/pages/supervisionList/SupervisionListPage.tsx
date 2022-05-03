import * as React from "react";

import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Checkbox } from "@mui/material";

import Header from "../../shared/Header";
import OptionsBar from "./OptionsBar";
import SupervisionList from "./SupervisionList";
import LeafletMapSingle from "./LeafletMapInspectSupervisionsSingle";
import LeafletMapMulti from "./LeafletMapInspectSupervisionsMulti";
import ReportPage from "../report/ReportPage";

import axios from "axios";
import { useNavigate } from "react-router-dom";

import { fullObservationType, supervisionType } from "../../../types";

interface SupervisionListPageProps {}

// Denne login-siden er en egenmodifisert versjon av en gratis login-mal fra Material UI:
// https://mui.com/getting-started/templates/

const SupervisionListPage: React.FC<SupervisionListPageProps> = ({}) => {
  const navigate = useNavigate();

  const [fromDate, setFromDate] = React.useState<string>("");
  const [toDate, setToDate] = React.useState<string>("");

  const [sortBy, setSortBy] = React.useState<string>("tilsynsdato");
  const [isDescendingSort, setIsDescendingSort] =
    React.useState<boolean>(false);

  const [didDelete, setDidDelete] = React.useState<boolean>(false);

  const [deleteDialogOpen, setDeleteDialogOpen] =
    React.useState<boolean>(false);

  const [singleMapModalOpen, setSingleMapModalOpen] =
    React.useState<boolean>(false);

  const [multiMapModalOpen, setMultiMapModalOpen] =
    React.useState<boolean>(false);

  const [pdfReportModalOpen, setPdfReportModalOpen] =
    React.useState<boolean>(false);

  const [allSupervisions, setAllSupervisions] = React.useState<
    supervisionType[]
  >([]);

  const [selectedSupervisions, setSelectedSupervisions] = React.useState<
    supervisionType[]
  >([]);

  const [singleMapSelectedSupervisions, setSingleMapSelectedSupervisions] =
    React.useState<supervisionType[]>([]);

  React.useEffect(() => {
    setSingleMapSelectedSupervisions([...selectedSupervisions]);
    console.log(singleMapSelectedSupervisions);
  }, [selectedSupervisions]);

  React.useEffect(() => {
    const authToken = window.sessionStorage.getItem("authToken");

    if (!authToken) {
      navigate("/");
    } else {
      axios
        .get(
          "https://master-herd-api.herokuapp.com/supervision/?filterDateStart=" +
            fromDate +
            "&filterDateEnd=" +
            toDate +
            "&sortBy=" +
            sortBy +
            "&isDescendingSort=" +
            isDescendingSort,
          {
            headers: {
              Authorization: "Token " + authToken,
            },
          }
        )
        .then(async (response) => {
          setAllSupervisions(response.data);
        })
        .catch((e) => {});

      setSelectedSupervisions([]);
      setDidDelete(false);
    }
  }, [fromDate, toDate, sortBy, isDescendingSort, didDelete]);

  const handleSupervisionDelete = async () => {
    const authToken = window.sessionStorage.getItem("authToken");

    selectedSupervisions.forEach((supervision: supervisionType) => {
      axios
        .delete(
          "https://master-herd-api.herokuapp.com/supervision/" +
            supervision.id +
            "/",
          {
            headers: {
              Authorization: "Token " + authToken,
            },
          }
        )
        .then(async (response) => {
          console.log("DELETED");
          setDidDelete(true);
          setDeleteDialogOpen(false);
        })
        .catch((e) => {
          console.log("NOE GIKK GALT");
          setDidDelete(true);
          setDeleteDialogOpen(false);
        });
    });
  };

  const handleLogout = () => {
    window.sessionStorage.setItem("authToken", "");
    navigate("/");
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

  const handleSingleMapSupervisionToggle = (supervision: supervisionType) => {
    const newSelectedSupervisions = [...singleMapSelectedSupervisions];

    if (!newSelectedSupervisions.includes(supervision)) {
      newSelectedSupervisions.push(supervision);
    } else {
      newSelectedSupervisions.splice(
        newSelectedSupervisions.indexOf(supervision),
        1
      );
    }

    newSelectedSupervisions.sort((a, b) =>
      ("" + a.whenStarted).localeCompare(b.whenStarted)
    );

    setSingleMapSelectedSupervisions(newSelectedSupervisions);
  };

  return (
    <div style={{ width: "100%" }}>
      <Header handleLogout={handleLogout}></Header>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Ønsker du å slette " +
            selectedSupervisions.length +
            (selectedSupervisions.length == 1
              ? " tilsynstur?"
              : " tilsynsturer?")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {(selectedSupervisions.length == 1
              ? "Denne tilsynsynsturen"
              : "Disse tilsynsturene") +
              " vil bli permanent slettet. Denne handlingen kan ikke angres."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>AVBRYT</Button>
          <Button onClick={() => handleSupervisionDelete()} autoFocus>
            SLETT
          </Button>
        </DialogActions>
      </Dialog>
      <Modal open={singleMapModalOpen}>
        <div
          style={{
            width: "100vw",
            height: "100vh",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#FFFFFF",
            border: "2px solid #000",
            boxShadow: "24",
          }}
        >
          <Header
            handleBackClicked={() => setSingleMapModalOpen(false)}
            handleLogout={handleLogout}
          ></Header>
          <div style={{ overflow: "auto" }}>
            <div
              style={{
                backgroundColor: "#F8F8F8",
                minWidth: "100%",
                paddingTop: "1px",
                marginTop: "-1px",
                display: "inline-flex",
                flexDirection: "row",
              }}
            >
              {[...selectedSupervisions]
                .sort(function (a, b) {
                  return b.whenStarted.localeCompare(a.whenStarted);
                })
                .map((supervision: supervisionType) => {
                  return (
                    <div
                      style={{
                        height: "6vw",
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #222222",
                        margin: "5px",
                        padding: "5px",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        handleSingleMapSupervisionToggle(supervision)
                      }
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          margin: "auto",
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
                              marginRight: "20px",
                              fontWeight: "bold",
                              fontSize: "18px",
                            }}
                          >
                            Dato:
                          </div>
                          <div
                            style={{
                              fontSize: "18px",
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
                              marginRight: "8px",
                              fontWeight: "bold",
                              fontSize: "18px",
                            }}
                          >
                            Observasjoner:
                          </div>
                          <div
                            style={{
                              fontSize: "18px",
                            }}
                          >
                            {supervision.allObservations.length}
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            margin: "auto",
                          }}
                        >
                          <Checkbox
                            size="medium"
                            sx={{ "& .MuiSvgIcon-root": { fontSize: 36 } }}
                            checked={singleMapSelectedSupervisions.includes(
                              supervision
                            )}
                          ></Checkbox>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <div
            style={{
              width: "100%",
              height: "75%",
              backgroundColor: "#F8F8F8",
              paddingTop: "1px",
              marginTop: "-1px",
            }}
          >
            <LeafletMapSingle
              supervisions={singleMapSelectedSupervisions}
            ></LeafletMapSingle>
          </div>
        </div>
      </Modal>
      <Modal open={multiMapModalOpen}>
        <div
          style={{
            width: "100vw",
            height: "100vh",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#FFFFFF",
            border: "2px solid #000",
            boxShadow: "24",
          }}
        >
          <Header
            handleBackClicked={() => setMultiMapModalOpen(false)}
            handleLogout={handleLogout}
          ></Header>
          <div
            style={{
              width: "100%",
              height: "90%",
              backgroundColor: "#F8F8F8",
              paddingTop: "1px",
              marginTop: "-1px",
              overflow: "auto",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto auto auto",
                gap: "20px",
                margin: "20px",
              }}
            >
              {selectedSupervisions.map((supervision: supervisionType) => {
                return (
                  <div
                    style={{
                      width: "100%",
                      height: "400px",
                      border: "1px solid #333333",
                    }}
                  >
                    <LeafletMapMulti
                      supervision={supervision}
                    ></LeafletMapMulti>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>
      <Modal open={pdfReportModalOpen}>
        <div
          style={{
            width: "100vw",
            height: "100vh",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#F8F8F8",
            border: "2px solid #000",
            boxShadow: "24",
          }}
        >
          <Header></Header>
          <ReportPage
            supervisions={selectedSupervisions}
            handlePdfGenerated={() => setPdfReportModalOpen(false)}
          ></ReportPage>
        </div>
      </Modal>
      <div
        style={{
          width: "100%",
          paddingTop: "1px",
          marginTop: "-1px",
        }}
      >
        <OptionsBar
          selectedSupervisionAmount={selectedSupervisions.length}
          setFromDate={setFromDate}
          setToDate={setToDate}
          setSortBy={setSortBy}
          setIsDescendingSort={setIsDescendingSort}
          isDescendingSort={isDescendingSort}
          handleSingleMapClicked={() => setSingleMapModalOpen(true)}
          handleMultiMapClicked={() => setMultiMapModalOpen(true)}
          handleDeleteClicked={() => setDeleteDialogOpen(true)}
          handleReportClicked={() => setPdfReportModalOpen(true)}
        ></OptionsBar>
        <SupervisionList
          allSupervisions={allSupervisions}
          selectedSupervisions={selectedSupervisions}
          setSelectedSupervisions={setSelectedSupervisions}
        ></SupervisionList>
      </div>
    </div>
  );
};

export default SupervisionListPage;
