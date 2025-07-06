// src/app/buyer/htb/shared/HTBStepIndicator.tsx
// or
// src/components/htb/shared/HTBStepIndicator.tsx (depending on your structure)

import React from 'react';

interface Step {
  label: string;
  status: 'complete' | 'current' | 'upcoming';
}

interface HTBStepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export const HTBStepIndicator: React.FC<HTBStepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <nav aria-label="Progress">
      <ol className="flex items-center">
        {steps.map((step, index) => (
          <li
            key={step.label}
            className={`${
              index !== steps.length - 1 ? "pr-8 sm:pr-20" : ""
            } relative`}
          >
            {step.status === "complete" ? (
              <div className="group">
                <span className="flex items-center">
                  <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
                    <svg
                      className="h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="ml-3 text-sm font-medium text-gray-900">{step.label}</span>
                </span>
                {index !== steps.length - 1 && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-0.5 w-14 sm:w-20 bg-blue-600"
                    aria-hidden="true"
                  />
                )}
              </div>
            ) : step.status === "current" ? (
              <div className="group">
                <span className="flex items-center">
                  <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white border-2 border-blue-600">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                  </span>
                  <span className="ml-3 text-sm font-medium text-blue-600">{step.label}</span>
                </span>
                {index !== steps.length - 1 && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-0.5 w-14 sm:w-20 bg-gray-300"
                    aria-hidden="true"
                  />
                )}
              </div>
            ) : (
              <div className="group">
                <span className="flex items-center">
                  <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white border-2 border-gray-300">
                    <span className="h-2.5 w-2.5 rounded-full bg-transparent" />
                  </span>
                  <span className="ml-3 text-sm font-medium text-gray-500">{step.label}</span>
                </span>
                {index !== steps.length - 1 && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-0.5 w-14 sm:w-20 bg-gray-300"
                    aria-hidden="true"
                  />
                )}
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};