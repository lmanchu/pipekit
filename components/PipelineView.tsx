import React from 'react';
import { Deal, PipelineStage, Contact } from '../types';

interface PipelineViewProps {
  deals: Deal[];
  contacts: Contact[];
  onUpdateDealStage: (dealId: string, newStage: PipelineStage) => void;
}

const STAGES = Object.values(PipelineStage);

const PipelineView: React.FC<PipelineViewProps> = ({ deals, contacts, onUpdateDealStage }) => {
  
  const getDealsByStage = (stage: PipelineStage) => deals.filter(d => d.stage === stage);

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData("dealId", dealId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, stage: PipelineStage) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData("dealId");
    if (dealId) {
      onUpdateDealStage(dealId, stage);
    }
  };

  const getContactName = (id: string) => contacts.find(c => c.id === id)?.name || 'Unknown';

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="h-full flex p-6 space-x-4 min-w-max">
          {STAGES.map((stage) => {
            const stageDeals = getDealsByStage(stage);
            const stageValue = stageDeals.reduce((acc, d) => acc + d.value, 0);

            return (
              <div
                key={stage}
                className="w-72 flex flex-col bg-gray-100 rounded-lg max-h-full"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage)}
              >
                {/* Stage Header */}
                <div className="p-3 border-b border-gray-200 flex-shrink-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">{stage}</h3>
                    <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded-full shadow-sm">{stageDeals.length}</span>
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    ${stageValue.toLocaleString()}
                  </div>
                </div>

                {/* Stage Body (Droppable) */}
                <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin">
                  {stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal.id)}
                      className="bg-white p-3 rounded shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-all group"
                    >
                      <div className="text-sm font-medium text-gray-800 mb-1 group-hover:text-blue-600">
                        {deal.title}
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        {getContactName(deal.contactId)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-700 bg-gray-50 px-1.5 py-0.5 rounded">
                          ${deal.value.toLocaleString()}
                        </span>
                        {deal.notes && (
                            <div className="w-2 h-2 bg-yellow-400 rounded-full" title="Has notes"></div>
                        )}
                      </div>
                    </div>
                  ))}
                  {stageDeals.length === 0 && (
                      <div className="h-24 flex items-center justify-center text-gray-400 text-xs border-2 border-dashed border-gray-200 rounded m-2">
                          Drag deals here
                      </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PipelineView;
