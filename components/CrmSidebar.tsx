import React, { useState, useEffect } from 'react';
import { Contact, Deal, Email, PipelineStage, ExtractedDealData } from '../types';
import { analyzeEmailWithGemini } from '../services/geminiService';
import { MagicIcon, SlackIcon, PlusIcon } from './Icons';

interface CrmSidebarProps {
  email: Email | null;
  contacts: Contact[];
  deals: Deal[];
  onAddContact: (contact: Contact) => void;
  onAddDeal: (deal: Deal) => void;
}

const CrmSidebar: React.FC<CrmSidebarProps> = ({ email, contacts, deals, onAddContact, onAddDeal }) => {
  const [activeContact, setActiveContact] = useState<Contact | undefined>(undefined);
  const [activeDeals, setActiveDeals] = useState<Deal[]>([]);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<ExtractedDealData | null>(null);

  useEffect(() => {
    if (email) {
      const foundContact = contacts.find(c => c.email === email.senderEmail);
      setActiveContact(foundContact);
      if (foundContact) {
        setActiveDeals(deals.filter(d => d.contactId === foundContact.id));
      } else {
        setActiveDeals([]);
      }
      setAiSuggestion(null);
    }
  }, [email, contacts, deals]);

  const handleAnalyze = async () => {
    if (!email) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeEmailWithGemini(email.body, email.sender, email.subject);
      setAiSuggestion(result);
    } catch (e) {
        console.error(e);
        alert("Failed to analyze email");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCreateFromAI = () => {
    if (!aiSuggestion || !email) return;

    // 1. Create Contact if not exists
    let contactId = activeContact?.id;
    if (!activeContact) {
      const newContact: Contact = {
        id: `c-${Date.now()}`,
        name: email.sender,
        email: email.senderEmail,
        company: 'Unknown Company', // In real app, extract from domain
        tags: ['New Lead']
      };
      onAddContact(newContact);
      contactId = newContact.id;
      setActiveContact(newContact);
    }

    // 2. Create Deal
    if (contactId) {
      const newDeal: Deal = {
        id: `d-${Date.now()}`,
        title: aiSuggestion.dealTitle,
        value: aiSuggestion.estimatedValue,
        stage: PipelineStage.LEAD,
        contactId: contactId,
        createdAt: new Date().toISOString(),
        notes: aiSuggestion.summary
      };
      onAddDeal(newDeal);
      setActiveDeals(prev => [...prev, newDeal]);
      setAiSuggestion(null); // Clear suggestion after adding
    }
  };

  if (!email) {
    return (
      <div className="w-80 border-l bg-gray-50 p-4 flex flex-col items-center justify-center text-gray-400 text-sm">
        <div className="mb-2">Open an email to view CRM insights</div>
      </div>
    );
  }

  return (
    <div className="w-80 border-l bg-white flex flex-col h-full shadow-xl z-10">
      {/* Add-on Header */}
      <div className="h-14 border-b flex items-center px-4 bg-white">
        <span className="font-semibold text-gray-700 flex items-center">
           <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span> CRM Context
        </span>
        <div className="ml-auto flex space-x-2">
             <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
             </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        
        {/* Contact Section */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Contact</h3>
          {activeContact ? (
            <div className="bg-white border rounded-lg p-3 shadow-sm">
              <div className="flex items-center mb-3">
                 <img src={activeContact.avatar || `https://ui-avatars.com/api/?name=${activeContact.name}`} alt="avatar" className="w-10 h-10 rounded-full mr-3" />
                 <div>
                    <div className="font-semibold text-gray-900">{activeContact.name}</div>
                    <div className="text-xs text-gray-500">{activeContact.company}</div>
                 </div>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {activeContact.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">{tag}</span>
                ))}
              </div>
              <div className="mt-3 pt-2 border-t flex justify-between">
                 <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                 <button className="text-xs text-gray-500 hover:text-gray-700">View History</button>
              </div>
            </div>
          ) : (
             <div className="bg-gray-50 border border-dashed rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500 mb-2">Unknown Contact</p>
                <button 
                    onClick={() => handleCreateFromAI()} // Simple fallback for demo
                    className="text-xs bg-white border px-3 py-1 rounded shadow-sm hover:bg-gray-50"
                >
                    Add to CRM
                </button>
             </div>
          )}
        </div>

        {/* AI Analysis Section */}
        <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Smart Analysis</h3>
                {activeContact && !aiSuggestion && (
                    <button 
                        onClick={handleAnalyze} 
                        disabled={isAnalyzing}
                        className="flex items-center text-xs text-purple-600 hover:text-purple-700 disabled:opacity-50"
                    >
                        <MagicIcon className="w-3 h-3 mr-1" />
                        {isAnalyzing ? 'Analyzing...' : 'Scan Email'}
                    </button>
                )}
            </div>

            {aiSuggestion && (
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-sm text-purple-900">Deal Detected</h4>
                        <span className="text-xs bg-purple-200 text-purple-800 px-1.5 rounded">{aiSuggestion.confidenceScore}% Match</span>
                    </div>
                    <p className="text-xs text-purple-800 mb-2">
                        <span className="font-semibold">Title:</span> {aiSuggestion.dealTitle}<br/>
                        <span className="font-semibold">Value:</span> ${aiSuggestion.estimatedValue.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600 italic mb-3">"{aiSuggestion.summary}"</p>
                    
                    <div className="space-y-1 mb-3">
                        {aiSuggestion.suggestedNextSteps.map((step, idx) => (
                            <div key={idx} className="flex items-center text-xs text-gray-600">
                                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></span>
                                {step}
                            </div>
                        ))}
                    </div>

                    <button 
                        onClick={handleCreateFromAI}
                        className="w-full py-1.5 bg-purple-600 text-white text-xs rounded shadow-sm hover:bg-purple-700 flex items-center justify-center"
                    >
                        <PlusIcon className="w-3 h-3 mr-1" /> Create Deal
                    </button>
                </div>
            )}
        </div>

        {/* Deals Section */}
        <div className="mb-6">
           <div className="flex items-center justify-between mb-3">
             <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Deals</h3>
             <button className="text-gray-400 hover:text-blue-600"><PlusIcon className="w-4 h-4" /></button>
           </div>
           
           <div className="space-y-2">
             {activeDeals.length > 0 ? (
                 activeDeals.map(deal => (
                    <div key={deal.id} className="bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-500">
                        <div className="text-sm font-medium text-gray-900">{deal.title}</div>
                        <div className="flex justify-between items-center mt-1">
                            <span className="text-xs font-bold text-gray-700">${deal.value.toLocaleString()}</span>
                            <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full uppercase">{deal.stage}</span>
                        </div>
                    </div>
                 ))
             ) : (
                 <div className="text-sm text-gray-400 italic text-center py-4">No active deals</div>
             )}
           </div>
        </div>

        {/* Integrations Teaser */}
        <div className="mt-auto pt-4 border-t">
            <div className="flex items-center justify-between text-gray-500 mb-2">
                <span className="text-xs font-medium">Integrations</span>
            </div>
            <div className="flex space-x-2">
                <button className="flex-1 flex items-center justify-center border rounded py-1.5 hover:bg-gray-50 text-xs text-gray-600" title="Notify Slack Channel">
                    <SlackIcon className="w-4 h-4 mr-1 text-gray-600" /> Notify
                </button>
                 <button className="flex-1 flex items-center justify-center border rounded py-1.5 hover:bg-gray-50 text-xs text-gray-600">
                    Calendar
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default CrmSidebar;
