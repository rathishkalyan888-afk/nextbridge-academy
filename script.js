// Nav Bar Effect on Scroll
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-active');

    // Animate hamburger to X (optional simple transform toggle)
    if (navLinks.classList.contains('mobile-active')) {
        hamburger.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    } else {
        hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
});

// Close mobile menu on clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-active');
        hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
});

// Scroll Reveal Animation function
function reveal() {
    var reveals = document.querySelectorAll(".reveal");

    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 100;

        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}

// Trigger reveal on scroll
window.addEventListener("scroll", reveal);

// Add 'reveal' class dynamically and stagger triggers
document.addEventListener("DOMContentLoaded", () => {
    // Add reveals to service cards with staggered delays
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.classList.add('reveal');
        card.style.transitionDelay = `${index * 0.15}s`;
    });

    // Initial call to check scroll position on page load
    setTimeout(reveal, 100);
});

// Smooth scrolling for anchor links (safari support/enhancement)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });
});

// ============================================================
// NextBridge Smart Chatbot — "Nano-GPT" Engine (Fully Self-Contained)
// ============================================================

// --- 1. Massive Knowledge Base ---
const NANO_KNOWLEDGE = [
    // Greeting & Identity
    {
        intent: "greeting", keys: ["hello", "hi", "hey", "good morning", "good evening", "good afternoon", "start", "help", "who are you", "what can you do"],
        answer: "👋 Hello! I'm the **NextBridge Nano-AI**. I'm an advanced virtual counselor. I can help you with:\n\n• 🌍 **Study Abroad** (22+ countries)\n• 🏛️ **Indian University Admissions**\n• 💼 **Career Guidance**\n• 📝 **IELTS / PTE / TOEFL** prep\n\nHow can I assist your educational journey today?",
        chips: ["Study Abroad", "Indian Universities", "IELTS Coaching"]
    },

    // Country Specific - USA
    {
        intent: "usa", keys: ["usa", "united states", "america", "study in us", "us university", "new york", "california", "ms in us", "masters in us", "f1"],
        answer: "🇺🇸 Studying in the **USA** is excellent for tech, business, and research!\n\n**Requirements:**\n• Bachelor's: SAT/ACT (optional), TOEFL/IELTS/DET\n• Master's: GRE/GMAT, TOEFL/IELTS, Strong SOP\n• Visa: F-1 Student Visa\n\nWe assist with university shortlisting, scholarships, and visa prep.",
        chips: ["Book a Free Session", "Cost of US Study"]
    },

    // Country Specific - UK
    {
        intent: "uk", keys: ["uk", "united kingdom", "britain", "england", "study in uk", "london", "masters in uk", "scotland"],
        answer: "🇬🇧 The **UK** is famous for its 1-year Master's programs and 2-year Post-Study Work Visa!\n\n**Key Info:**\n• Intakes: September & January\n• Requires: IELTS (usually 6.0-7.0)\n• Top Universities: Russell Group\n\nWe can help you secure offers from top UK universities quickly.",
        chips: ["Book UK Consultation", "IELTS for UK"]
    },

    // Country Specific - Canada
    {
        intent: "canada", keys: ["canada", "study in canada", "canadian university", "toronto", "vancouver", "pgwp", "pr in canada", "sds"],
        answer: "🇨🇦 **Canada** is the top choice for immigration pathways and high-quality education!\n\n**Benefits:**\n• 3-Year Post-Graduation Work Permit (PGWP)\n• Pathway to PR\n• Requires: IELTS 6.0+ or PTE\n\nLet's check your eligibility for Canadian colleges and universities.",
        chips: ["Check Canada Eligibility", "IELTS Coaching"]
    },

    // Country Specific - Australia
    {
        intent: "australia", keys: ["australia", "study in australia", "australian university", "sydney", "melbourne", "psw australia", "subclass 500"],
        answer: "🇦🇺 **Australia** offers brilliant weather, high minimum wages, and excellent universities!\n\n**Details:**\n• Up to 4 years of Post-Study Work rights\n• Strong sectors: Nursing, IT, Engineering, Accounting\n• Requires: IELTS 6.5+ or PTE 58+\n\nOur team handles the entire Subclass 500 visa process.",
        chips: ["Book Australia Session", "PTE Coaching"]
    },

    // Country Specific - Europe/Germany
    {
        intent: "europe", keys: ["germany", "europe", "france", "study in germany", "european university", "ireland", "free education", "blocked account"],
        answer: "🇪🇺 **Europe** (especially Germany) is fantastic for low-cost or **FREE** education!\n\n• **Germany:** Public universities have near-zero tuition fees. You just need a blocked account (~11,208 EUR).\n• **Ireland:** Great for IT and Pharma with a 2-year stay-back.\n• **France:** Excellent business schools.",
        chips: ["Free Study in Germany", "Book Free Session"]
    },

    // Indian Universities
    {
        intent: "india", keys: ["indian university", "india university", "iim", "iit", "admission india", "campus", "indian college", "btech", "mba in india", "medical india", "nit"],
        answer: "🏛️ We have exclusive access to **1000+ Indian Campuses**!\n\nWe provide guaranteed admission assistance for:\n• Top Engineering & Management Colleges (including **IIM Lead Lock**)\n• Medical Colleges (MBBS/MD)\n• Architecture & Law colleges\n\nWhat degree are you aiming for in India?",
        chips: ["MBA Admissions", "B.Tech Admissions", "Medical Admissions"]
    },

    // Online Degrees
    {
        intent: "online_degree", keys: ["online degree", "distance learning", "online mba", "iim online", "work from home study", "part time degree"],
        answer: "💻 Enhance your career without leaving your job!\n\nWe partner with top institutions to offer **50+ Online Degrees** (including IIMs).\nThese are fully UGC-approved and equivalent to regular degrees.\nPerfect for working professionals.",
        chips: ["Explore Online MBA", "Contact Us"]
    },

    // Test Prep - IELTS
    {
        intent: "ielts", keys: ["ielts", "ielts coaching", "ielts band", "ielts score", "ielts preparation", "ielts exam", "reading", "listening", "speaking", "writing"],
        answer: "📝 **Elite IELTS Coaching** by NextBridge!\n\nTarget an **8.0+ Band** with our proven strategies.\n• Live Interactive Classes\n• 1-on-1 Speaking Mock Tests\n• Detailed Writing Evaluations\n\nIELTS is accepted by 12,000+ organizations globally.",
        chips: ["Book IELTS Demo Class", "Exam Dates"]
    },

    // Test Prep - TOEFL & PTE & DET
    {
        intent: "other_tests", keys: ["toefl", "pte", "pearson test", "duolingo", "det", "english test"],
        answer: "📝 We offer top-tier preparation for **TOEFL, PTE, and Duolingo (DET)**.\n\n• **PTE:** Quick results, heavily used for Australia.\n• **TOEFL:** Preferred by elite US institutions.\n• **Duolingo:** Fast, affordable, and done from home.\n\nOur AI-powered scoring helps you hit your target fast.",
        chips: ["Book PTE Coaching", "Book Duolingo Prep"]
    },

    // Test Prep - GRE/GMAT
    {
        intent: "gre_gmat", keys: ["gre", "gmat", "graduate record", "quant", "verbal", "analytical", "score", "prep"],
        answer: "📝 **Complete GRE & GMAT Preparation**\n\nFor top universities in the US and Canada, GRE/GMAT scores are critical.\n• **GRE:** We provide dedicated 6-week crash courses focusing on Quant and Verbal. A score of 315+ is ideal for top 50 US universities.\n• **GMAT:** Essential for elite MBA programs. We focus on Data Insights and Critical Reasoning.\n• **Waivers:** We also maintain a database of 500+ universities that offer GRE/GMAT waivers!",
        chips: ["Book GRE Coaching", "Check Waiver Options"]
    },

    // Funding & Loan Allocation
    {
        intent: "loan_allocation", keys: ["loan", "education loan", "funding", "finance", "collateral", "non collateral", "allocation", "money", "bank", "interest", "blocked account"],
        answer: "💳 **Expert Education Loan Processing & Allocation**\n\nWe guarantee smooth loan sanctions through our banking partners (HDFC, SBI, Axis, Avanse, Prodigy, etc.).\n\n**Loan Types:**\n• **Unsecured (Non-Collateral):** Up to 50 Lakhs INR based on student academics, GRE scores, and co-applicant income.\n• **Secured (Collateral):** Up to 1.5 Crores INR against property, FDs, or liquid assets (usually 9-11% interest).\n\nOur finance team handles the entire documentation, disbursement, and blocked account setup (for Germany/Canada SDS) directly.",
        chips: ["Check Loan Eligibility", "Talk to Finance Expert"]
    },

    // Passports
    {
        intent: "passport", keys: ["passport", "tatkal", "renew", "apply passport"],
        answer: "🛂 **Passport Assistance Services**\n\nA valid passport is the very first step for your study abroad journey.\n• We guide you on standard and **Tatkal** passport applications.\n• We ensure your name format matches academic documents (crucial for visa approval).\n• Your passport must be valid for at least 6 months beyond your intended course duration.",
        chips: ["Passport Help", "Start Application"]
    },

    // Accommodation / Housing
    {
        intent: "accommodation", keys: ["accommodation", "housing", "hostel", "dorm", "stay", "room", "apartment", "rent"],
        answer: "🏠 **Student Accommodation & Housing Support**\n\nSecuring safe housing is a priority before you fly. We assist with:\n• **On-Campus Housing (Dorms):** Perfect for first-year bachelors. Very safe but sometimes pricier.\n• **Off-Campus Student Apartments:** We partner with trusted global student housing providers (like AmberStudent, Casita) to find affordable setups near your university.\n• **Homestays:** Experience local culture by living with a host family.\n\nWe help you sign leases safely before you even board your flight!",
        chips: ["Find Housing", "Book Session"]
    },

    // SOP & LOR Detailed
    {
        intent: "application_docs", keys: ["sop", "statement of purpose", "lor", "letter of recommendation", "essay", "personal statement", "resume", "cv", "how to apply"],
        answer: "📄 **Elite Admissions Drafting (SOP & LOR)**\n\nYour Statement of Purpose (SOP) is often more important than your GPA.\n• **SOP:** Our expert writers craft a unique, compelling narrative highlighting your academic journey, career goals, and why the specific university is the perfect fit. We do NOT use generic templates.\n• **LORs:** We guide you on how to select recommenders (Professors vs. Managers) and provide structural drafts for them to use.\n• **Resumes:** We format your CV to international academic standards.",
        chips: ["Get SOP Help", "Book Free Session"]
    },

    // Detailed Visa Support
    {
        intent: "visa", keys: ["visa", "student visa", "f1", "tier 4", "study permit", "schengen", "subclass 500", "visa interview", "mock interview"],
        answer: "🛂 **Comprehensive Visa Processing & Mock Interviews**\n\nWe boast a 98% Visa Success Rate! Our process includes:\n• **US (F1 Visa):** Complete DS-160 filling, SEVIS fee payment, and 3 rigorous **Mock Interviews** to ensure you confidently answer the Consular Officer.\n• **UK (Tier 4):** Guidance on CAS issuance, NHS fee payments, and financial proof.\n• **Canada (Study Permit):** Full support for SDS (Student Direct Stream) vs Non-SDS pathways, GIC setup, and medicals.\n• **Australia:** Genuine Temporary Entrant (GTE) or GS requirement assistance.\n\nWe ensure every single document is flawless.",
        chips: ["Book Mock Interview", "Visa Consultation"]
    },

    // Career Guidance
    {
        intent: "career", keys: ["career", "career guidance", "career counseling", "what to study", "career path", "job", "future", "confused", "which course", "psychometric"],
        answer: "💼 Not sure what to study? Our **Career Guidance** program is designed for you.\n\nWe utilize advanced **Psychometric Aptitude Assessments** and 1-on-1 mentoring to map out the perfect career path tailored to your strengths and market demand.",
        chips: ["Take Career Assessment", "Talk to a Counselor"]
    },

    // Medical & PhD
    {
        intent: "advanced_medical", keys: ["medical", "mbbs", "medicine", "doctor", "neet", "dba", "phd", "doctorate", "research"],
        answer: "🏥🎓 We handle highly specialized admissions:\n\n• **Medical (MBBS/MD):** Admissions in India, Russia, Philippines, etc. NEET counseling.\n• **Doctoral (PhD/DBA):** Global Doctorate in Business Administration and PhD placement.\n\nThese require specialized profiles, let's connect you with our senior experts.",
        chips: ["Medical Admissions", "DBA Consult"]
    },

    // Timeline / Intakes
    {
        intent: "timeline", keys: ["when", "timeline", "deadline", "intake", "september", "january", "how long", "spring", "fall"],
        answer: "📅 **Application Intakes & Timelines:**\n\n• **Fall (Aug/Sep):** The largest intake. Apply 8-12 months prior.\n• **Spring (Jan/Feb):** Secondary intake. Apply 6-8 months prior.\n• **Summer (May):** Limited courses.\n\n*Action Step:* Start preparing your IELTS and SOP at least a year before you intend to fly!",
        chips: ["Start Application Setup", "Book Consultation"]
    },

    // Contact/Location
    {
        intent: "contact", keys: ["contact", "email", "phone", "call", "whatsapp", "reach", "address", "location", "office", "where are you", "number"],
        answer: "📞 **Contact NextBridge Academy**\n\n📍 **Location:** Gandhi Nagar, Hosur, Tamil Nadu\n📱 **Phones:** +91 98436 27245 / +91 73976 49955\n📧 **Email:** nextbridgeacademy1@gmail.com\n\nOur team is available 9 AM to 7 PM IST.",
        chips: ["Call Us", "Book Online Session"]
    },

    // Cost/Fees specific question
    {
        intent: "cost", keys: ["how much", "cost", "fees", "expensive", "cheapest", "price"],
        answer: "💰 **Tuition & Living Costs** vary significantly by country:\n\n• **USA:** $25k - $60k/year\n• **UK:** £15k - £30k/year\n• **Canada:** CAD 15k - 35k/year\n• **Germany:** ~Free (Living: €11k/year)\n\nWe can help you find affordable options and significant scholarships!",
        chips: ["Scholarship Info", "Affordable Countries"]
    },

    // Default Fallback
    {
        intent: "default", keys: ["__default__"],
        answer: "🤔 I want to make sure I give you the best advice. Could you clarify?\n\nI can provide detailed information on:\n1. Studying Abroad (US, UK, Canada, Australia)\n2. Indian University Admissions\n3. IELTS/TOEFL/PTE Training\n4. Career Counseling & Visas\n\nOr you can directly book a session with our human experts!",
        chips: ["Book a Free Session", "Study Abroad", "Indian Admissions"]
    }
];

