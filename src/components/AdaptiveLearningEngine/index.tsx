import { useState } from 'react';
import { AdaptiveLearningEngineProps } from './types';

export default function AdaptiveLearningEngine({ 
  initialLearningStyle, 
  onStyleUpdate 
}: AdaptiveLearningEngineProps) {
  const [currentStyle, setCurrentStyle] = useState(initialLearningStyle);

  const handleStyleChange = (style: 'visual' | 'auditory' | 'kinesthetic') => {
    setCurrentStyle(style);
    onStyleUpdate(style);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Learning Style Preferences</h2>
      <div className="flex gap-4">
        {['visual', 'auditory', 'kinesthetic'].map((style) => (
          <button
            key={style}
            onClick={() => handleStyleChange(style as 'visual' | 'auditory' | 'kinesthetic')}
            className={`px-4 py-2 rounded ${
              currentStyle === style 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {style.charAt(0).toUpperCase() + style.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
} 