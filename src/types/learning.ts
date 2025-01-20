export interface StudentProfile {
    learningStyle: 'visual' | 'auditory' | 'kinesthetic';
    currentSkillLevels: Record<string, number>;
    achievements: string[];
    progress: Record<string, number>;
  }
  
  export interface PerformanceData {
    contentType: string;
    correct: boolean;
    timeSpent: number;
    engagementMetrics: number;
  }