import React from "react";
import {
  Trophy,
  Zap,
  Star,
  Award,
  Sparkles,
  TrendingUp,
  User,
  Crown,
  Lock,
  CheckCircle,
  ThumbsUp,
  Flame
} from "lucide-react";
import { StudentDNAProfile } from "../types";

interface GamificationEngineProps {
  student: StudentDNAProfile;
}

export default function GamificationEngine({ student }: GamificationEngineProps) {
  // Mock achievements
  const achievements = [
    { id: "streak-7", name: "Alchemist Streak Coordinator", desc: "Maintained a continuous study habit profile log for 7 uninterrupted days.", xp: 200, icon: Flame, unlocked: true },
    { id: "compiler-win", name: "Compiler Protocols Conqueror", desc: "Resolved high-priority compiler indices challenges inside the Arena.", xp: 350, icon: Star, unlocked: true },
    { id: "bilingual", name: "Bilingual Academic Vocalist", desc: "Generated complex Telugu translation study guidelines in the Studio.", xp: 180, icon: Sparkles, unlocked: true },
    { id: "interview", name: "Stage-1 Mock Pitch Perfect", desc: "Published verified LinkedIn elevator presentation script credentials.", xp: 450, icon: Trophy, unlocked: false }
  ];

  // Mock regional peer leaderboard
  const LEADERBOARD = [
    { rank: 1, name: "Leo Carter", score: 2850, avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80", current: student.studentId === "std-leo-carter" },
    { rank: 2, name: "Maya Patel", score: 2420, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80", current: student.studentId === "std-maya-patel" },
    { rank: 3, name: "Arjun Verma", score: 2150, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", current: false },
    { rank: 4, name: "Kiara Bose", score: 1840, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", current: false }
  ];

  return (
    <div className="bg-white border border-slate-150 rounded-3xl p-6 shadow-sm space-y-8 animate-fadeIn" id="gamification-engine-root">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#2563EB] font-mono block">Progression & Incentives</span>
          <h3 className="text-xl font-extrabold text-slate-800 font-display mt-0.5 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>Twin Milestones & Gamification Ledger</span>
          </h3>
          <p className="text-xs text-slate-500">
            Earn experience points (XP) by conquering coding challenges, executing study blueprints, and improving communication. Unlocking milestones increases your Placement Rating.
          </p>
        </div>

        {/* COMPACT LEVEL REINFORCER */}
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 max-w-fit shadow-xs">
          <Star className="w-4 h-4 fill-current text-amber-500" />
          <span>Active Streak: <strong className="font-mono text-amber-950 font-black">{student.digital.streakDays} Days Action</strong></span>
        </div>
      </div>

      {/* CORE STATS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEADERBOARD COL */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-200/60 rounded-2xl p-5 space-y-4">
          <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider block">Regional Peer Leaderboard:</span>
          
          <div className="space-y-2.5">
            {LEADERBOARD.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                  item.current
                    ? "bg-indigo-600 border-indigo-700 text-white font-semibold"
                    : "bg-white border-slate-200/70 text-slate-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`font-mono font-black text-sm w-5 text-center ${
                    idx === 0
                      ? item.current ? "text-yellow-350" : "text-amber-500"
                      : idx === 1
                        ? item.current ? "text-slate-100" : "text-slate-400"
                        : "text-slate-400"
                  }`}>
                    #{idx + 1}
                  </span>
                  <img src={item.avatar} alt={item.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-white/10" />
                  <div>
                    <span className="font-bold block text-[11px]">{item.name}</span>
                    {idx === 0 && (
                      <span className={`text-[8.5px] uppercase font-mono tracking-widest font-extrabold ${item.current ? "text-indigo-200" : "text-amber-600"}`}>
                        👑 Level Master
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-black block text-sm">{item.score} XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACHIEVEMENTS BLOCK COL */}
        <div className="lg:col-span-7 bg-slate-50 border border-slate-200/60 rounded-2xl p-5 space-y-4">
          <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider block">Cognitive Accomplishments:</span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {achievements.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={`bg-white p-3.5 rounded-xl border shadow-2xs flex gap-3 ${
                    item.unlocked ? "border-slate-150" : "border-slate-200 opacity-60 bg-slate-50/50"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-xs ${
                    item.unlocked ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-400"
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-800 text-[11px] leading-tight block truncate max-w-28">{item.name}</span>
                      {item.unlocked ? (
                        <span className="text-[8.5px] bg-green-50 text-green-700 font-extrabold px-1.5 py-0.5 rounded-md">
                          COMPLETED
                        </span>
                      ) : (
                        <span className="text-[8.5px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                          <Lock className="w-2.5 h-2.5" />
                          <span>LOCKED</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight leading-ellipsis line-clamp-2">{item.desc}</p>
                    <span className="text-[9.5px] text-amber-500 font-mono font-bold block">Worth: +{item.xp} XP</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* REWARDS MAP GRID CARD */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/60 space-y-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider block">Locked & Unlocked Badges Checklist:</span>
          <p className="text-xs text-slate-500">Unlocking badges improves your placements credibility rating when seen by certified recruiters.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-4 border border-yellow-200 text-center flex flex-col justify-between h-28 items-center shadow-2xs">
            <Award className="w-8 h-8 text-amber-500 animate-bounce" />
            <span className="text-xs font-black text-amber-900 block leading-tight">Gold Coding Emblem</span>
            <span className="text-[9px] text-[#22C55E] font-bold block bg-green-100 px-2 py-0.5 rounded-full">UNLOCKED</span>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 text-center flex flex-col justify-between h-28 items-center shadow-2xs">
            <Crown className="w-8 h-8 text-blue-500" />
            <span className="text-xs font-black text-blue-900 block leading-tight">Cognitive Champion</span>
            <span className="text-[9px] text-[#22C55E] font-bold block bg-green-100 px-2 py-0.5 rounded-full">UNLOCKED</span>
          </div>

          <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-xl p-4 border border-violet-200 text-center flex flex-col justify-between h-28 items-center shadow-2xs">
            <Sparkles className="w-8 h-8 text-violet-500" />
            <span className="text-xs font-black text-violet-900 block leading-tight">Bilingual Medallion</span>
            <span className="text-[9px] text-[#22C55E] font-bold block bg-green-100 px-2 py-0.5 rounded-full">UNLOCKED</span>
          </div>

          <div className="bg-slate-100 rounded-xl p-4 border border-slate-200 text-center flex flex-col justify-between h-28 items-center opacity-60">
            <Lock className="w-7 h-7 text-slate-400 mt-1" />
            <span className="text-xs font-black text-slate-700 block leading-tight">Career Catalyst Badge</span>
            <span className="text-[9px] text-slate-500 font-bold block bg-slate-250 px-2 py-0.5 rounded-full">LOCKED</span>
          </div>

        </div>
      </div>

    </div>
  );
}
