import {
  HeroData,
  WorkExperience,
  JourneyMilestone,
  SkillItem,
  ProjectItem,
  CaseStudyFile,
  ResumeVersion,
  ContactInfo,
  EducationItem,
  CertificationItem,
  QAChecklistItem
} from '../types/portfolio';

export const initialHeroData: HeroData = {
  fullName: "Lingaraj Belagali",
  designation: "Software Tester II",
  typingWords: [
    "Quality Assurance Engineer",
    "Manual Testing Expert",
    "API Testing Specialist",
    "Playwright Automation",
    "SQL & MongoDB Validation"
  ],
  bio: "Passionate QA Engineer with 3.8+ years of experience delivering high-quality enterprise software through Manual Testing, API Validation, Playwright Automation, SQL Verification, and Agile collaboration. Experienced across Capital Markets, Wealth Management, Application Modernization, and AI-driven platforms.",
  availabilityStatus: "Immediate Joiner",
  isAvailable: true,
  yearsOfExperience: 3.8,
  testCasesCount: 500,
  releasesCount: 25,
  toolsCount: 12,
  primaryCtaText: "Explore My Work",
  primaryCtaLink: "#projects",
  secondaryCtaText: "Download Resume",
  secondaryCtaLink: "resumes/Lingaraj_Belagali_Resume_QA_Immediate_Joiner.pdf",
  profileImageUrl: "/assets/profile.png",
  floatingBadges: [
    { id: '1', name: 'Playwright', icon: 'fa-code' },
    { id: '2', name: 'REST API', icon: 'fa-plug' },
    { id: '3', name: 'SQL', icon: 'fa-database' },
    { id: '4', name: 'MongoDB', icon: 'fa-leaf' },
    { id: '5', name: 'JIRA', icon: 'fa-bug' },
    { id: '6', name: 'Mabl', icon: 'fa-robot' },
    { id: '7', name: 'Agile', icon: 'fa-layer-group' }
  ]
};

export const initialWorkExperience: WorkExperience[] = [
  {
    id: 'exp-spire-ai',
    companyName: "Spire.ai",
    designation: "Software Tester II",
    period: "November 2025 – May 2026",
    startDate: "2025-11-01",
    endDate: "2026-05-31",
    isCurrent: false,
    employmentType: "Full-time",
    domain: "AI-Driven Enterprise Platforms",
    summary: "Testing AI-powered enterprise applications through Manual Testing, API Testing, Playwright Automation, MongoDB Validation, and Agile sprint execution.",
    responsibilities: [
      "Performed Functional, Regression, Smoke, and Sanity testing across AI platform modules.",
      "Validated REST APIs using Postman by verifying requests, responses, status codes, and business rules.",
      "Verified backend data integrity using MongoDB queries, document structures, and aggregation filters.",
      "Developed and maintained Playwright automation scripts for critical regression scenarios.",
      "Collaborated actively in sprint planning, defect triage, daily standups, and retrospective meetings."
    ],
    technologies: ["Playwright", "REST API", "MongoDB", "Postman", "Mabl", "AI Testing", "JIRA", "Git"],
    achievements: [
      "Enhanced regression efficiency by automating high-frequency workflow test scenarios.",
      "Prevented critical data discrepancies through thorough MongoDB backend verification.",
      "Streamlined bug lifecycle reporting with clear reproduction steps and screenshots in JIRA."
    ],
    sortOrder: 1,
    isPublished: true
  },
  {
    id: 'exp-tcs',
    companyName: "Tata Consultancy Services (TCS)",
    designation: "Software Tester I",
    period: "March 2022 – April 2025",
    startDate: "2022-03-01",
    endDate: "2025-04-30",
    isCurrent: false,
    employmentType: "Full-time",
    domain: "Capital Markets & Wealth Management",
    summary: "Worked on the SEI Wealth Management Platform within the Capital Markets domain, validating business-critical trade lifecycle workflows through Functional Testing, Regression Testing, API Validation, SQL verification, and Release Testing.",
    responsibilities: [
      "Executed end-to-end testing for trade order creation, execution, settlement, and accounting workflows.",
      "Authored and maintained comprehensive test cases covering positive, negative, and boundary scenarios.",
      "Performed SQL database verification to ensure transaction accuracy and account balance integrity.",
      "Validated backend REST APIs with Postman, validating JSON schemas and authentication tokens.",
      "Participated in enterprise release deployments, smoke checks, and hotfix validations."
    ],
    technologies: ["Capital Markets", "SQL", "Postman", "JIRA", "Regression", "REST API", "Trade Lifecycle", "Agile"],
    achievements: [
      "Supported 20+ successful production releases with zero critical post-release escapes.",
      "Created reusable SQL validation queries that reduced database verification time by 35%.",
      "Mentored junior team members on Capital Markets trade settlement validation rules."
    ],
    sortOrder: 2,
    isPublished: true
  }
];

