// components/sales/SalesProgressBar.tsx
import React from 'react';

interface SalesProgressBarProps {
  currentStage: string;
  stages: {
    id: string;
    label: string;
    completed: boolean;
    active: boolean;
  }[];
}

const SalesProgressBar: React.FC<SalesProgressBarProps> = ({ currentStage, stages }) => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center">
        {stages.map((stage: any, index: number) => (
          <React.Fragment key={stage.id}>
            {/* Stage Indicator */}
            <div className="relative flex flex-col items-center">
              <div 
                className={`rounded-full h-8 w-8 flex items-center justify-center ${
                  stage.completed
                    ? 'bg-green-500 text-white'
                    : stage.active
                      ? 'bg-[#2B5273] text-white'
                      : 'bg-gray-200 text-gray-500'
                }`}
              >
                {stage.completed ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className="text-xs mt-1 text-center">
                <span className={stage.active || stage.completed ? 'font-medium' : 'text-gray-500'}>
                  {stage.label}
                </span>
              </div>
            </div>

            {/* Connecting Line (except after the last stage) */}
            {index < stages.length - 1 && (
              <div 
                className={`flex-1 h-1 mx-2 ${
                  stages[index + 1].completed || stages[index].completed
                    ? 'bg-green-500'
                    : 'bg-gray-200'
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default SalesProgressBar;