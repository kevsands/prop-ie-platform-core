'use client';

// components/units/CustomizationOptions.tsx
"use client";

import React, { useState } from 'react';
import { FiCircle, FiCheckCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';

interface CustomizationOption {
  id: string;
  name: string;
  description: string;
  category: string;
  options: {
    id: string;
    name: string;
    description?: string;
    additionalCost: number;
    imageUrl?: string;
    isStandard: boolean;
  }[];
  deadline: string;
  isEnabled: boolean;
}

interface CustomizationOptionsProps {
  options: CustomizationOption[];
  selectedOptions: Record<string, string>
  );
  onSelectOption: (optionId: string, selectionId: string) => void;
}

const CustomizationOptions: React.FC<CustomizationOptionsProps> = ({ 
  options, 
  selectedOptions, 
  onSelectOption 
}) => {
  const [activeCategorysetActiveCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(options.map(option => option.category)));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const getDeadlineStatus = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);

    if (isNaN(deadlineDate.getTime())) {
      // If deadline is not a valid date, it might be a stage name
      return { valid: true, message: `Available until ${deadline} stage` };
    }

    if (deadlineDate <now) {
      return { valid: false, message: 'Deadline passed' };
    }

    // Calculate days remaining
    const daysRemaining = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysRemaining <= 7) {
      return { valid: true, urgent: true, message: `${daysRemaining} days remaining` };
    }

    return { valid: true, message: `Available until ${deadlineDate.toLocaleDateString()}` };
  };

  return (
    <div>
      {/* Category Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {categories.map(category => (
            <button
              key={category}
              className={`py-3 px-6 font-medium text-sm whitespace-nowrap ${
                activeCategory === category
                  ? 'border-b-2 border-[#2B5273] text-[#2B5273]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
          <button
            className={`py-3 px-6 font-medium text-sm whitespace-nowrap ${
              activeCategory === null
                ? 'border-b-2 border-[#2B5273] text-[#2B5273]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveCategory(null)}
          >
            All Options
          </button>
        </div>
      </div>

      {/* Customization Options */}
      <div className="space-y-8">
        {options
          .filter(option => activeCategory === null || option.category === activeCategory)
          .map(option => (
            <div key={option.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{option.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                  </div>

                  {option.isEnabled ? (
                    <div className="flex items-center">
                      {(() => {
                        const status = getDeadlineStatus(option.deadline);
                        return (
                          <div className={`flex items-center text-sm ${
                            !status.valid
                              ? 'text-red-600'
                              : status.urgent
                                ? 'text-yellow-600'
                                : 'text-green-600'
                          }`}>
                            {!status.valid ? (
                              <FiAlertTriangle className="mr-1" />
                            ) : status.urgent ? (
                              <FiInfo className="mr-1" />
                            ) : (
                              <FiCheckCircle className="mr-1" />
                            )}
                            <span>{status.message}</span>
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="flex items-center text-sm text-red-600">
                      <FiAlertTriangle className="mr-1" />
                      <span>Not available for customization</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6">
                {option.isEnabled ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {option.options.map(selection => (
                      <div 
                        key={selection.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedOptions[option.id] === selection.id
                            ? 'border-[#2B5273] bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => onSelectOption(option.id, selection.id)}
                      >
                        <div className="flex items-start">
                          <div className="mt-1 mr-3">
                            {selectedOptions[option.id] === selection.id ? (
                              <FiCheckCircle className="h-5 w-5 text-[#2B5273]" />
                            ) : (
                              <FiCircle className="h-5 w-5 text-gray-300" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-gray-900">{selection.name}</h4>
                              {selection.isStandard ? (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Standard</span>
                              ) : (
                                <span className="font-medium text-[#2B5273]">
                                  {selection.additionalCost> 0 ? `+${formatCurrency(selection.additionalCost)}` : ''}
                                </span>
                              )}
                            </div>
                            {selection.description && (
                              <p className="text-sm text-gray-600 mt-1">{selection.description}</p>
                            )}
                            {selection.imageUrl && (
                              <div className="mt-3">
                                <img 
                                  src={selection.imageUrl} 
                                  alt={selection.name}
                                  className="w-full h-32 object-cover rounded-md"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">This customization option is not available for this unit.</p>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CustomizationOptions;