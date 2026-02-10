import { Candidate } from './types';

const weights = {
  skillMatch: 0.4,
  projectSimilarity: 0.25,
  experienceFit: 0.15,
  locationFit: 0.1,
  cultureKeywords: 0.1
};

const firstNames = ['Aarav', 'Ananya', 'Riya', 'Ishaan', 'Rahul', 'Priya', 'Aditi', 'Neha', 'Kabir', 'Karthik', 'Maya', 'Zoya'];
const lastNames = ['Sharma', 'Patel', 'Iyer', 'Singh', 'Nair', 'Gupta', 'Khan', 'Reddy', 'Mehta', 'Jain', 'Das'];
const colleges = ['IIT Bombay', 'NIT Trichy', 'BITS Pilani', 'VIT Vellore', 'IIIT Hyderabad', 'DTU'];
const locations = ['Bengaluru', 'Hyderabad', 'Pune', 'Chennai', 'Delhi NCR', 'Mumbai'];
const roles = ['Backend Engineer', 'Data Analyst', 'ML Engineer', 'Product Analyst', 'Full Stack Engineer'];
const skillPools = [
  ['System Design', 'Kafka', 'Docker'],
  ['MLOps', 'Model Monitoring', 'Feature Stores'],
  ['SQL Optimization', 'A/B Testing', 'Experiment Design'],
  ['React', 'TypeScript', 'Accessibility'],
  ['NLP', 'Vector Search', 'Prompt Engineering']
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function scoreCandidate(candidate: Omit<Candidate, 'finalScore'>): number {
  return Number(
    (
      weights.skillMatch * candidate.skillMatch +
      weights.projectSimilarity * candidate.projectSimilarity +
      weights.experienceFit * candidate.experienceFit +
      weights.locationFit * candidate.locationFit +
      weights.cultureKeywords * candidate.cultureKeywords
    ).toFixed(2)
  );
}

export function createCandidate(id: number): Candidate {
  const base: Omit<Candidate, 'finalScore'> = {
    id,
    name: `${randomFrom(firstNames)} ${randomFrom(lastNames)}`,
    college: randomFrom(colleges),
    location: randomFrom(locations),
    role: randomFrom(roles),
    skillMatch: 55 + Math.random() * 45,
    projectSimilarity: 40 + Math.random() * 55,
    experienceFit: 35 + Math.random() * 60,
    locationFit: 30 + Math.random() * 70,
    cultureKeywords: 40 + Math.random() * 55,
    skillGaps: randomFrom(skillPools).slice(0, 2)
  };

  return { ...base, finalScore: scoreCandidate(base) };
}