export const initialMilestones: JourneyMilestone[] = [
  { id: 'm1', year: '2018 – 2021', title: 'Bachelor of Engineering in EEE', description: 'Graduated in Electrical and Electronics Engineering from Tontadarya College of Engineering and Technology, Gadag (VTU) with 8.4 CGPA.', isCurrent: false },
  { id: 'm2', year: 'March 2022 – April 2025', title: 'Software Tester I at Tata Consultancy Services', description: 'Delivered end-to-end QA for SEI Wealth Management platform (Capital Markets) across 25+ releases, trade lifecycle validation, and SQL testing.', isCurrent: false },
  { id: 'm3', year: 'Nov 2025 – May 2026', title: 'Software Tester II at Spire.ai', description: 'Tested AI-driven enterprise platform, Playwright automation suites, REST API microservices, and MongoDB document validations.', isCurrent: false },
  { id: 'm4', year: 'Present', title: 'Immediate Joiner for QA Automation Roles', description: 'Available for full-time QA Automation / SDET positions with zero notice period. Ready to bring 3.8+ years of test automation excellence.', isCurrent: true }
];

export const initialSkills: SkillItem[] = [
  { id: 's1', name: 'Manual Testing', category: 'Testing', proficiency: 95, icon: '🧪', sortOrder: 1, isPublished: true },
  { id: 's2', name: 'API Testing', category: 'Automation', proficiency: 90, icon: '🌐', sortOrder: 2, isPublished: true },
  { id: 's3', name: 'Playwright', category: 'Automation', proficiency: 85, icon: '🤖', sortOrder: 3, isPublished: true },
  { id: 's4', name: 'SQL', category: 'Database', proficiency: 90, icon: '🗄️', sortOrder: 4, isPublished: true },
  { id: 's5', name: 'MongoDB', category: 'Database', proficiency: 80, icon: '☁️', sortOrder: 5, isPublished: true },
  { id: 's6', name: 'Test Planning', category: 'Process', proficiency: 95, icon: '📋', sortOrder: 6, isPublished: true },
  { id: 's7', name: 'Defect Tracking', category: 'Process', proficiency: 95, icon: '🐞', sortOrder: 7, isPublished: true },
  { id: 's8', name: 'Agile / Scrum', category: 'Process', proficiency: 90, icon: '⚡', sortOrder: 8, isPublished: true },
  { id: 's9', name: 'Postman & Newman', category: 'Tools', proficiency: 92, icon: '🚀', sortOrder: 9, isPublished: true },
  { id: 's10', name: 'Mabl Automation', category: 'Automation', proficiency: 85, icon: '🎯', sortOrder: 10, isPublished: true }
];

