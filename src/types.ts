export type TicketCategory =
  | 'hardware'
  | 'software'
  | 'network'
  | 'printers'
  | 'security'
  | 'accounts';

export type DeviceType =
  | 'desktop'
  | 'laptop'
  | 'printer'
  | 'monitor'
  | 'network_device'
  | 'projector'
  | 'other';

export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

export type TicketStatus =
  | 'new'
  | 'assigned'
  | 'in_progress'
  | 'waiting_parts'
  | 'resolved'
  | 'closed';

export interface ActivityLogItem {
  id: string;
  date: string;
  author: string;
  action: string;
  note?: string;
}

export interface Ticket {
  id: string;
  createdAt: string;
  requesterName: string;
  employeeId: string;
  department: string;
  buildingRoom: string;
  phone: string;
  email: string;
  category: TicketCategory;
  deviceType: DeviceType;
  deviceSerial?: string;
  priority: TicketPriority;
  title: string;
  description: string;
  errorCode?: string;
  imageUrl?: string;
  status: TicketStatus;
  assignedTechnician?: string;
  technicianNotes?: string;
  partsReplaced?: string;
  resolutionSummary?: string;
  resolvedAt?: string;
  activityLog: ActivityLogItem[];
  rating?: number;
  ratingFeedback?: string;
}

export interface KnowledgeArticle {
  id: string;
  category: TicketCategory;
  title: string;
  summary: string;
  steps: string[];
  tips?: string[];
  commands?: string[];
  helpfulVotes: number;
  readTime: string;
}

export interface DiagnosticNode {
  id: string;
  question: string;
  description?: string;
  category: TicketCategory;
  deviceType: DeviceType;
  options: {
    label: string;
    description?: string;
    nextNodeId?: string;
    solution?: {
      title: string;
      steps: string[];
      isSolved: boolean;
      prefillTitle?: string;
      prefillDesc?: string;
    };
  }[];
}
