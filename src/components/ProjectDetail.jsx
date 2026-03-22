// src/components/ProjectDetail.jsx
// Side panel shown when a map marker is clicked

import { X, Building2, Calendar, IndianRupee, Users, TrendingUp, Activity } from "lucide-react";
import { categoryColors } from "../data/projects";

export default function ProjectDetail({ project, onClose }) {
  const color = categoryColors[project.category];

  const statusColor = {
    "In Progress": "text-yellow-400 bg-yellow-400/10",
    "Near Complete": "text-green-400 bg-green-400/10",
    "Early Stage": "text-blue-400 bg-blue-400/10",
  }[project.status] || "text-gray-400 bg-gray-400/10";

  return (
    <div className="w-80 border-l border-gray-800 bg-gray-900 flex flex-col overflow-y-auto animate-fadeIn">
      {/* Header */}
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded mb-2"
              style={{ color, backgroundColor: color + "18" }}
            >
              <Activity size={9} />
              {project.category}
            </div>
            <h2 className="text-base font-bold text-white leading-snug">{project.name}</h2>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <Building2 size={10} />
              {project.agency}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-white mt-0.5 flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        <span className={`inline-flex text-[10px] px-2 py-0.5 rounded mt-3 font-medium ${statusColor}`}>
          ● {project.status}
        </span>
      </div>

      {/* Completion bar */}
      <div className="p-5 border-b border-gray-800">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-gray-400">Completion</span>
          <span className="font-bold" style={{ color }}>
            {project.completion}%
          </span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${project.completion}%`, backgroundColor: color }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-gray-600 mt-1.5">
          <span>{project.startDate}</span>
          <span>{project.endDate}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="p-5 border-b border-gray-800 grid grid-cols-2 gap-3">
        <StatBox icon={IndianRupee} label="Budget" value={project.budget} color={color} />
        <StatBox icon={Users} label="Impact" value={project.impact.split(",")[0]} color={color} />
      </div>

      {/* Description */}
      <div className="p-5 border-b border-gray-800">
        <p className="text-xs text-gray-400 leading-relaxed">{project.description}</p>
      </div>

      {/* Impact */}
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <TrendingUp size={12} />
          <span className="uppercase tracking-wider">Civic Impact</span>
        </div>
        <div className="bg-gray-800/60 rounded-lg p-3 text-sm text-white">
          {project.impact}
        </div>
      </div>

      {/* CTA */}
      <div className="p-5 pt-0">
        <button
          className="w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest text-gray-950 transition-all hover:opacity-90 active:scale-95"
          style={{ backgroundColor: color }}
        >
          Subscribe to Updates
        </button>
      </div>
    </div>
  );
}

function StatBox({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-gray-800/50 rounded-lg p-3">
      <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mb-1.5">
        <Icon size={10} style={{ color }} />
        <span className="uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-xs font-bold text-white leading-snug">{value}</p>
    </div>
  );
}
