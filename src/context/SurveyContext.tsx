import React, { createContext, useContext, useState } from 'react';
import { surveyTemplates } from '../data/surveyTemplates';
import { v4 as uuidv4 } from 'uuid';

export type QuestionType = 'multiple-choice' | 'text' | 'rating' | 'checkbox' | 'dropdown' | 'scale';
export type DeploymentChannel = 'web' | 'email' | 'sms' | 'phone' | 'in-person';
export type ReminderFrequency = 'daily' | 'weekly' | 'custom';

export interface TeamMember {
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'pending';
  joinedAt: Date;
  lastActive?: Date;
}

export interface Reminder {
  id: string;
  surveyId: string;
  message: string;
  frequency: ReminderFrequency;
  lastSent: Date | null;
  nextSend: Date;
  status: 'active' | 'paused';
  conditions?: {
    noResponse?: boolean;
    partialResponse?: boolean;
    customDays?: number;
  };
}

export interface DeploymentSettings {
  channels: DeploymentChannel[];
  schedule?: {
    startDate: Date;
    endDate?: Date;
    frequency?: 'once' | 'daily' | 'weekly' | 'monthly';
  };
  targeting?: {
    demographics?: string[];
    locations?: string[];
    languages?: string[];
  };
}

export interface Integration {
  type: 'crm' | 'analytics' | 'email' | 'messaging';
  provider: string;
  config: Record<string, any>;
  status: 'active' | 'inactive';
}

export interface ResponseMetrics {
  totalSent: number;
  totalResponses: number;
  partialResponses: number;
  averageCompletionTime: number;
  responseRate: number;
  demographicBreakdown: Record<string, number>;
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  required: boolean;
  options?: string[];
  description?: string;
}

export interface SurveyType {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  questions: Question[];
  collaborators: TeamMember[];
  responses: SurveyResponse[];
  isPublished: boolean;
  category: string;
  deployment?: DeploymentSettings;
  reminders: Reminder[];
  integrations: Integration[];
  metrics: ResponseMetrics;
  owner: string;
  settings?: {
    allowEdit: boolean;
    showProgress: boolean;
    shuffleQuestions: boolean;
    theme?: {
      primaryColor: string;
      secondaryColor: string;
      accentColor: string;
      backgroundColor: string;
      textColor: string;
    };
  };
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  answers: { questionId: string; answer: string | string[] }[];
  submittedAt: Date;
  channel?: DeploymentChannel;
  demographics?: {
    age?: string;
    gender?: string;
    location?: string;
    language?: string;
  };
  metadata?: {
    completionTime: number;
    deviceType: string;
    browser?: string;
  };
}

interface SurveyContextType {
  surveys: SurveyType[];
  currentSurvey: SurveyType | null;
  createSurvey: (title: string, description: string, category: string, templateId?: string) => string;
  updateSurvey: (id: string, updatedSurvey: Partial<SurveyType>) => void;
  getSurvey: (id: string) => SurveyType | undefined;
  addQuestion: (surveyId: string, question: Omit<Question, 'id'>) => void;
  updateQuestion: (surveyId: string, questionId: string, updatedQuestion: Partial<Question>) => void;
  removeQuestion: (surveyId: string, questionId: string) => void;
  publishSurvey: (id: string) => void;
  addResponse: (surveyId: string, answers: { questionId: string; answer: string | string[] }[]) => void;
  addReminder: (surveyId: string, reminder: Omit<Reminder, 'id'>) => void;
  updateReminder: (surveyId: string, reminderId: string, updates: Partial<Reminder>) => void;
  removeReminder: (surveyId: string, reminderId: string) => void;
  updateDeployment: (surveyId: string, settings: DeploymentSettings) => void;
  addIntegration: (surveyId: string, integration: Integration) => void;
  removeIntegration: (surveyId: string, integrationType: string) => void;
  updateMetrics: (surveyId: string) => void;
  addTeamMember: (surveyId: string, member: Omit<TeamMember, 'joinedAt'>) => void;
  updateTeamMember: (surveyId: string, email: string, updates: Partial<TeamMember>) => void;
  removeTeamMember: (surveyId: string, email: string) => void;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export const SurveyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [surveys, setSurveys] = useState<SurveyType[]>([
    {
      id: '1',
      title: 'Customer Satisfaction Survey',
      description: 'Help us improve our products and services',
      createdAt: new Date('2023-10-15'),
      updatedAt: new Date('2023-10-15'),
      questions: [
        {
          id: '101',
          type: 'rating',
          title: 'How would you rate our service?',
          required: true,
          description: 'On a scale of 1-5, with 5 being excellent'
        },
        {
          id: '102',
          type: 'text',
          title: 'What can we do to improve?',
          required: false
        }
      ],
      collaborators: [
        {
          email: 'john@example.com',
          role: 'admin',
          status: 'active',
          joinedAt: new Date('2023-10-15')
        },
        {
          email: 'sarah@example.com',
          role: 'editor',
          status: 'active',
          joinedAt: new Date('2023-10-15')
        }
      ],
      responses: [],
      isPublished: true,
      category: 'Customer Experience',
      reminders: [],
      integrations: [],
      metrics: {
        totalSent: 0,
        totalResponses: 0,
        partialResponses: 0,
        averageCompletionTime: 0,
        responseRate: 0,
        demographicBreakdown: {}
      },
      owner: 'john@example.com'
    }
  ]);
  
