import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Award, BookOpen, Brain, Star } from 'lucide-react';

// Learning styles enumeration
const LearningStyles = {
  VISUAL: 'visual',
  AUDITORY: 'auditory',
  KINESTHETIC: 'kinesthetic'
};

// Sample subjects and skills data structure
const subjects = {
  math: {
    name: 'Mathematics',
    skills: ['Addition', 'Subtraction', 'Multiplication', 'Division', 'Fractions', 'Geometry'],
    difficulty: [1, 2, 3, 4, 5]
  },
  science: {
    name: 'Science',
    skills: ['Scientific Method', 'Basic Chemistry', 'Physics Concepts', 'Biology Basics'],
    difficulty: [1, 2, 3, 4, 5]
  }
};

const AdaptiveLearningPlatform = () => {
  const [studentProfile, setStudentProfile] = useState({
    learningStyle: LearningStyles.VISUAL,
    currentSkillLevels: {},
    achievements: [],
    progress: {}
  });

  // Adaptive difficulty adjustment based on performance
  const adjustDifficulty = (subject, skill, performance) => {
    const currentLevel = studentProfile.currentSkillLevels[`${subject}-${skill}`] || 1;
    const newLevel = performance > 0.8 ? currentLevel + 1 : 
                     performance < 0.4 ? currentLevel - 1 : 
                     currentLevel;
    
    setStudentProfile(prev => ({
      ...prev,
      currentSkillLevels: {
        ...prev.currentSkillLevels,
        [`${subject}-${skill}`]: Math.max(1, Math.min(5, newLevel))
      }
    }));
  };

  // Track progress for each subject
  const updateProgress = (subject, skill, completion) => {
    setStudentProfile(prev => ({
      ...prev,
      progress: {
        ...prev.progress,
        [`${subject}-${skill}`]: completion
      }
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Adventure Academy</h1>
        <p className="text-gray-600">Personalized Learning Journey</p>
      </header>

      {/* Learning Style Indicator */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Learning Style: {studentProfile.learningStyle}</h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {Object.values(LearningStyles).map(style => (
              <Button
                key={style}
                variant={studentProfile.learningStyle === style ? "default" : "outline"}
                onClick={() => setStudentProfile(prev => ({ ...prev, learningStyle: style }))}
                className="capitalize"
              >
                {style}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(subjects).map(([subjectKey, subject]) => (
          <Card key={subjectKey}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                <h2 className="text-xl font-semibold">{subject.name}</h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subject.skills.map(skill => {
                  const skillProgress = studentProfile.progress[`${subjectKey}-${skill}`] || 0;
                  const skillLevel = studentProfile.currentSkillLevels[`${subjectKey}-${skill}`] || 1;
                  
                  return (
                    <div key={skill} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{skill}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Level {skillLevel}</span>
                          <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
                        </div>
                      </div>
                      <Progress value={skillProgress * 100} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Achievements Section */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Achievements</h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {studentProfile.achievements.length === 0 ? (
              <p className="text-gray-500">Complete activities to earn achievements!</p>
            ) : (
              studentProfile.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>{achievement}</span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdaptiveLearningPlatform;