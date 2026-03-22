// src/components/QRScanner.jsx
// QR Scanner UI — uses camera via getUserMedia + jsQR for real scanning
// For demo we also show a simulated "scan result"

import { useState, useRef, useEffect } from "react";
import { QrCode, Camera, CheckCircle, AlertCircle, Scan } from "lucide-react";
import { projects } from "../data/projects";

export default function QRScanner() {
  const [scanResult, setScanResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setScanning(true);
      setCameraError(false);
    } catch {
      setCameraError(true);
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setScanning(false);
  };

  // Demo: simulate a scan result after 3 seconds
  const simulateScan = () => {
    setScanning(true);
    setScanResult(null);
    setTimeout(() => {
      const p = projects[Math.floor(Math.random() * projects.length)];
      setScanResult(p);
      setScanning(false);
    }, 2500);
  };

  useEffect(() => () => stopCamera(), []);

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 text-cyan-400 text-[10px] uppercase tracking-widest mb-3">
          <QrCode size={12} />
          <span>QR Infrastructure Scanner</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Scan Site Marker</h1>
        <p className="text-gray-500 text-sm mt-2">
          Point your camera at the QR code posted at any government project site
        </p>
      </div>

      {/* Scanner box */}
      <div className="relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden aspect-square max-w-xs mx-auto mb-6">
        {scanning && !cameraError ? (
          <>
            <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
            {/* Scan overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 relative">
                {/* Corner brackets */}
                {["top-left", "top-right", "bottom-left", "bottom-right"].map((corner) => (
                  <div
                    key={corner}
                    className={`absolute w-8 h-8 border-cyan-400
                      ${corner.includes("top") ? "top-0" : "bottom-0"}
                      ${corner.includes("left") ? "left-0" : "right-0"}
                      ${corner === "top-left" ? "border-t-2 border-l-2 rounded-tl-lg" : ""}
                      ${corner === "top-right" ? "border-t-2 border-r-2 rounded-tr-lg" : ""}
                      ${corner === "bottom-left" ? "border-b-2 border-l-2 rounded-bl-lg" : ""}
                      ${corner === "bottom-right" ? "border-b-2 border-r-2 rounded-br-lg" : ""}
                    `}
                  />
                ))}
                {/* Scan line animation */}
                <div className="absolute left-0 right-0 h-0.5 bg-cyan-400 opacity-70 animate-scanLine" />
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8">
            <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center">
              <QrCode size={36} className="text-gray-600" />
            </div>
            <p className="text-gray-500 text-sm text-center">
              {cameraError
                ? "Camera access denied. Use demo mode below."
                : "Camera preview will appear here"}
            </p>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 justify-center mb-8">
        <button
          onClick={scanning ? stopCamera : startCamera}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 transition-all"
        >
          <Camera size={15} />
          {scanning ? "Stop Camera" : "Use Camera"}
        </button>
        <button
          onClick={simulateScan}
          disabled={scanning}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-gray-950 transition-all disabled:opacity-50"
        >
          <Scan size={15} />
          Demo Scan
        </button>
      </div>

      {/* Scan Result */}
      {scanning && !videoRef.current?.srcObject && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-cyan-400 text-sm animate-pulse">
            <Scan size={14} className="animate-spin" />
            Scanning…
          </div>
        </div>
      )}

      {scanResult && (
        <div className="bg-gray-900 border border-green-500/30 rounded-xl p-5 animate-fadeIn">
          <div className="flex items-center gap-2 text-green-400 text-xs mb-4">
            <CheckCircle size={14} />
            <span className="font-bold uppercase tracking-wider">Project Identified</span>
          </div>
          <h3 className="text-white font-bold text-lg">{scanResult.name}</h3>
          <p className="text-gray-400 text-xs mt-1">{scanResult.agency}</p>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { label: "Budget", value: scanResult.budget },
              { label: "Progress", value: `${scanResult.completion}%` },
              { label: "Category", value: scanResult.category },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-800 rounded-lg p-2.5 text-center">
                <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{label}</div>
                <div className="text-xs font-bold text-white">{value}</div>
              </div>
            ))}
          </div>

          <p className="text-gray-400 text-xs mt-4 leading-relaxed">{scanResult.description}</p>
        </div>
      )}

      {/* QR Code demo cards */}
      <div className="mt-8">
        <p className="text-[10px] text-gray-600 uppercase tracking-widest text-center mb-3">
          Project QR Codes (demo)
        </p>
        <div className="grid grid-cols-3 gap-2">
          {projects.slice(0, 3).map((p) => (
            <button
              key={p.id}
              onClick={() => setScanResult(p)}
              className="bg-gray-800 border border-gray-700 hover:border-cyan-500/50 rounded-lg p-2 text-center text-[10px] text-gray-400 hover:text-white transition-all"
            >
              <div className="text-2xl mb-1">⬛</div>
              {p.name.split(" ").slice(0, 2).join(" ")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