  const [currentSurvey, setCurrentSurvey] = useState<SurveyType | null>(null);

  const createSurvey = (title: string, description: string, category: string, templateId?: string) => {
    const id = uuidv4();
    let newSurvey: SurveyType = {
      id,
      title,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      questions: [],
      collaborators: [],
      responses: [],
      isPublished: false,
      category,
      reminders: [],
      integrations: [],
      metrics: {
        totalSent: 0,
        totalResponses: 0,
        partialResponses: 0,
        averageCompletionTime: 0,
        responseRate: 0,
        demographicBreakdown: {}
      },
      owner: 'john@example.com' // Replace with actual logged-in user
    };

    if (templateId) {
      const template = surveyTemplates.find(t => t.id === templateId);
      if (template) {
        newSurvey.questions = template.questions.map(q => ({
          ...q,
          id: uuidv4()
        }));
      }
    }

    setSurveys(prev => [...prev, newSurvey]);
    setCurrentSurvey(newSurvey);
    return id;
  };

  const updateSurvey = (id: string, updatedSurvey: Partial<SurveyType>) => {
    setSurveys(prev =>
      prev.map(survey =>
        survey.id === id
          ? { ...survey, ...updatedSurvey, updatedAt: new Date() }
          : survey
      )
    );
    
    if (currentSurvey?.id === id) {
      setCurrentSurvey(prev => prev ? { ...prev, ...updatedSurvey, updatedAt: new Date() } : null);
    }
  };

  const getSurvey = (id: string) => {
    return surveys.find(s => s.id === id);
  };

  const addQuestion = (surveyId: string, question: Omit<Question, 'id'>) => {
    const newQuestion = { ...question, id: uuidv4() };
    setSurveys(prev =>
      prev.map(survey =>
        survey.id === surveyId
          ? {
              ...survey,
              questions: [...survey.questions, newQuestion],
              updatedAt: new Date()
            }
          : survey
      )
    );
    
    if (currentSurvey?.id === surveyId) {
      setCurrentSurvey(prev => prev ? {
        ...prev,
        questions: [...prev.questions, newQuestion],
        updatedAt: new Date()
      } : null);
    }
  };

  const updateQuestion = (surveyId: string, questionId: string, updatedQuestion: Partial<Question>) => {
    setSurveys(prev =>
      prev.map(survey =>
        survey.id === surveyId
          ? {
              ...survey,
              questions: survey.questions.map(q =>
                q.id === questionId ? { ...q, ...updatedQuestion } : q
              ),
              updatedAt: new Date()
            }
          : survey
      )
    );
    
    if (currentSurvey?.id === surveyId) {
      setCurrentSurvey(prev => prev ? {
        ...prev,
        questions: prev.questions.map(q =>
          q.id === questionId ? { ...q, ...updatedQuestion } : q
        ),
        updatedAt: new Date()
      } : null);
    }
  };

  const removeQuestion = (surveyId: string, questionId: string) => {
    setSurveys(prev =>
      prev.map(survey =>
        survey.id === surveyId
          ? {
              ...survey,
              questions: survey.questions.filter(q => q.id !== questionId),
              updatedAt: new Date()
            }
          : survey
      )
    );
    
    if (currentSurvey?.id === surveyId) {
      setCurrentSurvey(prev => prev ? {
        ...prev,
        questions: prev.questions.filter(q => q.id !== questionId),
        updatedAt: new Date()
      } : null);
    }
  };

  const publishSurvey = (id: string) => {
    updateSurvey(id, { isPublished: true });
  };

  const addResponse = (surveyId: string, answers: { questionId: string; answer: string | string[] }[]) => {
    const newResponse: SurveyResponse = {
      id: uuidv4(),
      surveyId,
      answers,
      submittedAt: new Date()
    };

    setSurveys(prev =>
      prev.map(survey =>
        survey.id === surveyId
          ? {
              ...survey,
              responses: [...survey.responses, newResponse]
            }
          : survey
      )
    );

    updateMetrics(surveyId);
  };

