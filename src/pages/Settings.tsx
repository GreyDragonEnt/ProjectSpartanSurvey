import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Globe, Palette, Users, Key } from 'lucide-react';
import Button from '../components/ui/Button';
import useToast from '../hooks/useToast';
import TeamModal from '../components/modals/TeamModal';
import { TeamMember } from '../context/SurveyContext';

const Settings: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('team');
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      email: 'john@example.com',
      role: 'admin',
      status: 'active',
      joinedAt: new Date('2024-01-01')
    },
    {
      email: 'sarah@example.com',
      role: 'editor',
      status: 'active',
      joinedAt: new Date('2024-01-02')
    },
    {
      email: 'mike@example.com',
      role: 'viewer',
      status: 'pending',
      joinedAt: new Date('2024-01-03')
    }
  ]);

  const [accountSettings, setAccountSettings] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    language: 'English',
    timezone: 'UTC-5'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    browserNotifications: true,
    weeklyDigest: true,
    mentionNotifications: true
  });

  const [brandingSettings, setBrandingSettings] = useState({
    companyName: 'My Company',
    logo: '',
    primaryColor: '#2563eb',
    accentColor: '#60a5fa',
    fontFamily: 'Inter'
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    passwordLastChanged: '2024-01-01',
    sessionTimeout: '30',
    ipWhitelist: ''
  });

  const handleSave = () => {
    showToast('Settings saved successfully', 'success');
  };

  const handleUpdateTeamMembers = (members: TeamMember[]) => {
    setTeamMembers(members);
    showToast('Team members updated successfully', 'success');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
            </div>
            <nav className="p-2">
              <button
                onClick={() => setActiveTab('account')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'account'
                    ? 'bg-[#5D5FEF]/5 text-[#5D5FEF]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <SettingsIcon className="h-5 w-5 mr-2" />
                Account
              </button>
              <button
                onClick={() => setActiveTab('team')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'team'
                    ? 'bg-[#5D5FEF]/5 text-[#5D5FEF]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Users className="h-5 w-5 mr-2" />
                Team
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'notifications'
                    ? 'bg-[#5D5FEF]/5 text-[#5D5FEF]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Bell className="h-5 w-5 mr-2" />
                Notifications
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'security'
                    ? 'bg-[#5D5FEF]/5 text-[#5D5FEF]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Shield className="h-5 w-5 mr-2" />
                Security
              </button>
              <button
                onClick={() => setActiveTab('branding')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'branding'
                    ? 'bg-[#5D5FEF]/5 text-[#5D5FEF]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Palette className="h-5 w-5 mr-2" />
                Branding
              </button>
              <button
                onClick={() => setActiveTab('integrations')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'integrations'
                    ? 'bg-[#5D5FEF]/5 text-[#5D5FEF]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Globe className="h-5 w-5 mr-2" />
                Integrations
              </button>
              <button
                onClick={() => setActiveTab('api')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'api'
                    ? 'bg-[#5D5FEF]/5 text-[#5D5FEF]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Key className="h-5 w-5 mr-2" />
                API Keys
              </button>
            </nav>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white rounded-lg shadow">
            {activeTab === 'team' && (
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Team Management</h2>
                    <p className="text-gray-600 mt-1">Manage your team members and their roles</p>
                  </div>
                  <Button
                    onClick={() => setIsTeamModalOpen(true)}
                    className="bg-[#5D5FEF] hover:bg-[#5D5FEF]/90 text-white"
                  >
                    <Users className="h-5 w-5 mr-2" />
                    Manage Team
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Access Levels</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• <span className="font-medium">Admins</span> can manage team members and all survey settings</p>
                      <p>• <span className="font-medium">Editors</span> can create and edit surveys</p>
                      <p>• <span className="font-medium">Viewers</span> can only view surveys and responses</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Current Team Members ({teamMembers.length})</h3>
                    <div className="divide-y divide-gray-200">
                      {teamMembers.map((member) => (
                        <div
                          key={member.email}
                          className="py-4 flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                              member.role === 'admin' ? 'bg-[#5D5FEF]/10' :
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
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{member.email}</p>
                              <p className="text-xs text-gray-500">
                                {member.status === 'pending' ? 'Pending' : 'Active'} •{' '}
                                {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                              </p>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            Joined {new Date(member.joinedAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={accountSettings.name}
                      onChange={(e) => setAccountSettings(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={accountSettings.email}
                      onChange={(e) => setAccountSettings(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Language
                    </label>
                    <select
                      value={accountSettings.language}
                      onChange={(e) => setAccountSettings(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Timezone
                    </label>
                    <select
                      value={accountSettings.timezone}
                      onChange={(e) => setAccountSettings(prev => ({ ...prev, timezone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="UTC-8">Pacific Time (UTC-8)</option>
                      <option value="UTC-5">Eastern Time (UTC-5)</option>
                      <option value="UTC+0">UTC</option>
                      <option value="UTC+1">Central European Time (UTC+1)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) => setNotificationSettings(prev => ({
                        ...prev,
                        emailNotifications: e.target.checked
                      }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-700">Email Notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notificationSettings.browserNotifications}
                      onChange={(e) => setNotificationSettings(prev => ({
                        ...prev,
                        browserNotifications: e.target.checked
                      }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-700">Browser Notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notificationSettings.weeklyDigest}
                      onChange={(e) => setNotificationSettings(prev => ({
                        ...prev,
                        weeklyDigest: e.target.checked
                      }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-700">Weekly Digest</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notificationSettings.mentionNotifications}
                      onChange={(e) => setNotificationSettings(prev => ({
                        ...prev,
                        mentionNotifications: e.target.checked
                      }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-700">Mention Notifications</span>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'branding' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Branding Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={brandingSettings.companyName}
                      onChange={(e) => setBrandingSettings(prev => ({ ...prev, companyName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Logo URL
                    </label>
                    <input
                      type="text"
                      value={brandingSettings.logo}
                      onChange={(e) => setBrandingSettings(prev => ({ ...prev, logo: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Primary Color
                      </label>
                      <div className="flex">
                        <input
                          type="color"
                          value={brandingSettings.primaryColor}
                          onChange={(e) => setBrandingSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                          className="h-9 w-9 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={brandingSettings.primaryColor}
                          onChange={(e) => setBrandingSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                          className="flex-1 ml-2 px-3 py-1 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Accent Color
                      </label>
                      <div className="flex">
                        <input
                          type="color"
                          value={brandingSettings.accentColor}
                          onChange={(e) => setBrandingSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                          className="h-9 w-9 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={brandingSettings.accentColor}
                          onChange={(e) => setBrandingSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                          className="flex-1 ml-2 px-3 py-1 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Font Family
                    </label>
                    <select
                      value={brandingSettings.fontFamily}
                      onChange={(e) => setBrandingSettings(prev => ({ ...prev, fontFamily: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="Inter">Inter</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Open Sans">Open Sans</option>
                      <option value="Poppins">Poppins</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={securitySettings.twoFactorAuth}
                        onChange={(e) => setSecuritySettings(prev => ({
                          ...prev,
                          twoFactorAuth: e.target.checked
                        }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-gray-700">Enable Two-Factor Authentication</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      IP Whitelist (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={securitySettings.ipWhitelist}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, ipWhitelist: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="192.168.1.1, 10.0.0.1"
                    />
                  </div>
                  <div>
                    <Button
                      onClick={() => showToast('Password reset email sent', 'success')}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Change Password
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TeamModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        members={teamMembers}
        onUpdateMembers={handleUpdateTeamMembers}
      />
    </div>
  );
};

export default Settings;