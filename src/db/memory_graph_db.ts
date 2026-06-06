import fs from "fs";
import path from "path";
import crypto from "crypto";
import { StudentDNAProfile } from "../types";

// Define the absolute path for persistent storage
const DB_FILE_PATH = path.join(process.cwd(), "memory_graph_database.json");

// ------------------- SECURITY & CRYPTO HELPERS -------------------
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function comparePassword(password: string, storedHash: string): boolean {
  try {
    const [salt, hash] = storedHash.split(":");
    const computedHash = crypto.scryptSync(password, salt, 64).toString("hex");
    return hash === computedHash;
  } catch (err) {
    return false;
  }
}

// ------------------- RELATIONAL SCHEMAS (THE 10 TABLES + AUTH SCHEMAS) -------------------

// Auth Schema 1: Users Table
export interface UserRecord {
  userId: string;
  email: string;
  passwordHash: string;
  avatarUrl: string;
  createdAt: string;
  lastLogin: string;
  authProvider: "local" | "google";
  status: "Active" | "Pending" | "Disabled";
}

// Auth Schema 2: Student Profiles Table
export interface StudentProfileRecord {
  profileId: string;
  userId: string;
  fullName: string;
  college: string;
  course: string;
  branch: string;
  semester: string;
  careerGoal: string;
  currentIdentity: string;
  futureIdentity: string;
  mirrorMindId: string; // e.g., MM-2026-000124
  twinCreatedDate: string;
}

// Auth Schema 3: User Sessions Table
export interface UserSessionRecord {
  sessionId: string;
  userId: string;
  token: string;
  expiresAt: string;
  deviceInfo: string;
  ipAddress: string;
}

// 1. Students table (using official detailed multi-dimensional DNA type directly)
export type StudentRecord = StudentDNAProfile;

// 2. TwinMemories table
export interface TwinMemoryRecord {
  id: string; // primary key
  studentId: string; // foreign key -> Students.studentId
  topic: string;
  text: string;
  date: string;
  type: "automatic" | "manual" | "journal";
}

// 3. Conversations table
export interface ConversationRecord {
  id: string; // primary key
  studentId: string; // foreign key -> Students.studentId
  query: string;
  reply: string;
  timestamp: string; // ISO date-time
}

// 4. LifeMissions table
export interface LifeMissionRecord {
  id: string; // primary key
  studentId: string; // foreign key -> Students.studentId
  missionTemplateId: string; // e.g. "code-architect", "tgpsc-civil"
  name: string;
  category: string;
  targetIdentity: string;
  description: string;
  estimatedCompletion: string;
  gradient: string;
  accentColor: string;
  status: "Active" | "Completed";
  createdAt: string;
}

// 5. MissionMilestones table
export interface MissionMilestoneRecord {
  id: string; // primary key
  studentId: string; // foreign key -> Students.studentId
  missionId: string; // foreign key -> LifeMissions.id
  milestoneText: string;
  isCompleted: boolean;
  completedAt?: string;
}

// 6. DNASnapshots table
export interface DNASnapshotRecord {
  id: string; // primary key
  studentId: string; // foreign key -> Students.studentId
  timestamp: string; // ISO date-time
  currentGPA: number;
  attendancePercentage: number;
  punctualityScore: number;
  classParticipation: number;
  learningStyleVisual: number;
  learningStyleReading: number;
  learningStylePractice: number;
  learningStyleCollaborative: number;
}

// 7. Reflections table
export interface ReflectionRecord {
  id: string; // primary key
  studentId: string; // foreign key -> Students.studentId
  conceptLearned: string;
  analysis: string; // Digital Twin feedback
  timestamp: string; // ISO date-time
}

// 8. Achievements table
export interface AchievementRecord {
  id: string; // primary key
  studentId: string; // foreign key -> Students.studentId
  name: string;
  description: string;
  icon: string;
  color: string;
  unlockedAt: string; // ISO date-time
}

// 9. CareerInterests table
export interface CareerInterestRecord {
  id: string; // primary key
  studentId: string; // foreign key -> Students.studentId
  interestName: string;
  isPreferred: boolean;
}

// 10. ChallengeHistory table
export interface ChallengeHistoryRecord {
  id: string; // primary key
  studentId: string; // foreign key -> Students.studentId
  challengeId: string;
  currentStreak: number;
  longestStreak: number;
  completedDays: number;
  status: "Active" | "Completed" | "Failed";
  progressPercentage: number;
  enrolledAt: string;
}

