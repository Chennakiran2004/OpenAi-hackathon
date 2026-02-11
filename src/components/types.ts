export type Role = 'state_officer' | 'central_admin';
export type View = 'landing' | 'auth' | 'home' | 'profile';
export type AuthMode = 'signin' | 'signup';

export type User = {
  name: string;
  email: string;
  role: Role;
};

export type WeightConfig = {
  cost: number; // 0-100
  time: number; // 0-100
  carbon: number; // 0-100
};

export type CropOption = {
  id: string;
  name: string;
  unit: string; // e.g., tonnes
};

export type StateOption = {
  code: string;
  name: string;
};

export type Recommendation = {
  id: string;
  sourceState: string;
  crop: string;
  pricePerTonne: number;
  distanceKm: number;
  transportCost: number;
  totalCost: number;
  etaDays: number;
  carbonTons: number;
  savingsVsMax: number;
  highlight: 'best_cost' | 'fastest' | 'lowest_carbon' | null;
  confidence: number;
};

export type ImpactSummary = {
  totalSavings: number;
  carbonReductionPct: number;
  timeSavedHours: number;
  confidence: number;
  monthlySavings: number;
  monthlyCarbonReduced: number;
  avgDeliveryImprovementDays: number;
  optimizedTransactions: number;
};

export type ProcessingStatus = 'idle' | 'running' | 'done';
