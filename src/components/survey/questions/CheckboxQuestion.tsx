import React, { useState } from 'react';
import { ThemeSettings } from '../SurveyPreview';

interface CheckboxQuestionProps {
  questionNumber: number;
  title: string;
  description?: string;
  options: string[];
  required: boolean;
  theme: Partial<ThemeSettings>;
  error?: boolean;
  onChange?: (answer: string[]) => void;
}

const CheckboxQuestion: React.FC<CheckboxQuestionProps> = ({
  questionNumber,
  title,
  description,
  options,
  required,
  theme,
  error,
  onChange
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleOptionChange = (option: string, checked: boolean) => {
    const newSelection = checked
      ? [...selectedOptions, option]
      : selectedOptions.filter(o => o !== option);
    
    setSelectedOptions(newSelection);
    onChange?.(newSelection);
  };

  return (
    <div>
      <div className="mb-4">
        <div className="flex items-baseline">
          <span 
            className="text-lg font-medium"
            style={{ color: theme.textColor }}
          >
            {questionNumber}. {title}
          </span>
          {required && (
            <span className="ml-2 text-sm text-red-500">*</span>
          )}
        </div>
        {description && (
          <p 
            className="mt-1 text-sm"
            style={{ color: `${theme.textColor}99` }}
          >
            {description}
          </p>
        )}
      </div>
      
      <div className="space-y-3">
        {options.map((option, index) => (
          <label key={index} className="flex items-center">
            <input
              type="checkbox"
              name={`question-${questionNumber}-option-${index}`}
              checked={selectedOptions.includes(option)}
              onChange={(e) => handleOptionChange(option, e.target.checked)}
              className="h-4 w-4 rounded border focus:ring-offset-0"
              style={{
                borderColor: error ? '#EF4444' : theme.inputBorderColor,
                color: theme.checkboxColor,
                '--tw-ring-color': theme.inputFocusColor
              } as React.CSSProperties}
            />
            <span 
              className="ml-3"
              style={{ color: theme.textColor }}
            >
              {option}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CheckboxQuestion;