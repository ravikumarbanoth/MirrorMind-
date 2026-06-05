import React, { useState } from "react";
import {
  TrendingUp,
  Brain,
  Award,
  Zap,
  Info,
  ArrowRight,
  TrendingDown,
  Activity,
  Heart,
  Calendar,
  Trophy,
  Briefcase
} from "lucide-react";

interface GraphNode {
  id: string;
  label: string;
  score: number;
  description: string;
  color: string;
  icon: any;
  causes: string[];
}

export default function StudentLifeGraph() {
  const [selectedNode, setSelectedNode] = useState<string>("challenge");
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const nodes: Record<string, GraphNode> = {
    attendance: {
      id: "attendance",
      label: "Attendance Rate",
      score: 78,
      description: "Class participation and physical seminar presence.",
      color: "from-rose-500 to-red-600 shadow-rose-100",
      icon: Calendar,
      causes: ["Attendance drop of 10% correlates directly with a 1.2 GPA decrease due to missed lesson reinforcement.", "Maintaining attendance above 90% reduces dropout risk score indicators by 84%."]
    },
    challenge: {
      id: "challenge",
      label: "Challenge Completion",
      score: 82,
      description: "Completing daily algorithms, speaking challenges, and learning routines.",
      color: "from-amber-400 to-orange-500 shadow-orange-100",
      icon: Trophy,
      causes: ["Students who complete 20 coding challenges improve overall tech employability scores by 18%!", "Completing 1 weekly challenge boosts student self-study engagement metrics by 2.4 hours/week."]
    },
    skill: {
      id: "skill",
      label: "Skill Growth (DNA)",
      score: 74,
      description: "Mastering practical modern tools like Python, SQL, and PyTorch.",
      color: "from-teal-400 to-emerald-500 shadow-teal-100",
      icon: Zap,
      causes: ["Every 5 practical skills mastered scales your portfolio readiness rating by 14%.", "Focusing on Technical DNA gaps reduces average onboarding ramp-up times during corporate hiring by 4 weeks."]
    },
    academic: {
      id: "academic",
      label: "Academic GPA",
      score: 81,
      description: "Semester grading, internal subjects marks, and test scores.",
      color: "from-blue-500 to-indigo-600 shadow-blue-100",
      icon: Brain,
      causes: ["Maintaining a GPA above 3.5 unlocks access to top-tier enterprise machine learning roles.", "Higher GPA scores reinforce cognitive self-confidence, raising interview performance by 22%."]
    },
    career: {
      id: "career",
      label: "Career Readiness",
      score: 71,
      description: "Matching skills to modern domains like Computer Vision or LLM engineering.",
      color: "from-indigo-500 to-purple-600 shadow-indigo-100",
      icon: Briefcase,
      causes: ["Completing a specialized domain roadmap boosts career relevance match ratings from 55% to 88%.", "Sustained career focus aligns peer scores, opening direct fast-tracked recruiter interview gateways."]
    },
    employability: {
      id: "employability",
      label: "Employability Index",
      score: 71,
      description: "Total score measuring corporate placement readiness and expert confidence.",
      color: "from-emerald-500 to-teal-600 shadow-emerald-100",
      icon: Award,
      causes: ["An employability index of 85% or higher guarantees immediate placement probability matching.", "Every 10% increase in employability translates directly into a estimated 20% higher freshman starting slot salary."]
    }
  };

  const selectedNodeData = nodes[selectedNode];

  return (
    <div className="bg-white border border-slate-150 rounded-3xl p-6 shadow-sm space-y-6 animate-fadeIn" id="student-life-graph-root">
      
      {/* HEADER SECTION */}
      <div>
        <span className="text-[9px] uppercase tracking-wider font-extrabold text-blue-600 font-mono block">Causal Logic Flowchart</span>
        <h3 className="text-xl font-extrabold text-slate-800 font-display mt-0.5">
          Student Life Graph & Causal Intelligence Engine
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Explore how early behavioral parameters cascade into down-stream achievements, career readiness, and ultimate employability. Click on any node to view causal math insights.
        </p>
      </div>

      {/* SVG INTERACTIVE FLOW CHART AREA */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/50 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-2 right-2 flex items-center gap-1.5 text-[9px] bg-white px-2.5 py-1 rounded-full border border-slate-200 text-slate-500 font-mono">
          <Activity className="w-3 h-3 text-indigo-500 animate-pulse" />
          <span>Interactive Node Mesh Map</span>
        </div>

        {/* NODE RENDERING MESH (Simulated as responsive structural flowchart layout) */}
        <div className="w-full max-w-4xl py-6 grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-2 relative z-10 self-center">
          
          {Object.values(nodes).map((node, index, arr) => {
            const Icon = node.icon;
            const isSelected = selectedNode === node.id;
            const isHovered = hoveredNode === node.id;
            
            return (
              <div key={node.id} className="flex flex-col items-center relative">
                
                {/* Visual connectors pointing to the right (only visible on large screens except for the last node) */}
                {index < arr.length - 1 && (
                  <div className="hidden md:block absolute top-7 left-[75%] w-full h-[3px] bg-slate-200 z-0">
                    <div className="absolute right-0 -top-1 w-2.5 h-2.5 border-t-3 border-r-3 border-slate-300 transform rotate-45"></div>
                    <div className={`h-full bg-gradient-to-r from-blue-500 to-teal-400 absolute left-0 transition-all duration-300 ${isSelected || isHovered ? "w-full animate-pulse" : "w-0"}`}></div>
                  </div>
                )}

                {/* Node bubble */}
                <button
                  type="button"
                  onClick={() => setSelectedNode(node.id)}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${node.color} text-white flex items-center justify-center shadow-lg relative z-10 transition-all duration-300 ${isHovered || isSelected ? "scale-110 ring-4 ring-offset-2 ring-indigo-500" : "opacity-90 hover:opacity-100"}`}
                >
                  <Icon className="w-6 h-6 shrink-0" />
                  {/* Floating active dot */}
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white animate-bounce"></span>
                  )}
                </button>

                {/* Node Label */}
                <div className="mt-3.5 text-center px-1">
                  <span className="text-[10px] font-black text-slate-800 tracking-tight block">
                    {node.label}
                  </span>
                  <span className="text-[9px] text-[#22C55E] font-extrabold font-mono mt-0.5 block bg-green-50 px-1.5 py-0.5 rounded-full inline-block">
                    {node.score}% Rating
                  </span>
                </div>
              </div>
            );
          })}

        </div>

        {/* Visual Line connector guide for mobile */}
        <p className="text-[9px] text-slate-400 font-mono italic md:hidden mt-2 text-center">
          Flow direction: Attendance &rarr; Challenge &rarr; Skill &rarr; Academic &rarr; Career &rarr; Employability
        </p>
      </div>

      {/* DETAILED ROOT CAUSE CARD ANALYSIS */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-150 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        
        {/* LEFT COMPONENT: INTUITIVE METER */}
        <div className="md:col-span-4 bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm flex flex-col items-center justify-center text-center space-y-2">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-sm">
            {React.createElement(selectedNodeData.icon, { className: "w-6 h-6 shrink-0" })}
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Active Telemetry Node</span>
            <h4 className="font-extrabold text-slate-800 text-sm">{selectedNodeData.label}</h4>
          </div>
          <span className="text-xl font-black font-mono text-[#2563EB] bg-blue-50 px-3.5 py-1 rounded-full">{selectedNodeData.score}%</span>
          <p className="text-[10.5px] text-slate-400 leading-tight italic">"{selectedNodeData.description}"</p>
        </div>

        {/* RIGHT COMPONENT: INTEGRATED INSIGHTS */}
        <div className="md:col-span-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl max-w-fit">
            <Info className="w-4 h-4 shrink-0" />
            <span>Interactive Causal Modeling (What-If Correlates)</span>
          </div>

          <div className="space-y-3">
            {selectedNodeData.causes.map((cause, cidx) => (
              <div key={cidx} className="bg-white p-3 rounded-xl border border-slate-100 shadow-xs flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                <span className="text-amber-500 font-black mt-0.5 shrink-0 font-mono">▸</span>
                <p>{cause}</p>
              </div>
            ))}
          </div>

          {/* GLOBAL SYSTEM EQUATION STATEMENT */}
          <div className="text-[11px] text-slate-400 font-mono bg-[#0F172A] text-slate-300 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <span>Graph Formula State:</span>
            <span className="text-indigo-300 font-bold">f(Attendance, Challenge) &rarr; Skills &rarr; GPA &rarr; Career Maturation = Employability ({nodes.employability.score}%)</span>
          </div>
        </div>

      </div>

    </div>
  );
}
