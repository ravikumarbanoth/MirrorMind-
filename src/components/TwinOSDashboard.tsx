import React, { useState, useEffect } from "react";
import {
  Brain,
  Target,
  Sparkles,
  CheckCircle2,
  Lock,
  Compass,
  ArrowRight,
  TrendingUp,
  History,
  Award,
  Share2,
  Clock,
  Linkedin,
  Terminal,
  RotateCcw,
  BookOpen,
  Calendar,
  Send,
  Zap,
  Check
} from "lucide-react";
import { StudentDNAProfile, AppDatabase } from "../types";

interface TwinOSDashboardProps {
  student: StudentDNAProfile;
  db: AppDatabase;
  onNavigateToTab: (tabId: string) => void;
}

interface Mission {
  id: string;
  name: string;
  category: string;
  targetIdentity: string;
  description: string;
  milestones: string[];
  estimatedCompletion: string;
  gradient: string;
  accentColor: string;
}

export default function TwinOSDashboard({ student, db, onNavigateToTab }: TwinOSDashboardProps) {
  // ---------------- LOCAL STORAGE SYNC KEYS ----------------
  const MEMORY_KEY = `mirrormind_twin_memories_${student.studentId}`;
  const ACTIVE_MISSION_KEY = `mirrormind_twin_active_mission_${student.studentId}`;
  const MILESTONES_STATE_KEY = `mirrormind_twin_milestones_${student.studentId}`;
  const RELATIONSHIP_SCORE_KEY = `mirrormind_twin_rel_score_${student.studentId}`;
  const RITUAL_REFLECTIONS_KEY = `mirrormind_twin_reflections_${student.studentId}`;
  const RITUAL_CHECKINS_KEY = `mirrormind_twin_checkins_${student.studentId}`;

  // 1. Life Mission Definitions
  const MISSIONS: Mission[] = [
    {
      id: "code-architect",
      name: "Become Software Engineer",
      category: "Strategic Tech",
      targetIdentity: "Enterprise Cloud-Scale Architect & AI Integrator",
      description: "Master algorithms, scale database sharding, normalise database layers, and craft production-ready full-stack layouts.",
      milestones: [
        "Master relational database indexing & BCNF normalisation guidelines",
        "Build a robust React client-side application with multi-layer state mechanics",
        "Deploy modular backend endpoints safely hiding Gemini API variables",
        "Sustain a 7-day Coding Arena consistency streak",
        "Publish a verified full-stack portfolio with interactive database schema"
      ],
      estimatedCompletion: "November 14, 2026",
      gradient: "from-blue-650 via-indigo-700 to-indigo-900 border-indigo-500/20 text-white",
      accentColor: "indigo"
    },
    {
      id: "data-analyst",
      name: "Become Data Analyst",
      category: "Business Analytics",
      targetIdentity: "Senior Strategic Business Intelligence Principal",
      description: "Harness statistical modeling, optimize relational queries, and design deep interactive dashboards for institutional growth.",
      milestones: [
        "Complete advanced SQL query aggregation & joins challenge",
        "Master Python math libraries (Numpy, Pandas, SciPy) and Seaborn graphs",
        "Solve 3 strategic database analytics scenario challenges in the Arena",
        "Construct an interactive principal level cohort retention analytics dashboard",
        "Pass official Mock Data Interview assessment in the Exam DNA tab"
      ],
      estimatedCompletion: "October 03, 2026",
      gradient: "from-[#14B8A6] via-teal-700 to-slate-900 border-teal-500/20 text-white",
      accentColor: "teal"
    },
    {
      id: "tgpsc-civil",
      name: "Crack IAS / TGPSC Civils",
      category: "Collegiate Administration",
      targetIdentity: "Distinguished Cadre Deputy Collector (Group-I)",
      description: "Excellence in regional governance history, socioeconomic policy analysis, and advanced leadership diagnostics.",
      milestones: [
        "Sustain weekly current affairs reading cycles (>4 hours recorded)",
        "Reach a score of >85% in the Indian Polity MCQ Arena Assessment",
        "Analyze Telangana Socioeconomic History & regional governance syllabus",
        "Publish a validated policy brief inside the advisory board pipeline",
        "Maintain class attendance above 92% to prove state discipline baseline"
      ],
      estimatedCompletion: "February 22, 2027",
      gradient: "from-amber-600 via-amber-700 to-slate-900 border-amber-500/20 text-white",
      accentColor: "amber"
    },
    {
      id: "banking-specialist",
      name: "Crack Banking Specialist Officer",
      category: "Finance & Security",
      targetIdentity: "Chief Financial Compliance Security Officer",
      description: "Validate quantitative aptitude margins, check financial audit algorithms, and secure transactional databases.",
      milestones: [
        "Complete 5 Advanced Quantitative Aptitude practice modules",
        "Solve relational ledger database locking & deadlock prevention problems",
        "Achieve a Score of 80% on Banking Security & Compliance simulation exam",
        "Maintain peak active focus span metrics above 60 mins/day",
        "Earn the certified Quantitative Wizard Badge (+500 XP)"
      ],
      estimatedCompletion: "December 18, 2026",
      gradient: "from-rose-650 via-rose-700 to-slate-950 border-rose-500/20 text-white",
      accentColor: "rose"
    },
    {
      id: "tech-startup",
      name: "Launch an EdTech AI Startup",
      category: "Venture Sandbox",
      targetIdentity: "Disruptive Unicorn Founder & Technical CEO",
      description: "Convert institutional data models into high-growth consumer apps, secure seed-pitch cards, and pilot with students.",
      milestones: [
        "Formulate a complete technical MVP architecture mapping the student journey",
        "Incorporate ValueWeave connector trends into a solid product mockup",
        "Generate automated marketing assets inside the StudentMind Studio",
        "Acquire a group of 15 beta-testing student profiles to validate metrics",
        "Conduct a live pitch presenting the student Operating System prototype"
      ],
      estimatedCompletion: "January 07, 2027",
      gradient: "from-violet-650 via-fuchsia-700 to-slate-950 border-fuchsia-550/20 text-white",
      accentColor: "violet"
    }
  ];

  // ---------------- INITIAL SEED MEMORIES ----------------
  const INITIAL_SEED_MEMORIES = [
    {
      id: "md-1",
      topic: "Target Goal",
      text: `Set career sights on becoming a highly paid Specialist developer. Mapped interests in ${student.career.careerInterests[0] || "Software Engineering"}.`,
      date: "3 weeks ago",
      type: "automatic"
    },
    {
      id: "md-2",
      topic: "Strength Profile",
      text: `Mastered standard React UI widgets, showing top-tier performance in visual-somatic learning approaches.`,
      date: "1 week ago",
      type: "automatic"
    },
    {
      id: "md-3",
      topic: "Deducted Bottleneck",
      text: `Identified attendance dropout risk at ${student.behavioral.attendancePercentage}%. Digital Twin triggered simulated counseling alerts.`,
      date: "2 days ago",
      type: "automatic"
    }
  ];

  // ---------------- STATES ----------------
  const [activeMissionId, setActiveMissionId] = useState<string>(() => {
    return localStorage.getItem(ACTIVE_MISSION_KEY) || MISSIONS[0].id;
  });

  const [memories, setMemories] = useState<{ id: string; topic: string; text: string; date: string; type: string }[]>(() => {
    const saved = localStorage.getItem(MEMORY_KEY);
    return saved ? JSON.parse(saved) : INITIAL_SEED_MEMORIES;
  });

  const [milestonesState, setMilestonesState] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem(MILESTONES_STATE_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  const [relationshipScore, setRelationshipScore] = useState<number>(() => {
    const saved = localStorage.getItem(RELATIONSHIP_SCORE_KEY);
    return saved ? parseInt(saved, 10) : 68; // standard baseline is 68%
  });

  // Daily Twin Ritual States
  const [ritualChecked, setRitualChecked] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem(RITUAL_CHECKINS_KEY);
    return saved ? JSON.parse(saved) : { morning: false, midday: false, evening: false };
  });

  const [eveningReflection, setEveningReflection] = useState<string>("");
  const [reflectionResponse, setReflectionResponse] = useState<string>(() => {
    return localStorage.getItem(RITUAL_REFLECTIONS_KEY) || "";
  });

  // Synchronise state with server API
  const [syncing, setSyncing] = useState<boolean>(false);

  const fetchServerState = async () => {
    try {
      setSyncing(true);
      const res = await fetch(`/api/student-memory-graph?studentId=${student.studentId}`);
      if (!res.ok) throw new Error("Failed to fetch server state");
      const data = await res.json();
      
      // Update local states matching what the database holds
      setActiveMissionId(data.activeMissionId);
      setMemories(data.memories);
      setMilestonesState(data.milestones);
      setRelationshipScore(data.relationshipScore);
      setRitualChecked(data.rituals);
      if (data.reflections && data.reflections.length > 0) {
        setReflectionResponse(data.reflections[0].analysis);
      } else {
        setReflectionResponse("");
      }
    } catch (err) {
      console.error("Local sync error, falling back", err);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchServerState();
  }, [student.studentId]);

  // Interactive brainstorming (brain dump) states
  const [brainDump, setBrainDump] = useState<string>("");
  const [brainDumpProcessing, setBrainDumpProcessing] = useState<boolean>(false);
  const [brainDumpStatus, setBrainDumpStatus] = useState<string>("");

  // Share Card Visual modal states
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [shareFeedback, setShareFeedback] = useState<string>("");

  // Target structures derived from active mission
  const activeMission = MISSIONS.find(m => m.id === activeMissionId) || MISSIONS[0];

  // ---------------- EFFECTS & SYNCS ----------------
  const handleMissionChange = (missionId: string) => {
    setActiveMissionId(missionId);
    fetch("/api/student-memory-graph/change-mission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId: student.studentId, templateId: missionId })
    })
      .then(r => r.json())
      .then(data => {
        setMilestonesState(data.milestones);
        setRelationshipScore(data.relationshipScore);
      })
      .catch(err => console.error("Mission swap sync failed", err));
  };

  // Handle brain dump submission
  const handleBrainDumpSubmit = () => {
    if (!brainDump.trim()) return;
    setBrainDumpProcessing(true);
    setBrainDumpStatus("Digital Twin is analyzing semantic inputs...");

    fetch("/api/student-memory-graph/brain-dump", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: student.studentId,
        topic: "Volitional Ambition",
        text: `Declared personal drive: "${brainDump.trim()}"`
      })
    })
      .then(r => r.json())
      .then(data => {
        setMemories(data.memories);
        setRelationshipScore(data.relationshipScore);
        setRitualChecked(data.rituals);
        setBrainDump("");
        setBrainDumpProcessing(false);
        setBrainDumpStatus(`✓ Stored successfully! Your Digital Twin has integrated: "${brainDump.substring(0, 50)}..." in the Long-Term Memory Graph.`);
        setTimeout(() => setBrainDumpStatus(""), 5500);
      })
      .catch(err => {
        console.error(err);
        setBrainDumpProcessing(false);
        setBrainDumpStatus("Failed to persist on backend memory card.");
      });
  };

  // Toggle milestone state
  const toggleMilestone = (milestoneName: string) => {
    fetch("/api/student-memory-graph/toggle-milestone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: student.studentId,
        templateId: activeMissionId,
        milestoneText: milestoneName
      })
    })
      .then(r => r.json())
      .then(data => {
        setMilestonesState(data.milestones);
        setRelationshipScore(data.relationshipScore);
      })
      .catch(err => console.error("Milestone sync failed", err));

    // Local optimistic feedback
    const key = `${activeMissionId}_${milestoneName}`;
    setMilestonesState(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Perform daily check-in
  const performCheckIn = (period: string) => {
    fetch("/api/student-memory-graph/perform-checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: student.studentId,
        period: period
      })
    })
      .then(r => r.json())
      .then(data => {
        setMemories(data.memories);
        setRitualChecked(data.rituals);
        setRelationshipScore(data.relationshipScore);
      })
      .catch(err => console.error("Checkin sync error", err));

    // optimistic
    setRitualChecked(prev => ({ ...prev, [period]: true }));
  };

  // Submit evening journal reflection
  const handleReflectionSubmit = () => {
    if (!eveningReflection.trim()) return;
    const text = eveningReflection.trim();
    
    // Smart Twin synthesis
    let keywordAnalysis = "focused study optimization";
    if (text.toLowerCase().includes("database") || text.toLowerCase().includes("sql")) {
      keywordAnalysis = "relational query compilation & schemas";
    } else if (text.toLowerCase().includes("attending") || text.toLowerCase().includes("class")) {
      keywordAnalysis = "behavioral attendance restoration";
    } else if (text.toLowerCase().includes("code") || text.toLowerCase().includes("react")) {
      keywordAnalysis = "practical application and coding speeds";
    }

    const synthesis = `Perfect reflection recorded! Mapped semantic focus on: "${keywordAnalysis}". Keeping down drops incidents safeguards placement likelihood. Streak maintained! (+150 XP)`;
    
    fetch("/api/student-memory-graph/submit-reflection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: student.studentId,
        conceptLearned: text,
        analysis: synthesis
      })
    })
      .then(r => r.json())
      .then(data => {
        setMemories(data.memories);
        setRitualChecked(data.rituals);
        setRelationshipScore(data.relationshipScore);
        setReflectionResponse(synthesis);
        setEveningReflection("");
      })
      .catch(err => console.error("Submit reflection failed", err));

    setReflectionResponse(synthesis);
    setEveningReflection("");
  };

  // Reset entire OS milestones / metrics for sandbox play
  const handleResetOS = () => {
    if (window.confirm("Do you want to recalibrate your Twin OS? This resets milestones and local memories to seed values on the persistent backend.")) {
      fetch("/api/student-memory-graph/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: student.studentId })
      })
        .then(r => r.json())
        .then(data => {
          setActiveMissionId(data.activeMissionId);
          setMemories(data.memories);
          setMilestonesState(data.milestones);
          setRelationshipScore(data.relationshipScore);
          setRitualChecked(data.rituals);
          setReflectionResponse("");
        })
        .catch(err => console.error("Reset error", err));
    }
  };

  // Calculate current active mission completion percentage
  const totalActMilestones = activeMission.milestones.length;
  let activeCompleted = 0;
  activeMission.milestones.forEach(m => {
    if (milestonesState[`${activeMission.id}_${m}`]) {
      activeCompleted += 1;
    }
  });
  const missionProgressPercent = Math.round((activeCompleted / totalActMilestones) * 100);

  // Determine emotional category based on Relationship Score
  const getRelationshipLevel = (score: number) => {
    if (score < 70) return { name: "Cognitive Alignment Stage", class: "bg-slate-100 text-slate-800 border-slate-200" };
    if (score < 85) return { name: "Interactive Symbiosis Active", class: "bg-blue-50 text-blue-800 border-blue-100" };
    return { name: "Maximum Cognitive Synchronization", class: "bg-indigo-500 text-white border-indigo-600 animate-pulse" };
  };

  const relationshipLabelVal = getRelationshipLevel(relationshipScore);

  // Shared Growth Card Simulation
  const handleShareTrigger = () => {
    setIsSharing(true);
    setShareFeedback("Generating high-resolution vector layout...");
    setTimeout(() => {
      setShareFeedback("Injecting student DNA telemetry points...");
      setTimeout(() => {
        setShareFeedback("Synchronized secure shareable link successfully!");
        setIsSharing(false);
      }, 1000);
    }, 1000);
  };

  const currentIdentityLabel = "Curious Skill Builder";

  return (
    <div className="space-y-6" id="twin-growth-os-root">
      
      {/* 2-COLUMN HEADER BLOCK: IDENTITY PATH & SYNC STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* RELATIONSHIP SCORE COUNTER CARD */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white flex flex-col justify-between relative overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="space-y-3 relative z-10">
            <span className="text-[9px] uppercase tracking-widest font-black text-indigo-400 font-mono block">Evolving Dial Connection</span>
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-400 animate-pulse" />
              <h3 className="font-extrabold text-white text-lg font-display">Twin Symbiosis Score</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              How deeply your Digital Twin represents you. Complete daily rituals, tick milestones, and feed goals to scale sync levels.
            </p>
          </div>

          <div className="my-5 flex justify-center items-center relative gap-6">
            <div className="relative flex items-center justify-center">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="#1E293B" strokeWidth="8" fill="transparent" />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="url(#indigoGrad)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * relationshipScore) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="indigoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#818CF8" />
                    <stop offset="100%" stopColor="#4F46E5" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black text-white font-mono">{relationshipScore}%</span>
                <span className="text-[8px] uppercase tracking-wider text-indigo-300 font-bold font-mono">Sync</span>
              </div>
            </div>

            <div className="flex-1 space-y-1.5">
              <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Status:</div>
              <span className={`text-[10px] font-black tracking-tight px-2.5 py-1 rounded-md border inline-block leading-normal ${relationshipLabelVal.class}`}>
                {relationshipLabelVal.name}
              </span>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-[10px] text-slate-400 font-mono">
            <span>Identity Streak:</span>
            <span className="text-emerald-400 font-black">{student.digital.streakDays} Days Sync</span>
          </div>
        </div>

        {/* IDENTITY DEVELOPMENT CARD */}
        <div className="lg:col-span-8 bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 text-white flex flex-col justify-between relative shadow-md">
          <div className="absolute top-2 right-2 border border-indigo-500/20 bg-indigo-500/5 px-2 py-0.5 rounded text-[8px] text-indigo-300 uppercase tracking-widest font-mono">
            Identity Pipeline V2
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-[9px] uppercase tracking-widest font-black text-emerald-400 font-mono block">Dynamic Identity Progression</span>
              <h3 className="text-2xl font-black tracking-tight mt-1 flex items-center gap-2 font-display">
                <Compass className="w-6 h-6 text-emerald-400" />
                <span>Your Growth Identity State</span>
              </h3>
            </div>

            {/* IDENTITY METAPHOR GRAPHICAL PIPELINE */}
            <div className="bg-slate-950 p-4.5 rounded-2xl border border-slate-800 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                
                {/* Current Identity */}
                <div className="md:col-span-4 p-3 bg-white/5 border border-white/10 rounded-xl space-y-1">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-[#14B8A6] font-mono block">Current Identity</span>
                  <div className="font-extrabold text-sm text-white">{currentIdentityLabel}</div>
                  <span className="text-[9.5px] text-slate-400 block font-light leading-tight">Focusing on skill accretion & attendance recovery.</span>
                </div>

                {/* Arrow Lane */}
                <div className="md:col-span-3 flex flex-col items-center justify-center p-2">
                  <div className="text-[9px] text-[#A78BFA] font-bold font-mono px-2 py-0.5 bg-[#A78BFA]/10 border border-[#A78BFA]/20 rounded-full mb-1">
                    Evolution Path
                  </div>
                  <div className="flex items-center text-indigo-500 animate-pulse text-xs font-bold gap-1 mt-1">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>

                {/* Target Identity */}
                <div className="md:col-span-4 p-3 bg-indigo-500/10 border border-indigo-550/20 rounded-xl space-y-1">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-indigo-400 font-mono block">Future Projected Self</span>
                  <div className="font-extrabold text-sm text-indigo-300">{activeMission.targetIdentity}</div>
                  <span className="text-[9.5px] text-slate-300 block font-light leading-tight font-sans">Enabled through high core alignment indices.</span>
                </div>

              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
            <span className="text-slate-400 leading-relaxed max-w-lg">
              🎯 Your Twin calculates that maintaining attendance above <strong className="text-white">92%</strong> accelerates target milestones completion by <strong className="text-emerald-400">18 days</strong>.
            </span>
            <button
              onClick={() => onNavigateToTab("simulator")}
              className="text-[11px] font-black text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1.5 shrink-0 hover:underline"
            >
              <span>Verify Trajectory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* PRIMARY GRID LAYOUT: LIFE MISSIONS (LEFT) vs TWIN MEMORIES & DAILY RITUALS (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LIFE MISSION & TASK TRACKER SYSTEM */}
        <div className="lg:col-span-7 bg-white border border-slate-150 rounded-3xl p-6 shadow-sm flex flex-col justify-between" id="life-missions-canvas">
          <div className="space-y-5">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[9px] bg-red-50 text-red-700 px-2.5 py-1 rounded font-bold font-mono uppercase tracking-widest">
                  Strategic Core Anchor
                </span>
                <h3 className="font-extrabold text-slate-800 text-lg mt-1 font-display flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-600" />
                  <span>The Active Life Mission Engine</span>
                </h3>
              </div>

              {/* Reset Control */}
              <button
                onClick={handleResetOS}
                className="text-[10px] font-mono px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-slate-600 transition-colors flex items-center gap-1 shrink-0"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Engine</span>
              </button>
            </div>

            {/* MISSION SWITCHER BUTTON SLIDER */}
            <div className="space-y-1.5">
              <span className="text-[9px] uppercase font-bold text-slate-400 font-mono tracking-wider block">Set Career Ambition Matrix:</span>
              <div className="flex flex-wrap gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-150/60">
                {MISSIONS.map(m => {
                  const isActive = activeMissionId === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleMissionChange(m.id)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold tracking-tight transition-colors flex-1 min-w-[110px] ${
                        isActive
                          ? "bg-slate-900 text-white shadow-xs"
                          : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
                      }`}
                    >
                      {m.name.replace("Become ", "")}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CURRENT ACTIVE MISSION BOARD */}
            <div className={`p-5 rounded-2xl border bg-gradient-to-br ${activeMission.gradient} transition-all`}>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="text-[8px] bg-white/10 uppercase font-mono font-bold tracking-widest px-2 py-0.5 rounded border border-white/10">
                    {activeMission.category}
                  </span>
                  <h4 className="text-xl font-black mt-2 font-display">{activeMission.name}</h4>
                  <p className="text-xs text-white/80 mt-1 font-light leading-relaxed font-sans">
                    {activeMission.description}
                  </p>
                </div>
                
                <div className="text-right shrink-0">
                  <span className="text-[8px] uppercase tracking-wider block text-white/60 font-mono">Predicted Target Date:</span>
                  <span className="text-[12px] font-mono font-black block mt-0.5 text-emerald-400">{activeMission.estimatedCompletion}</span>
                </div>
              </div>

              {/* MISSION PROGRESS BAR */}
              <div className="mt-5 space-y-1 bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold text-white/90">
                  <span>Mission Telemetry Accomplished</span>
                  <span className="font-black text-rose-350">{missionProgressPercent}% Complete</span>
                </div>
                <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-500"
                    style={{ width: `${missionProgressPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* INTERACTIVE COMPREHENSIVE TASK TARGETS */}
            <div className="space-y-2.5">
              <span className="text-[9px] uppercase font-bold text-slate-400 font-mono tracking-wider block">Remaining Skill Milestones Framework:</span>
              
              <div className="space-y-2">
                {activeMission.milestones.map((m, idx) => {
                  const itemKey = `${activeMission.id}_${m}`;
                  const isChecked = !!milestonesState[itemKey];

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 text-xs transition-all ${
                        isChecked
                          ? "bg-slate-50/50 border-slate-200 text-slate-450"
                          : "bg-white border-slate-150 text-slate-750 hover:bg-slate-50/20"
                      }`}
                    >
                      <div className="flex gap-3 items-start">
                        <button
                          type="button"
                          onClick={() => toggleMilestone(m)}
                          className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-all ${
                            isChecked
                              ? "bg-emerald-500 border-emerald-600 text-white"
                              : "border-slate-300 hover:border-slate-400 bg-white"
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 text-white stroke-[3.5]" />}
                        </button>

                        <div className="space-y-0.5">
                          <span className={`font-medium leading-relaxed block ${isChecked ? "line-through text-slate-400" : "text-slate-800"}`}>
                            {m}
                          </span>
                        </div>
                      </div>

                      <span className={`text-[9px] font-mono shrink-0 font-bold ${isChecked ? "text-emerald-500 uppercase" : "text-slate-400"}`}>
                        {isChecked ? "Accomplished! (+200 XP)" : "Locked Pending"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
            <span className="text-slate-500">Need specific customized study guides for your mission milestones?</span>
            <button
              onClick={() => onNavigateToTab("studio")}
              className="px-4 py-1.5 bg-slate-900 border border-slate-900 hover:bg-slate-800 text-white text-[10px] font-black rounded-lg transition-colors shadow-xs"
            >
              Open MindStudio
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: TWIN MEMORY ENGINE & RITUALS */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          
          {/* DIGITAL TWIN MEMORY SYSTEM */}
          <div className="bg-white border border-slate-150 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3.5 mb-2.5">
              <div>
                <span className="text-[9px] uppercase tracking-widest font-black text-indigo-600 font-mono block">Brain Log Cache</span>
                <h3 className="font-extrabold text-slate-800 text-sm mt-0.5 flex items-center gap-2">
                  <History className="w-4 h-4 text-indigo-600" />
                  <span>Cognitive Twin Memory Stack</span>
                </h3>
              </div>
              <span className="text-[9px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-mono uppercase">
                {memories.length} Traces Stored
              </span>
            </div>

            {/* INTERACTIVE BRAIN DUMP BLOCK */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Somatic Brain Dump Injection:</span>
                <p className="text-[10.5px] text-slate-450 font-light mt-0.5">
                  Type a goal, ambition, or technology node. Your twin stores it to ground future counseling trajectories.
                </p>
              </div>

              <div className="space-y-2">
                <textarea
                  value={brainDump}
                  onChange={(e) => setBrainDump(e.target.value)}
                  placeholder="e.g. Mastered nested backend index queries... or 'My target goal is a placement in Bangalore'."
                  rows={2}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 placeholder-slate-400"
                />

                <div className="flex justify-between items-center gap-2">
                  <span className="text-[9.5px] italic text-red-500/80 font-medium">Bumps Symbiosis by +4%!</span>
                  <button
                    onClick={handleBrainDumpSubmit}
                    disabled={brainDumpProcessing || !brainDump.trim()}
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-750 disabled:bg-slate-200 text-white font-extrabold text-[10px] rounded-lg shadow-sm transition-all flex items-center gap-1 font-mono uppercase"
                  >
                    {brainDumpProcessing ? <Zap className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                    <span>Inject Memory</span>
                  </button>
                </div>
              </div>

              {brainDumpStatus && (
                <div className="p-2 bg-indigo-50 text-indigo-800 text-[10px] rounded-lg border border-indigo-100 leading-normal font-sans font-medium">
                  {brainDumpStatus}
                </div>
              )}
            </div>

            {/* SCROLLING RECORDED MEMORIES LIST */}
            <div className="space-y-2.5 max-h-[190px] overflow-y-auto pr-1">
              {memories.map((m, idx) => (
                <div key={m.id || idx} className="p-2.5 bg-white border border-slate-150 rounded-xl space-y-1 relative shadow-3xs">
                  <div className="flex justify-between items-baseline">
                    <span className={`text-[8.5px] font-bold font-mono px-2 py-0.5 rounded ${
                      m.topic.includes("Ambition") 
                        ? "bg-rose-50 text-rose-700 border border-rose-100" 
                        : m.topic.includes("Journal") 
                          ? "bg-teal-50 text-teal-700 border border-teal-100"
                          : "bg-indigo-50 text-indigo-700 border border-indigo-100"
                    }`}>
                      {m.topic}
                    </span>
                    <span className="text-[8.5px] text-slate-405 font-mono">{m.date}</span>
                  </div>
                  <p className="text-[11px] text-slate-650 leading-relaxed leading-normal font-sans text-left">
                    {m.text}
                  </p>
                </div>
              ))}
            </div>

          </div>

          {/* RITUAL CORNER AND SHARING INTERACTIVE DRAWER */}
          <div className="bg-white border border-slate-150 rounded-3xl p-5 shadow-sm space-y-4">
            
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[9px] uppercase tracking-widest font-black text-[#14B8A6] font-mono block">Active Integration</span>
              <h3 className="font-extrabold text-slate-800 text-sm mt-0.5 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Daily Twin Ritual & Achievements</span>
              </h3>
            </div>

            {/* DAILY Ritual checkpoint buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => performCheckIn("morning")}
                disabled={ritualChecked.morning}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  ritualChecked.morning
                    ? "bg-slate-50 border-slate-150 text-slate-400"
                    : "bg-amber-50 hover:bg-amber-100/50 border-amber-100 text-amber-900"
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-[9px] bg-white text-slate-600 px-1.5 py-0.5 rounded font-bold font-mono uppercase">Morning</span>
                  {ritualChecked.morning && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <h4 className="text-xs font-extrabold mt-2 block">Focus Sync</h4>
                <p className="text-[9.5px] text-slate-450 block mt-0.5 font-sans leading-tight">
                  {ritualChecked.morning ? "Checked in successfully" : "Initialize morning goals"}
                </p>
              </button>

              <button
                type="button"
                onClick={() => performCheckIn("midday")}
                disabled={ritualChecked.midday}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  ritualChecked.midday
                    ? "bg-slate-50 border-slate-150 text-slate-400"
                    : "bg-blue-50 hover:bg-blue-100/50 border-blue-100 text-blue-900"
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-[9px] bg-white text-slate-600 px-1.5 py-0.5 rounded font-bold font-mono uppercase">Midday</span>
                  {ritualChecked.midday && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <h4 className="text-xs font-extrabold mt-2 block">Track Progress</h4>
                <p className="text-[9.5px] text-slate-450 block mt-0.5 font-sans leading-tight">
                  {ritualChecked.midday ? "Logs verified successfully" : "Settle attendance count"}
                </p>
              </button>
            </div>

            {/* EVENING REFLECTION JOURNAL CONSOLE */}
            <div className="p-3 bg-teal-50/40 rounded-2xl border border-teal-100 space-y-2">
              <span className="text-[9px] uppercase font-bold text-teal-700 font-mono block">Evening Cognitive Reflection:</span>
              <p className="text-[10px] text-slate-500">Explain the most valuable concept you learned today to seal streaks.</p>

              {!reflectionResponse ? (
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={eveningReflection}
                    onChange={(e) => setEveningReflection(e.target.value)}
                    placeholder="e.g. Mastered multi-threaded memory deadlock prevention..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:ring-1 focus:outline-none focus:ring-[#14B8A6] text-slate-800 placeholder-slate-400"
                  />
                  <button
                    onClick={handleReflectionSubmit}
                    disabled={!eveningReflection.trim()}
                    className="w-full py-1.5 bg-[#14B8A6] hover:bg-teal-600 disabled:bg-slate-200 text-white text-[10px] font-black rounded-lg transition-colors uppercase font-mono tracking-tight shadow-3xs"
                  >
                    Commit Daily Journal & Stream Sync
                  </button>
                </div>
              ) : (
                <div className="bg-white p-3 rounded-xl border border-teal-100 animate-fadeIn space-y-1">
                  <div className="flex items-center gap-1.5 text-[9px] text-teal-600 font-bold uppercase font-mono">
                    <Sparkles className="w-3 h-3 text-teal-500 animate-pulse" />
                    <span>Twin Cognitive Analysis Saved</span>
                  </div>
                  <p className="text-[10.5px] text-slate-750 font-medium leading-relaxed font-sans italic">
                    "{reflectionResponse}"
                  </p>
                </div>
              )}
            </div>

            {/* DYNAMIC SHAREABLE METAPHOR CARD BOX */}
            <div className="p-3.5 bg-slate-900 text-white rounded-2xl relative overflow-hidden flex flex-col justify-between gap-3 shadow-sm border border-slate-850">
              <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-[#14B8A6]/10 rounded-full blur-xl pointer-events-none"></div>
              
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <span className="text-[8px] uppercase tracking-widest font-black text-emerald-400 font-mono">Verified Digital Twin Passport</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 h-7 rounded-full overflow-hidden border border-white/20">
                      <img src={student.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb"} alt="Student Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h5 className="text-[12px] font-black font-display text-white">{student.name}</h5>
                      <p className="text-[9px] text-slate-400 font-mono leading-none mt-0.5">{activeMission.name} ({missionProgressPercent}%)</p>
                    </div>
                  </div>
                </div>

                <span className="text-right text-[14px] font-mono font-black text-indigo-400">
                  {relationshipScore}% SYNC
                </span>
              </div>

              <div className="flex justify-between items-center bg-slate-950 p-2 rounded-xl text-[9px] text-slate-400 font-mono border border-slate-800">
                <span>Identity: {currentIdentityLabel}</span>
                <span className="text-emerald-400 uppercase font-black">Valid License</span>
              </div>

              <button
                onClick={() => setShowShareModal(true)}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] rounded-xl flex items-center justify-center gap-1.5 transition-colors uppercase font-mono"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Publish Shareable Growth Card</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* MODAL WINDOW FOR PUBLISHING GROWTH CARD */}
      {showShareModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 border border-slate-200 shadow-xl space-y-4 text-slate-800">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] uppercase font-bold text-indigo-600 font-mono">Synthesizer Pipeline</span>
                <h4 className="text-lg font-black tracking-tight text-slate-900 font-display">Generate Shareable Identity License</h4>
              </div>
              <button
                onClick={() => {
                  setShowShareModal(false);
                  setShareFeedback("");
                }}
                className="p-1 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              Deploy your verified developmental indices and Life Mission landmarks onto public networks to prove your hands-on collegiate competency.
            </p>

            {/* PREVIEW CONTAINER */}
            <div className="p-5 bg-gradient-to-tr from-slate-950 via-indigo-950 to-slate-950 text-white rounded-2xl border border-slate-850 space-y-4 shadow-md text-left">
              <div className="flex justify-between items-center">
                <span className="text-[8px] uppercase tracking-widest font-black text-amber-400 font-mono">MirrorMind Certified License</span>
                <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-2.5 py-0.5 rounded font-mono font-bold uppercase">{student.department.toUpperCase()}</span>
              </div>

              <div className="flex gap-3 items-center">
                <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/25">
                  <img src={student.avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h5 className="font-extrabold text-base text-white font-display leading-tight">{student.name}</h5>
                  <p className="text-[10.5px] text-slate-300 font-light font-mono italic">Role: {activeMission.targetIdentity}</p>
                </div>
              </div>

              <div className="space-y-2 bg-slate-900/50 p-3 rounded-xl border border-white/5 text-[11px] font-sans">
                <div className="flex justify-between font-mono text-[9px] text-slate-400">
                  <span>ACTIVE MISSION</span>
                  <span>PROGRESS</span>
                </div>
                <div className="flex justify-between items-baseline font-bold -mt-0.5">
                  <span>{activeMission.name}</span>
                  <span className="text-emerald-400 font-black">{missionProgressPercent}%</span>
                </div>

                <div className="pt-2 flex justify-between font-mono text-[9px] text-slate-400 border-t border-white/5">
                  <span>BEHAVIORAL SYNC</span>
                  <span>ACADEMIC MATCH</span>
                </div>
                <div className="flex justify-between items-baseline font-bold -mt-0.5">
                  <span>{student.behavioral.attendancePercentage}% Attendance</span>
                  <span>GPA: {student.academic.currentGPA}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-[9px] text-slate-450 font-mono pt-1">
                <span>Symbiosis Sync: {relationshipScore}%</span>
                <span className="text-amber-400">STREAK: {student.digital.streakDays} DAYS</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={handleShareTrigger}
                disabled={isSharing}
                className="w-full py-3 bg-[#0A66C2] hover:bg-[#084e95] disabled:bg-slate-300 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors uppercase font-mono"
              >
                <Linkedin className="w-4 h-4 fill-current" />
                <span>{isSharing ? "Processing..." : "Publish to LinkedIn Draft"}</span>
              </button>

              {shareFeedback && (
                <p className="text-[10px] text-emerald-600 text-center font-mono font-bold animate-pulse">
                  {shareFeedback}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
