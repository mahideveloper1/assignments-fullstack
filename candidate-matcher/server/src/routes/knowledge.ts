import express from 'express';
import { 
  getKnowledgeGraph, 
  addSkillRelation, 
  updateSkillRelation,
  deleteSkillRelation
} from '../services/knowledgeService';

const router = express.Router();

/**
 * @route GET /api/knowledge
 * @desc Get the entire knowledge graph
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    const knowledgeGraph = await getKnowledgeGraph();
    
    return res.status(200).json({
      success: true,
      data: knowledgeGraph
    });
  } catch (error) {
    console.error('Error fetching knowledge graph:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error while fetching knowledge graph'
    });
  }
});

/**
 * @route POST /api/knowledge/skill
 * @desc Add a new skill relation to the knowledge graph
 * @access Public
 */
router.post('/skill', async (req, res) => {
  try {
    const { skill, relatedSkills, relationStrength } = req.body;
    
    if (!skill || !relatedSkills) {
      return res.status(400).json({ 
        success: false, 
        error: 'Skill and related skills are required' 
      });
    }
    
    const result = await addSkillRelation(skill, relatedSkills, relationStrength);
    
    return res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error adding skill relation:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error while adding skill relation'
    });
  }
});

/**
 * @route PUT /api/knowledge/skill/:id
 * @desc Update a skill relation in the knowledge graph
 * @access Public
 */
router.put('/skill/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { skill, relatedSkills, relationStrength } = req.body;
    
    const result = await updateSkillRelation(id, skill, relatedSkills, relationStrength);
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error updating skill relation:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error while updating skill relation'
    });
  }
});

/**
 * @route DELETE /api/knowledge/skill/:id
 * @desc Delete a skill relation from the knowledge graph
 * @access Public
 */
router.delete('/skill/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await deleteSkillRelation(id);
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error deleting skill relation:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error while deleting skill relation'
    });
  }
});

export { router as knowledgeRouter };