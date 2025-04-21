import React, { createContext, useContext, useState } from 'react';
import { Question } from './SurveyContext';
import { v4 as uuidv4 } from 'uuid';
import { surveyTemplates as defaultTemplates } from '../data/surveyTemplates';

export interface SurveyTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  questions: Question[];
  createdAt: Date;
  updatedAt: Date;
  isCustom: boolean;
}

interface TemplateContextType {
  templates: SurveyTemplate[];
  addTemplate: (template: Omit<SurveyTemplate, 'id' | 'createdAt' | 'updatedAt' | 'isCustom'>) => void;
  updateTemplate: (id: string, updates: Partial<SurveyTemplate>) => void;
  deleteTemplate: (id: string) => void;
  getTemplate: (id: string) => SurveyTemplate | undefined;
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

export const TemplateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [templates, setTemplates] = useState<SurveyTemplate[]>(
    defaultTemplates.map(template => ({
      ...template,
      createdAt: new Date(),
      updatedAt: new Date(),
      isCustom: false
    }))
  );

  const addTemplate = (template: Omit<SurveyTemplate, 'id' | 'createdAt' | 'updatedAt' | 'isCustom'>) => {
    const newTemplate: SurveyTemplate = {
      ...template,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isCustom: true
    };
    setTemplates(prev => [...prev, newTemplate]);
  };

  const updateTemplate = (id: string, updates: Partial<SurveyTemplate>) => {
    setTemplates(prev => prev.map(template => 
      template.id === id
        ? { ...template, ...updates, updatedAt: new Date() }
        : template
    ));
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(template => 
      template.id !== id || !template.isCustom
    ));
  };

  const getTemplate = (id: string) => {
    return templates.find(template => template.id === id);
  };

  return (
    <TemplateContext.Provider value={{
      templates,
      addTemplate,
      updateTemplate,
      deleteTemplate,
      getTemplate
    }}>
      {children}
    </TemplateContext.Provider>
  );
};

export const useTemplate = () => {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error('useTemplate must be used within a TemplateProvider');
  }
  return context;
};