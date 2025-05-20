import React, { useState } from 'react';
import { Candidate, CandidateSkill } from '../types';

interface CandidateListProps {
  candidates: Candidate[];
  onUpdateCandidates: (candidates: Candidate[]) => void;
}

const CandidateList: React.FC<CandidateListProps> = ({ candidates, onUpdateCandidates }) => {
  const [editingCandidateId, setEditingCandidateId] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState<CandidateSkill>({
    name: '',
    yearsOfExperience: 0,
    projects: []
  });
  const [newProject, setNewProject] = useState<string>('');

  const handleEditCandidate = (candidateId: string) => {
    setEditingCandidateId(candidateId);
  };

  const handleSaveCandidate = () => {
    setEditingCandidateId(null);
  };

  const handleUpdateSkill = (candidateId: string, skillIndex: number, updatedSkill: CandidateSkill) => {
    const updatedCandidates = candidates.map(candidate => {
      if (candidate.id === candidateId) {
        const updatedSkills = [...candidate.skills];
        updatedSkills[skillIndex] = updatedSkill;
        return { ...candidate, skills: updatedSkills };
      }
      return candidate;
    });
    onUpdateCandidates(updatedCandidates);
  };

  const handleAddSkill = (candidateId: string) => {
    if (newSkill.name.trim() === '') return;

    const updatedCandidates = candidates.map(candidate => {
      if (candidate.id === candidateId) {
        return {
          ...candidate,
          skills: [...candidate.skills, { ...newSkill, projects: newSkill.projects || [] }]
        };
      }
      return candidate;
    });
    onUpdateCandidates(updatedCandidates);
    setNewSkill({ name: '', yearsOfExperience: 0, projects: [] });
  };

  const handleRemoveSkill = (candidateId: string, skillIndex: number) => {
    const updatedCandidates = candidates.map(candidate => {
      if (candidate.id === candidateId) {
        const updatedSkills = candidate.skills.filter((_, index) => index !== skillIndex);
        return { ...candidate, skills: updatedSkills };
      }
      return candidate;
    });
    onUpdateCandidates(updatedCandidates);
  };

  const handleAddProject = (candidateId: string, skillIndex: number) => {
    if (newProject.trim() === '') return;

    const updatedCandidates = candidates.map(candidate => {
      if (candidate.id === candidateId) {
        const updatedSkills = candidate.skills.map((skill, index) => {
          if (index === skillIndex) {
            return {
              ...skill,
              projects: [...(skill.projects || []), newProject]
            };
          }
          return skill;
        });
        return { ...candidate, skills: updatedSkills };
      }
      return candidate;
    });
    onUpdateCandidates(updatedCandidates);
    setNewProject('');
  };

  return (
    <div className="candidate-list">
      {candidates.map(candidate => (
        <div key={candidate.id} className="candidate-card">
          <div className="candidate-header">
            <h3>{candidate.name}</h3>
            {editingCandidateId === candidate.id ? (
              <button onClick={handleSaveCandidate}>Save</button>
            ) : (
              <button onClick={() => handleEditCandidate(candidate.id)}>Edit</button>
            )}
          </div>
          
          <div className="candidate-details">
            <p><strong>Education:</strong> {candidate.education}</p>
            <p><strong>Learning Ability:</strong> {candidate.learningAbility}</p>
          </div>
          
          <div className="candidate-skills">
            <h4>Skills</h4>
            {candidate.skills.map((skill, skillIndex) => (
              <div key={skillIndex} className="skill-item">
                {editingCandidateId === candidate.id ? (
                  <div className="edit-skill">
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => handleUpdateSkill(
                        candidate.id,
                        skillIndex,
                        { ...skill, name: e.target.value }
                      )}
                    />
                    <input
                      type="number"
                      value={skill.yearsOfExperience}
                      onChange={(e) => handleUpdateSkill(
                        candidate.id,
                        skillIndex,
                        { ...skill, yearsOfExperience: parseInt(e.target.value) || 0 }
                      )}
                    />
                    <button onClick={() => handleRemoveSkill(candidate.id, skillIndex)}>
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="skill-display">
                    <span className="skill-name">{skill.name}</span>
                    <span className="skill-years">{skill.yearsOfExperience} years</span>
                  </div>
                )}
                
                {skill.projects && skill.projects.length > 0 && (
                  <div className="skill-projects">
                    <strong>Projects:</strong>
                    <ul>
                      {skill.projects.map((project, projectIndex) => (
                        <li key={projectIndex}>{project}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {editingCandidateId === candidate.id && (
                  <div className="add-project">
                    <input
                      type="text"
                      placeholder="Add project"
                      value={newProject}
                      onChange={(e) => setNewProject(e.target.value)}
                    />
                    <button onClick={() => handleAddProject(candidate.id, skillIndex)}>
                      Add Project
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            {editingCandidateId === candidate.id && (
              <div className="add-skill">
                <h4>Add New Skill</h4>
                <input
                  type="text"
                  placeholder="Skill name"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Years of experience"
                  value={newSkill.yearsOfExperience}
                  onChange={(e) => setNewSkill({ 
                    ...newSkill, 
                    yearsOfExperience: parseInt(e.target.value) || 0 
                  })}
                />
                <button onClick={() => handleAddSkill(candidate.id)}>Add Skill</button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CandidateList;