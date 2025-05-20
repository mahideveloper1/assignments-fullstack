import React, { useState } from 'react';
import './App.css';
import JobRequirementsForm from './components/JobRequirementsForm';
import CandidateList from './components/CandidateList';
import MatchResults from './components/MatchResults';
import KnowledgeGraphManager from './components/KnowledgeGraphManager';
import { matchCandidates } from './api';
import { JobRequirement, Candidate, MatchResult } from './types';
import { sampleJobRequirements, sampleCandidates } from './data/sampleData';

function App() {
  const [jobRequirements, setJobRequirements] = useState<JobRequirement[]>(sampleJobRequirements);
  const [candidates, setCandidates] = useState<Candidate[]>(sampleCandidates);
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('matching');

  const handleMatch = async () => {
    setIsLoading(true);
    try {
      const results = await matchCandidates(jobRequirements, candidates);
      setMatchResults(results);
    } catch (error) {
      console.error('Error matching candidates:', error);
      alert('Error matching candidates. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateJobRequirements = (updatedRequirements: JobRequirement[]) => {
    setJobRequirements(updatedRequirements);
  };

  const handleUpdateCandidates = (updatedCandidates: Candidate[]) => {
    setCandidates(updatedCandidates);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Advanced Candidate Matching System</h1>
        <div className="tabs">
          <button 
            className={activeTab === 'matching' ? 'active' : ''} 
            onClick={() => setActiveTab('matching')}
          >
            Matching
          </button>
          <button 
            className={activeTab === 'knowledge' ? 'active' : ''} 
            onClick={() => setActiveTab('knowledge')}
          >
            Knowledge Graph
          </button>
        </div>
      </header>

      <main>
        {activeTab === 'matching' ? (
          <div className="matching-container">
            <div className="requirements-candidates">
              <div className="job-requirements">
                <h2>Job Requirements</h2>
                <JobRequirementsForm 
                  jobRequirements={jobRequirements} 
                  onUpdateRequirements={handleUpdateJobRequirements} 
                />
              </div>
              
              <div className="candidates">
                <h2>Candidates</h2>
                <CandidateList 
                  candidates={candidates} 
                  onUpdateCandidates={handleUpdateCandidates} 
                />
              </div>
            </div>
            
            <div className="match-action">
              <button 
                className="match-button" 
                onClick={handleMatch} 
                disabled={isLoading}
              >
                {isLoading ? 'Matching...' : 'Match Candidates'}
              </button>
            </div>
            
            {matchResults.length > 0 && (
              <div className="match-results">
                <h2>Match Results</h2>
                <MatchResults results={matchResults} />
              </div>
            )}
          </div>
        ) : (
          <div className="knowledge-container">
            <h2>Knowledge Graph Manager</h2>
            <KnowledgeGraphManager />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;