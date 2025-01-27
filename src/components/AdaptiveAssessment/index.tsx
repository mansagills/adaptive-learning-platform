import { useState } from 'react';
import { AdaptiveAssessmentProps } from './types';

export default function AdaptiveAssessment({ 
  subject,
  skill,
  learningStyle,
  currentDifficulty,
  onPerformanceUpdate
}: AdaptiveAssessmentProps) {
  const [isAssessing, setIsAssessing] = useState(false);

  const handleStartAssessment = () => {
    setIsAssessing(true);
    setTimeout(() => {
      onPerformanceUpdate({
        skill,
        recommendedDifficulty: Math.min(currentDifficulty + 1, 10),
        accuracyRate: Math.random() * 0.3 + 0.7
      });
      setIsAssessing(false);
    }, 2000);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Assessment</h2>
      <div className="space-y-2">
        <p>Subject: <span className="capitalize">{subject}</span></p>
        <p>Skill: <span className="capitalize">{skill}</span></p>
        <p>Current Difficulty: {currentDifficulty}</p>
        <p>Learning Style: <span className="capitalize">{learningStyle}</span></p>
      </div>
      <button
        onClick={handleStartAssessment}
        disabled={isAssessing}
        className={`mt-4 px-4 py-2 rounded ${
          isAssessing 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {isAssessing ? 'Assessing...' : 'Start Assessment'}
      </button>
    </div>
  );
} 