// --- 2. Nano-AI Brain (Memory & Logic) ---
const NanoBrain = {
    context: { lastIntent: null, userName: null },

    // Fuzzy matching algorithm that behaves like an intent classifier
    processInput: function (input) {
        let rawInput = input;
        input = input.toLowerCase().replace(/[^\w\s]/gi, '').trim();

        // Context Memory Trick: Name extraction
        if (input.includes("my name is") || input.startsWith("i am ")) {
            const words = input.split(" ");
            const name = words[words.length - 1]; // Assume last word is name
            if (name.length > 2) {
                this.context.userName = name.charAt(0).toUpperCase() + name.slice(1);
                return { answer: `Nice to meet you, **${this.context.userName}**! How can NextBridge help you today?`, chips: ["Study Abroad", "Career Counseling"] };
            }
        }

        let bestMatch = null;
        let highestScore = 0;

        for (const entry of NANO_KNOWLEDGE) {
            if (entry.keys[0] === '__default__') continue;

            let score = 0;
            for (const key of entry.keys) {
                // Exact word boundary match gives high score
                const regex = new RegExp(`\\b${key}\\b`, 'i');
                if (regex.test(input)) {
                    score += key.length * 3; // Boost exact matches
                } else if (input.includes(key)) {
                    // Partial match gives lower score
                    score += key.length;
                }
            }

            if (score > highestScore) {
                highestScore = score;
                bestMatch = entry;
            }
        }

        const result = bestMatch || NANO_KNOWLEDGE.find(e => e.intent === 'default');

        // Optional conversational flow logic
        if (result.intent === 'default' && this.context.lastIntent) {
            // Slight conversational continuity
            this.context.lastIntent = null; // reset
        } else {
            this.context.lastIntent = result.intent;
        }

        // Personalize if name is known memory
        let finalAnswer = result.answer;
        if (this.context.userName && Math.random() > 0.4 && !finalAnswer.startsWith("👋") && result.intent !== 'default') {
            const intros = [
                `Here's what I know, **${this.context.userName}**:\n\n`,
                `Great question, **${this.context.userName}**.\n\n`,
                `Sure thing, **${this.context.userName}**!\n\n`
            ];
            finalAnswer = intros[Math.floor(Math.random() * intros.length)] + finalAnswer;
        }

        return { answer: finalAnswer, chips: result.chips, isDefault: result.intent === 'default' };
    }
};

