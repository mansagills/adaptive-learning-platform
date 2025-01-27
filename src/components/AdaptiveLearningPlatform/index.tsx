import { AdaptiveLearningPlatformProps } from './types';

export default function AdaptiveLearningPlatform({ 
  studentProfile
}: AdaptiveLearningPlatformProps) {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Learning Progress</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-medium">Current Learning Style:</h3>
          <p className="capitalize">{studentProfile.learningStyle}</p>
        </div>
        <div>
          <h3 className="font-medium">Skills Progress:</h3>
          {Object.entries(studentProfile.progress).map(([skill, progress]) => (
            <div key={skill} className="flex items-center gap-2">
              <span className="capitalize">{skill}:</span>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${progress * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 