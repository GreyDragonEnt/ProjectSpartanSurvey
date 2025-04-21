import React, { useState } from 'react';
import { ThemeSettings } from '../SurveyPreview';

interface MultipleChoiceQuestionProps {
  questionNumber: number;
  title: string;
  description?: string;
  options: string[];
  required: boolean;
  theme: Partial<ThemeSettings>;
  error?: boolean;
  onChange?: (answer: string) => void;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  questionNumber,
  title,
  description,
  options,
  required,
  theme,
  error,
  onChange
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('');

  const handleChange = (option: string) => {
    setSelectedOption(option);
    onChange?.(option);
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
              type="radio"
              name={`question-${questionNumber}`}
              value={option}
              checked={selectedOption === option}
              onChange={() => handleChange(option)}
              className="h-4 w-4 border focus:ring-offset-0"
              style={{
                borderColor: error ? '#EF4444' : theme.inputBorderColor,
                color: theme.radioColor,
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

export default MultipleChoiceQuestion;