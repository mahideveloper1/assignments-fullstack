import OpenAI from 'openai';
import { KnowledgeGraph, Candidate, JobRequirement, CandidateSkill } from '../types';

// Check if OpenAI API key is available
const useOpenAI = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 0;

// Initialize OpenAI client if API key is available
let openai: OpenAI | null = null;
if (useOpenAI) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} else {
  console.warn('OpenAI API key not found. Using mock responses for LLM services.');
}

/**
 * Analyze skill equivalence between job requirements and candidate skills
 * @param jobSkills Normalized job skills
 * @param candidateSkills Normalized candidate skills
 * @param knowledgeGraph The knowledge graph for skill relationships
 * @returns Score representing skill equivalence (0-1)
 */
export async function analyzeSkillEquivalence(
  jobSkills: string[],
  candidateSkills: string[],
  knowledgeGraph: KnowledgeGraph
): Promise<number> {
  // First, use the knowledge graph to find equivalent skills
  const expandedJobSkills = expandSkillsWithEquivalents(jobSkills, knowledgeGraph);
  const expandedCandidateSkills = expandSkillsWithEquivalents(candidateSkills, knowledgeGraph);
  
  // Calculate direct matches
  const directMatches = expandedJobSkills.filter(skill => 
    expandedCandidateSkills.includes(skill)
  ).length;
  
  // For skills that don't have direct matches, use LLM to analyze potential equivalence
  const unmatchedJobSkills = expandedJobSkills.filter(skill => 
    !expandedCandidateSkills.includes(skill)
  );
  
  if (unmatchedJobSkills.length === 0) {
    return 1.0; // Perfect match
  }
  
  // Use LLM to analyze remaining skills for equivalence
  let additionalMatchScore = 0;
  
  if (unmatchedJobSkills.length > 0) {
    if (useOpenAI && openai) {
      const prompt = `
        I need to determine if the following candidate skills are equivalent to or could substitute for the job requirements.
        
        Job requirements: ${unmatchedJobSkills.join(', ')}
        Candidate skills: ${candidateSkills.join(', ')}
        
        For each job requirement, identify if any of the candidate's skills could be considered equivalent or a close substitute.
        Return a JSON object with each job requirement as a key and a score from 0 to 1 indicating equivalence (0 = no match, 1 = perfect match).
      `;
      
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            { role: "system", content: "You are an expert in technical skills analysis for recruitment." },
            { role: "user", content: prompt }
          ],
          response_format: { type: "json_object" }
        });
        
        const result = JSON.parse(response.choices[0].message.content || '{}');
        
        // Calculate average score from LLM analysis
        const scores = Object.values(result) as number[];
        if (scores.length > 0) {
          additionalMatchScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        }
      } catch (error) {
        console.error('Error in LLM skill equivalence analysis:', error);
        // Fallback to a conservative score if LLM fails
        additionalMatchScore = 0.1;
      }
    } else {
      // Mock response when OpenAI is not available
      console.log('Using mock skill equivalence analysis');
      // Generate a random score between 0.3 and 0.7 for demonstration
      additionalMatchScore = 0.3 + (Math.random() * 0.4);
    }
  }
  
  // Calculate final score as a weighted combination of direct matches and LLM analysis
  const directMatchWeight = 0.7;
  const llmAnalysisWeight = 0.3;
  
  const directMatchScore = directMatches / expandedJobSkills.length;
  
  return (directMatchScore * directMatchWeight) + (additionalMatchScore * llmAnalysisWeight);
}

/**
 * Analyze the depth of experience in required skills
 * @param jobRequirements The job requirements
 * @param candidateSkills The candidate's skills
 * @param knowledgeGraph The knowledge graph
 * @returns Score representing experience depth (0-1)
 */
