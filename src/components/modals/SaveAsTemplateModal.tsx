import React, { useState } from 'react';
import { useTemplate } from '../../context/TemplateContext';
import { SurveyType } from '../../context/SurveyContext';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Save, X } from 'lucide-react';
import useToast from '../../hooks/useToast';

interface SaveAsTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  survey: SurveyType;
}

const SaveAsTemplateModal: React.FC<SaveAsTemplateModalProps> = ({
  isOpen,
  onClose,
  survey
}) => {
  const { addTemplate } = useTemplate();
  const { showToast } = useToast();
  
  const [name, setName] = useState(survey.title);
  const [description, setDescription] = useState(survey.description);
  const [category, setCategory] = useState(survey.category);

  const handleSave = () => {
    if (!name.trim()) {
      showToast('Please enter a template name', 'error');
      return;
    }

    addTemplate({
      name,
      description,
      category,
      questions: survey.questions
    });

    showToast('Survey saved as template successfully', 'success');
    onClose();
  };

  const categories = [
    'Customer Experience',
    'Employee Engagement',
    'Market Research',
    'Education',
    'Event'
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Save as Template</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Template Name*
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent"
              placeholder="Enter template name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-5 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent"
              placeholder="Enter template description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-5 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            onClick={onClose}
            className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-[#5D5FEF] hover:bg-[#5D5FEF]/90 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Template
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SaveAsTemplateModal;