export const initialProjects: ProjectItem[] = [
  {
    id: 'proj-playwright',
    slug: 'playwright-framework',
    title: 'Playwright Automation Framework',
    tagLabel: 'AUTOMATION FRAMEWORK',
    category: 'Automation',
    colorTheme: 'purple',
    shortDescription: 'Built a scalable automation testing framework using Playwright, JavaScript, Page Object Model (POM), HTML reports, and cross-browser CI architecture.',
    overview: 'This project demonstrates the development of a reusable automation testing framework using Playwright with JavaScript. The framework follows the Page Object Model (POM) design pattern to improve maintainability, readability, and scalability. It automates the TodoMVC application by validating core user workflows such as adding, editing, completing, and deleting tasks while generating detailed HTML execution reports.',
    techStack: ['Playwright', 'JavaScript', 'Page Object Model', 'HTML Reports', 'Git', 'VS Code', 'CI/CD Ready'],
    features: ['Page Object Model', 'Reusable Components', 'HTML Reports', 'Cross-Browser Testing'],
    stats: [
      { label: 'Test Cases', value: '25+' },
      { label: 'Execution', value: '3 Min' },
      { label: 'HTML Reports', value: '100%' }
    ],
    workflowSteps: [
      { stepNumber: 1, title: 'Test Initialization', description: 'Launches browser context and configures environment fixtures.', icon: 'fa-play' },
      { stepNumber: 2, title: 'Page Navigation', description: 'Navigates to the TodoMVC application using Page Objects.', icon: 'fa-compass' },
      { stepNumber: 3, title: 'Action Execution', description: 'Performs add, update, toggle, or delete operations.', icon: 'fa-keyboard' },
      { stepNumber: 4, title: 'Assertion', description: 'Validates expected DOM state, counts, and visibility.', icon: 'fa-check-double' },
      { stepNumber: 5, title: 'HTML Report', description: 'Generates interactive execution logs and screenshots.', icon: 'fa-chart-column' }
    ],
    testScenarios: [
      { id: 'tc1', title: 'Add New Todo', description: 'Verify users can create a new task successfully and the task appears in the list.', type: 'Functional', status: 'Automated' },
      { id: 'tc2', title: 'Edit Existing Todo', description: 'Validate users can modify existing tasks without affecting other records.', type: 'Functional', status: 'Automated' },
      { id: 'tc3', title: 'Delete Todo', description: 'Verify completed tasks can be removed and the UI updates correctly.', type: 'Functional', status: 'Automated' },
      { id: 'tc4', title: 'Complete Todo', description: 'Validate completed tasks display the correct completed state and strike-through.', type: 'Functional', status: 'Automated' },
      { id: 'tc5', title: 'Filter Active', description: 'Ensure only active tasks are displayed when Active filter is selected.', type: 'Filter', status: 'Automated' },
      { id: 'tc6', title: 'Filter Completed', description: 'Validate only completed tasks are displayed using the Completed filter.', type: 'Filter', status: 'Automated' },
      { id: 'tc7', title: 'Clear Completed', description: 'Verify completed tasks are permanently removed using Clear Completed.', type: 'Regression', status: 'Automated' },
      { id: 'tc8', title: 'UI Validation', description: 'Validate labels, counters, filters, and task visibility throughout execution.', type: 'UI/UX', status: 'Automated' }
    ],
    responsibilities: [
      { title: 'Framework Architecture', description: 'Designed modular POM folders with pages, tests, and utility helpers.', icon: 'fa-sitemap' },
      { title: 'Script Development', description: 'Created 25+ automated tests for all critical user workflows.', icon: 'fa-code' },
      { title: 'Reporting Integration', description: 'Configured Playwright HTML reporter with traces and screenshot attachments.', icon: 'fa-file-lines' },
      { title: 'Cross-Browser Verification', description: 'Configured Chromium, Firefox, and WebKit test execution matrices.', icon: 'fa-globe' }
    ],
    achievements: [
      { title: 'Reusable Framework', description: 'Designed a scalable Playwright framework using POM for zero maintenance overhead.' },
      { title: 'Automation Coverage', description: 'Automated core TodoMVC workflows covering CRUD operations and UI validations.' },
      { title: 'Execution Reports', description: 'Generated interactive HTML reports for easy result and trace analysis.' },
      { title: 'Maintainable Code', description: 'Centralized locators and reusable utilities reduced duplicate code by 40%.' }
    ],
    lessonsLearned: [
      'Improved framework design using the Page Object Model.',
      'Learned to build reusable automation components and custom fixtures.',
      'Strengthened Playwright async/await locator strategies.',
      'Implemented maintainable folder structures for enterprise teams.',
      'Generated professional HTML execution reports with video/trace capture.'
    ],
    thumbnailUrl: '/assets/screenshots/playwright/framework.png',
    demoUrl: 'https://youtube.com',
    githubUrl: 'https://github.com/Lingarajmb',
    hasHtmlReport: true,
    htmlReportUrl: '/assets/screenshots/playwright/index.html',
    isFeatured: true,
    sortOrder: 1,
    isPublished: true
  },
  {
    id: 'proj-ai-platform',
    slug: 'ai-platform',
    title: 'AI Platform Testing',
    tagLabel: 'CURRENT PROJECT',
    category: 'AI Platform',
    colorTheme: 'blue',
    shortDescription: 'Enterprise AI application validation covering Functional Testing, REST APIs, MongoDB data integrity, Playwright scripts, and Agile sprint execution.',
    overview: 'This project focuses on validating AI-powered enterprise applications used to automate business workflows and improve operational efficiency. My role involves validating user interfaces, REST APIs, backend MongoDB data, automation using Playwright, and participating in Agile sprint activities to ensure reliable software quality.',
    techStack: ['AI Platform', 'Manual Testing', 'API Testing', 'Playwright', 'MongoDB', 'JIRA', 'Agile', 'Git'],
    features: ['Manual Testing', 'API Validation', 'MongoDB Validation', 'Playwright Automation'],
    stats: [
      { label: 'Domain', value: 'AI Enterprise' },
      { label: 'Methodology', value: 'Agile / Scrum' },
      { label: 'API Validation', value: 'Postman' },
      { label: 'Database', value: 'MongoDB' }
    ],
    workflowSteps: [
      { stepNumber: 1, title: 'Requirements', description: 'Review AI user stories and acceptance criteria.', icon: 'fa-file-lines' },
      { stepNumber: 2, title: 'Test Design', description: 'Craft edge cases, scenarios, and test data matrices.', icon: 'fa-list-check' },
      { stepNumber: 3, title: 'Execution', description: 'Run manual explorations and Playwright automation runs.', icon: 'fa-code' },
      { stepNumber: 4, title: 'Validation', description: 'Perform deep API payload and MongoDB document verification.', icon: 'fa-database' },
      { stepNumber: 5, title: 'Release', description: 'Deliver sprint quality sign-off with detailed test reports.', icon: 'fa-rocket' }
    ],
    testScenarios: [
      { id: 'ai-1', title: 'AI Model Inference Response', description: 'Validate accurate response structure and fallback logic from AI services.', type: 'AI Validation', status: 'Passed' },
      { id: 'ai-2', title: 'MongoDB Data Persistence', description: 'Verify user prompt history, session tokens, and metadata are saved accurately.', type: 'Database', status: 'Passed' },
      { id: 'ai-3', title: 'API Rate Limiting & Auth', description: 'Verify bearer tokens, expiration, and throttling under load.', type: 'Security', status: 'Passed' },
      { id: 'ai-4', title: 'Playwright Regression Suite', description: 'End-to-end execution across login, prompt submission, and export flows.', type: 'Automation', status: 'Automated' }
    ],
    responsibilities: [
      { title: 'Manual Testing', description: 'Performed Functional, Regression, Smoke, and Sanity testing across AI platform modules.', icon: 'fa-desktop' },
      { title: 'API Validation', description: 'Validated REST APIs using Postman by verifying requests, responses, and business rules.', icon: 'fa-cloud' },
      { title: 'MongoDB Validation', description: 'Verified backend data integrity using MongoDB queries and document validation.', icon: 'fa-database' },
      { title: 'Playwright Automation', description: 'Developed and maintained Playwright automation scripts for regression testing.', icon: 'fa-code' }
    ],
    achievements: [
      { title: 'AI Workflow Validation', description: 'Validated AI-powered business workflows through rigorous functional and regression testing.' },
      { title: 'Backend Verification', description: 'Performed MongoDB validation to ensure accurate backend data processing.' },
      { title: 'Automation Support', description: 'Contributed Playwright automation scripts for repetitive regression scenarios.' },
      { title: 'API Quality', description: 'Verified REST API functionality, response payloads, status codes, and error handling.' }
    ],
    lessonsLearned: [
      'Strengthened testing knowledge for AI-driven enterprise applications.',
      'Improved Playwright automation framework development.',
      'Enhanced REST API validation using Postman collections.',
      'Gained practical experience with MongoDB backend verification.',
      'Worked effectively in Agile sprint execution and collaboration.',
      'Improved debugging, defect analysis, and root cause investigation.'
    ],
    thumbnailUrl: '/assets/screenshots/ai/ai-platform.png',
    demoUrl: 'https://spire.ai',
    githubUrl: 'https://github.com/Lingarajmb',
    isFeatured: true,
    sortOrder: 2,
    isPublished: true
  },
  {
    id: 'proj-sei-wealth',
    slug: 'sei-wealth',
    title: 'SEI Wealth Management Platform',
    tagLabel: 'ENTERPRISE QA PROJECT',
    category: 'Enterprise',
    colorTheme: 'green',
    shortDescription: 'Enterprise Wealth Management platform in Capital Markets: Trade Lifecycle processing, SQL verification, REST API testing, and Release Validation.',
    overview: 'Worked as a QA Engineer on an enterprise Wealth Management platform supporting Capital Markets, Trade Lifecycle processing, Application Modernization, API validation, SQL verification, regression testing, and release validation in Agile environments.',
    techStack: ['Capital Markets', 'Trade Lifecycle', 'SQL', 'Postman', 'API Testing', 'Regression', 'JIRA', 'Agile'],
    features: ['Trade Lifecycle', 'SQL Validation', 'API Testing', 'Release Validation'],
    stats: [
      { label: 'Domain', value: 'Capital Markets' },
      { label: 'Releases', value: '25+' },
      { label: 'Validation', value: 'SQL & APIs' },
      { label: 'Environment', value: 'Agile' }
    ],
    workflowSteps: [
      { stepNumber: 1, title: 'Trade Order Initiation', description: 'Capture investor trade details and securities selection.', icon: 'fa-file-invoice-dollar' },
      { stepNumber: 2, title: 'Validation & Compliance', description: 'Run business rule validation and fund balance checks.', icon: 'fa-shield-halved' },
      { stepNumber: 3, title: 'Execution & Routing', description: 'Route orders to market exchange simulators.', icon: 'fa-arrows-split-up-and-left' },
      { stepNumber: 4, title: 'Settlement Processing', description: 'Validate trade settlement and custody account adjustments.', icon: 'fa-coins' },
      { stepNumber: 5, title: 'Accounting & Reporting', description: 'Verify SQL database ledger, position balance, and client statements.', icon: 'fa-book' }
    ],
    testScenarios: [
      { id: 'sei-1', title: 'Equity Trade Order Entry', description: 'Validate market, limit, and stop order generation with appropriate fees.', type: 'Functional', status: 'Passed' },
      { id: 'sei-2', title: 'Database Balance Audit', description: 'Execute SQL queries across accounts to verify debits, credits, and ledger balance.', type: 'SQL Validation', status: 'Passed' },
      { id: 'sei-3', title: 'API Settlement Call', description: 'Verify REST endpoints for trade execution acknowledgments and settlement status.', type: 'API', status: 'Passed' },
      { id: 'sei-4', title: 'Regression Suite for Hotfixes', description: 'Execute full regression run before production deployment cutover.', type: 'Regression', status: 'Passed' }
    ],
    responsibilities: [
      { title: 'Functional & Regression Testing', description: 'Tested end-to-end trade workflows across multiple release cycles.', icon: 'fa-list-check' },
      { title: 'SQL Verification', description: 'Queried relational databases to verify data consistency post-transaction.', icon: 'fa-database' },
      { title: 'API Testing', description: 'Validated REST APIs in Postman for order transmission and trade status.', icon: 'fa-plug' },
      { title: 'Release Coordination', description: 'Supported staging smoke tests and production verification activities.', icon: 'fa-rocket' }
    ],
    achievements: [
      { title: 'Zero Critical Escapes', description: 'Delivered 25+ sprint releases with zero critical trade-processing defects.' },
      { title: 'SQL Query Library', description: 'Built an internal repository of 40+ verification queries reused across the QA team.' },
      { title: 'Capital Markets Domain Mastery', description: 'Deep domain expertise in trade lifecycle, settlement, and portfolio accounting.' }
    ],
    lessonsLearned: [
      'Gained deep understanding of financial services and trade processing rules.',
      'Mastered SQL data verification for high-value transactions.',
      'Enhanced Postman API testing and Newman automated collection runs.',
      'Developed strong regression planning and release smoke testing protocols.'
    ],
    thumbnailUrl: '/assets/screenshots/sei/dashboard.png',
    demoUrl: 'https://www.seic.com',
    githubUrl: 'https://github.com/Lingarajmb',
    isFeatured: true,
    sortOrder: 3,
    isPublished: true
  },
  {
    id: 'proj-api-testing',
    slug: 'api-testing',
    title: 'REST API Testing with Postman',
    tagLabel: 'API TESTING',
    category: 'API',
    colorTheme: 'orange',
    shortDescription: 'Comprehensive REST API test suite covering CRUD operations, authentication, JSON schema validation, Newman CLI reports, and Swagger contracts.',
    overview: 'Designed and executed REST API test cases using Postman to validate CRUD operations, status codes, headers, authentication, response payloads, and JSON schema validation. Configured Newman for command-line test execution and reporting.',
    techStack: ['Postman', 'REST API', 'JSON Schema', 'Swagger', 'Newman', 'JavaScript', 'HTTP Methods'],
    features: ['CRUD Operations', 'Authentication Validation', 'JSON Schema Assertions', 'Newman Automation'],
    stats: [
      { label: 'Tool', value: 'Postman' },
      { label: 'Runner', value: 'Newman' },
      { label: 'Formats', value: 'JSON / REST' },
      { label: 'Coverage', value: '100% CRUD' }
    ],
    workflowSteps: [
      { stepNumber: 1, title: 'Endpoint Discovery', description: 'Analyze Swagger / OpenAPI documentation and contracts.', icon: 'fa-book-open' },
      { stepNumber: 2, title: 'Collection Building', description: 'Organize requests with environment variables and pre-request scripts.', icon: 'fa-folder-tree' },
      { stepNumber: 3, title: 'Payload Validation', description: 'Test positive, negative, and edge request bodies.', icon: 'fa-file-code' },
      { stepNumber: 4, title: 'Assertion Scripts', description: 'Verify 200/201/400/404/500 status codes, response time, and schema.', icon: 'fa-vial' },
      { stepNumber: 5, title: 'Newman CLI Run', description: 'Automate collection execution and export HTML/CLI reports.', icon: 'fa-terminal' }
    ],
    testScenarios: [
      { id: 'api-1', title: 'GET All Records', description: 'Verify 200 OK, array response length, and pagination parameters.', type: 'GET', status: 'Passed' },
      { id: 'api-2', title: 'POST Create Resource', description: 'Validate 201 Created, auto-generated ID, and header verification.', type: 'POST', status: 'Passed' },
      { id: 'api-3', title: 'PUT / PATCH Update', description: 'Verify field mutation without side effects on unedited keys.', type: 'PUT', status: 'Passed' },
      { id: 'api-4', title: 'DELETE Resource', description: 'Verify 200/204 response and subsequent 404 on re-query.', type: 'DELETE', status: 'Passed' }
    ],
    responsibilities: [
      { title: 'Collection Architecture', description: 'Created parameterized Postman collections with environment variables.', icon: 'fa-folder' },
      { title: 'Scripting Assertions', description: 'Wrote Chai JavaScript assertions for schema and payload verification.', icon: 'fa-code' },
      { title: 'Newman Execution', description: 'Configured CLI runners for headless execution in local and CI environments.', icon: 'fa-play' },
      { title: 'Defect Logging', description: 'Logged API discrepancies with curl commands, request bodies, and responses.', icon: 'fa-bug' }
    ],
    achievements: [
      { title: '100% CRUD Coverage', description: 'Fully validated all create, read, update, and delete endpoints.' },
      { title: 'Automated Newman Reports', description: 'Generated HTML summary reports with execution pass rates.' },
      { title: 'Contract Governance', description: 'Ensured backend API implementation matched Swagger specifications.' }
    ],
    lessonsLearned: [
      'Gained deep proficiency in Postman JavaScript testing sandbox.',
      'Mastered JSON schema validation with Ajv.',
      'Automated API suites via Newman CLI.',
      'Implemented token-based authentication chaining.'
    ],
    thumbnailUrl: '/assets/screenshots/api/postman.png',
    demoUrl: 'https://youtube.com',
    githubUrl: 'https://github.com/Lingarajmb',
    isFeatured: true,
    sortOrder: 4,
    isPublished: true
  },
  {
    id: 'proj-mabl',
    slug: 'mabl-automation',
    title: 'Mabl Automation Testing',
    tagLabel: 'LOW-CODE AUTOMATION',
    category: 'Automation',
    colorTheme: 'blue',
    shortDescription: 'Automated end-to-end web testing using Mabl platform: reusable journeys, cloud execution, regression suites, and detailed analytics.',
    overview: 'Automated end-to-end web application testing using the Mabl platform by creating reusable journeys, executing regression suites, validating UI behavior, and analyzing cloud-based execution reports to improve software quality and release confidence.',
    techStack: ['Mabl', 'Cloud Execution', 'Low-Code Automation', 'Regression', 'UI Validation', 'Agile'],
    features: ['Reusable Journeys', 'Cloud Execution', 'Visual Testing', 'Automated Regression'],
    stats: [
      { label: 'Platform', value: 'Mabl Cloud' },
      { label: 'Type', value: 'End-to-End' },
      { label: 'Execution', value: 'Cloud Parallel' },
      { label: 'Maintenance', value: 'Auto-Healing' }
    ],
    workflowSteps: [
      { stepNumber: 1, title: 'Journey Recording', description: 'Record user interactions with smart element finders.', icon: 'fa-video' },
      { stepNumber: 2, title: 'Reusable Flows', description: 'Extract login and common steps into modular reusable components.', icon: 'fa-cube' },
      { stepNumber: 3, title: 'Data-Driven Tests', description: 'Attach data tables to test variable parameter sets.', icon: 'fa-table' },
      { stepNumber: 4, title: 'Cloud Execution', description: 'Run tests in parallel across Chrome, Firefox, and Safari cloud runners.', icon: 'fa-cloud' },
      { stepNumber: 5, title: 'Insights & Diagnostics', description: 'Review network activity, DOM changes, and auto-healing logs.', icon: 'fa-magnifying-glass-chart' }
    ],
    testScenarios: [
      { id: 'mabl-1', title: 'User Authentication Journey', description: 'Validate login with valid credentials, session storage, and profile icon display.', type: 'E2E', status: 'Passed' },
      { id: 'mabl-2', title: 'Navigation & Page Loading', description: 'Ensure all primary routes load without 4xx/5xx network errors.', type: 'Smoke', status: 'Passed' },
      { id: 'mabl-3', title: 'Form Submission Flow', description: 'Verify multi-step form entry, field validations, and confirmation alerts.', type: 'Functional', status: 'Passed' }
    ],
    responsibilities: [
      { title: 'Journey Authoring', description: 'Created and configured test journeys for core business flows.', icon: 'fa-pencil' },
      { title: 'Suite Maintenance', description: 'Monitored auto-healing element locators and updated test flows.', icon: 'fa-wrench' },
      { title: 'Reporting & Analysis', description: 'Extracted execution metrics for sprint quality reviews.', icon: 'fa-chart-pie' }
    ],
    achievements: [
      { title: 'Fast Regression Turnaround', description: 'Reduced manual smoke test execution time from 2 hours to 15 minutes.' },
      { title: 'Cross-Browser Stability', description: 'Executed parallel tests across modern desktop and mobile viewports.' }
    ],
    lessonsLearned: [
      'Understood strengths and best use-cases for intelligent low-code test automation.',
      'Learned to optimize reusable flows for maximum team collaboration.',
      'Gained experience with cloud-based test runners and auto-healing locators.'
    ],
    thumbnailUrl: '/assets/screenshots/mabl/dashboard.png',
    demoUrl: 'https://www.mabl.com',
    githubUrl: 'https://github.com/Lingarajmb',
    isFeatured: true,
    sortOrder: 5,
    isPublished: true
  }
];

