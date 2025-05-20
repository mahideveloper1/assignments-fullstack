import express from 'express';
import { matchCandidates } from '../services/matchingService';

const router = express.Router();

/**
 * @route POST /api/matching
 * @desc Match candidates to job requirements
 * @access Public
 */
router.post('/', async (req, res) => {
  try {
    const { jobRequirements, candidates } = req.body;
    
    if (!jobRequirements || !candidates) {
      return res.status(400).json({ 
        success: false, 
        error: 'Job requirements and candidates are required' 
      });
    }
    
    const matches = await matchCandidates(jobRequirements, candidates);
    
    return res.status(200).json({
      success: true,
      data: matches
    });
  } catch (error) {
    console.error('Error in matching candidates:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error during matching process'
    });
  }
});

export { router as matchingRouter };