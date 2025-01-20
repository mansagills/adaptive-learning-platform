import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, TrendingUp, Settings } from 'lucide-react';

// Learning style effectiveness thresholds
const STYLE_EFFECTIVENESS_THRESHOLD = 0.7;
const ADAPTATION_WINDOW = 5; // Number of questions to analyze for adaptation

const AdaptiveLearningEngine = ({ initialLearningStyle = 'visual' }) => {
  const [learningData, setLearningData] = useState({
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

  const [adaptiveRecommendations, setAdaptiveRecommendations] = useState({
    primaryStyle: initialLearningStyle,
    hybridStyles: [],
    contentAdjustments: []
  });

  // Track performance patterns
  const analyzePerformancePatterns = useCallback((history) => {
    if (history.length < ADAPTATION_WINDOW) return null;
    
    const recentPerformance = history.slice(-ADAPTATION_WINDOW);
    
    // Calculate success rates for different content types
    const successRates = recentPerformance.reduce((acc, performance) => {
      const { contentType, correct, timeSpent, engagementMetrics } = performance;
      
      if (!acc[contentType]) {
        acc[contentType] = {
          attempts: 0,
          successes: 0,
          avgTime: 0,
          engagement: 0
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

  // Determine optimal learning style mix
  const determineOptimalStyles = useCallback((performancePatterns) => {
    if (!performancePatterns) return null;

    const styleEffectiveness = Object.entries(performancePatterns)
      .map(([style, stats]) => ({
        style,
        effectiveness: stats.effectiveness
      }))
      .sort((a, b) => b.effectiveness - a.effectiveness);

    const primaryStyle = styleEffectiveness[0].style;
    const hybridStyles = styleEffectiveness
      .filter(s => s.effectiveness > STYLE_EFFECTIVENESS_THRESHOLD)
      .map(s => s.style);

    return { primaryStyle, hybridStyles };
  }, []);

  // Generate adaptive content recommendations
  const generateContentRecommendations = useCallback((patterns, optimalStyles) => {
    if (!patterns || !optimalStyles) return [];

    const recommendations = [];

    // Adjust content mix based on effectiveness
    if (optimalStyles.hybridStyles.length > 1) {
      recommendations.push({
        type: 'content_mix',
        description: 'Blend multiple learning styles',
        styles: optimalStyles.hybridStyles,
        ratio: optimalStyles.hybridStyles.map(style => ({
          style,
          percentage: Math.round(patterns[style].effectiveness * 100)
        }))
      });
    }

    // Recommend specific content types
    recommendations.push({
      type: 'content_type',
      description: 'Optimal content types',
      recommendations: optimalStyles.hybridStyles.map(style => ({
        style,
        types: getContentTypesForStyle(style)
      }))
    });

    return recommendations;
  }, []);

  // Get specific content types for each learning style
  const getContentTypesForStyle = (style) => {
    const contentTypes = {
      visual: [
        'interactive-diagrams',
        'video-explanations',
        'mind-maps',
        'infographics'
      ],
      auditory: [
        'audio-lessons',
        'discussion-based',
        'verbal-explanations',
        'music-based-learning'
      ],
      kinesthetic: [
        'interactive-simulations',
        'hands-on-exercises',
        'role-playing',
        'physical-demonstrations'
      ]
    };

    return contentTypes[style] || [];
  };

  // Update learning effectiveness metrics
  const updateLearningEffectiveness = useCallback((performance) => {
    setLearningData(prev => {
      const newHistory = [...prev.performanceHistory, performance];
      const patterns = analyzePerformancePatterns(newHistory);
      
      if (patterns) {
        const optimalStyles = determineOptimalStyles(patterns);
        const recommendations = generateContentRecommendations(patterns, optimalStyles);
        
        setAdaptiveRecommendations({
          primaryStyle: optimalStyles.primaryStyle,
          hybridStyles: optimalStyles.hybridStyles,
          contentAdjustments: recommendations
        });
      }

      return {
        ...prev,
        performanceHistory: newHistory,
        styleEffectiveness: patterns || prev.styleEffectiveness
      };
    });
  }, [analyzePerformancePatterns, determineOptimalStyles, generateContentRecommendations]);

  // Real-time adaptation monitoring
  useEffect(() => {
    const adaptationCheck = () => {
      const { performanceHistory, currentStyle } = learningData;
      if (performanceHistory.length >= ADAPTATION_WINDOW) {
        const recentPerformance = performanceHistory.slice(-ADAPTATION_WINDOW);
        const averageEffectiveness = recentPerformance.reduce(
          (acc, curr) => acc + curr.effectiveness, 0
        ) / ADAPTATION_WINDOW;

        if (averageEffectiveness < STYLE_EFFECTIVENESS_THRESHOLD) {
          // Trigger style adaptation
          const patterns = analyzePerformancePatterns(performanceHistory);
          const optimalStyles = determineOptimalStyles(patterns);
          
          if (optimalStyles && optimalStyles.primaryStyle !== currentStyle) {
            setLearningData(prev => ({
              ...prev,
              currentStyle: optimalStyles.primaryStyle,
              adaptationHistory: [
                ...prev.adaptationHistory,
                {
                  timestamp: new Date(),
                  fromStyle: currentStyle,
                  toStyle: optimalStyles.primaryStyle,
                  reason: 'Low effectiveness detected'
                }
              ]
            }));
          }
        }
      }
    };

    adaptationCheck();
  }, [learningData.performanceHistory, analyzePerformancePatterns, determineOptimalStyles]);

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
            {adaptiveRecommendations.contentAdjustments.length > 0 && (
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
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdaptiveLearningEngine;