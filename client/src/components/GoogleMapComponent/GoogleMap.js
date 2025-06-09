import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import "./google.css";

const libraries = ["places"];

const GoogleMapComponent = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const center = { lat: 50.01538235982394, lng: 36.22740995973911 };

  if (loadError) {
    return <div>Error loading maps: {loadError.message}</div>;
  }

  if (!isLoaded) {
    return <div>Loading Maps...</div>;
  }
  return (
    <div>
      <GoogleMap
        zoom={16}
        center={center}
        mapContainerClassName="map-container"
        options={{
          streetViewControl: false,
          fullscreenControl: false,
          gestureHandling: "greedy",
          mapTypeControl: false,
          zoomControl: false,
          scrollwheel: false,
          disableDoubleClickZoom: true,
          styles: [
            {
              elementType: "labels",
              featureType: "poi.business",
              stylers: [{ visibility: "off" }],
            },
          ],
        }}
      >
        <MarkerF position={center} />
      </GoogleMap>
    </div>
  );
};

export default GoogleMapComponent;