  const addTeamMember = (surveyId: string, member: Omit<TeamMember, 'joinedAt'>) => {
    const newMember: TeamMember = {
      ...member,
      joinedAt: new Date()
    };

    setSurveys(prev =>
      prev.map(survey =>
        survey.id === surveyId
          ? {
              ...survey,
              collaborators: [...survey.collaborators, newMember]
            }
          : survey
      )
    );
  };

  const updateTeamMember = (surveyId: string, email: string, updates: Partial<TeamMember>) => {
    setSurveys(prev =>
      prev.map(survey =>
        survey.id === surveyId
          ? {
              ...survey,
              collaborators: survey.collaborators.map(member =>
                member.email === email ? { ...member, ...updates } : member
              )
            }
          : survey
      )
    );
  };

  const removeTeamMember = (surveyId: string, email: string) => {
    setSurveys(prev =>
      prev.map(survey =>
        survey.id === surveyId
          ? {
              ...survey,
              collaborators: survey.collaborators.filter(member => member.email !== email)
            }
          : survey
      )
    );
  };

  const addReminder = (surveyId: string, reminder: Omit<Reminder, 'id'>) => {
    const newReminder: Reminder = {
      ...reminder,
      id: uuidv4()
    };

    setSurveys(prev =>
      prev.map(survey =>
        survey.id === surveyId
          ? {
              ...survey,
              reminders: [...survey.reminders, newReminder]
            }
          : survey
      )
    );
  };

  const updateReminder = (surveyId: string, reminderId: string, updates: Partial<Reminder>) => {
    setSurveys(prev =>
      prev.map(survey =>
        survey.id === surveyId
          ? {
              ...survey,
              reminders: survey.reminders.map(r =>
                r.id === reminderId ? { ...r, ...updates } : r
              )
            }
          : survey
      )
    );
  };

  const removeReminder = (surveyId: string, reminderId: string) => {
    setSurveys(prev =>
      prev.map(survey =>
        survey.id === surveyId
          ? {
              ...survey,
              reminders: survey.reminders.filter(r => r.id !== reminderId)
            }
          : survey
      )
    );
  };

  const updateDeployment = (surveyId: string, settings: DeploymentSettings) => {
    setSurveys(prev =>
      prev.map(survey =>
        survey.id === surveyId
          ? {
              ...survey,
              deployment: settings
            }
          : survey
      )
    );
  };

  const addIntegration = (surveyId: string, integration: Integration) => {
    setSurveys(prev =>
      prev.map(survey =>
        survey.id === surveyId
          ? {
              ...survey,
              integrations: [...survey.integrations, integration]
            }
          : survey
      )
    );
  };

  const removeIntegration = (surveyId: string, integrationType: string) => {
    setSurveys(prev =>
      prev.map(survey =>
        survey.id === surveyId
          ? {
              ...survey,
              integrations: survey.integrations.filter(i => i.type !== integrationType)
            }
          : survey
      )
    );
  };

  const updateMetrics = (surveyId: string) => {
    const survey = surveys.find(s => s.id === surveyId);
    if (!survey) return;

    const totalResponses = survey.responses.length;
    const partialResponses = survey.responses.filter(r => 
      r.answers.length < survey.questions.length
    ).length;
    
    const completionTimes = survey.responses
      .filter(r => r.metadata?.completionTime)
      .map(r => r.metadata!.completionTime);
    
    const averageCompletionTime = completionTimes.length > 0
      ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
      : 0;

    const demographicBreakdown = survey.responses.reduce((acc, response) => {
      if (response.demographics?.location) {
        acc[response.demographics.location] = (acc[response.demographics.location] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const metrics: ResponseMetrics = {
      totalSent: survey.metrics.totalSent,
      totalResponses,
      partialResponses,
      averageCompletionTime,
      responseRate: survey.metrics.totalSent > 0 
        ? (totalResponses / survey.metrics.totalSent) * 100 
        : 0,
      demographicBreakdown
    };

    updateSurvey(surveyId, { metrics });
  };

  return (
    <SurveyContext.Provider
      value={{
        surveys,
        currentSurvey,
        createSurvey,
        updateSurvey,
        getSurvey,
        addQuestion,
        updateQuestion,
        removeQuestion,
        publishSurvey,
        addResponse,
        addReminder,
        updateReminder,
        removeReminder,
        updateDeployment,
        addIntegration,
        removeIntegration,
        updateMetrics,
        addTeamMember,
        updateTeamMember,
        removeTeamMember
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (context === undefined) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
};