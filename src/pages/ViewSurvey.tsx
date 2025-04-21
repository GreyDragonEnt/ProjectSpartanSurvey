import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSurvey } from '../context/SurveyContext';
import { ArrowLeft, Share2, Palette, Globe } from 'lucide-react';
import SurveyPreview from '../components/survey/SurveyPreview';
import Button from '../components/ui/Button';
import useToast from '../hooks/useToast';
import ShareSurveyModal from '../components/modals/ShareSurveyModal';

const ViewSurvey: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getSurvey, addResponse } = useSurvey();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [survey, setSurvey] = useState<ReturnType<typeof getSurvey>>();
  const [submitted, setSubmitted] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
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
    if (id) {
      const surveyData = getSurvey(id);
      if (surveyData) {
        setSurvey(surveyData);
      } else {
        navigate('/');
      }
    }
  }, [getSurvey, id, navigate]);

  const handleSubmit = (answers: { questionId: string; answer: string | string[] }[]) => {
    if (!survey) return;

    try {
      addResponse(survey.id, answers);
      setSubmitted(true);
      showToast('Survey submitted successfully!', 'success');
    } catch (error) {
      showToast('Failed to submit survey. Please try again.', 'error');
    }
  };

  const handleDeploy = () => {
    if (!survey) return;
  };

  if (!survey) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (submitted) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-[#23C4A2]/20 mb-6">
            <svg className="w-8 h-8 text-[#23C4A2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">Your response has been recorded.</p>
          <Button 
            onClick={() => navigate('/')}
            className="bg-[#5D5FEF] hover:bg-[#5D5FEF]/90 text-white"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-[#5D5FEF] hover:text-[#5D5FEF]/90"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Dashboard
        </button>
        
        <div className="flex space-x-2">
          <Button
            onClick={() => setIsCustomizing(!isCustomizing)}
            className="bg-[#F4F5F7] hover:bg-[#F4F5F7]/90 text-gray-800"
          >
            <Palette className="h-5 w-5 mr-2" />
            {isCustomizing ? 'Hide Customization' : 'Customize'}
          </Button>
          
          {survey.isPublished && (
            <>
              <Button
                onClick={() => setIsShareModalOpen(true)}
                className="bg-[#5D5FEF] hover:bg-[#5D5FEF]/90 text-white"
              >
                <Share2 className="h-5 w-5 mr-2" />
                Share Survey
              </Button>
              <Button
                onClick={handleDeploy}
                className="bg-[#23C4A2] hover:bg-[#23C4A2]/90 text-white"
              >
                <Globe className="h-5 w-5 mr-2" />
                Deploy
              </Button>
            </>
          )}
        </div>
      </div>

      {isCustomizing && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Customize Appearance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Background Color
              </label>
              <div className="flex">
                <input
                  type="color"
                  value={theme.backgroundColor}
                  onChange={(e) => setTheme(prev => ({ ...prev, backgroundColor: e.target.value }))}
                  className="h-9 w-9 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={theme.backgroundColor}
                  onChange={(e) => setTheme(prev => ({ ...prev, backgroundColor: e.target.value }))}
                  className="flex-1 ml-2 px-3 py-1 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question Color
              </label>
              <div className="flex">
                <input
                  type="color"
                  value={theme.questionColor}
                  onChange={(e) => setTheme(prev => ({ ...prev, questionColor: e.target.value }))}
                  className="h-9 w-9 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={theme.questionColor}
                  onChange={(e) => setTheme(prev => ({ ...prev, questionColor: e.target.value }))}
                  className="flex-1 ml-2 px-3 py-1 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text Color
              </label>
              <div className="flex">
                <input
                  type="color"
                  value={theme.textColor}
                  onChange={(e) => setTheme(prev => ({ ...prev, textColor: e.target.value }))}
                  className="h-9 w-9 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={theme.textColor}
                  onChange={(e) => setTheme(prev => ({ ...prev, textColor: e.target.value }))}
                  className="flex-1 ml-2 px-3 py-1 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Accent Color
              </label>
              <div className="flex">
                <input
                  type="color"
                  value={theme.accentColor}
                  onChange={(e) => setTheme(prev => ({ ...prev, accentColor: e.target.value }))}
                  className="h-9 w-9 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={theme.accentColor}
                  onChange={(e) => setTheme(prev => ({ ...prev, accentColor: e.target.value }))}
                  className="flex-1 ml-2 px-3 py-1 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      <SurveyPreview
        title={survey.title}
        description={survey.description}
        questions={survey.questions}
        theme={theme}
        onSubmit={handleSubmit}
      />

      <ShareSurveyModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        surveyId={survey.id}
        surveyTitle={survey.title}
      />
    </div>
  );
};

export default ViewSurvey;