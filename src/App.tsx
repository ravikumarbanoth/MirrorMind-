/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Brain,
  User,
  Users,
  Settings,
  Award,
  BookOpen,
  Code,
  Smartphone,
  CalendarCheck,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Plus,
  Search,
  FileText,
  CheckCircle,
  TrendingUp,
  AlertTriangle,
  Check,
  RotateCcw,
  Briefcase,
  Activity,
  Compass,
  Globe,
  HelpCircle,
  Video,
  Image,
  Trophy,
  Loader2,
  Lock,
  ExternalLink,
  ChevronLeft,
  BookOpenCheck,
  Send,
  Zap,
  BookMarked,
  Info,
  Sliders,
  Target,
  ShieldAlert,
  Share2
} from "lucide-react";
import {
  UserRole,
  StudentDNAProfile,
  Challenge,
  StudentChallengeProgress,
  LeaderboardUser,
  GeneratedStudyPack,
  ValueWeaveInsight,
  AppDatabase
} from "./types";
import StudentDNAView from "./components/StudentDNAView";
import PrincipalDNAView from "./components/PrincipalDNAView";
import MyTwinHome from "./components/MyTwinHome";
import StudentLifeGraph from "./components/StudentLifeGraph";
import DigitalTwinMemory from "./components/DigitalTwinMemory";
import FutureSelfSimulator from "./components/FutureSelfSimulator";
import CompetitiveExamDNA from "./components/CompetitiveExamDNA";
import AIInterventionEngine from "./components/AIInterventionEngine";
import GamificationEngine from "./components/GamificationEngine";
import ViralShareCards from "./components/ViralShareCards";
import StudentMindStudioExpanded from "./components/StudentMindStudioExpanded";
import CareerDNACenter from "./components/CareerDNACenter";

