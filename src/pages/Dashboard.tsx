import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSurvey } from '../context/SurveyContext';
import { PlusCircle, Search, Filter, BarChart4, Users, Clock, ChevronDown } from 'lucide-react';
import SurveyCard from '../components/survey/SurveyCard';
import Button from '../components/ui/Button';
import NewSurveyModal from '../components/modals/NewSurveyModal';

const Dashboard: React.FC = () => {
  const { surveys } = useSurvey();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  const filteredSurveys = surveys
    .filter(survey => {
      const matchesSearch = survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         survey.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || survey.category === filter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === 'responses') {
        return b.responses.length - a.responses.length;
      }
      return 0;
    });

  const categories = ['Customer Experience', 'Employee Engagement', 'Market Research', 'Education', 'Event'];
  
  const stats = [
    { label: 'Total Surveys', value: surveys.length, icon: <BarChart4 className="h-5 w-5 text-[#5D5FEF]" /> },
    { label: 'Active Surveys', value: surveys.filter(s => s.isPublished).length, icon: <Clock className="h-5 w-5 text-[#23C4A2]" /> },
    { label: 'Total Responses', value: surveys.reduce((acc, survey) => acc + survey.responses.length, 0), icon: <Users className="h-5 w-5 text-[#F9A826]" /> },
  ];

  const handleSurveyClick = (survey: typeof surveys[0]) => {
    if (survey.isPublished) {
      navigate(`/create?id=${survey.id}`);
    } else {
      navigate(`/create?id=${survey.id}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Survey Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage and analyze your surveys</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="mt-4 md:mt-0 bg-[#5D5FEF] hover:bg-[#5D5FEF]/90 text-white"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Create New Survey
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6 flex items-center">
            <div className="rounded-full bg-gray-100 p-3 mr-4">
              {stat.icon}
            </div>
            <div>
              <h3 className="text-gray-600 text-sm">{stat.label}</h3>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search surveys..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md pl-10 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="responses">Most Responses</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {filteredSurveys.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSurveys.map(survey => (
              <SurveyCard 
                key={survey.id} 
                survey={survey} 
                onClick={() => handleSurveyClick(survey)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No surveys found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filter !== 'all' ? 
                'Try adjusting your search or filters' : 
                'Create your first survey to get started'}
            </p>
            {!searchTerm && filter === 'all' && (
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="bg-[#5D5FEF] hover:bg-[#5D5FEF]/90 text-white"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Create New Survey
              </Button>
            )}
          </div>
        )}
      </div>

      <NewSurveyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Dashboard;