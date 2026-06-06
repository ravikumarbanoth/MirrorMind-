import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Brain,
  TrendingUp,
  User,
  Briefcase,
  Calendar,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  BookOpen,
  Cpu,
  MessageSquare,
  HelpCircle,
  Lightbulb,
  ChevronRight,
  Loader2,
  ShieldAlert,
  Wand2,
  Eye,
  Activity,
  ThumbsUp,
  Sliders,
  Compass,
  Check,
  Send,
  Zap,
  Info,
  CalendarDays,
  Target,
  ArrowUpRight,
  TrendingDown
} from "lucide-react";
import { UserRole, AppDatabase, StudentDNAProfile, Challenge } from "../types";
import { getTwinAskCached, saveTwinAskCache, simulateFutureSelfLocally, parseGeminiError } from "./geminiCache";

// Setup stable DNA score vectors for pre-seeded students across Semesters (Feature 2: DNA Timeline)
const STUDENT_SEMESTER_HISTORY: Record<string, Record<string, {
  academic: number;
  behavioral: number;
  technical: number;
  leadership: number;
  communication: number;
  career: number;
  memo: string;
}>> = {
  "std-maya-patel": {
    "Semester 1": { academic: 60, behavioral: 70, technical: 65, leadership: 55, communication: 70, career: 58, memo: "Maya began with standard software syntax but struggled with high logical volume. Solid behavioral alignment." },
    "Semester 2": { academic: 65, behavioral: 72, technical: 70, leadership: 60, communication: 74, career: 64, memo: "Discovered passion for UI design and visual prototyping. Technical stats began rising." },
    "Semester 3": { academic: 71, behavioral: 74, technical: 76, leadership: 68, communication: 77, career: 75, memo: "Enrolled in experimental web widgets research team. Marked as competent visual programmer." },
    "Semester 4": { academic: 75, behavioral: 78, technical: 82, leadership: 75, communication: 80, career: 84, memo: "Current Semester. Excellent coding velocity, but low attendance during peak compiler courses needs immediate attention." },
    "Semester 5 (Proj)": { academic: 81, behavioral: 84, technical: 88, leadership: 81, communication: 83, career: 90, memo: "Projected evolutionary milestone: Advanced AI integration modules and system architectures." },
    "Semester 6 (Proj)": { academic: 86, behavioral: 91, technical: 94, leadership: 86, communication: 88, career: 96, memo: "Target outcome: Industry-grade Software Architect specializing in frontend intelligence pipelines." }
  },
  "std-leo-carter": {
    "Semester 1": { academic: 72, behavioral: 80, technical: 68, leadership: 70, communication: 78, career: 55, memo: "Leo entered with dominant communication skills, showing great promise in collaborative workshops." },
    "Semester 2": { academic: 75, behavioral: 84, technical: 72, leadership: 74, communication: 81, career: 62, memo: "Elected as student cohort spokesperson. Explored UX layout guidelines." },
    "Semester 3": { academic: 80, behavioral: 88, technical: 80, leadership: 78, communication: 84, career: 70, memo: "Consolidated teamwork frameworks and represented the department in corporate UI hackathons." },
    "Semester 4": { academic: 86, behavioral: 91, technical: 88, leadership: 82, communication: 86, career: 76, memo: "Current Semester. Superior punctuality and class rhythm. Technical projects are highly interactive." },
    "Semester 5 (Proj)": { academic: 90, behavioral: 94, technical: 92, leadership: 87, communication: 90, career: 85, memo: "Projected output: Leading scrum operations for visual tech departments." },
    "Semester 6 (Proj)": { academic: 94, behavioral: 97, technical: 96, leadership: 92, communication: 95, career: 92, memo: "Target outcome: Principal Product Strategist and Creative Technology Lead." }
  },
  "std-alex-wong": {
    "Semester 1": { academic: 80, behavioral: 70, technical: 85, leadership: 50, communication: 48, career: 70, memo: "Alex showed phenomenal computer code architecture from Day 1, but resisted social pitch sessions." },
    "Semester 2": { academic: 85, behavioral: 75, technical: 90, leadership: 54, communication: 50, career: 78, memo: "Built custom secure sandbox frameworks in spare time. Outstanding compiler grades." },
    "Semester 3": { academic: 90, behavioral: 80, technical: 94, leadership: 58, communication: 54, career: 84, memo: "Initiated automated penetration testing packages. Recognized as elite cybersecurity specialist." },
    "Semester 4": { academic: 94, behavioral: 84, technical: 96, leadership: 62, communication: 58, career: 89, memo: "Current Semester. Near perfect academic grades. Struggles with public presentation sessions." },
    "Semester 5 (Proj)": { academic: 97, behavioral: 88, technical: 98, leadership: 70, communication: 65, career: 94, memo: "Projected output: Master cybersecurity architect and secure protocol maintainer." },
    "Semester 6 (Proj)": { academic: 99, behavioral: 92, technical: 99, leadership: 75, communication: 72, career: 98, memo: "Target outcome: Distinguished Principal Security Researcher with international credentials." }
  }
};

// Heatmap Monthly Data (Feature 3: Month-by-Month Skill Matrix)
const SKILL_HEATMAP_DATA: Record<string, { skill: string; months: Record<string, "high" | "med" | "low"> }[]> = {
  "std-maya-patel": [
    { skill: "DBMS & SQL", months: { "Jan": "high", "Feb": "high", "Mar": "med", "Apr": "high", "May": "high", "Jun": "high" } },
    { skill: "React UX State", months: { "Jan": "med", "Feb": "high", "Mar": "high", "Apr": "high", "May": "high", "Jun": "high" } },
    { skill: "Compiler Design", months: { "Jan": "low", "Feb": "low", "Mar": "med", "Apr": "med", "May": "low", "Jun": "low" } },
    { skill: "Python Logic", months: { "Jan": "high", "Feb": "med", "Mar": "high", "Apr": "high", "May": "med", "Jun": "high" } },
    { skill: "Public Pitching", months: { "Jan": "low", "Feb": "med", "Mar": "med", "Apr": "low", "May": "med", "Jun": "med" } }
  ],
  "std-leo-carter": [
    { skill: "DBMS & SQL", months: { "Jan": "med", "Feb": "med", "Mar": "high", "Apr": "med", "May": "high", "Jun": "high" } },
    { skill: "React UX State", months: { "Jan": "high", "Feb": "high", "Mar": "high", "Apr": "high", "May": "high", "Jun": "high" } },
    { skill: "Compiler Design", months: { "Jan": "med", "Feb": "med", "Mar": "med", "Apr": "high", "May": "med", "Jun": "high" } },
    { skill: "Python Logic", months: { "Jan": "med", "Feb": "high", "Mar": "high", "Apr": "high", "May": "high", "Jun": "high" } },
    { skill: "Public Pitching", months: { "Jan": "high", "Feb": "high", "Mar": "high", "Apr": "high", "May": "high", "Jun": "high" } }
  ],
  "std-alex-wong": [
    { skill: "DBMS & SQL", months: { "Jan": "high", "Feb": "high", "Mar": "high", "Apr": "high", "May": "high", "Jun": "high" } },
    { skill: "React UX State", months: { "Jan": "med", "Feb": "med", "Mar": "high", "Apr": "med", "May": "high", "Jun": "high" } },
    { skill: "Compiler Design", months: { "Jan": "high", "Feb": "high", "Mar": "high", "Apr": "high", "May": "high", "Jun": "high" } },
    { skill: "Python Logic", months: { "Jan": "high", "Feb": "high", "Mar": "high", "Apr": "high", "May": "high", "Jun": "high" } },
    { skill: "Public Pitching", months: { "Jan": "low", "Feb": "low", "Mar": "med", "Apr": "low", "May": "low", "Jun": "low" } }
  ]
};

