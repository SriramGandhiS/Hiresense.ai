const Resume = require('../models/Resume');
const resumeService = require('../services/resumeService');
const fs = require('fs');

const uploadResume = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded or invalid format' });
        }

        const userId = req.user._id;
        const filePath = req.file.path;
        const mimeType = req.file.mimetype;
        const originalFileName = req.file.originalname;

        // Extract text
        const extractedText = await resumeService.extractTextFromFile(filePath, mimeType);

        // Analyze resume (AI Scoring) - Pass fileData for multimodal (image) support
        const analysisResults = await resumeService.analyzeResume(extractedText, {
            path: filePath,
            mimeType: mimeType
        });

        // Save to DB
        const resume = await Resume.create({
            userId,
            originalFileName,
            extractedText,
            score: analysisResults.score,
            analysis: analysisResults.detailedAnalysis
        });

        // Delete temp file
        fs.unlink(filePath, (err) => {
            if (err) console.error(`Failed to delete temp file ${filePath}:`, err);
        });

        res.status(201).json({
            success: true,
            message: 'Resume uploaded and analyzed successfully.',
            data: {
                ...resume._doc,
                summary: analysisResults.summary
            }
        });

    } catch (error) {
        // Ensure temp file is deleted on error
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error(`Failed to delete temp file ${req.file.path}:`, err);
            });
        }
        next(error);
    }
};

module.exports = {
    uploadResume
};
