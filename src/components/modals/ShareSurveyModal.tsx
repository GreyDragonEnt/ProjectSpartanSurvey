import React, { useState } from 'react';
import { Link2, Mail, MessageSquare, Copy, QrCode, Facebook, Twitter, Linkedin as LinkedIn } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import useToast from '../../hooks/useToast';

interface ShareSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  surveyId: string;
  surveyTitle: string;
}

const ShareSurveyModal: React.FC<ShareSurveyModalProps> = ({
  isOpen,
  onClose,
  surveyId,
  surveyTitle
}) => {
  const { showToast } = useToast();
  const [emailRecipients, setEmailRecipients] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  
  const surveyUrl = `${window.location.origin}/survey/${surveyId}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(surveyUrl);
    showToast('Survey link copied to clipboard', 'success');
  };

  const handleEmailShare = () => {
    const emailSubject = encodeURIComponent(`Please complete this survey: ${surveyTitle}`);
    const emailBody = encodeURIComponent(`${emailMessage}\n\nTake the survey here: ${surveyUrl}`);
    window.open(`mailto:${emailRecipients}?subject=${emailSubject}&body=${emailBody}`);
    showToast('Email client opened', 'success');
  };

  const handleSocialShare = (platform: 'facebook' | 'twitter' | 'linkedin') => {
    const text = encodeURIComponent(`Take my survey: ${surveyTitle}`);
    const url = encodeURIComponent(surveyUrl);
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    };
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  const generateQRCode = () => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(surveyUrl)}`;
    window.open(qrUrl, '_blank');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Share Survey</h2>
        
        <div className="space-y-6">
          {/* Direct Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Survey Link
            </label>
            <div className="flex">
              <input
                type="text"
                value={surveyUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-gray-100 border border-gray-300 border-l-0 rounded-r-md hover:bg-gray-200"
              >
                <Copy className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Email Share */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share via Email
            </label>
            <div className="space-y-3">
              <input
                type="text"
                value={emailRecipients}
                onChange={(e) => setEmailRecipients(e.target.value)}
                placeholder="Enter email addresses (comma-separated)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <textarea
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                placeholder="Add a personal message (optional)"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <Button
                onClick={handleEmailShare}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Mail className="h-5 w-5 mr-2" />
                Send Email
              </Button>
            </div>
          </div>

          {/* Social Share */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share on Social Media
            </label>
            <div className="flex space-x-2">
              <Button
                onClick={() => handleSocialShare('facebook')}
                className="flex-1 bg-[#1877F2] hover:bg-[#166fe5] text-white"
              >
                <Facebook className="h-5 w-5 mr-2" />
                Facebook
              </Button>
              <Button
                onClick={() => handleSocialShare('twitter')}
                className="flex-1 bg-[#1DA1F2] hover:bg-[#1a94df] text-white"
              >
                <Twitter className="h-5 w-5 mr-2" />
                Twitter
              </Button>
              <Button
                onClick={() => handleSocialShare('linkedin')}
                className="flex-1 bg-[#0A66C2] hover:bg-[#095fb6] text-white"
              >
                <LinkedIn className="h-5 w-5 mr-2" />
                LinkedIn
              </Button>
            </div>
          </div>

          {/* QR Code */}
          <div>
            <Button
              onClick={generateQRCode}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800"
            >
              <QrCode className="h-5 w-5 mr-2" />
              Generate QR Code
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ShareSurveyModal;