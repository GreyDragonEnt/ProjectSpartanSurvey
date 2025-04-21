import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { ThemeSettings } from '../SurveyPreview';

interface RatingQuestionProps {
  questionNumber: number;
  title: string;
  description?: string;
  required: boolean;
  theme: Partial<ThemeSettings>;
  error?: boolean;
  onChange?: (answer: string) => void;
  scaleSize?: 3 | 5 | 7 | 10;
  labels?: {
    start: string;
    end: string;
  };
}

const RatingQuestion: React.FC<RatingQuestionProps> = ({
  questionNumber,
  title,
  description,
  required,
  theme,
  error,
  onChange,
  scaleSize = 5,
  labels = { start: 'Poor', end: 'Excellent' }
}) => {
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleRatingChange = (value: number) => {
    setRating(value);
    onChange?.(value.toString());
  };

  const scaleValues = Array.from({ length: scaleSize }, (_, i) => i + 1);

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
      
      <div 
        className="flex justify-center space-x-2 py-4"
        onMouseLeave={() => setHoverRating(null)}
      >
        {scaleValues.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => handleRatingChange(value)}
            onMouseEnter={() => setHoverRating(value)}
            className="focus:outline-none transition-transform transform hover:scale-110"
          >
            <Star
              className={`${scaleSize > 7 ? 'h-8 w-8' : 'h-10 w-10'} ${error ? 'text-red-500' : ''}`}
              style={{
                color: (hoverRating !== null ? hoverRating >= value : rating !== null && rating >= value)
                  ? theme.ratingActiveColor
                  : theme.ratingInactiveColor,
                fill: (hoverRating !== null ? hoverRating >= value : rating !== null && rating >= value)
                  ? theme.ratingActiveColor
                  : 'none'
              }}
            />
          </button>
        ))}
      </div>
      
      <div 
        className="flex justify-between text-sm mt-2"
        style={{ color: `${theme.textColor}99` }}
      >
        <span>{labels.start}</span>
        <span>{labels.end}</span>
      </div>
    </div>
  );
};

export default RatingQuestion;