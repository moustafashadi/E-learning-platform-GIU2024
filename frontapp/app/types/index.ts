// /app/types/index.ts
export * from './note';
export interface BackendCourse {
  _id: string;
  course_code: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  resources: string[];
  instructor: string;
  quizzes: string[];
  notes: string[];
}
export interface CourseCardProps {
  course: FrontendCourse;
  isEnrolled: boolean;
  onViewCourse: () => void;
  onEnroll?: () => void;
  isEnrolling?: boolean;
}
export interface FrontendCourse {
  id: string;
  name: string;
  progress: number; // Percentage
  
}

export interface Module {
  _id: string;
  title: string;
  difficulty: string;
  pmScore: number; // Progress score
}

export interface ModuleCategory {
  difficulty: string;
  averagePM: number;
  modules: Module[];
}

export interface User {
  _id: string;
  email: string;
  username: string;
  profilePicUrl: string;
  role: 'admin' | 'student' | 'instructor';
  enrolledCourses: string[]; // Array of course IDs
  completedCourses: string[];
  quizzesSolved: string[];
  notifications: string[];
}
