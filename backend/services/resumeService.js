const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const extractTextFromFile = async (filePath, mimeType) => {
    try {
        if (mimeType === 'application/pdf') {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdfParse(dataBuffer);
            return data.text;
        } else if (
            mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            mimeType === 'application/msword'
        ) {
            const result = await mammoth.extractRawText({ path: filePath });
            return result.value;
        } else if (mimeType.startsWith('image/')) {
            return "[IMAGE_DOCUMENT]";
        } else {
            throw new Error('Unsupported file type');
        }
    } catch (error) {
        throw new Error(`Text extraction failed: ${error.message}`);
    }
};

const analyzeResume = async (text, fileData = null) => {
    const fallbackAnalysis = (text) => {
        const lowerText = text.toLowerCase();

        // Advanced Type Detection
        let detectedType = "Document";
        let isCertificate = lowerText.includes('certificate') || lowerText.includes('certified') || lowerText.includes('awarded to') || lowerText.includes('completion');
        let isInvoice = lowerText.includes('invoice') || lowerText.includes('bill to') || lowerText.includes('total due');
        let isID = lowerText.includes('identity card') || lowerText.includes('license') || lowerText.includes('passport');

        if (isCertificate) detectedType = "Certificate";
        else if (isInvoice) detectedType = "Invoice";
        else if (isID) detectedType = "ID Card";
        else if (lowerText.includes('experience') || lowerText.includes('education') || lowerText.includes('skills')) detectedType = "Resume";

        const hasExperience = lowerText.includes('experience') || lowerText.includes('work history') || lowerText.includes('employment');
        const hasEducation = lowerText.includes('education') || lowerText.includes('university') || lowerText.includes('college') || lowerText.includes('school');
        const hasSkills = lowerText.includes('skill');
        const resumeMarkers = [hasExperience, hasEducation, hasSkills].filter(Boolean).length;

        const isValidResume = detectedType === "Resume" || (resumeMarkers >= 2 && text.length > 500);

        if (!isValidResume) {
            return {
                score: 0,
                summary: `This is a ${detectedType}. Please upload a Resume instead.`,
                isResume: false,
                detectedType: detectedType,
                detailedAnalysis: {
                    categories: { content: 0, sections: 0, ats: 0, tailoring: 0 },
                    issueCount: 1,
                    strengths: ["Document detected correctly"],
                    weaknesses: [{ area: "Doc Classification", priority: "High", fix: `Upload a Resume/CV instead of a ${detectedType}.` }],
                    checks: [{ name: "Resume Filter", passed: false, priority: "High", feedback: `Rejected: ${detectedType}`, companyExpectation: "Resume only." }],
                    industryAlignment: 0
                }
            };
        }

        let contentScore = 40, sectionScore = 50, atsScore = 50, tailoringScore = 30;
        const hasEmail = /[\w\.-]+@[\w\.-]+\.\w+/.test(text);
        const hasPhone = /[\d\-\+\(\)\s]{10,}/.test(text);
        const hasImpact = /[\d]+[%$]/.test(text);

        if (hasEmail && hasPhone) atsScore += 20;
        if (hasImpact) contentScore += 30;
        if (hasSkills) sectionScore += 20;

        const totalScore = Math.round((contentScore * 0.3) + (sectionScore * 0.2) + (atsScore * 0.3) + (tailoringScore * 0.2));

        return {
            score: totalScore,
            summary: "AI Heuristic Analysis successfully identified this as a Resume.",
            isResume: true,
            detectedType: "Resume",
            detailedAnalysis: {
                categories: { content: contentScore, sections: sectionScore, ats: atsScore, tailoring: tailoringScore },
                strengths: ["Proper document type detected", "Standard structure"],
                weaknesses: [{ area: "Impact Metrics", priority: "High", fix: "Add numbers (%, $)." }],
                checks: [
                    { name: "Resume Filter", passed: true, priority: "High", feedback: "Verified Resume", companyExpectation: "Resume/CV only." },
                    { name: "Quantifying Impact", passed: hasImpact, priority: "High", feedback: hasImpact ? "Found metrics" : "Add numbers", companyExpectation: "Show results" }
                ],
                industryAlignment: totalScore
            }
        };
    };

    try {
        if (!process.env.GEMINI_API_KEY) return fallbackAnalysis(text);

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const promptText = `
        TASK 1 (MANDATORY): Classify this document. Is it a Resume, Certificate, Invoice, ID, or Other?
        TASK 2: If it IS a Resume/CV, give it a strict 0-100 score based on Enhancv logic.
        TASK 3: If it is NOT a Resume/CV, return score 0 and summary 'INVALID_TYPE:[Detected Type]'.

        Return ONLY a JSON object:
        {
            "score": 0,
            "detectedType": "Certificate",
            "isResume": false,
            "summary": "INVALID_TYPE:Certificate",
            "detailedAnalysis": {
                "categories": { "content": 0, "sections": 0, "ats": 0, "tailoring": 0 },
                "issueCount": 1,
                "strengths": [],
                "weaknesses": [{"area": "Wrong File", "priority": "High", "fix": "Upload a Resume"}],
                "checks": [{"name": "Doc check", "passed": false, "priority": "High", "feedback": "Not a resume", "companyExpectation": "Resume/CV"}],
                "industryAlignment": 0
            }
        }

        Document:
        ${text}
        `;

        let result;
        if (fileData && fileData.mimeType.startsWith('image/')) {
            const imageBuffer = fs.readFileSync(fileData.path);
            result = await model.generateContent([promptText, { inlineData: { data: imageBuffer.toString('base64'), mimeType: fileData.mimeType } }]);
        } else {
            result = await model.generateContent(promptText);
        }

        const response = await result.response;
        const jsonText = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(jsonText);

        if (!parsed.isResume || parsed.summary.startsWith('INVALID_TYPE')) {
            const type = parsed.detectedType || (parsed.summary.split(':')[1]) || "Other";
            return {
                score: 0,
                isResume: false,
                detectedType: type,
                summary: `This looks like a ${type}. Our tool only generates intelligence reports for Resumes and CVs.`,
                detailedAnalysis: {
                    categories: { content: 0, sections: 10, ats: 10, tailoring: 0 },
                    issueCount: 1,
                    strengths: ["Document detected correctly"],
                    weaknesses: [{ area: "File Mismatch", priority: "High", fix: `Please upload your Resume instead of this ${type}.` }],
                    checks: [{ name: "Resume Filter", passed: false, priority: "High", feedback: `Rejected: ${type}`, companyExpectation: "Resume/CV" }],
                    industryAlignment: 0
                }
            };
        }

        return parsed;
    } catch (error) {
        console.error('AI Analysis Error:', error);
        return fallbackAnalysis(text);
    }
};

module.exports = {
    extractTextFromFile,
    analyzeResume
};
