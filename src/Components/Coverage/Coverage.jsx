import React, { useState, useEffect } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  CircleMarker,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useLoaderData } from "react-router";

// 🔥 Map fly helper component
const FlyToLocation = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo(center, 10, {
        duration: 1.5,
      });
    }
  }, [center, map]);

  return null;
};

const Coverage = () => {
  const allCenters = useLoaderData();

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPosition, setSelectedPosition] = useState(null);

  const defaultPosition = [23.6850, 90.3563];

  // 🔍 Filter
  const filteredCenters = searchQuery
    ? allCenters.filter((center) =>
        center.district
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : allCenters;

  // 🎯 Handle search click
  const handleSearch = () => {
    setSearchQuery(searchInput);

    const found = allCenters.find((center) =>
      center.district
        .toLowerCase()
        .includes(searchInput.toLowerCase())
    );

    if (found) {
      setSelectedPosition([found.latitude, found.longitude]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-2 space-y-4">

      {/* Title */}
      <h1 className="text-3xl mt-10 font-bold text-center">
        Our Coverage Area
      </h1>

   
        <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-2xl mx-auto px-4">
    {/* Search Input with Icon */}
    <div className="relative flex-1 min-w-[200px]">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        </div>
        <input
        type="text"
        placeholder="Search by district, city, or zip code..."
        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 outline-none text-gray-700 placeholder-gray-400 bg-white shadow-sm hover:shadow-md"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && setSearchQuery(searchInput)}
        />
        {/* Clear button inside input */}
        {searchInput && (
        <button
            onClick={() => {
            setSearchInput("");
            setSearchQuery("");
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
        >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
        )}
    </div>

    {/* Search Button */}
    <button
        onClick={() => setSearchQuery(searchInput)}
        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
    >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Search
    </button>

    {/* Reset Button */}
    <button
        onClick={() => {
        setSearchInput("");
        setSearchQuery("");
        }}
        className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2 border border-gray-200"
    >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Reset
    </button>
    </div>

      {/* Map */}
      <div className="rounded-2xl overflow-hidden shadow-lg border">
        <MapContainer
          center={defaultPosition}
          zoom={7}
          scrollWheelZoom={true}
          className="h-[450px] w-full z-0"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* 🔥 Fly animation */}
          <FlyToLocation center={selectedPosition} />

          {allCenters.map((center, index) => {
            const isHighlighted =
              searchQuery &&
              center.district
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

            return isHighlighted ? (
              <CircleMarker
                key={index}
                center={[center.latitude, center.longitude]}
                radius={12}
                pathOptions={{
                  color: "red",
                  fillColor: "red",
                  fillOpacity: 0.6,
                }}
              >
                <Popup>
                  <strong>{center.district}</strong> <br />
                  {center.covered_area.join(", ")}
                </Popup>
              </CircleMarker>
            ) : (
              <Marker
                key={index}
                position={[center.latitude, center.longitude]}
              >
                <Popup>
                  <strong>{center.district}</strong> <br />
                  {center.covered_area.join(", ")}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCenters.map((center, index) => (
          <div
            key={index}
            onClick={() =>
              setSelectedPosition([
                center.latitude,
                center.longitude,
              ])
            }
            className={`p-4 rounded-xl border cursor-pointer transition duration-300 hover:shadow-lg ${
              searchQuery &&
              center.district
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
                ? "bg-red-100 border-red-400"
                : "bg-base-100"
            }`}
          >
            <h2 className="font-semibold text-lg">
              {center.district}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {center.covered_area.join(", ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Coverage;