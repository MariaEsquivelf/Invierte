import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline } from 'react-leaflet';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});
//this function creates a grid of squares
const createGrid = (square, rows, cols) => {
    // height  of each square
  const latStep = (square[2][0] - square[0][0]) / rows; 
    //  width of each square
  const lngStep = (square[1][1] - square[0][1]) / cols; 

  const gridLines = [];

  // this loop creates the vertical lines
  for (let i = 1; i < cols; i++) {
    const lng = square[0][1] + i * lngStep;
    gridLines.push([[square[0][0], lng], [square[2][0], lng]]);
  }

  // this loop creates the horizontal lines
  for (let j = 1; j < rows; j++) {
    const lat = square[0][0] + j * latStep;
    gridLines.push([[lat, square[0][1]], [lat, square[1][1]]]);
  }

  return gridLines;
};

export default function Map() {
  useEffect(() => {
    return () => {
      const mapContainer = document.getElementById('map');
      if (mapContainer) {
        mapContainer._leaflet_id = null;
      }
    };
  }, []);


  const square = [
    [51.53, -0.1],   // A
    [51.53, -0.08],  // B
    [51.51, -0.08], // C
    [51.51, -0.1]   // D
  ];

  const gridLines = createGrid(square, 4, 4); 

  return (
    <MapContainer id="map" center={[51.505, -0.09]} zoom={14} style={{ height: '100vh', width: '100%' }}>
      <TileLayer 
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
        attribution='&copy; <a href="https://www.esri.com">Esri</a> contributors'
      />
      {square.map((position, index) => (
        <Marker key={index} position={position}>
          <Popup>
            {position[0].toFixed(4)}, {position[1].toFixed(4)}
          </Popup>
        </Marker>
      ))}
      <Polygon positions={square} color="blue" fillColor="cyan" fillOpacity={0.4} />

      {/* lines */}
      {gridLines.map((line, index) => (
        <Polyline key={index} positions={line} color="green" />
      ))}
    </MapContainer>
  );
}
