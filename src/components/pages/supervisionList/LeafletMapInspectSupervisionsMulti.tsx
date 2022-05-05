import React, { useEffect, useState } from "react";
import ReactDOMServer from "react-dom/server";

import { supervisionType, fullObservationType } from "../../../types";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";

// @ts-ignore
import L, { Map, Polyline } from "leaflet";
import { MapContainer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// @ts-ignore
import binocularIconImg from "../../../assets/icons/BinocularIcon.png";
// @ts-ignore
import gruppeSauIconImg from "../../../assets/icons/GruppeSauIcon.png";
// @ts-ignore
import soyeIconImg from "../../../assets/icons/SoyeIcon.png";
// @ts-ignore
import lamIconImg from "../../../assets/icons/LamIcon.png";
// @ts-ignore
import rovdyrIconImg from "../../../assets/icons/RovdyrIcon.png";
// @ts-ignore
import skadetSauIconImg from "../../../assets/icons/SkadetSauIcon.png";
// @ts-ignore
import dodSauIconImg from "../../../assets/icons/DodSauIcon.png";

const allObservationTypes = {
  gruppeSau: "gruppeSau",
  rovdyr: "rovdyr",
  skadetSau: "skadetSau",
  dodSau: "dodSau",
};

const allOwnerColorTypes = {
  rod: "rod",
  bla: "bla",
  gul: "gul",
  gronn: "gronn",
  sort: "sort",
  ikkeSpesifisert: "ikkeSpesifisert",
};

const allPredatorTypes = {
  jerv: "jerv",
  gaupe: "gaupe",
  bjorn: "bjorn",
  ulv: "ulv",
  orn: "orn",
  annet: "annet",
};

const allSheepDamageTypes = {
  halter: "halter",
  blor: "blor",
  hodeskade: "hodeskade",
  kroppskade: "kroppskade",
  annet: "annet",
};

const allSheepCausesOfDeathTypes = {
  sykdom: "sykdom",
  rovdyr: "rovdyr",
  fallulykke: "fallulykke",
  drukningsulykke: "drukningsulykke",
  annet: "annet",
};

const allSheepColorTypes = {
  hvitOrGra: "hvitOrGra",
  brun: "brun",
  sort: "sort",
  ikkeSpesifisert: "ikkeSpesifisert",
};

let binocularIcon = L.icon({
  iconUrl: binocularIconImg,
  iconAnchor: [45 / 2, 45 / 2],
  iconSize: new L.Point(45, 45),
});

let observationIcons = {
  gruppeSau: L.icon({
    iconUrl: gruppeSauIconImg,
    iconAnchor: [65 / 2, 65 / 2],
    iconSize: new L.Point(65, 65),
  }),
  soye: L.icon({
    iconUrl: soyeIconImg,
    iconAnchor: [65 / 2, 65 / 2],
    iconSize: new L.Point(65, 65),
  }),
  lam: L.icon({
    iconUrl: lamIconImg,
    iconAnchor: [65 / 2, 65 / 2],
    iconSize: new L.Point(65, 65),
  }),
  rovdyr: L.icon({
    iconUrl: rovdyrIconImg,
    iconAnchor: [65 / 2, 65 / 2],
    iconSize: new L.Point(65, 65),
  }),
  skadetSau: L.icon({
    iconUrl: skadetSauIconImg,
    iconAnchor: [65 / 2, 65 / 2],
    iconSize: new L.Point(65, 65),
  }),
  dodSau: L.icon({
    iconUrl: dodSauIconImg,
    iconAnchor: [65 / 2, 65 / 2],
    iconSize: new L.Point(65, 65),
  }),
};

type markerPair = {
  userMarker: any;
  observationMarker: any;
  lineBetweenMarkers: any;
};

interface LeafletMapProps {
  supervision: supervisionType;
}

// This is the leaflet map component for inspecting a supervision. It draws the recorded path on the map,
// as well as all observations made during the supervision. The observation markers can be clicked to reveal
// more information about it in a popup.
const LeafletMap: React.FC<LeafletMapProps> = ({ supervision }) => {
  const [map, setMap] = useState<Map | undefined>();

  const [observationMarkerPairs, setObservationMarkerPairs] = useState<
    markerPair[]
  >([] as markerPair[]);

  const [pathPolyline, setPathPolyline] = useState<Polyline<any>>();

  // Fits the map to the observation markers and walked path
  useEffect(() => {
    const objectsToFit = [];

    if (map) {
      setTimeout(map.invalidateSize, 250);

      for (let markerPair of observationMarkerPairs) {
        objectsToFit.push(markerPair.userMarker);
        objectsToFit.push(markerPair.observationMarker);
      }

      if (pathPolyline) {
        objectsToFit.push(pathPolyline);
      }

      if (objectsToFit.length > 0) {
        let groupToFit = L.featureGroup(objectsToFit);

        map.fitBounds(groupToFit.getBounds());
      }
    }
  }, [observationMarkerPairs, map, supervision]);

  // Draws the path that the user has walked
  useEffect(() => {
    if (supervision.fullPath && supervision.fullPath.length >= 2) {
      let polylinePoints = supervision.fullPath.map((coordinate) =>
        L.latLng(coordinate.latitude, coordinate.longitude)
      );

      if (pathPolyline) {
        pathPolyline.setLatLngs(polylinePoints);
      } else if (map) {
        let newPolyline = L.polyline(polylinePoints, {
          weight: 6,
          stroke: true,
          color: "black",
        });
        setPathPolyline(newPolyline);

        newPolyline.addTo(map);
      }
    }
  }, [supervision, supervision.fullPath, map]);

  useEffect(() => {
    removeAllMarkers();
    addAllMarkers();

    if (map) {
      const mapSize = map.getSize();
      if (!mapSize["x"] || !mapSize["y"]) {
        map.invalidateSize();
      }
    }
  }, [supervision, supervision.allObservations, map]);

  const removeAllMarkers = () => {
    if (map) {
      for (let markerPair of observationMarkerPairs) {
        markerPair.userMarker.removeFrom(map);
        markerPair.observationMarker.removeFrom(map);
        markerPair.lineBetweenMarkers.removeFrom(map);
      }

      setObservationMarkerPairs([]);
    }
  };

  const addAllMarkers = () => {
    if (map) {
      let allNewMarkers = [] as markerPair[];

      for (let observation of supervision.allObservations) {
        if (
          observation.userLocation.latitude &&
          observation.userLocation.longitude &&
          observation.observationLocation.latitude &&
          observation.observationLocation.longitude
        ) {
          // @ts-ignore
          let userMarker = new L.marker(
            L.latLng(
              observation.userLocation.latitude,
              observation.userLocation.longitude
            ),
            { icon: binocularIcon }
          );

          // @ts-ignore
          let observationMarker = new L.marker(
            L.latLng(
              observation.observationLocation.latitude,
              observation.observationLocation.longitude
            ),
            {
              // @ts-ignore
              icon: observationIcons[
                observation.observationDetails.alle.typeObservasjon
              ],
            }
          );

          let lineBetweenMarkers = L.polyline(
            [userMarker.getLatLng(), observationMarker.getLatLng()],
            { weight: 4, color: "black", opacity: 0.5, dashArray: [10, 10] }
          );

          // Add a popup to the marker and listeners on popup open and close,
          // which them themselves add listeners to clicks on the button inside the popup
          observationMarker.bindPopup(generatePopupHtmlString(observation), {
            closeButton: false,
          });

          userMarker.bindPopup(generatePopupHtmlString(observation), {
            closeButton: false,
          });

          userMarker.addTo(map);
          observationMarker.addTo(map);
          lineBetweenMarkers.addTo(map);

          allNewMarkers.push({
            userMarker: userMarker,
            observationMarker: observationMarker,
            lineBetweenMarkers: lineBetweenMarkers,
          });
        }
      }

      setObservationMarkerPairs(allNewMarkers);
    }
  };

  const calculateTotalSheep = (
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

  const generatePopupHtmlString = (observation: fullObservationType) => {
    let dateRegistered = new Date(
      observation.whenRegisteredDateTime
    ).toLocaleTimeString("no-no");

    switch (observation["observationDetails"]["alle"]["typeObservasjon"]) {
      case allObservationTypes.gruppeSau:
        return ReactDOMServer.renderToString(
          <div style={{ height: "330px", width: "200px", overflowY: "auto" }}>
            <div
              style={{
                position: "fixed",
                width: "200px",
                height: "40px",
                bottom: "13px",
                zIndex: 9999,
                background:
                  "linear-gradient(to bottom,  rgba(255, 255, 255, 0),  rgba(255, 255, 255, 1) 100%)",
              }}
            ></div>
            <List
              sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
                position: "relative",
                overflow: "auto",
                maxHeight: 320,
                marginTop: "-2px",
                "& ul": { padding: 0 },
              }}
              subheader={<li />}
            >
              <li key={`gruppe-sau-0`}>
                <ul>
                  <ListSubheader
                    style={{ fontWeight: "bold" }}
                  >{`Type observasjon`}</ListSubheader>

                  <ListItem key={`gruppe-sau-item-0-0`}>
                    <ListItemText primary={`Gruppe sau`} />
                  </ListItem>
                </ul>
              </li>

              <li key={`gruppe-sau-1`}>
                <ul>
                  <ListSubheader
                    style={{ fontWeight: "bold" }}
                  >{`Når registrert`}</ListSubheader>

                  <ListItem key={`gruppe-sau-item-1-0`}>
                    <ListItemText primary={dateRegistered} />
                  </ListItem>
                </ul>
              </li>

              <li key={`gruppe-sau-2`}>
                <ul>
                  <ListSubheader style={{ fontWeight: "bold" }}>
                    {`Antall`}
                  </ListSubheader>

                  <ListItem
                    key={`gruppe-sau-item-2-0`}
                    secondaryAction={
                      <ListItemText
                        primary={calculateTotalSheep("fargePaSau", observation)}
                      />
                    }
                  >
                    <ListItemText primary={"Generelle sau"} />
                  </ListItem>

                  <ListItem
                    key={`gruppe-sau-item-2-1`}
                    secondaryAction={
                      <ListItemText
                        primary={calculateTotalSheep(
                          "fargePaSoye",
                          observation
                        )}
                      />
                    }
                  >
                    <ListItemText primary={"Søyer"} />
                  </ListItem>

                  <ListItem
                    key={`gruppe-sau-item-2-2`}
                    secondaryAction={
                      <ListItemText
                        primary={calculateTotalSheep("fargePaLam", observation)}
                      />
                    }
                  >
                    <ListItemText primary={"Lam"} />
                  </ListItem>

                  <ListItem
                    key={`gruppe-sau-item-2-3`}
                    secondaryAction={
                      <i>
                        <ListItemText
                          primary={
                            calculateTotalSheep("fargePaSau", observation) +
                            calculateTotalSheep("fargePaSoye", observation) +
                            calculateTotalSheep("fargePaLam", observation)
                          }
                        />
                      </i>
                    }
                  >
                    <i>
                      <ListItemText primary={"Sau totalt"} />
                    </i>
                  </ListItem>
                </ul>
              </li>

              <li key={`gruppe-sau-3`}>
                <ul>
                  <ListSubheader
                    style={{ fontWeight: "bold" }}
                  >{`Farge på generell sau`}</ListSubheader>

                  <ListItem
                    key={`gruppe-sau-item-3-0`}
                    secondaryAction={
                      <ListItemText
                        primary={
                          observation["observationDetails"]["gruppeSau"][
                            "fargePaSau"
                          ]["hvitOrGra"]
                        }
                      />
                    }
                  >
                    <ListItemText primary={"Hvite/grå"} />
                  </ListItem>

                  <ListItem
                    key={`gruppe-sau-item-3-1`}
                    secondaryAction={
                      <ListItemText
                        primary={
                          observation["observationDetails"]["gruppeSau"][
                            "fargePaSau"
                          ]["brun"]
                        }
                      />
                    }
                  >
                    <ListItemText primary={"Brune"} />
                  </ListItem>

                  <ListItem
                    key={`gruppe-sau-item-3-2`}
                    secondaryAction={
                      <ListItemText
                        primary={
                          observation["observationDetails"]["gruppeSau"][
                            "fargePaSau"
                          ]["sort"]
                        }
                      />
                    }
                  >
                    <ListItemText primary={"Sorte"} />
                  </ListItem>
                </ul>
              </li>

              <li key={`gruppe-sau-4`}>
                <ul>
                  <ListSubheader
                    style={{ fontWeight: "bold" }}
                  >{`Farge på søyer`}</ListSubheader>

                  <ListItem
                    key={`gruppe-sau-item-4-0`}
                    secondaryAction={
                      <ListItemText
                        primary={
                          observation["observationDetails"]["gruppeSau"][
                            "fargePaSoye"
                          ]["hvitOrGra"]
                        }
                      />
                    }
                  >
                    <ListItemText primary={"Hvite/grå"} />
                  </ListItem>

                  <ListItem
                    key={`gruppe-sau-item-4-1`}
                    secondaryAction={
                      <ListItemText
                        primary={
                          observation["observationDetails"]["gruppeSau"][
                            "fargePaSoye"
                          ]["brun"]
                        }
                      />
                    }
                  >
                    <ListItemText primary={"Brune"} />
                  </ListItem>

                  <ListItem
                    key={`gruppe-sau-item-4-2`}
                    secondaryAction={
                      <ListItemText
                        primary={
                          observation["observationDetails"]["gruppeSau"][
                            "fargePaSoye"
                          ]["sort"]
                        }
                      />
                    }
                  >
                    <ListItemText primary={"Sorte"} />
                  </ListItem>
                </ul>
              </li>

              <li key={`gruppe-sau-5`}>
                <ul>
                  <ListSubheader
                    style={{ fontWeight: "bold" }}
                  >{`Farge på lam`}</ListSubheader>

                  <ListItem
                    key={`gruppe-sau-item-5-0`}
                    secondaryAction={
                      <ListItemText
                        primary={
                          observation["observationDetails"]["gruppeSau"][
                            "fargePaLam"
                          ]["hvitOrGra"]
                        }
                      />
                    }
                  >
                    <ListItemText primary={"Hvite/grå"} />
                  </ListItem>

                  <ListItem
                    key={`gruppe-sau-item-5-1`}
                    secondaryAction={
                      <ListItemText
                        primary={
                          observation["observationDetails"]["gruppeSau"][
                            "fargePaLam"
                          ]["brun"]
                        }
                      />
                    }
                  >
                    <ListItemText primary={"Brune"} />
                  </ListItem>

                  <ListItem
                    key={`gruppe-sau-item-5-2`}
                    secondaryAction={
                      <ListItemText
                        primary={
                          observation["observationDetails"]["gruppeSau"][
                            "fargePaLam"
                          ]["sort"]
                        }
                      />
                    }
                  >
                    <ListItemText primary={"Sorte"} />
                  </ListItem>
                </ul>
              </li>

              <li key={`gruppe-sau-6`}>
                <ul>
                  <ListSubheader
                    style={{ fontWeight: "bold" }}
                  >{`Farge på bjelleslipsene`}</ListSubheader>

                  <ListItem
                    key={`gruppe-sau-item-6-0`}
                    secondaryAction={
                      <ListItemText
                        primary={
                          observation["observationDetails"]["gruppeSau"][
                            "fargePaBjelleslips"
                          ]["rod"]
                        }
                      />
                    }
                  >
                    <ListItemText primary={"Røde"} />
                  </ListItem>

                  <ListItem
                    key={`gruppe-sau-item-6-1`}
                    secondaryAction={
                      <ListItemText
                        primary={
                          observation["observationDetails"]["gruppeSau"][
                            "fargePaBjelleslips"
                          ]["bla"]
                        }
                      />
                    }
                  >
                    <ListItemText primary={"Blåe"} />
                  </ListItem>

                  <ListItem
                    key={`gruppe-sau-item-6-2`}
                    secondaryAction={
                      <ListItemText
                        primary={
                          observation["observationDetails"]["gruppeSau"][
                            "fargePaBjelleslips"
                          ]["gulOrIngen"]
                        }
                      />
                    }
                  >
                    <ListItemText primary={"Gule/blanke"} />
                  </ListItem>

                  <ListItem
                    key={`gruppe-sau-item-6-3`}
                    secondaryAction={
                      <ListItemText
                        primary={
                          observation["observationDetails"]["gruppeSau"][
                            "fargePaBjelleslips"
                          ]["gronn"]
                        }
                      />
                    }
                  >
                    <ListItemText primary={"Grønne"} />
                  </ListItem>
                </ul>
              </li>

              <li key={`gruppe-sau-7`}>
                <ul>
                  <ListSubheader
                    style={{ fontWeight: "bold" }}
                  >{`Observerte eiermerker`}</ListSubheader>

                  {observation["observationDetails"]["gruppeSau"][
                    "fargePaEiermerke"
                  ].includes(allOwnerColorTypes.rod) && (
                    <ListItem key={`gruppe-sau-item-6-0`}>
                      <ListItemText primary={"Rødt"} />
                    </ListItem>
                  )}

                  {observation["observationDetails"]["gruppeSau"][
                    "fargePaEiermerke"
                  ].includes(allOwnerColorTypes.bla) && (
                    <ListItem key={`gruppe-sau-item-6-1`}>
                      <ListItemText primary={"Blått"} />
                    </ListItem>
                  )}

                  {observation["observationDetails"]["gruppeSau"][
                    "fargePaEiermerke"
                  ].includes(allOwnerColorTypes.gul) && (
                    <ListItem key={`gruppe-sau-item-6-2`}>
                      <ListItemText primary={"Gult"} />
                    </ListItem>
                  )}

                  {observation["observationDetails"]["gruppeSau"][
                    "fargePaEiermerke"
                  ].includes(allOwnerColorTypes.gronn) && (
                    <ListItem key={`gruppe-sau-item-6-3`}>
                      <ListItemText primary={"Grønt"} />
                    </ListItem>
                  )}

                  {observation["observationDetails"]["gruppeSau"][
                    "fargePaEiermerke"
                  ].includes(allOwnerColorTypes.sort) && (
                    <ListItem key={`gruppe-sau-item-6-4`}>
                      <ListItemText primary={"Sort"} />
                    </ListItem>
                  )}

                  {observation["observationDetails"]["gruppeSau"][
                    "fargePaEiermerke"
                  ].length === 0 && (
                    <ListItem key={`gruppe-sau-item-6-5`}>
                      <ListItemText primary={"Ingen observert"} />
                    </ListItem>
                  )}
                </ul>
              </li>
            </List>
          </div>
        );

      case allObservationTypes.rovdyr:
        return ReactDOMServer.renderToString(
          <div style={{ height: "300px", width: "200px", overflowY: "auto" }}>
            <List
              sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
                position: "relative",
                overflow: "auto",
                maxHeight: 320,
                marginTop: "-2px",
                "& ul": { padding: 0 },
              }}
              subheader={<li />}
            >
              <li key={`rovdyr-0`}>
                <ul>
                  <ListSubheader
                    style={{ fontWeight: "bold" }}
                  >{`Type observasjon`}</ListSubheader>

                  <ListItem key={`rovdyr-item-0-0`}>
                    <ListItemText primary={`Rovdyr`} />
                  </ListItem>
                </ul>
              </li>

              <li key={`rovdyr-1`}>
                <ul>
                  <ListSubheader
                    style={{ fontWeight: "bold" }}
                  >{`Når registrert`}</ListSubheader>

                  <ListItem key={`rovdyr-item-1-0`}>
                    <ListItemText primary={dateRegistered} />
                  </ListItem>
                </ul>
              </li>

              <li key={`rovdyr-2`}>
                <ul>
                  <ListSubheader
                    style={{ fontWeight: "bold" }}
                  >{`Type rovdyr`}</ListSubheader>

                  {observation["observationDetails"]["rovdyr"]["typeRovdyr"] ===
                    allPredatorTypes.jerv && (
                    <ListItem key={`rovdyr-item-2-0`}>
                      <ListItemText primary={"Jerv"} />
                    </ListItem>
                  )}

                  {observation["observationDetails"]["rovdyr"]["typeRovdyr"] ===
                    allPredatorTypes.gaupe && (
                    <ListItem key={`rovdyr-item-2-1`}>
                      <ListItemText primary={"Gaupe"} />
                    </ListItem>
                  )}

                  {observation["observationDetails"]["rovdyr"]["typeRovdyr"] ===
                    allPredatorTypes.bjorn && (
                    <ListItem key={`rovdyr-item-2-2`}>
                      <ListItemText primary={"Bjørn"} />
                    </ListItem>
                  )}

                  {observation["observationDetails"]["rovdyr"]["typeRovdyr"] ===
                    allPredatorTypes.ulv && (
                    <ListItem key={`rovdyr-item-2-3`}>
                      <ListItemText primary={"Ulv"} />
                    </ListItem>
                  )}

                  {observation["observationDetails"]["rovdyr"]["typeRovdyr"] ===
                    allPredatorTypes.orn && (
                    <ListItem key={`rovdyr-item-2-4`}>
                      <ListItemText primary={"Ørn"} />
                    </ListItem>
                  )}

                  {observation["observationDetails"]["rovdyr"]["typeRovdyr"] ===
                    allPredatorTypes.annet && (
                    <ListItem key={`rovdyr-item-2-5`}>
                      <ListItemText primary={"Annet"} />
                    </ListItem>
                  )}
                </ul>
              </li>
            </List>
          </div>
        );

      case allObservationTypes.skadetSau:
        return ReactDOMServer.renderToString(
          <div style={{ height: "330px", width: "200px", overflowY: "auto" }}>
            <div
              style={{
                position: "fixed",
                width: "200px",
                height: "40px",
                bottom: "13px",
                zIndex: 9999,
                background:
                  "linear-gradient(to bottom,  rgba(255, 255, 255, 0),  rgba(255, 255, 255, 1) 100%)",
              }}
            ></div>
            <List
              sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
                position: "relative",
                overflow: "auto",
                maxHeight: 320,
                marginTop: "-2px",
                "& ul": { padding: 0 },
              }}
              subheader={<li />}
            >
              <li key={`skadet-sau-0`}>
                <ul>
                  <ListSubheader
                    style={{ fontWeight: "bold" }}
                  >{`Type observasjon`}</ListSubheader>

                  <ListItem key={`skadet-sau-item-0-0`}>
                    <ListItemText primary={`Skadet sau`} />
                  </ListItem>
                </ul>
              </li>

              <li key={`skadet-sau-1`}>
                <ul>
                  <ListSubheader
                    style={{ fontWeight: "bold" }}
                  >{`Når registrert`}</ListSubheader>

                  <ListItem key={`skadet-sau-item-1-0`}>
                    <ListItemText primary={dateRegistered} />
                  </ListItem>
                </ul>
              </li>

              <li key={`skadet-sau-2`}>
                <ul>
                  <ListSubheader
                    style={{ fontWeight: "bold" }}
                  >{`Type skade`}</ListSubheader>

                  {observation["observationDetails"]["skadetSau"][
                    "typeSkade"
                  ] === allSheepDamageTypes.halter && (
                    <ListItem key={`skadet-sau-item-2-0`}>
                      <ListItemText primary={"Halter"} />
                    </ListItem>
                  )}

                  {observation["observationDetails"]["skadetSau"][
                    "typeSkade"
                  ] === allSheepDamageTypes.blor && (
                    <ListItem key={`skadet-sau-item-2-1`}>
                      <ListItemText primary={"Blør"} />
                    </ListItem>
                  )}

                  {observation["observationDetails"]["skadetSau"][
                    "typeSkade"
                  ] === allSheepDamageTypes.hodeskade && (
                    <ListItem key={`skadet-sau-item-2-2`}>
                      <ListItemText primary={"Skade på hodet"} />
                    </ListItem>
                  )}

                  {observation["observationDetails"]["skadetSau"][
                    "typeSkade"
                  ] === allSheepDamageTypes.kroppskade && (
                    <ListItem key={`skadet-sau-item-2-3`}>
                      <ListItemText primary={"Skade på kropp"} />
                    </ListItem>
                  )}

                  {observation["observationDetails"]["skadetSau"][
                    "typeSkade"
                  ] === allSheepDamageTypes.annet && (
                    <ListItem key={`skadet-sau-item-2-4`}>
                      <ListItemText primary={"Annen type skade"} />
                    </ListItem>
                  )}
                </ul>
              </li>

              <li key={`skadet-sau-3`}>
                <ul>
                  <ListSubheader
                    style={{ fontWeight: "bold" }}
                  >{`Farge på sauen`}</ListSubheader>

                  {observation["observationDetails"]["skadetSau"][
                    "fargePaSau"
                  ] === allSheepColorTypes.hvitOrGra && (
                    <ListItem key={`skadet-sau-item-3-0`}>
                      <ListItemText primary={"Hvit/grå"} />
                    </ListItem>
                  )}

                  {observation["observationDetails"]["skadetSau"][
                    "fargePaSau"
                  ] === allSheepColorTypes.brun && (
                    <ListItem key={`skadet-sau-item-3-1`}>
                      <ListItemText primary={"Brun"} />
                    </ListItem>
                  )}

                  {observation["observationDetails"]["skadetSau"][
                    "fargePaSau"
                  ] === allSheepColorTypes.sort && (
                    <ListItem key={`skadet-sau-item-3-2`}>
                      <ListItemText primary={"Sort"} />
                    </ListItem>
                  )}

                  {observation["observationDetails"]["skadetSau"][
                    "fargePaSau"
                  ] === allSheepColorTypes.ikkeSpesifisert && (
                    <ListItem key={`skadet-sau-item-3-3`}>
                      <ListItemText primary={"Ikke spesifisert"} />
                    </ListItem>
                  )}
                </ul>
              </li>

              <li key={`skadet-sau-4`}>
                <ul>
                  <ListSubheader
                    style={{ fontWeight: "bold" }}
                  >{`Farge på eiermerket`}</ListSubheader>

                  {observation["observationDetails"]["skadetSau"][
                    "fargePaEiermerke"
                  ] === allOwnerColorTypes.rod && (
                    <ListItem key={`skadet-sau-item-4-0`}>
                      <ListItemText primary={"Rødt"} />
                    </ListItem>
                  )}

                  {observation["observationDetails"]["skadetSau"][
                    "fargePaEiermerke"
                  ] === allOwnerColorTypes.bla && (
                    <ListItem key={`skadet-sau-item-4-1`}>
                      <ListItemText primary={"Blått"} />
                    </ListItem>
                  )}

                  {observation["observationDetails"]["skadetSau"][
                    "fargePaEiermerke"
                  ] === allOwnerColorTypes.gul && (
                    <ListItem key={`skadet-sau-item-4-2`}>
                      <ListItemText primary={"Gult"} />
                    </ListItem>
                  )}

                  {observation["observationDetails"]["skadetSau"][
                    "fargePaEiermerke"
                  ] === allOwnerColorTypes.gronn && (
                    <ListItem key={`skadet-sau-item-4-3`}>
                      <ListItemText primary={"Grønt"} />
                    </ListItem>
                  )}

                  {observation["observationDetails"]["skadetSau"][
                    "fargePaEiermerke"
                  ] === allOwnerColorTypes.sort && (
                    <ListItem key={`skadet-sau-item-4-4`}>
                      <ListItemText primary={"Sort"} />
                    </ListItem>
                  )}

                  {observation["observationDetails"]["skadetSau"][
                    "fargePaEiermerke"
                  ] === allOwnerColorTypes.ikkeSpesifisert && (
                    <ListItem key={`skadet-sau-item-4-5`}>
                      <ListItemText primary={"Ikke spesifisert"} />
                    </ListItem>
                  )}
                </ul>
              </li>
            </List>
          </div>
        );

      case allObservationTypes.dodSau:
        return ReactDOMServer.renderToString(
          <div style={{ height: "330px", width: "200px", overflowY: "auto" }}>
            <div
              style={{
                position: "fixed",
                width: "200px",
                height: "40px",
                bottom: "13px",
                zIndex: 9999,
                background:
                  "linear-gradient(to bottom,  rgba(255, 255, 255, 0),  rgba(255, 255, 255, 1) 100%)",
              }}
            ></div>
            <List
              sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
                position: "relative",
                overflow: "auto",
                maxHeight: 320,
                marginTop: "-2px",
                "& ul": { padding: 0 },
              }}
              subheader={<li />}
            >
              <li key={`dod-sau-0`}>
                <ul>
                  <ListSubheader
                    style={{ fontWeight: "bold" }}
                  >{`Type observasjon`}</ListSubheader>

                  <ListItem key={`dod-sau-item-0-0`}>
                    <ListItemText primary={`Død sau`} />
                  </ListItem>
                </ul>
              </li>

              <li key={`dod-sau-1`}>
                <ul>
                  <ListSubheader
                    style={{ fontWeight: "bold" }}
                  >{`Når registrert`}</ListSubheader>

                  <ListItem key={`dod-sau-item-1-0`}>
                    <ListItemText primary={dateRegistered} />
                  </ListItem>
                </ul>
              </li>

              <li key={`dod-sau-2`}>
                <ul>
                  <ListSubheader
                    style={{ fontWeight: "bold" }}
                  >{`Dødsårsak`}</ListSubheader>

                  {observation["observationDetails"]["dodSau"]["dodsarsak"] ===
                    allSheepCausesOfDeathTypes.sykdom && (
                    <ListItem key={`dod-sau-item-2-0`}>
                      <ListItemText primary={"Sykdom"} />
                    </ListItem>
                  )}

                  {observation["observationDetails"]["dodSau"]["dodsarsak"] ===
                    allSheepCausesOfDeathTypes.rovdyr && (
                    <ListItem key={`dod-sau-item-2-1`}>
                      <ListItemText primary={"Rovdyr"} />
                    </ListItem>
                  )}

                  {observation["observationDetails"]["dodSau"]["dodsarsak"] ===
                    allSheepCausesOfDeathTypes.fallulykke && (
                    <ListItem key={`dod-sau-item-2-2`}>
                      <ListItemText primary={"Fallulykke"} />
                    </ListItem>
                  )}

                  {observation["observationDetails"]["dodSau"]["dodsarsak"] ===
                    allSheepCausesOfDeathTypes.drukningsulykke && (
                    <ListItem key={`dod-sau-item-2-3`}>
                      <ListItemText primary={"Drukningsulykke"} />
                    </ListItem>
                  )}

                  {observation["observationDetails"]["dodSau"]["dodsarsak"] ===
                    allSheepCausesOfDeathTypes.annet && (
                    <ListItem key={`dod-sau-item-2-4`}>
                      <ListItemText primary={"Annet"} />
                    </ListItem>
                  )}
                </ul>
              </li>

              <li key={`dod-sau-3`}>
                <ul>
                  <ListSubheader
                    style={{ fontWeight: "bold" }}
                  >{`Farge på sauen`}</ListSubheader>

                  {observation["observationDetails"]["dodSau"]["fargePaSau"] ===
                    allSheepColorTypes.hvitOrGra && (
                    <ListItem key={`dod-sau-item-3-0`}>
                      <ListItemText primary={"Hvit/grå"} />
                    </ListItem>
                  )}

                  {observation["observationDetails"]["dodSau"]["fargePaSau"] ===
                    allSheepColorTypes.brun && (
                    <ListItem key={`dod-sau-item-3-1`}>
                      <ListItemText primary={"Brun"} />
                    </ListItem>
                  )}

                  {observation["observationDetails"]["dodSau"]["fargePaSau"] ===
                    allSheepColorTypes.sort && (
                    <ListItem key={`dod-sau-item-3-2`}>
                      <ListItemText primary={"Sort"} />
                    </ListItem>
                  )}

                  {observation["observationDetails"]["dodSau"]["fargePaSau"] ===
                    allSheepColorTypes.ikkeSpesifisert && (
                    <ListItem key={`dod-sau-item-3-3`}>
                      <ListItemText primary={"Ikke spesifisert"} />
                    </ListItem>
                  )}
                </ul>
              </li>

              <li key={`dod-sau-4`}>
                <ul>
                  <ListSubheader
                    style={{ fontWeight: "bold" }}
                  >{`Farge på eiermerket`}</ListSubheader>

                  {observation["observationDetails"]["dodSau"][
                    "fargePaEiermerke"
                  ] === allOwnerColorTypes.rod && (
                    <ListItem key={`dod-sau-item-4-0`}>
                      <ListItemText primary={"Rødt"} />
                    </ListItem>
                  )}

                  {observation["observationDetails"]["dodSau"][
                    "fargePaEiermerke"
                  ] === allOwnerColorTypes.bla && (
                    <ListItem key={`dod-sau-item-4-1`}>
                      <ListItemText primary={"Blått"} />
                    </ListItem>
                  )}

                  {observation["observationDetails"]["dodSau"][
                    "fargePaEiermerke"
                  ] === allOwnerColorTypes.gul && (
                    <ListItem key={`dod-sau-item-4-2`}>
                      <ListItemText primary={"Gult"} />
                    </ListItem>
                  )}

                  {observation["observationDetails"]["dodSau"][
                    "fargePaEiermerke"
                  ] === allOwnerColorTypes.gronn && (
                    <ListItem key={`dod-sau-item-4-3`}>
                      <ListItemText primary={"Grønt"} />
                    </ListItem>
                  )}

                  {observation["observationDetails"]["dodSau"][
                    "fargePaEiermerke"
                  ] === allOwnerColorTypes.sort && (
                    <ListItem key={`dod-sau-item-4-4`}>
                      <ListItemText primary={"Sort"} />
                    </ListItem>
                  )}

                  {observation["observationDetails"]["dodSau"][
                    "fargePaEiermerke"
                  ] === allOwnerColorTypes.ikkeSpesifisert && (
                    <ListItem key={`dod-sau-item-4-5`}>
                      <ListItemText primary={"Ikke spesifisert"} />
                    </ListItem>
                  )}
                </ul>
              </li>
            </List>
          </div>
        );

      default:
        return "Noe gikk galt";
    }
  };

  // Initializes Leaflet map with tilelayer
  useEffect(() => {
    // Updates the device size dimensions known to the leaflet map; won't display correctly if this is not done
    setTimeout(() => {
      map?.invalidateSize();
    }, 250);

    if (map) {
      // Uses a special tilelayer that supports use of offline/downloaded tiles
      //@ts-ignore
      const tileLayerOffline = L.tileLayer(
        "https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}",
        {
          attribution: '<a href="http://www.kartverket.no/">Kartverket</a>',
        }
      );
      tileLayerOffline.addTo(map);

      // @ts-ignore
      map.on("move", function (e) {
        if (map) {
          const mapSize = map.getSize();
          if (!mapSize["x"] || !mapSize["y"]) {
            map.invalidateSize();
          }
        }
      });
    }
  }, [map]);

  return (
    <MapContainer
      style={{ width: "100%", height: "100%", borderRadius: "10px", zIndex: "1000" }}
      // @ts-ignore
      center={[63.446827, 10.421906]}
      zoom={13}
      whenCreated={(newMap) => {
        newMap.invalidateSize();
        setMap(newMap);
      }}
      zoomControl={true}
    ></MapContainer>
  );
};

export default LeafletMap;
