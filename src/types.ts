/**
 * MirrorMind - Core data models and TypeScript definitions
 */

export enum UserRole {
  SUPER_ADMIN = "Super Admin",
  PRINCIPAL = "Principal",
  LECTURER = "Lecturer",
  STUDENT = "Student"
}

// ----------------- MODULE 1: Student DNA Models -----------------
export interface AcademicDNA {
  strengths: string[];
  weaknesses: string[];
  gpaTrends: { semester: string; gpa: number }[];
  currentGPA: number;
  internalMarks: { subject: string; score: number; max: number }[];
  assignmentScores: { title: string; subject: string; score: number; max: number }[];
}

export interface BehavioralDNA {
  attendancePercentage: number;
  punctualityScore: number; // 0 - 100
  classParticipation: number; // 0 - 100
  disciplineIncidents: number;
  lastActive: string; // ISO string
}

export interface LearningDNA {
  visual: number;        // percentage
  reading: number;       // percentage
  practice: number;      // percentage
  collaborative: number; // percentage
}

export interface CareerDNA {
  careerInterests: string[];
  preferredDomains: string[];
  skillsMastered: string[];
  skillsInProgress: string[];
  roadmapCompleted: number; // percentage completed on active roadmap
}

export interface DigitalDNA {
  learningActivityHours: number;
  contentEngagementScore: number; // 0 - 100
  challengesCompletedCount: number;
  streakDays: number;
}

export interface StudentDNAProfile {
  studentId: string;
  name: string;
  avatarUrl: string;
  email: string;
  department: string;
  semester: string;
  academic: AcademicDNA;
  behavioral: BehavioralDNA;
  learning: LearningDNA;
  career: CareerDNA;
  digital: DigitalDNA;
}

// ----------------- MODULE 3: Student Challenge System -----------------
export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: "Detox" | "Reading" | "Coding" | "Communication" | "Attendance" | "Leadership" | "AI";
  durationDays: number;
  xpValue: number;
  badgeRewarded: {
    name: string;
    icon: string; // lucide icon name
    color: string; // tw color class
  };
}

export interface StudentChallengeProgress {
  challengeId: string;
  studentId: string;
  currentStreak: number;
  longestStreak: number;
  completedDays: number;
  status: "Active" | "Completed" | "Failed";
  progressPercentage: number;
  logs: { date: string; note: string }[];
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatarUrl: string;
  level: number;
  xp: number;
  challengesCount: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlockedAt?: string;
}

// ----------------- MODULE 4 & 5: StudentMind Studio & Personalized Content -----------------
export interface StudyNotes {
  summary: string;
  keyPoints: string[];
  revisionNotes: string;
  pptSlideOutline?: string[];
  teluguContent?: string;
}

export interface AssessmentQuestion {
  question: string;
  type: "MCQ" | "Short" | "Long";
  options?: string[]; // only for MCQ
  correctAnswer?: string; // only for MCQ
  rubricHint?: string; // for general assistance
}

export interface Assessment {
  title: string;
  questions: AssessmentQuestion[];
}

export interface StudioChallenge {
  title: string;
  description: string;
  category: string;
  xpValue: number;
}

export interface MarketingContent {
  instagram: string;
  linkedin: string;
  blogDraft: string;
}

export interface VideoContent {
  shortsScript: string;
  reelScript: string;
}

export interface VisualContentTemplate {
  verticalImageUrl: string;
  infographicPoints: string[];
  quoteText: string;
  posterTitle: string;
  posterCategory: string;
}

export interface GeneratedStudyPack {
  id: string;
  studentId: string;
  sourceType: string;
  sourceName: string;
  notes: StudyNotes;
  assessment: Assessment;
  challenges: StudioChallenge[];
  marketing: MarketingContent;
  video: VideoContent;
  visual: VisualContentTemplate;
  createdAt: string;
}

// ----------------- MODULE 9: ValueWeave Connector -----------------
export interface ValueWeaveInsight {
  id: string;
  title: string;
  description: string;
  sourceReport: string;
  industryTrend: string;
  dateImported: string;
  recommendedActions: {
    targetInterest: string;
    suggestedCareer: string;
    suggestedPathTitle: string;
    newChallengeTitle: string;
    newChallengeDesc: string;
  };
}

// ----------------- MODULE 10: Intervention Engine -----------------
export interface ActiveIntervention {
  id: string;
  studentId: string;
  studentName: string;
  challengeTitle: string;
  status: "Active" | "Completed" | "Resolved";
  assignedAt: string;
  type: string; // e.g. "Attendance" | "Syllabus Focus" | "Cognitive" | "Communication"
  outcome: string; // live results
}

// ----------------- GENERAL DB STATE FOR IN-MEMORY SYNC -----------------
export interface AppDatabase {
  students: StudentDNAProfile[];
  challenges: Challenge[];
  studentChallenges: StudentChallengeProgress[];
  leaderboard: LeaderboardUser[];
  studyPacks: GeneratedStudyPack[];
  valueweaveInsights: ValueWeaveInsight[];
  interventions: ActiveIntervention[];
  currentUser: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    studentId?: string; // if student
  };
}
