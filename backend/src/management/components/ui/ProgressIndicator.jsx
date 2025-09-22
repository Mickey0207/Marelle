import React from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';

const ProgressIndicator = ({ steps, currentStep, onStepClick, completedSteps = [], compact = false }) => {
  return (
    <div className={compact ? "mb-4" : "mb-8"}>
      {/* 進度條容器 */}
      <div className="relative">
        {/* 背景進度線 */}
        <div className={`absolute ${compact ? 'top-4' : 'top-6'} left-0 right-0 h-0.5 bg-gray-200`}></div>
        
        {/* 完成的進度線 */}
        <div 
          className={`absolute ${compact ? 'top-4' : 'top-6'} left-0 h-0.5 bg-[#cc824d] transition-all duration-500 ease-in-out`}
          style={{ 
            width: `${(completedSteps.length / (steps.length - 1)) * 100}%` 
          }}
        ></div>

        {/* 步驟點和標籤 */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isActive = currentStep === index;
            const isCompleted = completedSteps.includes(index);
            const isClickable = true; // 允許自由跳轉
            
            return (
              <div 
                key={step.id} 
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => isClickable && onStepClick(index)}
              >
                {/* 步驟圓圈 */}
                <div className={`
                  relative ${compact ? 'w-8 h-8' : 'w-12 h-12'} rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10
                  ${isActive 
                    ? 'bg-[#cc824d] border-[#cc824d] text-white shadow-lg scale-110' 
                    : isCompleted
                      ? 'bg-[#cc824d] border-[#cc824d] text-white'
                      : 'bg-white border-gray-300 text-gray-400 group-hover:border-[#cc824d] group-hover:text-[#cc824d]'
                  }
                `}>
                  {isCompleted && !isActive ? (
                    <CheckIcon className={compact ? "w-4 h-4" : "w-6 h-6"} />
                  ) : (
                    <span className={`${compact ? 'text-xs' : 'text-sm'} font-semibold`}>{index + 1}</span>
                  )}
                  
                  {/* 活躍步驟的脈動效果 */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-full bg-[#cc824d] opacity-20 animate-ping"></div>
                  )}
                </div>

                {/* 步驟標籤 */}
                <div className={`${compact ? 'mt-2' : 'mt-3'} text-center`}>
                  <div className={`
                    ${compact ? 'text-xs' : 'text-sm'} font-medium transition-colors duration-200
                    ${isActive 
                      ? 'text-[#cc824d]' 
                      : isCompleted 
                        ? 'text-gray-700'
                        : 'text-gray-500 group-hover:text-[#cc824d]'
                    }
                  `}>
                    {step.title}
                  </div>
                  {!compact && (
                    <div className="text-xs text-gray-400 mt-1 max-w-20 mx-auto leading-tight">
                      {step.description}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 當前步驟提示 */}
      {!compact && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-[#cc824d]/10 text-[#cc824d] rounded-full text-sm font-medium">
            步驟 {currentStep + 1} / {steps.length}: {steps[currentStep]?.title}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;