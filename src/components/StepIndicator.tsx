import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps: _totalSteps,
  steps,
}) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((_step, index) => (
        <React.Fragment key={index}>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-300
              ${index === currentStep
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/30 scale-110'
                : index < currentStep
                  ? 'bg-green-500/80 text-white'
                  : 'bg-white/10 text-white/50'
              }`}
          >
            {index < currentStep ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              index + 1
            )}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-12 h-0.5 rounded-full transition-all duration-300
                ${index < currentStep ? 'bg-green-500/80' : 'bg-white/10'}`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
