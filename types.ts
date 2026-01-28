
export interface UserProfile {
  name: string;
  role: string;
  avatar: string | null;
}

export interface SecurityStatus {
  isSafe: boolean;
  threatLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  message: string;
  details: string[];
}

export interface ScanResult {
  timestamp: string;
  type: 'Link' | 'System' | 'File';
  status: 'Clean' | 'Suspicious' | 'Malicious';
  analysis: string;
}
