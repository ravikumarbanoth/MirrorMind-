import React, { useState } from "react";
import {
  Code,
  Database,
  Building,
  Landmark,
  Microscope,
  Rocket,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Trophy,
  ArrowRight,
  Sparkles,
  Loader2,
  Bookmark
} from "lucide-react";
import { StudentDNAProfile, AppDatabase } from "../types";

interface CareerDNACenterProps {
  student: StudentDNAProfile;
  db: AppDatabase;
  loadDatabase: () => void;
  onEnrollChallenge?: (challengeId: string) => Promise<void>;
}

interface CareerItem {
  id: string;
  title: string;
  readiness: number;
  icon: React.ComponentType<any>;
  color: string;
  textColor: string;
  bgColor: string;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  recommendedCourses: string[];
  recommendedChallenges: { id: string; title: string; xp: number }[];
}

export default function CareerDNACenter({ student, db, loadDatabase, onEnrollChallenge }: CareerDNACenterProps) {
  const [selectedCareerId, setSelectedCareerId] = useState<string>("swe");
  const [enrollingMap, setEnrollingMap] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // List of 6 target careers mapping (Priority 8 & 9)
  const careers: CareerItem[] = [
    {
      id: "swe",
      title: "Software Engineer",
      readiness: 84,
      icon: Code,
      color: "from-blue-600 to-indigo-600",
      textColor: "text-blue-700",
      bgColor: "bg-blue-50 border-blue-150",
      strengths: ["Object-Oriented Programming", "MVC Architecture", "React Front-end Development"],
      weaknesses: ["High-Volume System Design", "Compiler Internals", "Manual Memory Management"],
      missingSkills: ["Kubernetes Microservices", "Docker Containerization", "System Architecture Patterns"],
      recommendedCourses: ["Enterprise System Design Foundations", "Advanced TS Safety Protocols"],
      recommendedChallenges: [
        { id: "ch-coding-1", title: "Complete 5 SQL Masterclass Subqueries", xp: 150 },
        { id: "ch-coding-2", title: "Refactor React Rendering State Hooks", xp: 200 }
      ]
    },
    {
      id: "da",
      title: "Data Analyst",
      readiness: 78,
      icon: Database,
      color: "from-teal-500 to-emerald-600",
      textColor: "text-teal-700",
      bgColor: "bg-teal-50 border-teal-150",
      strengths: ["SQL Relational Queries", "Python Pandas Wrangling", "Jupyter Notebook Visualizations"],
      weaknesses: ["Machine Learning Math Gaps", "Heavy Statistics Formulae Mode", "Realtime Streams Pipeline"],
      missingSkills: ["Numpy Vector Optimization", "Statistical Probability & Distribution Engine"],
      recommendedCourses: ["Predictive Analytics with Python Engine", "Relational Database Normalization Models"],
      recommendedChallenges: [
        { id: "ch-coding-3", title: "Optimize 3 Complex DB Join Operations", xp: 180 },
        { id: "ch-detox-2", title: "Spend 2 Hours Analyzing Data Trends Off-grid", xp: 120 }
      ]
    },
    {
      id: "gov",
      title: "Government Jobs",
      readiness: 71,
      icon: Building,
      color: "from-amber-500 to-orange-600",
      textColor: "text-amber-700",
      bgColor: "bg-amber-50 border-amber-150",
      strengths: ["Indian History Foundations", "Quantitative Aptitude Mindset", "Analytical Reasoning Speed"],
      weaknesses: ["Current Affairs Updates", "Indian Economy Specifics", "Telangana Core Geography"],
      missingSkills: ["Telangana State Formation History Syllabus", "General Studies Mock Writing Skills"],
      recommendedCourses: ["Indian Polity & Federal Structure Overview", "TGPSC Civil Services Prelims Prep"],
      recommendedChallenges: [
        { id: "ch-reading-1", title: "Read Telangana State Assembly Reforms Report", xp: 140 },
        { id: "ch-communication-2", title: "Present 5-min Summary on Local Governance", xp: 160 }
      ]
    },
    {
      id: "bank",
      title: "Banking",
      readiness: 67,
      icon: Landmark,
      color: "from-indigo-600 to-purple-600",
      textColor: "text-indigo-700",
      bgColor: "bg-indigo-50 border-indigo-150",
      strengths: ["Quantitative Aptitude speed", "Fast Mental Arithmetic Tricks", "Standard Logical Sequences"],
      weaknesses: ["Banking General Awareness", "Financial Accounting Paradigms", "RBI Guidelines Mastery"],
      missingSkills: ["Reasoning circular seating arrangement puzzles", "NPA and CRR banking regulations"],
      recommendedCourses: ["Financial Markets & Banking Awareness Intensive", "Quantitative Mastery by RS Aggarwal"],
      recommendedChallenges: [
        { id: "ch-reading-2", title: "Analyze RBI Monthly Financial Stability Report", xp: 150 },
        { id: "ch-attendance-1", title: "Attend Morning Fin-Tech Seminar Uninterrupted", xp: 100 }
      ]
    },
    {
      id: "research",
      title: "Research",
      readiness: 80,
      icon: Microscope,
      color: "from-rose-500 to-red-600",
      textColor: "text-rose-700",
      bgColor: "bg-rose-50 border-rose-150",
      strengths: ["Machine Learning Theories", "Neural Network Mechanics", "Technical Abstract Writing Drafts"],
      weaknesses: ["GPU Training Pipeline implementations", "Handling large messy custom datasets"],
      missingSkills: ["CUDA Kernel Programming", "Comprehensive Literature Synthesis Maps"],
      recommendedCourses: ["Deep Learning Specialization by Stanford", "Advanced Academic Research Methodologies"],
      recommendedChallenges: [
        { id: "ch-reading-3", title: "Summarize 3 Peer-reviewed ML Research Papers", xp: 220 },
        { id: "ch-leadership-1", title: "Initiate Autonomous Campus Research Circle", xp: 250 }
      ]
    },
    {
      id: "entrepreneur",
      title: "Entrepreneurship",
      readiness: 62,
      icon: Rocket,
      color: "from-violet-500 to-fuchsia-600",
      textColor: "text-violet-700",
      bgColor: "bg-violet-50 border-violet-150",
      strengths: ["Product Vision roadmap", "Grit & Daily Habit Consistency", "Vocal Presentation Pitches"],
      weaknesses: ["Financial Cashflow Statements", "PPC Ad Campaign planning", "Equity Cap-table Calculations"],
      missingSkills: ["Cap-table modeling with dilution", "Scientific Product-market fit testing"],
      recommendedCourses: ["How to Start a Startup by Y Combinator", "Lean Venture Capital Raising Methods"],
      recommendedChallenges: [
        { id: "ch-communication-3", title: "Deliver 60-Sec Live Elevator Pitch to Lecturers", xp: 180 },
        { id: "ch-leadership-2", title: "Present Mock Product MVP Scope in class", xp: 200 }
      ]
    }
  ];

  const currentCareer = careers.find(c => c.id === selectedCareerId) || careers[0];

  const handleEnroll = async (challengeTitle: string, xpValue: number) => {
    try {
      setMessage(null);
      setEnrollingMap(prev => ({ ...prev, [challengeTitle]: true }));

      // Find if this challenge is already registered in DB, otherwise generate registration
      const enrollmentUrl =`/api/student/challenges/enroll`;
      
      // Let's call the enrollment api endpoint or call the onEnrollChallenge prop
      const response = await fetch(enrollmentUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: student.studentId,
          challengeTitle: challengeTitle,
          xpValue: xpValue
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Enrollment failed");

      setMessage({
        text: `Successfully enrolled in challenge "${challengeTitle}"! +${xpValue} XP unlocked upon completion. Check your home view challenges panel.`,
        type: "success"
      });
      loadDatabase();
    } catch (err: any) {
      console.error(err);
      setMessage({
        text: err.message || "An error occurred while enrolling in this challenge. Please try again.",
        type: "error"
      });
    } finally {
      setEnrollingMap(prev => ({ ...prev, [challengeTitle]: false }));
    }
  };

  return (
    <div className="space-y-6" id="career-dna-center-root">
      
      {/* SECTION HEADER */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest font-mono">
              Priority 8 & 9 Combined
            </span>
            <h2 className="text-2xl font-extrabold text-slate-800 font-display mt-1">
              🧬 AI Career DNA Sandbox Center
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Your AI Twin continuously models your academic, behavioral, and digital coordinates to predict employment readiness across 6 major professional verticals.
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full text-indigo-700 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
            <span>Matched to {student.name.split(" ")[0]}'s Twin DNA</span>
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-start gap-2.5 animate-fadeIn border ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-bold">{message.type === "success" ? "System Enrolled" : "System Alert"}</p>
            <p className="mt-0.5 leading-relaxed">{message.text}</p>
          </div>
        </div>
      )}

      {/* CORE MATRIX GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* CAREERS SIDEBAR list */}
        <div className="lg:col-span-5 bg-white border border-slate-150 rounded-3xl p-5 space-y-4 shadow-sm">
          <p className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
            6 Core Career Dimensions
          </p>
          
          <div className="space-y-2.5">
            {careers.map((cr) => {
              const Icon = cr.icon;
              const isSelected = selectedCareerId === cr.id;
              
              return (
                <button
                  key={cr.id}
                  onClick={() => setSelectedCareerId(cr.id)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left border transition-all ${
                    isSelected
                      ? "bg-slate-900 border-slate-900 text-white shadow-md ring-2 ring-slate-900/15"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${isSelected ? "bg-white/10 text-white" : "bg-white text-slate-700 shadow-xs border border-slate-200/50"}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold font-display leading-none">{cr.title}</p>
                      <p className={`text-[10px] mt-1 ${isSelected ? "text-slate-300" : "text-slate-400"}`}>
                        Predicted Placement Probability
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Tiny Readiness Badge */}
                    <div className="text-right">
                      <span className="font-mono text-xs font-black block leading-none">{cr.readiness}%</span>
                      <span className={`text-[8px] uppercase font-bold tracking-widest ${isSelected ? "text-amber-400" : "text-slate-400"}`}>
                        Match
                      </span>
                    </div>
                    <ChevronIndicator isSelected={isSelected} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* CAREER EXPLORER PANEL */}
        <div className="lg:col-span-7 bg-white border border-slate-150 rounded-3xl p-6 shadow-sm space-y-6">
          
          {/* HEADER GAUGE DETAILED */}
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-900 text-white rounded-2xl">
                {React.createElement(currentCareer.icon, { className: "w-6 h-6" })}
              </div>
              <div>
                <p className="text-[10px] font-mono text-indigo-600 font-bold uppercase tracking-widest">
                  Target Pathway Overview
                </p>
                <h3 className="text-xl font-extrabold text-slate-800 font-display mt-0.5">
                  {currentCareer.title} Track
                </h3>
              </div>
            </div>

            {/* Premium circular gauge indicator */}
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-150 p-2 rounded-2xl">
              <div className="relative flex items-center justify-center">
                <svg className="w-12 h-12 transform -rotate-90">
                  <circle cx="24" cy="24" r="20" stroke="#E2E8F0" strokeWidth="4" fill="none" />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#4F46E5"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray="125"
                    strokeDashoffset={125 - (125 * currentCareer.readiness) / 100}
                  />
                </svg>
                <span className="absolute text-[11px] font-mono font-black text-slate-800">{currentCareer.readiness}%</span>
              </div>
              <div className="text-left">
                <span className="text-[10px] font-black text-slate-700 block uppercase tracking-tight leading-none">Readiness</span>
                <span className="text-[8.5px] text-indigo-600 font-bold font-mono">Twin Match Index</span>
              </div>
            </div>
          </div>

          {/* DUAL COHORT STRENGTHS & WEAKNESSES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Strengths card */}
            <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-800">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Verified Strengths</span>
              </div>
              <ul className="space-y-1.5">
                {currentCareer.strengths.map((str, index) => (
                  <li key={index} className="flex items-baseline gap-1.5 text-xs text-slate-700 font-light">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-2"></span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses card */}
            <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-2xl space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>GCP/Math Gaps (Weaknesses)</span>
              </div>
              <ul className="space-y-1.5">
                {currentCareer.weaknesses.map((wk, index) => (
                  <li key={index} className="flex items-baseline gap-1.5 text-xs text-slate-700 font-light">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-2"></span>
                    <span>{wk}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* MISSING SKILLS LIST */}
          <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider block">
              Missing Skills (To Reach 95%+ Readiness)
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {currentCareer.missingSkills.map((sk, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-white border border-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48]"></span>
                  <span>{sk}</span>
                </span>
              ))}
            </div>
          </div>

          {/* RECOMMENDATIONS: COURSES & CHALLENGES */}
          <div className="space-y-4">
            
            {/* Recommended Courses */}
            <div className="space-y-2">
              <p className="text-[10px] uppercase font-bold text-indigo-700 font-mono tracking-wider flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Curated Syllabus & Courses</span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {currentCareer.recommendedCourses.map((crs, idx) => (
                  <div key={idx} className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-between text-xs hover:border-slate-350 transition shadow-xs">
                    <div className="flex items-center gap-2">
                      <Bookmark className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span className="font-bold text-slate-800 block">{crs}</span>
                    </div>
                    <span className="text-[8px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-black font-mono">FREE</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Challenges */}
            <div className="space-y-2">
              <p className="text-[10px] uppercase font-bold text-teal-700 font-mono tracking-wider flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5" />
                <span>Custom Learning Challenges (Direct Enrollment)</span>
              </p>
              
              <div className="space-y-2">
                {currentCareer.recommendedChallenges.map((ch) => (
                  <div
                    key={ch.id}
                    className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <p className="font-extrabold text-slate-800 leading-tight block">{ch.title}</p>
                      <p className="text-[9px] text-[#14B8A6] font-mono mt-0.5 font-bold uppercase">Reward: +{ch.xp} XP & Badge Boost</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleEnroll(ch.title, ch.xp)}
                      disabled={enrollingMap[ch.title]}
                      className="px-3.5 py-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-[10px] font-black rounded-lg uppercase tracking-tight flex items-center gap-1 shadow transition-colors self-start sm:self-auto disabled:opacity-50"
                    >
                      {enrollingMap[ch.title] ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Enrolling...</span>
                        </>
                      ) : (
                        <>
                          <span>Enroll Challenge</span>
                          <ArrowRight className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

function ChevronIndicator({ isSelected }: { isSelected: boolean }) {
  return (
    <div className={`transition-transform duration-150 ${isSelected ? "text-amber-400 rotate-90" : "text-slate-400"}`}>
      <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
}