export const initialCaseStudyFiles: CaseStudyFile[] = [
  // Playwright
  { id: 'f-pw-1', projectId: 'proj-playwright', title: 'Framework File Structure', fileType: 'image', url: '/assets/screenshots/playwright/framework.png', fileName: 'framework.png', fileSize: '480 KB', uploadedAt: '2026-01-10', sortOrder: 1 },
  { id: 'f-pw-2', projectId: 'proj-playwright', title: 'TodoMVC Application Under Test', fileType: 'image', url: '/assets/screenshots/playwright/application.png', fileName: 'application.png', fileSize: '320 KB', uploadedAt: '2026-01-10', sortOrder: 2 },
  { id: 'f-pw-3', projectId: 'proj-playwright', title: 'Terminal Test Execution', fileType: 'image', url: '/assets/screenshots/playwright/execution.png', fileName: 'execution.png', fileSize: '510 KB', uploadedAt: '2026-01-10', sortOrder: 3 },
  { id: 'f-pw-4', projectId: 'proj-playwright', title: 'Interactive HTML Report Overview', fileType: 'image', url: '/assets/screenshots/playwright/report.png', fileName: 'report.png', fileSize: '620 KB', uploadedAt: '2026-01-10', sortOrder: 4 },
  { id: 'f-pw-5', projectId: 'proj-playwright', title: 'Playwright Interactive HTML Test Report', fileType: 'report', url: '/assets/screenshots/playwright/index.html', fileName: 'index.html', fileSize: '1.2 MB', uploadedAt: '2026-01-10', sortOrder: 5 },
  // AI Platform
  { id: 'f-ai-1', projectId: 'proj-ai-platform', title: 'AI Platform Dashboard', fileType: 'image', url: '/assets/screenshots/ai/ai-platform.png', fileName: 'ai-platform.png', fileSize: '650 KB', uploadedAt: '2026-02-01', sortOrder: 1 },
  { id: 'f-ai-2', projectId: 'proj-ai-platform', title: 'REST API Validation', fileType: 'image', url: '/assets/screenshots/ai/api.png', fileName: 'api.png', fileSize: '420 KB', uploadedAt: '2026-02-01', sortOrder: 2 },
  { id: 'f-ai-3', projectId: 'proj-ai-platform', title: 'Test Execution Results', fileType: 'image', url: '/assets/screenshots/ai/execution.png', fileName: 'execution.png', fileSize: '480 KB', uploadedAt: '2026-02-01', sortOrder: 3 },
  { id: 'f-ai-4', projectId: 'proj-ai-platform', title: 'MongoDB Verification', fileType: 'image', url: '/assets/screenshots/ai/mongodb.png', fileName: 'mongodb.png', fileSize: '540 KB', uploadedAt: '2026-02-01', sortOrder: 4 },
  { id: 'f-ai-5', projectId: 'proj-ai-platform', title: 'AI Workflow Validation', fileType: 'image', url: '/assets/screenshots/ai/workflow.png', fileName: 'workflow.png', fileSize: '490 KB', uploadedAt: '2026-02-01', sortOrder: 5 },
  // SEI
  { id: 'f-sei-1', projectId: 'proj-sei-wealth', title: 'SEI Wealth Management Platform Dashboard', fileType: 'image', url: '/assets/screenshots/sei/dashboard.png', fileName: 'dashboard.png', fileSize: '710 KB', uploadedAt: '2025-11-20', sortOrder: 1 },
  // API
  { id: 'f-api-1', projectId: 'proj-api-testing', title: 'Postman Collection Overview', fileType: 'image', url: '/assets/screenshots/api/postman.png', fileName: 'postman.png', fileSize: '530 KB', uploadedAt: '2025-12-15', sortOrder: 1 },
  { id: 'f-api-2', projectId: 'proj-api-testing', title: 'API Endpoints Collection', fileType: 'image', url: '/assets/screenshots/api/collection.png', fileName: 'collection.png', fileSize: '490 KB', uploadedAt: '2025-12-15', sortOrder: 2 },
  { id: 'f-api-3', projectId: 'proj-api-testing', title: 'Header & Auth Validation', fileType: 'image', url: '/assets/screenshots/api/headers.png', fileName: 'headers.png', fileSize: '380 KB', uploadedAt: '2025-12-15', sortOrder: 3 },
  { id: 'f-api-4', projectId: 'proj-api-testing', title: 'Newman CLI Test Execution', fileType: 'image', url: '/assets/screenshots/api/newman.png', fileName: 'newman.png', fileSize: '620 KB', uploadedAt: '2025-12-15', sortOrder: 4 },
  { id: 'f-api-5', projectId: 'proj-api-testing', title: 'Response Payload & Status Validation', fileType: 'image', url: '/assets/screenshots/api/response.png', fileName: 'response.png', fileSize: '440 KB', uploadedAt: '2025-12-15', sortOrder: 5 },
  // Mabl
  { id: 'f-mabl-1', projectId: 'proj-mabl', title: 'Mabl Automation Dashboard', fileType: 'image', url: '/assets/screenshots/mabl/dashboard.png', fileName: 'dashboard.png', fileSize: '580 KB', uploadedAt: '2026-01-20', sortOrder: 1 },
  { id: 'f-mabl-2', projectId: 'proj-mabl', title: 'Mabl Test Execution Log', fileType: 'image', url: '/assets/screenshots/mabl/execution.png', fileName: 'execution.png', fileSize: '510 KB', uploadedAt: '2026-01-20', sortOrder: 2 },
  { id: 'f-mabl-3', projectId: 'proj-mabl', title: 'Execution History & Trends', fileType: 'image', url: '/assets/screenshots/mabl/history.png', fileName: 'history.png', fileSize: '460 KB', uploadedAt: '2026-01-20', sortOrder: 3 },
  { id: 'f-mabl-4', projectId: 'proj-mabl', title: 'Automated Journey Flow', fileType: 'image', url: '/assets/screenshots/mabl/journey.png', fileName: 'journey.png', fileSize: '490 KB', uploadedAt: '2026-01-20', sortOrder: 4 },
  { id: 'f-mabl-5', projectId: 'proj-mabl', title: 'Mabl Cloud Execution Report', fileType: 'image', url: '/assets/screenshots/mabl/report.png', fileName: 'report.png', fileSize: '630 KB', uploadedAt: '2026-01-20', sortOrder: 5 }
];

