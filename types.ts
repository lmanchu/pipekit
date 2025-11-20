export enum PipelineStage {
  LEAD = 'Lead',
  QUALIFIED = 'Qualified',
  PROPOSAL = 'Proposal',
  NEGOTIATION = 'Negotiation',
  WON = 'Won',
  LOST = 'Lost'
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  avatar?: string;
  phone?: string;
  tags: string[];
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: PipelineStage;
  contactId: string;
  createdAt: string;
  notes: string;
  expectedCloseDate?: string;
}

export interface Email {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  body: string;
  timestamp: string;
  isRead: boolean;
}

export interface ExtractedDealData {
  dealTitle: string;
  estimatedValue: number;
  summary: string;
  confidenceScore: number;
  suggestedNextSteps: string[];
}
