import React, { useState, useEffect } from 'react';
import { SurveyType, TeamMember } from '../../context/SurveyContext';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { X, Settings, Save, Users, Link, Copy, Trash2, Bell, Shield, Clock, Globe, Palette, Image, Lock } from 'lucide-react';
import { useSurvey } from '../../context/SurveyContext';
import useToast from '../../hooks/useToast';
import TeamModal from './TeamModal';
import ColorPicker from '../ui/ColorPicker';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  survey: SurveyType;
  onThemeChange?: (theme: any) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  survey,
  onThemeChange 
}) => {
  const { updateSurvey } = useSurvey();
  const { showToast } = useToast();
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(survey.collaborators || []);
  const [activeTab, setActiveTab] = useState<'general' | 'sharing' | 'notifications' | 'privacy' | 'advanced' | 'branding' | 'team'>('general');

  const [generalSettings, setGeneralSettings] = useState({
    title: survey.title,
    description: survey.description,
    category: survey.category,
    language: 'English',
    timezone: 'UTC',
    allowDuplicateResponses: false,
    showProgressBar: true,
    showQuestionNumbers: true,
    responseLimit: '',
    expiryDate: '',
    customUrl: '',
    autoClose: false,
    autoCloseDate: '',
    welcomeMessage: '',
    completionMessage: '',
    redirectUrl: ''
  });

  useEffect(() => {
    if (survey.settings?.general) {
      setGeneralSettings(prev => ({
        ...prev,
        ...survey.settings.general
      }));
    }
  }, [survey]);

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: {
      enabled: true,
      newResponse: true,
      responseThreshold: true,
      thresholdValue: '100',
      dailySummary: false,
      weeklySummary: true,
      monthlySummary: false
    },
    collaboratorNotifications: {
      enabled: true,
      newCollaborator: true,
      roleChange: true,
      removal: true
    },
    surveyNotifications: {
      enabled: true,
      surveyPublished: true,
      surveyEnding: true,
      daysBeforeEnd: '3',
      lowResponseRate: true,
      responseRateThreshold: '20'
    },
    notificationChannels: {
      email: true,
      browser: true,
      slack: false,
      teams: false
    }
  });

  useEffect(() => {
    if (survey.settings?.notifications) {
      setNotificationSettings(survey.settings.notifications);
    }
  }, [survey]);

  const [privacySettings, setPrivacySettings] = useState({
    requireLogin: false,
    hideResults: true,
    anonymousResponses: true,
    ipRestriction: false,
    allowEdit: false,
    responseLimit: '',
    expiryDate: '',
    password: '',
    domainRestriction: '',
    dataRetention: '30',
    gdprCompliance: true,
    showProgress: true,
    shuffleQuestions: false
  });

  const [brandingSettings, setBrandingSettings] = useState({
    primaryColor: '#5D5FEF',
    secondaryColor: '#23C4A2',
    accentColor: '#F9A826',
    backgroundColor: '#F4F5F7',
    textColor: '#111827',
    borderRadius: '0.375rem',
    fontFamily: 'Inter',
    logoUrl: '',
    customCss: '',
    buttonStyle: 'default',
    headerStyle: 'default'
  });

  const [advancedSettings, setAdvancedSettings] = useState({
    customDomain: '',
    analyticsId: '',
    redirectUrl: '',
    customJs: '',
    customCss: '',
    metaTags: {
      title: '',
      description: '',
      keywords: ''
    },
    rateLimit: {
      enabled: false,
      maxAttempts: 3,
      timeWindow: 60
    },
    caching: {
      enabled: false,
      duration: 30
    }
  });

  const handleUpdateTeamMembers = (members: TeamMember[]) => {
    setTeamMembers(members);
    updateSurvey(survey.id, { collaborators: members });
  };

  const handleSave = () => {
    updateSurvey(survey.id, {
      title: generalSettings.title,
      description: generalSettings.description,
      category: generalSettings.category,
      collaborators: teamMembers,
      settings: {
        general: generalSettings,
        notifications: notificationSettings,
        privacy: privacySettings,
        theme: {
          primaryColor: brandingSettings.primaryColor,
          secondaryColor: brandingSettings.secondaryColor,
          accentColor: brandingSettings.accentColor,
          backgroundColor: brandingSettings.backgroundColor,
          textColor: brandingSettings.textColor
        }
      }
    });

    if (onThemeChange) {
      onThemeChange(brandingSettings);
    }

    showToast('Settings saved successfully', 'success');
    onClose();
  };

  const surveyUrl = `${window.location.origin}/survey/${survey.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(surveyUrl);
    showToast('Survey link copied to clipboard', 'success');
  };

  const renderTabButton = (tab: typeof activeTab, icon: React.ReactNode, label: string) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center w-full px-4 py-3 text-left transition-colors ${
        activeTab === tab
          ? 'bg-[#5D5FEF]/5 text-[#5D5FEF] border-r-2 border-[#5D5FEF]'
          : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </button>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="wide">
      <div className="flex h-[80vh]">
        <div className="w-64 border-r border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Survey Settings</h2>
          </div>
          <nav className="space-y-1">
            {renderTabButton('general', <Settings className="h-5 w-5" />, 'General')}
            {renderTabButton('privacy', <Lock className="h-5 w-5" />, 'Privacy')}
            {renderTabButton('team', <Users className="h-5 w-5" />, 'Team')}
            {renderTabButton('notifications', <Bell className="h-5 w-5" />, 'Notifications')}
            {renderTabButton('branding', <Palette className="h-5 w-5" />, 'Branding')}
            {renderTabButton('advanced', <Globe className="h-5 w-5" />, 'Advanced')}
          </nav>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {activeTab === 'general' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Survey Title
                      </label>
                      <input
                        type="text"
                        value={generalSettings.title}
                        onChange={(e) => setGeneralSettings(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={generalSettings.description}
                        onChange={(e) => setGeneralSettings(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        value={generalSettings.category}
                        onChange={(e) => setGeneralSettings(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent"
                      >
                        <option value="Customer Experience">Customer Experience</option>
                        <option value="Employee Engagement">Employee Engagement</option>
                        <option value="Market Research">Market Research</option>
                        <option value="Education">Education</option>
                        <option value="Event">Event</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Survey Link</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Survey URL
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          value={surveyUrl}
                          readOnly
                          className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-l-md"
                        />
                        <button
                          onClick={handleCopyLink}
                          className="px-4 py-2 bg-gray-100 border border-gray-300 border-l-0 rounded-r-md hover:bg-gray-200"
                        >
                          <Copy className="h-5 w-5 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Custom URL (Optional)
                      </label>
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">{window.location.origin}/s/</span>
                        <input
                          type="text"
                          value={generalSettings.customUrl}
                          onChange={(e) => setGeneralSettings(prev => ({ ...prev, customUrl: e.target.value }))}
                          placeholder="your-custom-url"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Response Settings</h3>
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={generalSettings.allowDuplicateResponses}
                        onChange={(e) => setGeneralSettings(prev => ({
                          ...prev,
                          allowDuplicateResponses: e.target.checked
                        }))}
                        className="h-4 w-4 text-[#5D5FEF] focus:ring-[#5D5FEF] border-gray-300 rounded"
                      />
                      <span className="ml-2">Allow duplicate responses</span>
                    </label>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Response Limit (Optional)
                      </label>
                      <input
                        type="number"
                        value={generalSettings.responseLimit}
                        onChange={(e) => setGeneralSettings(prev => ({
                          ...prev,
                          responseLimit: e.target.value
                        }))}
                        placeholder="Leave blank for unlimited"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date (Optional)
                      </label>
                      <input
                        type="datetime-local"
                        value={generalSettings.expiryDate}
                        onChange={(e) => setGeneralSettings(prev => ({
                          ...prev,
                          expiryDate: e.target.value
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Display Settings</h3>
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={generalSettings.showProgressBar}
                        onChange={(e) => setGeneralSettings(prev => ({
                          ...prev,
                          showProgressBar: e.target.checked
                        }))}
                        className="h-4 w-4 text-[#5D5FEF] focus:ring-[#5D5FEF] border-gray-300 rounded"
                      />
                      <span className="ml-2">Show progress bar</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={generalSettings.showQuestionNumbers}
                        onChange={(e) => setGeneralSettings(prev => ({
                          ...prev,
                          showQuestionNumbers: e.target.checked
                        }))}
                        className="h-4 w-4 text-[#5D5FEF] focus:ring-[#5D5FEF] border-gray-300 rounded"
                      />
                      <span className="ml-2">Show question numbers</span>
                    </label>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Welcome Message (Optional)
                      </label>
                      <textarea
                        value={generalSettings.welcomeMessage}
                        onChange={(e) => setGeneralSettings(prev => ({
                          ...prev,
                          welcomeMessage: e.target.value
                        }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent"
                        placeholder="Add a welcome message for respondents"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Completion Message (Optional)
                      </label>
                      <textarea
                        value={generalSettings.completionMessage}
                        onChange={(e) => setGeneralSettings(prev => ({
                          ...prev,
                          completionMessage: e.target.value
                        }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent"
                        placeholder="Add a message to show after survey completion"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Redirect URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={generalSettings.redirectUrl}
                        onChange={(e) => setGeneralSettings(prev => ({
                          ...prev,
                          redirectUrl: e.target.value
                        }))}
                        placeholder="https://example.com/thank-you"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between py-2">
                      <div>
                        <span className="font-medium">Enable Email Notifications</span>
                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                      </div>
                      <div className="ml-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.emailNotifications.enabled}
                            onChange={(e) => setNotificationSettings(prev => ({
                              ...prev,
                              emailNotifications: {
                                ...prev.emailNotifications,
                                enabled: e.target.checked
                              }
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#5D5FEF]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5D5FEF]"></div>
                        </label>
                      </div>
                    </label>

                    <div className="pl-4 space-y-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={notificationSettings.emailNotifications.newResponse}
                          onChange={(e) => setNotificationSettings(prev => ({
                            ...prev,
                            emailNotifications: {
                              ...prev.emailNotifications,
                              newResponse: e.target.checked
                            }
                          }))}
                          disabled={!notificationSettings.emailNotifications.enabled}
                          className="h-4 w-4 text-[#5D5FEF] focus:ring-[#5D5FEF] border-gray-300 rounded"
                        />
                        <span className="ml-2">New response notifications</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={notificationSettings.emailNotifications.responseThreshold}
                          onChange={(e) => setNotificationSettings(prev => ({
                            ...prev,
                            emailNotifications: {
                              ...prev.emailNotifications,
                              responseThreshold: e.target.checked
                            }
                          }))}
                          disabled={!notificationSettings.emailNotifications.enabled}
                          className="h-4 w-4 text-[#5D5FEF] focus:ring-[#5D5FEF] border-gray-300 rounded"
                        />
                        <span className="ml-2">Response threshold notifications</span>
                      </label>

                      {notificationSettings.emailNotifications.responseThreshold && (
                        <div className="flex items-center ml-6">
                          <span className="text-sm text-gray-600 mr-2">Notify when responses reach</span>
                          <input
                            type="number"
                            value={notificationSettings.emailNotifications.thresholdValue}
                            onChange={(e) => setNotificationSettings(prev => ({
                              ...prev,
                              emailNotifications: {
                                ...prev.emailNotifications,
                                thresholdValue: e.target.value
                              }
                            }))}
                            disabled={!notificationSettings.emailNotifications.enabled}
                            className="w-20 px-2 py-1 border border-gray-300 rounded-md"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={notificationSettings.emailNotifications.dailySummary}
                            onChange={(e) => setNotificationSettings(prev => ({
                              ...prev,
                              emailNotifications: {
                                ...prev.emailNotifications,
                                dailySummary: e.target.checked
                              }
                            }))}
                            disabled={!notificationSettings.emailNotifications.enabled}
                            className="h-4 w-4 text-[#5D5FEF] focus:ring-[#5D5FEF] border-gray-300 rounded"
                          />
                          <span className="ml-2">Daily summary</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={notificationSettings.emailNotifications.weeklySummary}
                            onChange={(e) => setNotificationSettings(prev => ({
                              ...prev,
                              emailNotifications: {
                                ...prev.emailNotifications,
                                weeklySummary: e.target.checked
                              }
                            }))}
                            disabled={!notificationSettings.emailNotifications.enabled}
                            className="h-4 w-4 text-[#5D5FEF] focus:ring-[#5D5FEF] border-gray-300 rounded"
                          />
                          <span className="ml-2">Weekly summary</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={notificationSettings.emailNotifications.monthlySummary}
                            onChange={(e) => setNotificationSettings(prev => ({
                              ...prev,
                              emailNotifications: {
                                ...prev.emailNotifications,
                                monthlySummary: e.target.checked
                              }
                            }))}
                            disabled={!notificationSettings.emailNotifications.enabled}
                            className="h-4 w-4 text-[#5D5FEF] focus:ring-[#5D5FEF] border-gray-300 rounded"
                          />
                          <span className="ml-2">Monthly summary</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Collaborator Notifications</h3>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between py-2">
                      <div>
                        <span className="font-medium">Enable Collaborator Notifications</span>
                        <p className="text-sm text-gray-500">Receive notifications about team changes</p>
                      </div>
                      <div className="ml-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.collaboratorNotifications.enabled}
                            onChange={(e) => setNotificationSettings(prev => ({
                              ...prev,
                              collaboratorNotifications: {
                                ...prev.collaboratorNotifications,
                                enabled: e.target.checked
                              }
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#5D5FEF]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5D5FEF]"></div>
                        </label>
                      </div>
                    </label>

                    <div className="pl-4 space-y-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={notificationSettings.collaboratorNotifications.newCollaborator}
                          onChange={(e) => setNotificationSettings(prev => ({
                            ...prev,
                            collaboratorNotifications: {
                              ...prev.collaboratorNotifications,
                              newCollaborator: e.target.checked
                            }
                          }))}
                          disabled={!notificationSettings.collaboratorNotifications.enabled}
                          className="h-4 w-4 text-[#5D5FEF] focus:ring-[#5D5FEF] border-gray-300 rounded"
                        />
                        <span className="ml-2">New collaborator added</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={notificationSettings.collaboratorNotifications.roleChange}
                          onChange={(e) => setNotificationSettings(prev => ({
                            ...prev,
                            collaboratorNotifications: {
                              ...prev.collaboratorNotifications,
                              roleChange: e.target.checked
                            }
                          }))}
                          disabled={!notificationSettings.collaboratorNotifications.enabled}
                          className="h-4 w-4 text-[#5D5FEF] focus:ring-[#5D5FEF] border-gray-300 rounded"
                        />
                        <span className="ml-2">Role changes</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={notificationSettings.collaboratorNotifications.removal}
                          onChange={(e) => setNotificationSettings(prev => ({
                            ...prev,
                            collaboratorNotifications: {
                              ...prev.collaboratorNotifications,
                              removal: e.target.checked
                            }
                          }))}
                          disabled={!notificationSettings.collaboratorNotifications.enabled}
                          className="h-4 w-4 text-[#5D5FEF] focus:ring-[#5D5FEF] border-gray-300 rounded"
                        />
                        <span className="ml-2">Collaborator removal</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Survey Notifications</h3>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between py-2">
                      <div>
                        <span className="font-medium">Enable Survey Notifications</span>
                        <p className="text-sm text-gray-500">Receive notifications about survey status</p>
                      </div>
                      <div className="ml-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.surveyNotifications.enabled}
                            onChange={(e) => setNotificationSettings(prev => ({
                              ...prev,
                              surveyNotifications: {
                                ...prev.surveyNotifications,
                                enabled: e.target.checked
                              }
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#5D5FEF]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5D5FEF]"></div>
                        </label>
                      </div>
                    </label>

                    <div className="pl-4 space-y-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={notificationSettings.surveyNotifications.surveyPublished}
                          onChange={(e) => setNotificationSettings(prev => ({
                            ...prev,
                            surveyNotifications: {
                              ...prev.surveyNotifications,
                              surveyPublished: e.target.checked
                            }
                          }))}
                          disabled={!notificationSettings.surveyNotifications.enabled}
                          className="h-4 w-4 text-[#5D5FEF] focus:ring-[#5D5FEF] border-gray-300 rounded"
                        />
                        <span className="ml-2">Survey published</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={notificationSettings.surveyNotifications.surveyEnding}
                          onChange={(e) => setNotificationSettings(prev => ({
                            ...prev,
                            surveyNotifications: {
                              ...prev.surveyNotifications,
                              surveyEnding: e.target.checked
                            }
                          }))}
                          disabled={!notificationSettings.surveyNotifications.enabled}
                          className="h-4 w-4 text-[#5D5FEF] focus:ring-[#5D5FEF] border-gray-300 rounded"
                        />
                        <span className="ml-2">Survey ending soon</span>
                      </label>

                      {notificationSettings.surveyNotifications.surveyEnding && (
                        <div className="flex items-center ml-6">
                          <span className="text-sm text-gray-600 mr-2">Notify</span>
                          <input
                            type="number"
                            value={notificationSettings.surveyNotifications.daysBeforeEnd}
                            onChange={(e) => setNotificationSettings(prev => ({
                              ...prev,
                              surveyNotifications: {
                                ...prev.surveyNotifications,
                                daysBeforeEnd: e.target.value
                              }
                            }))}
                            disabled={!notificationSettings.surveyNotifications.enabled}
                            className="w-20 px-2 py-1 border border-gray-300 rounded-md"
                          />
                          <span className="text-sm text-gray-600 ml-2">days before end</span>
                        </div>
                      )}

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={notificationSettings.surveyNotifications.lowResponseRate}
                          onChange={(e) => setNotificationSettings(prev => ({
                            ...prev,
                            surveyNotifications: {
                              ...prev.surveyNotifications,
                              lowResponseRate: e.target.checked
                            }
                          }))}
                          disabled={!notificationSettings.surveyNotifications.enabled}
                          className="h-4 w-4 text-[#5D5FEF] focus:ring-[#5D5FEF] border-gray-300 rounded"
                        />
                        <span className="ml-2">Low response rate alert</span>
                      </label>

                      {notificationSettings.surveyNotifications.lowResponseRate && (
                        <div className="flex items-center ml-6">
                          <span className="text-sm text-gray-600 mr-2">Alert when response rate is below</span>
                          <input
                            type="number"
                            value={notificationSettings.surveyNotifications.responseRateThreshold}
                            onChange={(e) => setNotificationSettings(prev => ({
                              ...prev,
                              surveyNotifications: {
                                ...prev.surveyNotifications,
                                responseRateThreshold: e.target.value
                              }
                            }))}
                            disabled={!notificationSettings.surveyNotifications.enabled}
                            className="w-20 px-2 py-1 border border-gray-300 rounded-md"
                          />
                          <span className="text-sm text-gray-600 ml-2">%</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Channels</h3>
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={notificationSettings.notificationChannels.email}
                        onChange={(e) => setNotificationSettings(prev => ({
                          ...prev,
                          notificationChannels: {
                            ...prev.notificationChannels,
                            email: e.target.checked
                          }
                        }))}
                        className="h-4 w-4 text-[#5D5FEF] focus:ring-[#5D5FEF] border-gray-300 rounded"
                      />
                      <span className="ml-2">Email</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={notificationSettings.notificationChannels.browser}
                        onChange={(e) => setNotificationSettings(prev => ({
                          ...prev,
                          notificationChannels: {
                            ...prev.notificationChannels,
                            browser: e.target.checked
                          }
                        }))}
                        className="h-4 w-4 text-[#5D5FEF] focus:ring-[#5D5FEF] border-gray-300 rounded"
                      />
                      <span className="ml-2">Browser notifications</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={notificationSettings.notificationChannels.slack}
                        onChange={(e) => setNotificationSettings(prev => ({
                          ...prev,
                          notificationChannels: {
                            ...prev.notificationChannels,
                            slack: e.target.checked
                          }
                        }))}
                        className="h-4 w-4 text-[#5D5FEF] focus:ring-[#5D5FEF] border-gray-300 rounded"
                      />
                      <span className="ml-2">Slack</span>
                      <span className="ml-2 text-xs text-gray-500">(Coming soon)</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={notificationSettings.notificationChannels.teams}
                        onChange={(e) => setNotificationSettings(prev => ({
                          ...prev,
                          notificationChannels: {
                            ...prev.notificationChannels,
                            teams: e.target.checked
                          }
                        }))}
                        className="h-4 w-4 text-[#5D5FEF] focus:ring-[#5D5FEF] border-gray-300 rounded"
                      />
                      <span className="ml-2">Microsoft Teams</span>
                      <span className="ml-2 text-xs text-gray-500">(Coming soon)</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy & Security</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Require Login</h4>
                        <p className="text-sm text-gray-500">Only authenticated users can respond</p>
                      </div>
                      <div className="ml-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={privacySettings.requireLogin}
                            onChange={(e) => setPrivacySettings(prev => ({
                              ...prev,
                              requireLogin: e.target.checked
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#5D5FEF]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5D5FEF]"></div>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Anonymous Responses</h4>
                        <p className="text-sm text-gray-500">Don't collect respondent information</p>
                      </div>
                      <div className="ml-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={privacySettings.anonymousResponses}
                            onChange={(e) => setPrivacySettings(prev => ({
                              ...prev,
                              anonymousResponses: e.target.checked
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#5D5FEF]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5D5FEF]"></div>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Hide Results</h4>
                        <p className="text-sm text-gray-500">Don't show results to respondents</p>
                      </div>
                      <div className="ml-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={privacySettings.hideResults}
                            onChange={(e) => setPrivacySettings(prev => ({
                              ...prev,
                              hideResults: e.target.checked
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#5D5FEF]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5D5FEF]"></div>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Password Protection</h4>
                        <p className="text-sm text-gray-500">Require password to access survey</p>
                      </div>
                      <div className="ml-4 flex items-center">
                        <input
                          type="password"
                          value={privacySettings.password}
                          onChange={(e) => setPrivacySettings(prev => ({
                            ...prev,
                            password: e.target.value
                          }))}
                          placeholder="Enter password"
                          className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Domain Restriction</h4>
                        <p className="text-sm text-gray-500">Limit responses to specific email domains</p>
                      </div>
                      <div className="ml-4 flex items-center">
                        <input
                          type="text"
                          value={privacySettings.domainRestriction}
                          onChange={(e) => setPrivacySettings(prev => ({
                            ...prev,
                            domainRestriction: e.target.value
                          }))}
                          placeholder="e.g., company.com"
                          className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Data Retention</h4>
                        <p className="text-sm text-gray-500">Automatically delete responses after</p>
                      </div>
                      <div className="ml-4 flex items-center">
                        <select
                          value={privacySettings.dataRetention}
                          onChange={(e) => setPrivacySettings(prev => ({
                            ...prev,
                            dataRetention: e.target.value
                          }))}
                          className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent text-sm"
                        >
                          <option value="30">30 days</option>
                          <option value="60">60 days</option>
                          <option value="90">90 days</option>
                          <option value="180">180 days</option>
                          <option value="365">1 year</option>
                          <option value="never">Never</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">GDPR Compliance</h4>
                        <p className="text-sm text-gray-500">Include data processing agreement</p>
                      </div>
                      <div className="ml-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={privacySettings.gdprCompliance}
                            onChange={(e) => setPrivacySettings(prev => ({
                              ...prev,
                              gdprCompliance: e.target.checked
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#5D5FEF]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5D5FEF]"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Response Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Show Progress Bar</h4>
                        <p className="text-sm text-gray-500">Display completion progress</p>
                      </div>
                      <div className="ml-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={privacySettings.showProgress}
                            onChange={(e) => setPrivacySettings(prev => ({
                              ...prev,
                              showProgress: e.target.checked
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#5D5FEF]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5D5FEF]"></div>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Shuffle Questions</h4>
                        <p className="text-sm text-gray-500">Randomize question order</p>
                      </div>
                      <div className="ml-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={privacySettings.shuffleQuestions}
                            onChange={(e) => setPrivacySettings(prev => ({
                              ...prev,
                              shuffleQuestions: e.target.checked
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#5D5FEF]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5D5FEF]"></div>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Allow Edit Responses</h4>
                        <p className="text-sm text-gray-500">Let respondents modify their answers</p>
                      </div>
                      <div className="ml-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={privacySettings.allowEdit}
                            onChange={(e) => setPrivacySettings(prev => ({
                              ...prev,
                              allowEdit: e.target.checked
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#5D5FEF]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5D5FEF]"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'branding' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Brand Colors</h3>
                  <div className="space-y-4">
                    <ColorPicker
                      label="Primary Color"
                      value={brandingSettings.primaryColor}
                      onChange={(value) => setBrandingSettings(prev => ({ ...prev, primaryColor: value }))}
                    />
                    <ColorPicker
                      label="Secondary Color"
                      value={brandingSettings.secondaryColor}
                      onChange={(value) => setBrandingSettings(prev => ({ ...prev, secondaryColor: value }))}
                    />
                    <ColorPicker
                      label="Accent Color"
                      value={brandingSettings.accentColor}
                      onChange={(value) => setBrandingSettings(prev => ({ ...prev, accentColor: value }))}
                    />
                    <ColorPicker
                      label="Background Color"
                      value={brandingSettings.backgroundColor}
                      onChange={(value) => setBrandingSettings(prev => ({ ...prev, backgroundColor: value }))}
                    />
                    <ColorPicker
                      label="Text Color"
                      value={brandingSettings.textColor}
                      onChange={(value) => setBrandingSettings(prev => ({ ...prev, textColor: value }))}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Typography</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Font Family
                      </label>
                      <select
                        value={brandingSettings.fontFamily}
                        onChange={(e) => setBrandingSettings(prev => ({ ...prev, fontFamily: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent"
                      >
                        <option value="Inter">Inter</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Poppins">Poppins</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Border Radius
                      </label>
                      <select
                        value={brandingSettings.borderRadius}
                        onChange={(e) => setBrandingSettings(prev => ({ ...prev, borderRadius: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent"
                      >
                        <option value="0">Square (0px)</option>
                        <option value="0.25rem">Slight (4px)</option>
                        <option value="0.375rem">Medium (6px)</option>
                        <option value="0.5rem">Large (8px)</option>
                        <option value="9999px">Rounded</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Logo</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
                      {brandingSettings.logoUrl ? (
                        <div className="relative">
                          <img
                            src={brandingSettings.logoUrl}
                            alt="Brand logo"
                            className="max-h-24 w-auto"
                          />
                          <button
                            onClick={() => setBrandingSettings(prev => ({ ...prev, logoUrl: '' }))}
                            className="absolute -top-2 -right-2 bg-red-100 rounded-full p-1 text-red-600 hover:bg-red-200"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Image className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="mt-2">
                            <input
                              type="text"
                              placeholder="Enter logo URL"
                              value={brandingSettings.logoUrl}
                              onChange={(e) => setBrandingSettings(prev => ({ ...prev, logoUrl: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Style Presets</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Style
                      </label>
                      <select
                        value={brandingSettings.buttonStyle}
                        onChange={(e) => setBrandingSettings(prev => ({ ...prev, buttonStyle: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent"
                      >
                        <option value="default">Default</option>
                        <option value="minimal">Minimal</option>
                        <option value="outline">Outline</option>
                        <option value="gradient">Gradient</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Header Style
                      </label>
                      <select
                        value={brandingSettings.headerStyle}
                        onChange={(e) => setBrandingSettings(prev => ({ ...prev, headerStyle: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent"
                      >
                        <option value="default">Default</option>
                        <option value="centered">Centered</option>
                        <option value="minimal">Minimal</option>
                        <option value="gradient">Gradient</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Custom CSS</h3>
                  <textarea
                    value={brandingSettings.customCss}
                    onChange={(e) => setBrandingSettings(prev => ({ ...prev, customCss: e.target.value }))}
                    rows={6}
                    placeholder="Add custom CSS styles..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent font-mono text-sm"
                  />
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Team Members</h3>
                  <Button onClick={() => setIsTeamModalOpen(true)}>
                    <Users className="h-4 w-4 mr-2" />
                    Manage Team
                  </Button>
                </div>

                <div className="space-y-4">
                  {teamMembers.length > 0 ? (
                    <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                      {teamMembers.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-600 font-medium">
                                {member.name?.charAt(0) || member.email?.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{member.name || member.email}</p>
                              <p className="text-sm text-gray-500">{member.role}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            member.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {member.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Users className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No team members</h3>
                      <p className="mt-1 text-sm text-gray-500">Get started by adding team members to your survey.</p>
                      <div className="mt-6">
                        <Button onClick={() => setIsTeamModalOpen(true)}>
                          <Users className="h-4 w-4 mr-2" />
                          Add Team Members
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'advanced' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Advanced Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Domain & URLs</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Custom Domain
                        </label>
                        <input
                          type="text"
                          value={advancedSettings.customDomain}
                          onChange={(e) => setAdvancedSettings(prev => ({
                            ...prev,
                            customDomain: e.target.value
                          }))}
                          placeholder="survey.yourdomain.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                          Enter your custom domain to serve the survey from your own domain
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Redirect URL
                        </label>
                        <input
                          type="text"
                          value={advancedSettings.redirectUrl}
                          onChange={(e) => setAdvancedSettings(prev => ({
                            ...prev,
                            redirectUrl: e.target.value
                          }))}
                          placeholder="https://yourdomain.com/thank-you"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                          Redirect users to this URL after survey completion
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Analytics & Tracking</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Google Analytics ID
                      </label>
                      <input
                        type="text"
                        value={advancedSettings.analyticsId}
                        onChange={(e) => setAdvancedSettings(prev => ({
                          ...prev,
                          analyticsId: e.target.value
                        }))}
                        placeholder="UA-XXXXXXXXX-X"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Rate Limiting</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={advancedSettings.rateLimit.enabled}
                          onChange={(e) => setAdvancedSettings(prev => ({
                            ...prev,
                            rateLimit: {
                              ...prev.rateLimit,
                              enabled: e.target.checked
                            }
                          }))}
                          className="h-4 w-4 text-[#5D5FEF] focus:ring-[#5D5FEF] border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Enable rate limiting</span>
                      </div>

                      {advancedSettings.rateLimit.enabled && (
                        <div className="grid grid-cols-2 gap-4 pl-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Max Attempts
                            </label>
                            <input
                              type="number"
                              value={advancedSettings.rateLimit.maxAttempts}
                              onChange={(e) => setAdvancedSettings(prev => ({
                                ...prev,
                                rateLimit: {
                                  ...prev.rateLimit,
                                  maxAttempts: parseInt(e.target.value)
                                }
                              }))}
                              min="1"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Time Window (minutes)
                            </label>
                            <input
                              type="number"
                              value={advancedSettings.rateLimit.timeWindow}
                              onChange={(e) => setAdvancedSettings(prev => ({
                                ...prev,
                                rateLimit: {
                                  ...prev.rateLimit,
                                  timeWindow: parseInt(e.target.value)
                                }
                              }))}
                              min="1"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Caching</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={advancedSettings.caching.enabled}
                          onChange={(e) => setAdvancedSettings(prev => ({
                            ...prev,
                            caching: {
                              ...prev.caching,
                              enabled: e.target.checked
                            }
                          }))}
                          className="h-4 w-4 text-[#5D5FEF] focus:ring-[#5D5FEF] border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Enable response caching</span>
                      </div>

                      {advancedSettings.caching.enabled && (
                        <div className="pl-6">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cache Duration (minutes)
                          </label>
                          <input
                            type="number"
                            value={advancedSettings.caching.duration}
                            onChange={(e) => setAdvancedSettings(prev => ({
                              ...prev,
                              caching: {
                                ...prev.caching,
                                duration: parseInt(e.target.value)
                              }
                            }))}
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Meta Tags</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Meta Title
                        </label>
                        <input
                          type="text"
                          value={advancedSettings.metaTags.title}
                          onChange={(e) => setAdvancedSettings(prev => ({
                            ...prev,
                            metaTags: {
                              ...prev.metaTags,
                              title: e.target.value
                            }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Meta Description
                        </label>
                        <textarea
                          value={advancedSettings.metaTags.description}
                          onChange={(e) => setAdvancedSettings(prev => ({
                            ...prev,
                            metaTags: {
                              ...prev.metaTags,
                              description: e.target.value
                            }
                          }))}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Meta Keywords
                        </label>
                        <input
                          type="text"
                          value={advancedSettings.metaTags.keywords}
                          onChange={(e) => setAdvancedSettings(prev => ({
                            ...prev,
                            metaTags: {
                              ...prev.metaTags,
                              keywords: e.target.value
                            }
                          }))}
                          placeholder="keyword1, keyword2, keyword3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Custom Code</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Custom JavaScript
                        </label>
                        <textarea
                          value={advancedSettings.customJs}
                          onChange={(e) => setAdvancedSettings(prev => ({
                            ...prev,
                            customJs: e.target.value
                          }))}
                          rows={4}
                          placeholder="// Add your custom JavaScript code here"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent font-mono text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Custom CSS
                        </label>
                        <textarea
                          value={advancedSettings.customCss}
                          onChange={(e) => setAdvancedSettings(prev => ({
                            ...prev,
                            customCss: e.target.value
                          }))}
                          rows={4}
                          placeholder="/* Add your custom CSS styles here */"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 p-4 flex justify-end space-x-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <TeamModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        teamMembers={teamMembers}
        onUpdateTeamMembers={handleUpdateTeamMembers}
      />
    </Modal>
  );
};

export default SettingsModal;