export const initialResumes: ResumeVersion[] = [
  {
    id: 'res-1',
    title: 'Lingaraj QA Automation Tester (Immediate Joiner)',
    fileName: 'Lingaraj_Belagali_Resume_QA_Immediate_Joiner.pdf',
    storagePath: 'resumes/Lingaraj_Belagali_Resume_QA_Immediate_Joiner.pdf',
    version: 'v2.0 (Immediate Joiner)',
    fileSize: '420 KB',
    isActive: true,
    uploadedAt: '2026-02-15',
    notes: 'Single source of truth resume: 3.8+ years QA automation experience, Spire.ai and TCS background, Electrical & Electronics Engineering (8.4 CGPA), immediate availability.'
  },
  {
    id: 'res-2',
    title: 'Lingaraj Belagali - QA Engineer Capital Markets Focus',
    fileName: 'Lingaraj_QA_Capital_Markets_SEI.pdf',
    storagePath: 'resumes/Lingaraj_QA_Capital_Markets_SEI.pdf',
    version: 'v1.9',
    fileSize: '390 KB',
    isActive: false,
    uploadedAt: '2025-11-10',
    notes: 'Previous version focusing primarily on SEI Wealth Management trade lifecycle and SQL validation.'
  }
];

export const initialContactInfo: ContactInfo = {
  email: 'lingarajmb1997@gmail.com',
  phone: '+91 8050478051',
  linkedInUrl: 'https://www.linkedin.com/in/lingarajmb',
  gitHubUrl: 'https://github.com/Lingarajmb',
  statusBadge: 'Immediate Joiner',
  roleHeadline: 'Software Tester II / QA Automation Engineer',
  availabilitySummary: 'Available for full-time QA Automation / SDET roles. Immediate Joiner with zero notice period. Experienced in Manual Testing, API Validation, Playwright Automation, SQL Verification, and MongoDB.',
  availabilityTags: ['Immediate Joiner', 'Full-Time', 'Manual QA', 'Playwright Automation', 'API Testing', 'SQL & MongoDB']
};

export const initialEducation: EducationItem[] = [
  {
    id: 'edu-1',
    degree: 'Bachelor of Engineering, Electrical and Electronics Engineering',
    institution: 'Tontadarya College of Engineering and Technology, Gadag',
    university: 'Visvesvaraya Technological University (VTU), Karnataka',
    year: '2018 – 2021',
    score: 'CGPA: 8.4'
  }
];

export const initialCertifications: CertificationItem[] = [
  {
    id: 'cert-1',
    name: 'Playwright Automation Masterclass',
    issuer: 'Quality Assurance Academy',
    issueDate: '2024',
    certificateUrl: 'https://github.com/Lingarajmb'
  },
  {
    id: 'cert-2',
    name: 'REST API Automation with Postman & Newman',
    issuer: 'Postman Certified Student Expert / QA Guild',
    issueDate: '2023'
  },
  {
    id: 'cert-3',
    name: 'SQL for Data Analysis & Database Testing',
    issuer: 'Tata Consultancy Services Competency Certification',
    issueDate: '2022'
  }
];

export const initialQAChecklist: QAChecklistItem[] = [
  { id: 'qa-1', category: 'Functional Testing', task: 'Home page loads successfully with hero and availability status', completed: true },
  { id: 'qa-2', category: 'Functional Testing', task: 'Logo redirects to Home section smoothly', completed: true },
  { id: 'qa-3', category: 'Functional Testing', task: 'Navigation links work correctly with smooth scrolling', completed: true },
  { id: 'qa-4', category: 'Functional Testing', task: 'Hero buttons work (Explore Work, Download Resume)', completed: true },
  { id: 'qa-5', category: 'Functional Testing', task: 'Resume downloads successfully with active resume version', completed: true },
  { id: 'qa-6', category: 'Functional Testing', task: 'View Demo and GitHub buttons open respective URLs in new tab', completed: true },
  { id: 'qa-7', category: 'Functional Testing', task: 'Project Details / Read Case Study opens detailed view with all tabs', completed: true },
  { id: 'qa-8', category: 'Functional Testing', task: 'Contact links (Email, Phone, LinkedIn, GitHub) open correct targets', completed: true },
  { id: 'qa-9', category: 'Functional Testing', task: 'Footer links and Back to Top work seamlessly', completed: true },
  { id: 'qa-10', category: 'UI Testing', task: 'All screenshots and profile pictures load with crisp resolution', completed: true },
  { id: 'qa-11', category: 'UI Testing', task: 'Floating tech badges animate with smooth float keyframes', completed: true },
  { id: 'qa-12', category: 'UI Testing', task: 'Dark / Light mode toggle switches theme without style glitches', completed: true },
  { id: 'qa-13', category: 'Responsive Testing', task: 'Responsive across Desktop, Laptop, Tablet, and Mobile viewports', completed: true },
  { id: 'qa-14', category: 'Admin & CMS', task: 'Admin login protected with authorized email lingarajmb1997@gmail.com', completed: true },
  { id: 'qa-15', category: 'Admin & CMS', task: 'Future Work Experience can be added, edited, published, and deleted', completed: true },
  { id: 'qa-16', category: 'Admin & CMS', task: 'Dynamic Case Studies can be created, edited, and published with unique slug', completed: true },
  { id: 'qa-17', category: 'Admin & CMS', task: 'Independent Resume Manager activates single active version for download', completed: true },
  { id: 'qa-18', category: 'Admin & CMS', task: 'Supabase integration ready with automated migration scripts and RLS', completed: true }
];
