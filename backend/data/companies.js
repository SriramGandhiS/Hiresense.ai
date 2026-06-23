/**
 * companies.js
 * Static data for all supported companies and available roles.
 * Exported as COMPANIES and ROLES arrays.
 */

const COMPANIES = [
    // ── Service-Based | Difficulty: Fresher | Rounds: 3 ──────────────────────
    {
        id: 'tcs',
        name: 'TCS',
        logo: '🔵',
        difficulty: 'Fresher',
        tier: 'Service',
        rounds: 3,
        description:
            "India's largest IT services company. Hires freshers in bulk through campus drives. Known for structured training programs and global project exposure.",
        focusAreas: ['Aptitude', 'Verbal Communication', 'Basic Coding', 'Logical Reasoning', 'HR Fit'],
        interviewStyle:
            'Friendly and structured. Focuses on aptitude, basic programming, and cultural fit rather than advanced algorithms.',
    },
    {
        id: 'wipro',
        name: 'Wipro',
        logo: '🟡',
        difficulty: 'Fresher',
        tier: 'Service',
        rounds: 3,
        description:
            'Leading global IT services and consulting company. Values the "Spirit of Wipro" culture with strong emphasis on communication and process adherence.',
        focusAreas: ['Communication Skills', 'Basic Programming', 'SQL Basics', 'Process Orientation', 'Team Fit'],
        interviewStyle:
            'Conversational and process-driven. Tests communication skills heavily alongside basic technical knowledge.',
    },
    {
        id: 'infosys',
        name: 'Infosys',
        logo: '🟢',
        difficulty: 'Fresher',
        tier: 'Service',
        rounds: 3,
        description:
            'Global IT giant known for its massive training facility in Mysore. Recruits freshers through InfyTQ platform and campus placements.',
        focusAreas: ['InfyTQ Aptitude', 'OOPS Concepts', 'DBMS', 'Verbal Ability', 'Situational HR'],
        interviewStyle:
            'Platform-based aptitude followed by a technical interview on OOP and database fundamentals, and an HR round.',
    },
    {
        id: 'hcl',
        name: 'HCL',
        logo: '🔷',
        difficulty: 'Fresher',
        tier: 'Service',
        rounds: 3,
        description:
            'HCLTech is a next-generation global technology company. Focuses on freshers through their GEMs (Global Entry-level Manpower) program.',
        focusAreas: ['Aptitude', 'Basic Programming', 'Networking Basics', 'OOPS', 'HR Fit'],
        interviewStyle:
            'Aptitude-heavy with a technical round on basic CS concepts. Interviewers look for learning willingness over depth of knowledge.',
    },
    {
        id: 'cognizant',
        name: 'Cognizant',
        logo: '🔵',
        difficulty: 'Fresher',
        tier: 'Service',
        rounds: 3,
        description:
            'Fortune 500 IT services and consulting company. Known for Cognizant Technology Solutions (CTS) and large fresher hiring programs.',
        focusAreas: ['Communication', 'Basic Coding', 'Database Knowledge', 'Process Orientation', 'Teamwork'],
        interviewStyle:
            'Communication-first approach. Tests verbal ability strongly and expects clear articulation of basic technical concepts.',
    },
    {
        id: 'accenture',
        name: 'Accenture',
        logo: '🟣',
        difficulty: 'Fresher',
        tier: 'Service',
        rounds: 3,
        description:
            'Global professional services company in strategy, consulting, digital, technology and operations. Focuses on values alignment.',
        focusAreas: ['Communication', 'Basic Coding', 'Aptitude', 'Situational Judgment', 'Core Values'],
        interviewStyle:
            'Structured and values-driven. Interviewers test communication clarity and cultural alignment with Accenture core values.',
    },
    {
        id: 'capgemini',
        name: 'Capgemini',
        logo: '🔴',
        difficulty: 'Fresher',
        tier: 'Service',
        rounds: 3,
        description:
            'Global leader in consulting, digital transformation, technology, and engineering services. Hires freshers for technology consulting roles.',
        focusAreas: ['Aptitude', 'Pseudo-code', 'Communication', 'HR Behavioral', 'Team Collaboration'],
        interviewStyle:
            'Aptitude-focused with a pseudo-coding/technical section. HR round tests teamwork and leadership attitude.',
    },
    {
        id: 'ibm',
        name: 'IBM',
        logo: '🔵',
        difficulty: 'Fresher',
        tier: 'Service',
        rounds: 3,
        description:
            'Global technology and consulting company. Known for innovation in cloud, AI, and quantum computing. Hires freshers for a wide range of roles.',
        focusAreas: ['Analytical Reasoning', 'Basic Coding', 'Cloud Fundamentals', 'Communication', 'Continuous Learning'],
        interviewStyle:
            'Analytical and communication-focused. IBM values intellectual curiosity and continuous learning above rote technical knowledge.',
    },
    {
        id: 'deloitte',
        name: 'Deloitte',
        logo: '🟢',
        difficulty: 'Fresher',
        tier: 'Service',
        rounds: 3,
        description:
            'Deloitte USI Technology division hires freshers for IT and consulting roles. Part of one of the Big Four professional services firms.',
        focusAreas: ['Aptitude', 'Coding Basics', 'SQL', 'Case Study', 'Leadership & Ethics'],
        interviewStyle:
            'Case-study flavored even at fresher level. Tests structured thinking, SQL knowledge, and behavioral questions around ethics.',
    },

    // ── Product-Based | Difficulty: Hard | Rounds: 5 ─────────────────────────
    {
        id: 'amazon',
        name: 'Amazon',
        logo: '🟠',
        difficulty: 'Hard',
        tier: 'Product',
        rounds: 5,
        description:
            "World's largest e-commerce and cloud computing company. Known for the most rigorous interview process centered around 14 Leadership Principles.",
        focusAreas: ['Leadership Principles', 'STAR Method', 'DSA', 'System Design', 'Coding'],
        interviewStyle:
            'Every question maps to a Leadership Principle. Technical rounds are LeetCode-hard. Behavioral answers must follow strict STAR format.',
    },
    {
        id: 'microsoft',
        name: 'Microsoft',
        logo: '🔷',
        difficulty: 'Hard',
        tier: 'Product',
        rounds: 5,
        description:
            "Global technology leader in software, cloud (Azure), and productivity tools. Known for growth mindset culture and collaborative interview style.",
        focusAreas: ['DSA', 'OOP Design', 'System Design', 'Problem Solving', 'Growth Mindset'],
        interviewStyle:
            'Thinks-aloud approach expected. Tests clean code, edge case handling, and behavioral questions around collaboration and mentorship.',
    },
    {
        id: 'google',
        name: 'Google',
        logo: '🔴',
        difficulty: 'Hard',
        tier: 'Product',
        rounds: 5,
        description:
            'World\'s leading search and technology company. Famous for "Googleyness" culture and algorithm-intensive technical interviews.',
        focusAreas: ['Algorithms', 'Data Structures', 'System Design', 'Big-O Analysis', 'Googleyness'],
        interviewStyle:
            'Extremely algorithm-focused. Expects Big-O analysis, multiple solution approaches, and edge case coverage. Culture-fit assessed separately.',
    },

    // ── Startup/Product | Difficulty: Mid | Rounds: 4 ────────────────────────
    {
        id: 'flipkart',
        name: 'Flipkart',
        logo: '🟡',
        difficulty: 'Mid',
        tier: 'Startup',
        rounds: 4,
        description:
            "India's largest e-commerce marketplace (Walmart subsidiary). Strong engineering culture with focus on practical problem-solving at scale.",
        focusAreas: ['DSA', 'System Design', 'Coding Efficiency', 'Product Thinking', 'Ownership'],
        interviewStyle:
            'Medium-to-hard LeetCode style DSA. System design for e-commerce scenarios. Startup ownership mindset is heavily evaluated.',
    },
    {
        id: 'swiggy',
        name: 'Swiggy',
        logo: '🟠',
        difficulty: 'Mid',
        tier: 'Startup',
        rounds: 4,
        description:
            "India's leading food delivery and quick commerce platform. Values engineers who understand product-engineering intersection.",
        focusAreas: ['Backend Coding', 'System Design', 'Geolocation Problems', 'Product Thinking', 'Scale'],
        interviewStyle:
            'Practical coding over theoretical algorithms. System design is real-world (delivery tracking, surge pricing). Product mindset tested.',
    },
    {
        id: 'zomato',
        name: 'Zomato',
        logo: '🔴',
        difficulty: 'Mid',
        tier: 'Startup',
        rounds: 4,
        description:
            'Food-tech giant operating in food delivery, restaurant discovery, and hyperpure. Known for strong hustle culture and data-driven decisions.',
        focusAreas: ['DSA', 'System Design', 'Data Handling', 'Hustle Culture Fit', 'Ownership'],
        interviewStyle:
            'Combines coding challenges with startup mindset questions. Restaurant discovery and order management used as system design contexts.',
    },
    {
        id: 'cred',
        name: 'CRED',
        logo: '🟣',
        difficulty: 'Mid',
        tier: 'Startup',
        rounds: 4,
        description:
            'Premium fintech startup for creditworthy individuals. Has one of the highest hiring bars in the Indian startup ecosystem.',
        focusAreas: ['Advanced DSA', 'Fintech System Design', 'Code Quality', 'Craft & Attention to Detail', 'Long-term Thinking'],
        interviewStyle:
            'High bar for code quality and system elegance. Interviewers care deeply about how you think, not just what you produce.',
    },
    {
        id: 'phonepe',
        name: 'PhonePe',
        logo: '🟣',
        difficulty: 'Mid',
        tier: 'Startup',
        rounds: 4,
        description:
            "India's largest digital payments platform. Engineering-focused with strong emphasis on distributed systems and payment infrastructure.",
        focusAreas: ['Distributed Systems', 'Backend Coding', 'Payment System Design', 'DSA', 'Ownership & Speed'],
        interviewStyle:
            'Backend and systems-heavy. Payment processing and distributed systems are common design problems. Startup ownership mindset required.',
    },
];

const ROLES = [
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Analyst',
    'Data Scientist',
    'DevOps Engineer',
    'QA Engineer',
    'Product Manager',
];

module.exports = { COMPANIES, ROLES };
