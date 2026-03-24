// src/data/projects.js
// All mock government infrastructure projects for the demo

// src/data/projects.js
// All mock government infrastructure projects for the demo

export const projects = [
  {
    id: "hospital_001",
    name: "City Hospital Expansion",
    lat: 28.6141,
    lng: 77.2092,
    budget: "₹450 Cr",
    completion: 85,
    impact: "1.2M Citizens",
    category: "Healthcare",
    status: "In Progress",
    agency: "Health Ministry",
    description: "State-of-the-art emergency wing expansion."
  },
  {
    id: "school_001",
    name: "Smart Public School",
    lat: 28.6200,
    lng: 77.2150,
    budget: "₹85 Cr",
    completion: 60,
    impact: "4,500 Students",
    category: "Education",
    status: "In Progress",
    agency: "Education Board",
    description: "Modernized digital campus initiative."
  },
  {
    id: "bridge_001",
    name: "Urban Flyover Project",
    lat: 28.6300,
    lng: 77.2250,
    budget: "₹320 Cr",
    completion: 95,
    impact: "200k Commuters/Day",
    category: "Transport",
    status: "Near Complete",
    agency: "PWD Delhi",
    description: "City center traffic relief bridge."
  },
  {
    id: "metro_001",
    name: "Metro Line Extension Phase 2",
    lat: 28.6100,
    lng: 77.2300,
    budget: "₹1,200 Cr",
    completion: 45,
    impact: "800k Daily Riders",
    category: "Transport",
    status: "In Progress",
    agency: "DMRC",
    description: "Underground metro expansion linking North and South Delhi."
  }
];

export const categoryColors = {
  Transport: "#3b82f6",
  Utilities: "#06b6d4",
  Energy: "#f59e0b",
  Infrastructure: "#8b5cf6",
  Healthcare: "#10b981",
  Education: "#10b981",
  Environment: "#22c55e",
};
