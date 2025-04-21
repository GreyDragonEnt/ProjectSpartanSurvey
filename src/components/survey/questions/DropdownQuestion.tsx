import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { ThemeSettings } from '../SurveyPreview';

interface DropdownQuestionProps {
  questionNumber: number;
  title: string;
  description?: string;
  options: string[];
  required: boolean;
  theme: Partial<ThemeSettings>;
  error?: boolean;
  onChange?: (answer: string) => void;
}

const DropdownQuestion: React.FC<DropdownQuestionProps> = ({
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

  const handleChange = (value: string) => {
    setSelectedOption(value);
    onChange?.(value);
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
      
      <div className="relative">
        <select
          value={selectedOption}
          className="block w-full pl-3 pr-10 py-2 rounded-md appearance-none focus:outline-none focus:ring-2 transition-colors duration-200"
          style={{
            borderColor: error ? '#EF4444' : theme.dropdownBorderColor,
            color: theme.textColor,
            backgroundColor: 'transparent',
            '--tw-ring-color': theme.accentColor,
            '--tw-ring-offset-color': theme.questionColor,
            '--tw-ring-offset-width': '0px'
          } as React.CSSProperties}
          onChange={(e) => handleChange(e.target.value)}
        >
          <option value="" disabled>Select an option</option>
          {options.map((option, index) => (
            <option 
              key={index} 
              value={option}
              style={{ color: theme.textColor }}
            >
              {option}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <ChevronDown 
            className="h-5 w-5"
            style={{ color: theme.accentColor }}
          />
        </div>
      </div>
    </div>
  );
};

export default DropdownQuestion;