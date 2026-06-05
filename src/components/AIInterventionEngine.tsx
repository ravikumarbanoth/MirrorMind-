import React, { useState } from "react";
import {
  ShieldAlert,
  CheckCircle2,
  TrendingUp,
  Brain,
  Wand2,
  Calendar,
  Code,
  FileText,
  User,
  Zap,
  RotateCcw,
  Sparkles
} from "lucide-react";
import { StudentDNAProfile } from "../types";

interface AIInterventionEngineProps {
  student: StudentDNAProfile;
}

interface InterventionTask {
  id: string;
  label: string;
  category: string;
  xpWorth: number;
  checked: boolean;
}

interface InterventionBlock {
  id: string;
  riskName: string;
  riskLevel: "CRITICAL" | "HIGH" | "MEDIUM";
  diagnosis: string;
  impactScoreBefore: number;
  impactScoreCurrent: number;
  tasks: InterventionTask[];
}

export default function AIInterventionEngine({ student }: AIInterventionEngineProps) {
  const [interventions, setInterventions] = useState<InterventionBlock[]>([
    {
      id: "comms-decline",
      riskName: "Declining Communication DNA Parameter",
      riskLevel: "HIGH",
      diagnosis: `Verbal scores dropped by 8% this block after missing 3 consecutive department seminars and elevator speech practice sessions. Underdeveloped presentation limits have been identified as a significant corporate barrier.`,
      impactScoreBefore: 62,
      impactScoreCurrent: 62,
      tasks: [
        { id: "comms-1", label: "7-Day Speaking & Elocution Pitch Challenge", category: "Daily Arena", xpWorth: 180, checked: false },
        { id: "comms-2", label: "Deliver 1 Classroom white-boarding Presentation", category: "Advising Task", xpWorth: 250, checked: false },
        { id: "comms-3", label: "Log 1 Studentmind Reflection Journal script", category: "Reflection", xpWorth: 100, checked: false }
      ]
    },
    {
      id: "low-readiness",
      riskName: "Insufficient Corporate Placement Readiness",
      riskLevel: "CRITICAL",
      diagnosis: "Current portfolio masteries lack verified algorithmic competencies. Failing to publish projects leaves student in the bottom 40% of standard recruitment categories.",
      impactScoreBefore: 58,
      impactScoreCurrent: 58,
      tasks: [
        { id: "readiness-1", label: "Execute Resume Audit challenge", category: "Placement Coach", xpWorth: 200, checked: false },
        { id: "readiness-2", label: "Complete 1 Video-Mock Interview Simulator with peer grading", category: "Diligence Task", xpWorth: 300, checked: false },
        { id: "readiness-3", label: "Optimize LinkedIn landing cards & publish 3 github repositories", category: "Social Growth", xpWorth: 150, checked: false }
      ]
    }
  ]);

  const [simulatedScoreBoost, setSimulatedScoreBoost] = useState<number>(0);

  const handleToggleTask = (blockId: string, taskId: string) => {
    setInterventions(prev => {
      return prev.map(block => {
        if (block.id !== blockId) return block;
        
        let completedAddGroup = 0;
        const newTasks = block.tasks.map(t => {
          if (t.id === taskId) {
            const nextVal = !t.checked;
            completedAddGroup += nextVal ? 5 : -5;
            return { ...t, checked: nextVal };
          }
          return t;
        });

        // Update current score tracker dynamically
        const updatedCurrent = Math.min(100, Math.max(block.impactScoreBefore, block.impactScoreCurrent + completedAddGroup));
        setSimulatedScoreBoost(prev => Math.max(0, prev + completedAddGroup));

        return {
          ...block,
          tasks: newTasks,
          impactScoreCurrent: updatedCurrent
        };
      });
    });
  };

  const handleResetInterventions = () => {
    setSimulatedScoreBoost(0);
    setInterventions([
      {
        id: "comms-decline",
        riskName: "Declining Communication DNA Parameter",
        riskLevel: "HIGH",
        diagnosis: `Verbal scores dropped by 8% this block after missing 3 consecutive department seminars and elevator speech practice sessions. Underdeveloped presentation limits have been identified as a significant corporate barrier.`,
        impactScoreBefore: 62,
        impactScoreCurrent: 62,
        tasks: [
          { id: "comms-1", label: "7-Day Speaking & Elocution Pitch Challenge", category: "Daily Arena", xpWorth: 180, checked: false },
          { id: "comms-2", label: "Deliver 1 Classroom white-boarding Presentation", category: "Advising Task", xpWorth: 250, checked: false },
          { id: "comms-3", label: "Log 1 Studentmind Reflection Journal script", category: "Reflection", xpWorth: 100, checked: false }
        ]
      },
      {
        id: "low-readiness",
        riskName: "Insufficient Corporate Placement Readiness",
        riskLevel: "CRITICAL",
        diagnosis: "Current portfolio masteries lack verified algorithmic competencies. Failing to publish projects leaves student in the bottom 40% of standard recruitment categories.",
        impactScoreBefore: 58,
        impactScoreCurrent: 58,
        tasks: [
          { id: "readiness-1", label: "Execute Resume Audit challenge", category: "Placement Coach", xpWorth: 200, checked: false },
          { id: "readiness-2", label: "Complete 1 Video-Mock Interview Simulator with peer grading", category: "Diligence Task", xpWorth: 300, checked: false },
          { id: "readiness-3", label: "Optimize LinkedIn landing cards & publish 3 github repositories", category: "Social Growth", xpWorth: 150, checked: false }
        ]
      }
    ]);
  };

  return (
    <div className="bg-white border border-slate-150 rounded-3xl p-6 shadow-sm space-y-6 animate-fadeIn" id="intervention-engine-root">
      
      {/* HEADER COGNITIVE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[9px] uppercase tracking-wider font-extrabold text-rose-600 font-mono block">Mitigation & Action Center</span>
          <h3 className="text-xl font-extrabold text-slate-800 font-display mt-0.5 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <span>AI Intervention & Custom Action Engine</span>
          </h3>
          <p className="text-xs text-slate-500">
            Don't just predict risks—neutralize them. Explore targeted dynamic task structures automatically generated by your cognitive digital twin below.
          </p>
        </div>

        {/* RECOGNITY SCORE STATUS */}
        <div className="flex bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-mono font-bold text-slate-700 items-center gap-2 max-w-fit">
          <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
          <span>Active DNA Buff: <strong className="text-emerald-600 font-black">+{simulatedScoreBoost}%</strong></span>
          <button
            onClick={handleResetInterventions}
            className="ml-3 text-[10px] text-slate-400 hover:text-slate-600 font-normal"
          >
            Reset
          </button>
        </div>
      </div>

      {/* PARENT CARDS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {interventions.map((block) => (
          <div key={block.id} className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-slate-50/50 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className={`text-[9px] font-black font-mono border px-2 py-0.5 rounded-full ${
                  block.riskLevel === "CRITICAL"
                    ? "text-red-700 bg-red-50 border-red-200 animate-pulse"
                    : "text-amber-700 bg-amber-50 border-amber-200"
                }`}>
                  {block.riskLevel} ALERT RISK
                </span>

                {/* Percentage tracking */}
                <div className="text-right text-xs">
                  <span className="text-[9px] uppercase font-bold text-slate-400 font-mono block">Metric State</span>
                  <span className="font-mono font-black text-slate-800">
                    {block.impactScoreBefore}% &rarr; <span className="text-[#22C55E]">{block.impactScoreCurrent}%</span>
                  </span>
                </div>
              </div>

              <h4 className="font-black text-slate-800 text-sm leading-tight">
                {block.riskName}
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
                {block.diagnosis}
              </p>
            </div>

            {/* INTEGRATED INTERACTIVE LIST AREA */}
            <div className="space-y-2.5 pt-3 border-t border-slate-200/50">
              <span className="text-[10px] font-mono font-black text-slate-450 block uppercase tracking-wider">Dynamic Habit Action Plan:</span>
              
              <div className="space-y-2">
                {block.tasks.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => handleToggleTask(block.id, task.id)}
                    className={`w-full text-left p-3 rounded-xl border border-dashed text-xs flex items-start gap-3 transition-all ${
                      task.checked
                        ? "bg-green-50 border-green-300 text-green-800 shadow-2xs"
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      task.checked ? "bg-green-600 border-green-700 text-white" : "border-slate-300 bg-slate-50"
                    }`}>
                      {task.checked && (
                        <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                          <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                        </svg>
                      )}
                    </div>

                    <div className="space-y-0.5 overflow-hidden">
                      <span className={`block font-bold leading-tight ${task.checked ? "line-through opacity-70" : ""}`}>
                        {task.label}
                      </span>
                      <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold tracking-tight text-slate-400">
                        <span className="uppercase text-indigo-500">{task.category}</span>
                        <span>•</span>
                        <span className="text-amber-500">+{task.xpWorth} XP</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
