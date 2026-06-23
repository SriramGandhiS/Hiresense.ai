/**
 * ollamaRoutes.js
 * Express router for all Ollama-backed mock interview endpoints.
 * No authentication middleware — all routes are publicly accessible.
 */

const express = require('express');
const router = express.Router();
const {
    generateInterviewQuestions,
    evaluateAnswer,
    generateFinalReport,
    checkOllamaHealth,
} = require('../services/ollamaService');

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/ollama/health
// Returns Ollama availability status and list of installed models.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/health', async (req, res) => {
    try {
        const health = await checkOllamaHealth();
        return res.status(200).json({
            success: true,
            ...health,
            message: health.available
                ? `Ollama is running. ${health.models.length} model(s) available.`
                : 'Ollama is not reachable. Make sure it is running on http://localhost:11434',
        });
    } catch (error) {
        console.error('[OllamaRoutes] /health error:', error.message);
        return res.status(500).json({
            success: false,
            available: false,
            models: [],
            message: 'Failed to check Ollama health',
            error: error.message,
        });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/ollama/generate-questions
// Body: { company, role, interviewType, round }
// Returns: { questions: [{id, question, hint, expectedDuration}] }
// ─────────────────────────────────────────────────────────────────────────────
router.post('/generate-questions', async (req, res) => {
    try {
        const { company, role, interviewType, round } = req.body;

        if (!company || !role) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: company and role are required',
            });
        }

        console.log(`[OllamaRoutes] Generating questions — Company: ${company}, Role: ${role}, Round: ${round}`);

        const result = await generateInterviewQuestions(
            company,
            role,
            interviewType || 'Technical',
            round || 1
        );

        return res.status(200).json({
            success: true,
            company,
            role,
            round: round || 1,
            ...result,
        });
    } catch (error) {
        console.error('[OllamaRoutes] /generate-questions error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to generate interview questions',
            error: error.message,
        });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/ollama/evaluate
// Body: { question, answer, company, role, round }
// Returns: { score, strengths, improvements, sampleAnswer, verdict }
// ─────────────────────────────────────────────────────────────────────────────
router.post('/evaluate', async (req, res) => {
    try {
        const { question, answer, company, role, round } = req.body;

        if (!question || !company || !role) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: question, company, and role are required',
            });
        }

        console.log(`[OllamaRoutes] Evaluating answer — Company: ${company}, Role: ${role}, Round: ${round}`);

        const result = await evaluateAnswer(
            question,
            answer || '',
            company,
            role,
            round || 1
        );

        return res.status(200).json({
            success: true,
            question,
            ...result,
        });
    } catch (error) {
        console.error('[OllamaRoutes] /evaluate error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to evaluate answer',
            error: error.message,
        });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/ollama/final-report
// Body: { sessionData: [{round, question, answer, evaluation}], company, role }
// Returns: comprehensive hiring report
// ─────────────────────────────────────────────────────────────────────────────
router.post('/final-report', async (req, res) => {
    try {
        const { sessionData, company, role } = req.body;

        if (!company || !role) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: company and role are required',
            });
        }

        if (!sessionData || !Array.isArray(sessionData) || sessionData.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'sessionData must be a non-empty array of interview rounds',
            });
        }

        console.log(`[OllamaRoutes] Generating final report — Company: ${company}, Role: ${role}, Rounds: ${sessionData.length}`);

        const result = await generateFinalReport({ company, role, sessionData });

        return res.status(200).json({
            success: true,
            company,
            role,
            totalRounds: sessionData.length,
            ...result,
        });
    } catch (error) {
        console.error('[OllamaRoutes] /final-report error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to generate final report',
            error: error.message,
        });
    }
});

module.exports = router;
