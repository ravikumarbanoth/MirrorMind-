import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { UserRole, AppDatabase, StudentDNAProfile, Challenge, StudentChallengeProgress, GeneratedStudyPack, ValueWeaveInsight, LeaderboardUser, ActiveIntervention } from "./src/types";

dotenv.config();

// Initialize Express
const app = express();
const PORT = 3000;

// Enable body parser
app.use(express.json());

// Initialize Gemini Client
const aiApiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    if (!aiApiKey) {
      console.warn("WARNING: GEMINI_API_KEY is not defined in environment variables. Gemini calls will fail.");
    }
    aiClient = new GoogleGenAI({
      apiKey: aiApiKey || "DUMMY_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return aiClient;
}

// ------------------- INITIAL PRE-SEEDED DATABASE -------------------
const seedChallenges: Challenge[] = [
  {
    id: "ch-detox-1",
    title: "30-Day Mobile Detox",
    description: "Limit non-educational screen time to under 1 hour per day. Re-engage with notes and physical books.",
    category: "Detox",
    durationDays: 30,
    xpValue: 450,
    badgeRewarded: {
      name: "Focus Catalyst",
      icon: "SmartphoneOff",
      color: "emerald"
    }
  },
  {
    id: "ch-read-1",
    title: "Daily Technical Reading",
    description: "Read one research paper, textbook chapter, or high-quality tech blog every single day for 10 days.",
    category: "Reading",
    durationDays: 10,
    xpValue: 200,
    badgeRewarded: {
      name: "Knowledge Whisperer",
      icon: "BookOpen",
      color: "sky"
    }
  },
  {
    id: "ch-code-1",
    title: "Daily Algorithm Challenge",
    description: "Solve at least one interview algorithm or bug-fix problem daily on LeetCode/HackerRank.",
    category: "Coding",
    durationDays: 15,
    xpValue: 350,
    badgeRewarded: {
      name: "Logic Maestro",
      icon: "Code",
      color: "amber"
    }
  },
  {
    id: "ch-comms-1",
    title: "1-Min Elevator Pitch Practice",
    description: "Record yourself presenting a technical concept under 60 seconds every day to boost verbal clarity.",
    category: "Communication",
    durationDays: 7,
    xpValue: 180,
    badgeRewarded: {
      name: "Vocal Charmer",
      icon: "Mic",
      color: "indigo"
    }
  },
  {
    id: "ch-attend-1",
    title: "Zero-Absentee Academic Streak",
    description: "Achieve 100% attendance across all physical lectures, labs, and interactive seminars for 14 straight days.",
    category: "Attendance",
    durationDays: 14,
    xpValue: 300,
    badgeRewarded: {
      name: "Clockwork Scholar",
      icon: "CalendarCheck",
      color: "rose"
    }
  }
];

const seedStudents: StudentDNAProfile[] = [
  {
    studentId: "std-maya-patel",
    name: "Maya Patel",
    email: "maya.patel@mirrormind.edu",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    department: "Computer Science & AI",
    semester: "Semester 6",
    academic: {
      strengths: ["Machine Learning", "Neural Networks", "Data Visualization"],
      weaknesses: ["Computer Networks", "Database Architecture", "System Design"],
      currentGPA: 3.25,
      gpaTrends: [
        { semester: "Semester 1", gpa: 3.50 },
        { semester: "Semester 2", gpa: 3.65 },
        { semester: "Semester 3", gpa: 3.40 },
        { semester: "Semester 4", gpa: 3.52 },
        { semester: "Semester 5", gpa: 3.25 }
      ],
      internalMarks: [
        { subject: "Deep Learning Foundations", score: 88, max: 100 },
        { subject: "High Performance Computing", score: 62, max: 100 },
        { subject: "Network Security Protocols", score: 54, max: 100 }
      ],
      assignmentScores: [
        { title: "Backprop Implementation", subject: "Deep Learning Foundations", score: 28, max: 30 },
        { title: "Socket Server Lab", subject: "Network Security Protocols", score: 15, max: 25 },
        { title: "MapReduce Clustering", subject: "High Performance Computing", score: 18, max: 25 }
      ]
    },
    behavioral: {
      attendancePercentage: 78.5, // AT RISK WARNING
      punctualityScore: 72,
      classParticipation: 85,
      disciplineIncidents: 0,
      lastActive: new Date().toISOString()
    },
    learning: {
      visual: 75,
      reading: 45,
      practice: 85,
      collaborative: 55
    },
    career: {
      careerInterests: ["AI Scientist", "Machine Learning Engineer", "Scientific Researcher"],
      preferredDomains: ["Computer Vision", "HealthTech Intelligence", "LLM Fine-tuning"],
      skillsMastered: ["Python Core", "PyTorch", "Data Wrangling"],
      skillsInProgress: ["Kubernetes", "Transformer Models", "GPU Programming"],
      roadmapCompleted: 45
    },
    digital: {
      learningActivityHours: 124,
      contentEngagementScore: 92,
      challengesCompletedCount: 3,
      streakDays: 4
    }
  },
  {
    studentId: "std-leo-carter",
    name: "Leo Carter",
    email: "leo.carter@mirrormind.edu",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    department: "Information Technology",
    semester: "Semester 6",
    academic: {
      strengths: ["Clean Coder", "Front-end UX Architect", "Git Workflows"],
      weaknesses: ["Compiler Construction", "Digital Image Processing", "Heavy Mathematics"],
      currentGPA: 3.48,
      gpaTrends: [
        { semester: "Semester 1", gpa: 3.10 },
        { semester: "Semester 2", gpa: 3.25 },
        { semester: "Semester 3", gpa: 3.32 },
        { semester: "Semester 4", gpa: 3.45 },
        { semester: "Semester 5", gpa: 3.48 }
      ],
      internalMarks: [
        { subject: "Advanced Web Technologies", score: 92, max: 100 },
        { subject: "Distributed Cloud Systems", score: 81, max: 100 },
        { subject: "Linear Algebra & Stats", score: 68, max: 100 }
      ],
      assignmentScores: [
        { title: "React Framer Showcase", subject: "Advanced Web Technologies", score: 29, max: 30 },
        { title: "Matrix Inversion Suite", subject: "Linear Algebra & Stats", score: 20, max: 25 },
        { title: "S3 Proxy Deployment", subject: "Distributed Cloud Systems", score: 22, max: 25 }
      ]
    },
    behavioral: {
      attendancePercentage: 92.0,
      punctualityScore: 88,
      classParticipation: 90,
      disciplineIncidents: 0,
      lastActive: new Date().toISOString()
    },
    learning: {
      visual: 40,
      reading: 80,
      practice: 90,
      collaborative: 70
    },
    career: {
      careerInterests: ["Full Stack Developer", "UX / UI Architect", "SaaS Technical Lead"],
      preferredDomains: ["Corporate Fintech Platforms", "Interactive Learning UI", "API Mesh Systems"],
      skillsMastered: ["React / Next.js", "Tailwind CSS", "Node / Express"],
      skillsInProgress: ["TypeScript Safety", "NextAuth Security", "Redis Cache Models"],
      roadmapCompleted: 68
    },
    digital: {
      learningActivityHours: 188,
      contentEngagementScore: 81,
      challengesCompletedCount: 5,
      streakDays: 14
    }
  },
  {
    studentId: "std-alex-wong",
    name: "Alex Wong",
    email: "alex.wong@mirrormind.edu",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    department: "Cybersecurity & Networks",
    semester: "Semester 6",
    academic: {
      strengths: ["Ethical Hacking", "Wired/Wireless Networks", "OS Internals"],
      weaknesses: ["Verbal Presentations", "High-Volume Technical Writing", "Group Management"],
      currentGPA: 3.86,
      gpaTrends: [
        { semester: "Semester 1", gpa: 3.75 },
        { semester: "Semester 2", gpa: 3.80 },
        { semester: "Semester 3", gpa: 3.82 },
        { semester: "Semester 4", gpa: 3.90 },
        { semester: "Semester 5", gpa: 3.86 }
      ],
      internalMarks: [
        { subject: "Ethical Pen Testing", score: 98, max: 100 },
        { subject: "Cryptography Concepts", score: 94, max: 100 },
        { subject: "Enterprise Firewalls", score: 90, max: 100 }
      ],
      assignmentScores: [
        { title: "Kali Intrusion Sandbox", subject: "Ethical Pen Testing", score: 30, max: 30 },
        { title: "SHA-256 Collision Assay", subject: "Cryptography Concepts", score: 24, max: 25 },
        { title: "Cisco Access List Mesh", subject: "Enterprise Firewalls", score: 25, max: 25 }
      ]
    },
    behavioral: {
      attendancePercentage: 97.5,
      punctualityScore: 96,
      classParticipation: 60, // Low verbal participation/weakness
      disciplineIncidents: 0,
      lastActive: new Date().toISOString()
    },
    learning: {
      visual: 25,
      reading: 55,
      practice: 95,
      collaborative: 35
    },
    career: {
      careerInterests: ["Penetration Tester", "SecOps Security Analyst", "Reverse Engineer"],
      preferredDomains: ["Military Defense Architectures", "Autonomous Threat Detection", "Web3 Smart Auditing"],
      skillsMastered: ["Ethical Tools Suite", "Linux Admin", "C / C++ Foundations"],
      skillsInProgress: ["Assembly Debugging", "Solidity Core Audit", "OAuth Standard Hardening"],
      roadmapCompleted: 80
    },
    digital: {
      learningActivityHours: 245,
      contentEngagementScore: 78,
      challengesCompletedCount: 9,
      streakDays: 25
    }
  }
];

const seedStudentChallenges: StudentChallengeProgress[] = [
  {
    challengeId: "ch-code-1",
    studentId: "std-maya-patel",
    currentStreak: 4,
    longestStreak: 4,
    completedDays: 4,
    status: "Active",
    progressPercentage: 26,
    logs: [
      { date: "2026-06-01T12:00:00Z", note: "Solved Binary Search tree inversion." },
      { date: "2026-06-02T14:30:00Z", note: "Optimized a quicksort script to run in-place." },
      { date: "2026-06-03T18:00:00Z", note: "Corrected heap-sort recursion memory limits." },
      { date: "2026-06-04T10:15:00Z", note: "Resolved custom hash map collision chaining." }
    ]
  },
  {
    challengeId: "ch-comms-1",
    studentId: "std-alex-wong",
    currentStreak: 2,
    longestStreak: 2,
    completedDays: 2,
    status: "Active",
    progressPercentage: 28,
    logs: [
      { date: "2026-06-03T09:00:00Z", note: "Exposed what symmetric encryption is in 50 seconds." },
      { date: "2026-06-04T11:20:00Z", note: "Explained standard Buffer Overflow exploit triggers." }
    ]
  },
  {
    challengeId: "ch-detox-1",
    studentId: "std-leo-carter",
    currentStreak: 12,
    longestStreak: 12,
    completedDays: 12,
    status: "Active",
    progressPercentage: 40,
    logs: [
      { date: "2026-06-04T22:00:00Z", note: "Screen time clocked under 42 minutes, successfully finished web notes study." }
    ]
  }
];

const seedLeaderboard: LeaderboardUser[] = [
  { id: "std-alex-wong", name: "Alex Wong", avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200", level: 9, xp: 4890, challengesCount: 9 },
  { id: "std-leo-carter", name: "Leo Carter", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200", level: 7, xp: 3450, challengesCount: 5 },
  { id: "std-maya-patel", name: "Maya Patel", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200", level: 5, xp: 2120, challengesCount: 3 }
];

const seedValueWeaveInsights: ValueWeaveInsight[] = [
  {
    id: "vw-insight-1",
    title: "AI & Full-Stack Synergy Skills Demand Exploding",
    description: "Industry hiring indicators show a massive 140% spike in team requirements combining visual interface development with serverless LLM pipeline configurations.",
    sourceReport: "ValueWeave Enterprise Labor Index Q2-2026",
    industryTrend: "AI Integrations, Next.js Development, GPU Orchestration",
    dateImported: "2026-06-05T01:00:00Z",
    recommendedActions: {
      targetInterest: "AI",
      suggestedCareer: "Machine Learning Full-Stack Engineer",
      suggestedPathTitle: "AI Integration Engineering",
      newChallengeTitle: "10-Day AI Application Builder",
      newChallengeDesc: "Design prompt-mesh prototypes with production APIs and state structures daily."
    }
  },
  {
    id: "vw-insight-2",
    title: "Verve in Cybersecurity Smart-Contract Auditing",
    description: "Decentralized systems security breaches are costing global enterprises nearly $12B annually, elevating the premium for verified auditing skills by 75%.",
    sourceReport: "ValueWeave Blockchain Defenses Report 2026",
    industryTrend: "Solidity Audits, Layer 2 Protections, Rust Web Assembly",
    dateImported: "2026-06-04T12:00:00Z",
    recommendedActions: {
      targetInterest: "Cybersecurity",
      suggestedCareer: "DeFi Protocol Auditing Consultant",
      suggestedPathTitle: "Web3 Threat & Audit Engineering",
      newChallengeTitle: "7-Day Smart Contract Exploits Walkthrough",
      newChallengeDesc: "Analyze historic hacks (re-entrancy, flash loan attacks) and implement patches."
    }
  }
];

// seeded interventions
const seedInterventions: ActiveIntervention[] = [
  {
    id: "int-maya-1",
    studentId: "std-maya-patel",
    studentName: "Maya Patel",
    challengeTitle: "Zero-Absentee Academic Streak",
    status: "Active",
    assignedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    type: "Attendance Recovery",
    outcome: "Attended 4 sessions consecutively; attendance stabilization model index rose from 74% to 79%."
  },
  {
    id: "int-alex-1",
    studentId: "std-alex-wong",
    studentName: "Alex Wong",
    challengeTitle: "1-Min Elevator Pitch Practice",
    status: "Active",
    assignedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    type: "Communication Booster",
    outcome: "Recorded 1 practice elevator pitch; communication benchmark index rising (+5% projected)."
  }
];

// Complete application database
const dbState: AppDatabase = {
  students: seedStudents,
  challenges: seedChallenges,
  studentChallenges: seedStudentChallenges,
  leaderboard: seedLeaderboard,
  studyPacks: [],
  valueweaveInsights: seedValueWeaveInsights,
  interventions: seedInterventions,
  currentUser: {
    id: "std-maya-patel",
    name: "Maya Patel",
    email: "maya.patel@mirrormind.edu",
    role: UserRole.STUDENT,
    studentId: "std-maya-patel"
  }
};

// ------------------- API CONTROLLERS -------------------

// FETCH DB
app.get("/api/db", (req, res) => {
  res.json(dbState);
});

// CHOOSE Mock USER MODE
app.post("/api/select-user", (req, res) => {
  const { role, studentId } = req.body;
  if (!role) {
    return res.status(400).json({ error: "Role is required" });
  }

  if (role === UserRole.STUDENT && studentId) {
    const std = dbState.students.find(s => s.studentId === studentId);
    if (std) {
      dbState.currentUser = {
        id: std.studentId,
        name: std.name,
        email: std.email,
        role: UserRole.STUDENT,
        studentId: std.studentId
      };
    }
  } else if (role === UserRole.PRINCIPAL) {
    dbState.currentUser = {
      id: "usr-principal-vance",
      name: "Dr. Arthur Vance",
      email: "arthur.vance@mirrormind.edu",
      role: UserRole.PRINCIPAL
    };
  } else if (role === UserRole.LECTURER) {
    dbState.currentUser = {
      id: "usr-lecturer-sarah",
      name: "Prof. Sarah Jenkins",
      email: "sarah.jenkins@mirrormind.edu",
      role: UserRole.LECTURER
    };
  } else if (role === UserRole.SUPER_ADMIN) {
    dbState.currentUser = {
      id: "usr-super-admin",
      name: "Director Dave Miller",
      email: "director.dave@mirrormind.edu",
      role: UserRole.SUPER_ADMIN
    };
  }

  res.json({ success: true, currentUser: dbState.currentUser });
});

// ENROLL CHALLENGE
app.post("/api/challenges/enroll", (req, res) => {
  const { challengeId, studentId } = req.body;
  if (!challengeId || !studentId) {
    return res.status(400).json({ error: "Missing challengeId or studentId" });
  }

  const already = dbState.studentChallenges.find(
    sc => sc.challengeId === challengeId && sc.studentId === studentId
  );
  if (already) {
    return res.json({ success: true, message: "Already enrolled", progress: already });
  }

  const newProg: StudentChallengeProgress = {
    challengeId,
    studentId,
    currentStreak: 0,
    longestStreak: 0,
    completedDays: 0,
    status: "Active",
    progressPercentage: 0,
    logs: [{ date: new Date().toISOString(), note: "Enrolled in challenge!" }]
  };

  dbState.studentChallenges.push(newProg);
  res.json({ success: true, progress: newProg });
});

// RECORD CHALLENGE DAY PROGRESS
app.post("/api/challenges/progress", (req, res) => {
  const { challengeId, studentId, note } = req.body;
  if (!challengeId || !studentId) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  const prog = dbState.studentChallenges.find(
    sc => sc.challengeId === challengeId && sc.studentId === studentId
  );
  if (!prog) {
    return res.status(404).json({ error: "Challenge progress not active" });
  }

  const challenge = dbState.challenges.find(c => c.id === challengeId);
  if (!challenge) {
    return res.status(404).json({ error: "Challenge configuration not found" });
  }

  // Update stats
  prog.completedDays += 1;
  prog.currentStreak += 1;
  if (prog.currentStreak > prog.longestStreak) {
    prog.longestStreak = prog.currentStreak;
  }
  prog.progressPercentage = Math.min(100, Math.round((prog.completedDays / challenge.durationDays) * 100));
  prog.logs.unshift({ date: new Date().toISOString(), note: note || "Task completed for the day." });

  // If completed
  if (prog.completedDays >= challenge.durationDays) {
    prog.status = "Completed";
  }

  // Award XP to student digital metrics
  const student = dbState.students.find(s => s.studentId === studentId);
  if (student) {
    student.digital.learningActivityHours += 2.5;
    student.digital.contentEngagementScore = Math.min(100, student.digital.contentEngagementScore + 5);
    if (prog.status === "Completed") {
      student.digital.challengesCompletedCount += 1;
    }
    student.digital.streakDays = prog.currentStreak;
  }

  // Award XP to leaderboard
  const leaderIdx = dbState.leaderboard.findIndex(l => l.id === studentId);
  if (leaderIdx !== -1) {
    dbState.leaderboard[leaderIdx].xp += 50 + (prog.status === "Completed" ? challenge.xpValue : 0);
    if (prog.status === "Completed") {
      dbState.leaderboard[leaderIdx].challengesCount += 1;
    }
    // Simple level calculation (level up every 1000 XP)
    dbState.leaderboard[leaderIdx].level = Math.floor(dbState.leaderboard[leaderIdx].xp / 1000) + 1;
  }

  dbState.leaderboard.sort((a,b) => b.xp - a.xp);

  res.json({ success: true, progress: prog, leaderboard: dbState.leaderboard });
});

// LECTURER CREATES CHALLENGE
app.post("/api/challenges/create", (req, res) => {
  const { title, description, category, durationDays, xpValue, badgeName, badgeColor, badgeIcon } = req.body;
  if (!title || !description || !category) {
    return res.status(400).json({ error: "Title, description, and category are required" });
  }

  const newChallenge: Challenge = {
    id: `ch-custom-${Date.now()}`,
    title,
    description,
    category,
    durationDays: Number(durationDays) || 7,
    xpValue: Number(xpValue) || 150,
    badgeRewarded: {
      name: badgeName || "Challenge Breaker",
      icon: badgeIcon || "Award",
      color: badgeColor || "amber"
    }
  };

  dbState.challenges.push(newChallenge);
  res.json({ success: true, challenge: newChallenge });
});

// BULK STUDENT CSV/EXCEL IMPORT ONBOARDING (Priority 6)
app.post("/api/students/bulk-upload", (req, res) => {
  const { studentsList } = req.body;
  if (!Array.isArray(studentsList) || studentsList.length === 0) {
    return res.status(400).json({ error: "Invalid student list provided" });
  }

  const addedStudents: StudentDNAProfile[] = [];

  studentsList.forEach((input: any) => {
    const rollNo = input.rollNo || `std-bulk-${Math.random().toString(36).substr(2, 6)}`;
    const studentId = rollNo.toLowerCase().replace(/[^a-z0-9-]/g, "-");
    const name = input.name || "Seeded Student";
    const email = input.email || `${studentId}@mirrormind.edu`;
    const department = input.department || "Computer Science & Engineering";
    const semester = input.semester || "Semester 4";
    const attendance = Number(input.attendance) || 85;
    const gpa = Number(input.gpa) || 3.4;

    const newStudent: StudentDNAProfile = {
      studentId,
      name,
      email,
      avatarUrl: input.avatarUrl || `https://images.unsplash.com/photo-${[
        "1534528741775-53994a69daeb", "1506794778202-cad84cf45f1d", 
        "1507003211169-0a1dd7228f2d", "1494790108377-be9c29b29330",
        "1517841905240-472988babdf9"
      ][Math.floor(Math.random() * 5)]}?auto=format&fit=crop&q=80&w=200`,
      department,
      semester,
      academic: {
        strengths: (typeof input.strengths === "string" && input.strengths.split(",")) || ["Python Core", "Clean Architecture", "Problem Solving"],
        weaknesses: (typeof input.weaknesses === "string" && input.weaknesses.split(",")) || ["Networks", "Theory Calculations"],
        currentGPA: gpa,
        gpaTrends: [
          { semester: "Semester 1", gpa: Number((gpa * 0.90).toFixed(2)) },
          { semester: "Semester 2", gpa: Number((gpa * 0.95).toFixed(2)) },
          { semester: "Semester 3", gpa: Number((gpa * 1.02).toFixed(2)) },
          { semester: "Semester 4", gpa: gpa }
        ],
        internalMarks: [
          { subject: "Data Structures & Alg.", score: Math.round(gpa * 23), max: 100 },
          { subject: "Syllabus Project Labs", score: Math.round(gpa * 24), max: 100 },
          { subject: "Optional Specialization", score: Math.round(gpa * 21), max: 100 }
        ],
        assignmentScores: [
          { title: "Standard Homework 1", subject: "Data Structures & Alg.", score: Math.round(gpa * 7), max: 30 }
        ]
      },
      behavioral: {
        attendancePercentage: attendance,
        punctualityScore: Math.round(75 + Math.random() * 20),
        classParticipation: Math.round(70 + Math.random() * 25),
        disciplineIncidents: 0,
        lastActive: new Date().toISOString()
      },
      learning: {
        visual: Number(input.visualValue) || Math.round(40 + Math.random() * 50),
        reading: Number(input.readingValue) || Math.round(30 + Math.random() * 45),
        practice: Number(input.practiceValue) || Math.round(50 + Math.random() * 45),
        collaborative: Number(input.collaborativeValue) || Math.round(40 + Math.random() * 45)
      },
      career: {
        careerInterests: (typeof input.careerInterests === "string" && input.careerInterests.split(",")) || ["Fullstack Developer", "AI Practitioner"],
        preferredDomains: ["Web Development", "Intelligent Systems"],
        skillsMastered: ["JavaScript", "Python"],
        skillsInProgress: ["React UX State", "Next.js"],
        roadmapCompleted: 35
      },
      digital: {
        learningActivityHours: Math.round(40 + Math.random() * 100),
        contentEngagementScore: Math.round(60 + Math.random() * 32),
        challengesCompletedCount: Math.floor(Math.random() * 5),
        streakDays: Math.floor(Math.random() * 5)
      }
    };

    // Check duplicate
    const idx = dbState.students.findIndex(s => s.studentId === newStudent.studentId);
    if (idx !== -1) {
      dbState.students[idx] = newStudent;
    } else {
      dbState.students.push(newStudent);
    }
    
    // Add to leaderboard
    const leadIdx = dbState.leaderboard.findIndex(l => l.id === newStudent.studentId);
    const newLeader: LeaderboardUser = {
      id: newStudent.studentId,
      name: newStudent.name,
      avatarUrl: newStudent.avatarUrl,
      level: Math.floor(gpa * 2),
      xp: Math.round(gpa * 1050),
      challengesCount: newStudent.digital.challengesCompletedCount
    };
    if (leadIdx !== -1) {
      dbState.leaderboard[leadIdx] = newLeader;
    } else {
      dbState.leaderboard.push(newLeader);
    }

    addedStudents.push(newStudent);
  });

  // Sort leaderboard
  dbState.leaderboard.sort((a,b) => b.xp - a.xp);

  res.json({ success: true, count: addedStudents.length, students: dbState.students });
});

// INTERVENTION ENGINE CREATION (Priority 3)
app.post("/api/interventions/create", (req, res) => {
  const { studentId, challengeId, type } = req.body;
  if (!studentId) {
    return res.status(400).json({ error: "Missing studentId parameter" });
  }

  const s = dbState.students.find(std => std.studentId === studentId);
  if (!s) return res.status(404).json({ error: "Student profile not located" });

  let challengeTitle = "Custom Continuous Performance Intervention";
  if (challengeId) {
    const ch = dbState.challenges.find(c => c.id === challengeId);
    if (ch) challengeTitle = ch.title;
  }

  const newIntervention: ActiveIntervention = {
    id: `int-${Date.now()}`,
    studentId,
    studentName: s.name,
    challengeTitle,
    status: "Active",
    assignedAt: new Date().toISOString(),
    type: type || "General Intervention",
    outcome: "Intervention initialized. Custom syllabus notes built and twin indicators calibrated."
  };

  dbState.interventions.push(newIntervention);

  // Auto-enroll key: if there is a challenge, trigger active enrollment
  if (challengeId) {
    const already = dbState.studentChallenges.find(
      sc => sc.challengeId === challengeId && sc.studentId === studentId
    );
    if (!already) {
      dbState.studentChallenges.push({
        challengeId,
        studentId,
        currentStreak: 0,
        longestStreak: 0,
        completedDays: 0,
        status: "Active",
        progressPercentage: 0,
        logs: [{ date: new Date().toISOString(), note: `Prescribed by Principal Arthur Vance as an Active Intervention.` }]
      });
    }
  }

  res.json({ success: true, intervention: newIntervention, db: dbState });
});

// INTERVENTION ENGINE RESOLUTION
app.post("/api/interventions/resolve", (req, res) => {
  const { id, outcome } = req.body;
  if (!id) return res.status(400).json({ error: "Missing id parameter" });

  const found = dbState.interventions.find(i => i.id === id);
  if (!found) return res.status(404).json({ error: "Intervention not found" });

  found.status = "Resolved";
  found.outcome = outcome || "Remediation verified; Student habits stabilized above compliance margins.";

  res.json({ success: true, intervention: found, db: dbState });
});

// VALUEWEAVE CONNECTOR TRIGGER
app.post("/api/valueweave/simulate-import", (req, res) => {
  const { insightId } = req.body;
  const intInsight = dbState.valueweaveInsights.find(v => v.id === insightId);
  if (!intInsight) {
    return res.status(404).json({ error: "ValueWeave insight not found" });
  }

  // Find students whose career interests, skills, or curriculum match keywords
  const targetTag = intInsight.recommendedActions.targetInterest.toLowerCase();
  
  let affectedCount = 0;
  dbState.students.forEach(student => {
    const careerText = student.career.careerInterests.join(" ").toLowerCase();
    const domainText = student.career.preferredDomains.join(" ").toLowerCase();
    
    if (careerText.includes(targetTag) || domainText.includes(targetTag) || student.department.toLowerCase().includes(targetTag)) {
      // 1. Recommend new Career path
      if (!student.career.careerInterests.includes(intInsight.recommendedActions.suggestedCareer)) {
        student.career.careerInterests.unshift(intInsight.recommendedActions.suggestedCareer);
      }
      // 2. Add as in-progress skill
      if (!student.career.skillsInProgress.includes(intInsight.recommendedActions.suggestedPathTitle)) {
        student.career.skillsInProgress.unshift(intInsight.recommendedActions.suggestedPathTitle);
      }
      // 3. Mark last updated activity
      student.behavioral.lastActive = new Date().toISOString();
      student.digital.contentEngagementScore = Math.min(100, student.digital.contentEngagementScore + 10);
      affectedCount++;
    }
  });

  // Automatically deploy recommended challenge into our system!
  const alreadyInCh = dbState.challenges.find(c => c.title === intInsight.recommendedActions.newChallengeTitle);
  if (!alreadyInCh) {
    dbState.challenges.unshift({
      id: `ch-vw-${Date.now()}`,
      title: intInsight.recommendedActions.newChallengeTitle,
      description: intInsight.recommendedActions.newChallengeDesc,
      category: "AI",
      durationDays: 10,
      xpValue: 400,
      badgeRewarded: {
        name: "EcoSystem Weaver",
        icon: "Globe",
        color: "emerald"
      }
    });
  }

  res.json({
    success: true,
    message: `ValueWeave Insight successfully integrated! Identified ${affectedCount} student(s) based on interest algorithms. Dynamically deployed class activities/recommendations and challenge metrics.`,
    affectedCount,
    deployedChallengeTitle: intInsight.recommendedActions.newChallengeTitle
  });
});

// ---------------- MODULE 2: AI Student Digital Twin Mirror Ask -----------------
app.post("/api/gemini/student-twin-ask", async (req, res) => {
  const { studentId, question } = req.body;
  if (!studentId || !question) {
    return res.status(404).json({ error: "Missing studentId or question" });
  }

  const student = dbState.students.find(s => s.studentId === studentId);
  if (!student) {
    return res.status(404).json({ error: "Student DNA mapping not found" });
  }

  const activeChallenges = dbState.studentChallenges.filter(sc => sc.studentId === studentId);
  const matchedChallenges = activeChallenges.map(sc => {
    const config = dbState.challenges.find(c => c.id === sc.challengeId);
    return {
      title: config?.title || "Unknown Challenge",
      status: sc.status,
      completedDays: sc.completedDays,
      durationDays: config?.durationDays
    };
  });

  try {
    const client = getGeminiClient();
    const systemPrompt = `You are MirrorMind AI, the official Student Digital Twin cognitive interface.
You act as a world-class academic advisor, counselor, coach, and predictor of student outcomes.
You are responding to a question about the following student's full 5D DNA Mapping.

STUDENT PROFILE DATA:
- Name: ${student.name}
- Department/Semester: ${student.department} / ${student.semester}
- GPA Trend: ${JSON.stringify(student.academic.gpaTrends)} (Current Cumulative: ${student.academic.currentGPA})
- Strengths: ${student.academic.strengths.join(", ")}
- Weaknesses: ${student.academic.weaknesses.join(", ")}
- Subject Marks: ${JSON.stringify(student.academic.internalMarks)}
- Assignments: ${JSON.stringify(student.academic.assignmentScores)}
- Behavioral Indicators: Attendance ${student.behavioral.attendancePercentage}%, Punctuality Score ${student.behavioral.punctualityScore}/100, Class Participation ${student.behavioral.classParticipation}/100, Discipline Incidents: ${student.behavioral.disciplineIncidents}
- Learning styles metrics: Visual ${student.learning.visual}%, Reading/Logical ${student.learning.reading}%, Practice/Somatic ${student.learning.practice}%, Collaborative/Peer ${student.learning.collaborative}%
- Career Interests: ${student.career.careerInterests.join(", ")}
- Preferred Domains: ${student.career.preferredDomains.join(", ")}
- Mastered Skills: ${student.career.skillsMastered.join(", ")}
- Skills In-Progress: ${student.career.skillsInProgress.join(", ")}
- Active Challenges Trackers: ${JSON.stringify(matchedChallenges)}
- Engagement Stats: Hours logged: ${student.digital.learningActivityHours}h, Engagement level: ${student.digital.contentEngagementScore}/100, Streak: ${student.digital.streakDays} days.

When providing your advisor analysis:
1. Always base predictions directly on their numbers (e.g., if attendance is declining or low, warn about dropout/academic risk).
2. Suggest targeted, highly actionable academic interventions.
3. Recommend career pathways matching their Career DNA.
4. Keep the response in clean Markdown with clear headings and bullet lists. Make sure the tone is academic, professional, and empathetic. Avoid fluffy intros. Address the user directly as a counselor or mentor.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: question,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    res.json({ reply: response.text || "No response received" });
  } catch (error: any) {
    console.error("Gemini digital twin prediction failed:", error);
    res.status(500).json({ error: error.message || "An error occurred with Gemini Twin interface." });
  }
});


// ---------------- MODULE 4 & 5: StudentMind Studio Generative Engine -----------------
app.post("/api/gemini/studentmind-studio/generate", async (req, res) => {
  const { sourceType, sourceName, sourceContent, studentId, customPrompt } = req.body;
  if (!sourceContent) {
    return res.status(400).json({ error: "Source content is required" });
  }

  // Attempt to personalize according to student's DNA
  let studentDnaText = "No student personalization specified. Generate general learning content.";
  let studentName = "General User";
  let prefLabel = "General Styles";

  if (studentId) {
    const student = dbState.students.find(s => s.studentId === studentId);
    if (student) {
      studentName = student.name;
      prefLabel = `Learning Style Preference: Visual ${student.learning.visual}%, Practice ${student.learning.practice}%, Reading ${student.learning.reading}%`;
      studentDnaText = `
Personalize exclusively for student "${student.name}":
- Learning Strengths: ${student.academic.strengths.join(", ")}
- Academic Weaknesses to bridge: ${student.academic.weaknesses.join(", ")}
- Learning DNA Profile style: Visual: ${student.learning.visual}%, Reading-focused: ${student.learning.reading}%, Hands-on/Practice-focused: ${student.learning.practice}%, Teamwork: ${student.learning.collaborative}%
- Targeted Careers: ${student.career.careerInterests.join(", ")}
- Current internal course issues: ${JSON.stringify(student.academic.internalMarks)}

Make sure your generated material optimizes for their dominant Learning DNA style!
- If visual score is high, ensure we outline deep visual infographics and poster copy.
- If practice score is high, ensure the quizzes are very applied and the challenge focuses on building/hacking things.
- If reading is high, expand the detail of the revision notes.
`;
    }
  }

  try {
    const client = getGeminiClient();
    
    const studioSystemPrompt = `You are the master AI generator for StudentMind Studio within MirrorMind.
Your task is to convert any educational source input (articles, transcripts, textbook notes) into an exhaustive, premium study and marketing suite.

Source Material Type: ${sourceType || "Text Content"}
Source Title/Reference: ${sourceName || "Uploaded Material"}
User Additional Guidelines: ${customPrompt || "None"}

${studentDnaText}

You MUST compile and return a properly formatted JSON response conforming to the exact schema here:
{
  "notes": {
    "summary": "Full text outline, detailing the core theses of the source",
    "keyPoints": ["Comprehensive logical point 1", "Comprehensive logical point 2", "Comprehensive logical point 3"],
    "revisionNotes": "In-depth structured revision text in markdown formatting",
    "pptSlideOutline": [
      "Slide 1: [Introduction Title] - [Core Bullet 1], [Core Bullet 2]",
      "Slide 2: [Technical Core] - [Detailed Bullet 1], [Detailed Bullet 2]",
      "Slide 3: [Practical Application] - [Implementation Bullet 1], [Implementation Bullet 2]",
      "Slide 4: [Future Scope / Real world] - [Summary Bullet 1], [Summary Bullet 2]"
    ],
    "teluguContent": "A glorious localized learning module written in a rich blend of Telugu script and English terms (bilingual Telugu-medium academic outline) translating and explaining this concept with high clarity."
  },
  "assessment": {
    "title": "Title for this assessment pack",
    "questions": [
      {
        "question": "MCQ Question text tailored to student DNA strengths or weaknesses",
        "type": "MCQ",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "Complete correct answer text matching exactly one option"
      },
      {
        "question": "Hands-on implementation or coding scenario short-question",
        "type": "Short",
        "rubricHint": "Rubric checklist or target concepts expected in answer"
      },
      {
        "question": "Critical analysis essay-length question mapping back to their targeted fields",
        "type": "Long",
        "rubricHint": "Deep design patterns or system principles to measure"
      }
    ]
  },
  "challenges": [
    {
      "title": "Daily skill or habits challenge name",
      "description": "Daily actionable routine that applies this concept practically",
      "category": "Coding",
      "xpValue": 150
    },
    {
      "title": "Interactive research challenge name",
      "description": "Explain these concepts to a classmate or write a mini-blog daily",
      "category": "Communication",
      "xpValue": 120
    }
  ],
  "marketing": {
    "instagram": "Instagram Post script with emojis, headlines, and aesthetic hashtags",
    "linkedin": "LinkedIn professional insights post detailing executive summaries",
    "blogDraft": "A short elegant blog article draft in markdown"
  },
  "video": {
    "shortsScript": "YouTube Shorts 60s script with visual cues, narrator lines, hook, and body",
    "reelScript": "Reel narrative screenplay structure including recommended overlay graphics"
  },
  "visual": {
    "verticalImageUrl": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600",
    "infographicPoints": ["Visual Infographic slide text 1", "Visual Infographic slide text 2", "Visual Infographic slide text 3"],
    "quoteText": "An inspiring, highly academic or professional quote distilled from the content",
    "posterTitle": "Aesthetic poster heading for bedroom/study board",
    "posterCategory": "E-Learning Canvas"
  }
}

Ensure your output is strictly valid JSON only. Do not wrap the JSON output in markdown block decorations (no \`\`\`json block wrappers) or trailing comments. Perform parsing checks before completing.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Generate StudentMind Suite from this text content:\n\n${sourceContent}`,
      config: {
        systemInstruction: studioSystemPrompt,
        responseMimeType: "application/json",
        temperature: 0.8
      }
    });

    let rawText = response.text || "";
    // Clean-up if model mistakenly wrapped in markdown code blocks
    if (rawText.startsWith("```json")) {
      rawText = rawText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (rawText.startsWith("```")) {
      rawText = rawText.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    const cleanPack = JSON.parse(rawText.trim());
    
    // Supplement with database identifier
    const studyPackId = `pack-${Date.now()}`;
    const completePack: GeneratedStudyPack = {
      id: studyPackId,
      studentId: studentId || "std-general",
      sourceType: sourceType || "Text Notes",
      sourceName: sourceName || "User Study Deck",
      createdAt: new Date().toISOString(),
      notes: cleanPack.notes,
      assessment: cleanPack.assessment,
      challenges: cleanPack.challenges,
      marketing: cleanPack.marketing,
      video: cleanPack.video,
      visual: cleanPack.visual
    };

    // Store in historical database
    dbState.studyPacks.unshift(completePack);

    res.json({ success: true, studyPack: completePack });
  } catch (error: any) {
    console.error("StudentMind Studio Generation Error:", error);
    res.status(500).json({ error: error.message || "An error occurred during Gemini learning materials synthesis." });
  }
});

// ---------------- MODULE 7: Lecturer Assistant AI Endpoints ---------------- -
app.post("/api/gemini/lecturer-assistant/generate", async (req, res) => {
  const { requestType, topic, departmentNotes } = req.body;
  if (!topic || !requestType) {
    return res.status(400).json({ error: "Missing type or topic description" });
  }

  try {
    const client = getGeminiClient();
    const systemInstruction = `You are a premier senior educational technologist assisting collegiate lecturers.
Generate elite documents, curricula, or quiz assessments tailored to collegiate benchmarks.
Request Type: ${requestType} (e.g. Lesson Plan, MCQs, Presentations Outline, Core Study Cheat Sheet)
Topic Target: ${topic}
Additional context: ${departmentNotes || "Standard University curriculum"}

Write in a logical, highly formatted Markdown structure. Include precise rubrics, bulleted checklists, and elegant structural tables where relevant.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Synthesize a comprehensive ${requestType} on the subject: ${topic}`,
      config: {
        systemInstruction,
        temperature: 0.75
      }
    });

    res.json({ success: true, content: response.text || "No response generated." });
  } catch (error: any) {
    console.error("Lecturer assistant synthesis failed:", error);
    res.status(500).json({ error: error.message || "Could not synthesize educator blueprints." });
  }
});

// ---------------- MODULE 12: Future Self Simulator Endpoint ---------------- -
app.post("/api/gemini/student-twin-simulate", async (req, res) => {
  const { studentId, targetAttendance, completedChallenges, studyHours } = req.body;
  if (!studentId) {
    return res.status(400).json({ error: "Missing studentId parameter" });
  }

  const student = dbState.students.find(s => s.studentId === studentId);
  if (!student) {
    return res.status(404).json({ error: "Student DNA mapping not found" });
  }

  try {
    const client = getGeminiClient();
    const systemPrompt = `You are MirrorMind AI, the Student Digital Twin Future Self Simulator.
Your role is to simulate the evolutionary timeline of the student's DNA and predict educational outcomes when key variables are updated.
The user wants to simulate a hypothetical future self for '${student.name}' with the following commitments:
- Simulated Class Attendance from current ${student.behavioral.attendancePercentage}% to simulated ${targetAttendance}%
- Total Coding Challenges Completed: ${completedChallenges} tasks
- Dedicated Self-Study Engagement: ${studyHours} hours/week

STUDENT PROFILE BASELINE:
- Current Cumulative GPA: ${student.academic.currentGPA}
- Department: ${student.department}
- Career Interests: ${student.career.careerInterests.join(", ")}
- Preferred Domains: ${student.career.preferredDomains.join(", ")}
- Current Skills Mastered: ${student.career.skillsMastered.join(", ")}
- Current Skills In-Progress: ${student.career.skillsInProgress.join(", ")}

Generate a highly specific JSON response (valid JSON, no backtick wrap) predicting:
1. gpa: Predicted new GPA (between 0.0 and 4.0, keep logically calibrated with baseline)
2. employability: Predicted Employability Score (0 to 100)
3. readiness: Career Readiness score (0 to 100)
4. narrative: A direct, empowering prediction narrative from the voice of the Digital Twin themselves ("Hello from your Future Self! By implementing these habits, our timeline shifted..."). Outline specific details of how this attendance spark reduces risks, improves corporate placement likelihood, and unlocks specific high-paying domains. Use clean markdown formatting.

Conformance JSON Schema:
{
  "gpa": number,
  "employability": number,
  "readiness": number,
  "narrative": "markdown string"
}`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Perform simulation for target variables: Attendance ${targetAttendance}%, Challenges ${completedChallenges}, Study engagement ${studyHours} h/week.`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.75
      }
    });

    let rawText = response.text || "";
    if (rawText.startsWith("```json")) {
      rawText = rawText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (rawText.startsWith("```")) {
      rawText = rawText.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    const payload = JSON.parse(rawText.trim());
    res.json({ success: true, prediction: payload });
  } catch (error: any) {
    console.error("Future Self Simulation failed:", error);
    // Graceful fallback with analytical calculation in case of key limits
    const currentGpa = student.academic.currentGPA;
    const attMultiplier = Number(targetAttendance) / 100;
    const computedGpa = Math.min(4.0, Math.round((currentGpa + (attMultiplier * 0.4) + (Number(completedChallenges) * 0.01)) * 100) / 100);
    const computedEmp = Math.min(100, Math.round(65 + (Number(completedChallenges) * 1.5) + (Number(studyHours) * 0.8)));
    const computedRead = Math.min(100, Math.round(55 + (Number(targetAttendance) * 0.3) + (Number(completedChallenges) * 1.2)));
    
    res.json({
      success: true,
      prediction: {
        gpa: computedGpa,
        employability: computedEmp,
        readiness: computedRead,
        narrative: `### 🔮 Future Self Projections (Bespoke Analytical Model)\n\nHello, ${student.name}! By adjusting your Attendance parameter to **${targetAttendance}%**, executing **${completedChallenges} coding challenges**, and focusing **${studyHours} hours/week** on self-directed study, we estimate your simulated metrics as follows:\n\n* **Academic Track:** Predicted GPA moves from **${currentGpa}** to **${computedGpa}** due to enhanced class session retention.\n* **Placement Mastery:** Employability score surges to **${computedEmp}%** with **${completedChallenges} finished portfolio tasks** proving hands-on competence to tech recruiters!\n* **Career Readiness Scale:** Unlocks structural milestones at **${computedRead}%**, bridging core knowledge gaps in network security and compiler frameworks.`
      }
    });
  }
});


// ------------------- PRODUCTION VS DEV ENVIRONMENT ROUTING -------------------
// (Handles both local server execution and static web bundles inside /dist)

async function startPlatform() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Start Server
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MirrorMind back-end is online at http://localhost:${PORT}`);
  });
}

startPlatform().catch((err) => {
  console.error("Failed to start MirrorMind express backend platform:", err);
});
