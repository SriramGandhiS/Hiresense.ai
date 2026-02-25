const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();

const test = async () => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.log('GEMINI_API_KEY missing');
            return;
        }
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "Say hello";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        console.log('AI Response:', response.text());
    } catch (error) {
        console.error('AI Test failed:', error);
    }
};

test();
