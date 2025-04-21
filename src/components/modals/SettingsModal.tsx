import React, { useState } from 'react';
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
  const [activeTab, setActiveTab] = useState<'general' | 'sharing' | 'notifications' | 'privacy' | 'advanced' | 'branding' | 'team'>('privacy');
  
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

  const handleUpdateTeamMembers = (members: TeamMember[]) => {
    setTeamMembers(members);
    updateSurvey(survey.id, { collaborators: members });
  };

  const handleSave = () => {
    updateSurvey(survey.id, {
      collaborators: teamMembers,
      settings: {
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
        {/* Sidebar */}
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
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
                    placeholder="Enter custom CSS rules"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent font-mono text-sm"
                  />
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Team Management</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Manage who has access to this survey and their permissions
                      </p>
                    </div>
                    <Button
                      onClick={() => setIsTeamModalOpen(true)}
                      className="bg-[#5D5FEF] hover:bg-[#5D5FEF]/90 text-white"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Manage Team
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Access Levels</h4>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="h-8 w-8 rounded-full bg-[#5D5FEF]/10 flex items-center justify-center mt-1">
                            <Shield className="h-4 w-4 text-[#5D5FEF]" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">Admins</p>
                            <p className="text-sm text-gray-500">Can manage team members and all survey settings</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="h-8 w-8 rounded-full bg-[#23C4A2]/10 flex items-center justify-center mt-1">
                            <Users className="h-4 w-4 text-[#23C4A2]" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">Editors</p>
                            <p className="text-sm text-gray-500">Can create and edit surveys</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="h-8 w-8 rounded-full bg-[#F9A826]/10 flex items-center justify-center mt-1">
                            <Users className="h-4 w-4 text-[#F9A826]" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">Viewers</p>
                            <p className="text-sm text-gray-500">Can only view surveys and responses</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-4">
                        Current Team Members ({teamMembers.length})
                      </h4>
                      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
                        {teamMembers.map((member) => (
                          <div
                            key={member.email}
                            className="p-4 flex items-center justify-between"
                          >
                            <div className="flex items-center min-w-0">
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                member.role ===  'admin' ? 'bg-[#5D5FEF]/10' :
                                member.role === 'editor' ? 'bg-[#23C4A2]/10' :
                                'bg-[#F9A826]/10'
                              }`}>
                                {member.role === 'admin' ? (
                                  <Shield className="h-4 w-4 text-[#5D5FEF]" />
                                ) : member.role === 'editor' ? (
                                  <Users className="h-4 w-4 text-[#23C4A2]" />
                                ) : (
                                  <Users className="h-4 w-4 text-[#F9A826]" />
                                )}
                              </div>
                              <div className="ml-3 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {member.email}
                                </p>
                                <div className="flex items-center text-xs text-gray-500 space-x-2">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                    member.status === 'active' 
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {member.status === 'active' ? 'Active' : 'Pending'}
                                  </span>
                                  <span>•</span>
                                  <span>{member.role.charAt(0).toUpperCase() + member.role.slice(1)}</span>
                                  <span>•</span>
                                  <span>Joined {new Date(member.joinedAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 p-4 bg-gray-50 border-t border-gray-200">
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
          Save Changes
        </Button>
      </div>

      <TeamModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        members={teamMembers}
        onUpdateMembers={handleUpdateTeamMembers}
      />
    </Modal>
  );
};

export default SettingsModal;