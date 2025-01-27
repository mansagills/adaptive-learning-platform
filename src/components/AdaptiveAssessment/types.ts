export interface AdaptiveAssessmentProps {
  subject: string;
  skill: string;
  learningStyle: 'visual' | 'auditory' | 'kinesthetic';
  currentDifficulty: number;
  onPerformanceUpdate: (data: PerformanceData) => void;
}

export interface PerformanceData {
  skill: string;
  recommendedDifficulty: number;
  accuracyRate: number;
} 