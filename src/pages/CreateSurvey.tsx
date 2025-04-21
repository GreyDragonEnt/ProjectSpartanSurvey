import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSurvey } from '../context/SurveyContext';
import { Plus, Save, Eye, ChevronDown, ChevronUp, MoreHorizontal, Copy, Trash2, Settings, BookmarkPlus } from 'lucide-react';
import QuestionEditor from '../components/survey/QuestionEditor';
import Button from '../components/ui/Button';
import SurveyPreview from '../components/survey/SurveyPreview';
import useToast from '../hooks/useToast';
import SettingsModal from '../components/modals/SettingsModal';
import SaveAsTemplateModal from '../components/modals/SaveAsTemplateModal';
import Dropdown from '../components/ui/Dropdown';

const CreateSurvey: React.FC = () => {
  const { getSurvey, updateSurvey, addQuestion, updateQuestion, removeQuestion, publishSurvey } = useSurvey();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  
  const [survey, setSurvey] = useState<ReturnType<typeof getSurvey>>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [theme, setTheme] = useState({
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
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) {
      const surveyData = getSurvey(id);
      if (surveyData) {
        setSurvey(surveyData);
        setTitle(surveyData.title);
        setDescription(surveyData.description);
      } else {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [getSurvey, location, navigate]);

  const handleSave = () => {
    if (survey) {
      updateSurvey(survey.id, {
        title,
        description
      });
      showToast('Survey saved successfully', 'success');
    }
  };

  const handlePublish = () => {
    if (survey) {
      if (survey.questions.length === 0) {
        showToast('Cannot publish a survey with no questions', 'error');
        return;
      }
      
      publishSurvey(survey.id);
      showToast('Survey published successfully', 'success');
      navigate('/');
    }
  };

  const handleAddQuestion = () => {
    if (survey) {
      const newQuestion = {
        type: 'multiple-choice',
        title: 'New Question',
        required: false,
        options: ['Option 1', 'Option 2', 'Option 3']
      };
      
      addQuestion(survey.id, newQuestion);
      
      // Update local state
      setSurvey(getSurvey(survey.id));
    }
  };

  const handleUpdateQuestion = (questionId: string, updatedQuestion: Partial<Question>) => {
    if (survey) {
      updateQuestion(survey.id, questionId, updatedQuestion);
      
      // Update local state
      setSurvey(getSurvey(survey.id));
    }
  };

  const handleRemoveQuestion = (questionId: string) => {
    if (survey) {
      removeQuestion(survey.id, questionId);
      
      // Update local state
      setSurvey(getSurvey(survey.id));
      
      // Clear active question if it was deleted
      if (activeQuestionId === questionId) {
        setActiveQuestionId(null);
      }
    }
  };

  const handleDuplicateQuestion = (questionId: string) => {
    if (survey) {
      const questionToDuplicate = survey.questions.find(q => q.id === questionId);
      if (questionToDuplicate) {
        const { id, ...questionWithoutId } = questionToDuplicate;
        addQuestion(survey.id, {
          ...questionWithoutId,
          title: `${questionWithoutId.title} (Copy)`
        });
        
        // Update local state
        setSurvey(getSurvey(survey.id));
      }
    }
  };

  const handleMoveQuestion = (questionId: string, direction: 'up' | 'down') => {
    if (survey) {
      const currentIndex = survey.questions.findIndex(q => q.id === questionId);
      if (currentIndex === -1) return;
      
      const newQuestions = [...survey.questions];
      
      if (direction === 'up' && currentIndex > 0) {
        [newQuestions[currentIndex], newQuestions[currentIndex - 1]] = 
        [newQuestions[currentIndex - 1], newQuestions[currentIndex]];
      } else if (direction === 'down' && currentIndex < newQuestions.length - 1) {
        [newQuestions[currentIndex], newQuestions[currentIndex + 1]] = 
        [newQuestions[currentIndex + 1], newQuestions[currentIndex]];
      } else {
        return;
      }
      
      updateSurvey(survey.id, { questions: newQuestions });
      
      // Update local state
      setSurvey(getSurvey(survey.id));
    }
  };

  const handleThemeChange = (brandingSettings: any) => {
    setTheme({
      ...theme,
      backgroundColor: brandingSettings.backgroundColor,
      questionColor: brandingSettings.backgroundColor,
      textColor: brandingSettings.textColor,
      accentColor: brandingSettings.primaryColor,
      borderColor: brandingSettings.borderColor || theme.borderColor,
      inputBorderColor: brandingSettings.borderColor || theme.inputBorderColor,
      inputFocusColor: brandingSettings.primaryColor,
      buttonTextColor: '#FFFFFF',
      buttonHoverColor: brandingSettings.secondaryColor,
      radioColor: brandingSettings.primaryColor,
      checkboxColor: brandingSettings.primaryColor,
      dropdownBorderColor: brandingSettings.borderColor || theme.dropdownBorderColor,
      ratingActiveColor: brandingSettings.accentColor,
      ratingInactiveColor: theme.ratingInactiveColor,
      scaleActiveColor: brandingSettings.secondaryColor,
      scaleInactiveColor: theme.scaleInactiveColor,
      headerTextColor: '#FFFFFF',
      descriptionTextColor: 'rgba(255, 255, 255, 0.9)'
    });
  };

  if (!survey) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl font-bold text-gray-900">
            {survey.isPublished ? 'Edit Survey' : 'Create Survey'}
          </h1>
          <p className="text-gray-600 mt-1">
            {survey.isPublished ? 'Make changes to your published survey' : 'Design your survey and add questions'}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button 
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800"
          >
            <Eye className="h-5 w-5 mr-2" />
            {isPreviewMode ? 'Edit' : 'Preview'}
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800"
          >
            <Save className="h-5 w-5 mr-2" />
            Save
          </Button>
          <Button 
            onClick={() => setIsTemplateModalOpen(true)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800"
          >
            <BookmarkPlus className="h-5 w-5 mr-2" />
            Save as Template
          </Button>
          <Button 
            onClick={() => setIsSettingsModalOpen(true)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800"
          >
            <Settings className="h-5 w-5 mr-2" />
            Settings
          </Button>
          {!survey.isPublished && (
            <Button 
              onClick={handlePublish}
              className="bg-[#5D5FEF] hover:bg-[#5D5FEF]/90 text-white"
            >
              Publish
            </Button>
          )}
        </div>
      </div>

      {isPreviewMode ? (
        <SurveyPreview 
          title={title}
          description={description}
          questions={survey.questions}
          theme={theme}
        />
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-8">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Survey Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 text-xl font-semibold border-b border-gray-300 focus:outline-none focus:border-[#5D5FEF]"
              placeholder="Enter survey title"
            />
          </div>
          
          <div className="mb-8">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border-b border-gray-300 focus:outline-none focus:border-[#5D5FEF]"
              placeholder="Enter survey description"
              rows={2}
            />
          </div>

          <div className="space-y-6">
            {survey.questions.map((question, index) => (
              <div 
                key={question.id}
                className={`border rounded-lg ${activeQuestionId === question.id ? 'border-[#5D5FEF] ring-2 ring-[#5D5FEF]/10' : 'border-gray-200'}`}
              >
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-t-lg">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 mr-3">Question {index + 1}</span>
                    <span className="text-sm text-gray-500">{question.type}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button 
                      onClick={() => handleMoveQuestion(question.id, 'up')}
                      disabled={index === 0}
                      className={`p-1 rounded-full ${index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-200'}`}
                    >
                      <ChevronUp className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleMoveQuestion(question.id, 'down')}
                      disabled={index === survey.questions.length - 1}
                      className={`p-1 rounded-full ${index === survey.questions.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-200'}`}
                    >
                      <ChevronDown className="h-5 w-5" />
                    </button>
                    
                    <Dropdown
                      trigger={
                        <button className="p-1 rounded-full text-gray-500 hover:bg-gray-200">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      }
                      items={[
                        {
                          label: 'Duplicate',
                          icon: <Copy className="h-4 w-4 mr-2" />,
                          onClick: () => handleDuplicateQuestion(question.id)
                        },
                        {
                          label: 'Delete',
                          icon: <Trash2 className="h-4 w-4 mr-2" />,
                          onClick: () => handleRemoveQuestion(question.id),
                          className: 'text-red-600 hover:bg-red-50'
                        }
                      ]}
                    />
                  </div>
                </div>
                
                <div className="p-4">
                  <QuestionEditor
                    question={question}
                    onUpdate={(updatedQuestion) => handleUpdateQuestion(question.id, updatedQuestion)}
                    isActive={activeQuestionId === question.id}
                    onActivate={() => setActiveQuestionId(question.id)}
                  />
                </div>
              </div>
            ))}
            
            <Button 
              onClick={handleAddQuestion}
              className="mt-4 w-full py-3 bg-[#5D5FEF]/5 hover:bg-[#5D5FEF]/10 text-[#5D5FEF] border border-[#5D5FEF]/20 border-dashed"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Question
            </Button>
          </div>
        </div>
      )}

      <SettingsModal 
        isOpen={isSettingsModalOpen} 
        onClose={() => setIsSettingsModalOpen(false)}
        survey={survey}
        onThemeChange={handleThemeChange}
      />

      <SaveAsTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        survey={survey}
      />
    </div>
  );
};

export default CreateSurvey;