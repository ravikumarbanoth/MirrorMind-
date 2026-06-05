import React, { useState, useEffect } from "react";
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Award,
  Bookmark,
  CalendarDays,
  Target
} from "lucide-react";

interface SemesterData {
  academic: number;
  behavioral: number;
  technical: number;
  leadership: number;
  communication: number;
  career: number;
  memo: string;
}

export default function DigitalTwinMemory() {
  const [selectedSemester, setSelectedSemester] = useState<string>("Semester 4");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const HISTORY: Record<string, SemesterData> = {
    "Semester 1": {
      academic: 60,
      behavioral: 70,
      technical: 65,
      leadership: 55,
      communication: 74,
      career: 58,
      memo: "Maya began with initial software syntax. Showed solid discipline and behavioral alignment, but struggled with advanced logical abstractions and algorithms."
    },
    "Semester 2": {
      academic: 65,
      behavioral: 72,
      technical: 70,
      leadership: 60,
      communication: 77,
      career: 64,
      memo: "Discovered passion for UI components and interactive visualizations. Technical ratings scaled as she practiced frontend interface design paradigms."
    },
    "Semester 3": {
      academic: 71,
      behavioral: 74,
      technical: 76,
      leadership: 68,
      communication: 80,
      career: 75,
      memo: "Enrolled in computer widgets research projects. Formated custom database keys. Marked as a highly capable and motivated peer teammate."
    },
    "Semester 4": {
      academic: 75,
      behavioral: 78,
      technical: 82,
      leadership: 75,
      communication: 84,
      career: 84,
      memo: "Excellent coding speeds. Behavioral indicators dropped due to 10% class absence during compiler theory. Needs technical focus."
    },
    "Semester 5 (Proj)": {
      academic: 81,
      behavioral: 84,
      technical: 88,
      leadership: 81,
      communication: 86,
      career: 90,
      memo: "Projected milestones: Advanced neural meshes deployment, full-stack microservice integration, and enterprise leadership assignments."
    },
    "Semester 6 (Proj)": {
      academic: 86,
      behavioral: 91,
      technical: 94,
      leadership: 86,
      communication: 90,
      career: 96,
      memo: "Target placement matrix outcome: Software Solutions Dev Architect specializing in LLMs grounding, REST layers, and visual dashboards."
    }
  };

  const semestersList = Object.keys(HISTORY);
  const currentData = HISTORY[selectedSemester];

  // Auto-play effect to replay student journey automatically
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        const currentIndex = semestersList.indexOf(selectedSemester);
        if (currentIndex < semestersList.length - 1) {
          setSelectedSemester(semestersList[currentIndex + 1]);
        } else {
          // Loop back to start
          setSelectedSemester(semestersList[0]);
        }
      }, 1800);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, selectedSemester]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const resetJourney = () => {
    setIsPlaying(false);
    setSelectedSemester("Semester 1");
  };

  return (
    <div className="bg-white border border-slate-150 rounded-3xl p-6 shadow-sm space-y-6 animate-fadeIn" id="digital-twin-timeline-root">
      
      {/* TIMELINE CONTROLS HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[9px] uppercase tracking-wider font-extrabold text-blue-600 font-mono block">Evolutionary Tracking</span>
          <h3 className="text-xl font-extrabold text-slate-800 font-display mt-0.5 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            <span>Digital Twin Memory Journey</span>
          </h3>
          <p className="text-xs text-slate-500">
            Select a learning milestone index or press the play button to replay your personal GPA & skill development climb from Semester 1 to graduation.
          </p>
        </div>

        {/* TIMELINE SIMULATION TRIGGER ROW */}
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={togglePlay}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition-all ${
              isPlaying
                ? "bg-rose-100 text-rose-700 hover:bg-rose-200"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause Replay</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Replay Growth Journey</span>
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={resetJourney}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* SEMESTER STEPPER GRAPHICAL ROW */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 overflow-x-auto">
        <div className="flex justify-between items-center min-w-[640px] px-4 py-2 relative">
          
          {/* Connector Lane */}
          <div className="absolute left-10 right-10 h-0.5 bg-slate-200 top-[50%] -translate-y-1/2 z-0"></div>

          {semestersList.map((sem, sidx) => {
            const isCurrent = selectedSemester === sem;
            const isCompleted = semestersList.indexOf(selectedSemester) >= sidx;
            return (
              <button
                key={sem}
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setSelectedSemester(sem);
                }}
                className="relative z-10 flex flex-col items-center group"
              >
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono text-[10px] font-black transition-all ${
                  isCurrent
                    ? "bg-indigo-600 border-indigo-700 text-white ring-4 ring-indigo-100 scale-110"
                    : isCompleted
                      ? "bg-emerald-500 border-emerald-600 text-white"
                      : "bg-white border-slate-300 text-slate-500 group-hover:border-slate-400"
                }`}>
                  {sidx + 1}
                </div>
                <span className={`text-[10px] font-bold mt-2 tracking-tight transition-colors ${
                  isCurrent ? "text-indigo-600 font-extrabold" : "text-slate-500 group-hover:text-slate-800"
                }`}>
                  {sem.replace(" (Proj)", "")}
                </span>
                {sem.includes("Proj") && (
                  <span className="text-[8px] uppercase tracking-widest text-[#14B8A6] font-mono font-bold mt-0.5">
                    Projections
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* DETAILED DNA EVOLUTION RADAR STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* GROWTH HISTOGRAM CARD GRAPH */}
        <div className="lg:col-span-8 bg-slate-50 rounded-2xl p-5 border border-slate-150 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Deducted Multi-Category Graph</span>
            <span className="text-xs font-bold text-slate-600">Growth Index for <strong className="text-slate-950 font-black">{selectedSemester}</strong></span>
          </div>

          <div className="space-y-3.5">
            {[
              { label: "Academic DNA", value: currentData.academic, color: "bg-blue-600", note: "Grades & assignment diligence" },
              { label: "Technical DNA", value: currentData.technical, color: "bg-amber-500", note: "Algorithm limits & coding velocity" },
              { label: "Leadership DNA", value: currentData.leadership, color: "bg-[#14B8A6]", note: "Elected coordination & workspace collaboration" },
              { label: "Communication DNA", value: currentData.communication, color: "bg-violet-600", note: "Bilingual translations & public pitches" },
              { label: "Career DNA Match", value: currentData.career, color: "bg-emerald-500", note: "Core company placement probability index" }
            ].map((bar, bidx) => (
              <div key={bidx} className="bg-white p-3 rounded-xl border border-slate-200/50 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-xs">
                <div className="md:w-1/3">
                  <span className="font-bold text-slate-800 block text-[11px]">{bar.label}</span>
                  <span className="text-[9.5px] text-slate-400 italic font-medium block leading-tight">{bar.note}</span>
                </div>
                
                {/* Simulated bar line */}
                <div className="flex-1 space-y-1">
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/40">
                    <div
                      className={`h-full ${bar.color} rounded-full transition-all duration-500`}
                      style={{ width: `${bar.value}%` }}
                    ></div>
                  </div>
                </div>

                <div className="shrink-0 text-right md:w-12">
                  <span className="font-mono font-black text-slate-800 text-sm">{bar.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* INTEGRATED HISTORICAL COUNSELOR NOTES AND INSIGHTS */}
        <div className="lg:col-span-4 bg-[#0F172A] text-white rounded-2xl p-5 border border-slate-800 relative z-10 flex flex-col justify-between min-h-[300px]">
          <div className="absolute top-2 right-2 opacity-15">
            <Sparkles className="w-16 h-16 text-indigo-400" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-1.5 border-b border-slate-800 pb-3">
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                Semester Transcript Memoriam
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Historic Counselor Assessment:</span>
              <p className="text-xs text-slate-200 leading-relaxed font-sans mt-1">
                "{currentData.memo}"
              </p>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-3.5 mt-4 flex items-center justify-between text-[11px] text-indigo-300 font-mono block">
            <span>Verified DNA State:</span>
            <span className="font-bold uppercase tracking-wider text-emerald-400">Locked Baseline</span>
          </div>
        </div>

      </div>

    </div>
  );
}