// Global Memory Graph Database layout
export interface StudentMemoryGraphDB {
  students: StudentRecord[];
  twinMemories: TwinMemoryRecord[];
  conversations: ConversationRecord[];
  lifeMissions: LifeMissionRecord[];
  missionMilestones: MissionMilestoneRecord[];
  dnaSnapshots: DNASnapshotRecord[];
  reflections: ReflectionRecord[];
  achievements: AchievementRecord[];
  careerInterests: CareerInterestRecord[];
  challengeHistory: ChallengeHistoryRecord[];
  // New auth tables
  users?: UserRecord[];
  studentProfiles?: StudentProfileRecord[];
  userSessions?: UserSessionRecord[];
  resetPasswordTokens?: { email: string; token: string; expiresAt: string }[];
}

// ------------------- INITIAL SEEDS VALUES -------------------

const seedStudents: StudentRecord[] = [
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
      attendancePercentage: 78.5,
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
      classParticipation: 60,
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

// Initial Twin Memories
const initialTwinMemories: TwinMemoryRecord[] = [
  {
    id: "tm-1",
    studentId: "std-maya-patel",
    topic: "Target Goal",
    text: "Set career sights on becoming a highly paid Specialist developer. Mapped interests in AI Scientist and Machine Learning Engineer.",
    date: "3 weeks ago",
    type: "automatic"
  },
  {
    id: "tm-2",
    studentId: "std-maya-patel",
    topic: "Strength Profile",
    text: "Mastered standard React UI widgets, showing top-tier performance in visual-somatic learning approaches.",
    date: "1 week ago",
    type: "automatic"
  },
  {
    id: "tm-3",
    studentId: "std-maya-patel",
    topic: "Deducted Bottleneck",
    text: "Identified attendance dropout risk at 78.5%. Digital Twin triggered simulated counseling alerts.",
    date: "2 days ago",
    type: "automatic"
  },
  {
    id: "tm-4",
    studentId: "std-leo-carter",
    topic: "Target Goal",
    text: "Targeting placement in premium Software Engineering firms with high technical design standards.",
    date: "2 weeks ago",
    type: "automatic"
  },
  {
    id: "tm-5",
    studentId: "std-alex-wong",
    topic: "Core focus",
    text: "Excelling in hardware, targeting high performance micro-controller optimizations.",
    date: "4 weeks ago",
    type: "automatic"
  }
];

// Seed Career Interests
const initialCareerInterests: CareerInterestRecord[] = [
  { id: "ci-1", studentId: "std-maya-patel", interestName: "AI Scientist", isPreferred: true },
  { id: "ci-2", studentId: "std-maya-patel", interestName: "Machine Learning Engineer", isPreferred: true },
  { id: "ci-3", studentId: "std-maya-patel", interestName: "Scientific Research", isPreferred: false },
  { id: "ci-4", studentId: "std-leo-carter", interestName: "Software Engineering", isPreferred: true },
  { id: "ci-5", studentId: "std-leo-carter", interestName: "Web UX Design", isPreferred: true },
  { id: "ci-6", studentId: "std-alex-wong", interestName: "Robotics Core Eng", isPreferred: true }
];

// Seed Challenge History
const initialChallengeHistory: ChallengeHistoryRecord[] = [
  {
    id: "ch-1",
    studentId: "std-maya-patel",
    challengeId: "ch-detox-1",
    currentStreak: 4,
    longestStreak: 4,
    completedDays: 4,
    status: "Active",
    progressPercentage: 57,
    enrolledAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "ch-2",
    studentId: "std-maya-patel",
    challengeId: "ch-coding-1",
    currentStreak: 2,
    longestStreak: 2,
    completedDays: 2,
    status: "Active",
    progressPercentage: 28,
    enrolledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "ch-3",
    studentId: "std-leo-carter",
    challengeId: "ch-detox-1",
    currentStreak: 12,
    longestStreak: 12,
    completedDays: 12,
    status: "Active",
    progressPercentage: 40,
    enrolledAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Default Life Missions Template
const MISSION_TEMPLATES = [
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
  }
];

// Initial Conversations
const initialConversations: ConversationRecord[] = [
  {
    id: "con-1",
    studentId: "std-maya-patel",
    query: "Explain my attendance warning and suggest steps.",
    reply: "Your attendance stands at 78.5%, triggering a critical warning. To recover: 1) Register for the 'Zero-Absentee Academic Streak' challenge. 2) Enable Morning Focus Sync in your Twin rituals. This stabilizes placement prediction models by 14%.",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Initial DNA Snapshots (traces history over weeks to gauge trends)
const initialDNASnapshots: DNASnapshotRecord[] = [
  {
    id: "snap-maya-w1",
    studentId: "std-maya-patel",
    timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    currentGPA: 3.32,
    attendancePercentage: 81.2,
    punctualityScore: 75,
    classParticipation: 82,
    learningStyleVisual: 75,
    learningStyleReading: 45,
    learningStylePractice: 85,
    learningStyleCollaborative: 55
  },
  {
    id: "snap-maya-w2",
    studentId: "std-maya-patel",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    currentGPA: 3.29,
    attendancePercentage: 79.8,
    punctualityScore: 70,
    classParticipation: 84,
    learningStyleVisual: 75,
    learningStyleReading: 45,
    learningStylePractice: 85,
    learningStyleCollaborative: 55
  }
];

// Initial Reflections
const initialReflections: ReflectionRecord[] = [
  {
    id: "ref-1",
    studentId: "std-maya-patel",
    conceptLearned: "Relational database indexing and B-Tree balancing speeds.",
    analysis: "Excellent cognitive log. Database balancing represents standard Computer Science requirements. Verified core concept mastery. (+150 XP)",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Initial Achievements
const initialAchievements: AchievementRecord[] = [
  {
    id: "ac-1",
    studentId: "std-maya-patel",
    name: "Quantitative Wizard",
    description: "Completed advanced quantitative aptitude modules in the arena.",
    icon: "Award",
    color: "amber",
    unlockedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "ac-2",
    studentId: "std-maya-patel",
    name: "Attendance Guard",
    description: "Maintained baseline attendance stabilization trend score.",
    icon: "CheckCircle2",
    color: "emerald",
    unlockedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Helper to seed a newly created or reloaded database
function createDefaultDatabase(): StudentMemoryGraphDB {
  const db: StudentMemoryGraphDB = {
    students: seedStudents,
    twinMemories: initialTwinMemories,
    conversations: initialConversations,
    lifeMissions: [],
    missionMilestones: [],
    dnaSnapshots: initialDNASnapshots,
    reflections: initialReflections,
    achievements: initialAchievements,
    careerInterests: initialCareerInterests,
    challengeHistory: initialChallengeHistory,
    users: [],
    studentProfiles: [],
    userSessions: [],
    resetPasswordTokens: []
  };

  const defaultPasswordHash = hashPassword("Password123");

  seedStudents.forEach((student, idx) => {
    db.users!.push({
      userId: student.studentId,
      email: student.email,
      passwordHash: defaultPasswordHash,
      avatarUrl: student.avatarUrl,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      authProvider: "local",
      status: "Active"
    });

    db.studentProfiles!.push({
      profileId: `prof-${student.studentId}`,
      userId: student.studentId,
      fullName: student.name,
      college: "MirrorMind Institute of AI & Technology",
      course: "Bachelor of Technology (B.Tech)",
      branch: student.department,
      semester: student.semester,
      careerGoal: student.career.careerInterests[0] || "AI Engineer",
      currentIdentity: "Committed Engineering Student",
      futureIdentity: student.career.preferredDomains[0] || "AI Researcher",
      mirrorMindId: `MM-2026-000${101 + idx}`,
      twinCreatedDate: new Date(Date.now() - 112 * 24 * 60 * 60 * 1000).toISOString() // 112 Days ago
    });
  });

  // Build active missions and milestones for all seed students
  seedStudents.forEach(student => {
    // default to software engineer mission for all
    const template = MISSION_TEMPLATES[0];
    const missionId = `mis-${student.studentId}-${template.id}`;
    
    db.lifeMissions.push({
      id: missionId,
      studentId: student.studentId,
      missionTemplateId: template.id,
      name: template.name,
      category: template.category,
      targetIdentity: template.targetIdentity,
      description: template.description,
      estimatedCompletion: template.estimatedCompletion,
      gradient: template.gradient,
      accentColor: template.accentColor,
      status: "Active",
      createdAt: new Date().toISOString()
    });

    // Populate default milestones as uncompleted
    template.milestones.forEach((milestoneText, idx) => {
      db.missionMilestones.push({
        id: `ms-${student.studentId}-${template.id}-${idx}`,
        studentId: student.studentId,
        missionId: missionId,
        milestoneText: milestoneText,
        isCompleted: idx === 0 // Mark first milestone completed as default progress
      });
    });
  });

  return db;
}

// ------------------- FILE DATABASE INTERRUPT HOOKS -------------------

let cachedDB: StudentMemoryGraphDB | null = null;

export function loadMemoryDatabase(): StudentMemoryGraphDB {
  if (cachedDB) return cachedDB;

  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const fileContent = fs.readFileSync(DB_FILE_PATH, "utf-8");
      cachedDB = JSON.parse(fileContent);
      return cachedDB!;
    }
  } catch (error) {
    console.error("Failed to read memory_graph_database.json, falling back to defaults", error);
  }

  // Create & save first-time seeds
  cachedDB = createDefaultDatabase();
  saveMemoryDatabase(cachedDB);
  return cachedDB;
}

export function saveMemoryDatabase(db: StudentMemoryGraphDB): void {
  try {
    cachedDB = db;
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(db, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to write to memory_graph_database.json", error);
  }
}

// ------------------- CONTROLLERS & DATA LOGGING LOGIC -------------------

// Core identity state representation for a single student, synced to UI
export interface StudentSyncState {
  relationshipScore: number;
  activeMissionId: string;
  milestones: Record<string, boolean>;
  memories: TwinMemoryRecord[];
  conversations: ConversationRecord[];
  reflections: ReflectionRecord[];
  achievements: AchievementRecord[];
  rituals: {
    morning: boolean;
    midday: boolean;
    evening: boolean;
  };
}

// Get or initialize state for a student
export function getOrCreateStudentState(studentId: string): StudentSyncState {
  const db = loadMemoryDatabase();
  
  // Find current student active mission
  let activeMission = db.lifeMissions.find(lm => lm.studentId === studentId && lm.status === "Active");
  if (!activeMission) {
    // Create default Soft Eng mission if missing
    const template = MISSION_TEMPLATES[0];
    const missionId = `mis-${studentId}-${template.id}`;
    activeMission = {
      id: missionId,
      studentId: studentId,
      missionTemplateId: template.id,
      name: template.name,
      category: template.category,
      targetIdentity: template.targetIdentity,
      description: template.description,
      estimatedCompletion: template.estimatedCompletion,
      gradient: template.gradient,
      accentColor: template.accentColor,
      status: "Active",
      createdAt: new Date().toISOString()
    };
    db.lifeMissions.push(activeMission);
    
    // Add default milestones
    template.milestones.forEach((milestoneText, idx) => {
      db.missionMilestones.push({
        id: `ms-${studentId}-${template.id}-${idx}`,
        studentId: studentId,
        missionId: missionId,
        milestoneText: milestoneText,
        isCompleted: false
      });
    });
    saveMemoryDatabase(db);
  }

  // Build milestones status map
  const milestones: Record<string, boolean> = {};
  const missionMilestonesList = db.missionMilestones.filter(ms => ms.studentId === studentId && ms.missionId === activeMission!.id);
  missionMilestonesList.forEach(m => {
    milestones[`${activeMission!.missionTemplateId}_${m.milestoneText}`] = m.isCompleted;
  });

  // Calculate relationship dynamic score
  // Baseline 68, +5 for each completed milestone, +4 for each daily checkin
  const completedMilestonesCount = missionMilestonesList.filter(m => m.isCompleted).length;
  
  // Fetch memories
  const memoriesList = db.twinMemories.filter(m => m.studentId === studentId);
  const conversationsList = db.conversations.filter(c => c.studentId === studentId);
  const reflectionsList = db.reflections.filter(r => r.studentId === studentId);
  const achievementsList = db.achievements.filter(a => a.studentId === studentId);

  // Determine rituals completed today (look up evening journal reflections & manual checkins)
  const morningCheck = memoriesList.some(m => m.topic === "Morning Goal Sync" && m.date === "Today");
  const middayCheck = memoriesList.some(m => m.topic === "Midday Progress Sync" && m.date === "Today");
  const eveningCheck = reflectionsList.some(r => {
    const todayStr = new Date().toDateString();
    return new Date(r.timestamp).toDateString() === todayStr;
  });

  const checkinsCount = (morningCheck ? 1 : 0) + (middayCheck ? 1 : 0) + (eveningCheck ? 1 : 0);
  const relationshipScore = Math.min(100, 68 + completedMilestonesCount * 5 + checkinsCount * 4 + (memoriesList.length - 3) * 3);

  return {
    relationshipScore,
    activeMissionId: activeMission.missionTemplateId,
    milestones,
    memories: memoriesList,
    conversations: conversationsList,
    reflections: reflectionsList,
    achievements: achievementsList,
    rituals: {
      morning: morningCheck,
      midday: middayCheck,
      evening: eveningCheck
    }
  };
}

// Add memory
export function addStudentMemory(studentId: string, topic: string, text: string, type: "automatic" | "manual" | "journal"): TwinMemoryRecord {
  const db = loadMemoryDatabase();
  const id = `tm-${Date.now()}`;
  const newMemory: TwinMemoryRecord = {
    id,
    studentId,
    topic,
    text,
    date: "Today",
    type
  };
  db.twinMemories.unshift(newMemory);
  saveMemoryDatabase(db);
  return newMemory;
}

// Toggle milestone
export function toggleStudentMilestone(studentId: string, templateId: string, milestoneText: string): boolean {
  const db = loadMemoryDatabase();
  
  // Find current active mission
  const activeMission = db.lifeMissions.find(lm => lm.studentId === studentId && lm.missionTemplateId === templateId && lm.status === "Active");
  if (!activeMission) return false;

  // Find or create milestone record
  let msRecord = db.missionMilestones.find(ms => ms.studentId === studentId && ms.missionId === activeMission.id && ms.milestoneText === milestoneText);
  if (!msRecord) {
    msRecord = {
      id: `ms-${studentId}-${templateId}-${Date.now()}`,
      studentId,
      missionId: activeMission.id,
      milestoneText,
      isCompleted: false
    };
    db.missionMilestones.push(msRecord);
  }

  // Toggle
  msRecord.isCompleted = !msRecord.isCompleted;
  msRecord.completedAt = msRecord.isCompleted ? new Date().toISOString() : undefined;

  // If milestone completed, also increment Student XP & Level as an Achievement trigger
  if (msRecord.isCompleted) {
    const student = db.students.find(s => s.studentId === studentId);
    if (student) {
      student.digital.challengesCompletedCount += 1;
      // Boost status statistics
      student.digital.contentEngagementScore = Math.min(100, student.digital.contentEngagementScore + 5);
    }
  }

  saveMemoryDatabase(db);
  return msRecord.isCompleted;
}

// Select new mission
export function selectStudentMission(studentId: string, templateId: string): void {
  const db = loadMemoryDatabase();
  
  // Deactivate existing missions for student
  db.lifeMissions.forEach(lm => {
    if (lm.studentId === studentId) {
      lm.status = "Completed"; // archive old ones
    }
  });

  // Check if we have this mission template
  const template = MISSION_TEMPLATES.find(t => t.id === templateId) || MISSION_TEMPLATES[0];
  const missionId = `mis-${studentId}-${template.id}-${Date.now()}`;
  
  // Create active mission record
  db.lifeMissions.push({
    id: missionId,
    studentId,
    missionTemplateId: template.id,
    name: template.name,
    category: template.category,
    targetIdentity: template.targetIdentity,
    description: template.description,
    estimatedCompletion: template.estimatedCompletion,
    gradient: template.gradient,
    accentColor: template.accentColor,
    status: "Active",
    createdAt: new Date().toISOString()
  });

  // Populate new milestones
  template.milestones.forEach((milestoneText, idx) => {
    db.missionMilestones.push({
      id: `ms-${studentId}-${template.id}-${idx}-${Date.now()}`,
      studentId,
      missionId,
      milestoneText,
      isCompleted: false
    });
  });

  saveMemoryDatabase(db);
}

// Complete daily ritual checkin
export function checkInDailyRitual(studentId: string, period: "morning" | "midday"): TwinMemoryRecord {
  const topic = period === "morning" ? "Morning Goal Sync" : "Midday Progress Sync";
  const text = period === "morning" 
    ? "Synchronized morning study schedule and class prep routines with AI Digital Twin."
    : "Logged class room attendance tracker and resolved behavioral stability index anomalies.";
  
  return addStudentMemory(studentId, topic, text, "manual");
}

// Create evening reflection
export function submitEveningReflection(studentId: string, conceptLearned: string, analysis: string): ReflectionRecord {
  const db = loadMemoryDatabase();
  const id = `ref-${Date.now()}`;
  const newReflection: ReflectionRecord = {
    id,
    studentId,
    conceptLearned,
    analysis,
    timestamp: new Date().toISOString()
  };
  db.reflections.unshift(newReflection);

  // Upgrade student XP and stats
  const student = db.students.find(s => s.studentId === studentId);
  if (student) {
    student.digital.streakDays += 1;
    student.digital.learningActivityHours += 1;
  }

  saveMemoryDatabase(db);
  return newReflection;
}

// Log conversation message exchange (Socratic Dialogue)
export function logConversation(studentId: string, query: string, reply: string): ConversationRecord {
  const db = loadMemoryDatabase();
  const id = `con-${Date.now()}`;
  const record: ConversationRecord = {
    id,
    studentId,
    query,
    reply,
    timestamp: new Date().toISOString()
  };
  db.conversations.push(record);
  saveMemoryDatabase(db);
  return record;
}

// Reset student Memory state
export function resetStudentMemoryState(studentId: string): void {
  const db = loadMemoryDatabase();
  
  // Wipe records for this student
  db.twinMemories = db.twinMemories.filter(m => m.studentId !== studentId);
  db.conversations = db.conversations.filter(c => c.studentId !== studentId);
  db.lifeMissions = db.lifeMissions.filter(lm => lm.studentId !== studentId);
  db.missionMilestones = db.missionMilestones.filter(ms => ms.studentId !== studentId);
  db.reflections = db.reflections.filter(r => r.studentId !== studentId);
  db.achievements = db.achievements.filter(a => a.studentId !== studentId);
  
  // Re-seed original memories
  const defaultSeeds = initialTwinMemories.filter(m => m.studentId === studentId);
  if (defaultSeeds.length > 0) {
    db.twinMemories.push(...defaultSeeds);
  } else {
    db.twinMemories.push({
      id: `tm-${Date.now()}`,
      studentId,
      topic: "Target Goal",
      text: "Initialized new Twin memory graph framework.",
      date: "Today",
      type: "automatic"
    });
  }

  // Restore active mission
  const template = MISSION_TEMPLATES[0];
  const missionId = `mis-${studentId}-${template.id}`;
  db.lifeMissions.push({
    id: missionId,
    studentId,
    missionTemplateId: template.id,
    name: template.name,
    category: template.category,
    targetIdentity: template.targetIdentity,
    description: template.description,
    estimatedCompletion: template.estimatedCompletion,
    gradient: template.gradient,
    accentColor: template.accentColor,
    status: "Active",
    createdAt: new Date().toISOString()
  });

  template.milestones.forEach((m, idx) => {
    db.missionMilestones.push({
      id: `ms-${studentId}-${template.id}-${idx}`,
      studentId,
      missionId,
      milestoneText: m,
      isCompleted: idx === 0
    });
  });

  // Reset student stats
  const student = db.students.find(s => s.studentId === studentId);
  if (student) {
    const seed = seedStudents.find(s => s.studentId === studentId);
    if (seed) {
      student.digital.streakDays = seed.digital.streakDays;
      student.digital.learningActivityHours = seed.digital.learningActivityHours;
      student.digital.challengesCompletedCount = seed.digital.challengesCompletedCount;
    }
  }

  saveMemoryDatabase(db);
}

// ------------------- REPOSITORY PATTERN ABSTRACTION (PART 10) -------------------

export interface IUserRepository {
  findByEmail(email: string): UserRecord | null;
  findById(userId: string): UserRecord | null;
  createUser(user: Omit<UserRecord, "userId" | "createdAt" | "status">): UserRecord;
  createStudentProfile(profile: Omit<StudentProfileRecord, "profileId" | "twinCreatedDate">): StudentProfileRecord;
  getStudentProfile(userId: string): StudentProfileRecord | null;
  createSession(userId: string, deviceInfo: string, ipAddress: string): UserSessionRecord;
  validateSession(token: string): UserSessionRecord | null;
  deleteSession(token: string): void;
  updateLastLogin(userId: string): void;
  createResetToken(email: string): string | null;
  validateResetToken(email: string, token: string): boolean;
  resetPassword(email: string, newHash: string): boolean;
}

export interface IMemoryRepository {
  getMemories(studentId: string): TwinMemoryRecord[];
  addMemory(studentId: string, topic: string, text: string, type: TwinMemoryRecord["type"]): TwinMemoryRecord;
  getReflections(studentId: string): ReflectionRecord[];
  addReflection(studentId: string, conceptLearned: string, analysis: string): ReflectionRecord;
  getAchievements(studentId: string): AchievementRecord[];
  addAchievement(studentId: string, name: string, description: string, icon: string, color: string): AchievementRecord;
  getDNASnapshots(studentId: string): DNASnapshotRecord[];
}

export interface IConversationRepository {
  getConversations(studentId: string): ConversationRecord[];
  logConversation(studentId: string, query: string, reply: string): ConversationRecord;
}

export interface IMissionRepository {
  getActiveMission(studentId: string): LifeMissionRecord | null;
  selectMission(studentId: string, templateId: string): void;
  toggleMilestone(studentId: string, templateId: string, milestoneText: string): boolean;
  getMilestones(studentId: string, missionId: string): MissionMilestoneRecord[];
}

// Concrete repository using persistent JSON memory_graph_database
export class UserRepository implements IUserRepository {
  findByEmail(email: string): UserRecord | null {
    const db = loadMemoryDatabase();
    if (!db.users) db.users = [];
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  findById(userId: string): UserRecord | null {
    const db = loadMemoryDatabase();
    if (!db.users) db.users = [];
    return db.users.find(u => u.userId === userId) || null;
  }

  createUser(user: Omit<UserRecord, "userId" | "createdAt" | "status">): UserRecord {
    const db = loadMemoryDatabase();
    if (!db.users) db.users = [];
    const newRecord: UserRecord = {
      ...user,
      userId: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      status: "Active"
    };
    db.users.push(newRecord);
    saveMemoryDatabase(db);
    return newRecord;
  }

  createStudentProfile(profile: Omit<StudentProfileRecord, "profileId" | "twinCreatedDate">): StudentProfileRecord {
    const db = loadMemoryDatabase();
    if (!db.studentProfiles) db.studentProfiles = [];
    
    // Auto-generate MirrorMind ID
    const year = new Date().getFullYear();
    const count = (db.studentProfiles.length + 124).toString().padStart(6, "0");
    const mirrorMindId = `MM-${year}-${count}`;

    const newRecord: StudentProfileRecord = {
      ...profile,
      profileId: `prof-${Date.now()}`,
      mirrorMindId,
      twinCreatedDate: new Date().toISOString()
    };
    db.studentProfiles.push(newRecord);
    saveMemoryDatabase(db);
    return newRecord;
  }

  getStudentProfile(userId: string): StudentProfileRecord | null {
    const db = loadMemoryDatabase();
    if (!db.studentProfiles) db.studentProfiles = [];
    return db.studentProfiles.find(p => p.userId === userId) || null;
  }

  createSession(userId: string, deviceInfo: string, ipAddress: string): UserSessionRecord {
    const db = loadMemoryDatabase();
    if (!db.userSessions) db.userSessions = [];
    
    const token = crypto.randomBytes(32).toString("hex");
    const newSession: UserSessionRecord = {
      sessionId: `sess-${Date.now()}`,
      userId,
      token,
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days expiration
      deviceInfo,
      ipAddress
    };
    db.userSessions.push(newSession);
    saveMemoryDatabase(db);
    return newSession;
  }

  validateSession(token: string): UserSessionRecord | null {
    const db = loadMemoryDatabase();
    if (!db.userSessions) return null;
    const session = db.userSessions.find(s => s.token === token);
    if (!session) return null;
    
    if (new Date(session.expiresAt) < new Date()) {
      // Session expired, remove it
      db.userSessions = db.userSessions.filter(s => s.token !== token);
      saveMemoryDatabase(db);
      return null;
    }
    return session;
  }

  deleteSession(token: string): void {
    const db = loadMemoryDatabase();
    if (!db.userSessions) return;
    db.userSessions = db.userSessions.filter(s => s.token !== token);
    saveMemoryDatabase(db);
  }

  updateLastLogin(userId: string): void {
    const db = loadMemoryDatabase();
    if (!db.users) return;
    const user = db.users.find(u => u.userId === userId);
    if (user) {
      user.lastLogin = new Date().toISOString();
      saveMemoryDatabase(db);
    }
  }

  createResetToken(email: string): string | null {
    const db = loadMemoryDatabase();
    if (!db.resetPasswordTokens) db.resetPasswordTokens = [];
    
    const user = this.findByEmail(email);
    if (!user) return null;

    const token = crypto.randomBytes(16).toString("hex");
    // Expire token in 1 hour
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    
    db.resetPasswordTokens.push({ email, token, expiresAt });
    saveMemoryDatabase(db);
    return token;
  }

  validateResetToken(email: string, token: string): boolean {
    const db = loadMemoryDatabase();
    if (!db.resetPasswordTokens) return false;
    const index = db.resetPasswordTokens.findIndex(
      t => t.email.toLowerCase() === email.toLowerCase() && t.token === token
    );
    if (index === -1) return false;

    const tok = db.resetPasswordTokens[index];
    if (new Date(tok.expiresAt) < new Date()) {
      // Expired token
      db.resetPasswordTokens.splice(index, 1);
      saveMemoryDatabase(db);
      return false;
    }
    return true;
  }

  resetPassword(email: string, newHash: string): boolean {
    const db = loadMemoryDatabase();
    if (!db.users) return false;
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      user.passwordHash = newHash;
      // Clean up passwords tokens too
      if (db.resetPasswordTokens) {
        db.resetPasswordTokens = db.resetPasswordTokens.filter(t => t.email.toLowerCase() !== email.toLowerCase());
      }
      saveMemoryDatabase(db);
      return true;
    }
    return false;
  }
}

export class MemoryRepository implements IMemoryRepository {
  getMemories(studentId: string): TwinMemoryRecord[] {
    const db = loadMemoryDatabase();
    return db.twinMemories.filter(m => m.studentId === studentId);
  }

  addMemory(studentId: string, topic: string, text: string, type: TwinMemoryRecord["type"]): TwinMemoryRecord {
    return addStudentMemory(studentId, topic, text, type);
  }

  getReflections(studentId: string): ReflectionRecord[] {
    const db = loadMemoryDatabase();
    return db.reflections.filter(r => r.studentId === studentId);
  }

  addReflection(studentId: string, conceptLearned: string, analysis: string): ReflectionRecord {
    return submitEveningReflection(studentId, conceptLearned, analysis);
  }

  getAchievements(studentId: string): AchievementRecord[] {
    const db = loadMemoryDatabase();
    return db.achievements.filter(a => a.studentId === studentId);
  }

  addAchievement(studentId: string, name: string, description: string, icon: string, color: string): AchievementRecord {
    const db = loadMemoryDatabase();
    const newAchievement: AchievementRecord = {
      id: `ac-${Date.now()}`,
      studentId,
      name,
      description,
      icon,
      color,
      unlockedAt: new Date().toISOString()
    };
    db.achievements.unshift(newAchievement);
    saveMemoryDatabase(db);
    return newAchievement;
  }

  getDNASnapshots(studentId: string): DNASnapshotRecord[] {
    const db = loadMemoryDatabase();
    return db.dnaSnapshots.filter(s => s.studentId === studentId);
  }
}

export class ConversationRepository implements IConversationRepository {
  getConversations(studentId: string): ConversationRecord[] {
    const db = loadMemoryDatabase();
    return db.conversations.filter(c => c.studentId === studentId);
  }

  logConversation(studentId: string, query: string, reply: string): ConversationRecord {
    return logConversation(studentId, query, reply);
  }
}

export class MissionRepository implements IMissionRepository {
  getActiveMission(studentId: string): LifeMissionRecord | null {
    const db = loadMemoryDatabase();
    return db.lifeMissions.find(lm => lm.studentId === studentId && lm.status === "Active") || null;
  }

  selectMission(studentId: string, templateId: string): void {
    selectStudentMission(studentId, templateId);
  }

  toggleMilestone(studentId: string, templateId: string, milestoneText: string): boolean {
    return toggleStudentMilestone(studentId, templateId, milestoneText);
  }

  getMilestones(studentId: string, missionId: string): MissionMilestoneRecord[] {
    const db = loadMemoryDatabase();
    return db.missionMilestones.filter(m => m.studentId === studentId && m.missionId === missionId);
  }
}
