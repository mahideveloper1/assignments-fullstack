import React, { useState } from 'react';
import { JobRequirement } from '../types';

interface JobRequirementsFormProps {
  jobRequirements: JobRequirement[];
  onUpdateRequirements: (requirements: JobRequirement[]) => void;
}

const JobRequirementsForm: React.FC<JobRequirementsFormProps> = ({ 
  jobRequirements, 
  onUpdateRequirements 
}) => {
  const [newSkill, setNewSkill] = useState<string>('');
  const [newYearsRequired, setNewYearsRequired] = useState<number>(1);
  const [newImportance, setNewImportance] = useState<number>(0.5);

  const handleAddRequirement = () => {
    if (!newSkill.trim()) {
      alert('Please enter a skill name');
      return;
    }

    const newRequirement: JobRequirement = {
      skill: newSkill.trim(),
      yearsRequired: newYearsRequired,
      importance: newImportance
    };

    onUpdateRequirements([...jobRequirements, newRequirement]);
    
    // Reset form
    setNewSkill('');
    setNewYearsRequired(1);
    setNewImportance(0.5);
  };

  const handleRemoveRequirement = (index: number) => {
    const updatedRequirements = [...jobRequirements];
    updatedRequirements.splice(index, 1);
    onUpdateRequirements(updatedRequirements);
  };

  const handleUpdateRequirement = (index: number, field: keyof JobRequirement, value: string | number) => {
    const updatedRequirements = [...jobRequirements];
    updatedRequirements[index] = {
      ...updatedRequirements[index],
      [field]: value
    };
    onUpdateRequirements(updatedRequirements);
  };

  return (
    <div className="job-requirements-form">
      <div className="requirements-list">
        {jobRequirements.map((requirement, index) => (
          <div key={index} className="requirement-item card">
            <div className="requirement-header">
              <strong>{requirement.skill}</strong>
              <button 
                onClick={() => handleRemoveRequirement(index)}
                className="remove-button"
              >
                Remove
              </button>
            </div>
            <div className="requirement-details">
              <div className="form-group">
                <label>Years Required:</label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={requirement.yearsRequired}
                  onChange={(e) => handleUpdateRequirement(index, 'yearsRequired', parseInt(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label>Importance (0-1):</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={requirement.importance}
                  onChange={(e) => handleUpdateRequirement(index, 'importance', parseFloat(e.target.value))}
                />
                <span>{requirement.importance.toFixed(1)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="add-requirement-form">
        <h3>Add New Requirement</h3>
        <div className="form-group">
          <label>Skill:</label>
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="e.g., React, Python, AWS"
          />
        </div>
        <div className="form-group">
          <label>Years Required:</label>
          <input
            type="number"
            min="0"
            max="20"
            value={newYearsRequired}
            onChange={(e) => setNewYearsRequired(parseInt(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label>Importance (0-1):</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={newImportance}
            onChange={(e) => setNewImportance(parseFloat(e.target.value))}
          />
          <span>{newImportance.toFixed(1)}</span>
        </div>
        <button onClick={handleAddRequirement}>Add Requirement</button>
      </div>
    </div>
  );
};

export default JobRequirementsForm;