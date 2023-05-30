import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, InfoWindowF, MarkerF } from "@react-google-maps/api";

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

  useEffect(()=>{
    prevMarkers.current = markers
  }, [markers])

  useEffect(() => {
    const interval = setInterval(() => {
      // console.log('This will run every second!');
      fetch("http://localhost:8000/info")
      .then((res)=>res.json())
      .then((json)=>{
        // console.log(json)
        let infos = []
        let info;
        for (let i = 0; i < json.length; i++){
          info = {
            id : json[i].id,
            name: "Hello",
            position: {
              lat: json[i].latitude,
              lng: json[i].longtitude
            }
          }
          infos.push(info)
        }
        
        if (JSON.stringify(infos) !== JSON.stringify(prevMarkers.current)){
          console.log("Change")
          setMarkers(infos)
        }
        setIsLoadDone(true)
      })
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(()=>{
    console.log(markers)
  }, [markers, setMarkers])

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };

  const handleOnLoad = (map) => {
    const bounds = new window.google.maps.LatLngBounds();
    console.log("Mark: ",markers)
    markers.forEach(({ position }) => bounds.extend(position));
    map.fitBounds(bounds);
  };

  if (isLoadDone){
    return (
      <GoogleMap
        onLoad={handleOnLoad}
        onClick={() => setActiveMarker(null)}
        mapContainerStyle={{ width: "100vw", height: "100vh" }}
      >
        {markers.map(({ id, name, position }) => (
          <MarkerF
            key={id}
            position={position}
            onClick={() => handleActiveMarker(id)}
          >
            {activeMarker === id ? (
              <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
                <div>{name}</div>
              </InfoWindowF>
            ) : null}
          </MarkerF>
        ))}
      </GoogleMap>
    );
  }
  else{
    return
  }
}

export default Map;
