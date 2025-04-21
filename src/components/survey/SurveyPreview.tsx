import React, { useState } from 'react';
import { Question } from '../../context/SurveyContext';
import MultipleChoiceQuestion from './questions/MultipleChoiceQuestion';
import CheckboxQuestion from './questions/CheckboxQuestion';
import TextQuestion from './questions/TextQuestion';
import RatingQuestion from './questions/RatingQuestion';
import ScaleQuestion from './questions/ScaleQuestion';
import DropdownQuestion from './questions/DropdownQuestion';

interface ThemeSettings {
  backgroundColor: string;
  questionColor: string;
  textColor: string;
  accentColor: string;
  borderColor: string;
  inputBorderColor: string;
  inputFocusColor: string;
  buttonTextColor: string;
  buttonHoverColor: string;
  radioColor: string;
  checkboxColor: string;
  dropdownBorderColor: string;
  ratingActiveColor: string;
  ratingInactiveColor: string;
  scaleActiveColor: string;
  scaleInactiveColor: string;
  headerTextColor: string;
  descriptionTextColor: string;
}

interface SurveyPreviewProps {
  title: string;
  description: string;
  questions: Question[];
  theme?: Partial<ThemeSettings>;
  onSubmit?: (answers: { questionId: string; answer: string | string[] }[]) => void;
}

const defaultTheme: ThemeSettings = {
  backgroundColor: '#F4F5F7',
  questionColor: '#FFFFFF',
  textColor: '#111827',
  accentColor: '#5D5FEF',
  borderColor: '#E5E7EB',
  inputBorderColor: '#D1D5DB',
  inputFocusColor: '#5D5FEF',
  buttonTextColor: '#FFFFFF',
  buttonHoverColor: '#4F46E5',
  radioColor: '#5D5FEF',
  checkboxColor: '#5D5FEF',
  dropdownBorderColor: '#D1D5DB',
  ratingActiveColor: '#F9A826',
  ratingInactiveColor: '#E5E7EB',
  scaleActiveColor: '#23C4A2',
  scaleInactiveColor: '#E5E7EB',
  headerTextColor: '#FFFFFF',
  descriptionTextColor: 'rgba(255, 255, 255, 0.9)'
};

const SurveyPreview: React.FC<SurveyPreviewProps> = ({ 
  title, 
  description, 
  questions,
  theme: customTheme = {},
  onSubmit
}) => {
  const theme = { ...defaultTheme, ...customTheme };
  const [answers, setAnswers] = useState<{ questionId: string; answer: string | string[] }[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setAnswers(prev => {
      const existing = prev.findIndex(a => a.questionId === questionId);
      if (existing !== -1) {
        const newAnswers = [...prev];
        newAnswers[existing] = { questionId, answer };
        return newAnswers;
      }
      return [...prev, { questionId, answer }];
    });
    
    // Clear error for this question when answered
    setErrors(prev => prev.filter(id => id !== questionId));
  };

  const handleSubmit = () => {
    // Validate required questions
    const requiredQuestions = questions.filter(q => q.required);
    const unansweredQuestions = requiredQuestions.filter(q => {
      const answer = answers.find(a => a.questionId === q.id);
      if (!answer) return true;
      
      if (Array.isArray(answer.answer)) {
        return answer.answer.length === 0;
      }
      
      return answer.answer === '';
    });

    if (unansweredQuestions.length > 0) {
      setErrors(unansweredQuestions.map(q => q.id));
      return;
    }

    if (onSubmit) {
      onSubmit(answers);
    }
  };

  const renderQuestion = (question: Question, index: number) => {
    const commonProps = {
      questionNumber: index + 1,
      title: question.title,
      description: question.description,
      required: question.required,
      theme,
      error: errors.includes(question.id),
      onChange: (answer: string | string[]) => handleAnswerChange(question.id, answer)
    };

    switch (question.type) {
      case 'multiple-choice':
        return (
          <MultipleChoiceQuestion
            {...commonProps}
            options={question.options || []}
          />
        );
      case 'checkbox':
        return (
          <CheckboxQuestion
            {...commonProps}
            options={question.options || []}
          />
        );
      case 'text':
        return <TextQuestion {...commonProps} />;
      case 'rating':
        return <RatingQuestion {...commonProps} />;
      case 'scale':
        return <ScaleQuestion {...commonProps} />;
      case 'dropdown':
        return (
          <DropdownQuestion
            {...commonProps}
            options={question.options || []}
          />
        );
      default:
        return <div>Unsupported question type</div>;
    }
  };

  return (
    <div 
      className="max-w-3xl mx-auto rounded-lg shadow-sm overflow-hidden"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <div 
        className="p-8 border-b"
        style={{ 
          backgroundColor: theme.accentColor,
          borderColor: theme.borderColor
        }}
      >
        <h1 
          className="text-2xl font-bold"
          style={{ color: theme.headerTextColor }}
        >
          {title || 'Untitled Survey'}
        </h1>
        {description && (
          <p 
            className="mt-2"
            style={{ color: theme.descriptionTextColor }}
          >
            {description}
          </p>
        )}
      </div>
      
      <div className="p-6">
        {questions.length > 0 ? (
          <div className="space-y-8">
            {questions.map((question, index) => (
              <div 
                key={question.id} 
                className={`border rounded-lg ${errors.includes(question.id) ? 'border-red-500 ring-2 ring-red-100' : ''}`}
                style={{ 
                  backgroundColor: theme.questionColor,
                  borderColor: errors.includes(question.id) ? undefined : theme.borderColor
                }}
              >
                <div className="p-6">
                  {renderQuestion(question, index)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p style={{ color: theme.textColor }}>No questions added yet.</p>
          </div>
        )}
        
        {questions.length > 0 && (
          <div className="mt-8 flex justify-end">
            <button 
              onClick={handleSubmit}
              className="px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
              style={{ 
                backgroundColor: theme.accentColor,
                color: theme.buttonTextColor,
                borderColor: theme.accentColor
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = theme.buttonHoverColor;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = theme.accentColor;
              }}
            >
              Submit
            </button>
          </div>
        )}

        {errors.length > 0 && (
          <div className="mt-4 p-4 bg-red-50 rounded-md border border-red-200">
            <p className="text-red-600 text-sm">
              Please answer all required questions before submitting.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyPreview;