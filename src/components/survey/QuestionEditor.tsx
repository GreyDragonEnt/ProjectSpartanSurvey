import React, { useState, useEffect } from 'react';
import { Question, QuestionType } from '../../context/SurveyContext';
import { Trash2, Plus, Star } from 'lucide-react';
import Button from '../ui/Button';

interface QuestionEditorProps {
  question: Question;
  onUpdate: (updatedQuestion: Partial<Question>) => void;
  isActive: boolean;
  onActivate: () => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({ 
  question, 
  onUpdate, 
  isActive, 
  onActivate 
}) => {
  const [title, setTitle] = useState(question.title);
  const [description, setDescription] = useState(question.description || '');
  const [required, setRequired] = useState(question.required);
  const [type, setType] = useState<QuestionType>(question.type);
  const [options, setOptions] = useState<string[]>(question.options || []);
  const [scaleLabels, setScaleLabels] = useState([
    { value: 1, label: 'Strongly Disagree' },
    { value: 2, label: 'Disagree' },
    { value: 3, label: 'Neutral' },
    { value: 4, label: 'Agree' },
    { value: 5, label: 'Strongly Agree' }
  ]);
  const [ratingScale, setRatingScale] = useState({
    size: 5,
    startLabel: 'Poor',
    endLabel: 'Excellent'
  });

  useEffect(() => {
    setTitle(question.title);
    setDescription(question.description || '');
    setRequired(question.required);
    setType(question.type);
    setOptions(question.options || []);
  }, [question]);

  useEffect(() => {
    // When question type changes, set default options if needed
    if (
      (type === 'multiple-choice' || type === 'checkbox' || type === 'dropdown') && 
      (!options || options.length === 0)
    ) {
      setOptions(['Option 1', 'Option 2', 'Option 3']);
    }
  }, [type, options]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    onUpdate({ title: newTitle });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    onUpdate({ description: newDescription });
  };

  const handleRequiredChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRequired = e.target.checked;
    setRequired(newRequired);
    onUpdate({ required: newRequired });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as QuestionType;
    setType(newType);
    
    // Set default options for choice-based question types
    let newOptions = options;
    if (
      (newType === 'multiple-choice' || newType === 'checkbox' || newType === 'dropdown') && 
      (!options || options.length === 0)
    ) {
      newOptions = ['Option 1', 'Option 2', 'Option 3'];
      setOptions(newOptions);
    }
    
    onUpdate({ 
      type: newType,
      options: newOptions
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    onUpdate({ options: newOptions });
  };

  const handleAddOption = () => {
    const newOptions = [...options, `Option ${options.length + 1}`];
    setOptions(newOptions);
    onUpdate({ options: newOptions });
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return; // Keep at least 2 options
    
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    onUpdate({ options: newOptions });
  };

  const handleScaleLabelChange = (value: number, label: string) => {
    const newLabels = scaleLabels.map(l => 
      l.value === value ? { ...l, label } : l
    );
    setScaleLabels(newLabels);
    onUpdate({ 
      options: newLabels.map(l => l.label)
    });
  };

  const handleRatingScaleChange = (updates: Partial<typeof ratingScale>) => {
    const newScale = { ...ratingScale, ...updates };
    setRatingScale(newScale);
    onUpdate({
      options: [
        newScale.size.toString(),
        newScale.startLabel,
        newScale.endLabel
      ]
    });
  };

  return (
    <div className="space-y-4" onClick={onActivate}>
      <div>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="w-full px-3 py-2 text-lg font-medium border-b border-transparent focus:border-[#5D5FEF] focus:outline-none"
          placeholder="Enter question text"
        />
      </div>
      
      {isActive && (
        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={description}
              onChange={handleDescriptionChange}
              className="w-full px-3 py-2 text-sm text-gray-600 border-b border-transparent focus:border-[#5D5FEF] focus:outline-none"
              placeholder="Optional description or hint text"
            />
          </div>
          
          <div className="flex justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <label htmlFor={`type-${question.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Question Type
                </label>
                <select
                  id={`type-${question.id}`}
                  value={type}
                  onChange={handleTypeChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#5D5FEF] focus:border-[#5D5FEF] sm:text-sm rounded-md"
                >
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="dropdown">Dropdown</option>
                  <option value="text">Text</option>
                  <option value="rating">Rating</option>
                  <option value="scale">Scale</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                id={`required-${question.id}`}
                type="checkbox"
                checked={required}
                onChange={handleRequiredChange}
                className="h-4 w-4 text-[#5D5FEF] focus:ring-[#5D5FEF] border-gray-300 rounded"
              />
              <label htmlFor={`required-${question.id}`} className="ml-2 block text-sm text-gray-700">
                Required
              </label>
            </div>
          </div>
          
          {(type === 'multiple-choice' || type === 'checkbox' || type === 'dropdown') && (
            <div className="space-y-3 mt-4">
              <div className="text-sm font-medium text-gray-700">Options</div>
              {options.map((option, index) => (
                <div key={index} className="flex items-center">
                  <div className="mr-3">
                    {type === 'multiple-choice' && (
                      <div className="h-4 w-4 rounded-full border border-gray-300"></div>
                    )}
                    {type === 'checkbox' && (
                      <div className="h-4 w-4 rounded border border-gray-300"></div>
                    )}
                    {type === 'dropdown' && (
                      <span className="text-sm text-gray-500">{index + 1}.</span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#5D5FEF] focus:border-[#5D5FEF]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    disabled={options.length <= 2}
                    className={`ml-2 p-1 rounded-full ${
                      options.length <= 2 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
              <Button 
                onClick={handleAddOption}
                className="mt-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Option
              </Button>
            </div>
          )}
          
          {type === 'rating' && (
            <div className="p-4 bg-gray-50 rounded-md">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scale Size
                  </label>
                  <select
                    value={ratingScale.size}
                    onChange={(e) => handleRatingScaleChange({ size: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#5D5FEF] focus:border-[#5D5FEF]"
                  >
                    <option value={3}>3 Stars</option>
                    <option value={5}>5 Stars</option>
                    <option value={7}>7 Stars</option>
                    <option value={10}>10 Stars</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Label
                    </label>
                    <input
                      type="text"
                      value={ratingScale.startLabel}
                      onChange={(e) => handleRatingScaleChange({ startLabel: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#5D5FEF] focus:border-[#5D5FEF]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Label
                    </label>
                    <input
                      type="text"
                      value={ratingScale.endLabel}
                      onChange={(e) => handleRatingScaleChange({ endLabel: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#5D5FEF] focus:border-[#5D5FEF]"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-center space-x-2">
                    {Array.from({ length: ratingScale.size }, (_, i) => (
                      <Star
                        key={i}
                        className={`${ratingScale.size > 7 ? 'h-8 w-8' : 'h-10 w-10'} text-[#F9A826]`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {type === 'scale' && (
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600 mb-4">Customize scale labels</p>
              <div className="grid grid-cols-5 gap-4">
                {scaleLabels.map((label) => (
                  <div key={label.value} className="flex flex-col items-center">
                    <div className="h-10 w-10 rounded-full border border-gray-300 flex items-center justify-center bg-white mb-2">
                      {label.value}
                    </div>
                    <input
                      type="text"
                      value={label.label}
                      onChange={(e) => handleScaleLabelChange(label.value, e.target.value)}
                      className="w-full text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#5D5FEF] focus:border-[#5D5FEF]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionEditor;