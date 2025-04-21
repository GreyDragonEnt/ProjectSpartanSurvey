import React from 'react';
import { SurveyType } from '../../context/SurveyContext';
import { Calendar, BarChart2, Edit3, Users } from 'lucide-react';

interface SurveyCardProps {
  survey: SurveyType;
  onClick: () => void;
}

const SurveyCard: React.FC<SurveyCardProps> = ({ survey, onClick }) => {
  // Format date to display in a readable format
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Determine status badge color
  const getStatusBadge = () => {
    if (survey.isPublished) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#23C4A2]/10 text-[#23C4A2]">Active</span>;
    }
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Draft</span>;
  };

  const getCategoryBadge = () => {
    const categoryColors: Record<string, { bg: string; text: string }> = {
      'Customer Experience': { bg: 'bg-[#5D5FEF]/10', text: 'text-[#5D5FEF]' },
      'Employee Engagement': { bg: 'bg-purple-100', text: 'text-purple-800' },
      'Market Research': { bg: 'bg-[#F9A826]/10', text: 'text-[#F9A826]' },
      'Education': { bg: 'bg-[#23C4A2]/10', text: 'text-[#23C4A2]' },
      'Event': { bg: 'bg-pink-100', text: 'text-pink-800' }
    };

    const colors = categoryColors[survey.category] || { bg: 'bg-gray-100', text: 'text-gray-800' };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
        {survey.category}
      </span>
    );
  };

  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          {getStatusBadge()}
          {getCategoryBadge()}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">{survey.title}</h3>
        <p className="text-gray-600 mb-4 text-sm line-clamp-2">{survey.description}</p>
        
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <Calendar className="h-4 w-4 mr-1" />
          <span>Created: {formatDate(survey.createdAt)}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="flex items-center">
            <BarChart2 className="h-4 w-4 text-[#5D5FEF] mr-2" />
            <span className="text-sm">
              <span className="font-medium">{survey.questions.length}</span> Questions
            </span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 text-[#23C4A2] mr-2" />
            <span className="text-sm">
              <span className="font-medium">{survey.responses.length}</span> Responses
            </span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
        <div className="flex items-center text-[#5D5FEF] hover:text-[#5D5FEF]/90 text-sm font-medium">
          <Edit3 className="h-4 w-4 mr-1" />
          {survey.isPublished ? 'Edit Survey' : 'Edit Draft'}
        </div>
      </div>
    </div>
  );
};

export default SurveyCard;