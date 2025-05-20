import { getKnowledgeGraph } from './knowledgeService';
import { analyzeSkillEquivalence, analyzeExperienceDepth, analyzePotentialFit } from './llmService';
import { Candidate, JobRequirement, MatchResult } from '../types';

/**
 * Match candidates to job requirements using the knowledge graph and LLM augmentation
 * @param jobRequirements The job requirements to match against
 * @param candidates The candidates to evaluate
 * @returns Ranked list of candidates with match scores and explanations
 */
export async function matchCandidates(
  jobRequirements: JobRequirement[],
  candidates: Candidate[]
): Promise<MatchResult[]> {
  // Get the knowledge graph for skill relationships
  const knowledgeGraph = await getKnowledgeGraph();
  
  // Process each candidate
  const matchResults: MatchResult[] = [];
  
  for (const candidate of candidates) {
    // Extract and normalize skills from both job requirements and candidate
    const normalizedJobSkills = normalizeSkills(jobRequirements.map(req => req.skill));
    const normalizedCandidateSkills = normalizeSkills(candidate.skills.map(s => s.name));
    
    // 1. Skill Equivalence Analysis
    const skillEquivalenceScore = await analyzeSkillEquivalence(
      normalizedJobSkills,
      normalizedCandidateSkills,
      knowledgeGraph
    );
    
    // 2. Experience Depth Analysis
    const experienceDepthScore = await analyzeExperienceDepth(
      jobRequirements,
      candidate.skills,
      knowledgeGraph
    );
    
    // 3. Potential Fit Analysis
    const potentialFitScore = await analyzePotentialFit(
      jobRequirements,
      candidate,
      knowledgeGraph
    );
    
    // Calculate weighted total score
    const totalScore = calculateTotalScore(
      skillEquivalenceScore,
      experienceDepthScore,
      potentialFitScore
    );
    
    // Generate explanations for the match
    const explanations = generateExplanations(
      candidate,
      jobRequirements,
      skillEquivalenceScore,
      experienceDepthScore,
      potentialFitScore
    );
    
    // Add to results
    matchResults.push({
      candidateId: candidate.id,
      candidateName: candidate.name,
      totalScore,
      skillEquivalenceScore,
      experienceDepthScore,
      potentialFitScore,
      explanations
    });
  }
  
  // Sort by total score (descending)
  return matchResults.sort((a, b) => b.totalScore - a.totalScore);
}

/**
 * Normalize skills by converting to lowercase and removing special characters
 */
function normalizeSkills(skills: string[]): string[] {
  return skills.map(skill => 
    skill.toLowerCase().replace(/[^\w\s]/g, '')
  );
}

/**
 * Calculate the weighted total score from the component scores
 */
function calculateTotalScore(
  skillEquivalenceScore: number,
  experienceDepthScore: number,
  potentialFitScore: number
): number {
  // Weights can be adjusted based on importance
  const weights = {
    skillEquivalence: 0.4,
    experienceDepth: 0.4,
    potentialFit: 0.2
  };
  
  return (
    skillEquivalenceScore * weights.skillEquivalence +
    experienceDepthScore * weights.experienceDepth +
    potentialFitScore * weights.potentialFit
  );
}

/**
 * Generate explanations for why a candidate received their scores
 */
function generateExplanations(
  candidate: Candidate,
  jobRequirements: JobRequirement[],
  skillEquivalenceScore: number,
  experienceDepthScore: number,
  potentialFitScore: number
): string[] {
  const explanations: string[] = [];
  
  // Skill equivalence explanations
  if (skillEquivalenceScore > 0.8) {
    explanations.push(`Strong skill match: ${candidate.name} has most of the required skills or equivalents.`);
  } else if (skillEquivalenceScore > 0.5) {
    explanations.push(`Moderate skill match: ${candidate.name} has some of the required skills or equivalents.`);
  } else {
    explanations.push(`Limited skill match: ${candidate.name} has few direct matches to required skills.`);
  }
  
  // Experience depth explanations
  if (experienceDepthScore > 0.8) {
    explanations.push(`Deep experience: ${candidate.name} has significant depth in the required skills.`);
  } else if (experienceDepthScore > 0.5) {
    explanations.push(`Moderate experience: ${candidate.name} has some depth in the required skills.`);
  } else {
    explanations.push(`Limited experience: ${candidate.name} has minimal depth in the required skills.`);
  }
  
  // Potential fit explanations
  if (potentialFitScore > 0.8) {
    explanations.push(`High potential: ${candidate.name} shows strong potential for quick adaptation to the role.`);
  } else if (potentialFitScore > 0.5) {
    explanations.push(`Moderate potential: ${candidate.name} shows some potential for adaptation to the role.`);
  } else {
    explanations.push(`Limited potential: ${candidate.name} may need significant training for this role.`);
  }
  
  return explanations;
}