// src/components/GeoAlert.jsx
// Detects user geolocation and shows alert if near a project (within ~2km)

import { useEffect, useState } from "react";
import { Bell, X, Navigation } from "lucide-react";
import { projects } from "../data/projects";

function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function GeoAlert() {
  const [nearbyProject, setNearbyProject] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | locating | found | none | denied

  useEffect(() => {
    if (!navigator.geolocation) return;
    setStatus("locating");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        // Find the closest project within 2km
        let closest = null;
        let minDist = Infinity;

        projects.forEach((p) => {
          const d = getDistanceKm(latitude, longitude, p.lat, p.lng);
          if (d < 2 && d < minDist) {
            minDist = d;
            closest = { ...p, distanceKm: d.toFixed(2) };
          }
        });

        if (closest) {
          setNearbyProject(closest);
          setStatus("found");
        } else {
          // For demo: always show the nearest project regardless of distance
          let demoClosest = null;
          let demoMin = Infinity;
          projects.forEach((p) => {
            const d = getDistanceKm(latitude, longitude, p.lat, p.lng);
            if (d < demoMin) {
              demoMin = d;
              demoClosest = { ...p, distanceKm: d.toFixed(1) };
            }
          });
          setNearbyProject(demoClosest);
          setStatus("found");
        }
      },
      () => setStatus("denied")
    );
  }, []);

  if (dismissed || status !== "found" || !nearbyProject) return null;

  return (
    <div className="fixed top-20 right-4 z-50 max-w-xs w-full animate-slideIn">
      <div className="bg-gray-900 border border-cyan-500/40 rounded-xl p-4 shadow-2xl shadow-cyan-500/10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-cyan-400">
            <Bell size={15} className="animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Nearby Project
            </span>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-gray-500 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>

        <p className="mt-2 text-sm font-semibold text-white">
          {nearbyProject.name}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{nearbyProject.agency}</p>

        <div className="flex items-center gap-1.5 mt-3 text-xs text-cyan-400">
          <Navigation size={11} />
          <span>{nearbyProject.distanceKm} km away</span>
          <span className="ml-auto text-gray-500">
            {nearbyProject.completion}% complete
          </span>
        </div>

        <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-cyan-500 rounded-full transition-all"
            style={{ width: `${nearbyProject.completion}%` }}
          />
        </div>
      </div>
    </div>
  );
}