// --- 3. UI rendering and Streaming Effect ---
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotSend = document.getElementById('chatbot-send');
const chatbotText = document.getElementById('chatbot-text');
const chatbotMessages = document.getElementById('chatbot-messages');

// Formats basic markdown to HTML
function formatMarkdown(text) {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
}

// Add User Message
function addUserMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'user-message';
    msgDiv.textContent = text;
    chatbotMessages.appendChild(msgDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Simulate AI Token Streaming & Interaction Chips
async function streamBotMessage(text, chips) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'bot-message';
    chatbotMessages.appendChild(msgDiv);

    // Convert markdown to HTML tags first so we don't stream broken tags
    const htmlOutput = formatMarkdown(text);

    // Typing indicator animation
    msgDiv.innerHTML = '<span style="display:inline-block; animation: pulse 1s infinite alternate;"><i class="fa-solid fa-circle" style="font-size:5px; margin-right:2px; vertical-align:middle;"></i><i class="fa-solid fa-circle" style="font-size:5px; margin-right:2px; vertical-align:middle;"></i><i class="fa-solid fa-circle" style="font-size:5px; vertical-align:middle;"></i></span>';
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    // Simulate AI "Thinking"
    await new Promise(r => setTimeout(r, 600 + Math.random() * 600));

    // Smooth fade-in for text
    msgDiv.style.opacity = '0';
    msgDiv.innerHTML = htmlOutput;

    // Trigger CSS reflow
    void msgDiv.offsetWidth;
    msgDiv.style.transition = 'opacity 0.4s ease-in';
    msgDiv.style.opacity = '1';

    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    // Render Action Chips dynamically
    if (chips && chips.length > 0) {
        setTimeout(() => {
            const chipsContainer = document.createElement('div');
            chipsContainer.className = 'chatbot-chips';
            chipsContainer.style.display = 'flex';
            chipsContainer.style.flexWrap = 'wrap';
            chipsContainer.style.gap = '6px';
            chipsContainer.style.marginTop = '12px';

            chips.forEach(chipText => {
                const chip = document.createElement('button');
                chip.textContent = chipText;

                // Advanced Inline Styling for Chips
                chip.style.padding = '6px 14px';
                chip.style.border = '1px solid var(--primary)';
                chip.style.borderRadius = '20px';
                chip.style.background = 'rgba(10, 37, 64, 0.05)';
                chip.style.color = 'var(--primary)';
                chip.style.fontSize = '0.85rem';
                chip.style.fontWeight = '500';
                chip.style.cursor = 'pointer';
                chip.style.transition = 'all 0.2s';
                chip.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';

                chip.onmouseover = () => {
                    chip.style.background = 'var(--primary)';
                    chip.style.color = '#fff';
                    chip.style.transform = 'translateY(-1px)';
                };
                chip.onmouseout = () => {
                    chip.style.background = 'rgba(10, 37, 64, 0.05)';
                    chip.style.color = 'var(--primary)';
                    chip.style.transform = 'translateY(0)';
                };

                chip.onclick = () => {
                    // Smart routing for specific chip clicks
                    if (chipText.toLowerCase().includes('book') || chipText.toLowerCase().includes('session') || chipText.toLowerCase().includes('consultation')) {
                        window.location.href = 'book-session.html';
                        return;
                    }
                    if (chipText.toLowerCase().includes('call')) {
                        window.location.href = 'tel:+919843627245';
                        return;
                    }

                    // Act as user message
                    chatbotText.value = chipText;

                    // Remove current chips
                    document.querySelectorAll('.chatbot-chips').forEach(c => c.style.display = 'none');

                    handleSend();
                };
                chipsContainer.appendChild(chip);
            });
            msgDiv.appendChild(chipsContainer);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }, 500); // Small pop-in delay for chips
    }
}

