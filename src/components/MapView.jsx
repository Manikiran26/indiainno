// src/components/MapView.jsx
// Interactive map using Leaflet (free, no API key needed)
// To use: npm install leaflet react-leaflet

import { useState, useEffect } from "react";
import { projects, categoryColors } from "../data/projects";
import ProjectDetail from "./ProjectDetail";
import { MapPin, Layers, ZoomIn, ZoomOut, Crosshair } from "lucide-react";

// We'll render a CSS grid-based simulated map if Leaflet isn't available
// Replace this with real MapContainer from react-leaflet in your project

export default function MapView() {
  const [selected, setSelected] = useState(null);
  const [userPos, setUserPos] = useState(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition((pos) => {
      setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  }, []);

  // Normalize lat/lng to % position on the demo map canvas
  // Delhi bounds: lat 28.59–28.67, lng 77.19–77.26
  const toPercent = (lat, lng) => {
    const latMin = 28.59, latMax = 28.67;
    const lngMin = 77.19, lngMax = 77.26;
    return {
      top: `${((latMax - lat) / (latMax - latMin)) * 100}%`,
      left: `${((lng - lngMin) / (lngMax - lngMin)) * 100}%`,
    };
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Map Canvas */}
      <div className="relative flex-1 bg-gray-900 overflow-hidden">
        {/* Map background grid – simulates tile map */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(6,182,212,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6,182,212,0.04) 1px, transparent 1px),
              linear-gradient(rgba(6,182,212,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6,182,212,0.02) 1px, transparent 1px)
            `,
            backgroundSize: `${80 * zoom}px ${80 * zoom}px, ${80 * zoom}px ${80 * zoom}px, ${20 * zoom}px ${20 * zoom}px, ${20 * zoom}px ${20 * zoom}px`,
          }}
        />

        {/* Road-like lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="40%" x2="100%" y2="43%" stroke="#06b6d4" strokeWidth="2" />
          <line x1="0" y1="70%" x2="100%" y2="68%" stroke="#06b6d4" strokeWidth="1.5" />
          <line x1="30%" y1="0" x2="28%" y2="100%" stroke="#06b6d4" strokeWidth="2" />
          <line x1="65%" y1="0" x2="67%" y2="100%" stroke="#06b6d4" strokeWidth="1.5" />
          <line x1="0" y1="55%" x2="30%" y2="55%" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="4,4" />
          <line x1="30%" y1="55%" x2="65%" y2="42%" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="4,4" />
          <line x1="65%" y1="42%" x2="100%" y2="40%" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="4,4" />
        </svg>

        {/* Area labels */}
        {[
          { name: "Connaught Place", top: "38%", left: "48%" },
          { name: "Karol Bagh", top: "22%", left: "28%" },
          { name: "Lajpat Nagar", top: "65%", left: "55%" },
          { name: "Saket", top: "78%", left: "38%" },
        ].map((area) => (
          <span
            key={area.name}
            className="absolute text-[9px] text-gray-600 uppercase tracking-widest pointer-events-none"
            style={{ top: area.top, left: area.left, transform: "translate(-50%, -50%)" }}
          >
            {area.name}
          </span>
        ))}

        {/* Project Markers */}
        {projects.map((p) => {
          const pos = toPercent(p.lat, p.lng);
          const color = categoryColors[p.category];
          const isSelected = selected?.id === p.id;

          return (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className="absolute group"
              style={{ top: pos.top, left: pos.left, transform: "translate(-50%, -100%)", zIndex: isSelected ? 30 : 10 }}
            >
              {/* Pulse ring */}
              <span
                className="absolute -inset-2 rounded-full animate-ping opacity-30"
                style={{ backgroundColor: color }}
              />
              {/* Pin */}
              <div
                className={`relative flex flex-col items-center transition-all duration-200 ${isSelected ? "scale-125" : "scale-100 group-hover:scale-110"}`}
              >
                <div
                  className="w-9 h-9 rounded-full border-2 flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: color + "22", borderColor: color }}
                >
                  <MapPin size={14} style={{ color }} />
                </div>
                <div
                  className="w-0.5 h-3"
                  style={{ backgroundColor: color }}
                />
              </div>
              {/* Tooltip */}
              <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                <div className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-[10px] text-white shadow-lg">
                  {p.name}
                </div>
              </div>
            </button>
          );
        })}

        {/* User position dot */}
        {userPos && (
          <div
            className="absolute w-4 h-4"
            style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
          >
            <span className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-50" />
            <div className="relative w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow" />
          </div>
        )}

        {/* Map controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {[
            { icon: ZoomIn, action: () => setZoom((z) => Math.min(z + 0.3, 2.5)) },
            { icon: ZoomOut, action: () => setZoom((z) => Math.max(z - 0.3, 0.5)) },
            { icon: Crosshair, action: () => setZoom(1) },
          ].map(({ icon: Icon, action }, i) => (
            <button
              key={i}
              onClick={action}
              className="w-9 h-9 bg-gray-800 border border-gray-700 hover:border-cyan-500 rounded flex items-center justify-center text-gray-400 hover:text-cyan-400 transition-all"
            >
              <Icon size={14} />
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-gray-900/90 border border-gray-800 rounded-lg p-3 text-xs">
          <div className="text-gray-500 uppercase tracking-wider mb-2 text-[10px]">Categories</div>
          {Object.entries(categoryColors).map(([cat, color]) => (
            <div key={cat} className="flex items-center gap-2 py-0.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-gray-400">{cat}</span>
            </div>
          ))}
        </div>

        {/* Note about real Mapbox integration */}
        <div className="absolute top-4 left-4 bg-gray-900/90 border border-cyan-500/20 rounded-lg px-3 py-2 text-[10px] text-gray-500 max-w-[200px]">
          <span className="text-cyan-500 font-bold">Demo Map</span> — Replace with{" "}
          <code className="text-cyan-400">react-leaflet</code> or Mapbox GL JS for production
        </div>
      </div>

      {/* Detail Panel */}
      {selected ? (
        <ProjectDetail project={selected} onClose={() => setSelected(null)} />
      ) : (
        <div className="w-80 border-l border-gray-800 bg-gray-900/50 flex flex-col items-center justify-center text-center p-8">
          <Layers size={32} className="text-gray-700 mb-4" />
          <p className="text-gray-500 text-sm">Click a marker on the map to view project details</p>
          <p className="text-gray-700 text-xs mt-2">{projects.length} active projects</p>
        </div>
      )}
    </div>
  );
}
