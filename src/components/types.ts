export interface AdaptiveLearningEngineProps {
  initialLearningStyle: 'visual' | 'auditory' | 'kinesthetic';
  onStyleUpdate: (style: string) => void;
}

export interface PerformanceData {
  contentType: string;
  correct: boolean;
  timeSpent: number;
  engagementMetrics: number;
  effectiveness: number;
}

export interface StyleEffectiveness {
  visual: number;
  auditory: number;
  kinesthetic: number;
}

export interface AdaptationEvent {
  timestamp: Date;
  fromStyle: string;
  toStyle: string;
  reason: string;
}

export interface LearningData {
  currentStyle: string;
  performanceHistory: PerformanceData[];
  styleEffectiveness: StyleEffectiveness;
  adaptationHistory: AdaptationEvent[];
  currentContent: null | any;
}

export interface ContentTypeStats {
  attempts: number;
  successes: number;
  avgTime: number;
  engagement: number;
  effectiveness: number;
}

export interface PerformancePatterns {
  [key: string]: ContentTypeStats;
} 