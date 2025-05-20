import axios from 'axios';
import { Candidate, JobRequirement, MatchResult, KnowledgeGraph, SkillRelation } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Matching API
export const matchCandidates = async (
  jobRequirements: JobRequirement[],
  candidates: Candidate[]
): Promise<MatchResult[]> => {
  try {
    const response = await api.post('/matching', { jobRequirements, candidates });
    return response.data.data;
  } catch (error) {
    console.error('Error matching candidates:', error);
    throw error;
  }
};

// Knowledge Graph API
export const getKnowledgeGraph = async (): Promise<KnowledgeGraph> => {
  try {
    const response = await api.get('/knowledge');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching knowledge graph:', error);
    throw error;
  }
};

export const addSkillRelation = async (
  skill: string,
  relatedSkills: string[],
  relationStrength: number = 0.8
): Promise<KnowledgeGraph> => {
  try {
    const response = await api.post('/knowledge/skill', {
      skill,
      relatedSkills,
      relationStrength,
    });
    return response.data.data;
  } catch (error) {
    console.error('Error adding skill relation:', error);
    throw error;
  }
};

export const updateSkillRelation = async (
  id: string,
  skill: string,
  relatedSkills: string[],
  relationStrength: number = 0.8
): Promise<KnowledgeGraph> => {
  try {
    const response = await api.put(`/knowledge/skill/${id}`, {
      skill,
      relatedSkills,
      relationStrength,
    });
    return response.data.data;
  } catch (error) {
    console.error('Error updating skill relation:', error);
    throw error;
  }
};

export const deleteSkillRelation = async (id: string): Promise<KnowledgeGraph> => {
  try {
    const response = await api.delete(`/knowledge/skill/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error deleting skill relation:', error);
    throw error;
  }
};