export async function analyzeExperienceDepth(
  jobRequirements: JobRequirement[],
  candidateSkills: CandidateSkill[],
  knowledgeGraph: KnowledgeGraph
): Promise<number> {
  // For each job requirement, find the corresponding candidate skill and evaluate depth
  let totalDepthScore = 0;
  let matchedRequirements = 0;
  
  for (const requirement of jobRequirements) {
    // Find direct match or equivalent skills
    const normalizedRequirement = requirement.skill.toLowerCase().replace(/[^\w\s]/g, '');
    const equivalentSkills = findEquivalentSkills(normalizedRequirement, knowledgeGraph);
    
    // Find the best matching candidate skill
    let bestMatch: CandidateSkill | null = null;
    let bestMatchScore = 0;
    
    for (const candidateSkill of candidateSkills) {
      const normalizedCandidateSkill = candidateSkill.name.toLowerCase().replace(/[^\w\s]/g, '');
      
      // Check for direct match or match with equivalent skills
      if (
        normalizedCandidateSkill === normalizedRequirement ||
        equivalentSkills.includes(normalizedCandidateSkill)
      ) {
        // Calculate a match score based on years of experience and projects
        const yearsScore = Math.min(candidateSkill.yearsOfExperience / requirement.yearsRequired, 1);
        const projectsScore = candidateSkill.projects ? Math.min(candidateSkill.projects.length / 2, 1) : 0;
        
        const matchScore = (yearsScore * 0.7) + (projectsScore * 0.3);
        
        if (matchScore > bestMatchScore) {
          bestMatch = candidateSkill;
          bestMatchScore = matchScore;
        }
      }
    }
    
    if (bestMatch) {
      totalDepthScore += bestMatchScore;
      matchedRequirements++;
    }
  }
  
  // If no requirements were matched, use LLM to analyze experience depth
  if (matchedRequirements === 0) {
    return await analyzeLLMExperienceDepth(jobRequirements, candidateSkills);
  }
  
  return totalDepthScore / jobRequirements.length;
}

/**
 * Use LLM to analyze experience depth when direct matching fails
 */
async function analyzeLLMExperienceDepth(
  jobRequirements: JobRequirement[],
  candidateSkills: CandidateSkill[]
): Promise<number> {
  if (useOpenAI && openai) {
    const prompt = `
      I need to evaluate the depth of a candidate's experience against job requirements.
      
      Job requirements:
      ${jobRequirements.map(req => `- ${req.skill} (${req.yearsRequired} years required)`).join('\\n')}
      
      Candidate skills:
      ${candidateSkills.map(skill => {
        const projects = skill.projects ? `Projects: ${skill.projects.join(', ')}` : 'No projects listed';
        return `- ${skill.name} (${skill.yearsOfExperience} years) - ${projects}`;
      }).join('\\n')}
      
      Evaluate how well the candidate's experience depth matches the job requirements.
      Return a single score from 0 to 1, where 0 means no relevant experience and 1 means perfect experience match.
    `;
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are an expert in technical recruitment and skills evaluation." },
          { role: "user", content: prompt }
        ]
      });
      
      const content = response.choices[0].message.content || '';
      // Extract the score from the response
      const scoreMatch = content.match(/([0-9](\.[0-9]+)?)/);
      
      if (scoreMatch && scoreMatch[0]) {
        return parseFloat(scoreMatch[0]);
      }
      
      return 0.3; // Default conservative score
    } catch (error) {
      console.error('Error in LLM experience depth analysis:', error);
      return 0.3; // Default conservative score
    }
  } else {
    // Mock response when OpenAI is not available
    console.log('Using mock experience depth analysis');
    // Generate a random score between 0.4 and 0.8 for demonstration
    return 0.4 + (Math.random() * 0.4);
  }
}

/**
 * Analyze potential fit based on transferable skills and learning potential
 * @param jobRequirements The job requirements
 * @param candidate The candidate
 * @param knowledgeGraph The knowledge graph
 * @returns Score representing potential fit (0-1)
 */
