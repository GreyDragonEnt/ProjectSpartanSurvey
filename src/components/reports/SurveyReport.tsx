import React, { useState } from 'react';
import { SurveyType } from '../../context/SurveyContext';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { File, Mail, FileText, FileSpreadsheet } from 'lucide-react';
import Button from '../ui/Button';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import useToast from '../../hooks/useToast';

ChartJS.register(...registerables);

interface SurveyReportProps {
  survey: SurveyType;
}

const SurveyReport: React.FC<SurveyReportProps> = ({ survey }) => {
  const { showToast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');

  const getResponseData = () => {
    const data = {
      totalResponses: survey.responses.length,
      completionRate: calculateCompletionRate(),
      questionStats: calculateQuestionStats(),
      responseOverTime: calculateResponseOverTime(),
    };
    return data;
  };

  const calculateCompletionRate = () => {
    const completed = survey.responses.filter(r => 
      r.answers.length === survey.questions.length
    ).length;
    return (completed / survey.responses.length) * 100;
  };

  const calculateQuestionStats = () => {
    return survey.questions.map(question => {
      const answers = survey.responses
        .map(r => r.answers.find(a => a.questionId === question.id))
        .filter(Boolean);

      switch (question.type) {
        case 'multiple-choice':
        case 'dropdown':
          return {
            question: question.title,
            type: question.type,
            stats: question.options?.reduce((acc, option) => {
              acc[option] = answers.filter(a => a?.answer === option).length;
              return acc;
            }, {} as Record<string, number>)
          };
        case 'rating':
        case 'scale':
          return {
            question: question.title,
            type: question.type,
            stats: {
              average: answers.reduce((sum, a) => sum + Number(a?.answer || 0), 0) / answers.length,
              distribution: Array.from({ length: 5 }, (_, i) => i + 1).reduce((acc, rating) => {
                acc[rating] = answers.filter(a => Number(a?.answer) === rating).length;
                return acc;
              }, {} as Record<number, number>)
            }
          };
        default:
          return {
            question: question.title,
            type: question.type,
            stats: {
              responses: answers.length,
              answers: answers.map(a => a?.answer)
            }
          };
      }
    });
  };

  const calculateResponseOverTime = () => {
    const responsesByDate = survey.responses.reduce((acc, response) => {
      const date = new Date(response.submittedAt).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      labels: Object.keys(responsesByDate),
      data: Object.values(responsesByDate)
    };
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF();
      const data = getResponseData();
      
      // Title
      doc.setFontSize(20);
      doc.text(survey.title, 20, 20);
      
      // Description
      doc.setFontSize(12);
      doc.text(survey.description || '', 20, 30);
      
      // Summary
      doc.setFontSize(14);
      doc.text('Summary', 20, 50);
      doc.setFontSize(12);
      doc.text(`Total Responses: ${data.totalResponses}`, 20, 60);
      doc.text(`Completion Rate: ${data.completionRate.toFixed(1)}%`, 20, 70);
      
      // Question Stats
      let yPos = 90;
      data.questionStats.forEach((stat, index) => {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.setFontSize(14);
        doc.text(`Question ${index + 1}: ${stat.question}`, 20, yPos);
        yPos += 10;
        
        doc.setFontSize(12);
        if (stat.type === 'multiple-choice' || stat.type === 'dropdown') {
          Object.entries(stat.stats).forEach(([option, count]) => {
            doc.text(`${option}: ${count}`, 30, yPos);
            yPos += 10;
          });
        } else if (stat.type === 'rating' || stat.type === 'scale') {
          doc.text(`Average: ${stat.stats.average.toFixed(1)}`, 30, yPos);
          yPos += 20;
        }
        
        yPos += 10;
      });

      doc.save(`${survey.title}_Report.pdf`);
      showToast('Report exported to PDF successfully', 'success');
    } catch (error) {
      showToast('Failed to export PDF', 'error');
    }
    setIsExporting(false);
  };

  const exportToExcel = () => {
    try {
      const data = getResponseData();
      const ws = XLSX.utils.json_to_sheet([
        { 
          'Survey Title': survey.title,
          'Total Responses': data.totalResponses,
          'Completion Rate': `${data.completionRate.toFixed(1)}%`
        }
      ]);
      
      // Add question stats
      const questionData = data.questionStats.map(stat => ({
        'Question': stat.question,
        'Type': stat.type,
        'Stats': JSON.stringify(stat.stats)
      }));
      
      XLSX.utils.sheet_add_json(ws, questionData, { origin: 'A4' });
      
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Survey Report');
      XLSX.writeFile(wb, `${survey.title}_Report.xlsx`);
      
      showToast('Report exported to Excel successfully', 'success');
    } catch (error) {
      showToast('Failed to export Excel file', 'error');
    }
  };

  const exportToCSV = () => {
    try {
      const data = getResponseData();
      const csvData = [
        ['Survey Title', survey.title],
        ['Total Responses', data.totalResponses.toString()],
        ['Completion Rate', `${data.completionRate.toFixed(1)}%`],
        [],
        ['Question Stats'],
        ['Question', 'Type', 'Stats']
      ];
      
      data.questionStats.forEach(stat => {
        csvData.push([
          stat.question,
          stat.type,
          JSON.stringify(stat.stats)
        ]);
      });
      
      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${survey.title}_Report.csv`;
      link.click();
      
      showToast('Report exported to CSV successfully', 'success');
    } catch (error) {
      showToast('Failed to export CSV file', 'error');
    }
  };

  const sendReportEmail = async () => {
    if (!recipientEmail) {
      showToast('Please enter a recipient email', 'error');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          reportUrl: window.location.href,
          recipientEmail,
          surveyTitle: survey.title
        })
      });

      if (!response.ok) throw new Error('Failed to send email');

      showToast('Report sent successfully', 'success');
      setIsEmailModalOpen(false);
      setRecipientEmail('');
    } catch (error) {
      showToast('Failed to send email', 'error');
    }
  };

  const responseData = getResponseData();

  return (
    <div className="space-y-8">
      {/* Export Options */}
      <div className="flex flex-wrap gap-4">
        <Button
          onClick={exportToPDF}
          disabled={isExporting}
          className="bg-[#5D5FEF] hover:bg-[#5D5FEF]/90 text-white"
        >
          <File className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
        <Button
          onClick={exportToExcel}
          className="bg-[#23C4A2] hover:bg-[#23C4A2]/90 text-white"
        >
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export Excel
        </Button>
        <Button
          onClick={exportToCSV}
          className="bg-[#F9A826] hover:bg-[#F9A826]/90 text-white"
        >
          <FileText className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
        <Button
          onClick={() => setIsEmailModalOpen(true)}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800"
        >
          <Mail className="h-4 w-4 mr-2" />
          Email Report
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Responses</h3>
          <p className="text-3xl font-bold text-[#5D5FEF]">{responseData.totalResponses}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Completion Rate</h3>
          <p className="text-3xl font-bold text-[#23C4A2]">{responseData.completionRate.toFixed(1)}%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Average Time</h3>
          <p className="text-3xl font-bold text-[#F9A826]">
            {survey.metrics.averageCompletionTime.toFixed(1)} min
          </p>
        </div>
      </div>

      {/* Response Trend */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Response Trend</h3>
        <Line
          data={{
            labels: responseData.responseOverTime.labels,
            datasets: [{
              label: 'Responses',
              data: responseData.responseOverTime.data,
              borderColor: '#5D5FEF',
              backgroundColor: '#5D5FEF20',
              fill: true
            }]
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: false
              }
            }
          }}
        />
      </div>

      {/* Question Stats */}
      <div className="space-y-6">
        {responseData.questionStats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Question {index + 1}: {stat.question}
            </h3>
            
            {(stat.type === 'multiple-choice' || stat.type === 'dropdown') && (
              <div className="h-64">
                <Bar
                  data={{
                    labels: Object.keys(stat.stats),
                    datasets: [{
                      label: 'Responses',
                      data: Object.values(stat.stats),
                      backgroundColor: '#5D5FEF'
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false
                  }}
                />
              </div>
            )}

            {(stat.type === 'rating' || stat.type === 'scale') && (
              <div className="space-y-4">
                <p className="text-2xl font-bold text-[#5D5FEF]">
                  Average: {stat.stats.average.toFixed(1)}
                </p>
                <div className="h-64">
                  <Bar
                    data={{
                      labels: Object.keys(stat.stats.distribution),
                      datasets: [{
                        label: 'Responses',
                        data: Object.values(stat.stats.distribution),
                        backgroundColor: '#5D5FEF'
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false
                    }}
                  />
                </div>
              </div>
            )}

            {stat.type === 'text' && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {stat.stats.answers.map((answer, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-md">
                    {answer}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Email Modal */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Send Report</h3>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="Enter recipient email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent mb-4"
            />
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => setIsEmailModalOpen(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={sendReportEmail}
                className="bg-[#5D5FEF] hover:bg-[#5D5FEF]/90 text-white"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyReport;