import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSurvey } from '../context/SurveyContext';
import { surveyTemplates } from '../data/surveyTemplates';
import { Search, Filter, ChevronDown, FileText } from 'lucide-react';
import Button from '../components/ui/Button';
import NewSurveyModal from '../components/modals/NewSurveyModal';

const Templates: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const categories = ['Customer Experience', 'Employee Engagement', 'Market Research', 'Education', 'Event'];

  const filteredTemplates = surveyTemplates.filter(template => {
    const matchesSearch = 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Survey Templates</h1>
          <p className="text-gray-600 mt-1">Start with pre-built templates for common use cases</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md pl-10 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      template.category === 'Customer Experience' ? 'bg-blue-100 text-blue-800' :
                      template.category === 'Employee Engagement' ? 'bg-purple-100 text-purple-800' :
                      template.category === 'Market Research' ? 'bg-yellow-100 text-yellow-800' :
                      template.category === 'Education' ? 'bg-green-100 text-green-800' :
                      'bg-pink-100 text-pink-800'
                    }`}>
                      {template.category}
                    </span>
                    <h3 className="mt-2 text-lg font-semibold text-gray-900">{template.name}</h3>
                  </div>
                  <div className="ml-4">
                    <FileText className="h-6 w-6 text-gray-400" />
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">{template.description}</p>
                <div className="mt-4">
                  <div className="text-sm text-gray-500">
                    {template.questions.length} questions
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <Button
                  onClick={() => handleUseTemplate(template.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Use Template
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      <NewSurveyModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTemplate('');
        }}
        initialTemplateId={selectedTemplate}
      />
    </div>
  );
};

export default Templates;