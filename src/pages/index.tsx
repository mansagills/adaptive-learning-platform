import { useEffect, useState } from 'react';
import AdaptiveLearningPlatform from '@/components/learning/AdaptiveLearningPlatform';
import AdaptiveAssessment from '@/components/learning/AdaptiveAssessment';
import AdaptiveLearningEngine from '@/components/learning/AdaptiveLearningEngine';
import type { StudentProfile } from '@/types/learning';

export default function Home() {
  // Initialize student profile state
  const [studentProfile, setStudentProfile] = useState<StudentProfile>({
    learningStyle: 'visual',
    currentSkillLevels: {},
    achievements: [],
    progress: {}
  });

  // Handle performance updates from assessments
  const handlePerformanceUpdate = (performanceData: any) => {
    // Update student profile based on assessment results
    setStudentProfile(prev => ({
      ...prev,
      currentSkillLevels: {
        ...prev.currentSkillLevels,
        [performanceData.skill]: performanceData.recommendedDifficulty
      },
      progress: {
        ...prev.progress,
        [performanceData.skill]: performanceData.accuracyRate
      }
    }));
  };

  // Handle learning style updates
  const handleLearningStyleUpdate = (newStyle: 'visual' | 'auditory' | 'kinesthetic') => {
    setStudentProfile(prev => ({
      ...prev,
      learningStyle: newStyle
    }));
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Adaptive Learning Platform
        </h1>
        
        {/* Adaptive Learning Engine - Handles learning style analysis */}
        <AdaptiveLearningEngine 
          initialLearningStyle={studentProfile.learningStyle}
          onStyleUpdate={handleLearningStyleUpdate}
        />
        
        {/* Main Learning Platform - Shows overall progress and available content */}
        <AdaptiveLearningPlatform 
          studentProfile={studentProfile}
          onProfileUpdate={setStudentProfile}
        />
        
        {/* Assessment Component - Handles quizzes and evaluations */}
        <AdaptiveAssessment
          subject="mathematics"
          skill="algebra"
          learningStyle={studentProfile.learningStyle}
          currentDifficulty={studentProfile.currentSkillLevels['algebra'] || 1}
          onPerformanceUpdate={handlePerformanceUpdate}
        />
      </div>
    </main>
  );
}