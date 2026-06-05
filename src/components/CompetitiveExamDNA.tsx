import React, { useState } from "react";
import {
  Award,
  Zap,
  Target,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  RotateCcw,
  BookOpen,
  Send,
  AlertTriangle,
  FileText
} from "lucide-react";

interface ExamConfig {
  id: string;
  name: string;
  readiness: number;
  weakAreas: string[];
  recommended: string;
  dimensions: {
    "Current Affairs": number;
    "Reasoning Aptitude": number;
    "Quantitative Aptitude": number;
    "Communication": number;
    "Domain Knowledge": number;
  };
  mcqs: {
    q: string;
    options: string[];
    answer: string;
    explanation: string;
  }[];
}

export default function CompetitiveExamDNA() {
  const [selectedExamId, setSelectedExamId] = useState<string>("tgpsc");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [submittedMcqs, setSubmittedMcqs] = useState<Record<number, boolean>>({});

  const EXAMS: Record<string, ExamConfig> = {
    tgpsc: {
      id: "tgpsc",
      name: "TGPSC (Telangana Public Service)",
      readiness: 64,
      weakAreas: ["Current Affairs", "Indian Economy"],
      recommended: "7-Day Current Affairs & Economics Sprint",
      dimensions: {
        "Current Affairs": 52,
        "Reasoning Aptitude": 72,
        "Quantitative Aptitude": 68,
        "Communication": 75,
        "Domain Knowledge: Telangana History": 71
      } as any,
      mcqs: [
        {
          q: "Under the Telangana State Industrial Project Approval and Self-Certification System (TS-iPASS) Act, what is the statutory time limit set for issuing approvals?",
          options: ["15 Days", "30 Days", "45 Days", "10 Days"],
          answer: "15 Days",
          explanation: "TS-iPASS is a pioneering self-certification model enacted by the Telangana government setting a strict statutory limit of 15 days, beyond which approval is deemed granted."
        },
        {
          q: "Which major river flowing through Telangana is the site of the Kaleshwaram Lift Irrigation Project (KLIP)?",
          options: ["Godavari", "Krishna", "Musi", "Manairr"],
          answer: "Godavari",
          explanation: "Godavari is the parent river system. KLIP is considered one of the largest multi-stage lift irrigation schemes globally."
        }
      ]
    },
    gate: {
      id: "gate",
      name: "GATE (Graduate Aptitude Test in Eng.)",
      readiness: 76,
      weakAreas: ["Compiler Design", "Discrete Mathematics"],
      recommended: "5-Day Automata & Compiler Sandbox",
      dimensions: {
        "Current Affairs": 60,
        "Reasoning Aptitude": 84,
        "Quantitative Aptitude": 82,
        "Communication": 70,
        "Domain Knowledge: Discrete Math": 62
      } as any,
      mcqs: [
        {
          q: "What is the time complexity to find the shortest path between all pairs of vertices in an arbitrary graph using Floyd-Warshall Algorithm?",
          options: ["O(V³)", "O(V² log V)", "O(E * V)", "O(V + E)"],
          answer: "O(V³)",
          explanation: "Floyd-Warshall relies on dynamic programming loops through intermediate nodes, completing in cubic O(V³) time."
        }
      ]
    },
    upsc: {
      id: "upsc",
      name: "UPSC Civil Services Prelims",
      readiness: 48,
      weakAreas: ["Indian Polity", "Physical Geography"],
      recommended: "10-Day Constitutional Assembly Debates Journal",
      dimensions: {
        "Current Affairs": 55,
        "Reasoning Aptitude": 68,
        "Quantitative Aptitude": 65,
        "Communication": 80,
        "Domain Knowledge: Historical Polity": 44
      } as any,
      mcqs: [
        {
          q: "The basic structure doctrine of the Indian Constitution was explicitly propounded by the Supreme Court in which landmark judgment?",
          options: ["Kesavananda Bharati v. State of Kerala", "Golaknath v. State of Punjab", "Minerva Mills v. Union of India", "Maneka Gandhi v. Union of India"],
          answer: "Kesavananda Bharati v. State of Kerala",
          explanation: "The historic 1973 Kesavananda Bharati judgment established that while parliament can amend the constitution, it cannot violate its basic structure."
        }
      ]
    }
  };

  const activeExam = EXAMS[selectedExamId];

  const handleSelectOption = (qIdx: number, option: string) => {
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: option }));
  };

  const handleCheckAnswer = (qIdx: number) => {
    setSubmittedMcqs(prev => ({ ...prev, [qIdx]: true }));
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setSubmittedMcqs({});
  };

  return (
    <div className="bg-white border border-slate-150 rounded-3xl p-6 shadow-sm space-y-6 animate-fadeIn" id="competitive-exam-dna-root">
      
      {/* HEADER ROW */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#2563EB] font-mono block">Competitive Sandbox</span>
          <h3 className="text-xl font-extrabold text-slate-800 font-display mt-0.5 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            <span>Target Exam DNA & Readiness Metrics</span>
          </h3>
          <p className="text-xs text-slate-500">
            Deploy automated practices targeting prominent State/National competitive exams. Track weak spots and solve daily MCQs with instant feedback.
          </p>
        </div>

        {/* SELECT EXAM DROPDOWN */}
        <div className="flex gap-2">
          {Object.values(EXAMS).map((ex) => (
            <button
              key={ex.id}
              type="button"
              onClick={() => {
                setSelectedExamId(ex.id);
                handleResetQuiz();
              }}
              className={`px-3 py-2 text-xs font-black rounded-xl transition-all ${
                selectedExamId === ex.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                  : "bg-slate-50 text-slate-600 border border-slate-200"
              }`}
            >
              {ex.id.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* READINESS & MATRIX STATS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COMPREHENSIVE PROGRESS CARD */}
        <div className="lg:col-span-4 bg-slate-50 border border-slate-200/60 rounded-2xl p-5 space-y-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-indigo-600 font-mono block">Active Exam Readiness</span>
            <h4 className="font-extrabold text-slate-800 text-sm mt-0.5">{activeExam.name}</h4>
          </div>

          <div className="flex items-center gap-4 py-2">
            <div className="w-20 h-20 rounded-full border-4 border-indigo-600 flex flex-col justify-center items-center bg-white shadow-sm font-mono shrink-0">
              <span className="text-2xl font-black text-indigo-700 leading-none">{activeExam.readiness}%</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Ready</span>
            </div>

            <div className="space-y-1 text-xs">
              <span className="text-[10px] font-black text-rose-600 block uppercase tracking-wider">Major Weak Areas:</span>
              <p className="font-bold text-slate-700">{activeExam.weakAreas.join(", ")}</p>
              <div className="pt-1.5">
                <span className="text-[9px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-black block max-w-fit">
                  RECOMMENDED ACTION:
                </span>
                <p className="text-[10px] text-indigo-700 font-semibold mt-1">{activeExam.recommended}</p>
              </div>
            </div>
          </div>

          {/* ATTACK PLAN STATUS BAR */}
          <div className="border-t border-slate-200/60 pt-3 text-[11px] text-slate-500 font-sans leading-relaxed">
            🎓 Improving your attendance past **85%** and executing study content inside the **StudentMind Studio** are estimated to scale readiness scores to **88%** before recruitment thresholds open.
          </div>
        </div>

        {/* 5-DIMENSIONS RADAR REPLACEMENT */}
        <div className="lg:col-span-8 bg-slate-50 border border-slate-200/60 rounded-2xl p-5 space-y-4">
          <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider block">Specific Competency Dimensions Score:</span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(activeExam.dimensions).map(([dimName, value], idx) => (
              <div key={idx} className="bg-white p-3 rounded-xl border border-slate-100 shadow-xs flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-700 block">{dimName}</span>
                  <div className="w-24 bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${value}%` }}></div>
                  </div>
                </div>
                <span className={`font-mono font-black text-sm px-2 py-0.5 rounded-lg ${value < 60 ? "text-rose-600 bg-rose-50" : "text-[#22C55E] bg-green-50"}`}>{value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* INTERACTIVE PRACTICE MCQS BOX */}
      <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-200/50 pb-2">
          <span className="text-xs bg-indigo-50 text-indigo-700 font-black px-2.5 py-1 rounded-lg font-mono flex items-center gap-1">
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>Daily MCQ Practice Sprint</span>
          </span>
          <button
            onClick={handleResetQuiz}
            className="text-[10px] text-slate-400 hover:text-slate-600 font-mono flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Questions</span>
          </button>
        </div>

        <div className="space-y-5">
          {activeExam.mcqs.map((mcq, qIdx) => {
            const selected = selectedAnswers[qIdx];
            const isSubmitted = submittedMcqs[qIdx];
            const isCorrect = selected === mcq.answer;

            return (
              <div key={qIdx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <span className="text-[10px] font-mono text-slate-450 font-bold uppercase tracking-wider block">Question {qIdx + 1}:</span>
                <p className="text-xs font-black text-slate-800 leading-relaxed">{mcq.q}</p>
                
                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {mcq.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(qIdx, opt)}
                      className={`p-2.5 rounded-lg text-left text-xs transition-colors border ${
                        selected === opt
                          ? isSubmitted
                            ? opt === mcq.answer
                              ? "bg-green-100 border-green-500 text-green-800 font-bold"
                              : "bg-red-100 border-red-500 text-red-800 font-bold"
                            : "bg-indigo-50 border-indigo-500 text-indigo-800 font-bold"
                          : isSubmitted && opt === mcq.answer
                            ? "bg-green-50 border-green-300 text-green-700 font-semibold"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/70"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {/* Submitting check */}
                {!isSubmitted ? (
                  <button
                    type="button"
                    disabled={!selected}
                    onClick={() => handleCheckAnswer(qIdx)}
                    className="mt-2 text-[10px] font-black uppercase text-indigo-600 hover:text-indigo-800 px-4 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors inline-block disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Check Verified Answer
                  </button>
                ) : (
                  <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 animate-fadeIn space-y-2">
                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold">✓ CORRECT</span>
                      ) : (
                        <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-bold">✗ INCORRECT</span>
                      )}
                      <span className="text-[11px] font-mono text-slate-400">Correct: <strong>{mcq.answer}</strong></span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-sans">{mcq.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
