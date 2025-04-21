import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSurvey } from '../../context/SurveyContext';
import { surveyTemplates } from '../../data/surveyTemplates';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { X, FileText, FileCheck } from 'lucide-react';

interface NewSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTemplateId?: string;
}

const NewSurveyModal: React.FC<NewSurveyModalProps> = ({ isOpen, onClose, initialTemplateId }) => {
  const { createSurvey } = useSurvey();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Customer Experience');
  const [templateId, setTemplateId] = useState('');
  const [useTemplate, setUseTemplate] = useState<boolean | null>(null);

  const categories = ['Customer Experience', 'Employee Engagement', 'Market Research', 'Education', 'Event'];

  useEffect(() => {
    if (initialTemplateId) {
      setUseTemplate(true);
      setTemplateId(initialTemplateId);
      setStep(2);
      
      const template = surveyTemplates.find(t => t.id === initialTemplateId);
      if (template) {
        setCategory(template.category);
      }
    }
  }, [initialTemplateId]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('Customer Experience');
    setTemplateId('');
    setUseTemplate(null);
    setStep(1);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCreateSurvey = () => {
    if (!title) return;
    
    const surveyId = createSurvey(
      title,
      description,
      category,
      useTemplate ? templateId : undefined
    );
    
    handleClose();
    navigate(`/create?id=${surveyId}`);
  };

  const handleStepOne = () => {
    if (!title) return;
    setStep(2);
  };

  const filteredTemplates = templateId 
    ? surveyTemplates.filter(t => t.id === templateId)
    : surveyTemplates.filter(t => t.category === category);

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="relative p-6">
        <button
          onClick={handleClose}
          className="absolute right-6 top-6 text-gray-400 hover:text-gray-500"
        >
          <X className="h-5 w-5" />
        </button>
        
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {step === 1 ? 'Create New Survey' : 'Choose a Template (Optional)'}
        </h2>
        
        {step === 1 ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Survey Title*
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-5 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent"
                placeholder="e.g., Customer Satisfaction Survey"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-5 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent"
                placeholder="Briefly describe the purpose of your survey"
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-5 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button onClick={handleStepOne} disabled={!title} className="bg-[#5D5FEF] hover:bg-[#5D5FEF]/90 text-white">
                Next
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => {
                    setUseTemplate(false);
                    handleCreateSurvey();
                  }}
                  className={`flex-1 p-4 border rounded-lg flex flex-col items-center justify-center transition-all ${
                    useTemplate === false
                      ? 'border-[#5D5FEF] bg-[#5D5FEF]/5'
                      : 'border-gray-200 hover:border-[#5D5FEF]/20 hover:bg-[#5D5FEF]/5'
                  }`}
                >
                  <FileText className="h-8 w-8 text-[#5D5FEF] mb-2" />
                  <span className="font-medium text-gray-900">Start from Scratch</span>
                  <span className="text-sm text-gray-500 text-center mt-1">
                    Create a custom survey with no pre-filled questions
                  </span>
                </button>
                
                <button
                  onClick={() => setUseTemplate(true)}
                  className={`flex-1 p-4 border rounded-lg flex flex-col items-center justify-center transition-all ${
                    useTemplate === true
                      ? 'border-[#5D5FEF] bg-[#5D5FEF]/5'
                      : 'border-gray-200 hover:border-[#5D5FEF]/20 hover:bg-[#5D5FEF]/5'
                  }`}
                >
                  <FileCheck className="h-8 w-8 text-[#5D5FEF] mb-2" />
                  <span className="font-medium text-gray-900">Use a Template</span>
                  <span className="text-sm text-gray-500 text-center mt-1">
                    Start with pre-built questions tailored to your needs
                  </span>
                </button>
              </div>
            </div>
            
            {useTemplate && (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Select a Template</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pb-2">
                  {filteredTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setTemplateId(template.id)}
                      className={`p-3 text-left border rounded-lg transition-all ${
                        templateId === template.id
                          ? 'border-[#5D5FEF] bg-[#5D5FEF]/5'
                          : 'border-gray-200 hover:border-[#5D5FEF]/20'
                      }`}
                    >
                      <p className="font-medium text-gray-900">{template.name}</p>
                      <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                      <p className="text-xs text-gray-400 mt-2">{template.questions.length} questions</p>
                    </button>
                  ))}
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button onClick={() => setStep(1)} className="bg-gray-100 hover:bg-gray-200 text-gray-800">
                    Back
                  </Button>
                  <Button 
                    onClick={handleCreateSurvey} 
                    disabled={useTemplate && !templateId}
                    className="bg-[#5D5FEF] hover:bg-[#5D5FEF]/90 text-white"
                  >
                    Create Survey
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default NewSurveyModal;