export async function analyzePotentialFit(
  jobRequirements: JobRequirement[],
  candidate: Candidate,
  knowledgeGraph: KnowledgeGraph
): Promise<number> {
  // Extract relevant information for LLM analysis
  const jobSkills = jobRequirements.map(req => req.skill);
  const candidateSkills = candidate.skills.map(skill => skill.name);
  const candidateExperience = candidate.skills.map(skill => {
    return {
      skill: skill.name,
      years: skill.yearsOfExperience,
      projects: skill.projects || []
    };
  });
  
  if (useOpenAI && openai) {
    const prompt = `
      I need to evaluate a candidate's potential fit for a role based on transferable skills and learning potential.
      
      Job requirements:
      ${jobSkills.join(', ')}
      
      Candidate information:
      - Skills: ${candidateSkills.join(', ')}
      - Experience: ${JSON.stringify(candidateExperience)}
      - Education: ${candidate.education || 'Not specified'}
      - Learning ability indicators: ${candidate.learningAbility || 'Not specified'}
      
      Please analyze:
      1. Transferable skills: Which of the candidate's skills could transfer to the required job skills?
      2. Learning potential: Based on their background, how quickly could they learn the missing skills?
      3. Overall potential fit: Considering both transferable skills and learning potential
      
      Return a JSON object with scores for each category (0-1) and a brief explanation.
    `;
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are an expert in technical recruitment and career development." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      });
      
      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      // Extract the overall potential fit score
      return result.overallPotentialFit || 0.5;
    } catch (error) {
      console.error('Error in LLM potential fit analysis:', error);
      return 0.5; // Default moderate score
    }
  } else {
    // Mock response when OpenAI is not available
    console.log('Using mock potential fit analysis');
    
    // Calculate a simple score based on skill overlap
    const jobSkillsSet = new Set(jobSkills.map(s => s.toLowerCase()));
    const candidateSkillsSet = new Set(candidateSkills.map(s => s.toLowerCase()));
    
    // Count overlapping skills
    let overlapCount = 0;
    for (const skill of candidateSkillsSet) {
      if (jobSkillsSet.has(skill)) {
        overlapCount++;
      }
    }
    
    // Calculate a base score from overlap
    const baseScore = jobSkillsSet.size > 0 ? overlapCount / jobSkillsSet.size : 0;
    
    // Add some randomness for demonstration
    return Math.min(0.9, Math.max(0.3, baseScore + (Math.random() * 0.3)));
  }
}

/**
 * Expand a list of skills with their equivalents from the knowledge graph
 */
function expandSkillsWithEquivalents(
  skills: string[],
  knowledgeGraph: KnowledgeGraph
): string[] {
  const expanded = [...skills];
  
  for (const skill of skills) {
    const equivalents = findEquivalentSkills(skill, knowledgeGraph);
    for (const equivalent of equivalents) {
      if (!expanded.includes(equivalent)) {
        expanded.push(equivalent);
      }
    }
  }
  
  return expanded;
}

/**
 * Find equivalent skills for a given skill in the knowledge graph
 */
function findEquivalentSkills(
  skill: string,
  knowledgeGraph: KnowledgeGraph
): string[] {
  const equivalents: string[] = [];
  
  // Find relations where the skill is the source
  const sourceRelations = knowledgeGraph.relations.filter(
    relation => relation.source.toLowerCase() === skill.toLowerCase()
  );
  
  // Find relations where the skill is the target
  const targetRelations = knowledgeGraph.relations.filter(
    relation => relation.target.toLowerCase() === skill.toLowerCase()
  );
  
  // Add targets from source relations
  for (const relation of sourceRelations) {
    if (relation.strength >= 0.7 && !equivalents.includes(relation.target)) {
      equivalents.push(relation.target);
    }
  }
  
  // Add sources from target relations
  for (const relation of targetRelations) {
    if (relation.strength >= 0.7 && !equivalents.includes(relation.source)) {
      equivalents.push(relation.source);
    }
  }
  
  return equivalents;
}