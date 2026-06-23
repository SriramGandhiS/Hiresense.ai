import axios from 'axios';

const interviewApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'),
    timeout: 60000, // 60s for AI generation
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * GET /companies
 * Returns list of companies with metadata
 */
export const getCompanies = async () => {
    const response = await interviewApi.get('/companies');
    return response.data;
};

/**
 * GET /ollama/health
 * Check if Ollama AI engine is online
 */
export const checkOllamaHealth = async () => {
    const response = await interviewApi.get('/ollama/health');
    return response.data;
};

/**
 * POST /ollama/generate-questions
 * Generate interview questions for a given company/role/round
 * @param {object} params
 * @param {string} params.company
 * @param {string} params.role
 * @param {string} params.interviewType - 'Technical' | 'Behavioral' | 'Mixed'
 * @param {string} params.round - e.g. 'Introduction', 'Technical', 'HR'
 */
export const generateQuestions = async ({ company, role, interviewType, round }) => {
    const response = await interviewApi.post('/ollama/generate-questions', {
        company,
        role,
        interviewType,
        round,
    });
    return response.data;
};

/**
 * POST /ollama/evaluate
 * Evaluate a candidate's answer
 * @param {object} params
 * @param {string} params.question
 * @param {string} params.answer
 * @param {string} params.company
 * @param {string} params.role
 * @param {string} params.round
 */
export const evaluateAnswer = async ({ question, answer, company, role, round }) => {
    const response = await interviewApi.post('/ollama/evaluate', {
        question,
        answer,
        company,
        role,
        round,
    });
    return response.data;
};

/**
 * POST /ollama/final-report
 * Generate a comprehensive final interview report
 * @param {object} params
 * @param {object} params.sessionData - Full session data with all Q&A pairs and evaluations
 * @param {string} params.company
 * @param {string} params.role
 */
export const generateFinalReport = async ({ sessionData, company, role }) => {
    const response = await interviewApi.post('/ollama/final-report', {
        sessionData,
        company,
        role,
    });
    return response.data;
};

export default interviewApi;