// Skill Matrix Quadrant Coordinates mapped (Feature 5)
const SKILL_QUADRANTS: Record<string, {
  q1_strengths: string[];
  q2_focus: string[];
  q3_sec_strengths: string[];
  q4_dev_areas: string[];
}> = {
  "std-maya-patel": {
    q1_strengths: ["PyTorch Models", "React UX State", "Product Prototyping"],
    q2_focus: ["Network Protocols Lab", "Public Pitching Skills"],
    q3_sec_strengths: ["Python Core Logic", "Database Normalization"],
    q4_dev_areas: ["Compiler Construction", "Operating System Kernels"]
  },
  "std-leo-carter": {
    q1_strengths: ["Public Pitching", "Team Coordination", "React Design UI"],
    q2_focus: ["Python Machine Learning", "SQL Database Indices"],
    q3_sec_strengths: ["Agile Scrum Timelines", "Product Scope Maps"],
    q4_dev_areas: ["Lower-level Assembler", "Theoretical Computing Labs"]
  },
  "std-alex-wong": {
    q1_strengths: ["Ethical Pen Audits", "Python Core Logic", "Compiler Optimization"],
    q2_focus: ["Industrial Pitching", "Peer Interaction Seminars"],
    q3_sec_strengths: ["Relational Database Keys", "High Performance C++"],
    q4_dev_areas: ["Frontend UX Frameworks", "Agile Task Boards"]
  }
};

// Career DNA Machine Matchers (Feature 6)
const CAREER_MATCH_ENGINE: Record<string, { role: string; match: number; missing: string[]; color: string }[]> = {
  "std-maya-patel": [
    { role: "Software Engineer (AI/Frontend)", match: 88, missing: ["Compiler Mechanics", "Advanced SQL optimization"], color: "from-blue-500 to-indigo-600" },
    { role: "Product Prototyper", match: 84, missing: ["Product Analytics Dashboards"], color: "from-[#14B8A6] to-emerald-500" },
    { role: "Computer Network Engineer", match: 62, missing: ["Ethernet Protocol Tracing", "Cisco Socket Routing"], color: "from-amber-500 to-orange-600" },
    { role: "R&D Research Fellow", match: 58, missing: ["Academic Proposal Writing", "Discrete Mathematics"], color: "from-rose-500 to-red-600" }
  ],
  "std-leo-carter": [
    { role: "Product Specialist / Spokesman", match: 94, missing: ["Industrial Tech Writing"], color: "from-[#14B8A6] to-emerald-500" },
    { role: "UX Designer & Interface Lead", match: 91, missing: ["Vite Bundle Optimization"], color: "from-blue-500 to-indigo-600" },
    { role: "Software Architect", match: 68, missing: ["Advanced Memory Management", "Custom Compiler Norms"], color: "from-amber-500 to-orange-600" },
    { role: "Government Systems Director", match: 65, missing: ["Public Law Compliance"], color: "from-rose-500 to-red-600" }
  ],
  "std-alex-wong": [
    { role: "Security Vulnerability Auditor", match: 97, missing: ["Administrative Presentation"], color: "from-red-600 to-rose-700" },
    { role: "Back-End Performance specialist", match: 92, missing: ["Team Choreography Platforms"], color: "from-blue-500 to-indigo-600" },
    { role: "AI Model Trainer & Embedder", match: 84, missing: ["Human Interface Principles"], color: "from-[#14B8A6] to-emerald-500" },
    { role: "Corporate VP of Technology", match: 55, missing: ["Public Speaking", "Scrum Master Certification", "Budget Forecasting"], color: "from-amber-500 to-orange-600" }
  ]
};

// Challenge Impact Analytics (Feature 7)
const CHALLENGE_IMPACTS: { challengeName: string; duration: string; outcomes: string[]; iconLabel: string }[] = [
  {
    challengeName: "30-Day Focus Detox",
    duration: "Completed in Feb 2026",
    outcomes: ["Focus retention speed ↑ 21%", "Average Attendance compliance ↑ 8%", "Self-Study focus ↑ 4.5 hrs/wk"],
    iconLabel: "Detox"
  },
  {
    challengeName: "LeetCode Sprint: Algorithms 101",
    duration: "Completed in Mar 2026",
    outcomes: ["Technical GPA score ↑ 0.28 points", "Competency Matrix shifted to Expert", "Problem Solving time ↓ 14 mins"],
    iconLabel: "Coding"
  },
  {
    challengeName: "Elevator Pitch Bootcamp",
    duration: "Completed in Apr 2026",
    outcomes: ["Pitch Performance Index ↑ 48%", "Communication Radar dimension +18 pts", "Presentation anxiety score ↓ 35%"],
    iconLabel: "Communication"
  }
];

interface StudentDNAViewProps {
  student: StudentDNAProfile;
  db: AppDatabase;
  loadDatabase: () => Promise<void>;
  currentRole: UserRole;
  onEnrollChallenge: (chId: string) => Promise<void>;
  onRecordProgress: (chId: string) => Promise<void>;
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
}

