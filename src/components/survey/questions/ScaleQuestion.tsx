import React, { useState } from 'react';
import { ThemeSettings } from '../SurveyPreview';

interface ScaleQuestionProps {
  questionNumber: number;
  title: string;
  description?: string;
  required: boolean;
  theme: Partial<ThemeSettings>;
  error?: boolean;
  onChange?: (answer: string) => void;
}

const ScaleQuestion: React.FC<ScaleQuestionProps> = ({
  questionNumber,
  title,
  description,
  required,
  theme,
  error,
  onChange
}) => {
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [labels] = useState([
    { value: 1, label: 'Strongly Disagree' },
    { value: 2, label: 'Disagree' },
    { value: 3, label: 'Neutral' },
    { value: 4, label: 'Agree' },
    { value: 5, label: 'Strongly Agree' }
  ]);

  const handleValueChange = (value: number) => {
    setSelectedValue(value);
    onChange?.(value.toString());
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
      
      <div className="mt-4">
        <div className="flex flex-col sm:flex-row justify-between items-stretch">
          {labels.map((option) => (
            <div key={option.value} className="flex flex-col items-center mb-4 sm:mb-0">
              <button
                type="button"
                onClick={() => handleValueChange(option.value)}
                className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 focus:outline-none transition-all duration-200 ${
                  error ? 'ring-2 ring-red-500' : ''
                }`}
                style={{
                  backgroundColor: selectedValue === option.value
                    ? theme.scaleActiveColor
                    : theme.scaleInactiveColor,
                  color: selectedValue === option.value
                    ? theme.buttonTextColor
                    : theme.textColor
                }}
              >
                {option.value}
              </button>
              <span 
                className="text-xs text-center w-24"
                style={{ color: `${theme.textColor}99` }}
              >
                {option.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScaleQuestion;