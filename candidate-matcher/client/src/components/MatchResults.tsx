import React from 'react';
import { MatchResult } from '../types';

interface MatchResultsProps {
  results: MatchResult[];
}

const MatchResults: React.FC<MatchResultsProps> = ({ results }) => {
  // Sort results by total score in descending order
  const sortedResults = [...results].sort((a, b) => b.totalScore - a.totalScore);

  return (
    <div className="match-results-container">
      {sortedResults.map((result, index) => (
        <div key={result.candidateId} className="match-result-card">
          <div className="match-result-header">
            <h3>#{index + 1} {result.candidateName}</h3>
            <div className="match-score">
              <span className="score-label">Match Score:</span>
              <span className="score-value">{(result.totalScore * 100).toFixed(1)}%</span>
            </div>
          </div>
          
          <div className="score-breakdown">
            <div className="score-item">
              <span className="score-label">Skill Equivalence:</span>
              <span className="score-value">{(result.skillEquivalenceScore * 100).toFixed(1)}%</span>
            </div>
            <div className="score-item">
              <span className="score-label">Experience Depth:</span>
              <span className="score-value">{(result.experienceDepthScore * 100).toFixed(1)}%</span>
            </div>
            <div className="score-item">
              <span className="score-label">Potential Fit:</span>
              <span className="score-value">{(result.potentialFitScore * 100).toFixed(1)}%</span>
            </div>
          </div>
          
          <div className="match-explanations">
            <h4>Match Explanations</h4>
            <ul>
              {result.explanations.map((explanation, i) => (
                <li key={i}>{explanation}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchResults;