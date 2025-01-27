import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardHeader, CardContent } from "./ui/card";
import { Brain, TrendingUp, Settings } from 'lucide-react';
import { 
  AdaptiveLearningEngineProps, 
  LearningData, 
  PerformanceData,
  PerformancePatterns,
  ContentTypeStats
} from './types';

// Learning style effectiveness thresholds
const STYLE_EFFECTIVENESS_THRESHOLD = 0.7;
const ADAPTATION_WINDOW = 5; // Number of questions to analyze for adaptation

export default function AdaptiveLearningEngine({ 
  initialLearningStyle, 
  onStyleUpdate 
}: AdaptiveLearningEngineProps) {
  const [learningData, setLearningData] = useState<LearningData>({
    currentStyle: initialLearningStyle,
    performanceHistory: [],
    styleEffectiveness: {
      visual: 0,
      auditory: 0,
      kinesthetic: 0
    },
    adaptationHistory: [],
    currentContent: null
  });

  // Track performance patterns
  const analyzePerformancePatterns = useCallback((history: PerformanceData[]): PerformancePatterns | null => {
    if (history.length < ADAPTATION_WINDOW) return null;
    
    const recentPerformance = history.slice(-ADAPTATION_WINDOW);
    
    // Calculate success rates for different content types
    const successRates = recentPerformance.reduce<Record<string, ContentTypeStats>>((acc, performance) => {
      const { contentType, correct, timeSpent, engagementMetrics } = performance;
      
      if (!acc[contentType]) {
        acc[contentType] = {
          attempts: 0,
          successes: 0,
          avgTime: 0,
          engagement: 0,
          effectiveness: 0
        };
      }
      
      acc[contentType].attempts++;
      if (correct) acc[contentType].successes++;
      acc[contentType].avgTime += timeSpent;
      acc[contentType].engagement += engagementMetrics;
      
      return acc;
    }, {});

    // Calculate effectiveness for each content type
    Object.keys(successRates).forEach(type => {
      const stats = successRates[type];
      stats.effectiveness = (
        (stats.successes / stats.attempts) * 0.4 +
        (1 - (stats.avgTime / (stats.attempts * 100))) * 0.3 +
        (stats.engagement / stats.attempts) * 0.3
      );
    });

    return successRates;
  }, []);

  // Determine the best learning style based on performance patterns
  const determineBestStyle = useCallback((patterns: PerformancePatterns | null): string | null => {
    if (!patterns) return null;

    // Group patterns by learning style
    const styleEffectiveness = {
      visual: 0,
      auditory: 0,
      kinesthetic: 0
    };

    Object.entries(patterns).forEach(([contentType, stats]) => {
      if (contentType.includes('visual')) {
        styleEffectiveness.visual += stats.effectiveness;
      } else if (contentType.includes('auditory')) {
        styleEffectiveness.auditory += stats.effectiveness;
      } else if (contentType.includes('kinesthetic')) {
        styleEffectiveness.kinesthetic += stats.effectiveness;
      }
    });

    // Find the style with highest effectiveness
    const bestStyle = Object.entries(styleEffectiveness)
      .reduce((best, [style, effectiveness]) => 
        effectiveness > best.effectiveness ? { style, effectiveness } : best,
        { style: '', effectiveness: -1 }
      );

    return bestStyle.effectiveness > 0 ? bestStyle.style : null;
  }, []);

  const updateLearningEffectiveness = useCallback((performance: PerformanceData) => {
    setLearningData(prev => {
      const newHistory = [...prev.performanceHistory, performance];
      const patterns = analyzePerformancePatterns(newHistory);
      
      return {
        ...prev,
        performanceHistory: newHistory,
        styleEffectiveness: patterns ? {
          visual: patterns['visual']?.effectiveness || prev.styleEffectiveness.visual,
          auditory: patterns['auditory']?.effectiveness || prev.styleEffectiveness.auditory,
          kinesthetic: patterns['kinesthetic']?.effectiveness || prev.styleEffectiveness.kinesthetic
        } : prev.styleEffectiveness
      };
    });
  }, [analyzePerformancePatterns]);

  useEffect(() => {
    const adaptationCheck = () => {
      const { performanceHistory, currentStyle } = learningData;
      if (performanceHistory.length >= ADAPTATION_WINDOW) {
        const patterns = analyzePerformancePatterns(performanceHistory);
        const bestStyle = determineBestStyle(patterns);
        
        if (bestStyle && bestStyle !== currentStyle) {
          setLearningData(prev => ({
            ...prev,
            currentStyle: bestStyle,
            adaptationHistory: [
              ...prev.adaptationHistory,
              {
                timestamp: new Date(),
                fromStyle: currentStyle,
                toStyle: bestStyle,
                reason: 'Performance pattern adaptation'
              }
            ]
          }));
        }
      }
    };

    adaptationCheck();
  }, [learningData, analyzePerformancePatterns, determineBestStyle]);

  useEffect(() => {
    onStyleUpdate(learningData.currentStyle);
  }, [learningData.currentStyle, onStyleUpdate]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Adaptive Learning Status</h2>
            </div>
            <Settings className="w-5 h-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Current Learning Style */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Current Learning Style</p>
                <p className="text-lg font-medium capitalize">{learningData.currentStyle}</p>
              </div>
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>

            {/* Style Effectiveness */}
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(learningData.styleEffectiveness).map(([style, effectiveness]) => (
                <div key={style} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 capitalize">{style}</p>
                  <p className="text-lg font-medium">
                    {(effectiveness * 100).toFixed(1)}%
                  </p>
                </div>
              ))}
            </div>

            {/* Adaptive Recommendations */}
            {/* {adaptiveRecommendations.contentAdjustments.length > 0 && (
              <Alert>
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">Recommended Adjustments:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      {adaptiveRecommendations.contentAdjustments.map((adjustment, index) => (
                        <li key={index}>
                          {adjustment.description}
                          {adjustment.type === 'content_mix' && (
                            <ul className="pl-4 mt-1">
                              {adjustment.ratio.map((r, i) => (
                                <li key={i}>
                                  {r.style}: {r.percentage}%
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )} */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}