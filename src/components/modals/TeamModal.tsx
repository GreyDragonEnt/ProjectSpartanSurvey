import React, { useState } from 'react';
import { X, Mail, UserPlus, Trash2, Shield, User } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import useToast from '../../hooks/useToast';
import { TeamMember } from '../../context/SurveyContext';

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: TeamMember[];
  onUpdateMembers: (members: TeamMember[]) => void;
}

const TeamModal: React.FC<TeamModalProps> = ({
  isOpen,
  onClose,
  members,
  onUpdateMembers
}) => {
  const { showToast } = useToast();
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'editor' | 'viewer'>('editor');

  const handleInvite = () => {
    if (!newMemberEmail) {
      showToast('Please enter an email address', 'error');
      return;
    }

    if (!newMemberEmail.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    if (members.some(member => member.email === newMemberEmail)) {
      showToast('This user is already a team member', 'error');
      return;
    }

    const newMember: TeamMember = {
      email: newMemberEmail,
      role: newMemberRole,
      status: 'pending',
      joinedAt: new Date()
    };

    onUpdateMembers([...members, newMember]);
    setNewMemberEmail('');
    showToast('Invitation sent successfully', 'success');
  };

  const handleRemoveMember = (email: string) => {
    onUpdateMembers(members.filter(member => member.email !== email));
    showToast('Team member removed', 'success');
  };

  const handleRoleChange = (email: string, role: TeamMember['role']) => {
    onUpdateMembers(
      members.map(member =>
        member.email === email ? { ...member, role } : member
      )
    );
    showToast('Role updated successfully', 'success');
  };

  const getRoleIcon = (role: TeamMember['role']) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4 text-[#5D5FEF]" />;
      case 'editor':
        return <UserPlus className="h-4 w-4 text-[#23C4A2]" />;
      case 'viewer':
        return <User className="h-4 w-4 text-[#F9A826]" />;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage who has access to this survey
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Invite new member */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Invite Team Members
            </h3>
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-6">
                <input
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent"
                />
              </div>
              <div className="col-span-3">
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value as 'editor' | 'viewer')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent"
                >
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <div className="col-span-3">
                <Button
                  onClick={handleInvite}
                  className="w-full bg-[#5D5FEF] hover:bg-[#5D5FEF]/90 text-white"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Invite
                </Button>
              </div>
            </div>
          </div>

          {/* Team members list */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">
              Current Team Members ({members.length})
            </h3>
            <div className="divide-y divide-gray-200">
              {members.map((member) => (
                <div
                  key={member.email}
                  className="py-3 flex items-center justify-between"
                >
                  <div className="flex items-center min-w-0">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      member.role === 'admin' ? 'bg-[#5D5FEF]/10' :
                      member.role === 'editor' ? 'bg-[#23C4A2]/10' :
                      'bg-[#F9A826]/10'
                    }`}>
                      {getRoleIcon(member.role)}
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
                  <div className="flex items-center gap-2 ml-4">
                    {member.role !== 'admin' && (
                      <>
                        <select
                          value={member.role}
                          onChange={(e) =>
                            handleRoleChange(
                              member.email,
                              e.target.value as TeamMember['role']
                            )
                          }
                          className="text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] focus:border-transparent"
                        >
                          <option value="editor">Editor</option>
                          <option value="viewer">Viewer</option>
                        </select>
                        <button
                          onClick={() => handleRemoveMember(member.email)}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TeamModal;