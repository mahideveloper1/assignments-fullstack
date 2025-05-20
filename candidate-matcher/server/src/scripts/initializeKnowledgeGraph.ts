import { addSkillRelation } from '../services/knowledgeService';
import { initialSkillRelations } from '../data/sampleData';

/**
 * Initialize the knowledge graph with sample data
 */
async function initializeKnowledgeGraph() {
  console.log('Initializing knowledge graph with sample data...');
  
  try {
    for (const relation of initialSkillRelations) {
      await addSkillRelation(relation.source, relation.targets, relation.strength);
      console.log(`Added relation: ${relation.source} -> ${relation.targets.join(', ')}`);
    }
    
    console.log('Knowledge graph initialized successfully!');
  } catch (error) {
    console.error('Error initializing knowledge graph:', error);
  }
}

// Run the initialization
initializeKnowledgeGraph();