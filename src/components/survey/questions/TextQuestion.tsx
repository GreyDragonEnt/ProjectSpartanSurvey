import React, { useState } from 'react';
import { ThemeSettings } from '../SurveyPreview';

interface TextQuestionProps {
  questionNumber: number;
  title: string;
  description?: string;
  required: boolean;
  theme: Partial<ThemeSettings>;
  error?: boolean;
  onChange?: (answer: string) => void;
}

const TextQuestion: React.FC<TextQuestionProps> = ({
  questionNumber,
  title,
  description,
  required,
  theme,
  error,
  onChange
}) => {
  const [text, setText] = useState('');

  const handleChange = (value: string) => {
    setText(value);
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
      
      <div>
        <textarea
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
          rows={3}
          placeholder="Your answer"
          style={{
            borderColor: error ? '#EF4444' : theme.inputBorderColor,
            color: theme.textColor,
            backgroundColor: 'transparent',
            '--tw-ring-color': theme.inputFocusColor,
            '--tw-ring-offset-color': theme.questionColor
          } as React.CSSProperties}
        />
      </div>
    </div>
  );
};

export default TextQuestion;