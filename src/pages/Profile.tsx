import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Building, Calendar, Camera } from 'lucide-react';
import Button from '../components/ui/Button';
import useToast from '../hooks/useToast';

const Profile: React.FC = () => {
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    company: 'Acme Inc.',
    role: 'Product Manager',
    joinDate: '2023-01-15',
    bio: 'Passionate about creating great user experiences and driving product innovation.',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    skills: ['Product Management', 'UX Design', 'Data Analysis', 'Team Leadership']
  });

  const handleSave = () => {
    setIsEditing(false);
    showToast('Profile updated successfully', 'success');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-blue-600">
            <div className="absolute -bottom-12 left-8">
              <div className="relative">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-24 h-24 rounded-full border-4 border-white object-cover"
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-1 bg-blue-600 rounded-full text-white hover:bg-blue-700">
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="pt-16 px-8 pb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="text-2xl font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                )}
                <p className="text-gray-600">{profile.role} at {profile.company}</p>
              </div>
              <Button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={isEditing ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    {isEditing ? (
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                        className="flex-1 bg-gray-100 px-2 py-1 rounded"
                      />
                    ) : (
                      <span>{profile.email}</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                        className="flex-1 bg-gray-100 px-2 py-1 rounded"
                      />
                    ) : (
                      <span>{profile.phone}</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                        className="flex-1 bg-gray-100 px-2 py-1 rounded"
                      />
                    ) : (
                      <span>{profile.location}</span>
                    )}
                  </div>
                </div>

                <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Work</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Building className="h-5 w-5 text-gray-400 mr-3" />
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.company}
                        onChange={(e) => setProfile(prev => ({ ...prev, company: e.target.value }))}
                        className="flex-1 bg-gray-100 px-2 py-1 rounded"
                      />
                    ) : (
                      <span>{profile.company}</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-3" />
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.role}
                        onChange={(e) => setProfile(prev => ({ ...prev, role: e.target.value }))}
                        className="flex-1 bg-gray-100 px-2 py-1 rounded"
                      />
                    ) : (
                      <span>{profile.role}</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <span>Joined {new Date(profile.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
                {isEditing ? (
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                    className="w-full bg-gray-100 px-3 py-2 rounded"
                  />
                ) : (
                  <p className="text-gray-600">{profile.bio}</p>
                )}

                <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                  {isEditing && (
                    <button
                      onClick={() => showToast('Skill management coming soon', 'info')}
                      className="px-3 py-1 border border-dashed border-blue-300 text-blue-600 rounded-full text-sm hover:bg-blue-50"
                    >
                      + Add Skill
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;