// --- 4. ChatGPT-Style Conversation Memory ---
if (!window.ChatMemory) {
    window.ChatMemory = []; // Stores conversation context
}

// Master Send Handler
async function handleSend() {
    const text = chatbotText.value.trim();
    if (text === '') return;

    // Remove old chips from view
    document.querySelectorAll('.chatbot-chips').forEach(c => c.style.display = 'none');

    addUserMessage(text);
    chatbotText.value = '';

    // Step 1: Get Context from NanoBrain (RAG Architecture)
    const responseData = NanoBrain.processInput(text);

    // Step 2: Trigger the FULL Cloud AI Model (ChatGPT Level Intelligence)
    const thinkingId = 'ollama-thinking-' + Date.now();
    const msgDiv = document.createElement('div');
    msgDiv.id = thinkingId;
    msgDiv.className = 'bot-message';
    msgDiv.innerHTML = '<span style="display:inline-block; animation: pulse 1s infinite alternate;"><i class="fa-solid fa-circle" style="font-size:5px; margin-right:2px; vertical-align:middle;"></i><i class="fa-solid fa-circle" style="font-size:5px; margin-right:2px; vertical-align:middle;"></i><i class="fa-solid fa-circle" style="font-size:5px; vertical-align:middle;"></i></span>';
    chatbotMessages.appendChild(msgDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout for comprehensive generations

        // Inject NextBridge Knowledge as a System Rule
        let systemContent = `You are NextBridge AI Assistant, an extremely intelligent, helpful, and professional counselor for NextBridge Academy. 
        CRITICAL RULES:
        1. Answer completely and comprehensively like ChatGPT, Gemini, or Grok.
        2. Provide detailed formatting, using bullet points, bold text, and numbered lists to structure your response perfectly.
        3. Never give short one-sentence answers to complex questions; provide deep, dynamic, informative value every time. You do not repeat the exact same phrasing.
        4. You can answer absolutely *any* general knowledge question accurately, as well as handle complex study abroad queries.`;

        if (!responseData.isDefault) {
            // Inject RAG facts dynamically into the system memory for this turn
            systemContent += `\n\nCRITICAL CONTEXT FACTS FOR CURRENT USER QUESTION (You MUST integrate these facts flawlessly into your answer!): \n${responseData.answer}`;
        }

        // Build the Chat API payload using rolling memory
        const messagesPayload = [
            { role: "system", content: systemContent },
            ...window.ChatMemory.slice(-8), // Keep the last 8 messages in active memory for deep context
            { role: "user", content: text }
        ];

        // Fetching from a totally free, powerful Cloud LLM (No API Key Required!)
        const response = await fetch('https://text.pollinations.ai/openai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'openai', // Triggers top-tier cloud models
                messages: messagesPayload,
                jsonMode: false
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        if (!response.ok) throw new Error("Cloud Server error");

        const data = await response.json();
        document.getElementById(thinkingId)?.remove();

        // Parse OpenAI structure
        const aiResponseText = data.choices[0].message.content.trim();

        // Save to active memory to continue true conversation later
        window.ChatMemory.push({ role: "user", content: text });
        window.ChatMemory.push({ role: "assistant", content: aiResponseText });

        // Stream AI response beautifully to UI
        await streamBotMessage(aiResponseText, responseData.chips);

    } catch (e) {
        document.getElementById(thinkingId)?.remove();
        // Offline / Network Failure Fallback
        const fallbackText = responseData.answer;
        if (responseData.isDefault) {
            await streamBotMessage("I am the offline NextBridge AI. Please check your internet connection to enable my full ChatGPT-level intelligence! \n\n" + fallbackText, responseData.chips);
        } else {
            await streamBotMessage(fallbackText, responseData.chips);
        }
    }
}

// Add CSS animation for thinking dots dynamically
const styleParams = document.createElement('style');
styleParams.innerHTML = `
@keyframes pulse {
    0% { opacity: 0.3; }
    100% { opacity: 1; }
}
.chatbot-chips button:active {
    transform: scale(0.95) !important;
}
`;
document.head.appendChild(styleParams);


if (chatbotToggle && chatbotWindow) {
    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.classList.toggle('hidden');
        if (!chatbotWindow.classList.contains('hidden')) {
            chatbotText.focus();

            // Auto-greet on first open
            if (chatbotMessages.children.length === 0) {
                const initial = NanoBrain.processInput('hello');
                streamBotMessage(initial.answer, initial.chips);
            }
        }
    });

    chatbotClose.addEventListener('click', () => {
        chatbotWindow.classList.add('hidden');
    });

    chatbotSend.addEventListener('click', handleSend);
    chatbotText.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
}

