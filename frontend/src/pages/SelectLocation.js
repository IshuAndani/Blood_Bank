import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, useMap, useMapEvents, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

// City coordinate mapping
const cityMap = {
  Mumbai: [19.0760, 72.8777],
  Delhi: [28.7041, 77.1025],
  Bangalore: [12.9716, 77.5946],
  Hyderabad: [17.3850, 78.4867],
  Kolkata: [22.5726, 88.3639],
  Chennai: [13.0827, 80.2707],
  Pune: [18.5204, 73.8567],
  Jabalpur: [23.1814674, 79.986407],
  Ahmedabad: [23.0225, 72.5714],
  Bhopal: [23.2518, 77.4624],
  Indore: [22.7196, 75.8577]
};

// Component to change view on mount/update
function ChangeMapCenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
}

const LocationPicker = ({ onSelect }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onSelect(e.latlng);
    }
  });

  return position && <Marker position={position} />;
};

const SelectLocation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const city = location.state?.city;
  const [selectedCoords, setSelectedCoords] = useState(null);
  const defaultCenter = [22.9734, 78.6569]; // fallback: India center
  const cityCenter = cityMap[city] || defaultCenter;

  const handleConfirm = () => {
    if (!selectedCoords) return alert('Please select a location on the map.');
    navigate(`/create/${location.state?.place}`, { state: selectedCoords });
  };

  return (
    <div className="container mt-4">
      <h4>Select Location for {city}</h4>
      <div className="my-3" style={{ height: '400px' }}>
        <MapContainer
          center={cityCenter}
          zoom={13}
          scrollWheelZoom
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ChangeMapCenter center={cityCenter} />
          <LocationPicker onSelect={setSelectedCoords} />
        </MapContainer>
      </div>
      <button className="btn btn-primary" onClick={handleConfirm}>
        Confirm Location
      </button>
    </div>
  );
};

export default SelectLocation;
