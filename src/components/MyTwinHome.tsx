import React, { useState } from "react";
import {
  Brain,
  Zap,
  Sparkles,
  Trophy,
  ArrowRight,
  MessageSquare,
  TrendingUp,
  User,
  Award,
  BookOpen,
  Send,
  Loader2,
  Share2,
  Star,
  Activity,
  Heart,
  CalendarCheck,
  Check
} from "lucide-react";
import { StudentDNAProfile, AppDatabase } from "../types";
import { getTwinAskCached, saveTwinAskCache, parseGeminiError } from "./geminiCache";
import TwinOSDashboard from "./TwinOSDashboard";

interface MyTwinHomeProps {
  student: StudentDNAProfile;
  db: AppDatabase;
  onEnrollChallenge: (chId: string) => void;
  onRecordProgress: (chId: string) => void;
  onNavigateToTab: (tabId: string) => void;
  loadDatabase: () => Promise<void>;
}

export default function MyTwinHome({
  student,
  db,
  onEnrollChallenge,
  onRecordProgress,
  onNavigateToTab,
  loadDatabase
}: MyTwinHomeProps) {
  const [twinQuestion, setTwinQuestion] = useState("");
  const [askingTwin, setAskingTwin] = useState(false);
  const [subTab, setSubTab] = useState<"twin-os" | "mentor-chat" | "daily-ritual">("twin-os");
  const [customMode, setCustomMode] = useState<{
    mode: string;
    desc: string;
    confidence: string;
    momentum: string;
  } | null>(null);

  // Priority 4 Interactive Coaching States
  const [coachingPeriod, setCoachingPeriod] = useState<"morning" | "afternoon" | "evening" | "night">("morning");
  const [coachingReflection, setCoachingReflection] = useState("");
  const [reflectionAnswer, setReflectionAnswer] = useState<string | null>(null);
  const [checkedInPeriods, setCheckedInPeriods] = useState<Record<string, boolean>>({
    morning: false,
    afternoon: false,
    evening: false,
    night: false
  });

  const [twinChatHistory, setTwinChatHistory] = useState<
    { query: string; reply: string; timestamp: string }[]
  >([
    {
      query: "Analyze my overall digital twin state",
      reply: `**Hello ${student.name}! I am your Digital Twin.**\n\nYour **Technical DNA** increased by **3%** this week, and your predicted placement employability score rose from **68% to 71%**!\n\nHere are some strengths I've mapped:\n* **Deep Learning & Visual Synthesis** (dominant learning styles: Visual 75%, Somatic 85%)\n\nWe have identified a minor bottleneck in **Attendance & Database Architecture**. Let's keep climbing! Try asking me one of the target questions below or typing your own.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);

  const QUICK_QUESTIONS = [
    "Why are my marks dropping?",
    "Which skill should I learn next?",
    "Can I become a Data Analyst?",
    "Can I crack TGPSC Group-2?",
    "What challenge should I take this week?",
    "Why is my employability score low?"
  ];

  const handleAskTwin = async (questionText: string) => {
    if (!questionText.trim()) return;
    if (askingTwin) return; // Prevent duplicate requests (Only one Gemini request executes per user action)

    const cleanQuestion = questionText.trim();

    // 1. Check AI Twin response memoization cache first
    const cachedReply = getTwinAskCached(student.studentId, cleanQuestion);
    if (cachedReply) {
      setTwinChatHistory(prev => [
        ...prev,
        {
          query: cleanQuestion,
          reply: `${cachedReply}\n\n*(💡 Digitally synchronized instantly from Digital Twin Memoization Cache)*`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
      setTwinQuestion("");
      return;
    }

    try {
      setAskingTwin(true);
      const res = await fetch("/api/gemini/student-twin-ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: student.studentId,
          question: cleanQuestion
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Save to memoization cache
      saveTwinAskCache(student.studentId, cleanQuestion, data.reply);

      setTwinChatHistory(prev => [
        ...prev,
        {
          query: cleanQuestion,
          reply: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
      setTwinQuestion("");
    } catch (err: any) {
      // Elegant offline fallback in case of rate limits, 503s, or key issues
      console.warn("API Error, triggering cognitive local twin response:", err);
      const errInfo = parseGeminiError(err);
      const mockReply = getFallbackTwinAnswer(cleanQuestion, student);
      
      setTwinChatHistory(prev => [
        ...prev,
        {
          query: cleanQuestion,
          reply: `${errInfo.message}\n\n${mockReply}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
      setTwinQuestion("");
    } finally {
      setAskingTwin(false);
    }
  };

  // Gamification stats from Student Profile
  const academicGpa = student.academic.currentGPA;
  const attendance = student.behavioral.attendancePercentage;
  
  // Calculate a mock score for DNA overview (composite of factors)
  const dnaScore = Math.round(
    (academicGpa * 10) + (attendance * 0.4) + (student.career.skillsMastered.length * 5) + 12
  );

  // Gamification Levels
  const getLevelName = (score: number) => {
    if (score < 55) return { name: "Explorer", level: 1, next: 2, xp: 230, max: 500 };
    if (score < 70) return { name: "Builder", level: 5, next: 6, xp: 620, max: 1000 };
    if (score < 85) return { name: "Achiever", level: 10, next: 11, xp: 1250, max: 2000 };
    return { name: "Mastermind", level: 20, next: 21, xp: 4200, max: 5000 };
  };

  const currentLevel = getLevelName(dnaScore);

  // Priority 3: Personality Resolver
  const getTwinPersonality = (profile: any) => {
    const completedCount = profile.digital.challengesCompletedCount;
    const streak = profile.digital.streakDays;
    const attendanceVal = profile.behavioral.attendancePercentage;

    if (attendanceVal < 80) {
      return {
        mode: "Recovery Mode",
        desc: "Deep core support mode. Let's stabilize attendance past 90% and focus on low subject scores.",
        confidence: "75%",
        momentum: "Recovery Focus"
      };
    }
    if (completedCount >= 20 || profile.digital.learningActivityHours > 200) {
      return {
        mode: "Career Accelerator",
        desc: "Supercharging placement metrics and high-volume coding challenge completions.",
        confidence: "94%",
        momentum: "Maximum Velocity"
      };
    }
    if (streak >= 15) {
      return {
        mode: "Competitive Warrior",
        desc: "Slaying quiz targets and competitive state/national exam sprints weekly.",
        confidence: "88%",
        momentum: "High-Caliber Speed"
      };
    }
    if (streak >= 5) {
      return {
        mode: "Fast Learner",
        desc: "Absorbing concepts systematically with high-frequency cognitive synchronization.",
        confidence: "85%",
        momentum: "Rapid Acceleration"
      };
    }
    if (profile.academic.currentGPA > 3.65) {
      return {
        mode: "Research Thinker",
        desc: "Analyzing discrete mathematical formulas and drafting specialized papers.",
        confidence: "91%",
        momentum: "Deep Cognitive"
      };
    }
    return {
      mode: "Focused Builder",
      desc: "Steadily engineering foundations, solving algorithms, and bridging study gaps.",
      confidence: "82%",
      momentum: "High"
    };
  };

  const naturalPersonality = getTwinPersonality(student);
  const personalityState = customMode || naturalPersonality;

  return (
    <div className="space-y-8 animate-fadeIn" id="my-twin-home-root">
      
      {/* PRIORITY 1 & 3: GLOBAL DYNAMIC AI TWIN HERO PANEL */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 relative overflow-hidden shadow-xl border border-slate-800" id="twin-hero-section">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Virtual Twin Pulse Details */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-black tracking-widest uppercase font-mono text-emerald-400">
                🟢 {student.name.split(" ")[0]} Twin Online
              </span>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                🧠 Cognitively Synchronized
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight font-display text-white">
                "I represent your digital evolution, {student.name.split(" ")[0]}"
              </h1>
              <p className="text-sm text-slate-300 font-light leading-relaxed">
                Analyzing your 5D coordinates across Academic strength index, behavioural class attendance, and competitive exams daily focus.
              </p>
            </div>

            {/* Quick telemetry parameters (Priority 1 UI attributes) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              
              <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl">
                <span className="text-[9px] uppercase font-bold tracking-wider block font-mono text-indigo-300">Current Mode</span>
                <span className="text-xs font-black text-white mt-1 block">{personalityState.mode}</span>
              </div>

              <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl">
                <span className="text-[9px] uppercase font-bold tracking-wider block font-mono text-emerald-300">Confidence</span>
                <span className="text-xs font-black text-white mt-1 block">{personalityState.confidence}</span>
              </div>

              <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl">
                <span className="text-[9px] uppercase font-bold tracking-wider block font-mono text-amber-300">Momentum</span>
                <span className="text-xs font-black text-white mt-1 block">{personalityState.momentum}</span>
              </div>

              <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl">
                <span className="text-[9px] uppercase font-bold tracking-wider block font-mono text-cyan-300">Career Direction</span>
                <span className="text-xs font-black text-white mt-1 block truncate">Data Analytics</span>
              </div>

            </div>
          </div>

          {/* Right Column: Today's Insight & Fast Interactive Ask */}
          <div className="lg:col-span-4 bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden backdrop-blur-md space-y-4">
            <div>
              <span className="text-[10px] text-amber-400 font-black font-mono uppercase tracking-widest block mb-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span>Today's Generative Twin Insight :</span>
              </span>
              
              <p className="text-xs leading-relaxed text-slate-200">
                "Your employability index in Data Analytics increased by <strong className="text-emerald-400">2.4%</strong> today based on your {student.digital.challengesCompletedCount} completed challenges! Maintain this momentum to reach 90% syllabus readiness before placement week."
              </p>
            </div>

            <button
              onClick={() => {
                const element = document.getElementById("twin-chat-block");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="w-full py-3 bg-white hover:bg-slate-50 text-indigo-950 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-md mt-2"
            >
              <span>Ask Your Twin</span>
              <ArrowRight className="w-3.5 h-3.5 text-indigo-800" />
            </button>
          </div>

        </div>

        {/* Priority 3 Dynamic State controls / preview */}
        <div className="mt-6 pt-4 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-[11px] text-slate-400 font-sans">
            <span className="font-bold text-indigo-300">Identity Mode:</span> {personalityState.desc}
          </div>

          <div className="flex flex-wrap gap-1">
            <span className="text-[9px] text-slate-450 font-bold uppercase font-mono mr-1.5 self-center">States:</span>
            {[
              { id: "focused-builder", label: "Focused Builder", desc: "Steadily engineering foundations, solving algorithms, and bridging study gaps.", confidence: "82%", momentum: "High" },
              { id: "fast-learner", label: "Fast Learner", desc: "Absorbing concepts systematically with high-frequency cognitive synchronization.", confidence: "85%", momentum: "Accelerating" },
              { id: "consistent", label: "Consistent Performer", desc: "Maintaining persistent daily discipline streaks without a single drops incident.", confidence: "88%", momentum: "Solid" },
              { id: "skills", label: "Skill Explorer", desc: "Traversing unique cross-department functional modules to master new domains.", confidence: "80%", momentum: "Dynamic" },
              { id: "accelerator", label: "Career Accelerator", desc: "Supercharging placement metrics and high-volume coding challenge completions.", confidence: "94%", momentum: "Maximum Velocity" },
              { id: "recovery", label: "Recovery Mode", desc: "Deep core support mode. Let's stabilize attendance past 90% and focus on low subject scores.", confidence: "75%", momentum: "Recovery Focus" }
            ].map(st => (
              <button
                key={st.id}
                onClick={() => setCustomMode({ mode: st.label, desc: st.desc, confidence: st.confidence, momentum: st.momentum })}
                className={`px-2 py-1 rounded-md text-[9px] font-black transition-all ${
                  personalityState.mode === st.label
                    ? "bg-indigo-600 text-white"
                    : "bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* COMPREHENSIVE INTEGRATED TAB SWITCHER COCKPIT */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-4 gap-4 animate-fadeIn">
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
          {[
            { id: "twin-os", label: "🧠 Twin Growth OS", desc: "Life Missions & Memory Engine", icon: Brain },
            { id: "mentor-chat", label: "💬 Consult AI Twin", desc: "Socratic Chat & Recommendations", icon: MessageSquare },
            { id: "daily-ritual", label: "📅 Daily Rituals", desc: "Check-ins & Streaks Logs", icon: CalendarCheck }
          ].map(tb => {
            const Icon = tb.icon;
            const isActive = subTab === tb.id;
            return (
              <button
                key={tb.id}
                onClick={() => setSubTab(tb.id as any)}
                className={`px-4.5 py-3 rounded-xl text-left flex items-center gap-3 transition-all cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-200 scale-[1.01]"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
                <div>
                  <span className="block leading-none text-xs font-black">{tb.label}</span>
                  <span className={`block font-mono text-[9px] mt-1 tracking-tight ${isActive ? "text-indigo-300" : "text-indigo-400"}`}>{tb.desc}</span>
                </div>
              </button>
            );
          })}
        </div>
        
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-250/60 shadow-3xs rounded-xl text-[10px] font-mono font-bold text-slate-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Twin OS v2.1 Sync Active</span>
        </div>
      </div>

      {subTab === "twin-os" && (
        <TwinOSDashboard
          student={student}
          db={db}
          onNavigateToTab={onNavigateToTab}
        />
      )}

      {subTab === "daily-ritual" && (
        <div className="bg-white border border-slate-150 rounded-3xl p-6 shadow-sm space-y-6" id="daily-coaching-panel">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div>
            <span className="text-[9px] uppercase tracking-widest font-black text-rose-600 font-mono flex items-center gap-1.5">
              <CalendarCheck className="w-3.5 h-3.5 text-rose-500" />
              <span>Priority 4: Companion daily routine engine</span>
            </span>
            <h3 className="font-extrabold text-slate-800 font-display text-base mt-1">
              Your Daily Twin Coaching Loop
            </h3>
            <p className="text-xs text-slate-500">
              Complete these prompt cards daily to synchronise your habits with your Digital Twin's predicted evolution milestones.
            </p>
          </div>
          
          {/* Active indicator */}
          <div className="flex items-center gap-1 bg-rose-50 text-rose-700 text-[10px] font-mono font-bold px-3 py-1 rounded-full border border-rose-100">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
            <span>Streak: {student.digital.streakDays} Days</span>
          </div>
        </div>

        {/* 4 PERIODS SEGMENTED HEADER ROADMAP */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {[
            { id: "morning", title: "Morning Focus", desc: "6:00 AM - 12:00 PM", icon: Zap, color: "text-amber-500 bg-amber-50 border-amber-100" },
            { id: "afternoon", title: "Afternoon Check", desc: "12:00 PM - 5:00 PM", icon: Activity, color: "text-blue-500 bg-blue-50 border-blue-100" },
            { id: "evening", title: "Evening Reflect", desc: "5:00 PM - 9:00 PM", icon: Brain, color: "text-[#14B8A6] bg-teal-50 border-teal-100" },
            { id: "night", title: "Night Feedback", desc: "9:00 PM - 6:00 AM", icon: Award, color: "text-indigo-500 bg-indigo-50 border-indigo-100" }
          ].map((period) => {
            const Icon = period.icon;
            const isActive = coachingPeriod === period.id;
            const isCompleted = checkedInPeriods[period.id];

            return (
              <button
                key={period.id}
                type="button"
                onClick={() => setCoachingPeriod(period.id as any)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isActive
                    ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-100 scale-[1.02]"
                    : "bg-white border-slate-200 text-slate-650 hover:bg-slate-50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className={`p-1.5 rounded-lg border ${isActive ? "bg-white/10 border-white/20" : period.color} shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {isCompleted && (
                    <span className="text-[8px] font-mono bg-emerald-500 text-white font-extrabold px-1.5 py-0.5 rounded uppercase">
                      ✓ Done
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-black mt-2.5 font-display">{period.title}</h4>
                <p className={`text-[10px] mt-0.5 font-mono ${isActive ? "text-slate-300" : "text-slate-400"}`}>
                  {period.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* DETAILS OF SELECTED COACHING SLOT */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 animate-fadeIn">
          {coachingPeriod === "morning" && (
            <div className="space-y-3">
              <span className="text-[9px] uppercase font-bold tracking-widest text-amber-600 font-mono block">Morning Active Directive:</span>
              <h4 className="text-base font-black text-slate-800">
                Today's Core Focus: "Spend 20 minutes practicing SQL Joins."
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your Digital Twin identified structured database query planning as your highest margin for GPA growth. By practicing SQL Joins today, you reinforce practical syllabus goals.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                {!checkedInPeriods.morning ? (
                  <button
                    onClick={() => {
                      setCheckedInPeriods(prev => ({ ...prev, morning: true }));
                    }}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-750 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5 animate-bounce text-amber-300" />
                    <span>Initialize Morning Focus (+50 XP)</span>
                  </button>
                ) : (
                  <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs font-black flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Focus Initialized successfully. Claimed +50 XP! Keep crushing goals today.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {coachingPeriod === "afternoon" && (
            <div className="space-y-3">
              <span className="text-[9px] uppercase font-bold tracking-widest text-blue-600 font-mono block">Mid-Day Progress Audit:</span>
              <h4 className="text-base font-black text-slate-800">
                Consistency checkpoint: "You completed {checkedInPeriods.afternoon ? "80%" : "60%"} of today's learning goals."
              </h4>
              
              {/* Dynamic progress bar animation */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-450">
                  <span>Daily Progress Status</span>
                  <span>{checkedInPeriods.afternoon ? "80%" : "60%"}</span>
                </div>
                <div className="bg-slate-200 h-2.5 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-[#14B8A6] h-full rounded-full transition-all duration-500"
                    style={{ width: checkedInPeriods.afternoon ? "80%" : "60%" }}
                  ></div>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                You studied 5 SQL challenge segments. Dedicate 15 more minutes to wrap the day's targeted DBMS concepts and keep consistency levels at max!
              </p>

              <div className="pt-2">
                {!checkedInPeriods.afternoon ? (
                  <button
                    onClick={() => {
                      setCheckedInPeriods(prev => ({ ...prev, afternoon: true }));
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-all"
                  >
                    Report Progress Boost (+100 XP)
                  </button>
                ) : (
                  <div className="p-3 bg-green-50 border border-green-100 text-green-800 rounded-xl text-xs font-black flex items-center gap-2 max-w-fit">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Progress verified at 80%! Added +100 XP to your evolution progress pool.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {coachingPeriod === "evening" && (
            <div className="space-y-3">
              <span className="text-[9px] uppercase font-bold tracking-widest text-[#14B8A6] font-mono block">Causal Self Reflection:</span>
              <h4 className="text-base font-black text-slate-800">
                Daily Learning Sync: "What was the most important concept you learned today?"
              </h4>
              <p className="text-xs text-slate-500">
                Type 1-2 sentences. Reporting your cognitive insights trains your Digital Twin to optimize predicted employability ratings.
              </p>

              {!reflectionAnswer ? (
                <div className="space-y-2">
                  <textarea
                    rows={2}
                    value={coachingReflection}
                    onChange={(e) => setCoachingReflection(e.target.value)}
                    placeholder="e.g. Mastered nested join query normalization filters up to BCNF..."
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs focus:ring-1 focus:ring-[#14B8A6] focus:outline-none text-slate-800"
                  />
                  <button
                    onClick={() => {
                      if (!coachingReflection.trim()) return;
                      setCheckedInPeriods(prev => ({ ...prev, evening: true }));
                      setReflectionAnswer(
                        `Excellent breakthrough, Maya! Summarising "${coachingReflection}" reinforces active somatic learning by 48%. Securing daily logical reviews trains your database core for higher exams. Streak maintained (+200 XP)`
                      );
                    }}
                    className="px-4 py-2 bg-[#14B8A6] hover:bg-teal-600 text-white font-bold text-xs rounded-lg transition-all"
                  >
                    Log Reflection to Twin
                  </button>
                </div>
              ) : (
                <div className="bg-white p-4 rounded-xl border border-teal-100 shadow-3xs space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-1.5 text-[10px] text-teal-600 font-extrabold uppercase font-mono">
                    <Brain className="w-3.5 h-3.5 animate-pulse text-teal-500" />
                    <span>Somatic reflection Response</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans font-medium whitespace-pre-line italic">
                    "{reflectionAnswer}"
                  </p>
                </div>
              )}
            </div>
          )}

          {coachingPeriod === "night" && (
            <div className="space-y-3">
              <span className="text-[9px] uppercase font-bold tracking-widest text-indigo-600 font-mono block">End-of-Day Twin Feedback:</span>
              <h4 className="text-base font-black text-slate-800">
                Habit Review: "Your study consistency improved today. Keep your streak alive."
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Analyzing nightly parameters. Average focus span holds steady at 48 minutes per session. Keeping up this rhythm for 7 additional days boosts technical exam readiness to +11% higher thresholds.
              </p>

              <div className="pt-2">
                {!checkedInPeriods.night ? (
                  <button
                    onClick={() => {
                      setCheckedInPeriods(prev => ({ ...prev, night: true }));
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-all"
                  >
                    Claim Daily wrap Bonus (+100 XP)
                  </button>
                ) : (
                  <div className="p-3 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-xl text-xs font-black flex items-center gap-2 max-w-fit">
                    <Check className="w-4 h-4 text-indigo-600" />
                    <span>Daily bonus claimed! See you tomorrow morning, Maya.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      )}

      {subTab === "mentor-chat" && (
        <>
          {/* CENTERPIECE: PRIMARY AI TWIN MENTOR CHAT BOX */}
          <div className="bg-white border border-slate-150 rounded-3xl p-6 shadow-sm space-y-4" id="twin-chat-block">
        <div className="flex justify-between items-start border-b border-slate-100 pb-3">
          <div>
            <span className="text-[9px] uppercase tracking-widest font-black text-indigo-600 font-mono flex items-center gap-1">
              🚀 Primary Twin Interface
            </span>
            <h3 className="font-extrabold text-slate-800 font-display text-sm mt-0.5">
              MirrorMind Academic AI Mentor
            </h3>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-full text-slate-600 text-[10px] font-mono">
            <Activity className="w-3 h-3 text-indigo-500 animate-pulse" />
            <span>5D Profile Hook Active</span>
          </div>
        </div>

        {/* MAIN CHAT LOG */}
        <div className="space-y-4 max-h-[340px] overflow-y-auto bg-slate-50 p-4 rounded-2xl border border-slate-100 font-sans text-xs">
          {twinChatHistory.map((item, idx) => (
            <div key={idx} className="space-y-2">
              {/* User question */}
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white p-3 rounded-2xl max-w-[85%] shadow-sm">
                  <p className="font-semibold block text-[10px] text-blue-200 uppercase tracking-widest mb-1">You</p>
                  <p className="leading-relaxed whitespace-pre-line">{item.query}</p>
                </div>
              </div>

              {/* AI response */}
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200/80 text-slate-800 p-3.5 rounded-2xl max-w-[85%] shadow-sm space-y-2">
                  <div className="flex items-center gap-1.5 border-b border-slate-100 pb-1.5 mb-1.5 text-[10px] text-indigo-600 font-bold uppercase tracking-wider">
                    <Brain className="w-3.5 h-3.5" />
                    <span>Digital Twin Intelligence • {item.timestamp}</span>
                  </div>
                  <div className="leading-relaxed whitespace-pre-line prose prose-sm text-slate-700">
                    {item.reply}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {askingTwin && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 text-slate-800 p-4 rounded-2xl flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                <span className="font-mono text-[10px] text-slate-400">Twin is simulating your academic trajectory...</span>
              </div>
            </div>
          )}
        </div>

        {/* QUICK QUESTIONS SUGGESTION SLIDER */}
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider mb-2">Simulate a Direct Dilemma:</span>
          <div className="flex flex-wrap gap-2">
            {QUICK_QUESTIONS.map((q, qidx) => (
              <button
                key={qidx}
                type="button"
                onClick={() => handleAskTwin(q)}
                disabled={askingTwin}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 font-bold text-[10.5px] rounded-full transition-colors border border-indigo-100/50 flex items-center gap-1 shadow-sm"
              >
                <span>{q}</span>
              </button>
            ))}
          </div>
        </div>

        {/* TEXT AREA INPUT */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskTwin(twinQuestion);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={twinQuestion}
            onChange={(e) => setTwinQuestion(e.target.value)}
            disabled={askingTwin}
            placeholder="Ask your Twin anything about your grades, next certifications, or career readiness..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none focus:bg-white text-slate-800"
          />
          <button
            type="submit"
            disabled={askingTwin}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md shadow-indigo-100 transition-all shrink-0"
          >
            <span>Consult Twin</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* TODAY'S HIGH-IMPACT RECOMMENDED ACTIONS & REWARDS PANEL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CURRENT HIGHEST IMPACT CHOSEN CONTEST */}
        <div className="bg-white border border-slate-150 rounded-3xl p-5 shadow-sm space-y-4">
          <div>
            <span className="text-[9px] uppercase font-bold text-rose-600 font-mono block">Recommended Challenge Assignment</span>
            <h4 className="font-extrabold text-slate-800 text-sm mt-0.5">Today's Highest Impact Action</h4>
            <p className="text-[11px] text-slate-400">Complete this challenge to boost Employability by +3% and Academic DNA by +2%.</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150/60 space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-xs bg-amber-100 text-amber-800 font-black px-2 py-0.5 rounded-lg font-mono">
                CODING CHAMPIONSHIP
              </span>
              <span className="text-xs font-black text-indigo-600">+450 XP Award</span>
            </div>
            <h5 className="font-black text-slate-800 text-sm">Deploy dynamic SQL Query Indices</h5>
            <p className="text-xs text-slate-500 leading-relaxed">
              Solve the database indexing problem to improve compiler telemetry ratings. Recommended by your model based on internal marks.
            </p>
            
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => onEnrollChallenge("ch-code-1")}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
              >
                Enroll Instantly
              </button>
              <button
                onClick={() => onNavigateToTab("challenges")}
                className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-all"
              >
                View Challenges Arena
              </button>
            </div>
          </div>
        </div>

        {/* HIGH-OCTANE SYSTEM LOGS */}
        <div className="bg-white border border-slate-150 rounded-3xl p-5 shadow-sm space-y-4">
          <div>
            <span className="text-[9px] uppercase font-bold text-emerald-600 font-mono block">Integrated Life Logging</span>
            <h4 className="font-extrabold text-slate-800 text-sm mt-0.5">Deducted Risks & Recommended Actions</h4>
            <p className="text-[11px] text-slate-400">Real-time alerts flagged by your Cognitive Digital Twin intelligence.</p>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
              <Heart className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-black text-red-800 uppercase tracking-wide block">Attendance Drop Warning</span>
                <p className="text-[11px] text-red-700 mt-0.5">
                  Current attendance is <strong className="text-red-900">{student.behavioral.attendancePercentage}%</strong>. Improving to 90% is estimated to lift placement statistics by 14%.
                </p>
              </div>
            </div>

            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-black text-indigo-800 uppercase tracking-wide block">Career DNA Congruence</span>
                <p className="text-[11px] text-indigo-700 mt-0.5">
                  Your interest in <strong className="text-slate-900">Machine Learning</strong> aligns with 94% peer competence scores. Trigger the simulator to evaluate alternate trajectories.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
      </>
      )}

    </div>
  );
}

// COGNITIVE OFFLINE FALLBACK ENGINE
function getFallbackTwinAnswer(query: string, student: StudentDNAProfile): string {
  const lowercase = query.toLowerCase();
  
  if (lowercase.includes("marks") || lowercase.includes("drop") || lowercase.includes("grades")) {
    return `### 📉 Marks & Attendance Behavioral Audit
    
**Your Internal Course issues are:**
* **Network Security Protocols** (${student.academic.internalMarks.find(i=>i.subject.includes("Network"))?.score || 54}/100)
* **High Performance Computing** (${student.academic.internalMarks.find(i=>i.subject.includes("High"))?.score || 62}/100)

**Cognitive Diagnosis:**
Your declining course performance directly correlates with your **${student.behavioral.attendancePercentage}% attendance**. Because you are visual (75%) and somatic (85%), skipping live lectures deprives you of in-person whiteboard diagrams and active laboratory iterations.

**Recommended Interventions Plan:**
1. Execute the **Zero-Absentee Academic Streak Challenge** (14 Days) to restore classroom attendance momentum.
2. Formulate an interactive revision guide inside **StudentMind Studio** specifically targeting *Compiler Construction* or *Socket Servers*.`;
  }
  
  if (lowercase.includes("skill") || lowercase.includes("learn next") || lowercase.includes("future")) {
    return `### 🚀 Targeted Skill Accretion Roadmap
    
Looking at your Core Career DNA (Interests: *${student.career.careerInterests.join(", ")}*), you already master **${student.career.skillsMastered.join(", ")}**.

**The Gaps I Recommend you bridge Next:**
1. **GPU Programming & Distributed Clouds**: Needed for large transformer deployment.
2. **Kubernetes Prototyping**: Essential for industrializing ML/AI servers.
3. **Advanced Statistics**: Your Reading/Logical DNA score is 45%, meaning we need automated MCQs to reinforce theoretical probabilities.

**Your Action Plan:**
Activate the **Daily Algorithm Challenge Arena** to trigger problem solving daily, and generate visual infographics inside StudentMind Studio to master high-performance parameters!`;
  }

  if (lowercase.includes("data analyst") || lowercase.includes("analyst")) {
    return `### 📊 Data Analyst Readiness Profile

Your calculated data-affinity rating is **72%**.

**Matching Competences:**
* **Strengths:** Excellent Python skills, logical reasoning metrics, and PyTorch mathematical models.
* **Bottlenecks:** Statistics (45% reading DNA score) and SQL index scaling limitations.

**Your Dynamic 90-Day Roadmap:**
* **Days 1-30:** Complete the **15-Day Coding Arena Challenges** to master SQL index keys and relational normalization.
* **Days 31-60:** Practice using the **Future Self Simulator** to see how increasing self-study hours by 10/week shifts placement readiness.
* **Days 61-90:** Complete a mock database analytics portfolio project.`;
  }

  if (lowercase.includes("tgpsc") || lowercase.includes("group-2") || lowercase.includes("exam")) {
    return `### TGPSC Group-2 & Competitive Exam Diagnostic

Based on your current cognitive telemetry, your simulated **TGPSC Readiness is 64%**.

**Dimensions Audit:**
* **Domain Knowledge:** 72%
* **Quantitative Reasoning & Aptitude:** 74%
* **Current Affairs:** **52% (Major Gaps Detected)**
* **Communication & Aptitude:** 78%

**Diagnostic Recommendation:**
An attendance rate of ${student.behavioral.attendancePercentage}% reduces class focus. I recommend allocating **5 hours/week** to our newly designed **Competitive Exam DNA** tracker to execute Daily MCQs on *Indian Economy* and the *7-Day Current Affairs Sprint*.`;
  }

  if (lowercase.includes("employability") || lowercase.includes("low")) {
    return `### ⚡ Employability Score Breakdown
    
Your current Employability Score is calculated at **68% to 71%** (Baseline standard target: 85%).

**What is dragging it down:**
1. **Low Attendance Risk**: at ${student.behavioral.attendancePercentage}%, companies flag compliance risk.
2. **Sparsity of Completed Certs**: you have only completed ${student.digital.challengesCompletedCount} major challenges.
3. **Communication DNA decline**: recorded presentation parameters are dropping.

**Immediate Restoration Plan (AI Intervention):**
* Complete the **Mock Interview Challenge** (+250 XP)
* Deploy your verified **LinkedIn Optimization Challenge** (+150 XP)
* Practice the **1-Min Elevator Pitch Recording** daily inside the Challenge Arena.`;
  }

  return `### 🧬 MirrorMind Twin Cognitive Telemetry Response
  
Hello ${student.name}! Standard baseline mapping of query: "${query}" complete.
  
I have cross-checked your 5D DNA Profile with current class baselines. Your **strengths in ${student.academic.strengths[0]}** give you a 12% advantage over standard cohort averages. However, prioritizing classroom attendance of **90%** remains your highest impact lever to move simulated Placement scores to **88%**!`;
}
