import fs from 'fs';
import path from 'path';
import { KnowledgeGraph, SkillRelation } from '../types';

// Path to the knowledge graph JSON file
const KNOWLEDGE_GRAPH_PATH = path.join(__dirname, '../../data/knowledgeGraph.json');

/**
 * Initialize the knowledge graph file if it doesn't exist
 */
async function initializeKnowledgeGraph(): Promise<void> {
  const directory = path.dirname(KNOWLEDGE_GRAPH_PATH);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
  
  // Create knowledge graph file if it doesn't exist
  if (!fs.existsSync(KNOWLEDGE_GRAPH_PATH)) {
    const initialGraph: KnowledgeGraph = {
      skills: [],
      relations: []
    };
    
    fs.writeFileSync(KNOWLEDGE_GRAPH_PATH, JSON.stringify(initialGraph, null, 2));
  }
}

/**
 * Get the current knowledge graph
 * @returns The knowledge graph
 */
export async function getKnowledgeGraph(): Promise<KnowledgeGraph> {
  await initializeKnowledgeGraph();
  
  const data = fs.readFileSync(KNOWLEDGE_GRAPH_PATH, 'utf8');
  return JSON.parse(data) as KnowledgeGraph;
}

/**
 * Save the knowledge graph to file
 * @param graph The knowledge graph to save
 */
async function saveKnowledgeGraph(graph: KnowledgeGraph): Promise<void> {
  await initializeKnowledgeGraph();
  fs.writeFileSync(KNOWLEDGE_GRAPH_PATH, JSON.stringify(graph, null, 2));
}

/**
 * Add a new skill relation to the knowledge graph
 * @param skill The primary skill
 * @param relatedSkills The skills related to the primary skill
 * @param relationStrength The strength of the relation (0-1)
 * @returns The updated knowledge graph
 */
export async function addSkillRelation(
  skill: string,
  relatedSkills: string[],
  relationStrength: number = 0.8
): Promise<KnowledgeGraph> {
  const graph = await getKnowledgeGraph();
  
  // Add the primary skill if it doesn't exist
  if (!graph.skills.includes(skill)) {
    graph.skills.push(skill);
  }
  
  // Add related skills if they don't exist
  for (const relatedSkill of relatedSkills) {
    if (!graph.skills.includes(relatedSkill)) {
      graph.skills.push(relatedSkill);
    }
    
    // Add the relation
    const relation: SkillRelation = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      source: skill,
      target: relatedSkill,
      strength: relationStrength
    };
    
    graph.relations.push(relation);
  }
  
  await saveKnowledgeGraph(graph);
  return graph;
}

/**
 * Update a skill relation in the knowledge graph
 * @param id The ID of the relation to update
 * @param skill The primary skill
 * @param relatedSkills The skills related to the primary skill
 * @param relationStrength The strength of the relation (0-1)
 * @returns The updated knowledge graph
 */
export async function updateSkillRelation(
  id: string,
  skill: string,
  relatedSkills: string[],
  relationStrength: number = 0.8
): Promise<KnowledgeGraph> {
  const graph = await getKnowledgeGraph();
  
  // Remove the existing relation
  const relationIndex = graph.relations.findIndex(r => r.id === id);
  
  if (relationIndex === -1) {
    throw new Error(`Relation with ID ${id} not found`);
  }
  
  graph.relations.splice(relationIndex, 1);
  
  // Add the updated relation
  return addSkillRelation(skill, relatedSkills, relationStrength);
}

/**
 * Delete a skill relation from the knowledge graph
 * @param id The ID of the relation to delete
 * @returns The updated knowledge graph
 */
export async function deleteSkillRelation(id: string): Promise<KnowledgeGraph> {
  const graph = await getKnowledgeGraph();
  
  // Remove the relation
  const relationIndex = graph.relations.findIndex(r => r.id === id);
  
  if (relationIndex === -1) {
    throw new Error(`Relation with ID ${id} not found`);
  }
  
  graph.relations.splice(relationIndex, 1);
  
  await saveKnowledgeGraph(graph);
  return graph;
}