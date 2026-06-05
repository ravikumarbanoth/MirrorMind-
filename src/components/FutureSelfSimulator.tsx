import React, { useState } from "react";
import {
  Sliders,
  Sparkles,
  TrendingUp,
  Brain,
  Award,
  Zap,
  Loader2,
  Lock,
  ArrowRight,
  Info,
  Smartphone,
  ChevronRight,
  User,
  Activity
} from "lucide-react";
import { StudentDNAProfile } from "../types";

interface FutureSelfSimulatorProps {
  student: StudentDNAProfile;
}

export default function FutureSelfSimulator({ student }: FutureSelfSimulatorProps) {
  // Inputs (simulated modifiers)
  const [targetAttendance, setTargetAttendance] = useState<number>(student.behavioral.attendancePercentage || 78);
  const [studyHours, setStudyHours] = useState<number>(10);
  const [completedChallenges, setCompletedChallenges] = useState<number>(6);
  const [commsSkill, setCommsSkill] = useState<number>(72);
  const [techSkill, setTechSkill] = useState<number>(75);
  const [sleepDiscipline, setSleepDiscipline] = useState<number>(65);

  // Simulation outcome states
  const [simulatedGpa, setSimulatedGpa] = useState<number>(student.academic.currentGPA || 3.25);
  const [simulatedEmployability, setSimulatedEmployability] = useState<number>(71);
  const [simulatedPlacement, setSimulatedPlacement] = useState<number>(65);
  const [simulatedExamReadiness, setSimulatedExamReadiness] = useState<number>(64);
  const [simulatedCareerScore, setSimulatedCareerScore] = useState<number>(72);
  const [simulationNarrative, setSimulationNarrative] = useState<string>("");
  const [calculating, setCalculating] = useState<boolean>(false);

  // Run simulation
  const handleSimulate = async () => {
    try {
      setCalculating(true);
      const res = await fetch("/api/gemini/student-twin-simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: student.studentId,
          targetAttendance,
          completedChallenges,
          studyHours
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Enhance simulated outcome metrics using other sliders as well on client-side
      const modifier = (commsSkill - 70) * 0.15 + (techSkill - 70) * 0.2 + (sleepDiscipline - 60) * 0.1;
      const computedGpa = Math.min(4.0, Math.round((data.prediction.gpa + (modifier * 0.012)) * 100) / 100);
      const computedEmp = Math.min(100, Math.round(data.prediction.employability + modifier * 0.8));
      const computedPlacement = Math.min(100, Math.round(data.prediction.readiness + modifier * 0.9));
      const computedExam = Math.min(100, Math.round(62 + (commsSkill * 0.1) + (techSkill * 0.12) + (targetAttendance * 0.1)));
      const computedCareer = Math.min(100, Math.round(70 + (techSkill * 0.18) + (completedChallenges * 0.5)));

      setSimulatedGpa(computedGpa);
      setSimulatedEmployability(computedEmp);
      setSimulatedPlacement(computedPlacement);
      setSimulatedExamReadiness(computedExam);
      setSimulatedCareerScore(computedCareer);
      setSimulationNarrative(data.prediction.narrative);

    } catch (err: any) {
      console.warn("Simulator calculation default triggered:", err);
      // Clean math fallback
      const mGpa = Math.min(4.0, Math.round((student.academic.currentGPA + (targetAttendance / 100 * 0.3) + (completedChallenges * 0.012) + (studyHours * 0.005)) * 100) / 100);
      const mEmp = Math.min(100, Math.round(68 + (completedChallenges * 1.6) + (studyHours * 0.6) + (techSkill * 0.12)));
      const mPlacement = Math.min(100, Math.round(62 + (targetAttendance * 0.14) + (completedChallenges * 1.1) + (commsSkill * 0.1)));
      const mExam = Math.min(100, Math.round(58 + (studyHours * 0.8) + (targetAttendance * 0.1)));
      const mCareer = Math.min(100, Math.round(65 + (techSkill * 0.25)));

      setSimulatedGpa(mGpa);
      setSimulatedEmployability(mEmp);
      setSimulatedPlacement(mPlacement);
      setSimulatedExamReadiness(mExam);
      setSimulatedCareerScore(mCareer);
      setSimulationNarrative(`### 🔮 Future Self Projections (Offline Fallback Model)\n\nHello, ${student.name}! By adjusting your Attendance parameter to **${targetAttendance}%**, executing **${completedChallenges} coding challenges**, and focusing **${studyHours} hours/week** on self-directed study, we estimate your simulated metrics as follows:\n\n* **Academic Track:** Predicted GPA moves from **${student.academic.currentGPA}** to **${mGpa}** due to enhanced class session retention.\n* **Placement Mastery:** Employability score surges to **${mEmp}%** with **${completedChallenges} finished portfolio tasks** proving hands-on competence to tech recruiters!\n* **Career Readiness Scale:** Unlocks structural milestones at **${mPlacement}%**, bridging core knowledge gaps in network security and compiler frameworks.`);
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="bg-white border border-slate-150 rounded-3xl p-6 shadow-sm space-y-8 animate-fadeIn" id="future-self-simulator-root">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#2563EB] font-mono block">Predictive Quantum Sandbox</span>
          <h3 className="text-xl font-extrabold text-slate-800 font-display mt-0.5 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <span>Future Self Simulator Pipeline</span>
          </h3>
          <p className="text-xs text-slate-500">
            Slide and adjust your daily habits variables below. Our cognitive AI twin engine simulates the temporal timeline shifts to predict future career placement and GPA metrics.
          </p>
        </div>

        {/* SIMULATION ACTION BUTTON */}
        <button
          type="button"
          onClick={handleSimulate}
          disabled={calculating}
          className="px-5 py-3 bg-[#0F172A] hover:bg-slate-800 text-white rounded-xl text-xs font-black shadow-lg flex items-center gap-1.5 transition-all self-start md:self-auto"
        >
          {calculating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Simulating...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Perform Simulation Timeline Shift</span>
            </>
          )}
        </button>
      </div>

      {/* THREE PANELS CONFIGURATION GAUGE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* SLIDERS COLUMN */}
        <div className="lg:col-span-6 bg-slate-50 border border-slate-200/65 rounded-2xl p-5 space-y-5">
          <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider block">Behavioral Modifiers (Predictors):</span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Slider 1 */}
            <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">Attendance</span>
                <span className="font-mono text-indigo-600 font-black">{targetAttendance}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                value={targetAttendance}
                onChange={(e) => setTargetAttendance(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="text-[9.5px] text-slate-400 block block-ellipsis block-line-clamp-1">Current: {student.behavioral.attendancePercentage}%</span>
            </div>

            {/* Slider 2 */}
            <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">Study Hours</span>
                <span className="font-mono text-indigo-600 font-black">{studyHours} h/wk</span>
              </div>
              <input
                type="range"
                min="2"
                max="40"
                value={studyHours}
                onChange={(e) => setStudyHours(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="text-[9.5px] text-slate-400 block">Baseline target: 14 h/wk</span>
            </div>

            {/* Slider 3 */}
            <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">Completed Challenges</span>
                <span className="font-mono text-indigo-600 font-black">{completedChallenges} tasks</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                value={completedChallenges}
                onChange={(e) => setCompletedChallenges(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="text-[9.5px] text-slate-400 block">Current count: {student.digital.challengesCompletedCount}</span>
            </div>

            {/* Slider 4 */}
            <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">Communication Skills</span>
                <span className="font-mono text-indigo-600 font-black">{commsSkill}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                value={commsSkill}
                onChange={(e) => setCommsSkill(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="text-[9.5px] text-slate-400 block">Includes verbal presentations</span>
            </div>

            {/* Slider 5 */}
            <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">Technical Skill (DNA)</span>
                <span className="font-mono text-indigo-600 font-black">{techSkill}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                value={techSkill}
                onChange={(e) => setTechSkill(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="text-[9.5px] text-slate-400 block">Practical software architecture</span>
            </div>

            {/* Slider 6 */}
            <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">Sleep Discipline</span>
                <span className="font-mono text-indigo-600 font-black">{sleepDiscipline}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={sleepDiscipline}
                onChange={(e) => setSleepDiscipline(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="text-[9.5px] text-slate-400 block">Aesthetic rest cycles</span>
            </div>

          </div>
        </div>

        {/* OUTCOMES COLUMN */}
        <div className="lg:col-span-6 bg-slate-50 border border-slate-200/65 rounded-2xl p-5 space-y-4">
          <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider block">Simulated Future State:</span>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            
            {/* Gauge 1 */}
            <div className="bg-white rounded-xl p-3 border border-slate-150 text-center shadow-xs flex flex-col justify-between h-28">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Future GPA</span>
              <span className="text-xl font-mono font-black text-indigo-600 block">{simulatedGpa}</span>
              <span className="text-[8.5px] text-[#22C55E] font-bold block bg-green-50 py-0.5 rounded-full">
                Baseline {student.academic.currentGPA}
              </span>
            </div>

            {/* Gauge 2 */}
            <div className="bg-white rounded-xl p-3 border border-slate-150 text-center shadow-xs flex flex-col justify-between h-28">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Future Employability</span>
              <span className="text-xl font-mono font-black text-[#14B8A6] block">{simulatedEmployability}%</span>
              <span className="text-[8.5px] text-[#22C55E] font-bold block bg-emerald-50 py-0.5 rounded-full">
                High Class
              </span>
            </div>

            {/* Gauge 3 */}
            <div className="bg-white rounded-xl p-3 border border-slate-150 text-center shadow-xs flex flex-col justify-between h-28">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Placement Job Chance</span>
              <span className="text-xl font-mono font-black text-amber-500 block">{simulatedPlacement}%</span>
              <span className="text-[8.5px] text-indigo-600 font-bold block bg-indigo-50 py-0.5 rounded-full">
                Tier-1 Corporate
              </span>
            </div>

            {/* Gauge 4 */}
            <div className="bg-white rounded-xl p-3 border border-slate-150 text-center shadow-xs flex flex-col justify-between h-28">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Gov Exam Readiness</span>
              <span className="text-xl font-mono font-black text-[#F43F5E] block">{simulatedExamReadiness}%</span>
              <span className="text-[8.5px] text-[#F43F5E] font-bold block bg-rose-50 py-0.5 rounded-full">
                TGPSC Prep
              </span>
            </div>

            {/* Gauge 5 */}
            <div className="bg-white rounded-xl p-3 border border-slate-150 text-center shadow-xs flex flex-col justify-between h-28">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Career Match score</span>
              <span className="text-xl font-mono font-black text-violet-600 block">{simulatedCareerScore}%</span>
              <span className="text-[8.5px] text-violet-600 font-bold block bg-violet-50 py-0.5 rounded-full">
                ML Engineer
              </span>
            </div>

            {/* Gauge 6 */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-3 border border-indigo-100 text-center flex flex-col justify-center items-center h-28 gap-1 shadow-xs">
              <Award className="w-5 h-5 text-indigo-600 animate-pulse" />
              <span className="text-[10px] font-black text-indigo-900 block leading-tight">Simulation Shift Enabled</span>
            </div>

          </div>
        </div>

      </div>

      {/* TEMPORAL SHIFT DRAFT TEXT BOX (AI OUTPUT Narrative) */}
      {simulationNarrative && (
        <div className="bg-slate-950 text-white rounded-2xl p-5 border border-slate-800 space-y-4 animate-fadeIn">
          <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 text-[10px] text-amber-400 font-bold uppercase tracking-widest font-mono">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping"></span>
            <span>Digital Twin Timeline Divergence Journal Narrative</span>
          </div>

          <div className="text-xs leading-relaxed font-sans text-slate-200 whitespace-pre-line prose prose-invert">
            {simulationNarrative}
          </div>
        </div>
      )}

    </div>
  );
}
