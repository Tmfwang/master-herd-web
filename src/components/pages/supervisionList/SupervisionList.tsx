import React from "react";
import { supervisionType, fullObservationType } from "../../../types";

import { Checkbox } from "@mui/material";
import Divider from "@mui/material/Divider";

const allObservationTypes = {
  gruppeSau: "gruppeSau",
  rovdyr: "rovdyr",
  skadetSau: "skadetSau",
  dodSau: "dodSau",
};

interface SupervisionListProps {
  allSupervisions: supervisionType[];
  selectedSupervisions: supervisionType[];
  setSelectedSupervisions: (selectedSupervisions: supervisionType[]) => void;
}

const SupervisionList: React.FC<SupervisionListProps> = ({
  allSupervisions,
  selectedSupervisions,
  setSelectedSupervisions,
}) => {
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

  const createTimeDifferenceString = (startTime: string, endTime: string) => {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const difference = endDate.getTime() - startDate.getTime();
    const hourDuration = Math.floor(Math.round(difference / 60000) / 60);
    const minuteDuration = Math.round(difference / 60000) % 60;

    return hourDuration + "t " + minuteDuration + "m";
  };

  const calculateTotalSheep = (supervision: supervisionType) => {
    let totalSheep = 0;

    for (let observation of supervision.allObservations) {
      totalSheep += calculateTotalSheepbyType("fargePaSau", observation);
      totalSheep += calculateTotalSheepbyType("fargePaSoye", observation);
      totalSheep += calculateTotalSheepbyType("fargePaLam", observation);

      if (
        observation.observationDetails.alle.typeObservasjon ===
          allObservationTypes.dodSau ||
        observation.observationDetails.alle.typeObservasjon ===
          allObservationTypes.skadetSau
      ) {
        totalSheep += 1;
      }
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

  const handleSupervisionSelectionToggle = (supervision: supervisionType) => {
    const newSelectedSupervisions = [...selectedSupervisions];

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

    setSelectedSupervisions(newSelectedSupervisions);
  };

  const toggleAllMarkClicked = () => {
    if (selectedSupervisions.length === allSupervisions.length) {
      setSelectedSupervisions([]);
    } else {
      setSelectedSupervisions(allSupervisions);
    }
  };

  return (
    <div style={{ marginTop: "30px", marginBottom: "30px" }}>
      {allSupervisions.length > 0 ? (
        <h3>Mine tilsynsturer</h3>
      ) : (
        <h3>
          Du har ingen tilsynsturer.
          <br />
          Husk å bruke Herd-appen til å laste opp tilsynsturene du har utført.
        </h3>
      )}

      {allSupervisions.length > 0 && (
        <div>
          {selectedSupervisions.length < allSupervisions.length ? (
            <div
              style={{
                width: "40%",
                margin: "auto",
                textAlign: "right",
                paddingRight: "25px",
                display: "flex",
              }}
            >
              <div
                style={{
                  marginLeft: "auto",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                onClick={toggleAllMarkClicked}
              >
                Marker alle
              </div>
            </div>
          ) : (
            <div
              style={{
                width: "40%",
                margin: "auto",
                textAlign: "right",
                paddingRight: "0px",
                display: "flex",
              }}
            >
              <div
                style={{
                  marginLeft: "auto",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                onClick={toggleAllMarkClicked}
              >
                Fjern markeringer
              </div>
            </div>
          )}
        </div>
      )}

      {allSupervisions
        .map((supervision: supervisionType) => {
          return (
            <div
              style={{
                border: "1px solid #AAAAAA",
                width: "40%",
                margin: "auto",
                borderRadius: "7px",
                cursor: "pointer",
                paddingBottom: "10px",
                paddingTop: "10px",
                marginTop: "10px",
                overflow: "hidden",
                backgroundColor: "#FFFFFF",
              }}
            >
              <div
                style={{ display: "flex", flexDirection: "row" }}
                onClick={() => handleSupervisionSelectionToggle(supervision)}
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
                        marginRight: "30px",
                        fontWeight: "bold",
                        fontSize: "18px",
                      }}
                    >
                      Utført:
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
                        marginRight: "5px",
                        fontWeight: "bold",
                        fontSize: "18px",
                      }}
                    >
                      Varighet:
                    </div>
                    <div
                      style={{
                        fontSize: "18px",
                      }}
                    >
                      {createTimeDifferenceString(
                        supervision.whenStarted,
                        supervision.whenEnded
                      )}
                    </div>
                  </div>
                </div>
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
                      Start:
                    </div>
                    <div
                      style={{
                        fontSize: "18px",
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
                        fontSize: "18px",
                      }}
                    >
                      Slutt:
                    </div>
                    <div
                      style={{
                        fontSize: "18px",
                      }}
                    >
                      {createHourMinuteString(supervision.whenEnded)}
                    </div>
                  </div>
                </div>
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
                        marginRight: "10px",
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
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        marginRight: "5px",
                        fontWeight: "bold",
                        fontSize: "18px",
                      }}
                    >
                      Antall sau:
                    </div>
                    <div
                      style={{
                        fontSize: "18px",
                      }}
                    >
                      {calculateTotalSheep(supervision)}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    margin: "auto",
                    borderRight: "1px solid #AAAAAA",
                    height: "50px",
                    marginRight: "10px",
                  }}
                ></div>

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
                    checked={selectedSupervisions.includes(supervision)}
                  ></Checkbox>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    margin: "auto",
                    marginRight: "-9px",
                    marginLeft: "0px",
                    width: "20px",
                  }}
                ></div>
              </div>
            </div>
          );
        })
        .reverse()}
    </div>
  );
};

export default SupervisionList;
