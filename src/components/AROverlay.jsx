// src/components/AROverlay.jsx
// Simulated AR-like overlay using camera feed + floating project info cards

import { useState, useRef, useEffect } from "react";
import { Camera, Layers, Navigation, Wifi, WifiOff } from "lucide-react";
import { projects, categoryColors } from "../data/projects";

const arCards = [
  { project: projects[0], x: "12%", y: "20%", distance: "340m" },
  { project: projects[1], x: "62%", y: "15%", distance: "820m" },
  { project: projects[2], x: "78%", y: "50%", distance: "1.1km" },
  { project: projects[4], x: "20%", y: "60%", distance: "2.0km" },
];

export default function AROverlay() {
  const [active, setActive] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cameraErr, setCameraErr] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startAR = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setActive(true);
    } catch {
      setCameraErr(true);
      setActive(true); // still show simulated overlay
    }
  };

  const stopAR = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setActive(false);
    setSelectedCard(null);
  };

  useEffect(() => () => stopCamera(), []);
  const stopCamera = () => streamRef.current?.getTracks().forEach((t) => t.stop());

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {!active ? (
        // Launch screen
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <div className="w-24 h-24 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center mb-6">
            <Layers size={40} className="text-cyan-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">AR Infrastructure View</h1>
          <p className="text-gray-500 text-sm max-w-xs mb-8">
            Point your camera at any direction to see nearby government projects overlaid in real-time.
          </p>
          <button
            onClick={startAR}
            className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold rounded-xl transition-all text-sm"
          >
            <Camera size={16} />
            Launch AR View
          </button>
          <p className="text-gray-700 text-xs mt-4">Works best in mobile browser</p>
        </div>
      ) : (
        // AR View
        <div className="relative flex-1 bg-black overflow-hidden">
          {/* Camera feed */}
          {!cameraErr ? (
            <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" muted playsInline />
          ) : (
            // Fallback: simulated environment
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(180deg, #0c1a2e 0%, #0f2a1a 50%, #1a0f0a 100%)",
              }}
            >
              <div className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2306b6d4' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                }}
              />
            </div>
          )}

          {/* Dark overlay tint */}
          <div className="absolute inset-0 bg-black/30" />

          {/* HUD: top bar */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/60 to-transparent">
            <div className="flex items-center gap-2 text-xs text-cyan-400">
              <Layers size={12} className="animate-pulse" />
              <span className="font-bold uppercase tracking-widest">AR MODE ACTIVE</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-[10px] text-green-400">
                <Wifi size={10} />
                <span>GPS LOCKED</span>
              </div>
              <button
                onClick={stopAR}
                className="text-xs px-3 py-1 bg-red-500/20 border border-red-500/40 text-red-400 rounded-full"
              >
                EXIT
              </button>
            </div>
          </div>

          {/* AR Cards */}
          {arCards.map(({ project, x, y, distance }, i) => {
            const color = categoryColors[project.category];
            const isSelected = selectedCard === i;

            return (
              <div
                key={i}
                className="absolute"
                style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
              >
                {/* Connector dot */}
                <div
                  className="absolute w-2 h-2 rounded-full border"
                  style={{
                    backgroundColor: color + "66",
                    borderColor: color,
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <span className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: color + "44" }} />
                </div>

                <button
                  onClick={() => setSelectedCard(isSelected ? null : i)}
                  className={`
                    relative ml-3 mt-1 backdrop-blur-sm border rounded-xl px-3 py-2 text-left transition-all duration-200
                    ${isSelected ? "w-52" : "w-36"}
                  `}
                  style={{
                    backgroundColor: "#0d1117cc",
                    borderColor: color + "60",
                    boxShadow: isSelected ? `0 0 20px ${color}30` : "none",
                  }}
                >
                  <div
                    className="text-[9px] font-bold uppercase tracking-widest mb-1"
                    style={{ color }}
                  >
                    {project.category}
                  </div>
                  <div className="text-xs font-semibold text-white leading-tight">
                    {project.name}
                  </div>
                  <div className="flex items-center gap-1 mt-1.5">
                    <Navigation size={9} className="text-gray-500" />
                    <span className="text-[10px] text-gray-400">{distance}</span>
                    <span className="ml-auto text-[10px]" style={{ color }}>
                      {project.completion}%
                    </span>
                  </div>

                  {isSelected && (
                    <div className="mt-2 pt-2 border-t text-[10px] text-gray-400 leading-relaxed" style={{ borderColor: color + "30" }}>
                      <p>Budget: <span className="text-white">{project.budget}</span></p>
                      <p className="mt-1">{project.impact}</p>
                    </div>
                  )}

                  {/* Progress bar */}
                  <div className="mt-2 h-0.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${project.completion}%`, backgroundColor: color }}
                    />
                  </div>
                </button>
              </div>
            );
          })}

          {/* Compass / heading indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <div className="flex items-center gap-1 text-[10px] text-gray-400 bg-black/50 rounded-full px-4 py-1.5 border border-gray-700">
              {["W", "NW", "N", "NE", "E", "SE", "S", "SW"].map((dir, i) => (
                <span
                  key={dir}
                  className={`px-1 ${i === 2 ? "text-cyan-400 font-bold" : ""}`}
                >
                  {dir}
                </span>
              ))}
            </div>
            <p className="text-[9px] text-gray-600">Tap a card to expand</p>
          </div>

          {cameraErr && (
            <div className="absolute bottom-20 left-4 right-4 flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-2 text-xs text-yellow-400">
              <WifiOff size={12} />
              Camera unavailable — showing simulated AR overlay
            </div>
          )}
        </div>
      )}
    </div>
  );
}
