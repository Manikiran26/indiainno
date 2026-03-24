import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import ProjectDetail from "./ProjectDetail";
import { Layers, Navigation, Loader2, MapPin } from "lucide-react";
import { osmCategoryColors } from "../services/osmService";

// Helper to recenter map when location updates
function RecenterMap({ pos }) {
  const map = useMap();
  useEffect(() => {
    if (pos) {
      map.flyTo([pos.lat, pos.lng], 14, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [pos, map]);
  return null;
}

// Custom Dot Icon for User
const createUserIcon = () => L.divIcon({
  className: "custom-user-icon",
  html: `
    <div class="relative w-5 h-5">
      <span class="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-60"></span>
      <div class="relative w-5 h-5 rounded-full bg-blue-500 border-2 border-white shadow-lg shadow-blue-500/50 flex items-center justify-center">
        <div class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
      </div>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Custom Icon for Infrastructure Nodes
const createInfraIcon = (color) => L.divIcon({
  className: "custom-infra-icon",
  html: `
    <div class="relative group">
      <span class="absolute -inset-2 rounded-full animate-ping opacity-20" style="background-color: ${color}"></span>
      <div class="w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-lg bg-gray-950" style="border-color: ${color}">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
      </div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

export default function MapView({ infraData = [], loading = false, userLocation = null, selectedProject, setSelectedProject, onNavigateToAR }) {
  // Debug Logging for Invalid Markers
  const invalidMarkers = infraData.filter(
    (item) =>
      !item ||
      typeof item.lat !== "number" ||
      typeof item.lng !== "number" ||
      isNaN(item.lat) ||
      isNaN(item.lng)
  );
  if (invalidMarkers.length > 0) {
    console.warn("Invalid markers filtered:", invalidMarkers);
  }

  console.log("Infra Data Received:", infraData?.length);

  const mapCenter = userLocation ? [userLocation.lat, userLocation.lng] : [28.6139, 77.2090];

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Map Section */}
      <div className="flex-1 relative">
        <MapContainer
          center={mapCenter}
          zoom={14}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Infrastructure Markers */}
          {infraData.filter(
            (item) =>
              item &&
              typeof item.lat === "number" &&
              typeof item.lng === "number" &&
              !isNaN(item.lat) &&
              !isNaN(item.lng)
          ).map((p) => (
            <Marker
              key={p.id}
              position={[p.lat, p.lng]}
              icon={createInfraIcon(osmCategoryColors[p.category] || "#94a3b8")}
              eventHandlers={{
                click: () => setSelectedProject(p),
              }}
            >
              <Popup className="custom-popup">
                <div className="p-3 min-w-[200px] bg-gray-950/90 backdrop-blur-lg border border-white/10 rounded-lg">
                  <h3 className="font-black text-white text-xs uppercase tracking-wider mb-2 border-b border-white/5 pb-1">
                    {p.name}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-gray-500 uppercase">Budget</span>
                      <span className="text-[9px] text-cyan-400 font-bold font-mono">{p.budget}</span>
                    </div>
                    <p className="text-[9px] text-gray-400 italic leading-tight line-clamp-2">
                      "{p.impact}"
                    </p>
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                      <span 
                        className="w-1.5 h-1.5 rounded-full animate-pulse" 
                        style={{ backgroundColor: osmCategoryColors[p.category] }}
                      />
                      <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest">
                        {p.category}
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {userLocation && (
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={createUserIcon()}
              zIndexOffset={1000}
            />
          )}

          {userLocation && <RecenterMap pos={userLocation} />}
        </MapContainer>

        {/* HUD Elements */}
        <div className="absolute top-6 left-6 z-[1000] flex flex-col gap-4">
          <div className="bg-gray-950/80 backdrop-blur-md border border-cyan-500/30 p-4 rounded-xl shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500/20 blur-md rounded-full animate-pulse" />
                <MapPin className="text-cyan-400 relative" size={20} />
              </div>
              <div>
                <h1 className="text-xs font-black tracking-[0.2em] text-cyan-400 uppercase">
                  OSM Grid Active
                </h1>
                <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={10} className="animate-spin text-cyan-400" />
                      Updating Live Grid...
                    </span>
                  ) : (
                    `Tracking ${infraData.length} site nodes`
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-950/80 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl w-48">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-white/5 pb-2">
              Infrastructure Key
            </h3>
            <div className="space-y-2">
              {Object.entries(osmCategoryColors).map(([cat, color]) => (
                <div key={cat} className="flex items-center gap-2 group cursor-default">
                  <div 
                    className="w-1.5 h-1.5 rounded-full transition-shadow duration-300 group-hover:shadow-[0_0_8px_rgba(255,255,255,0.5)]" 
                    style={{ backgroundColor: color }} 
                  />
                  <span className="text-[10px] text-gray-400 uppercase font-mono group-hover:text-gray-200 transition-colors">
                    {cat}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Status Info */}
        <div className="absolute bottom-6 left-6 z-[1000]">
           <div className="bg-gray-950/80 backdrop-blur-md border border-white/5 px-4 py-2 rounded-full shadow-xl flex items-center gap-3">
             <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
               <Navigation size={12} className="text-cyan-500" />
               <span>LOC_VEC: {userLocation ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` : "WAITING GPS..."}</span>
             </div>
           </div>
        </div>
      </div>

      {/* Detail Panel */}
      {selectedProject ? (
        <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} />
      ) : (
        <div className="w-96 border-l border-white/5 bg-gray-950/50 backdrop-blur-3xl flex flex-col items-center justify-center text-center p-10 relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[120px] rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 blur-[120px] rounded-full -ml-32 -mb-32" />

          <div className="relative">
            <div className="w-20 h-20 rounded-[2.5rem] bg-gray-900 border border-white/10 flex items-center justify-center mb-8 shadow-2xl group transition-all duration-500 hover:border-cyan-500/40">
              <Layers size={32} className="text-gray-600 group-hover:text-cyan-400 transition-colors duration-500" />
            </div>
          </div>
          
          <h2 className="text-lg font-black tracking-tight text-white mb-2 uppercase tracking-[0.1em]">
            Hyper-Local Engine
          </h2>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-[0.2em] mb-4">
            Civic Transparency
          </p>
          <p className="text-gray-400 text-xs leading-relaxed max-w-[240px] font-mono opacity-80">
            SECURE LIVE FEED. SELECT A MAPPED COORDINATE TO ANALYZE REAL-WORLD METRICS AND SERVICE STATUS.
          </p>
          
          <div className="mt-10 pt-10 border-t border-white/5 w-full flex flex-col gap-3">
             <div className="flex justify-between text-[10px] text-gray-600">
                <span className="uppercase tracking-widest">Data Source</span>
                <span className="font-bold text-gray-400 uppercase">OSM / Overpass</span>
             </div>
             <div className="flex justify-between text-[10px] text-gray-600">
                <span className="uppercase tracking-widest">Sync Status</span>
                <span className="font-bold text-cyan-500 uppercase tracking-tighter">Verified</span>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