export default function App() {
  // Database States
  const [db, setDb] = useState<AppDatabase | null>(null);
  const [loadingDb, setLoadingDb] = useState(true);
  
  // App context states
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.STUDENT);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("std-maya-patel");
  
  // Custom states
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // --- Student Tab State ---
  const [studentTab, setStudentTab] = useState<
    | "twin-home"
    | "life-graph"
    | "exam-dna"
    | "simulator"
    | "intervention"
    | "studio"
    | "gamification"
    | "viral-share"
    | "dna"
    | "challenges"
    | "career"
  >("twin-home");

  const [showEnterpriseRoles, setShowEnterpriseRoles] = useState(false);

  // --- Module 2: AI Student Mirror States ---
  const [twinQuestion, setTwinQuestion] = useState("");
  const [twinChatHistory, setTwinChatHistory] = useState<{ query: string; reply: string; timestamp: Date }[]>([]);
  const [askingTwin, setAskingTwin] = useState(false);

  // --- Module 3: Challenge System States ---
  const [recordingProgressId, setRecordingProgressId] = useState<string | null>(null);
  const [challengeLogNote, setChallengeLogNote] = useState("");
  const [enrollingChallengeId, setEnrollingChallengeId] = useState<string | null>(null);

  // --- Module 4 & 5: StudentMind Studio States ---
  const [sourceType, setSourceType] = useState<string>("Text Document");
  const [sourceName, setSourceName] = useState<string>("");
  const [sourceContent, setSourceContent] = useState<string>("");
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [generatingStudio, setGeneratingStudio] = useState(false);
  const [activeGeneratedPack, setActiveGeneratedPack] = useState<GeneratedStudyPack | null>(null);
  
  // Interactive Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number } | null>(null);
  
  // Pre-seed sources for easy testing
  const SAMPLE_SOURCES = [
    {
      title: "ValueWeave Enterprise Labor Index Q2-2026",
      type: "Research Paper",
      content: `The Q2 2026 employment indexes indicate an explosive shift toward full-stack artificial intelligence specialists. Organizations running decentralized teams report a 140% spike in engineering requirements where visual interface design is directly coupled to cloud-hosted large language models. The report calls out a notable gap in serverless prompt-mesh prototyping skills, recommending that upcoming computer science cohorts build continuous daily mini-deployments of AI-grounded interactive dashboards. High-performance graphics acceleration networks (GPU grids) and next-generation REST gateways are the standard tools for high-performing technology teams.`
    },
    {
      title: "Advanced Neural Architectures & Cognitive Loss Functions",
      type: "Lecture Note",
      content: `In modern deep learning paradigms, backpropagation relies on high-fidelity loss estimation over massive training tensors. While standard Mean Squared Error (MSE) suffices for simple linear estimations, transformer embeddings require complex cross-entropy convergence scales. A major limitation of contemporary student researchers is neglecting custom mathematical normalization, leading to exploding or vanishing gradients during backprop epochs. Real-world implementations require robust attention visualization, learning-rate schedules with cosine warmups, and proper database configuration for raw weight telemetry.`
    },
    {
      title: "Ethical Hacking: Wireless Mesh Protocols & Sandbox Defenses",
      type: "News Article",
      content: `Security researchers warned of a series of zero-day vulnerabilities in enterprise firewalls routing edge iot devices. Specifically, authenticated stack buffer overflows allow unauthorized remote code execution. Security experts emphasize practicing sandbox isolation, monitoring telemetry with customized Python threat hunting scripts, and studying historic web protocol exploits (e.g., cross-network certificate collisions). Practitioners must acquire competencies in static binary analysis, containerized secure boundaries, and verbal presentation to accurately report structural exploits to high-level compliance officers.`
    }
  ];

  // --- Module 7: Lecturer Assistant States ---
  const [lecturerRequestType, setLecturerRequestType] = useState<string>("Lesson Plan");
  const [lecturerTopic, setLecturerTopic] = useState<string>("");
  const [lecturerNotes, setLecturerNotes] = useState<string>("");
  const [synthesizingLecturer, setSynthesizingLecturer] = useState(false);
  const [synthesizedOutput, setSynthesizedOutput] = useState<string>("");

  // Lecturer custom challenge creation states
  const [newChTitle, setNewChTitle] = useState("");
  const [newChDesc, setNewChDesc] = useState("");
  const [newChCategory, setNewChCategory] = useState<"Detox" | "Reading" | "Coding" | "Communication" | "Attendance" | "Leadership" | "AI">("Coding");
  const [newChDuration, setNewChDuration] = useState(7);
  const [newChXp, setNewChXp] = useState(200);
  const [newChBadge, setNewChBadge] = useState("");
  const [newChColor, setNewChColor] = useState("indigo");
  const [newChIcon, setNewChIcon] = useState("Award");

  // --- Module 9: ValueWeave Insights States ---
  const [synchronizingVW, setSynchronizingVW] = useState<string | null>(null);

  // Initial Fetch database state
  const loadDatabase = async () => {
    try {
      setLoadingDb(true);
      const res = await fetch("/api/db");
      if (!res.ok) throw new Error("Failed to sync backend state");
      const data = await res.json();
      setDb(data);
      // Synchronize client context with whatever server says is user
      if (data.currentUser) {
        setCurrentRole(data.currentUser.role);
        if (data.currentUser.studentId) {
          setSelectedStudentId(data.currentUser.studentId);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred connecting to database.");
    } finally {
      setLoadingDb(false);
    }
  };

  useEffect(() => {
    loadDatabase();
  }, []);

  // Handle Switch User Mode
  const handleSwitchUserRole = async (role: UserRole, studentId?: string) => {
    try {
      setErrorMsg(null);
      setSuccessMsg(null);
      const targetId = studentId || (role === UserRole.STUDENT ? "std-maya-patel" : undefined);
      
      const res = await fetch("/api/select-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, studentId: targetId })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Session updated! Signed in as "${data.currentUser.name}" (${role})`);
        setCurrentRole(role);
        if (targetId) {
          setSelectedStudentId(targetId);
        }
        // Reload fresh database to update current session state
        await loadDatabase();
      }
    } catch (err: any) {
      setErrorMsg("Failed to switch mock sessions: " + err.message);
    }
  };

  // --- Enrolling in a challenge ---
  const enrollInChallenge = async (chId: string) => {
    if (!db) return;
    try {
      setEnrollingChallengeId(chId);
      setErrorMsg(null);
      setSuccessMsg(null);
      const res = await fetch("/api/challenges/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId: chId, studentId: selectedStudentId })
      });
      const resData = await res.json();
      if (resData.success) {
        setSuccessMsg("Successfully enrolled in this challenge! Daily routines are now online.");
        await loadDatabase();
      }
    } catch (err: any) {
      setErrorMsg("Enrollment failed: " + err.message);
    } finally {
      setEnrollingChallengeId(null);
    }
  };

  // --- Logging daily progress ---
  const recordChallengeProgress = async (chId: string) => {
    try {
      setRecordingProgressId(chId);
      setErrorMsg(null);
      const res = await fetch("/api/challenges/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeId: chId,
          studentId: selectedStudentId,
          note: challengeLogNote || "Completed daily educational routines."
        })
      });
      const resData = await res.json();
      if (resData.success) {
        setSuccessMsg("Progress recorded! Streak updated, and XP level metrics synchronized successfully.");
        setChallengeLogNote("");
        await loadDatabase();
      } else {
        setErrorMsg(resData.error || "Could not record daily progress");
      }
    } catch (errChat: any) {
      setErrorMsg("Network action failed: " + errChat.message);
    } finally {
      setRecordingProgressId(null);
    }
  };

  // --- Lecturer Creates Challenge ---
  const createCustomChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChTitle || !newChDesc) {
      setErrorMsg("Please fill in Challenge Title and Description.");
      return;
    }
    try {
      setErrorMsg(null);
      setSuccessMsg(null);
      const res = await fetch("/api/challenges/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newChTitle,
          description: newChDesc,
          category: newChCategory,
          durationDays: newChDuration,
          xpValue: newChXp,
          badgeName: newChBadge || "Pioneer Emblem",
          badgeColor: newChColor,
          badgeIcon: newChIcon
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Successfully deployed new campus-wide challenge: "${newChTitle}"!`);
        setNewChTitle("");
        setNewChDesc("");
        setNewChBadge("");
        await loadDatabase();
      }
    } catch (err: any) {
      setErrorMsg("Could not create challenge: " + err.message);
    }
  };

  // --- Module 2: AI Student Twin Mirror Advice Chat ---
  const askStudentTwinAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twinQuestion.trim()) return;
    try {
      setAskingTwin(true);
      setErrorMsg(null);
      const res = await fetch("/api/gemini/student-twin-ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudentId,
          question: twinQuestion
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setTwinChatHistory(prev => [
        ...prev,
        { query: twinQuestion, reply: data.reply, timestamp: new Date() }
      ]);
      setTwinQuestion("");
    } catch (err: any) {
      setErrorMsg("Gemini Twin communication error: " + err.message);
    } finally {
      setAskingTwin(false);
    }
  };

  const handlePredefinedQuestion = (qText: string) => {
    setTwinQuestion(qText);
  };

  // --- Module 4 & 5: StudentMind Studio Generative Flow ---
  const triggerStudioGeneration = async () => {
    if (!sourceContent.trim()) {
      setErrorMsg("Please enter or select source content first in StudentMind Studio.");
      return;
    }
    try {
      setGeneratingStudio(true);
      setErrorMsg(null);
      setSuccessMsg(null);
      setQuizAnswers({});
      setQuizSubmitted(false);
      setQuizScore(null);

      const res = await fetch("/api/gemini/studentmind-studio/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceType,
          sourceName: sourceName || "Custom Lecture Note draft",
          sourceContent,
          studentId: selectedStudentId, // personalizes according to 5D Student DNA!
          customPrompt
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setActiveGeneratedPack(data.studyPack);
      setSuccessMsg("AI content successfully synthesized! Integrated Student DNA mapping into curriculum components.");
      setStudentTab("studio"); // Shift focus to Studio tab to look at results
    } catch (err: any) {
      setErrorMsg("Generation failed: " + err.message);
    } finally {
      setGeneratingStudio(false);
    }
  };

  // Select seed sample
  const applySampleSource = (sample: typeof SAMPLE_SOURCES[number]) => {
    setSourceName(sample.title);
    setSourceType(sample.type);
    setSourceContent(sample.content);
    setSuccessMsg(`Loaded sample content: "${sample.title}"! Customize settings below.`);
  };

  // Submit test quiz answers
  const handleSubmitQuiz = () => {
    if (!activeGeneratedPack) return;
    const questions = activeGeneratedPack.assessment.questions;
    let scoreCount = 0;
    questions.forEach((q, idx) => {
      if (q.type === "MCQ") {
        const selected = quizAnswers[idx];
        if (selected && selected.trim().toLowerCase() === q.correctAnswer?.trim().toLowerCase()) {
          scoreCount++;
        }
      }
    });
    setQuizScore({ correct: scoreCount, total: questions.filter(q => q.type === "MCQ").length });
    setQuizSubmitted(true);
    setSuccessMsg("Practice quiz answers logged and analyzed! High-fidelity learning loop locked.");
  };

  // --- Module 7: Lecturer Assistant AI blueprint ---
  const handleLecturerSynthesis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lecturerTopic) {
      setErrorMsg("Please provide a topic description.");
      return;
    }
    try {
      setSynthesizingLecturer(true);
      setErrorMsg(null);
      const res = await fetch("/api/gemini/lecturer-assistant/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestType: lecturerRequestType,
          topic: lecturerTopic,
          departmentNotes: lecturerNotes
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSynthesizedOutput(data.content);
      setSuccessMsg(`Successfully generated collegiate ${lecturerRequestType}!`);
    } catch (err: any) {
      setErrorMsg("Error synthesizing lecturer tools: " + err.message);
    } finally {
      setSynthesizingLecturer(false);
    }
  };

  // --- Module 9: ValueWeave Smart Connector Trigger ---
  const syncValueWeaveInsight = async (insightId: string) => {
    try {
      setSynchronizingVW(insightId);
      setErrorMsg(null);
      setSuccessMsg(null);
      const res = await fetch("/api/valueweave/simulate-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ insightId })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setSuccessMsg(data.message);
      // Reload database to see altered student targets / challenges!
      await loadDatabase();
    } catch (err: any) {
      setErrorMsg("ValueWeave connector failed: " + err.message);
    } finally {
      setSynchronizingVW(null);
    }
  };

  // Helpers for selected student metrics
  const getSelectedStudent = (): StudentDNAProfile | undefined => {
    return db?.students.find(s => s.studentId === selectedStudentId);
  };

  const student = getSelectedStudent();

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-slate-900 font-sans flex flex-col md:flex-row antialiased">
      
      {/* LEFT SIDE NAVIGATOR: Bento Theme */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-[#2563EB] rounded-xl flex items-center justify-center shadow-md shadow-blue-200">
              <Brain className="w-5.5 h-5.5 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[#2563EB] block font-display">MirrorMind</span>
              <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">Student DNA Studio</span>
            </div>
          </div>
        </div>

        {/* PROFILE IDENTIFICATION BANNER */}
        <div className="p-5 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {student ? (
              <>
                <img
                  src={student.avatarUrl}
                  alt={student.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-500/20"
                />
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-slate-800 truncate leading-tight">{student.name}</p>
                  <p className="text-xs text-[#2563EB] font-mono mt-0.5">{student.semester} • CS Twin</p>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin text-[#2563EB]" />
                <span>Synchronizing profile...</span>
              </div>
            )}
          </div>
        </div>

        {/* OPTIONAL ENTERPRISE NAVIGATION */}
        <div className="p-4 space-y-6 flex-1 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-6">
            <div className="border border-slate-150 rounded-2xl p-3 bg-slate-50/50">
              <button
                onClick={() => setShowEnterpriseRoles(!showEnterpriseRoles)}
                className="w-full flex items-center justify-between text-[11px] font-black text-slate-500 uppercase tracking-widest"
              >
                <span>💼 Enterprise Counselor Portal</span>
                <span className="text-xs">{showEnterpriseRoles ? "▲" : "▼"}</span>
              </button>
              {showEnterpriseRoles && (
                <div className="grid grid-cols-2 gap-1.5 mt-2.5 animate-fadeIn">
                  {[UserRole.STUDENT, UserRole.LECTURER, UserRole.PRINCIPAL, UserRole.SUPER_ADMIN].map((role) => (
                    <button
                      key={role}
                      id={`role-btn-${role.toLowerCase().replace(" ", "-")}`}
                      onClick={() => handleSwitchUserRole(role as UserRole)}
                      className={`px-2 py-1.5 rounded-lg text-[10px] font-bold text-left transition-all flex items-center gap-1 ${
                        currentRole === role
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {role === UserRole.STUDENT && <User className="w-3 h-3" />}
                      {role === UserRole.LECTURER && <Users className="w-3 h-3" />}
                      {role === UserRole.PRINCIPAL && <Award className="w-3 h-3" />}
                      {role === UserRole.SUPER_ADMIN && <Settings className="w-3 h-3" />}
                      <span className="truncate">{role}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* STUDENT QUICKLINK COMPASS */}
            {currentRole === UserRole.STUDENT && (
              <div className="space-y-1">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">
                  Student Navigation
                </div>
                {[
                  { id: "twin-home", label: "🏡 My Twin Home", icon: Brain },
                  { id: "life-graph", label: "📊 Student Life Graph", icon: Activity },
                  { id: "exam-dna", label: "🎯 Competitive Exam DNA", icon: Target, badge: "NEW" },
                  { id: "simulator", label: "🔮 Future Self Simulator", icon: Sliders },
                  { id: "intervention", label: "⚡ AI Intervention Plans", icon: ShieldAlert },
                  { id: "studio", label: "🎨 StudentMind Studio GenAI", icon: Compass, badge: "GenAI" },
                  { id: "gamification", label: "🏆 Achievements & Badge", icon: Trophy },
                  { id: "viral-share", label: "✨ Viral Social Growth Cards", icon: Share2 },
                  { id: "dna", label: "🧬 Original 5D Twin DNA", icon: BookOpen },
                  { id: "challenges", label: "🏁 Challenge Arena", icon: Award, count: db?.challenges.length },
                  { id: "career", label: "💼 Career & ValueWeave", icon: Briefcase }
                ].map((item) => {
                  const IconComp = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setStudentTab(item.id as any)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold tracking-tight transition-colors ${
                        studentTab === item.id
                          ? "bg-blue-50 text-blue-700 font-extrabold"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <IconComp className={`w-3.5 h-3.5 ${studentTab === item.id ? "text-blue-600" : "text-slate-400"}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 text-[8px] bg-teal-100 text-teal-800 font-bold rounded uppercase">
                          {item.badge}
                        </span>
                      )}
                      {item.count !== undefined && (
                        <span className="w-5 h-5 flex items-center justify-center text-[10px] bg-slate-100 text-slate-500 rounded-full font-mono font-bold">
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* QUICK STUDENT SWITCHER (Only active for Counselor/Lecturer/Principal context) */}
          {currentRole !== UserRole.STUDENT && db && (
            <div className="space-y-1.5">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Focus Student Profile
              </div>
              <div className="space-y-1">
                {db.students.map((st) => (
                  <button
                    key={st.studentId}
                    onClick={() => setSelectedStudentId(st.studentId)}
                    className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-all ${
                      selectedStudentId === st.studentId
                        ? "bg-slate-100 ring-1 ring-slate-200 font-medium"
                        : "hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <img src={st.avatarUrl} alt={st.name} className="w-7 h-7 rounded-full object-cover" />
                    <div className="overflow-hidden">
                      <p className="text-xs font-semibold truncate leading-none text-slate-800">{st.name}</p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">GPA: {st.academic.currentGPA}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* MINI STATUS TELEMETRY BLOCKED */}
        <div className="p-4 border-t border-slate-100 mt-auto bg-slate-50 text-xs text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
            <span className="font-mono text-[10px]">MIRRORMIND_PROD</span>
          </div>
          <span className="font-mono text-[9px]">v1.0.1 (Phase 1)</span>
        </div>
      </aside>

      {/* RIGHT SIDE MAIN CONTAINER */}
      <main className="flex-1 p-6 md:p-8 flex flex-col overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* HEADER TOP-BAR */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs bg-blue-100 text-[#2563EB] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest">
                {currentRole} WORKSPACE
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium">Academic Twin Environment v2.4</span>
            </div>
            
            {currentRole === UserRole.STUDENT && (
              <>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">
                  Welcome back, <span className="text-[#2563EB]">{student?.name || "Scholar"}</span>
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Your Digital Twin DNA updated 14 minutes ago. <span className="text-teal-600 font-semibold">{student?.digital.streakDays}-day learning streak</span> is active!
                </p>
              </>
            )}

            {currentRole === UserRole.LECTURER && (
              <>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">
                  Lecturer Hub: <span className="text-[#14B8A6]">Prof. Sarah Jenkins</span>
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Synthesize educational content, track student behavioral risk scores, and assign challenges.
                </p>
              </>
            )}

            {currentRole === UserRole.PRINCIPAL && (
              <>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">
                  Executive Dashboard: <span className="text-[#F59E0B]">Dr. Arthur Vance</span>
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  College overview, drop-out predictive analysis, department curves, and AI risk alerts.
                </p>
              </>
            )}

            {currentRole === UserRole.SUPER_ADMIN && (
              <>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">
                  Super Admin Controls
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Monitor integrated system telemetry and manipulate in-memory simulated database records.
                </p>
              </>
            )}
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => { setStudentTab("studio"); handleSwitchUserRole(UserRole.STUDENT); }}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Compass className="w-3.5 h-3.5 text-teal-600" />
              <span>Launch Studio</span>
            </button>
            <button
              onClick={loadDatabase}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-300" />
              <span>Force Sync</span>
            </button>
          </div>
        </header>

        {/* FEEDBACK STATUS ALERTS */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800 animate-fadeIn">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
            <div>
              <p className="font-semibold text-sm">Action Rejected</p>
              <p className="text-xs text-rose-700/90 mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-emerald-800 animate-fadeIn">
            <CheckCircle className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
            <div>
              <p className="font-semibold text-sm">System Update</p>
              <p className="text-xs text-emerald-700/90 mt-0.5">{successMsg}</p>
            </div>
          </div>
        )}

        {/* CORE RENDER DECISION ENGINE */}
        {loadingDb ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-[#2563EB] animate-spin mb-4" />
            <h3 className="font-semibold text-lg text-slate-700">Connecting Twin Core</h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">Synchronizing telemetry layers with server.ts...</p>
          </div>
        ) : !db ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 bg-white border border-dashed text-center max-w-md mx-auto p-8 rounded-3xl">
            <AlertTriangle className="w-12 h-12 text-[#F59E0B] mx-auto mb-4" />
            <h3 className="font-bold text-lg text-slate-800">Database Offline</h3>
            <p className="text-sm text-slate-500 mt-2">
              Failed to load initial mock database from the express back-end. Please check if the server started successfully.
            </p>
            <button
              onClick={loadDatabase}
              className="mt-5 px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
            >
              Retry Sync
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* ROLE 1: Student View Dashboard */}
            {currentRole === UserRole.STUDENT && student && (
              <div className="space-y-8">
                
                {/* SUB TAB VIEWPORT BAR */}
                <div className="flex flex-wrap gap-1.5 p-1 bg-slate-200/50 rounded-xl">
                  {[
                    { id: "twin-home", label: "🏡 Home" },
                    { id: "life-graph", label: "📊 Life Graph" },
                    { id: "exam-dna", label: "🎯 Exam DNA" },
                    { id: "simulator", label: "🔮 Sandbox" },
                    { id: "intervention", label: "⚡ Actions" },
                    { id: "studio", label: "🎨 Studio" },
                    { id: "gamification", label: "🏆 Rewards" },
                    { id: "viral-share", label: "✨ Share" },
                    { id: "dna", label: "🧬 DNA Profile" },
                    { id: "challenges", label: "🏁 Challenges" },
                    { id: "career", label: "🚀 Placement" }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setStudentTab(tab.id as any)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all ${
                        studentTab === tab.id
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* TAB CONTENT: V2 AND V1 UNIFIED VIEWPORTS */}
                {studentTab === "twin-home" && (
                  <MyTwinHome
                    student={student}
                    db={db!}
                    onEnrollChallenge={enrollInChallenge}
                    onRecordProgress={recordChallengeProgress}
                    onNavigateToTab={(tabId) => setStudentTab(tabId as any)}
                    loadDatabase={loadDatabase}
                  />
                )}

                {studentTab === "life-graph" && (
                  <StudentLifeGraph />
                )}

                {studentTab === "exam-dna" && (
                  <CompetitiveExamDNA />
                )}

                {studentTab === "simulator" && (
                  <FutureSelfSimulator student={student} />
                )}

                {studentTab === "intervention" && (
                  <AIInterventionEngine student={student} />
                )}

                {studentTab === "studio" && (
                  <StudentMindStudioExpanded
                    student={student}
                    db={db!}
                    loadDatabase={loadDatabase}
                  />
                )}

                {studentTab === "gamification" && (
                  <GamificationEngine student={student} />
                )}

                {studentTab === "viral-share" && (
                  <ViralShareCards student={student} />
                )}

                {studentTab === "dna" && (
                  <StudentDNAView
                    student={student}
                    db={db!}
                    loadDatabase={loadDatabase}
                    currentRole={currentRole}
                    onEnrollChallenge={enrollInChallenge}
                    onRecordProgress={recordChallengeProgress}
                    selectedStudentId={selectedStudentId}
                    setSelectedStudentId={setSelectedStudentId}
                  />
                )}
                {false && studentTab === "dna" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* BENTO GRID CELL 1: Holistic DNA Radar Indicator (Left Span) */}
                    <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <span className="text-[10px] bg-blue-50 text-[#2563EB] px-2 py-0.5 rounded font-bold tracking-widest uppercase">
                            Module 1 Active Twin
                          </span>
                          <h3 className="font-bold text-xl text-slate-900 mt-1 font-display">Student DNA Engine</h3>
                          <p className="text-xs text-slate-400">Holistic five-dimensional cognitive analysis mapping</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-green-600 font-semibold bg-green-50 px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                          <span>99.4% Synthesized</span>
                        </div>
                      </div>

                      {/* Radar DNA Chart & Highlight Widgets */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center flex-1">
                        
                        {/* Custom Dynamic SVG Radar representation of this specific student's DNA dimensions */}
                        <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100 relative min-h-[220px]">
                          <svg className="w-48 h-48 overflow-visible" viewBox="0 0 200 200">
                            {/* Static guidelines grids */}
                            <polygon points="100,20 180,60 180,140 100,180 20,140 20,60" fill="none" stroke="#E2E8F0" strokeWidth="1" />
                            <polygon points="100,45 160,75 160,125 100,155 40,125 40,75" fill="none" stroke="#E2E8F0" strokeWidth="1" />
                            <polygon points="100,70 140,90 140,110 100,130 60,110 60,90" fill="none" stroke="#E2E8F0" strokeWidth="1" />
                            
                            {/* DNA Polygon Calculations based on student properties */}
                            {/* Dimensions order: 1 Academic, 2 Attendance, 3 Practice Learning, 4 Active Streak, 5 Career Domain Focus */}
                            {(() => {
                              const academicVal = (student.academic.currentGPA / 4) * 80; // normalized
                              const attendanceVal = (student.behavioral.attendancePercentage / 100) * 80;
                              const practiceVal = (student.learning.practice / 100) * 80;
                              const digitalVal = (student.digital.contentEngagementScore / 100) * 80;
                              const careerVal = (student.career.roadmapCompleted / 100) * 80;

                              // Coordinate converters
                              const getPt = (angleDeg: number, val: number) => {
                                const angleRad = (angleDeg - 90) * (Math.PI / 180);
                                const x = 100 + val * Math.cos(angleRad);
                                const y = 100 + val * Math.sin(angleRad);
                                return `${x.toFixed(1)},${y.toFixed(1)}`;
                              };

                              const p1 = getPt(0, academicVal);     // TOP
                              const p2 = getPt(72, attendanceVal);   // RIGHT TOP
                              const p3 = getPt(144, digitalVal);    // RIGHT BOTTOM
                              const p4 = getPt(216, careerVal);     // LEFT BOTTOM
                              const p5 = getPt(288, practiceVal);   // LEFT TOP

                              return (
                                <>
                                  <polygon
                                    points={`${p1} ${p2} ${p3} ${p4} ${p5}`}
                                    fill="rgba(37, 99, 235, 0.15)"
                                    stroke="#2563EB"
                                    strokeWidth="2.5"
                                  />
                                  {/* Dots on points */}
                                  <circle cx={p1.split(",")[0]} cy={p1.split(",")[1]} r="4" fill="#2563EB" />
                                  <circle cx={p2.split(",")[0]} cy={p2.split(",")[1]} r="4" fill="#14B8A6" />
                                  <circle cx={p3.split(",")[0]} cy={p3.split(",")[1]} r="4" fill="#F59E0B" />
                                  <circle cx={p4.split(",")[0]} cy={p4.split(",")[1]} r="4" fill="#2563EB" />
                                  <circle cx={p5.split(",")[0]} cy={p5.split(",")[1]} r="4" fill="#6366F1" />
                                </>
                              );
                            })()}

                            {/* Labels with matching color indicator rings */}
                            <text x="100" y="12" textAnchor="middle" className="text-[9px] font-bold fill-slate-500 tracking-wider">ACADEMIC ({student.academic.currentGPA} GPA)</text>
                            <text x="192" y="60" textAnchor="start" className="text-[9px] font-bold fill-teal-600 tracking-wider">BEHAVIORAL ({Math.round(student.behavioral.attendancePercentage)}%)</text>
                            <text x="192" y="145" textAnchor="start" className="text-[9px] font-bold fill-amber-600 tracking-wider">DIGITAL ({student.digital.contentEngagementScore}XP)</text>
                            <text x="100" y="195" textAnchor="middle" className="text-[9px] font-bold fill-indigo-600 tracking-wider">CAREER ({student.career.roadmapCompleted}% MAP)</text>
                            <text x="8" y="145" textAnchor="end" className="text-[9px] font-bold fill-blue-600 tracking-wider">LEARNING ({student.learning.practice}% PRAC)</text>
                          </svg>

                          <span className="text-[10px] text-slate-400 mt-2 font-mono italic">Dynamic 5D Tensor Mapping</span>
                        </div>

                        {/* Dimensions Progress breakdown */}
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
                              <span className="font-semibold flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-blue-600" /> Academic DNA Strength</span>
                              <span className="font-bold text-slate-800">{(student.academic.currentGPA / 4 * 100).toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-[#2563EB] h-full rounded-full transition-all" style={{ width: `${(student.academic.currentGPA / 4 * 100)}%` }}></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
                              <span className="font-semibold flex items-center gap-1.5"><CalendarCheck className="w-3.5 h-3.5 text-teal-600" /> Behavioral & Attendance</span>
                              <span className={`font-bold ${student.behavioral.attendancePercentage < 80 ? "text-rose-600 animate-pulse" : "text-teal-600"}`}>
                                {student.behavioral.attendancePercentage}% {student.behavioral.attendancePercentage < 80 ? "(AT RISK)" : ""}
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full transition-all ${student.behavioral.attendancePercentage < 80 ? "bg-rose-500" : "bg-teal-500"}`} style={{ width: `${student.behavioral.attendancePercentage}%` }}></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
                              <span className="font-semibold flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-amber-500" /> Learning DNA Style</span>
                              <span className="font-bold text-slate-800">Visual & Practical Focus</span>
                            </div>
                            <div className="grid grid-cols-4 gap-1">
                              <div className="bg-blue-50 p-1.5 rounded text-center">
                                <p className="text-[10px] text-slate-400 uppercase">Visual</p>
                                <p className="text-xs font-bold text-blue-600">{student.learning.visual}%</p>
                              </div>
                              <div className="bg-teal-50 p-1.5 rounded text-center">
                                <p className="text-[10px] text-slate-400 uppercase">Read</p>
                                <p className="text-xs font-bold text-teal-600">{student.learning.reading}%</p>
                              </div>
                              <div className="bg-amber-50 p-1.5 rounded text-center">
                                <p className="text-[10px] text-slate-400 uppercase">Prac</p>
                                <p className="text-xs font-bold text-amber-600">{student.learning.practice}%</p>
                              </div>
                              <div className="bg-indigo-50 p-1.5 rounded text-center">
                                <p className="text-[10px] text-slate-400 uppercase">Collab</p>
                                <p className="text-xs font-bold text-indigo-600">{student.learning.collaborative}%</p>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Strengths & Weaknesses Matrix */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
                        <div className="bg-emerald-50 p-4 rounded-2xl">
                          <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                            <Check className="w-4 h-4 text-emerald-600 bg-white rounded-full p-0.5" /> High-Performing Subject DNA
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {student.academic.strengths.map((str, i) => (
                              <span key={i} className="px-2.5 py-1 bg-white border border-emerald-100 text-emerald-800 text-xs rounded-xl font-medium shadow-sm">
                                {str}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-rose-50 p-4 rounded-2xl">
                          <h4 className="text-xs font-bold text-rose-800 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 text-rose-600 bg-white rounded-full p-0.5" /> Subject DNA Improvement Targets (Weaknesses)
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {student.academic.weaknesses.map((weak, i) => (
                              <span key={i} className="px-2.5 py-1 bg-white border border-rose-100 text-rose-800 text-xs rounded-xl font-medium shadow-sm">
                                {weak}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* BENTO GRID CELL 2: Module 2 - AI Student Mirror Advice Interface (Right Span) */}
                    <div className="lg:col-span-5 bg-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col relative overflow-hidden">
                      {/* Ambient background decoration */}
                      <div className="absolute -right-16 -bottom-16 w-32 h-32 bg-[#2563EB]/20 rounded-full blur-2xl"></div>
                      
                      <div className="relative z-10 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className="text-[10px] bg-teal-500/20 text-[#14B8A6] px-2 py-0.5 rounded font-bold tracking-widest uppercase">
                              Module 2 Cognitive Mirror
                            </span>
                            <h3 className="font-bold text-xl text-white mt-1 font-display">AI Twin Mirror</h3>
                            <p className="text-xs text-slate-400">Consult your Student Digital Twin AI advisor for performance predictions & coaching insights.</p>
                          </div>
                          <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shrink-0"></span>
                        </div>

                        {/* Current warning based on Attendance / marks */}
                        <div className="space-y-2 mb-4">
                          {student.behavioral.attendancePercentage < 80 && (
                            <div className="bg-amber-950/40 border border-amber-800/30 p-3 rounded-2xl text-xs text-amber-200">
                              <p className="font-bold uppercase tracking-wider text-[10px] text-amber-400">At-Risk Predictive Flag</p>
                              <p className="font-light mt-0.5 italic">"Attendance of 78.5% is near the 75% cutoff. Backprop grades reflect a potential -0.5 GPA decrement risk if next week is missed."</p>
                            </div>
                          )}
                        </div>

                        {/* Question Pre-set Quick-fire Buttons */}
                        <div className="mb-4">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Consultation Templates</p>
                          <div className="flex flex-wrap gap-1.5">
                            {[
                              "Analyze my current subject weaknesses?",
                              "What career pathways fit my DNA?",
                              "Will my low attendance affect my semester grade?"
                            ].map((preset, i) => (
                              <button
                                key={i}
                                onClick={() => handlePredefinedQuestion(preset)}
                                className="text-[11px] bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg px-2.5 py-1 text-slate-300 text-left transition"
                              >
                                {preset}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Conversational Screen */}
                        <div className="flex-1 bg-black/30 border border-white/5 p-4 rounded-2xl mb-4 overflow-y-auto max-h-[220px] text-xs space-y-3 font-mono">
                          {twinChatHistory.length === 0 ? (
                            <div className="text-slate-500 italic text-center py-8">
                              "Ask your customized Mirror Twin why academic performance is lagging, or how custom habits boost learning retention."
                            </div>
                          ) : (
                            twinChatHistory.map((chat, idx) => (
                              <div key={idx} className="space-y-1 bg-white/5 p-2.5 rounded-lg border border-white/5">
                                <p className="text-blue-400 font-bold">● Counselor Query: "{chat.query}"</p>
                                <div className="text-slate-200 font-light whitespace-pre-wrap pl-3 border-l border-teal-500/30 leading-relaxed font-sans">
                                  {chat.reply}
                                </div>
                              </div>
                            ))
                          )}

                          {askingTwin && (
                            <div className="flex items-center gap-2 text-slate-400 py-2">
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-400" />
                              <span className="italic">Twin AI parsing 5D multidimensional indicators...</span>
                            </div>
                          )}
                        </div>

                        {/* Ask input form */}
                        <form onSubmit={askStudentTwinAI} className="mt-auto">
                          <div className="relative">
                            <input
                              type="text"
                              value={twinQuestion}
                              onChange={(e) => setTwinQuestion(e.target.value)}
                              placeholder={`Query ${student.name}'s digital twin...`}
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-3 pr-10 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                            />
                            <button
                              type="submit"
                              disabled={askingTwin || !twinQuestion.trim()}
                              className="absolute right-1.5 top-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 text-white p-1 rounded-lg transition"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>

                  </div>
                )}

                {/* TAB CONTENT: StudentMind Studio (Generative custom education materials) */}
                {false && studentTab === "studio" && (
                  <div className="space-y-6">
                    
                    {/* STUDIO HEADER */}
                    <div className="bg-[#14B8A6] rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded font-bold tracking-widest uppercase">
                            Module 4 & 5 Core
                          </span>
                          <span className="text-[10px] bg-[#2563EB] text-white px-2 py-0.5 rounded font-bold tracking-widest uppercase">
                            AI Content Generator
                          </span>
                        </div>
                        <h2 className="text-2xl font-black text-white mt-2 font-display">StudentMind Studio</h2>
                        <p className="text-sm text-emerald-50 text-opacity-90 max-w-2xl mt-1">
                          Personalize any curriculum note, transcript, or academic article on matching-demand skills. Automatically scales challenges, MCQs, and vertical quote posters for <span className="font-bold underline text-white">{student.name}</span>'s DNA profile.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {SAMPLE_SOURCES.map((sample, i) => (
                          <button
                            key={i}
                            onClick={() => applySampleSource(sample)}
                            className="bg-white/10 hover:bg-white/20 border border-white/20 text-xs px-3 py-1.5 rounded-xl font-semibold transition"
                          >
                            Sample {i+1}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* INPUTS BENTO SECTOR */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Left Block: Source upload and setup */}
                      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                        <h3 className="font-bold text-lg text-slate-800 font-display">1. Target Learning Material</h3>
                        
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Source Format Type</label>
                          <select
                            value={sourceType}
                            onChange={(e) => setSourceType(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#14B8A6]"
                          >
                            <option value="Lecture Notes">📝 Lecture Slides / Notes</option>
                            <option value="PDF Study Guide">📂 Comprehensive PDF Guide</option>
                            <option value="Research Paper">🔬 Industrial Research Paper</option>
                            <option value="YouTube Transcript">🎥 Video Class Transcript</option>
                            <option value="Web Outline URL">🌐 Live Web Article URL</option>
                          </select>

                          {/* PDF & Research Paper Drag & Drop Mock Area */}
                          {(sourceType === "PDF Study Guide" || sourceType === "Research Paper") && (
                            <div className="mt-2.5 border-2 border-dashed border-slate-200 hover:border-[#14B8A6] rounded-2xl p-4 text-center cursor-pointer hover:bg-slate-50/50 transition relative">
                              <div className="space-y-1 text-slate-500">
                                <p className="text-xs font-bold text-slate-750">Drag & Drop {sourceType === "Research Paper" ? "Academic Article" : "Syllabus Textbook PDF"} Here</p>
                                <p className="text-[10px]">Supports PDF, DOCX, TXT (Max 50MB)</p>
                              </div>
                              <input
                                type="file"
                                accept=".pdf,.docx,.txt"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setSourceName(file.name.replace(/\.[^/.]+$/, ""));
                                    setSourceContent(`[WEAVE INTEGRATED PDF ENGINE - TEXT EXTRACTION SUCCESSFUL]
Document Reference Name: ${file.name}
File System Size: ${(file.size / 1024 / 1024).toFixed(2)} MB
Raw Text Capture:
We have successfully triggered local browser isomorphic parsing of PDF structures for direct synthesis. During compilation, MirrorMind processes these character streams to align academic vectors with your 5D Student DNA.`);
                                    setSuccessMsg(`Successfully parsed PDF "${file.name}" locally via isomorphic text parser.`);
                                  }
                                }}
                              />
                            </div>
                          )}

                          {/* YouTube Transcription Subform */}
                          {sourceType === "YouTube Transcript" && (
                            <div className="mt-2.5 space-y-2.5">
                              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Connect YouTube Video</label>
                              <div className="flex gap-1.5">
                                <input
                                  type="text"
                                  placeholder="https://youtube.com/watch?v=..."
                                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#14B8A6]"
                                  id="youtube-url-input"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const val = (document.getElementById("youtube-url-input") as HTMLInputElement)?.value || "https://youtu.be/3H_backprop_mesh";
                                    setSourceName(`YouTube Speech: ${val.split("v=")[1] || "Core Video Stream"}`);
                                    setSourceContent(`[AUTOMATED AUDIO TRANSCRIBER CHANNELS]
Video Reference URL Link: ${val}
Generated Segment Transcription Outline:
0:00 - Introduction to the underlying mathematical thesis
1:15 - Describing Multivariable Calculus partial derivatives over weights tensor
5:40 - Solving the vanishing gradient bounds with ReLU activation schedule
11:20 - Industrial PyTorch layer configuration and code deployment`);
                                    setSuccessMsg("YouTube Video speech stream transcribed successfully into raw materials!");
                                  }}
                                  className="px-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0"
                                >
                                  <span>Transcribe</span>
                                </button>
                              </div>
                            </div>
                          )}

                          {/* URL Fetch Subform */}
                          {sourceType === "Web Outline URL" && (
                            <div className="mt-2.5 space-y-1.5">
                              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Crawl Web Article URL</label>
                              <div className="flex gap-1.5">
                                <input
                                  type="text"
                                  placeholder="https://mit-press.mit.edu/blog/..."
                                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#14B8A6]"
                                  id="web-url-input"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const val = (document.getElementById("web-url-input") as HTMLInputElement)?.value || "https://mit-press.mit.edu/backpropagation";
                                    setSourceName(`Web Scraped Topic: ${val.split("/").pop() || "Syllabus Article"}`);
                                    setSourceContent(`[WEBSCRAPED ARTICLE REMOTE INDICES CONTENT]
Harvested from Root Domain: ${val}
Document Scope:
We have crawled public nodes from this URL directory. The material references modern backpropagation constraints, neural matrix weights calibration, with step-by-step optimization schedules mapped for machine learning.`);
                                    setSuccessMsg("Remote web page content index harvested successfully!");
                                  }}
                                  className="px-3 bg-slate-800 hover:bg-slate-705 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0"
                                >
                                  <span>Harvest URL</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Document/Topic Title</label>
                          <input
                            type="text"
                            value={sourceName}
                            onChange={(e) => setSourceName(e.target.value)}
                            placeholder="e.g., Deep Learning Backpropagation Epochs"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#14B8A6]"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase">Interactive Source Raw Materials</label>
                            <span className="text-[10px] text-slate-400 font-mono">{sourceContent.length} chars</span>
                          </div>
                          <textarea
                            value={sourceContent}
                            onChange={(e) => setSourceContent(e.target.value)}
                            placeholder="Copy-paste the text outlines, code samples, transcripts, or PDF contents here..."
                            rows={8}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#14B8A6] font-mono"
                          />
                        </div>

                        <div className="bg-slate-55 p-3 rounded-2xl border border-slate-100">
                          <label className="block text-xs font-bold text-[#14B8A6] uppercase mb-1">DNA Custom Alignment Brief</label>
                          <input
                            type="text"
                            value={customPrompt}
                            onChange={(e) => setCustomPrompt(e.target.value)}
                            placeholder="e.g. emphasize PyTorch examples and visual aids"
                            className="w-full bg-slate-15 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1"
                          />
                          <p className="text-[10px] text-slate-400 mt-1">
                            This maps output to student's <strong>{student.learning.practice}% practical learner DNA</strong>.
                          </p>
                        </div>

                        <button
                          onClick={triggerStudioGeneration}
                          disabled={generatingStudio || !sourceContent.trim()}
                          className="w-full py-3 bg-[#14B8A6] hover:bg-[#0f9182] disabled:bg-slate-300 text-white rounded-xl text-xs font-extrabold shadow-md flex items-center justify-center gap-1.5 transition-colors uppercase tracking-widest"
                        >
                          {generatingStudio ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Synthesizing Studio Suite...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 animate-bounce" />
                              <span>Convert via Student DNA</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Right Block: Generated study pack contents */}
                      <div className="bg-[#FFFFFF] lg:col-span-2 rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col">
                        <div className="border-b border-slate-100 pb-4 mb-4 flex justify-between items-center flex-wrap gap-2">
                          <div>
                            <h3 className="font-bold text-lg text-slate-800 font-display">2. Personalized Generated Blueprint</h3>
                            <p className="text-xs text-slate-400">Adaptive contents output from StudentMind Studio model engine</p>
                          </div>
                          {activeGeneratedPack && (
                            <span className="text-[11px] font-mono bg-blue-50 text-blue-700 px-2.5 py-1 rounded-xl border border-blue-100">
                              Pack ID: {activeGeneratedPack.id}
                            </span>
                          )}
                        </div>

                        {!activeGeneratedPack ? (
                          <div className="flex-1 flex flex-col items-center justify-center text-center py-16 text-slate-400">
                            <BookOpenCheck className="w-16 h-16 text-[#14B8A6]/20 mb-3" />
                            <h4 className="font-semibold text-slate-700">No Synthesized Material Loaded</h4>
                            <p className="text-xs max-w-md mx-auto mt-2">
                              Select a sample research briefing from the top right, and click "Convert via Student DNA" to generate custom notes, practice assessments, code challenges, reels scripts, and visual poster frames.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-6 flex-1 max-h-[600px] overflow-y-auto pr-2">
                            
                            {/* Notes Summary */}
                            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                              <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-1.5 uppercase tracking-wider text-xs">
                                <FileText className="w-4 h-4 text-[#14B8A6]" /> Condensed Revision Notes
                              </h4>
                              <p className="text-xs text-slate-600 font-medium leading-relaxed italic bg-white p-3 rounded-xl border border-slate-100/60 mb-3">
                                {activeGeneratedPack.notes.summary}
                              </p>
                              
                              <div className="space-y-1 pl-3 border-l-2 border-slate-200">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Key Takeaways Matrix</p>
                                {activeGeneratedPack.notes.keyPoints.map((pt, i) => (
                                  <div key={i} className="flex gap-2 text-xs text-slate-700 font-light mt-1">
                                    <span className="text-[#14B8A6] font-extrabold">•</span>
                                    <span>{pt}</span>
                                  </div>
                                ))}
                              </div>

                              <div className="mt-4 pt-4 border-t border-slate-200/50">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Full Markdown Syllabus Notes</p>
                                <div className="bg-white p-3 rounded-xl text-xs font-mono max-h-40 overflow-y-auto border border-slate-100 text-slate-700 whitespace-pre-wrap leading-relaxed">
                                  {activeGeneratedPack.notes.revisionNotes}
                                </div>
                              </div>

                              {activeGeneratedPack.notes.pptSlideOutline && (
                                <div className="mt-4 pt-4 border-t border-slate-200/50">
                                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1 font-mono">
                                    <span>🎬 AI GENERATED PPT SLIDES OUTLINE</span>
                                  </p>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    {activeGeneratedPack.notes.pptSlideOutline.map((slide, sIdx) => {
                                      const titlePart = slide.split(" - ")[0] || slide;
                                      const descPart = slide.split(" - ")[1] || "Core academic principles.";
                                      return (
                                        <div key={sIdx} className="bg-white p-3.5 rounded-2xl border border-slate-100/80 shadow-sm hover:border-[#14B8A6]/30 transition group">
                                          <span className="bg-[#14B8A6]/10 text-[#14B8A6] text-[8px] font-black uppercase font-mono px-2 py-0.5 rounded">
                                            Slide {sIdx + 1}
                                          </span>
                                          <p className="text-xs text-slate-800 font-extrabold mt-1.5 leading-snug">{titlePart}</p>
                                          <p className="text-[10px] text-slate-500 font-light mt-1 leading-relaxed">{descPart}</p>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {activeGeneratedPack.notes.teluguContent && (
                                <div className="mt-4 pt-4 border-t border-slate-200/50">
                                  <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest mb-1.5 flex items-center gap-1 font-mono">
                                    <span>❇️ తెలుగు LOCALIZED LEARNING MODULE (BILINGUAL)</span>
                                  </p>
                                  <div className="bg-emerald-50/20 border border-emerald-100/40 p-4 rounded-2xl leading-relaxed text-slate-700 text-xs text-left">
                                    <p className="text-[10px] text-emerald-800 font-bold mb-2">Cognitive translation of core syllabus paradigms:</p>
                                    <div className="bg-white p-3.5 rounded-xl border border-emerald-100/50 select-all font-sans whitespace-pre-wrap">
                                      {activeGeneratedPack.notes.teluguContent}
                                    </div>
                                    <div className="mt-2 text-[9px] text-slate-400">
                                      * Tips: Ideal for localized medium students, combining professional Telugu terminology with English key variables.
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Practice Assessments Quiz MCQ */}
                            <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl">
                              <div className="flex justify-between items-center mb-3">
                                <h4 className="text-sm font-bold text-blue-900 flex items-center gap-1.5 uppercase tracking-wider text-xs">
                                  <Brain className="w-4 h-4 text-[#2563EB]" /> Personalized Cognitive Quiz
                                </h4>
                                <span className="text-[10px] uppercase font-mono tracking-widest text-[#2563EB] font-bold">DNA Formative Assessment</span>
                              </div>

                              <div className="space-y-4">
                                {activeGeneratedPack.assessment.questions.map((q, qidx) => (
                                  <div key={qidx} className="bg-white p-3.5 rounded-xl border border-blue-100/60 text-xs">
                                    <div className="flex justify-between items-start mb-2 gap-2">
                                      <span className="bg-blue-100/60 text-blue-800 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                                        Q{qidx + 1} ({q.type})
                                      </span>
                                      {q.rubricHint && (
                                        <span className="text-[10px] font-mono text-slate-400">Target: Rubric Assessment</span>
                                      )}
                                    </div>
                                    
                                    <p className="font-semibold text-slate-800 mb-2.5">{q.question}</p>

                                    {/* MCQ Option mapping */}
                                    {q.type === "MCQ" && q.options && (
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                                        {q.options.map((opt, oidx) => {
                                          const isSelected = quizAnswers[qidx] === opt;
                                          const isCorrectVal = opt.trim().toLowerCase() === q.correctAnswer?.trim().toLowerCase();
                                          return (
                                            <button
                                              key={oidx}
                                              disabled={quizSubmitted}
                                              onClick={() => setQuizAnswers(prev => ({ ...prev, [qidx]: opt }))}
                                              className={`w-full text-left p-2.5 rounded-lg border text-xs transition duration-150 ${
                                                quizSubmitted
                                                  ? isCorrectVal
                                                    ? "bg-green-100 border-green-300 text-green-900 font-semibold"
                                                    : isSelected
                                                      ? "bg-rose-100 border-rose-300 text-rose-900"
                                                      : "bg-slate-50 border-slate-100 text-slate-400"
                                                  : isSelected
                                                    ? "bg-blue-600 border-blue-700 text-white font-medium"
                                                    : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                                              }`}
                                            >
                                              {opt}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    )}

                                    {/* Rubric metrics hints */}
                                    {q.rubricHint && (
                                      <div className="bg-slate-50 p-2.5 border border-slate-200/40 rounded-lg text-slate-600 leading-relaxed text-[11px] italic">
                                        💡 Suggested self-check rubric standard: {q.rubricHint}
                                      </div>
                                    )}
                                  </div>
                                ))}

                                {/* Submit controls */}
                                <div className="pt-2 flex justify-between items-center">
                                  {!quizSubmitted ? (
                                    <button
                                      onClick={handleSubmitQuiz}
                                      className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold rounded-lg uppercase tracking-wider shadow"
                                    >
                                      Submit Assessment for Tracking
                                    </button>
                                  ) : (
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-2">
                                      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded-xl text-xs font-medium">
                                        ✨ Quiz Complete! Score: <span className="font-bold text-sm text-emerald-700">{quizScore?.correct} / {quizScore?.total}</span> correct. Metrics logged.
                                      </div>
                                      <button
                                        onClick={() => {
                                          setQuizAnswers({});
                                          setQuizSubmitted(false);
                                          setQuizScore(null);
                                        }}
                                        className="text-xs text-blue-600 font-semibold underline flex items-center gap-1"
                                      >
                                        <RotateCcw className="w-3.5 h-3.5" /> Retake Practice
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Generative micro challenges tailored to lesson */}
                            <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-2xl">
                              <h4 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-1.5 uppercase tracking-wider text-xs">
                                <Award className="w-4 h-4 text-[#F59E0B]" /> Personalized Action Challenges
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                {activeGeneratedPack.challenges.map((ch, idx) => (
                                  <div key={idx} className="bg-white p-3.5 rounded-xl border border-amber-100 shadow-sm text-xs relative flex flex-col justify-between">
                                    <div>
                                      <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold uppercase">
                                          {ch.category || "AI Custom"}
                                        </span>
                                        <span className="font-bold text-indigo-700">{ch.xpValue} XP</span>
                                      </div>
                                      <p className="font-bold text-slate-800">{ch.title}</p>
                                      <p className="text-slate-500 text-[11px] mt-1 italic leading-relaxed">{ch.description}</p>
                                    </div>
                                    <button
                                      onClick={() => {
                                        // Auto-deploy into student profile challenges
                                        db.challenges.unshift({
                                          id: `ch-studio-${idx}-${Date.now()}`,
                                          title: ch.title,
                                          description: ch.description,
                                          category: "AI",
                                          durationDays: 7,
                                          xpValue: ch.xpValue,
                                          badgeRewarded: {
                                            name: "Studio Mastery",
                                            icon: "Sparkles",
                                            color: "amber"
                                          }
                                        });
                                        setSuccessMsg(`Challenge "${ch.title}" has been successfully added to your campus challenge agenda!`);
                                      }}
                                      className="mt-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-bold text-center w-full uppercase tracking-wider transition"
                                    >
                                      Add to My Active Roster
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Social micro blogging outlines */}
                            <div className="bg-indigo-50/40 border border-indigo-100 p-4 rounded-2xl">
                              <h4 className="text-sm font-bold text-indigo-900 mb-2 flex items-center gap-1.5 uppercase tracking-wider text-xs">
                                <Globe className="w-4 h-4 text-indigo-600" /> Digital Identity Snippets
                              </h4>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-indigo-100 text-xs">
                                  <span className="text-[10px] font-black text-indigo-700 uppercase">👥 LinkedIn Executive Briefing</span>
                                  <p className="text-[11px] leading-relaxed text-slate-650 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 italic whitespace-pre-wrap">
                                    {activeGeneratedPack.marketing.linkedin}
                                  </p>
                                </div>
                                <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-indigo-100 text-xs">
                                  <span className="text-[10px] font-black text-amber-700 uppercase">📸 Instagram Carousel Pitch</span>
                                  <p className="text-[11px] leading-relaxed text-slate-650 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 italic whitespace-pre-wrap">
                                    {activeGeneratedPack.marketing.instagram}
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-[#fff] grid-cols-1 md:grid-cols-2 gap-4 mt-3 pt-3 border-t border-indigo-100/55">
                                <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-indigo-100 text-xs">
                                  <span className="text-[10px] font-black text-rose-700 uppercase">⚡️ 9:16 Instagram Reels Video Script</span>
                                  <p className="text-[11px] leading-relaxed text-slate-650 bg-rose-50/20 p-2.5 rounded-lg border border-rose-100 italic whitespace-pre-wrap">
                                    {activeGeneratedPack.video?.reelScript || "Generating custom Reels audio overlay..."}
                                  </p>
                                </div>
                                <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-indigo-100 text-xs">
                                  <span className="text-[10px] font-black text-red-700 uppercase">🎥 60s YouTube Shorts Narrative</span>
                                  <p className="text-[11px] leading-relaxed text-slate-650 bg-red-50/20 p-2.5 rounded-lg border border-red-100/80 italic whitespace-pre-wrap font-sans">
                                    {activeGeneratedPack.video?.shortsScript || "Synthesizing visual hook lines..."}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-4 pt-4 border-t border-indigo-100/50">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Interactive Vertical Poster (1080x1920 Viewport Mock)</span>
                                <div className="mt-2 text-white bg-gradient-to-br from-slate-900 to-indigo-950 p-6 rounded-2xl text-center flex flex-col justify-between items-center min-h-[300px] border border-white/10 relative">
                                  
                                  {/* Top indicators */}
                                  <div className="flex justify-between items-center w-full">
                                    <span className="text-[9px] tracking-widest font-mono font-bold text-indigo-300">MIRRORMIND STUDENT DNA</span>
                                    <span className="text-[9px] uppercase px-1.5 py-0.5 bg-indigo-500/30 text-indigo-200 rounded font-bold">
                                      {activeGeneratedPack.visual.posterCategory}
                                    </span>
                                  </div>

                                  {/* Center core content */}
                                  <div className="my-6 max-w-sm">
                                    <Sparkles className="w-6 h-6 text-[#F59E0B] mx-auto mb-3" />
                                    <h4 className="text-lg font-black tracking-tight font-display mb-2 text-white">
                                      {activeGeneratedPack.visual.posterTitle}
                                    </h4>
                                    <p className="text-xs text-indigo-200/95 italic font-light font-sans max-w-xs mx-auto leading-relaxed px-2">
                                      "{activeGeneratedPack.visual.quoteText}"
                                    </p>
                                  </div>

                                  {/* Infographic sliders points */}
                                  <div className="w-full space-y-1 text-left bg-black/20 p-3 rounded-xl border border-white/5">
                                    <p className="text-[8px] font-bold text-indigo-300/80 uppercase mb-1 tracking-wider">Infographic Slide Outline</p>
                                    {activeGeneratedPack.visual.infographicPoints.map((pt, i) => (
                                      <p key={i} className="text-[10px] text-slate-300 font-light truncate">
                                        👉 Slide {i+1}: {pt}
                                      </p>
                                    ))}
                                  </div>

                                  {/* Bottom self credit */}
                                  <div className="mt-4 pt-3 border-t border-white/10 w-full flex justify-between text-[9px] text-slate-400 font-mono">
                                    <span>Personalized for {student.name}</span>
                                    <span>MirrorMind.edu Suite</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                          </div>
                        )}
                      </div>

                    </div>

                  </div>
                )}

                {/* TAB CONTENT: Challenge System */}
                {studentTab === "challenges" && (
                  <div className="space-y-6">
                    
                    {/* LEADERBOARD & XP HIGHLIGHT HERO ROW */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      
                      {/* Left: Active campus-wide challenges & Enrollments */}
                      <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                          <div className="flex justify-between items-center mb-6">
                            <div>
                              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold tracking-widest uppercase">
                                Module 3 Gamification Arena
                              </span>
                              <h3 className="font-bold text-xl text-slate-900 mt-1 font-display">Active Campus Challenges</h3>
                              <p className="text-xs text-slate-400">Join academic streaks, digital detox programs, or algorithm blocks</p>
                            </div>
                            <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full">⚡️ LEVEL-UP AREA</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {db.challenges.map((ch) => {
                              // Check if student enrolled
                              const progress = db.studentChallenges.find(
                                sc => sc.challengeId === ch.id && sc.studentId === selectedStudentId
                              );

                              return (
                                <div
                                  key={ch.id}
                                  className={`p-5 rounded-2xl border text-xs flex flex-col justify-between relative transition duration-150 ${
                                    progress
                                      ? "bg-slate-50/80 border-blue-200"
                                      : "bg-white border-slate-200 hover:border-slate-300"
                                  }`}
                                >
                                  {progress?.status === "Completed" && (
                                    <span className="absolute top-3 right-3 bg-green-100 text-green-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                                      PASSED COMPLETED
                                    </span>
                                  )}

                                  <div>
                                    <div className="flex justify-between items-center mb-2">
                                      <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded uppercase ${
                                        ch.category === "Detox" ? "bg-emerald-100 text-emerald-800" :
                                        ch.category === "Coding" ? "bg-amber-100 text-amber-800" :
                                        ch.category === "Reading" ? "bg-sky-100 text-sky-800" :
                                        ch.category === "AI" ? "bg-purple-100 text-purple-800" :
                                        "bg-indigo-100 text-indigo-800"
                                      }`}>
                                        {ch.category}
                                      </span>
                                      <span className="font-bold text-indigo-600">+{ch.xpValue} XP</span>
                                    </div>

                                    <h4 className="font-bold text-slate-800 text-sm mb-1">{ch.title}</h4>
                                    <p className="text-slate-500 font-light leading-relaxed mb-3">{ch.description}</p>
                                  </div>

                                  <div className="pt-3 border-t border-slate-100 mt-3">
                                    {progress ? (
                                      <div className="space-y-3">
                                        <div className="flex justify-between items-center text-[11px] text-slate-500 font-medium">
                                          <span>Progress: {progress.completedDays} / {ch.durationDays} Days</span>
                                          <span className="text-[#2563EB] font-bold font-mono">{progress.progressPercentage}%</span>
                                        </div>
                                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                          <div className="bg-[#2563EB] h-full rounded-full transition-all" style={{ width: `${progress.progressPercentage}%` }}></div>
                                        </div>

                                        {progress.status === "Active" && (
                                          <div className="space-y-2 pt-1 border-t border-dashed border-slate-200">
                                            <input
                                              type="text"
                                              placeholder="Optional outcome summary note..."
                                              value={challengeLogNote}
                                              onChange={(e) => setChallengeLogNote(e.target.value)}
                                              className="w-full bg-white border border-slate-200 p-1.5 rounded-lg text-[10px] focus:outline-none"
                                            />
                                            <button
                                              onClick={() => recordChallengeProgress(ch.id)}
                                              disabled={recordingProgressId === ch.id}
                                              className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider"
                                            >
                                              {recordingProgressId === ch.id ? "Recording log..." : "Record Today's Entry"}
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => enrollInChallenge(ch.id)}
                                        disabled={enrollingChallengeId === ch.id}
                                        className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider transition"
                                      >
                                        {enrollingChallengeId === ch.id ? "Enrolling..." : "Enroll Challenge"}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Recent log updates tracking */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-xs">
                          <h4 className="font-bold text-slate-800 mb-3 uppercase tracking-widest text-[10px]" id="live-progress-logs">My Living Progress Logs</h4>
                          <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                            {db.studentChallenges.length === 0 ? (
                              <p className="text-slate-400 italic text-center py-4">No active logs detected.</p>
                            ) : (
                              db.studentChallenges.map((sc, idx) => {
                                const chInfo = db.challenges.find(c => c.id === sc.challengeId);
                                return (
                                  <div key={idx} className="space-y-1.5 pl-3 border-l-2 border-indigo-500">
                                    <div className="flex justify-between text-slate-500">
                                      <span className="font-bold text-slate-700">{chInfo?.title || "Unknown Routine"}</span>
                                      <span className="font-mono text-[10px]/none">{sc.status} • {sc.progressPercentage}%</span>
                                    </div>
                                    <p className="text-slate-600 font-light italic leading-tight">
                                      Last Log: {sc.logs[0]?.note || "Enrolled in gamified syllabus outline."}
                                    </p>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Leaderboards with dynamic Levels & XP and Unlocked Badges */}
                      <div className="lg:col-span-4 space-y-6">
                        
                        {/* Leaderboard panel */}
                        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md">
                          <h3 className="font-bold text-base font-display flex items-center gap-2 mb-4">
                            <Trophy className="w-5 h-5 text-amber-500" />
                            <span>Campus Leaderboard</span>
                          </h3>

                          <div className="space-y-3 text-xs">
                            {db.leaderboard.map((user, pos) => {
                              const isSelf = user.id === selectedStudentId;
                              return (
                                <div
                                  key={user.id}
                                  className={`flex items-center justify-between p-2.5 rounded-xl transition duration-150 ${
                                    isSelf ? "bg-white/10 ring-1 ring-blue-500" : "bg-white/5 hover:bg-white/10"
                                  }`}
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <span className={`w-5 h-5 text-center font-bold font-mono rounded-full flex items-center justify-center ${
                                      pos === 0 ? "bg-amber-500 text-slate-900" :
                                      pos === 1 ? "bg-slate-300 text-slate-900" :
                                      "text-slate-400"
                                    }`}>
                                      {pos + 1}
                                    </span>
                                    <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                                    <div className="truncate">
                                      <p className="font-bold truncate text-slate-100">{user.name}</p>
                                      <p className="text-[10px] text-slate-400">Level {user.level} Scholar</p>
                                    </div>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <p className="font-mono font-bold text-indigo-400">{user.xp.toLocaleString()} XP</p>
                                    <p className="text-[9px] text-slate-400">{user.challengesCount} Challenges</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Badges container */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-xs">
                          <h3 className="font-bold text-slate-800 font-display mb-3">Syllabus Master Badges</h3>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { name: "Focus Catalyst", desc: "Unlock 30D Screen detox", icon: Smartphone, color: "bg-emerald-50 text-emerald-800 border-emerald-100", unlocked: true },
                              { name: "Logic Maestro", desc: "15D Coding Routine", icon: Code, color: "bg-amber-50 text-amber-800 border-amber-100", unlocked: true },
                              { name: "EcoSystem Weaver", desc: "Import ValueWeave Advice", icon: Globe, color: "bg-indigo-50 text-indigo-800 border-indigo-100", unlocked: student.career.skillsInProgress.includes("AI Integration Engineering") },
                              { name: "Clockwork Scholar", desc: "Perfect Attend Streak", icon: CalendarCheck, color: "bg-rose-50 text-rose-800 border-rose-100", unlocked: student.behavioral.attendancePercentage >= 90 }
                            ].map((bd, i) => {
                              const BadgeIcon = bd.icon;
                              return (
                                <div
                                  key={i}
                                  className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-between transition-opacity ${
                                    bd.unlocked ? bd.color : "opacity-40 bg-slate-50 border-slate-200"
                                  }`}
                                >
                                  <BadgeIcon className="w-6 h-6 mb-1.5" />
                                  <p className="font-semibold text-[11px] leading-tight text-slate-800">{bd.name}</p>
                                  <p className="text-[9px] text-slate-400 mt-1 leading-tight">{bd.desc}</p>
                                  <span className="text-[8px] font-bold mt-2 uppercase px-1 rounded bg-black/5">
                                    {bd.unlocked ? "UNLOCKED" : "LOCKED"}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                      </div>

                    </div>

                  </div>
                )}

                {/* TAB CONTENT: Career & ValueWeave Intelligent integration */}
                {studentTab === "career" && (
                  <CareerDNACenter
                    student={student}
                    db={db!}
                    loadDatabase={loadDatabase}
                    onEnrollChallenge={enrollInChallenge}
                  />
                )}

              </div>
            )}

            {/* ROLE 2: Lecturer Dashboard */}
            {currentRole === UserRole.LECTURER && (
              <div className="space-y-6">
                
                {/* LECTURER CONTROLS CONTAINER GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Class performance statistics */}
                  <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-xs">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <span className="text-[10px] bg-teal-50 text-teal-800 px-2 py-0.5 rounded font-bold tracking-widest uppercase">
                          Module 7 Lesson Planning
                        </span>
                        <h3 className="font-bold text-xl text-slate-900 mt-1 font-display font-display">University Class Management</h3>
                        <p className="text-xs text-slate-400">Section CS-A • Computer Science and Machine Learning Batch 2026</p>
                      </div>
                      <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-bold">Enrollment: 3 Cohorts</span>
                    </div>

                    {/* Class Students DNA Cards */}
                    <div className="space-y-4">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student Profiles DNA Summary</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {db.students.map((st) => {
                          const atRisk = st.behavioral.attendancePercentage < 80;
                          return (
                            <button
                              key={st.studentId}
                              onClick={() => setSelectedStudentId(st.studentId)}
                              className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                                selectedStudentId === st.studentId
                                  ? "bg-slate-50 ring-2 ring-[#14B8A6]/60 border-[#14B8A6]"
                                  : "bg-white border-slate-200 hover:border-slate-300"
                              }`}
                            >
                              <div className="flex items-center gap-2.5 mb-3">
                                <img src={st.avatarUrl} alt={st.name} className="w-9 h-9 rounded-full object-cover" />
                                <div className="space-y-0.5 overflow-hidden">
                                  <p className="font-bold text-slate-800 text-xs truncate leading-none">{st.name}</p>
                                  <p className="text-[10px] text-[#14B8A6] truncate">{st.department}</p>
                                </div>
                              </div>

                              <div className="space-y-1 text-[11px] text-slate-600">
                                <p>• Cumulative GPA: <strong className="text-slate-800">{st.academic.currentGPA}</strong></p>
                                <p>• Attendance Rate: <strong className={atRisk ? "text-rose-600 animate-pulse font-bold" : "text-emerald-700"}>{st.behavioral.attendancePercentage}%</strong></p>
                                <p>• Practice Learner Ratio: <strong className="text-indigo-600">{st.learning.practice}%</strong></p>
                              </div>

                              <div className="mt-3 pt-3 border-t border-slate-100 w-full text-center">
                                <span className="text-[10px] text-blue-600 font-semibold uppercase">Activate Focus Select</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Module 7 AI Assistant Gen tool */}
                    <div className="mt-8 pt-8 border-t border-slate-100">
                      <h4 className="font-bold text-base text-slate-800 font-display mb-3">AI Lecturer Assistant Generator</h4>
                      <form onSubmit={handleLecturerSynthesis} className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-100/60 max-w-2xl">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Requested Material Type</label>
                            <select
                              value={lecturerRequestType}
                              onChange={(e) => setLecturerRequestType(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                            >
                              <option value="Lesson Plan">📐 Day Lesson Plan Matrix</option>
                              <option value="Curriculum Syllabus Outline">📂 Unified Course Syllabus Outline</option>
                              <option value="MCQ Challenge Drafts">🧪 Quantitative Quiz Assessments</option>
                              <option value="Interactive Board Slides Outline">📊 Markdown Presentation Slides Outline</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Subject Topic Target</label>
                            <input
                              type="text"
                              value={lecturerTopic}
                              onChange={(e) => setLecturerTopic(e.target.value)}
                              placeholder="e.g. Backpropagation mathematically mapped for visual learners"
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Curriculum Benchmarks (Notes)</label>
                          <textarea
                            value={lecturerNotes}
                            onChange={(e) => setLecturerNotes(e.target.value)}
                            placeholder="Add targeted context benchmarks, textbook chapters, or specific cohort requirements..."
                            rows={3}
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={synthesizingLecturer || !lecturerTopic.trim()}
                          className="px-5 py-2.5 bg-[#14B8A6] text-white font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-teal-700 disabled:bg-slate-300 transition-colors shadow flex items-center gap-1.5"
                        >
                          {synthesizingLecturer ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Synthesizing Lecturer Blueprint...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" />
                              <span>Synthesize Material</span>
                            </>
                          )}
                        </button>
                      </form>

                      {/* Display synthesized output */}
                      {synthesizedOutput && (
                        <div className="mt-4 p-5 bg-white border border-slate-200 rounded-2xl max-w-2xl animate-fadeIn">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Synthesized Material Output</p>
                          <div className="bg-slate-50 p-4 rounded-xl text-xs font-mono max-h-96 overflow-y-auto whitespace-pre-wrap border border-slate-100/60 leading-relaxed text-slate-700 font-sans">
                            {synthesizedOutput}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Challenge Creator for Lecturers */}
                  <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-xs space-y-4">
                    <h3 className="font-bold text-base text-slate-800 font-display">Assign Custom Student Challenge</h3>
                    <p className="text-slate-400 font-light leading-snug">
                      Create learning routines or wellness challenges that instantly populate the campus student ledger roster.
                    </p>

                    <form onSubmit={createCustomChallenge} className="space-y-3 pt-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Challenge Title</label>
                        <input
                          type="text"
                          value={newChTitle}
                          onChange={(e) => setNewChTitle(e.target.value)}
                          placeholder="e.g. 5-Day GPU Optimization Challenge"
                          className="w-full bg-slate-50 border border-slate-200 p-2 text-xs rounded-xl focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Description Goal</label>
                        <textarea
                          value={newChDesc}
                          onChange={(e) => setNewChDesc(e.target.value)}
                          row={2}
                          placeholder="Write actionable instructions expected for daily log tracking..."
                          className="w-full bg-slate-50 border border-slate-200 p-2 text-xs rounded-xl focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Category type</label>
                          <select
                            value={newChCategory}
                            onChange={(e) => setNewChCategory(e.target.value as any)}
                            className="w-full bg-slate-50 border border-slate-200 p-2 text-xs rounded-xl focus:outline-none"
                          >
                            <option value="Coding">Coding</option>
                            <option value="Reading">Reading</option>
                            <option value="Detox">Digital Detox</option>
                            <option value="Communication">Speak / Comms</option>
                            <option value="Attendance">Attendance</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Duration (Days)</label>
                          <input
                            type="number"
                            value={newChDuration}
                            onChange={(e) => setNewChDuration(Number(e.target.value) || 7)}
                            className="w-full bg-slate-50 border border-slate-200 p-2 text-xs rounded-xl focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Syllabus XP award</label>
                          <input
                            type="number"
                            value={newChXp}
                            onChange={(e) => setNewChXp(Number(e.target.value) || 100)}
                            className="w-full bg-slate-50 border border-slate-200 p-2 text-xs rounded-xl focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Badge Color theme</label>
                          <select
                            value={newChColor}
                            onChange={(e) => setNewChColor(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 p-2 text-xs rounded-xl focus:outline-none"
                          >
                            <option value="blue">Blue</option>
                            <option value="emerald">Emerald</option>
                            <option value="amber">Amber</option>
                            <option value="indigo">Indigo</option>
                            <option value="rose">Rose</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Badge Reward Name</label>
                        <input
                          type="text"
                          value={newChBadge}
                          onChange={(e) => setNewChBadge(e.target.value)}
                          placeholder="e.g. Master Optimizer"
                          className="w-full bg-slate-50 border border-slate-200 p-2 text-xs rounded-xl focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition shadow-md"
                      >
                        Deploy Challenge Campus-wide
                      </button>
                    </form>
                  </div>

                </div>

              </div>
            )}

            {/* ROLE 3: Principal Dashboard View */}
            {currentRole === UserRole.PRINCIPAL && (
              <PrincipalDNAView
                db={db!}
                onEnrollChallenge={enrollInChallenge}
                loadDatabase={loadDatabase}
                successMsg={successMsg}
                setSuccessMsg={setSuccessMsg}
                setErrorMsg={setErrorMsg}
              />
            )}

            {/* ROLE 4: Super Admin DB Telemetry View */}
            {currentRole === UserRole.SUPER_ADMIN && (
              <div className="space-y-6">
                
                {/* LIVE IN-MEMORY DATABASE EXPLORER */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-xs space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold tracking-widest uppercase">
                        Administrative Interface
                      </span>
                      <h3 className="font-bold text-lg text-slate-900 mt-1 font-display">Live MirrorMind Database Monitor</h3>
                      <p className="text-xs text-slate-400">Read and review state arrays currently stored inside server memory</p>
                    </div>
                    <span className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 font-mono rounded-full font-bold">
                      SOCKET STATE: RUNNING
                    </span>
                  </div>

                  {/* Raw DB statistics counters */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <p className="text-slate-400 text-[10px] font-bold uppercase font-mono">Students Accounts</p>
                      <p className="text-lg font-bold text-blue-600 font-mono mt-1">{db.students.length} Records</p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <p className="text-slate-400 text-[10px] font-bold uppercase font-mono">Active Challenge Configurations</p>
                      <p className="text-lg font-bold text-teal-600 font-mono mt-1">{db.challenges.length} Records</p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <p className="text-slate-400 text-[10px] font-bold uppercase font-mono">Enrollment Trackers</p>
                      <p className="text-lg font-bold text-indigo-600 font-mono mt-1">{db.studentChallenges.length} Active</p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <p className="text-slate-400 text-[10px] font-bold uppercase font-mono">StudentMind StudyPacks</p>
                      <p className="text-lg font-bold text-purple-600 font-mono mt-1">{db.studyPacks.length} Generated</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Configure Global Mock Seed Reset</p>
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          // Simple force reset button to reload initial states
                          await loadDatabase();
                          setSuccessMsg("Mock database sync re-polled successfully!");
                        }}
                        className="py-2.5 px-4 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition"
                      >
                        Force DB Pull
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
}
