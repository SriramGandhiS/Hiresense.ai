/**
 * ollamaService.js
 * Communicates with the local Ollama instance (http://localhost:11434).
 * Uses Node 18+ built-in fetch — no external HTTP dependency required.
 */

const OLLAMA_BASE_URL = 'http://localhost:11434';
const OLLAMA_GENERATE_URL = `${OLLAMA_BASE_URL}/api/generate`;
const DEFAULT_MODEL = 'llama3';

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolves the best available model: prefers llama3, falls back to first found.
 */
async function resolveModel() {
    try {
        const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`, { signal: AbortSignal.timeout(5000) });
        if (!res.ok) return DEFAULT_MODEL;
        const data = await res.json();
        const models = (data.models || []).map((m) => m.name);
        if (!models.length) return DEFAULT_MODEL;
        const preferred = models.find((m) => m.startsWith('llama3'));
        return preferred || models[0];
    } catch {
        return DEFAULT_MODEL;
    }
}

/**
 * Extracts the first valid JSON object or array from a string that may
 * contain surrounding prose or markdown code fences.
 */
function extractJSON(text) {
    // Strip markdown code fences if present
    const fenceStripped = text.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();

    // Try direct parse first
    try {
        return JSON.parse(fenceStripped);
    } catch (_) { /* fall through */ }

    // Find first { or [ and match to closing } or ]
    const objStart = fenceStripped.indexOf('{');
    const arrStart = fenceStripped.indexOf('[');
    let start = -1;
    if (objStart === -1) start = arrStart;
    else if (arrStart === -1) start = objStart;
    else start = Math.min(objStart, arrStart);

    if (start === -1) throw new Error('No JSON found in Ollama response');

    const openChar = fenceStripped[start];
    const closeChar = openChar === '{' ? '}' : ']';
    let depth = 0;
    let end = -1;
    for (let i = start; i < fenceStripped.length; i++) {
        if (fenceStripped[i] === openChar) depth++;
        else if (fenceStripped[i] === closeChar) {
            depth--;
            if (depth === 0) { end = i; break; }
        }
    }

    if (end === -1) throw new Error('Malformed JSON in Ollama response');
    return JSON.parse(fenceStripped.slice(start, end + 1));
}

/**
 * Calls Ollama /api/generate and returns parsed JSON from the response field.
 */
async function callOllama(systemPrompt, userPrompt, model) {
    const resolvedModel = model || (await resolveModel());

    const payload = {
        model: resolvedModel,
        system: systemPrompt,
        prompt: userPrompt,
        stream: false,
        options: {
            temperature: 0.7,
            top_p: 0.9,
            num_predict: 2048,
        },
    };

    const res = await fetch(OLLAMA_GENERATE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(120_000),
    });

    if (!res.ok) {
        const body = await res.text();
        throw new Error(`Ollama responded with ${res.status}: ${body}`);
    }

    const data = await res.json();
    const rawText = (data.response || '').trim();
    if (!rawText) throw new Error('Ollama returned an empty response');

    return extractJSON(rawText);
}

// ─────────────────────────────────────────────────────────────────────────────
// Company-specific context map
// ─────────────────────────────────────────────────────────────────────────────

const COMPANY_CONTEXTS = {
    TCS: {
        group: 'service_basic',
        culture: `TCS (Tata Consultancy Services) is India's largest IT services company.
They hire freshers in bulk and focus on: aptitude, verbal communication, basic coding (loops, arrays,
string manipulation in any language), logical reasoning, and team-fit cultural questions.
TCS interviewers are friendly and follow a structured campus-interview format.`,
    },
    Wipro: {
        group: 'service_basic',
        culture: `Wipro is a leading IT services company that hires freshers from tier-2/tier-3 colleges.
They emphasize communication skills, basic programming (C/Java/Python), SQL fundamentals,
process adherence, and cultural alignment with their "Spirit of Wipro" values.`,
    },
    Infosys: {
        group: 'service_basic',
        culture: `Infosys hires large batches of freshers and trains them at Mysore.
Their interviews cover: aptitude (InfyTQ platform), verbal ability, basic coding, OOPS concepts,
DBMS fundamentals, and situational HR questions. They value learning agility and communication.`,
    },
    HCL: {
        group: 'service_basic',
        culture: `HCLTech focuses on freshers who show willingness to learn.
Interview rounds cover: verbal and quantitative aptitude, basic programming concepts,
networking basics, OOPS, and HR-fit questions. They hire for GEMs (Global Entry-level Manpower) programs.`,
    },
    Cognizant: {
        group: 'service_process',
        culture: `Cognizant (CTS) is a Fortune 500 IT services firm.
Interviews focus on: communication skills, basic coding (arrays, strings), database knowledge,
process orientation, and behavioral questions around teamwork and adaptability.`,
    },
    Accenture: {
        group: 'service_process',
        culture: `Accenture is a global consulting and services company.
Their freshers interviews test: communication and presentation, basic coding, aptitude,
situational judgment, and alignment with their core values (integrity, stewardship, client value).`,
    },
    Capgemini: {
        group: 'service_process',
        culture: `Capgemini hires freshers for technology and consulting roles.
Focus areas: aptitude, pseudo-code/basic programming, communication, and HR behavioral questions
around teamwork, leadership, and learning attitude.`,
    },
    IBM: {
        group: 'service_process',
        culture: `IBM hires for a mix of technology and consulting roles.
They test: analytical reasoning, basic coding, cloud fundamentals, communication,
and behavioral questions. IBM values continuous learning (Think, Believe, Achieve culture).`,
    },
    Deloitte: {
        group: 'service_process',
        culture: `Deloitte USI (technology division) hires freshers for IT roles.
Interviews cover: aptitude, coding basics, SQL, case-study style problems, communication,
and behavior-based questions around leadership and ethics.`,
    },
    Amazon: {
        group: 'product_hard',
        culture: `Amazon is one of the world's most rigorous interview environments.
Every interview is centered around Amazon's 14 Leadership Principles (Customer Obsession, Ownership,
Invent & Simplify, Are Right A Lot, Learn & Be Curious, Hire & Develop the Best, Insist on Highest Standards,
Think Big, Bias for Action, Frugality, Earn Trust, Dive Deep, Have Backbone, Deliver Results).
Technical rounds test DSA (arrays, trees, graphs, DP, system design), and every behavioral answer
must follow the STAR method (Situation, Task, Action, Result) tied to a Leadership Principle.`,
    },
    Microsoft: {
        group: 'product_hard',
        culture: `Microsoft interviews focus on problem-solving, clean code, and growth mindset.
Technical rounds test: DSA (coding on whiteboard/screen), OOP design, system design (for senior),
and behavioral questions around collaboration and "model, coach, care" leadership.
They look for candidates who think aloud, ask clarifying questions, and iterate.`,
    },
    Google: {
        group: 'product_hard',
        culture: `Google has one of the most algorithm-intensive interview processes.
They test: data structures & algorithms (Big-O analysis critical), system design (scalability,
trade-offs), coding quality, and Googleyness (intellectual humility, comfort with ambiguity,
collaboration, fun). Google interviewers expect candidates to think out loud and consider edge cases.`,
    },
    Flipkart: {
        group: 'startup_mid',
        culture: `Flipkart (India's e-commerce giant, Walmart subsidiary) interviews for practical coding ability.
They focus on: DSA (medium-hard LeetCode style), system design (catalog, search, cart systems),
coding efficiency, and a startup mindset around speed, ownership, and customer impact.`,
    },
    Swiggy: {
        group: 'startup_mid',
        culture: `Swiggy is India's leading food delivery platform.
Their interviews test: practical backend/frontend coding, system design (real-time delivery tracking,
geolocation), scale problems, product thinking, and execution mindset.
They value engineers who understand product-engineering intersection.`,
    },
    Zomato: {
        group: 'startup_mid',
        culture: `Zomato, the food-tech giant, looks for strong problem solvers with startup energy.
Interviews cover: coding (DSA, practical implementation), system design (restaurant discovery,
order management), data handling, and culture-fit questions around hustle and ownership.`,
    },
    CRED: {
        group: 'startup_mid',
        culture: `CRED is a premium fintech startup known for strong engineering culture.
They have high hiring bars: algorithms (complex DSA), system design (financial systems, credit scoring),
code quality, and culture-fit (they value craft, attention to detail, and long-term thinking).`,
    },
    PhonePe: {
        group: 'startup_mid',
        culture: `PhonePe is one of India's largest fintech companies.
Interviews focus on: distributed systems, backend coding, payment system design, DSA,
and startup culture fit — ownership, speed, and impact orientation.`,
    },
};

const ROUND_CONTEXTS = {
    1: 'Introduction / Ice-breaker round. Focus on background, education, projects, and motivation.',
    2: 'Core Technical round. Focus on coding, computer science fundamentals, DSA, and domain knowledge.',
    3: 'Behavioral / Competency round. Focus on past experiences, soft skills, and situational judgment.',
    4: 'Problem Solving / Case Study round. Focus on analytical thinking, design, and structured reasoning.',
    5: 'HR / Offer round. Focus on compensation expectations, career goals, work culture, and final fit.',
};

function buildCompanySystemPrompt(company, role, interviewType) {
    const ctx = COMPANY_CONTEXTS[company];

    if (!ctx) {
        return `You are an experienced interviewer conducting a ${interviewType} interview for a ${role} position.
Ask thoughtful, relevant questions appropriate for a fresher or entry-level candidate.
Always respond in pure, valid JSON only — no extra text outside the JSON.`;
    }

    const groupDescriptions = {
        service_basic: 'a service-based IT company that hires freshers with structured, process-oriented interviews',
        service_process: 'a global IT services and consulting company with process-driven interview rounds',
        product_hard: 'a top-tier product company with rigorous, algorithm-focused interviews',
        startup_mid: 'a fast-growing startup/product company that values practical coding and product mindset',
    };

    return `You are a senior interviewer at ${company}, ${groupDescriptions[ctx.group] || 'a leading technology company'}.

COMPANY CONTEXT:
${ctx.culture}

Your role today: Interview a candidate applying for a ${role} position.
Interview type: ${interviewType}

CRITICAL INSTRUCTIONS:
1. Think and act exactly as a real ${company} interviewer would — use their authentic style, values, and question patterns.
2. Always respond with ONLY valid JSON — absolutely no prose, markdown, or text outside the JSON structure.
3. Generate questions that are specific, realistic, and appropriate for ${company}'s actual interview process.
4. Calibrate question difficulty to ${company}'s known hiring bar.`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Exported functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates 5 interview questions tailored to company, role, and round.
 */
async function generateInterviewQuestions(company, role, interviewType, round) {
    const roundNum = parseInt(round, 10) || 1;
    const roundContext = ROUND_CONTEXTS[roundNum] || ROUND_CONTEXTS[1];
    const systemPrompt = buildCompanySystemPrompt(company, role, interviewType || 'Technical');

    const userPrompt = `Generate exactly 5 interview questions for Round ${roundNum} (${roundContext}).

Return ONLY this JSON structure with no other text:
{
  "questions": [
    {
      "id": 1,
      "question": "<the interview question text>",
      "hint": "<a brief hint or what the interviewer is looking for>",
      "expectedDuration": "<e.g. '2-3 minutes'>"
    }
  ]
}

Requirements:
- Questions must reflect ${company}'s real interview style for a ${role} role.
- Round focus: ${roundContext}
- Mix difficulty appropriately; start easier and get progressively harder.
- Each question must be distinct with no repeated themes.
- Hints should guide without giving away the answer.`;

    const result = await callOllama(systemPrompt, userPrompt);

    if (!result.questions || !Array.isArray(result.questions)) {
        if (Array.isArray(result)) return { questions: result };
        throw new Error('Unexpected response shape from Ollama for question generation');
    }

    return result;
}

/**
 * Evaluates a candidate's answer against the question and company context.
 */
async function evaluateAnswer(question, answer, company, role, round) {
    const roundNum = parseInt(round, 10) || 1;
    const systemPrompt = buildCompanySystemPrompt(company, role, 'Evaluation');

    const userPrompt = `Evaluate the following candidate answer for a ${company} ${role} interview (Round ${roundNum}).

QUESTION: ${question}

CANDIDATE'S ANSWER: ${answer || '(No answer provided)'}

Return ONLY this JSON structure with no other text:
{
  "score": <integer 1-10>,
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<area to improve 1>", "<area to improve 2>"],
  "sampleAnswer": "<A concise ideal answer a top candidate would give>",
  "verdict": "<one of: 'Strong' | 'Good' | 'Needs Work'>"
}

Scoring guide:
9-10: Exceptional, 7-8: Good, 5-6: Average, 3-4: Below average, 1-2: Poor.
Evaluate strictly as a ${company} interviewer would.`;

    const result = await callOllama(systemPrompt, userPrompt);

    if (result.score !== undefined) {
        result.score = Math.min(10, Math.max(1, Math.round(Number(result.score))));
    }

    const validVerdicts = ['Strong', 'Good', 'Needs Work'];
    if (!validVerdicts.includes(result.verdict)) {
        if (result.score >= 8) result.verdict = 'Strong';
        else if (result.score >= 5) result.verdict = 'Good';
        else result.verdict = 'Needs Work';
    }

    return result;
}

/**
 * Generates a comprehensive final hiring report from a completed interview session.
 */
async function generateFinalReport(sessionData) {
    const { company, role, sessionData: rounds } = sessionData;

    const systemPrompt = `You are a senior talent acquisition specialist at ${company}.
You have just completed a multi-round interview for a ${role} candidate.
Provide an authoritative, detailed hiring recommendation.
Respond ONLY with valid JSON — no prose outside the JSON structure.`;

    const roundSummaries = (rounds || []).map((r, i) => ({
        roundNumber: r.round || i + 1,
        question: r.question,
        answer: r.answer || '(Not answered)',
        score: r.evaluation?.score || 0,
        verdict: r.evaluation?.verdict || 'Needs Work',
        strengths: r.evaluation?.strengths || [],
        improvements: r.evaluation?.improvements || [],
    }));

    const userPrompt = `Based on the following interview session data for a ${company} ${role} candidate,
generate a comprehensive final hiring report.

INTERVIEW DATA:
${JSON.stringify(roundSummaries, null, 2)}

Return ONLY this JSON structure:
{
  "overallScore": <weighted average score out of 10, as a decimal e.g. 7.4>,
  "hiringVerdict": "<one of: 'Strong Hire' | 'Hire' | 'Hold' | 'No Hire'>",
  "roundScores": [
    { "round": <number>, "score": <number>, "summary": "<one sentence summary>" }
  ],
  "topStrengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "criticalGaps": ["<gap 1>", "<gap 2>"],
  "actionPlan": [
    "<specific action item 1>",
    "<specific action item 2>",
    "<specific action item 3>"
  ],
  "companyCultureFit": "<2-3 sentence narrative on how well this candidate fits ${company}'s culture>"
}`;

    const result = await callOllama(systemPrompt, userPrompt);

    if (result.overallScore !== undefined) {
        result.overallScore = Math.round(Number(result.overallScore) * 10) / 10;
    }

    return result;
}

/**
 * Checks whether the local Ollama instance is reachable and lists available models.
 */
async function checkOllamaHealth() {
    try {
        const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
            signal: AbortSignal.timeout(5000),
        });

        if (!res.ok) return { available: false, models: [] };

        const data = await res.json();
        const models = (data.models || []).map((m) => m.name);
        return { available: true, models };
    } catch (err) {
        console.warn('[OllamaService] Health check failed:', err.message);
        return { available: false, models: [] };
    }
}

module.exports = {
    generateInterviewQuestions,
    evaluateAnswer,
    generateFinalReport,
    checkOllamaHealth,
};
