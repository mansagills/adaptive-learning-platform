import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { Brain, CheckCircle, XCircle, Loader2 } from 'lucide-react';

// Question types based on learning styles
const questionTypes = {
  visual: {
    components: ['diagrams', 'charts', 'images'],
    interactionType: 'visual-spatial',
  },
  auditory: {
    components: ['audio-clips', 'verbal-descriptions', 'discussions'],
    interactionType: 'listening-speaking',
  },
  kinesthetic: {
    components: ['interactive-simulations', 'hands-on-activities', 'drag-drop'],
    interactionType: 'learning-by-doing',
  }
};

const AdaptiveAssessment = ({ 
  subject, 
  skill, 
  learningStyle, 
  currentDifficulty,
  onPerformanceUpdate 
}) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [performance, setPerformance] = useState([]);
  const [isAssessing, setIsAssessing] = useState(true);
  const [adaptiveHints, setAdaptiveHints] = useState([]);
  const [streakCount, setStreakCount] = useState(0);

  // Generate questions based on learning style and difficulty
  const generateQuestions = (style, difficulty) => {
    // This would typically fetch from an API, but for demo we'll generate
    const questionCount = 5;
    const generatedQuestions = Array(questionCount).fill(null).map((_, index) => ({
      id: `q-${index}`,
      type: style,
      difficulty: difficulty,
      content: `Sample ${style} question for ${subject} - ${skill} (Difficulty: ${difficulty})`,
      options: [
        { id: 'a', content: 'Option A', isCorrect: index % 3 === 0 },
        { id: 'b', content: 'Option B', isCorrect: index % 3 === 1 },
        { id: 'c', content: 'Option C', isCorrect: index % 3 === 2 },
      ],
      hintCount: 0,
    }));
    return generatedQuestions;
  };

  // Initialize assessment
  useEffect(() => {
    const newQuestions = generateQuestions(learningStyle, currentDifficulty);
    setQuestions(newQuestions);
    setPerformance([]);
    setCurrentQuestionIndex(0);
    setIsAssessing(true);
  }, [learningStyle, currentDifficulty, subject, skill]);

  // Handle answer submission
  const handleAnswer = (selectedOption) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOption.isCorrect;
    
    // Update performance tracking
    const newPerformance = [...performance, {
      questionId: currentQuestion.id,
      correct: isCorrect,
      difficulty: currentQuestion.difficulty,
      timeSpent: 0, // Would track actual time in real implementation
      hintsUsed: currentQuestion.hintCount
    }];
    setPerformance(newPerformance);

    // Update streak count
    if (isCorrect) {
      setStreakCount(prev => prev + 1);
    } else {
      setStreakCount(0);
    }

    // Move to next question or finish assessment
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishAssessment(newPerformance);
    }
  };

  // Calculate performance metrics and adjust difficulty
  const finishAssessment = (performanceData) => {
    setIsAssessing(false);
    
    // Calculate performance metrics
    const totalQuestions = performanceData.length;
    const correctAnswers = performanceData.filter(p => p.correct).length;
    const accuracyRate = correctAnswers / totalQuestions;
    const averageHints = performanceData.reduce((acc, p) => acc + p.hintsUsed, 0) / totalQuestions;
    
    // Determine performance level and difficulty adjustment
    const performanceLevel = calculatePerformanceLevel(accuracyRate, averageHints);
    
    // Call the parent component's update function
    onPerformanceUpdate({
      accuracyRate,
      performanceLevel,
      recommendedDifficulty: adjustDifficultyLevel(currentDifficulty, performanceLevel),
      learningStyleEffectiveness: analyzeLearningstyleEffectiveness(performanceData)
    });
  };

  // Calculate overall performance level
  const calculatePerformanceLevel = (accuracy, avgHints) => {
    if (accuracy >= 0.8 && avgHints <= 1) return 'excellent';
    if (accuracy >= 0.6) return 'good';
    if (accuracy >= 0.4) return 'fair';
    return 'needs_improvement';
  };

  // Adjust difficulty based on performance
  const adjustDifficultyLevel = (current, performance) => {
    const adjustments = {
      'excellent': 1,
      'good': 0,
      'fair': -0,
      'needs_improvement': -1
    };
    
    const newLevel = current + adjustments[performance];
    return Math.max(1, Math.min(5, newLevel)); // Keep within 1-5 range
  };

  // Analyze learning style effectiveness
  const analyzeLearningstyleEffectiveness = (performanceData) => {
    const accuracy = performanceData.filter(p => p.correct).length / performanceData.length;
    return {
      style: learningStyle,
      effectiveRate: accuracy,
      recommendation: accuracy < 0.6 ? 'consider_alternative_style' : 'style_effective'
    };
  };

  // Request a hint
  const requestHint = () => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].hintCount++;
    setQuestions(updatedQuestions);
    
    // Generate adaptive hint based on learning style
    const newHint = generateAdaptiveHint(learningStyle, questions[currentQuestionIndex]);
    setAdaptiveHints(prev => [...prev, newHint]);
  };

  // Generate hints based on learning style
  const generateAdaptiveHint = (style, question) => {
    const hintTypes = {
      visual: 'Try visualizing the problem...',
      auditory: 'Think about how this would sound...',
      kinesthetic: 'Try working through this step by step...'
    };
    return hintTypes[style] || 'Consider the relationship between the concepts...';
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {subject} - {skill} Assessment
          </h2>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            <span className="capitalize">{learningStyle} Style</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isAssessing ? (
          <div className="space-y-6">
            {/* Progress indicator */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span>Streak: {streakCount}</span>
              </div>
              <Progress 
                value={(currentQuestionIndex / questions.length) * 100} 
                className="h-2"
              />
            </div>

            {/* Current question */}
            <div className="space-y-4">
              <p className="text-lg">
                {questions[currentQuestionIndex]?.content}
              </p>

              {/* Answer options */}
              <div className="space-y-2">
                {questions[currentQuestionIndex]?.options.map(option => (
                  <Button
                    key={option.id}
                    onClick={() => handleAnswer(option)}
                    className="w-full justify-start text-left"
                    variant="outline"
                  >
                    {option.content}
                  </Button>
                ))}
              </div>

              {/* Hint section */}
              <div className="mt-4">
                <Button
                  variant="ghost"
                  onClick={requestHint}
                  className="text-sm"
                >
                  Need a hint?
                </Button>
                {adaptiveHints.length > 0 && (
                  <div className="mt-2">
                    {adaptiveHints.map((hint, index) => (
                      <Alert key={index} className="mb-2">
                        <AlertDescription>{hint}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <span className="text-lg font-medium">Assessment Complete!</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Accuracy</p>
                <p className="text-xl font-bold">
                  {((performance.filter(p => p.correct).length / performance.length) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Learning Style Match</p>
                <p className="text-xl font-bold">
                  {analyzeLearningstyleEffectiveness(performance).effectiveRate >= 0.6 ? 'Effective' : 'Consider Adjusting'}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdaptiveAssessment;