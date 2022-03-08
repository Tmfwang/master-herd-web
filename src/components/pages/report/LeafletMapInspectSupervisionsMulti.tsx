import React, { useEffect, useState } from "react";
import ReactDOMServer from "react-dom/server";

import { supervisionType, fullObservationType } from "../../../types";

// @ts-ignore
import leafletImage from "leaflet-image";

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
  checkIfAllMapsRendered: () => void;
}

// This is the leaflet map component for inspecting a supervision. It draws the recorded path on the map,
// as well as all observations made during the supervision. The observation markers can be clicked to reveal
// more information about it in a popup.
const LeafletMap: React.FC<LeafletMapProps> = ({
  supervision,
  checkIfAllMapsRendered,
}) => {
  const [map, setMap] = useState<Map | undefined>();

  const [renderFinished, setRenderFinished] = useState<boolean>(false);
  const [mapImage, setMapImage] = useState<any>(null);

  const [observationMarkerPairs, setObservationMarkerPairs] = useState<
    markerPair[]
  >([] as markerPair[]);

  const [pathPolyline, setPathPolyline] = useState<Polyline<any>>();

  useEffect(() => {
    if (mapImage) {
      checkIfAllMapsRendered();
    }
  }, [mapImage]);

  useEffect(() => {
    if (renderFinished && map) {
      // @ts-ignore
      leafletImage(map, function (err, canvas) {
        var img = document.createElement("img");
        var dimensions = map.getSize();
        img.width = dimensions.x;
        img.height = dimensions.y;
        img.src = canvas.toDataURL();
        setMapImage(img);
      });
    }
  }, [renderFinished]);

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
        setRenderFinished(true);
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
    <div style={{ width: "100%", height: "100%" }}>
      {!mapImage && (
        <MapContainer
          id="report-map"
          style={{ width: "100%", height: "100%" }}
          // @ts-ignore
          center={[63.446827, 10.421906]}
          zoom={13}
          whenCreated={(newMap) => {
            newMap.invalidateSize();
            setMap(newMap);
          }}
          preferCanvas={true}
          zoomControl={false}
          dragging={false}
          doubleClickZoom={false}
        ></MapContainer>
      )}
      {mapImage && (
        <img
          style={{ width: mapImage.width, height: mapImage.height }}
          src={mapImage.src}
        ></img>
      )}
    </div>
  );
};

export default LeafletMap;
