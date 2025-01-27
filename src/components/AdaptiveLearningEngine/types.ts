export interface AdaptiveLearningEngineProps {
  initialLearningStyle: 'visual' | 'auditory' | 'kinesthetic';
  onStyleUpdate: (newStyle: 'visual' | 'auditory' | 'kinesthetic') => void;
} 