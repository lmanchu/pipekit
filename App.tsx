import React, { useState } from 'react';
import { Contact, Deal, Email, PipelineStage } from './types';
import { MOCK_CONTACTS, MOCK_DEALS, MOCK_EMAILS } from './constants';
import EmailClient from './components/EmailClient';
import CrmSidebar from './components/CrmSidebar';
import PipelineView from './components/PipelineView';
import AnalyticsView from './components/AnalyticsView';
import { LogoIcon, BriefcaseIcon, ChartIcon } from './components/Icons';

enum ViewMode {
  MAILBOX = 'mailbox',
  PIPELINE = 'pipeline',
  ANALYTICS = 'analytics'
}

const App: React.FC = () => {
  // Global State (simulating backend)
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.MAILBOX);
  const [emails] = useState<Email[]>(MOCK_EMAILS);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);

  const activeEmail = emails.find(e => e.id === selectedEmailId) || null;

  const handleAddContact = (newContact: Contact) => {
    setContacts([...contacts, newContact]);
  };

  const handleAddDeal = (newDeal: Deal) => {
    setDeals([...deals, newDeal]);
  };

  const handleUpdateDealStage = (dealId: string, newStage: PipelineStage) => {
    setDeals(deals.map(d => d.id === dealId ? { ...d, stage: newStage } : d));
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800 font-sans overflow-hidden">
      {/* Main Navigation Bar */}
      <aside className="w-16 bg-white border-r flex flex-col items-center py-6 space-y-6 z-20">
        <div className="mb-4" title="Lightweight CRM">
          <LogoIcon />
        </div>
        
        <button 
          onClick={() => setViewMode(ViewMode.MAILBOX)}
          className={`p-3 rounded-xl transition-colors ${viewMode === ViewMode.MAILBOX ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
          title="Gmail"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </button>

        <button 
          onClick={() => setViewMode(ViewMode.PIPELINE)}
          className={`p-3 rounded-xl transition-colors ${viewMode === ViewMode.PIPELINE ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
          title="Pipeline"
        >
          <BriefcaseIcon className="w-6 h-6" />
        </button>

        <button 
          onClick={() => setViewMode(ViewMode.ANALYTICS)}
          className={`p-3 rounded-xl transition-colors ${viewMode === ViewMode.ANALYTICS ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
          title="Analytics"
        >
          <ChartIcon className="w-6 h-6" />
        </button>

        <div className="mt-auto">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500"></div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* View: Mailbox (Split Screen) */}
        {viewMode === ViewMode.MAILBOX && (
          <>
            <div className="flex-1 flex flex-col min-w-0">
              <EmailClient 
                emails={emails} 
                selectedEmailId={selectedEmailId}
                onSelectEmail={setSelectedEmailId}
              />
            </div>
            {/* The CRM Sidebar acts as the Add-on */}
            <CrmSidebar 
              email={activeEmail}
              contacts={contacts}
              deals={deals}
              onAddContact={handleAddContact}
              onAddDeal={handleAddDeal}
            />
          </>
        )}

        {/* View: Pipeline */}
        {viewMode === ViewMode.PIPELINE && (
          <div className="w-full h-full">
              <PipelineView 
                  deals={deals} 
                  contacts={contacts}
                  onUpdateDealStage={handleUpdateDealStage}
              />
          </div>
        )}

        {/* View: Analytics */}
        {viewMode === ViewMode.ANALYTICS && (
          <div className="w-full h-full">
              <AnalyticsView deals={deals} />
          </div>
        )}

      </main>
    </div>
  );
};

export default App;
