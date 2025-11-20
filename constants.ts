import { Contact, Deal, Email, PipelineStage } from './types';

export const MOCK_CONTACTS: Contact[] = [
  {
    id: 'c1',
    name: 'Alice Chen',
    email: 'alice@techstart.io',
    company: 'TechStart Inc.',
    tags: ['VIP', 'SaaS'],
    avatar: 'https://picsum.photos/seed/alice/200/200'
  },
  {
    id: 'c2',
    name: 'Bob Smith',
    email: 'bob@enterprise.com',
    company: 'Big Enterprise Corp',
    tags: ['Enterprise', 'Slow'],
    avatar: 'https://picsum.photos/seed/bob/200/200'
  },
  {
    id: 'c3',
    name: 'Sarah Jones',
    email: 'sarah@designstudio.co',
    company: 'Design Studio',
    tags: ['Creative', 'Partner'],
    avatar: 'https://picsum.photos/seed/sarah/200/200'
  }
];

export const MOCK_DEALS: Deal[] = [
  {
    id: 'd1',
    title: 'Q3 Enterprise License',
    value: 45000,
    stage: PipelineStage.NEGOTIATION,
    contactId: 'c2',
    createdAt: '2023-10-01',
    notes: 'Waiting on legal review.'
  },
  {
    id: 'd2',
    title: 'Design Partnership',
    value: 12000,
    stage: PipelineStage.PROPOSAL,
    contactId: 'c3',
    createdAt: '2023-10-15',
    notes: 'Sent initial draft.'
  },
  {
    id: 'd3',
    title: 'Startup Plan - TechStart',
    value: 5000,
    stage: PipelineStage.QUALIFIED,
    contactId: 'c1',
    createdAt: '2023-10-20',
    notes: 'Demo scheduled for Tuesday.'
  }
];

export const MOCK_EMAILS: Email[] = [
  {
    id: 'e1',
    sender: 'Alice Chen',
    senderEmail: 'alice@techstart.io',
    subject: 'Re: Demo Scheduling',
    timestamp: '10:30 AM',
    isRead: true,
    body: `Hi Team,

Thanks for the info yesterday. We are very interested in the Startup Plan. 
Could we schedule a demo for next Tuesday at 2 PM? 

We have a budget of around $5,000 for this quarter.

Best,
Alice`
  },
  {
    id: 'e2',
    sender: 'Bob Smith',
    senderEmail: 'bob@enterprise.com',
    subject: 'Contract Review Redlines',
    timestamp: 'Yesterday',
    isRead: false,
    body: `Hello,

Our legal team has returned the contract with a few redlines regarding the data privacy clause. 
The deal value of $45k looks correct, but we need to finalize the terms before end of month.

Let's discuss.

Regards,
Bob`
  },
  {
    id: 'e3',
    sender: 'New Lead (David)',
    senderEmail: 'david@innovate.net',
    subject: 'Inquiry about Enterprise Solution',
    timestamp: '2 Days ago',
    isRead: true,
    body: `Hi there,

I saw your product at the conference. We are looking to migrate our current CRM to something lighter.
We have about 50 seats needed. Estimated annual spend would be roughly $25,000.

Are you available for a call?

David`
  }
];