export default function StudentDNAView({
  student,
  db,
  loadDatabase,
  currentRole,
  onEnrollChallenge,
  onRecordProgress,
  selectedStudentId,
  setSelectedStudentId
}: StudentDNAViewProps) {
  
  // Student DNA Section navigation
  const [internalTab, setInternalTab] = useState<"advisor" | "matrix" | "timeline" | "careers">("advisor");

  // Feature 2: DNA Timeline Semester Selector
  const [timelineSemester, setTimelineSemester] = useState<string>("Semester 4");

  // Retrieve matching profile scores for currently selected semester & student
  const currentStudentSemesterHistory = STUDENT_SEMESTER_HISTORY[student.studentId] || STUDENT_SEMESTER_HISTORY["std-maya-patel"];
  const selectedSemesterData = currentStudentSemesterHistory[timelineSemester] || currentStudentSemesterHistory["Semester 4"];

  // Chat History state
  const [chatHistory, setChatHistory] = useState<{ query: string; reply: string; timestamp: string }[]>([
    {
      query: "Analyze my primary digital twin baseline.",
      reply: `Synchronized successfully. I am your MirrorMind Digital Twin, running an active predictive modeling mesh. I've processed your 5D DNA Profile:
* **Academic track:** Currently standing at **${student.academic.currentGPA} GPA** with significant strengths in ML/Neural Networks, but encountering hurdles in Networks.
* **Attendance Risk:** Measured at **${student.behavioral.attendancePercentage}%**, putting you near the at-risk borderline.
* **Technical Velocity:** Outstanding! You have mastered 3 core skill paradigms.

How would you like me to align your routines today?`,
      timestamp: "Now"
    }
  ]);
  const [query, setQuery] = useState("");
  const [askingTwin, setAskingTwin] = useState(false);

  // Future Self Simulator (Feature 4 upgraded)
  const [simAttendance, setSimAttendance] = useState(student.behavioral.attendancePercentage);
  const [simChallenges, setSimChallenges] = useState(5);
  const [simStudyHours, setSimStudyHours] = useState(15);
  const [simulating, setSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<{
    gpa: number;
    employability: number;
    readiness: number;
    narrative: string;
  } | null>(null);

  // Set initial simulator state on student swap
  useEffect(() => {
    setSimAttendance(student.behavioral.attendancePercentage);
    setSimChallenges(student.digital.challengesCompletedCount + 3);
    setSimStudyHours(Math.round(student.digital.learningActivityHours / 10) || 12);
    setSimulationResult(null);
  }, [student.studentId]);

  // Handle Ask Twin AI
  const handleAskTwin = async (e?: React.FormEvent, customQ?: string) => {
    if (e) e.preventDefault();
    const activeQ = (customQ || query).trim();
    if (!activeQ) return;
    if (askingTwin) return; // Prevent duplicate requests (Only one Gemini request executes per user action)

    // 1. Check AI Twin response memoization cache first
    const cachedReply = getTwinAskCached(student.studentId, activeQ);
    if (cachedReply) {
      setQuery("");
      setChatHistory(prev => [
        ...prev,
        {
          query: activeQ,
          reply: `${cachedReply}\n\n*(💡 Digitally synchronized instantly from Digital Twin Memoization Cache)*`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      return;
    }

    try {
      setAskingTwin(true);
      setQuery("");
      const res = await fetch("/api/gemini/student-twin-ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: student.studentId,
          question: activeQ
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Save to memoization cache
      saveTwinAskCache(student.studentId, activeQ, data.reply);

      setChatHistory(prev => [
        ...prev,
        { query: activeQ, reply: data.reply, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    } catch (err: any) {
      console.error(err);
      const errInfo = parseGeminiError(err);
      
      // Local fallback counseling response
      const fallbackReply = `### 🧬 Digital Twin Calibration Report
Your Digital Twin has diagnosed your course issues based on classroom attendance metrics. By restoring classroom attendance above **90%**, we predict your GPA raises by **0.25 points** and placement readiness gains **18%**. Focus on hands-on sessions this week!

*Diagnostic Alert: ${errInfo.message}*`;

      setChatHistory(prev => [
        ...prev,
        { query: activeQ, reply: fallbackReply, timestamp: "Now" }
      ]);
    } finally {
      setAskingTwin(false);
    }
  };

  // Handle Future Self Simulation
  const handleSimulate = async () => {
    if (simulating) return; // Prevent duplicate requests (Only one Gemini request executes per user action)
    
    try {
      setSimulating(true);
      // Run Future Self Simulation LOCALLY (whenever possible!)
      // This is instant, zero-cost, responsive, and works completely offline/without Gemini API
      const result = simulateFutureSelfLocally(
        student,
        simAttendance,
        simChallenges,
        simStudyHours,
        74, // commsSkill default fallback
        78, // techSkill default fallback
        68  // sleepDiscipline default fallback
      );
      
      setSimulationResult(result);
    } catch (err) {
      console.error("Local simulation error:", err);
    } finally {
      setSimulating(false);
    }
  };

  // Feature 1: Dynamic Top Bullet Summaries based on selected student
  const getTwinTodaySummary = () => {
    if (student.studentId === "std-maya-patel") {
      return {
        status: "🟢 Maya Twin Online",
        flavor: "Visual developer profile actively mapping frontend frameworks and ML convergence.",
        points: [
          "Attendance: 78% (At-risk borderline, needs daily attendance streak logging)",
          "Programming: Improving with 3 active portfolios successfully mapped",
          "Communication: Declining (Presentation performance indices lagging)",
          "Recommended challenge: '30-Day Focus Detox' or weekly speaking labs"
        ]
      };
    } else if (student.studentId === "std-leo-carter") {
      return {
        status: "🟢 Leo Twin Online",
        flavor: "Collaborative systems leader driving cohort milestones & interface user loops.",
        points: [
          "Attendance: 91% (Excellent, high compliance marks)",
          "Programming: Improving (UX state paradigms solidifier)",
          "Communication: S-Tier Competence (Master spokesperson index)",
          "Recommended challenge: 'LeetCode Sprint' to bridge raw backend logic"
        ]
      };
    } else {
      return {
        status: "🟢 Alex Twin Online",
        flavor: "Cybersecurity and compiler performance systems mapping engine.",
        points: [
          "Attendance: 84% (Sufficient, stable submission timelines)",
          "Programming: Flawless (Mastered 3 backend structures)",
          "Communication: Declining (Public pitch sessions require remediation)",
          "Recommended challenge: 'Elevator Pitch Bootcamp' challenge assigned"
        ]
      };
    }
  };

  const todaySummary = getTwinTodaySummary();

  // Draw RADAR Charts
  const radarDimensions = [
    { key: "academic", label: "Academic", val: selectedSemesterData.academic, angle: -Math.PI / 2, color: "#3B82F6" },
    { key: "behavioral", label: "Behavioral", val: selectedSemesterData.behavioral, angle: -Math.PI / 2 + Math.PI / 3, color: "#10B981" },
    { key: "technical", label: "Technical", val: selectedSemesterData.technical, angle: -Math.PI / 2 + (2 * Math.PI) / 3, color: "#8B5CF6" },
    { key: "leadership", label: "Leadership", val: selectedSemesterData.leadership, angle: -Math.PI / 2 + Math.PI, color: "#F59E0B" },
    { key: "communication", label: "Communication", val: selectedSemesterData.communication, angle: -Math.PI / 2 + (4 * Math.PI) / 3, color: "#EC4899" },
    { key: "career", label: "Career Focus", val: selectedSemesterData.career, angle: -Math.PI / 2 + (5 * Math.PI) / 3, color: "#06B6D4" }
  ];

  const cx = 140;
  const cy = 145;
  const maxVal = 100;
  const r = 90; // max radius

  const pointsStr = radarDimensions.map(d => {
    const factor = d.val / maxVal;
    const xComp = cx + r * factor * Math.cos(d.angle);
    const yComp = cy + r * factor * Math.sin(d.angle);
    return `${xComp},${yComp}`;
  }).join(" ");

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Specific student heatmap records (Feature 3)
  const currentHeatmap = SKILL_HEATMAP_DATA[student.studentId] || SKILL_HEATMAP_DATA["std-maya-patel"];

  // Specific student skill matrix data (Feature 5)
  const currentQuadrants = SKILL_QUADRANTS[student.studentId] || SKILL_QUADRANTS["std-maya-patel"];

  // Specific student placement metrics (Feature 6)
  const currentCareerMatches = CAREER_MATCH_ENGINE[student.studentId] || CAREER_MATCH_ENGINE["std-maya-patel"];

  // Base Employability
  const baseEmployability = Math.round(
    (selectedSemesterData.technical * 0.4) + (selectedSemesterData.career * 0.3) + (selectedSemesterData.academic * 0.15) + (selectedSemesterData.communication * 0.15)
  );
  const basePlacementProb = Math.round(baseEmployability * 0.9);

  // Find active interventions for current student
  const activeStudentInterventions = db.interventions?.filter(
    (int) => int.studentId === student.studentId && int.status === "Active"
  ) || [];

  return (
    <div className="space-y-6">
      
      {/* ACTIVE PRINCIPAL REMEDIATION TRIGGER BANNER (Priority 3) */}
      {activeStudentInterventions.map((int) => (
        <div key={int.id} className="bg-rose-50 border border-rose-200 rounded-3xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-pulse relative overflow-hidden">
          <div className="space-y-1.5 flex-1 relative z-10">
            <div className="flex items-center gap-1.5 bg-rose-100 text-rose-800 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border border-rose-300 max-w-fit font-mono">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Active Campus Remediator Enforced</span>
            </div>
            <h4 className="font-extrabold text-slate-800 text-sm">Principal Directive Active: "{int.challengeTitle}"</h4>
            <p className="text-xs text-slate-605 leading-snug">
              Assigned by Campus Principal Arthur Vance to stabilize your warning parameters. <strong className="text-rose-700">Audit Diagnosis:</strong> {int.outcome}
            </p>
          </div>
          
          <button
            onClick={() => {
              const ch = db.challenges.find(c => c.title === int.challengeTitle);
              if (ch) {
                onEnrollChallenge(ch.id);
              }
            }}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-1.5 flex-shrink-0 relative z-10 hover:scale-105 transition"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Engage Remediation Streak</span>
          </button>
        </div>
      ))}
      
      {/* FEATURE 1: LIVING DIGITAL TWIN IDENTITY BANNER & REAL-TIME STATUS CARD */}
      <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 p-6 shadow-2xl relative overflow-hidden">
        {/* Abstract futuristic meshes */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute left-1/4 bottom-0 -mb-24 w-80 h-80 bg-[#14B8A6]/10 rounded-full blur-3xl"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative z-10">
          
          {/* Avatar and description */}
          <div className="lg:col-span-4 flex flex-col md:flex-row lg:flex-col gap-4 items-center md:items-start text-center md:text-left">
            <div className="relative">
              <span className="absolute inset-0 rounded-full border-4 border-emerald-500/30 animate-ping"></span>
              <img
                src={student.avatarUrl}
                alt={student.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500 shadow-2xl"
              />
              <div className="absolute bottom-1 right-1 px-2.5 py-0.5 bg-emerald-500 rounded-full text-[9px] font-black tracking-widest uppercase text-white shadow-md animate-pulse">
                Online
              </div>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
                <span className="text-[9px] font-black bg-emerald-500/25 text-emerald-400 px-2.5 py-0.5 rounded-full uppercase border border-emerald-500/30 font-mono">
                  {todaySummary.status}
                </span>
                <span className="text-[9px] font-black bg-blue-500/20 text-blue-400 px-2.5 py-0.5 rounded-full uppercase border border-blue-500/30 font-mono">
                  Cognitive Mesh Active
                </span>
              </div>
              <h2 className="text-3xl font-black tracking-tight font-display text-white">
                {student.name}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Syllabus Major: {student.department} • {student.semester}
              </p>
              <p className="text-[11px] text-slate-300 font-light max-w-sm">
                {todaySummary.flavor}
              </p>
            </div>
          </div>

          {/* Feature 1 Summary metrics items */}
          <div className="lg:col-span-5 bg-white/5 border border-white/5 rounded-3xl p-5 space-y-3">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <span className="text-[10px] uppercase font-black text-indigo-400 tracking-widest block font-mono">Today's Digital Twin Summary</span>
              <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
            </div>
            
            <div className="space-y-2">
              {todaySummary.points.map((pt, i) => (
                <div key={i} className="flex gap-2.5 items-start text-xs text-slate-200">
                  <span className="text-[#14B8A6] font-bold mt-0.5">↳</span>
                  <p className="leading-tight">{pt}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 text-[10px] text-slate-400 italic">
              * Live synchronizations occur hourly with clinical student-LMS logs.
            </div>
          </div>

          {/* Quick Active Student Switcher (Lecturer Portal) */}
          <div className="lg:col-span-3 flex flex-col justify-between h-full bg-slate-900/60 p-4 rounded-3xl border border-slate-800/80 w-full">
            <div className="space-y-1">
              <span className="text-[9px] font-bold uppercase text-slate-400 tracking-widest block">MirrorMind Diagnosis Desk</span>
              <span className="text-xs text-slate-300">Alternate live digital twin feeds:</span>
            </div>
            
            <div className="mt-3">
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="bg-slate-950 text-white border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full"
              >
                {db.students.map(s => (
                  <option key={s.studentId} value={s.studentId}>
                    {s.name} ({s.department.split(" ")[0]})
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 text-[10px] text-indigo-300 font-mono leading-none">
              Role: <strong className="text-white font-extrabold">{currentRole}</strong>
            </div>
          </div>

        </div>
      </div>

      {/* DETAILED INTERACTIVE MULTI-TAB PORTAL ROW */}
      <div className="flex gap-2 border-b border-slate-200 pb-1">
        {[
          { id: "advisor", label: "🤖 Live Twin Advisor & Heatmap" },
          { id: "matrix", label: "📊 Academic Matrix & Career DNA" },
          { id: "timeline", label: "⏳ DNA Evolution Timeline" },
          { id: "simulator", label: "🔮 Future Self Simulator" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setInternalTab(tab.id as any)}
            className={`px-4 py-2.5 text-xs font-black rounded-t-xl transition-all border-t-2 ${
              internalTab === tab.id
                ? "bg-white text-blue-700 border-blue-600 shadow-sm font-black"
                : "text-slate-500 hover:text-slate-900 border-transparent hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT 1: COGNITIVE TWIN ADVISOR & MONTHLY HEATMAP */}
      {internalTab === "advisor" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: COGNITIVE TWIN ADVISOR CHAT MESH */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-150 p-6 shadow-sm flex flex-col justify-between min-h-[460px]">
            <div>
              <div className="flex justify-between items-start border-b border-slate-100 pb-3 mb-4">
                <div>
                  <span className="text-[9px] uppercase tracking-widest font-black text-indigo-600 font-mono">Conversational AI</span>
                  <h3 className="font-extrabold text-slate-800 font-display text-sm flex items-center gap-1.5 mt-0.5">
                    <Brain className="w-4 h-4 text-indigo-600" />
                    <span>Ask {student.name}'s MirrorMind Twin</span>
                  </h3>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] font-mono font-bold text-slate-500">Live Synthesis Port</span>
                </div>
              </div>

              {/* Quick Suggestion buttons */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-2 mb-4">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 font-mono">Suggested Diagnostic Triggers</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "How can I maximize placement success?",
                    "Analyze student risk areas immediately.",
                    "Which daily challenges will build my communication DNA?",
                    "Synthesize strategic study habits based on my profile."
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuery(preset);
                        handleAskTwin(undefined, preset);
                      }}
                      className="text-[10px] text-left px-2.5 py-1 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 transition rounded-lg text-slate-700"
                    >
                      💡 {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat log */}
              <div className="space-y-4 max-h-[200px] overflow-y-auto pr-1">
                {chatHistory.map((item, i) => (
                  <div key={i} className="space-y-1">
                    <p className="font-bold text-[9px] text-slate-400 font-mono uppercase">
                      ↳ {item.timestamp} • You query:
                    </p>
                    <p className="text-xs bg-slate-100/60 p-2.5 rounded-xl border border-slate-100 text-slate-700 italic">
                      "{item.query}"
                    </p>
                    <p className="font-bold text-[9px] text-[#14B8A6] font-mono uppercase mt-2">
                       🔮 Twin Digital Response:
                    </p>
                    <div className="bg-slate-900 text-slate-100 p-3.5 rounded-2xl leading-relaxed text-[11px] font-sans antialiased text-left prose whitespace-pre-line">
                      {item.reply}
                    </div>
                  </div>
                ))}

                {askingTwin && (
                  <div className="flex gap-2 items-center text-indigo-600 italic text-[11px] font-mono mt-3">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Twin intelligence compute underway...</span>
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handleAskTwin} className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask your digital twin anything..."
                className="flex-1 bg-slate-50 border border-slate-205 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-550"
              />
              <button
                type="submit"
                disabled={askingTwin || !query.trim()}
                className="px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transmit</span>
              </button>
            </form>
          </div>

          {/* RIGHT: FEATURE 3: MONTHLY SKILL PROFICIENCY HEATMAP */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
            <div>
              <span className="text-[9px] uppercase tracking-widest font-black text-slate-400 font-mono">Feature #3</span>
              <h3 className="font-extrabold text-slate-800 font-display text-base">Monthly Student DNA Heatmap</h3>
              <p className="text-[11px] text-slate-400 font-light mt-0.5">Month-by-month consistency mapping based on daily streak completions.</p>
            </div>

            <div className="space-y-3.5">
              <div className="grid grid-cols-7 gap-1 font-mono text-[9px] text-slate-400 text-center font-bold">
                <div>Skill Node</div>
                <div>Jan</div>
                <div>Feb</div>
                <div>Mar</div>
                <div>Apr</div>
                <div>May</div>
                <div>Jun</div>
              </div>

              {currentHeatmap.map((row, idx) => (
                <div key={idx} className="grid grid-cols-7 gap-1 items-center">
                  <div className="text-[10px] font-bold text-slate-600 truncate">{row.skill}</div>
                  
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => {
                    const level = row.months[m];
                    const color = level === "high" ? "bg-emerald-500" : (level === "med" ? "bg-amber-400" : "bg-rose-500 animate-pulse");
                    const tooltip = level === "high" ? "Pristine logging" : (level === "med" ? "Medium consistency limit" : "Critical failure risk trigger");

                    return (
                      <div
                        key={m}
                        title={`${row.skill} (${m}): ${tooltip}`}
                        className={`h-7 rounded-lg ${color} transition hover:scale-110 cursor-help flex items-center justify-center`}
                      >
                        <span className="text-[8px] text-white font-mono font-black uppercase">
                          {level === "high" ? "A" : (level === "med" ? "B" : "F")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-500">
              <div className="flex gap-2 items-center">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-500 rounded"></span> High Compliance</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-400 rounded"></span> Medium Warning</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-rose-500 rounded"></span> High Risk Limit</span>
              </div>
            </div>
            
            {/* FEATURE 7: CHALLENGE IMPACT ANALYTICS (BOOST MATRIX) */}
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
              <div>
                <span className="text-[9px] uppercase tracking-widest font-black text-slate-400 font-mono">Feature #7</span>
                <h4 className="font-extrabold text-slate-800 font-display text-xs flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-blue-600" /> Challenge Impact Analytics
                </h4>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {CHALLENGE_IMPACTS.map((ch, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-xs font-black text-slate-800">{ch.challengeName}</p>
                      <p className="text-[9px] text-slate-450 font-medium font-mono">{ch.duration}</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {ch.outcomes.map((out, oIdx) => (
                          <span key={oIdx} className="bg-emerald-50/70 text-emerald-800 text-[8px] font-black font-sans px-2 py-0.5 rounded border border-emerald-100">
                            ✓ {out}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB CONTENT 2: COGNITIVE MATRIX & CAREER DNA */}
      {internalTab === "matrix" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          
          {/* LEFT: FEATURE 5: SKILL MATRIX QUADRANT 2x2 CHART */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
            <div>
              <span className="text-[10px] uppercase font-black text-indigo-600 block tracking-wider font-mono">Feature #5</span>
              <h3 className="font-extrabold text-slate-800 font-display text-base">Student DNA Skill Matrix Quadrants</h3>
              <p className="text-xs font-light text-slate-400">Core parameters mapped based on institutional high/low priority and mastered criteria.</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pb-2">
              
              {/* Q1: High Importance + High Skill */}
              <div className="bg-emerald-50 text-emerald-990 p-4 rounded-3xl border border-emerald-100 shadow-sm flex flex-col justify-between min-h-[160px]">
                <div>
                  <span className="text-[8px] uppercase tracking-widest font-black text-emerald-800 font-mono bg-emerald-200/50 px-2 py-0.5 rounded-full">
                    Quadrant A: Strengths
                  </span>
                  <p className="text-[10px] text-emerald-700/80 mt-1 font-light leading-snug">High Importance + Superior Skill mastery</p>
                  
                  <div className="mt-3.5 space-y-1">
                    {currentQuadrants.q1_strengths.map((sk, idx) => (
                      <span key={idx} className="block text-xs font-extrabold text-slate-800">
                        ⭐ {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Q2: High Importance + Low Skill */}
              <div className="bg-rose-50 text-rose-990 p-4 rounded-3xl border border-rose-100 shadow-sm flex flex-col justify-between min-h-[160px]">
                <div>
                  <span className="text-[8px] uppercase tracking-widest font-black text-rose-800 font-mono bg-rose-200/50 px-2 py-0.5 rounded-full">
                    Quadrant B: Immediate Focus
                  </span>
                  <p className="text-[10px] text-rose-700/80 mt-1 font-light leading-snug">High Importance + Improvement needed</p>
                  
                  <div className="mt-3.5 space-y-1">
                    {currentQuadrants.q2_focus.map((sk, idx) => (
                      <span key={idx} className="block text-xs font-semibold text-rose-900 border-b border-rose-100 pb-0.5">
                        ⚠️ {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Q3: Low Importance + High Skill */}
              <div className="bg-amber-100/40 text-amber-990 p-4 rounded-3xl border border-amber-100 shadow-sm flex flex-col justify-between min-h-[160px]">
                <div>
                  <span className="text-[8px] uppercase tracking-widest font-black text-amber-800 font-mono bg-amber-200/40 px-2 py-0.5 rounded-full">
                    Quadrant C: Secondary Strengths
                  </span>
                  <p className="text-[10px] text-amber-850/80 mt-1 font-light leading-snug">Moderate college weight + reliable mastery</p>
                  
                  <div className="mt-3.5 space-y-1">
                    {currentQuadrants.q3_sec_strengths.map((sk, idx) => (
                      <span key={idx} className="block text-xs text-slate-650">
                        ✓ {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Q4: Low Importance + Low Skill */}
              <div className="bg-indigo-50 text-indigo-990 p-4 rounded-3xl border border-indigo-100 shadow-sm flex flex-col justify-between min-h-[160px]">
                <div>
                  <span className="text-[8px] uppercase tracking-widest font-black text-indigo-800 font-mono bg-indigo-200/50 px-2 py-0.5 rounded-full">
                    Quadrant D: Development Areas
                  </span>
                  <p className="text-[10px] text-indigo-700/80 mt-1 font-light leading-snug">Moderate system priority + development target</p>
                  
                  <div className="mt-3.5 space-y-1">
                    {currentQuadrants.q4_dev_areas.map((sk, idx) => (
                      <span key={idx} className="block text-xs text-slate-500 italic">
                        • {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT: FEATURE 6: CAREER DNA MATCH ENGINE */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
            <div>
              <span className="text-[10px] uppercase font-black text-[#14B8A6] block tracking-wider font-mono">Feature #6</span>
              <h3 className="font-extrabold text-slate-800 font-display text-base">Al Career DNA Match Engine</h3>
              <p className="text-xs text-slate-400 font-light mt-0.5">Real-time placement compliance index based on mastered skill sets vs standard indexes.</p>
            </div>

            <div className="space-y-4">
              {currentCareerMatches.map((career, idx) => (
                <div key={idx} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between relative overflow-hidden transition hover:shadow-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-black text-slate-850 text-sm">{career.role}</h4>
                      <p className="text-[10px] text-slate-400 font-light mt-0.5">Syllabus category matching</p>
                    </div>
                    <span className="text-lg font-black font-display text-[#14B8A6] bg-[#14B8A6]/10 px-2.5 py-1 rounded-xl">
                      {career.match}% Match
                    </span>
                  </div>

                  {/* Matching Indicator bar */}
                  <div className="w-full bg-slate-200 h-2 rounded-full mt-3 overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${career.color}`} style={{ width: `${career.match}%` }}></div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-200/50">
                    <p className="text-[9px] uppercase tracking-wider font-bold text-rose-500 font-mono">Missing Specialized DNA Skills:</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {career.missing.map((sk, sIdx) => (
                        <span key={sIdx} className="bg-rose-50/70 text-rose-700 text-[9px] font-semibold px-2 py-0.5 rounded border border-rose-150 flex items-center gap-0.5">
                          ⚠️ {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* PRIORITY 1: TRANSPARENT STUDENT DNA SCORING INTERACTIVE PANEL */}
        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-205 space-y-4.5 mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 pb-3">
            <div>
              <span className="text-[10px] uppercase font-black text-indigo-600 block tracking-wider font-mono">Scoring Engine Blueprint</span>
              <h4 className="font-extrabold text-slate-800 text-sm">Dynamic Student DNA Formulation Engine</h4>
            </div>
            <span className="text-[9px] font-mono uppercase bg-indigo-50 border border-indigo-200 text-indigo-805 px-2.5 py-0.5 rounded font-black">
              100% Explainable Algorithms
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            <div className="bg-white rounded-2xl p-4 border border-slate-150 shadow-sm space-y-2">
              <div className="flex justify-between font-black text-slate-850">
                <span>Academic DNA Index</span>
                <span className="text-emerald-600 font-mono bg-emerald-50 px-2 py-0.5 rounded">{(student.academic.currentGPA / 4.0 * 100).toFixed(0)} / 100</span>
              </div>
              <p className="text-[10px] font-mono text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200/50">
                Formula: <code className="text-rose-600">GPA / 4.0 * 80 + assignmentTimeliness * 20</code>
              </p>
              <p className="text-[11px] font-light text-slate-450 leading-relaxed">
                Calculated directly from cumulative grader marks across core specialization labs, compiler design, and interactive homework checklists.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-150 shadow-sm space-y-2">
              <div className="flex justify-between font-black text-slate-850">
                <span>Behavioral DNA Index</span>
                <span className="text-amber-600 font-mono bg-amber-50 px-2 py-0.5 rounded">{(student.behavioral.attendancePercentage * 0.7 + student.behavioral.punctualityScore * 0.3).toFixed(0)} / 100</span>
              </div>
              <p className="text-[10px] font-mono text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200/50">
                Formula: <code className="text-rose-600">attendance * 0.7 + punctuality * 0.3</code>
              </p>
              <p className="text-[11px] font-light text-slate-450 leading-relaxed">
                Aggregated from overall class attendance ratios and class punctuality timestamps mapping physical lectures participation live.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-150 shadow-sm space-y-2">
              <div className="flex justify-between font-black text-slate-850">
                <span>Digital & Skill DNA Value</span>
                <span className="text-indigo-600 font-mono bg-indigo-50 px-2 py-0.5 rounded">{(student.digital.contentEngagementScore * 0.5 + student.digital.challengesCompletedCount * 10).toFixed(0)} / 100</span>
              </div>
              <p className="text-[10px] font-mono text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200/50">
                Formula: <code className="text-rose-600">engagement * 0.5 + challengeXp * 10</code>
              </p>
              <p className="text-[11px] font-light text-slate-450 leading-relaxed">
                Accumulated via active engagement with StudentMind Studio, total platform upload size, and completed routine challenge streaks.
              </p>
            </div>
          </div>
        </div>
      </>
    )}

      {/* TAB CONTENT 3: DNA EVOLUTION TIMELINE */}
      {internalTab === "timeline" && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6 animate-fadeIn">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-[10px] uppercase font-black text-indigo-600 block tracking-wider font-mono">Feature #2</span>
              <h3 className="font-extrabold text-slate-800 font-display text-lg">Student DNA Evolution Timeline</h3>
              <p className="text-xs text-slate-400 font-light mt-0.5">Explore cognitive development index milestones from Semester 1 through graduation target.</p>
            </div>

            {/* Stepper buttons (Semester 1 -> Semester 6) */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200/60">
              {["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5 (Proj)", "Semester 6 (Proj)"].map((sem) => (
                <button
                  key={sem}
                  onClick={() => setTimelineSemester(sem)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${
                    timelineSemester === sem
                      ? "bg-indigo-600 text-white shadow"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {sem.split(" ")[0]} {sem.split(" ")[1]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* RADAR CHART (Drawn based on selected semester values) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative bg-slate-50 border border-slate-100 p-4 rounded-3xl min-h-[340px]">
              <span className="absolute top-4 left-4 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded-lg text-[9px] font-mono text-indigo-700 font-bold uppercase">
                {timelineSemester} DNA Mapped
              </span>

              <svg width="280" height="285" className="mx-auto select-none mt-4 overflow-visible">
                {/* Background hexagonal lines */}
                {gridLevels.map((lvl, index) => {
                  const pointsLvl = radarDimensions.map(d => {
                    const xLvl = cx + r * lvl * Math.cos(d.angle);
                    const yLvl = cy + r * lvl * Math.sin(d.angle);
                    return `${xLvl},${yLvl}`;
                  }).join(" ");
                  return (
                    <polygon
                      key={index}
                      points={pointsLvl}
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="1"
                      strokeDasharray={index === 4 ? "none" : "2,2"}
                    />
                  );
                })}

                {/* Axes lines */}
                {radarDimensions.map((d, index) => {
                  const targetX = cx + r * Math.cos(d.angle);
                  const targetY = cy + r * Math.sin(d.angle);
                  return (
                    <line
                      key={index}
                      x1={cx}
                      y1={cy}
                      x2={targetX}
                      y2={targetY}
                      stroke="#E2E8F0"
                      strokeWidth="0.75"
                    />
                  );
                })}

                {/* Dynamic Radar Polygon */}
                <polygon
                  points={pointsStr}
                  fill="rgba(99, 102, 241, 0.25)"
                  stroke="#4F46E5"
                  strokeWidth="2.5"
                  className="transition-all duration-500 ease-in-out hover:fill-indigo-400/35"
                />

                {/* Nodes with custom scores */}
                {radarDimensions.map((d, index) => {
                  const factor = d.val / maxVal;
                  const targetX = cx + r * factor * Math.cos(d.angle);
                  const targetY = cy + r * factor * Math.sin(d.angle);
                  return (
                    <g key={index}>
                      <circle
                        cx={targetX}
                        cy={targetY}
                        r="5"
                        fill={d.color}
                        stroke="#FFF"
                        strokeWidth="1.5"
                      />
                      <text
                        x={cx + (r + 14) * Math.cos(d.angle)}
                        y={cy + (r + 8) * Math.sin(d.angle)}
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        fontSize="8.5"
                        fontWeight="700"
                        fill="#334155"
                        className="font-sans"
                      >
                        {d.label} {d.val}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* EVOLUTION TIMELINE LOGS DETAILS */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 space-y-3">
                <span className="text-[9px] uppercase font-bold text-indigo-400 tracking-widest font-mono">Development Memo</span>
                <h4 className="text-xl font-bold tracking-tight text-white font-display">Academic Evolution Insights</h4>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  {selectedSemesterData.memo}
                </p>

                <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-white/10">
                  <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                    <span className="text-[8px] text-slate-400 uppercase font-mono font-bold block">Academic score</span>
                    <strong className="text-sm font-black font-mono text-white">{selectedSemesterData.academic} / 100</strong>
                  </div>
                  <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                    <span className="text-[8px] text-slate-400 uppercase font-mono font-bold block">Technical track</span>
                    <strong className="text-sm font-black font-mono text-indigo-300">{selectedSemesterData.technical} / 100</strong>
                  </div>
                  <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                    <span className="text-[8px] text-slate-400 uppercase font-mono font-bold block">Career Focus</span>
                    <strong className="text-sm font-black font-mono text-emerald-300">{selectedSemesterData.career} / 100</strong>
                  </div>
                </div>
              </div>

              {/* OUTCOMES / METRIC SUMMARY */}
              <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                <h4 className="text-xs font-black text-indigo-900 uppercase tracking-wider mb-2 font-mono">Syllabus Milestones Completed</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex gap-2 items-center text-slate-700">
                    <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <span>Completed standard computer engineering foundation layers</span>
                  </div>
                  <div className="flex gap-2 items-center text-slate-700">
                    <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <span>Aesthetic UI modeling and UX deployment modules</span>
                  </div>
                </div>
              </div>

              {/* COHORT DNA PEER BENCHMARKING GRID (Priority 4) */}
              <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-5 space-y-4">
                <div>
                  <span className="text-[9px] uppercase font-bold text-indigo-600 font-mono block">Peer Benchmarking</span>
                  <h4 className="font-extrabold text-slate-800 text-sm mt-0.5">Cohort DNA Peer Benchmarking Axis</h4>
                  <p className="text-[11px] text-slate-450">Comparing your selected semester index to class, division, and elite campus averages.</p>
                </div>

                <div className="space-y-3">
                  {[
                    { label: `Your Score (${timelineSemester})`, score: selectedSemesterData.academic, color: "bg-indigo-600", note: "Your verified rating" },
                    { label: "Classroom Average", score: 74, color: "bg-blue-500", note: "CSE Cohort 4 mean" },
                    { label: "Department Average", score: 77, color: "bg-teal-500", note: "CSE Division aggregate" },
                    { label: "All-College Mean", score: 71, color: "bg-amber-500", note: "Campus overall baseline" },
                    { label: "Top 10% Elite Average", score: 91, color: "bg-[#14B8A6]", note: "High performing range" }
                  ].map((bench, bIdx) => (
                    <div key={bIdx} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-0.5 sm:w-2/5">
                        <span className="font-bold text-slate-800 block">{bench.label}</span>
                        <span className="text-[10px] text-slate-400 font-mono italic block">{bench.note}</span>
                      </div>
                      
                      {/* Comparison Progress Bar */}
                      <div className="flex-1 space-y-1">
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/50">
                          <div className={`h-full ${bench.color} transition-all duration-500`} style={{ width: `${bench.score}%` }}></div>
                        </div>
                        <div className="flex justify-between items-center text-[9px] text-[#22C55E] font-bold font-mono">
                          <span>Verified</span>
                          <span>{bench.score}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* TAB CONTENT 4: FUTURE PLACEMENT HABITS SIMULATOR */}
      {internalTab === "simulator" && (
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-6 min-h-[500px]">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-[9px] uppercase tracking-widest font-black text-indigo-400 font-mono">Feature #4</span>
              <h3 className="font-extrabold text-white font-display text-lg flex items-center gap-1.5">
                <Sliders className="w-5 h-5 text-indigo-400" />
                <span>Prism Future Self Simulator</span>
              </h3>
              <p className="text-xs text-slate-350 font-light mt-0.5">Adjust future behavior coordinates to run live algorithmic outcome projections with Gemini.</p>
            </div>
            
            <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-400 rounded-lg text-[9px] font-mono font-black uppercase tracking-widest border border-indigo-500/30">
              Prism Simulation Engine Active
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: CONTROL SLIDERS (VARIABLES) */}
            <div className="lg:col-span-4 bg-white/5 border border-white/5 p-5 rounded-3xl space-y-4">
              <span className="text-[10px] uppercase tracking-widest font-black text-indigo-300 font-mono block border-b border-white/10 pb-2">
                Simulated Parameters
              </span>

              {/* Slider 1: Attendance */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300 font-medium">Class Attendance</span>
                  <span className="font-bold text-emerald-400">{Math.round(simAttendance)}%</span>
                </div>
                <input
                  type="range"
                  min="65"
                  max="100"
                  value={simAttendance}
                  onChange={(e) => setSimAttendance(Number(e.target.value))}
                  className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="text-[9px] text-slate-400 block font-mono">Baseline value: {student.behavioral.attendancePercentage}%</span>
              </div>

              {/* Slider 2: Coding Challenges */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Challenges Accomplished</span>
                  <span className="font-bold text-indigo-300">{simChallenges} tasks</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="40"
                  value={simChallenges}
                  onChange={(e) => setSimChallenges(Number(e.target.value))}
                  className="w-full accent-indigo-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="text-[9px] text-slate-400 block font-mono">Baseline value: {student.digital.challengesCompletedCount} tasks</span>
              </div>

              {/* Slider 3: Study Habits hrs/wk */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Self-Study engagement (hrs/wk)</span>
                  <span className="font-bold text-amber-400">{simStudyHours} hours</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="45"
                  value={simStudyHours}
                  onChange={(e) => setSimStudyHours(Number(e.target.value))}
                  className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="text-[9px] text-slate-400 block font-mono">Baseline: ~{Math.round(student.digital.learningActivityHours / 10) || 12} hrs/wk</span>
              </div>

              {/* EXECUTE BUTTON */}
              <button
                onClick={handleSimulate}
                disabled={simulating}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 text-white font-black uppercase text-xs tracking-widest rounded-xl transition duration-150 shadow-lg block text-center"
              >
                {simulating ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-200" />
                    <span>Recalibrating Timelines...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1.5 animate-pulse">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Compute Future Timeline Outlook</span>
                  </span>
                )}
              </button>
            </div>

            {/* RIGHT COLUMN: COMPARISON & DYNAMIC FORECAST OUTCOMES */}
            <div className="lg:col-span-8 space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* PRESENT BASELINE CONTAINER */}
                <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-4 relative">
                  <span className="absolute top-3 right-3 bg-slate-800 text-slate-400 text-[8px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-widest">
                    Baseline Self
                  </span>
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider font-mono">Current Outcomes Profile</h4>
                    <p className="text-sm font-bold text-white mt-1">GPA and placement standard boundaries as of today.</p>
                  </div>

                  <div className="space-y-3.5 pt-2 border-t border-slate-800">
                    {/* GPA */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Cumulative GPA Score</span>
                      <strong className="text-sm font-mono text-white">{student.academic.currentGPA}</strong>
                    </div>
                    {/* Employability */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400 font-normal">Employability coefficient</span>
                      <strong className="text-sm font-mono text-emerald-400">{baseEmployability}%</strong>
                    </div>
                    {/* Placement Probability */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Employment Probability</span>
                      <strong className="text-sm font-mono text-indigo-400">{basePlacementProb}%</strong>
                    </div>
                  </div>
                </div>

                {/* FUTURE PREDICTIVE CONTAINER */}
                <div className="bg-slate-950 p-5 rounded-3xl border-2 border-indigo-500/40 space-y-4 relative shadow-2xl">
                  <span className="absolute top-3 right-3 bg-emerald-500/20 text-emerald-400 text-[8px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-widest animate-pulse">
                    Future Self Forecasts
                  </span>
                  <div>
                    <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider font-mono">Predictive Outlook Parameters</h4>
                    <p className="text-sm font-bold text-indigo-300 mt-1">Estimations after incorporating updated student disciplines.</p>
                  </div>

                  <div className="space-y-3.5 pt-2 border-t border-slate-800">
                    {/* GPA */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-350">Predicted GPA Score</span>
                      <div className="flex items-center gap-1.5">
                        <strong className="text-sm font-mono text-white">
                          {simulationResult?.gpa || Math.min(4.0, Number((student.academic.currentGPA + (simAttendance / 100) * 0.3 + (simChallenges * 0.01)).toFixed(2)))}
                        </strong>
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-black font-mono">
                          +{Math.max(0.01, Number(((simulationResult?.gpa || (student.academic.currentGPA + (simAttendance / 100) * 0.3 + (simChallenges * 0.01))) - student.academic.currentGPA).toFixed(2)))}
                        </span>
                      </div>
                    </div>
                    {/* Employability */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-350">Predicted Employability</span>
                      <div className="flex items-center gap-1.5">
                        <strong className="text-sm font-mono text-emerald-400">
                          {simulationResult?.employability || Math.min(100, Math.round(baseEmployability + (simChallenges * 1.2) + (simStudyHours * 0.5)))}%
                        </strong>
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-black font-mono">
                          +{Math.round((simulationResult?.employability || (baseEmployability + (simChallenges * 1.2) + (simStudyHours * 0.5))) - baseEmployability)}%
                        </span>
                      </div>
                    </div>
                    {/* Placement Reliability */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-350">Predicted Placement Likelihood</span>
                      <div className="flex items-center gap-1.5">
                        <strong className="text-sm font-mono text-indigo-300">
                          {simulationResult?.readiness || Math.min(100, Math.round(basePlacementProb + (simAttendance * 0.2) + (simChallenges * 0.8)))}%
                        </strong>
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-black font-mono">
                          +{Math.round((simulationResult?.readiness || (basePlacementProb + (simAttendance * 0.2) + (simChallenges * 0.8))) - basePlacementProb)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* AUTOMATED GEMINI PREDICTIVE NARRATIVE */}
              <div className="bg-white/5 border border-white/5 rounded-3xl p-5 space-y-3">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider font-mono block">🔮 Live Predictive Narrative from Futurity</span>
                
                <div className="text-xs text-slate-300 font-light leading-relaxed prose prose-invert overflow-y-auto max-h-[160px] pr-1.5 text-left select-text whitespace-pre-line">
                  {simulationResult ? (
                    simulationResult.narrative
                  ) : (
                    <p className="italic text-slate-400">
                      "I am waiting for your variables parameter configuration to write a personalized future chronicle. Click 'Compute Future Timeline Outlook' to trigger Gemini's chronological prognosis algorithm."
                    </p>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
