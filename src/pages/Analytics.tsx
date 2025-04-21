import React, { useState } from 'react';
import { useSurvey } from '../context/SurveyContext';
import { BarChart2, TrendingUp, Users, ArrowUp, ArrowDown, Calendar, Filter, ChevronDown } from 'lucide-react';

const Analytics: React.FC = () => {
  const { surveys } = useSurvey();
  const [timeRange, setTimeRange] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = ['Customer Experience', 'Employee Engagement', 'Market Research', 'Education', 'Event'];

  // Calculate total responses
  const totalResponses = surveys.reduce((acc, survey) => acc + survey.responses.length, 0);

  // Calculate response rate
  const totalSurveys = surveys.length;
  const averageResponseRate = totalSurveys > 0
    ? Math.round((totalResponses / totalSurveys) * 100)
    : 0;

  // Get active surveys count
  const activeSurveys = surveys.filter(s => s.isPublished).length;

  // Calculate completion rate
  const completedResponses = surveys.reduce((acc, survey) => {
    return acc + survey.responses.filter(response => 
      response.answers.length === survey.questions.length
    ).length;
  }, 0);
  const completionRate = totalResponses > 0
    ? Math.round((completedResponses / totalResponses) * 100)
    : 0;

  // Calculate responses by category
  const responsesByCategory = categories.map(category => {
    const surveysInCategory = surveys.filter(s => s.category === category);
    const responses = surveysInCategory.reduce((acc, survey) => acc + survey.responses.length, 0);
    return { category, responses };
  }).sort((a, b) => b.responses - a.responses);

  // Get recent responses
  const recentResponses = surveys.flatMap(survey => 
    survey.responses.map(response => ({
      surveyTitle: survey.title,
      submittedAt: response.submittedAt,
      category: survey.category
    }))
  ).sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
  .slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your survey performance and insights</p>
        </div>
        
        <div className="flex gap-4 mt-4 md:mt-0">
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last Quarter</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Responses</p>
              <p className="text-2xl font-bold text-gray-900">{totalResponses}</p>
            </div>
            <div className="rounded-full bg-blue-100 p-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">12%</span>
            <span className="text-gray-500 ml-2">vs last period</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Response Rate</p>
              <p className="text-2xl font-bold text-gray-900">{averageResponseRate}%</p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">8%</span>
            <span className="text-gray-500 ml-2">vs last period</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Surveys</p>
              <p className="text-2xl font-bold text-gray-900">{activeSurveys}</p>
            </div>
            <div className="rounded-full bg-purple-100 p-3">
              <BarChart2 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
            <span className="text-red-500 font-medium">3%</span>
            <span className="text-gray-500 ml-2">vs last period</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
            </div>
            <div className="rounded-full bg-yellow-100 p-3">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">5%</span>
            <span className="text-gray-500 ml-2">vs last period</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Responses by Category</h2>
          <div className="space-y-4">
            {responsesByCategory.map(({ category, responses }) => (
              <div key={category}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-600">{category}</span>
                  <span className="text-sm text-gray-900">{responses}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${Math.round((responses / totalResponses) * 100)}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Responses</h2>
          <div className="space-y-4">
            {recentResponses.map((response, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{response.surveyTitle}</p>
                  <p className="text-sm text-gray-500">{response.category}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(response.submittedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;