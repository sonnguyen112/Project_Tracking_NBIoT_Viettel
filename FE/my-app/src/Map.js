import React, { useState, useEffect, useRef, useCallback } from "react";
import { GoogleMap, InfoWindowF, MarkerF } from "@react-google-maps/api";

const DOMAIN_NAME = process.env.REACT_APP_DOMAIN_NAME_BE

// const markers = [
//   {
//     id: 1,
//     name: "Chicago, Illinois",
//     position: { lat: 41.881832, lng: -87.623177 }
//   },
//   {
//     id: 2,
//     name: "Denver, Colorado",
//     position: { lat: 39.739235, lng: -104.99025 }
//   },
//   { 
//     id: 3,
//     name: "Los Angeles, California",
//     position: { lat: 34.052235, lng: -118.243683 }
//   },
//   {
//     id: 4,
//     name: "New York, New York",
//     position: { lat: 40.712776, lng: -74.005974 }
//   }
// ];

function Map() {
  const [activeMarker, setActiveMarker] = useState(null);
  const [markers, setMarkers] = useState([])
  const prevMarkers = useRef("")
  const [isLoadDone, setIsLoadDone] = useState(false)
  const [map, setMap] = useState(null);

  const get_color = (RSRQ) => {
    console.log("Get color")
    if (RSRQ >= -10) {
      return "green"
    }
    else if (RSRQ >= -15){
      return "yellow"
    }
    else{
      return "red"
    }
  }

  useEffect(() => {
    prevMarkers.current = markers
  }, [markers])

  useEffect(() => {
    const interval = setInterval(() => {
      // console.log('This will run every second!');
      fetch(`${DOMAIN_NAME}/info`, {headers:{"ngrok-skip-browser-warning":"1"}})
        .then((res) => res.json())
        .then((json) => {
          // console.log(json)
          let infos = []
          let info;
          for (let i = 0; i < json.length; i++) {
            info = {
              id: json[i].id,
              position: {
                lat: json[i].latitude,
                lng: json[i].longtitude
              },
              RSRP:json[i].RSRP,
              RSRQ:json[i].RSRQ,
              SINR:json[i].SINR,
              PCI:json[i].PCI,
              CELLID:json[i].CELLID
            }
            infos.push(info)
          }

          if (JSON.stringify(infos) !== JSON.stringify(prevMarkers.current)) {
            console.log("Change")
            setMarkers(infos)
          }
          setIsLoadDone(true)
        })
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log(markers)
  }, [markers, setMarkers])

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };

  useEffect(() => {
    if (map) {
      const bounds = new window.google.maps.LatLngBounds();
      console.log("Mark: ", markers)
      markers.forEach(({ position }) => bounds.extend(position));
      map.fitBounds(bounds);
    }
  }, [map, markers])

  const onLoad = useCallback((map) => setMap(map), []);

  const iconMarkerRed = new window.google.maps.MarkerImage(
    "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
    null,
    null,
    null,
    new window.google.maps.Size(64, 64)
  );

  const iconMarkerGreen = new window.google.maps.MarkerImage(
    "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
    null,
    null,
    null,
    new window.google.maps.Size(64, 64)
  );

  const iconMarkerYellow = new window.google.maps.MarkerImage(
    "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
    null,
    null,
    null,
    new window.google.maps.Size(64, 64)
  );

  const getIcon = (color)=>{
    if (color === "red") return iconMarkerRed
    else if (color === "green") return iconMarkerGreen
    else if (color === "yellow") return iconMarkerYellow
  }

  if (isLoadDone) {
    return (
      <GoogleMap
        onLoad={onLoad}
        onClick={() => setActiveMarker(null)}
        mapContainerStyle={{ width: "100vw", height: "100vh" }}
      >
        {markers.map(({ id, position, RSRP, RSRQ, SINR, PCI, CELLID }) => (
          <MarkerF
	    icon= {getIcon(get_color(RSRQ))}
            key={id}
            position={position}
            onClick={() => handleActiveMarker(id)}
          >
            {activeMarker === id ? (
              <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
                <div>
                  <div>Longitude: {position.lng}</div>
                  <div>Latitude: {position.lat}</div>
                  <div>RSRP: {RSRP}</div>
                  <div>RSRQ: {RSRQ}</div>
                  <div>SINR: {SINR}</div>
                  <div>PCI: {PCI}</div>
                  <div>CELLID: {CELLID}</div>
                </div>
              </InfoWindowF>
            ) : null}
          </MarkerF>
        ))}
      </GoogleMap>
    );
  }
  else {
    return
  }
}

export default Map;
