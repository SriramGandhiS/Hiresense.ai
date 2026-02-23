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

        // Save to DB (Only if connected)
        const mongoose = require('mongoose');
        let resume;
        const isDbConnected = mongoose.connection.readyState === 1;

        if (isDbConnected) {
            resume = await Resume.create({
                userId,
                originalFileName,
                extractedText,
                score: analysisResults.score,
                analysis: analysisResults.detailedAnalysis
            });
        } else {
            console.warn('Resume Upload: Database OFFLINE. Returning transient analysis results.');
            resume = {
                userId,
                originalFileName,
                extractedText,
                score: analysisResults.score,
                analysis: analysisResults.detailedAnalysis,
                _doc: {
                    userId,
                    originalFileName,
                    score: analysisResults.score,
                    analysis: analysisResults.detailedAnalysis,
                    createdAt: new Date().toISOString()
                }
            };
        }

        // Delete temp file
        fs.unlink(filePath, (err) => {
            if (err) console.error(`Failed to delete temp file ${filePath}:`, err);
        });

        res.status(201).json({
            success: true,
            message: isDbConnected ? 'Resume uploaded and analyzed successfully.' : 'Resume analyzed efficiently (Guest Mode).',
            data: {
                ...(resume._doc || resume),
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
