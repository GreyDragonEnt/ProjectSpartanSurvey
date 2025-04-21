import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSurvey } from '../context/SurveyContext';
import { ArrowLeft, BarChart2, Download, Share2 } from 'lucide-react';
import Button from '../components/ui/Button';
import SurveyReport from '../components/reports/SurveyReport';

const SurveyResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getSurvey } = useSurvey();
  const navigate = useNavigate();
  
  const [survey, setSurvey] = useState<ReturnType<typeof getSurvey>>();

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

  if (!survey) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="flex items-center text-[#5D5FEF] hover:text-[#5D5FEF]/90 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-1" />
        Back to Dashboard
      </button>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{survey.title}</h1>
          <p className="text-gray-600 mt-1">{survey.description}</p>
        </div>
      </div>

      <SurveyReport survey={survey} />
    </div>
  );
};

export default SurveyResults;