const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Interview = require('../models/Interview');

const questionsBank = {
    'Java': [
        { id: 'j1', type: 'technical', text: 'What are Java operators?' },
        { id: 'j2', type: 'technical', text: 'Explain the difference between final, finally, and finalize.' },
        { id: 'j3', type: 'technical', text: 'What is the Java Memory Model?' },
        { id: 'j4', type: 'technical', text: 'How does garbage collection work in Java?' },
        { id: 'j5', type: 'technical', text: 'What are the main principles of OOP?' }
    ],
    'Web Development': [
        { id: 'w1', type: 'technical', text: 'Explain the Virtual DOM in React.' },
        { id: 'w2', type: 'technical', text: 'What is the purpose of CORS?' },
        { id: 'w3', type: 'technical', text: 'Describe how JWT authentication works.' },
        { id: 'w4', type: 'technical', text: 'What are React Hooks? Can you name two?' },
        { id: 'w5', type: 'technical', text: 'Explain closures in JavaScript.' }
    ],
    'HR Only': [],
    'HR': [
        { id: 'h1', type: 'hr', text: 'Tell me about yourself and your background.' },
        { id: 'h2', type: 'hr', text: 'Where do you see yourself in 5 years?' },
        { id: 'h3', type: 'hr', text: 'Describe a time you faced a difficult challenge at work.' }
    ]
};

router.post('/start', protect, async (req, res) => {
    try {
        const { mode, domain } = req.body;
        // In AUTO mode, we might auto-select domain based on DB state or pass it from UI
        const selectedDomain = (domain === 'HR Only') ? 'HR' : domain;

        let questions = [];
        if (domain === 'HR Only') {
            questions = [...questionsBank['HR']];
            questions.push({ id: 'h4', type: 'hr', text: 'Why do you want to work for us?' });
            questions.push({ id: 'h5', type: 'hr', text: 'What are your salary expectations?' });
            questions.push({ id: 'h6', type: 'hr', text: 'What are your greatest strengths and weaknesses?' });
        } else {
            questions = [...(questionsBank[selectedDomain] || questionsBank['Java']), ...questionsBank['HR']];
        }

        // Create new interview entry
        const interview = await Interview.create({
            userId: req.user._id,
            domain: selectedDomain,
            questions: questions.map(q => ({ text: q.text, type: q.type }))
        });

        res.json({ interviewId: interview._id, questions });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/answer', protect, async (req, res) => {
    try {
        const { questionId, answerText, questionText } = req.body;

        let followUp = null;

        // Rule-based dynamic follow-up logic
        // "If system asks: 'What are Java operators?' and user says 'Plus and minus', system detects arithmetic keyword and asks follow-up"
        if (questionText.includes('Java operators') && answerText.toLowerCase().includes('minus')) {
            followUp = {
                id: 'dyn1',
                type: 'technical',
                text: 'You mentioned arithmetic operators like plus and minus. Can you name other types of operators in Java?'
            };
        } else if (answerText.trim().split(' ').length < 5) {
            followUp = {
                id: `dyn_${Date.now()}`,
                type: 'hr',
                text: 'Could you please elaborate a bit more on that?'
            };
        }

        res.json({ success: true, followUp });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/finish', protect, async (req, res) => {
    try {
        const { questions, malpracticeCount } = req.body;

        // Find most recent interview for the user
        const interview = await Interview.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
        if (!interview) return res.status(404).json({ message: 'Interview not found' });

        // Calculate scores
        let techScore = 0;
        let commScore = 0;

        questions.forEach(q => {
            const words = (q.answer || '').split(' ').length;
            if (q.type === 'technical') {
                if (words > 15) techScore += 20; // basic keyword match mock
                else if (words > 5) techScore += 10;
            } else {
                if (words > 20) commScore += 33.3;
                else if (words > 10) commScore += 15;
            }
        });

        // Arbitrary baseline scores if questions were fewer
        techScore = Math.min(Math.round(techScore), 100);
        commScore = Math.min(Math.round(commScore), 100);

        const integrityScore = Math.max(100 - (malpracticeCount * 15), 0);

        const resumeScore = 85; // Could be fetched from User Resume model, mocking for now

        // Overall Score Formula: (Resume * 0.3) + (Technical * 0.4) + (Communication * 0.2) + (Integrity * 0.1)
        const overallReadiness = Math.round((resumeScore * 0.3) + (techScore * 0.4) + (commScore * 0.2) + (integrityScore * 0.1));

        interview.questions = questions.map(q => ({ text: q.text, answer: q.answer, type: q.type }));
        interview.scores = { resumeScore, technicalScore: techScore, communicationScore: commScore, integrityScore, overallReadiness };
        interview.malpracticeCount = malpracticeCount;

        await interview.save();

        res.json({ success: true, scores: interview.scores });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/my-scores', protect, async (req, res) => {
    try {
        const interview = await Interview.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
        if (!interview) return res.json({});

        let weakAreas = [];
        if (interview.scores.technicalScore < 70) weakAreas.push('Technical Depth');
        if (interview.scores.communicationScore < 70) weakAreas.push('Speech Elaboration');
        if (interview.scores.integrityScore < 90) weakAreas.push('Focus & Integrity');

        let roadmap = [];
        if (weakAreas.includes('Technical Depth')) roadmap.push('Day 1-10: Practice DSA and core concepts daily.');
        if (weakAreas.includes('Speech Elaboration')) roadmap.push('Day 11-20: Do mirror exercises to construct longer responses.');
        if (roadmap.length === 0) roadmap = ['Keep practicing mock interviews to stay sharp.', 'Review recent advanced topics in your domain.'];

        res.json({
            ...interview.scores,
            weakAreas,
            roadmap
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
