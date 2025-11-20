import React from 'react';
import { Email } from '../types';

interface EmailClientProps {
  emails: Email[];
  selectedEmailId: string | null;
  onSelectEmail: (id: string) => void;
}

const EmailClient: React.FC<EmailClientProps> = ({ emails, selectedEmailId, onSelectEmail }) => {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Mock Gmail Header */}
      <div className="h-16 border-b flex items-center px-4 bg-gray-50 space-x-4">
        <div className="w-6 h-6 bg-gray-400 rounded opacity-50"></div>
        <div className="flex-1 bg-gray-200 h-10 rounded-lg max-w-xl opacity-50"></div>
        <div className="w-8 h-8 rounded-full bg-blue-500 opacity-50"></div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Email List */}
        <div className="w-1/3 border-r overflow-y-auto bg-white">
          {emails.map((email) => (
            <div
              key={email.id}
              onClick={() => onSelectEmail(email.id)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedEmailId === email.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`font-medium ${email.isRead ? 'text-gray-700' : 'text-black font-bold'}`}>
                  {email.sender}
                </span>
                <span className="text-xs text-gray-500">{email.timestamp}</span>
              </div>
              <div className={`text-sm mb-1 truncate ${email.isRead ? 'text-gray-600' : 'text-black font-semibold'}`}>
                {email.subject}
              </div>
              <div className="text-xs text-gray-400 truncate">
                {email.body.substring(0, 50)}...
              </div>
            </div>
          ))}
        </div>

        {/* Email Body */}
        <div className="flex-1 flex flex-col bg-white relative">
          {selectedEmailId ? (
            (() => {
              const activeEmail = emails.find((e) => e.id === selectedEmailId);
              if (!activeEmail) return null;
              return (
                <div className="p-8 overflow-y-auto h-full">
                  <h2 className="text-2xl font-medium mb-6">{activeEmail.subject}</h2>
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-lg mr-3">
                      {activeEmail.sender.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold">{activeEmail.sender}</div>
                      <div className="text-sm text-gray-500">{activeEmail.senderEmail}</div>
                    </div>
                  </div>
                  <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {activeEmail.body}
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Select an email to read
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailClient;
