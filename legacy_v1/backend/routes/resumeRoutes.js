const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

router.post('/analyze', protect, async (req, res) => {
    try {
        const { fullName, targetRole, skills, experience, education, projects } = req.body;

        // Define core keywords expected for common roles
        const keywordMap = {
            'Software Engineer': ['java', 'python', 'c++', 'algorithms', 'data structures', 'system design', 'sql'],
            'Web Developer': ['html', 'css', 'javascript', 'react', 'node', 'express', 'mongodb', 'frontend', 'backend'],
            'Data Scientist': ['python', 'pandas', 'machine learning', 'sql', 'statistics', 'numpy', 'tensorflow'],
            'Product Manager': ['agile', 'scrum', 'roadmap', 'jira', 'strategy', 'metrics', 'kpi']
        };

        const expectedKeywords = keywordMap[targetRole] || keywordMap['Software Engineer'];

        // Convert input skills/exp to lowercase for matching, with safety fallbacks
        const textToAnalyze = `${skills || ''} ${experience || ''} ${projects || ''}`.toLowerCase();

        // Extract skills
        const foundKeywords = expectedKeywords.filter(kw => textToAnalyze.includes(kw));
        const missingKeywords = expectedKeywords.filter(kw => !textToAnalyze.includes(kw));

        // Let's also check for explicit requests like Java, Python, React, Node, SQL, HTML/CSS
        const coreRequiredTokens = ['java', 'python', 'react', 'node', 'sql', 'html', 'css'];
        const extractedTokens = coreRequiredTokens.filter(t => textToAnalyze.includes(t));

        // Calculate basic score
        let score = 50; // Base score
        score += (foundKeywords.length / expectedKeywords.length) * 30; // Max 30 from matching keywords
        if (experience && experience.length > 50) score += 10;
        if (projects && projects.length > 50) score += 10;

        score = Math.min(Math.round(score), 100);

        res.json({
            score,
            extractedSkills: extractedTokens.length > 0 ? extractedTokens : foundKeywords,
            missingKeywords,
            targetRole
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
