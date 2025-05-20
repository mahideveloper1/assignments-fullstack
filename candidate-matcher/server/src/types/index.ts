// Knowledge Graph Types
export interface KnowledgeGraph {
  skills: string[];
  relations: SkillRelation[];
}

export interface SkillRelation {
  id: string;
  source: string;
  target: string;
  strength: number;
}

// Candidate Types
export interface Candidate {
  id: string;
  name: string;
  skills: CandidateSkill[];
  education?: string;
  learningAbility?: string;
}

export interface CandidateSkill {
  name: string;
  yearsOfExperience: number;
  projects?: string[];
}

// Job Requirement Types
export interface JobRequirement {
  skill: string;
  yearsRequired: number;
  importance: number;
}

// Matching Result Types
export interface MatchResult {
  candidateId: string;
  candidateName: string;
  totalScore: number;
  skillEquivalenceScore: number;
  experienceDepthScore: number;
  potentialFitScore: number;
  explanations: string[];
}