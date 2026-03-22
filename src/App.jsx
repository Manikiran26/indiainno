import { useState } from "react";
import MapView from "./components/MapView";
import QRScanner from "./components/QRScanner";
import AROverlay from "./components/AROverlay";
import FeedbackForm from "./components/FeedbackForm";
import ImpactCards from "./components/ImpactCards";
import Navbar from "./components/Navbar";
import GeoAlert from "./components/GeoAlert";

export default function App() {
  const [activePage, setActivePage] = useState("map");

  const pages = {
    map: <MapView />,
    qr: <QRScanner />,
    ar: <AROverlay />,
    feedback: <FeedbackForm />,
    impact: <ImpactCards />,
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-mono">
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      <GeoAlert />
      <main className="pt-20">{pages[activePage]}</main>
    </div>
  );
}

