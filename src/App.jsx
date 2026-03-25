import { useState, useEffect, useRef } from "react";
import MapView from "./components/MapView";
import QRScanner from "./components/QRScanner";
import AROverlay from "./components/AROverlay";
import FeedbackForm from "./components/FeedbackForm";
import ImpactCards from "./components/ImpactCards";
import Navbar from "./components/Navbar";
import GeoAlert from "./components/GeoAlert";
import ProjectExperience from "./components/ProjectExperience";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import ProjectDetail from "./components/ProjectDetail";
import FeedbackList from "./components/FeedbackList";

import { fetchInfrastructure } from "./services/osmService";
import useUserLocation from "./hooks/useUserLocation";
import { demoProjects, getProjectName, generateBudget, generateTimeline, generateProgress } from "./data/demoProjects";

const DEMO_MODE = true;

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activePage, setActivePage] = useState("landing");
  const [infraData, setInfraData] = useState(demoProjects);
  const [loading, setLoading] = useState(false);
  const [selectedARProjectId, setSelectedARProjectId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedMapProject, setSelectedMapProject] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const { location: gpsLocation, error: locError } = useUserLocation(isAuthenticated);
  const [manualLocation, setManualLocation] = useState(null);
  const location = manualLocation || gpsLocation;
  const lastFetchedLocation = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    setIsAuthenticated(false);
    setActivePage("landing");
  };

  const navigateToAR = (projectId) => {
    setSelectedARProjectId(projectId);
    window.history.pushState({}, '', `/?id=${projectId}`);
    setActivePage("ar");
  };

  const navigateToProject = (projectId) => {
    setSelectedProjectId(projectId);
    window.history.pushState({}, '', `/project?id=${projectId}`);
    setActivePage("project");
  };

  useEffect(() => {
    const user = localStorage.getItem("auth");
    if (user) {
      setIsAuthenticated(true);
      setActivePage("map");
    }
  }, []);

  // Parse URL Parameters for bypass (lat/lng/id)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlLat = params.get("lat");
    const urlLng = params.get("lng");
    
    if (urlLat && urlLng) {
      const coord = { lat: parseFloat(urlLat), lng: parseFloat(urlLng) };
      if (!isNaN(coord.lat) && !isNaN(coord.lng)) {
        console.warn("URL COORDINATES DETECTED:", coord);
        setManualLocation(coord);
      }
    }

    // REMOVED URL ID OVERRIDE LOGIC TO ENSURE GEO-ALERT IS PRIMARY
  }, []);

  // Debug/Test Listener for Simulation
  useEffect(() => {
    const handleSimulate = (e) => {
      if (e.detail?.lat && e.detail?.lng) {
        console.warn("SIMULATED LOCATION RECEIVED:", e.detail);
        setManualLocation(e.detail);
      }
    };
    window.addEventListener("simulate-location", handleSimulate);
    return () => window.removeEventListener("simulate-location", handleSimulate);
  }, []);

  useEffect(() => {
    const loadNearbyData = () => {
      if (!location) return;

      // Check if we already fetched for this general area
      if (lastFetchedLocation.current) {
        const dist = Math.sqrt(
          Math.pow(location.lat - lastFetchedLocation.current.lat, 2) +
          Math.pow(location.lng - lastFetchedLocation.current.lng, 2)
        );
        if (dist < 0.005) return; // Skip if moved < ~500m
      }
      
      setLoading(true);
      console.log("DYNAMIC FETCH AT:", location.lat, location.lng);

      const p1 = generateProgress();
      const p2 = generateProgress();
      const nearbyProjects = [
        {
          id: "near_hospital",
          name: getProjectName("healthcare"),
          type: "healthcare",
          category: "healthcare",
          lat: location.lat + 0.0004,
          lng: location.lng + 0.0004,
          progress: p1,
          completion: p1,
          budget: generateBudget("healthcare"),
          timeline: generateTimeline(),
          impact: "Brings advanced emergency response to the local community.",
          status: "Ongoing"
        },
        {
          id: "near_school",
          name: getProjectName("education"),
          type: "education",
          category: "education",
          lat: location.lat + 0.0006,
          lng: location.lng + 0.0002,
          progress: p2,
          completion: p2,
          budget: generateBudget("education"),
          timeline: generateTimeline(),
          impact: "Modern smart classrooms for 500+ students.",
          status: "Ongoing"
        }
      ];

      setInfraData([...nearbyProjects, ...demoProjects]);
      setLoading(false);
      lastFetchedLocation.current = location;
    };
    
    loadNearbyData();
  }, [location]);

  const handleViewAlertDetails = (project) => {
    // Optional delay as requested for UX
    setTimeout(() => {
      setSelectedMapProject(project);
      setActivePage("details");
    }, 1500);
  };

  const pages = {
    map: <MapView infraData={infraData} loading={loading} userLocation={location} onNavigateToAR={navigateToAR} selectedProject={selectedMapProject} setSelectedProject={setSelectedMapProject} />,
    qr: <QRScanner userLocation={location} infraData={infraData} onNavigateToProject={navigateToProject} />,
    ar: <AROverlay userLocation={location} initialProjectId={selectedARProjectId} onClearProject={() => { setSelectedARProjectId(null); window.history.pushState({}, '', '/'); setActivePage("map"); }} />,
    project: <ProjectExperience projectId={selectedProjectId} infraData={infraData} onNavigateToAR={() => navigateToAR(selectedProjectId)} onNavigateToFeedback={() => setActivePage("feedback")} onBack={() => { setSelectedProjectId(null); window.history.pushState({}, '', '/'); setActivePage("map"); }} />,
    details: (
      <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center py-4 relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 to-gray-950">
        <ProjectDetail project={selectedMapProject} onClose={() => setActivePage("map")} />
      </div>
    ),
    feedback: <FeedbackForm onViewFeedbackList={() => setActivePage("feedbackList")} onBackToMap={() => setActivePage("map")} />,
    feedbackList: <FeedbackList onBack={() => setActivePage("feedback")} />,
    impact: <ImpactCards />,
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <h1 style={{ letterSpacing: '0.2em', fontWeight: 900, marginBottom: '0.5rem' }}>HYPERLOCAL ENGINE</h1>
        <p style={{ opacity: 0.8, fontSize: '0.8rem', letterSpacing: '0.1em' }} className="animate-pulse">Connecting to Live Civic Infrastructure Grid...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (activePage === "login") {
      return (
        <LoginPage 
          onLogin={() => { 
            setIsAuthenticated(true); 
            setActivePage("map"); 
            localStorage.setItem("auth", "true"); 
          }} 
          onBack={() => setActivePage("landing")} 
        />
      );
    }
    if (activePage === "signup") {
      return (
        <SignupPage 
          onLogin={() => { 
            setIsAuthenticated(true); 
            setActivePage("map"); 
            localStorage.setItem("auth", "true"); 
          }} 
          onBack={() => setActivePage("landing")} 
        />
      );
    }
    return <LandingPage onNavigate={setActivePage} />;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white font-mono">
      <Navbar activePage={activePage} setActivePage={setActivePage} onLogout={handleLogout} />
      {["map", "qr", "landing"].includes(activePage) && (
        <GeoAlert userLocation={location} infraData={infraData} onViewDetails={handleViewAlertDetails} />
      )}
      <main className="pt-20">{pages[activePage] || pages.map}</main>
    </div>
  );
}
