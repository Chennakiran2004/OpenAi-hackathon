export type Role = 'student' | 'recruiter';
export type View = 'landing' | 'auth' | 'home' | 'profile';
export type AuthMode = 'signin' | 'signup';

export type User = {
  name: string;
  email: string;
  role: Role;
};

export type Candidate = {
  id: number;
  name: string;
  college: string;
  location: string;
  role: string;
  skillMatch: number;
  projectSimilarity: number;
  experienceFit: number;
  locationFit: number;
  cultureKeywords: number;
  finalScore: number;
  skillGaps: string[];
};

export type ProcessingStatus = 'idle' | 'running' | 'done';
