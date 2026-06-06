import React, { useState } from "react";
import {
  Share2,
  Download,
  Check,
  Award,
  Sparkles,
  Zap,
  Cpu,
  Brain,
  QrCode,
  Flame,
  ArrowRight
} from "lucide-react";
import { StudentDNAProfile } from "../types";

interface ViralShareCardsProps {
  student: StudentDNAProfile;
}

interface ShareTemplate {
  id: string;
  label: string;
  title: string;
  gradient: string;
  metricLabel: string;
  metricValue: string;
  badgeText: string;
  highlights: string[];
}

export default function ViralShareCards({ student }: ViralShareCardsProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("dna-growth");
  const [sharedTrigger, setSharedTrigger] = useState<boolean>(false);
  const [copiedTrigger, setCopiedTrigger] = useState<boolean>(false);

  // Define V2 share templates
  const TEMPLATES: Record<string, ShareTemplate> = {
    "dna-growth": {
      id: "dna-growth",
      label: "📈 DNA Growth Card",
      title: "DNA GROWTH CARD",
      gradient: "from-[#2563EB] via-indigo-600 to-indigo-800",
      metricLabel: "COMPOSITE CLIMB",
      metricValue: "Level 12",
      badgeText: "STABLE VELOCITY",
      highlights: ["Technical DNA: +12%", "Communication DNA: +8%", "Career Readiness: +10%"]
    },
    "employability": {
      id: "employability",
      label: "💼 Employability Card",
      title: "EMPLOYABILITY CARD",
      gradient: "from-[#8B5CF6] via-violet-600 to-purple-800",
      metricLabel: "EMPLOYABILITY GROWTH",
      metricValue: "71% → 79%",
      badgeText: "RECRUITER MATURE",
      highlights: ["+8% Placement Confidence Rise", "Mock Interview Assessment Passed", "Bilingual presentation certified"]
    },
    "challenge-complete": {
      id: "challenge-complete",
      label: "🏆 Challenge Completion Card",
      title: "CHALLENGE COMPLETION CARD",
      gradient: "from-[#F59E0B] via-amber-600 to-orange-700",
      metricLabel: "RESOLUTION RECORD",
      metricValue: "30-Day Coding Complete",
      badgeText: "CHAMPIONSHIP STYLE",
      highlights: ["30-Day coding challenge completed", "SQL Masterclass Badge Unlocked", "Earned +5,420 Cumulative XP"]
    },
    "future-self": {
      id: "future-self",
      label: "🔮 Future Self Card",
      title: "FUTURE SELF CARD",
      gradient: "from-[#EC4899] via-pink-600 to-rose-700",
      metricLabel: "TEMPORAL PROJECTION",
      metricValue: "Current You vs Future You",
      badgeText: "TIER-1 ARCHITECT TYPE",
      highlights: [
        "Current Maya: Employability 71%, Comm 58%, Tech 76%",
        "Future Maya: Employability 89%, Comm 82%, Tech 92%",
        "Required: Complete SQL Challenge, 30-Day Streak, Comm Sprint"
      ]
    }
  };

  const activeTemplate = TEMPLATES[selectedTemplateId];

  const handleShare = () => {
    setSharedTrigger(true);
    setTimeout(() => setSharedTrigger(false), 2000);
  };

  const handleCopyLink = () => {
    setCopiedTrigger(true);
    setTimeout(() => setCopiedTrigger(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-150 rounded-3xl p-6 shadow-sm space-y-6 animate-fadeIn" id="viral-share-cards-root">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#2563EB] font-mono block">Outreach & Engagement</span>
          <h3 className="text-xl font-extrabold text-slate-800 font-display mt-0.5 flex items-center gap-1.5">
            <Share2 className="w-5 h-5 text-indigo-600" />
            <span>Viral Growth Cards Sharing Hub</span>
          </h3>
          <p className="text-xs text-slate-500">
            Generate and export beautifully-curated graphical certificates detailing your academic progress. Shared metrics verify your expertise with peer networks and active corporate recruiters.
          </p>
        </div>
      </div>

      {/* HORIZONTAL CHOICE BUTTONS ROW */}
      <div className="flex flex-wrap gap-2">
        {Object.values(TEMPLATES).map((temp) => (
          <button
            key={temp.id}
            type="button"
            onClick={() => setSelectedTemplateId(temp.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
              selectedTemplateId === temp.id
                ? "bg-slate-900 text-white shadow-sm font-black"
                : "bg-slate-50 text-slate-500 border border-slate-200"
            }`}
          >
            {temp.label}
          </button>
        ))}
      </div>

      {/* GRAPHIC SOUVENIR RENDERING */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* TEMPLATE CONTAINER */}
        <div className="lg:col-span-8 flex justify-center">
          <div
            className={`w-full max-w-lg bg-gradient-to-br ${activeTemplate.gradient} rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between aspect-[1.6/1] relative overflow-hidden`}
            id="share-card-graphic"
          >
            {/* Background design accents */}
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Brain className="w-48 h-48" />
            </div>

            {/* Header portion */}
            <div className="flex justify-between items-start border-b border-white/20 pb-4">
              <div className="space-y-1">
                <span className="text-[9px] tracking-widest font-bold uppercase font-mono bg-white/20 text-white/90 px-2.5 py-1 rounded">
                  {activeTemplate.title}
                </span>
                <p className="text-[11.5px] italic text-slate-100 font-medium">MirrorMind Digital Twin Platform Verified Credentials</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono tracking-wider bg-emerald-500 text-white px-2.5 py-0.5 rounded-full font-bold">
                  {activeTemplate.badgeText}
                </span>
              </div>
            </div>

            {/* Middle portion */}
            <div className="flex justify-between items-center my-4 gap-4">
              <div className="space-y-1.5 flex-1">
                <span className="text-[9px] uppercase font-bold text-slate-200 font-mono tracking-wider block">Student Identity</span>
                <div className="flex items-center gap-2.5">
                  <img
                    src={student.avatarUrl}
                    alt={student.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white/30"
                  />
                  <div>
                    <h5 className="font-extrabold text-sm">{student.name}</h5>
                    <p className="text-[10px] text-slate-200 uppercase tracking-widest font-mono">ID: {student.studentId.toUpperCase()}</p>
                  </div>
                </div>
              </div>

              {/* Central high resolution metric bubble */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/20 text-center min-w-[130px] shrink-0">
                <span className="text-[8.5px] uppercase font-extrabold text-slate-200 font-mono block leading-tight">{activeTemplate.metricLabel}</span>
                <span className="text-2xl font-black font-mono mt-1 block">{activeTemplate.metricValue}</span>
              </div>
            </div>

            {/* Lower portion highlights */}
            <div className="flex justify-between items-end border-t border-white/20 pt-4 mt-1">
              <div className="space-y-1">
                {activeTemplate.highlights.map((h, hidx) => (
                  <div key={hidx} className="flex items-center gap-1.5 text-[10px] text-indigo-150 font-medium">
                    <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              {/* Mock QR verification code */}
              <div className="bg-white p-1 rounded-xl shrink-0 border border-white/10 relative group">
                <QrCode className="w-9 h-9 text-slate-900" />
              </div>
            </div>

          </div>
        </div>

        {/* SOCIAL OUTLET TRIGGERS COLUMN */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-2xl space-y-3.5">
            <span className="text-[10px] font-mono font-black text-slate-450 block uppercase tracking-wider">Social Publication Channels:</span>
            
            <button
              onClick={handleShare}
              className={`w-full py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                sharedTrigger ? "bg-green-600 text-white" : "bg-slate-900 hover:bg-slate-800 text-white"
              }`}
            >
              {sharedTrigger ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Published to LinkedIn Feed!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-slate-300" />
                  <span>Publish Growth Card on LinkedIn</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyLink}
              className={`w-full py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all border ${
                copiedTrigger ? "bg-green-50 border-green-350 text-green-700" : "bg-white hover:bg-slate-50 border-slate-250 text-slate-700"
              }`}
            >
              {copiedTrigger ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Credential Link Copied!</span>
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4 text-slate-400" />
                  <span>Copy Verified Port Credentials IPFS</span>
                </>
              )}
            </button>
          </div>

          {/* VISUAL SHARING REINFORCEMENTS */}
          <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-2xl text-[11px] text-slate-500 leading-relaxed space-y-1.5">
            <span className="text-[9px] uppercase font-bold text-indigo-600 font-mono block">Recruiter Accessibility:</span>
            <p>Every certificate is generated with a cryptographically signed QR code resolving deep to your **5D MirrorMind DNA profile**, unlocking immediate verified application routing.</p>
          </div>
        </div>

      </div>

    </div>
  );
}
