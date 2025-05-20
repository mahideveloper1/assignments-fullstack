import React, { useState, useEffect } from 'react';
import { KnowledgeGraph, SkillRelation } from '../types';
import { getKnowledgeGraph, addSkillRelation, updateSkillRelation, deleteSkillRelation } from '../api';

const KnowledgeGraphManager: React.FC = () => {
  const [knowledgeGraph, setKnowledgeGraph] = useState<KnowledgeGraph>({ skills: [], relations: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [newSkill, setNewSkill] = useState<string>('');
  const [relatedSkills, setRelatedSkills] = useState<string>('');
  const [relationStrength, setRelationStrength] = useState<number>(0.8);
  const [editingRelationId, setEditingRelationId] = useState<string | null>(null);

  useEffect(() => {
    fetchKnowledgeGraph();
  }, []);

  const fetchKnowledgeGraph = async () => {
    setLoading(true);
    try {
      const data = await getKnowledgeGraph();
      setKnowledgeGraph(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch knowledge graph. Using empty graph for now.');
      console.error('Error fetching knowledge graph:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRelation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim() || !relatedSkills.trim()) return;

    setLoading(true);
    try {
      const relatedSkillsArray = relatedSkills.split(',').map(skill => skill.trim());
      const updatedGraph = await addSkillRelation(newSkill, relatedSkillsArray, relationStrength);
      setKnowledgeGraph(updatedGraph);
      
      // Reset form
      setNewSkill('');
      setRelatedSkills('');
      setRelationStrength(0.8);
    } catch (err) {
      setError('Failed to add skill relation');
      console.error('Error adding skill relation:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRelation = (relation: SkillRelation) => {
    setEditingRelationId(relation.id);
    setNewSkill(relation.source);
    setRelatedSkills(relation.target);
    setRelationStrength(relation.strength);
  };

  const handleUpdateRelation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRelationId || !newSkill.trim() || !relatedSkills.trim()) return;

    setLoading(true);
    try {
      const relatedSkillsArray = relatedSkills.split(',').map(skill => skill.trim());
      const updatedGraph = await updateSkillRelation(
        editingRelationId,
        newSkill,
        relatedSkillsArray,
        relationStrength
      );
      setKnowledgeGraph(updatedGraph);
      
      // Reset form
      setNewSkill('');
      setRelatedSkills('');
      setRelationStrength(0.8);
      setEditingRelationId(null);
    } catch (err) {
      setError('Failed to update skill relation');
      console.error('Error updating skill relation:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRelation = async (relationId: string) => {
    setLoading(true);
    try {
      const updatedGraph = await deleteSkillRelation(relationId);
      setKnowledgeGraph(updatedGraph);
    } catch (err) {
      setError('Failed to delete skill relation');
      console.error('Error deleting skill relation:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingRelationId(null);
    setNewSkill('');
    setRelatedSkills('');
    setRelationStrength(0.8);
  };

  return (
    <div className="knowledge-graph-manager">
      {error && <div className="error-message">{error}</div>}
      
      <div className="knowledge-form">
        <h3>{editingRelationId ? 'Edit Skill Relation' : 'Add New Skill Relation'}</h3>
        <form onSubmit={editingRelationId ? handleUpdateRelation : handleAddRelation}>
          <div className="form-group">
            <label htmlFor="skill">Skill:</label>
            <input
              type="text"
              id="skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="e.g., React"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="relatedSkills">Related Skills:</label>
            <input
              type="text"
              id="relatedSkills"
              value={relatedSkills}
              onChange={(e) => setRelatedSkills(e.target.value)}
              placeholder="e.g., JavaScript, Web Development (comma separated)"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="relationStrength">Relation Strength (0-1):</label>
            <input
              type="range"
              id="relationStrength"
              min="0"
              max="1"
              step="0.1"
              value={relationStrength}
              onChange={(e) => setRelationStrength(parseFloat(e.target.value))}
            />
            <span>{relationStrength}</span>
          </div>
          
          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Processing...' : editingRelationId ? 'Update Relation' : 'Add Relation'}
            </button>
            {editingRelationId && (
              <button type="button" onClick={handleCancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      
      <div className="knowledge-graph-display">
        <h3>Knowledge Graph</h3>
        {loading && <p>Loading knowledge graph...</p>}
        
        {!loading && knowledgeGraph.relations.length === 0 && (
          <p>No skill relations defined yet. Add some above!</p>
        )}
        
        {!loading && knowledgeGraph.relations.length > 0 && (
          <div className="relations-list">
            {knowledgeGraph.relations.map(relation => (
              <div key={relation.id} className="relation-item">
                <div className="relation-content">
                  <span className="source-skill">{relation.source}</span>
                  <span className="relation-arrow">→</span>
                  <span className="target-skill">{relation.target}</span>
                  <span className="relation-strength">
                    Strength: {relation.strength.toFixed(1)}
                  </span>
                </div>
                <div className="relation-actions">
                  <button onClick={() => handleEditRelation(relation)}>Edit</button>
                  <button onClick={() => handleDeleteRelation(relation.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeGraphManager;