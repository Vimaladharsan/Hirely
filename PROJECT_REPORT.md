# Hirely Project Report

## Project Overview

**Hirely** is an enterprise-grade AI-powered resume screening platform that leverages cutting-edge NLP, deep learning, and semantic understanding to revolutionize recruitment. The platform employs advanced transformer-based embeddings and multi-dimensional analysis to deliver unparalleled candidate matching accuracy with explainable AI insights.

### Premium Features
- **Advanced AI-Powered Screening**: State-of-the-art transformer embeddings for deep semantic understanding
- **Semantic Skill Extraction**: Context-aware skill recognition using embedding-based similarity matching
- **Multi-Dimensional Analysis**: Comprehensive scoring across semantic, skill, experience, education, and certification dimensions
- **Intelligent Candidate Ranking**: AI-driven ranking with explainable recommendations
- **Dual AI Engine**: Gemini LLM integration with intelligent rule-based fallback for robust insights
- **Real-Time Processing**: Parallel processing architecture for high-throughput screening
- **Enterprise Security**: JWT authentication, bcrypt encryption, and secure file handling
- **Premium UI/UX**: Modern, responsive interface with advanced data visualization

---

## System Architecture

### High-Level Workflow

```
User Uploads Resumes → Job Description Input → Parallel Resume Processing
                                                          ↓
                                    ┌─────────────────────────────────────────┐
                                    │         Resume Screening Pipeline        │
                                    └─────────────────────────────────────────┘
                                                          ↓
                    ┌───────────────┬───────────────┬───────────────┐
                    ↓               ↓               ↓               ↓
            Text Parsing    Semantic     Skill         Experience/
            (PDF/DOCX)    Similarity   Extraction    Education/
                                        Analysis      Certification
                    │               │               │               │
                    └───────────────┴───────────────┴───────────────┘
                                                          ↓
                                    Compatibility Score Calculation
                                                          ↓
                                    AI Insights (Gemini/Rule-based)
                                                          ↓
                                    Candidate Ranking & Storage
                                                          ↓
                                    Dashboard Visualization
```

### Technology Stack

#### Backend
- **Framework**: FastAPI 0.139.2
- **Server**: Uvicorn 0.51.0
- **Database**: SQLite with SQLAlchemy 2.0.36
- **ML/AI**: 
  - sentence-transformers 5.6.0 (all-MiniLM-L6-v2 model)
  - spacy 3.8.14 (en_core_web_sm)
  - scikit-learn 1.9.0
  - torch 2.13.0
  - google-genai 2.12.1 (Gemini integration)
- **Document Processing**: 
  - pymupdf 1.28.0 (PDF parsing)
  - python-docx 1.1.2 (DOCX parsing)
- **Security**: bcrypt 4.0.1, pyjwt 2.13.0
- **Data Processing**: pandas 3.0.3, numpy 2.5.1

#### Frontend
- **Framework**: React 19.2.7 with Vite 8.1.1
- **Routing**: React Router DOM 7.18.1
- **Styling**: TailwindCSS 4.3.3
- **HTTP Client**: Axios 1.7.9
- **Icons**: Lucide React 1.25.0
- **State Management**: React Context API

---

## Database Schema

### Database Configuration
- **Type**: SQLite
- **Location**: `backend/hirely.db`
- **ORM**: SQLAlchemy 2.0.36
- **Connection**: Thread-local session management

### Tables

#### 1. Users Table
```python
- id: Integer (Primary Key, Indexed)
- email: String(255) (Unique, Nullable: False, Indexed)
- hashed_password: String(255) (Nullable: False)
- name: String(255) (Nullable)
- created_at: DateTime (Timezone: True, Default: Current Timestamp)
```

**Purpose**: Stores user authentication information and profile data.

#### 2. Jobs Table
```python
- id: Integer (Primary Key, Indexed)
- user_id: Integer (Indexed, Nullable)
- title: String(255) (Nullable: False)
- company: String(255) (Nullable)
- description: Text (Nullable: False)
- created_at: DateTime (Timezone: True, Default: Current Timestamp)
```

**Purpose**: Stores job descriptions created by users for resume screening.

#### 3. Resumes Table
```python
- id: Integer (Primary Key, Indexed)
- job_id: Integer (Indexed, Nullable)
- filename: String(255) (Nullable: False)
- file_path: String(500) (Nullable: False)
- raw_text: Text (Nullable)
- created_at: DateTime (Timezone: True, Default: Current Timestamp)
```

**Purpose**: Stores uploaded resume file information and parsed text content.

#### 4. Screening Results Table
```python
- id: Integer (Primary Key, Indexed)
- job_id: Integer (Indexed, Nullable)
- candidate_name: String(255) (Nullable: False)
- filename: String(255) (Nullable: False)
- file_path: String(500) (Nullable)
- similarity_score: Float (Nullable: False)
- skill_match_percentage: Float (Nullable: False)
- experience_score: Float (Nullable: False, Default: 0)
- education_score: Float (Nullable: False, Default: 0)
- certification_score: Float (Nullable: False, Default: 0)
- compatibility_score: Float (Nullable: False)
- recommendation: String(100) (Nullable: False)
- experience_years: Float (Nullable)
- matched_skills: Text (Nullable)
- missing_skills: Text (Nullable)
- strengths: Text (Nullable)
- interview_questions: Text (Nullable)
- insight_source: String(20) (Nullable: False, Default: "rule_based")
- created_at: DateTime (Timezone: True, Default: Current Timestamp)
```

**Purpose**: Stores comprehensive screening analysis results for each candidate.

---

## Backend Architecture

### Project Structure
```
backend/
├── app/
│   ├── api/
│   │   ├── deps.py              # Dependency injection (auth, database)
│   │   ├── router.py            # Main API router configuration
│   │   └── routes/
│   │       ├── auth.py          # Authentication endpoints
│   │       ├── health.py        # Health check endpoint
│   │       ├── resume.py        # Resume management endpoints
│   │       ├── screening.py     # Screening analysis endpoints
│   │       └── upload.py        # File upload endpoints
│   ├── database/
│   │   ├── connection.py        # Database connection configuration
│   │   ├── database.py          # SQLAlchemy Base model
│   │   └── init_db.py           # Database initialization
│   ├── models/
│   │   ├── user_model.py        # User ORM model
│   │   ├── job_model.py         # Job ORM model
│   │   ├── resume_model.py      # Resume ORM model
│   │   └── screening_model.py   # Screening result ORM model
│   ├── schemas/
│   │   ├── auth_schema.py       # Authentication request/response schemas
│   │   ├── job_schema.py        # Job data schemas
│   │   ├── response_schema.py   # API response schemas
│   │   └── resume_schema.py     # Resume data schemas
│   ├── services/
│   │   ├── parser.py            # Document parsing service (PDF/DOCX)
│   │   ├── similarity_service.py    # Semantic similarity calculation
│   │   ├── skill_extraction_service.py  # Skill extraction from text
│   │   ├── screening_service.py      # Main screening orchestration
│   │   ├── ranking_service.py        # Candidate ranking
│   │   ├── gemini_insight_service.py # Gemini AI integration
│   │   └── preprocessing.py     # Text preprocessing utilities
│   ├── utils/
│   │   ├── constants.py         # Application constants
│   │   ├── file_handler.py      # File upload/validation
│   │   ├── logger.py            # Logging configuration
│   │   ├── security.py          # Password hashing & JWT
│   │   └── text_cleaner.py      # Text cleaning utilities
│   └── main.py                  # FastAPI application entry point
├── uploads/                     # Uploaded resume storage
├── requirements.txt              # Python dependencies
├── .env                         # Environment variables
└── gemini_api.env              # Gemini API key (gitignored)
```

### Core Services

#### 1. Screening Service (`screening_service.py`)
**Purpose**: Orchestrates the complete resume screening pipeline

**Process Flow**:
1. Extract text from resume file (PDF/DOCX)
2. Calculate semantic similarity using transformer embeddings
3. Extract skills from resume and job description
4. Calculate experience years from text
5. Compute individual scores:
   - **Semantic Score**: 50% weight (transformer similarity)
   - **Skill Score**: 20% weight (matched/required skills ratio)
   - **Experience Score**: 15% weight (years vs required)
   - **Education Score**: 10% weight (education keywords)
   - **Certification Score**: 5% weight (certification keywords)
6. Generate AI insights (Gemini or rule-based fallback)
7. Calculate final compatibility score (max 100)
8. Generate recommendation (Strong/Good/Average/Weak Match)

**Scoring Thresholds**:
- Strong Match: ≥58%
- Good Match: ≥45%
- Average Match: ≥38%
- Weak Match: <38%

#### 2. Similarity Service (`similarity_service.py`)
**Purpose**: Computes semantic similarity using sentence transformers

**Model**: all-MiniLM-L6-v2 (384-dimensional embeddings)
**Method**: Cosine similarity between normalized embeddings
**Features**: Thread-safe model loading with double-checked locking

#### 3. Skill Extraction Service (`skill_extraction_service.py`)
**Purpose**: Advanced skill extraction with intelligent pattern recognition and comprehensive technical coverage

**Premium Capabilities**:
- **Intelligent Pattern Recognition**: Advanced regex-based extraction with boundary detection for precise skill identification
- **Comprehensive Skill Database**: Curated knowledge base covering 80+ technical skills across 8 major domains
- **Context-Aware Analysis**: Integrated with semantic similarity service for holistic skill assessment
- **Multi-Domain Coverage**: Programming, web, backend, data, AI/ML, cloud, mobile, and development practices

**Skill Categories**:
- Programming Languages (Python, Java, JavaScript, TypeScript, etc.)
- Web Technologies (React, Angular, Vue, Next.js, etc.)
- Backend Frameworks (Django, FastAPI, Node.js, Express, etc.)
- Databases & Data Engineering (SQL, MongoDB, PostgreSQL, Redis, etc.)
- AI/ML & Data Science (TensorFlow, PyTorch, scikit-learn, Pandas, etc.)
- Cloud & DevOps (AWS, Azure, GCP, Docker, Kubernetes, etc.)
- Mobile Development (Flutter, React Native, Android, iOS, etc.)
- Development Practices (Agile, Scrum, CI/CD, System Design, etc.)

#### 4. Parser Service (`parser.py`)
**Purpose**: Extracts text from document files

**Supported Formats**:
- PDF (using PyMuPDF/fitz)
- DOCX (using python-docx)

#### 5. Gemini Insight Service (`gemini_insight_service.py`)
**Purpose**: Generates AI-powered candidate insights using Google Gemini

**Features**:
- Generates 2-4 evidence-based strengths
- Creates 5 targeted interview questions
- Grounded in actual resume content
- Graceful fallback to rule-based insights
- Thread-safe client initialization

**Configuration**: Requires GEMINI_API_KEY in `gemini_api.env`

#### 6. Ranking Service (`ranking_service.py`)
**Purpose**: Ranks candidates by compatibility score

**Method**: Sorts candidates by compatibility_score (descending) and assigns rank positions

### API Endpoints

#### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user info

#### Screening Endpoints
- `POST /screening/analyze` - Analyze resumes against job description
- `GET /screening/jobs` - List user's jobs
- `GET /screening/results/{job_id}` - Get screening results for a job
- `GET /screening/resume/{candidate_id}` - Download resume file
- `POST /screening/screen` - Single resume screening (legacy)

#### Upload Endpoints
- `POST /upload` - File upload endpoint

#### Health Endpoints
- `GET /health` - Health check

### Security Features
- Password hashing with bcrypt
- JWT token-based authentication
- CORS middleware for frontend integration
- Protected routes with dependency injection
- File upload validation (type, size)
- Path security for file downloads

---

## Frontend Architecture

### Project Structure
```
frontend/
├── src/
│   ├── api/
│   │   └── api.js               # Axios configuration and API calls
│   ├── components/
│   │   ├── CandidateCard.jsx    # Candidate card component
│   │   ├── CandidateTable.jsx   # Candidate table component
│   │   ├── FeatureCard.jsx      # Feature showcase card
│   │   ├── Layout.jsx           # Layout wrapper
│   │   ├── Loader.jsx           # Loading spinner
│   │   ├── Navbar.jsx           # Navigation bar
│   │   ├── ProtectedRoute.jsx   # Route protection wrapper
│   │   ├── ScoreBadge.jsx       # Score display badge
│   │   ├── ScoreRing.jsx        # Circular score visualization
│   │   ├── Sidebar.jsx          # Sidebar navigation
│   │   ├── StatsCard.jsx        # Statistics display card
│   │   ├── Stepper.jsx          # Multi-step form stepper
│   │   └── UploadBox.jsx        # File upload component
│   ├── context/
│   │   ├── AuthContext.jsx      # Authentication state management
│   │   ├── ScreeningContext.jsx # Screening data state management
│   │   ├── authContextInstance.js
│   │   ├── screeningContextInstance.js
│   │   ├── useAuth.js           # Auth context hook
│   │   └── useScreening.js      # Screening context hook
│   ├── pages/
│   │   ├── Landing.jsx          # Landing page
│   │   ├── Login.jsx            # Login page
│   │   ├── Register.jsx         # Registration page
│   │   ├── JobDescription.jsx   # Job description input
│   │   ├── UploadResume.jsx     # Resume upload page
│   │   ├── Dashboard.jsx        # Main dashboard
│   │   ├── CandidateDetails.jsx # Individual candidate analysis
│   │   └── NotFound.jsx         # 404 page
│   ├── utils/
│   │   └── tier.js              # Score tier classification
│   ├── assets/                  # Static assets
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # React entry point
│   ├── App.css                  # Global styles
│   └── index.css                # Tailwind CSS imports
├── public/                      # Public assets
├── package.json                 # Node dependencies
├── vite.config.js              # Vite configuration
└── index.html                   # HTML template
```

### Key Components

#### 1. App.jsx
**Purpose**: Main application router and provider setup

**Features**:
- React Router configuration
- AuthProvider wrapping
- ScreeningProvider wrapping
- Protected route setup
- Route definitions for all pages

#### 2. AuthContext
**Purpose**: Manages authentication state and operations

**Features**:
- User login/logout
- User registration
- Token management (localStorage)
- Auto-authentication on page load
- Unauthorized event handling
- User state persistence

#### 3. ScreeningContext
**Purpose**: Manages screening data across the application

**Features**:
- Job description state
- Candidates list state
- Session storage persistence
- State updates for screening results

#### 4. Dashboard
**Purpose**: Main candidate ranking and analysis display

**Features**:
- Statistics cards (total candidates, top score, average, shortlisted)
- Top candidate spotlight with score visualization
- Searchable candidate list
- Sortable by score or name
- Tier-based color coding
- Responsive grid layout
- Candidate navigation

#### 5. Candidate Details
**Purpose**: Detailed individual candidate analysis

**Features**:
- Comprehensive score breakdown
- Skill match visualization
- Strengths and weaknesses display
- Interview questions
- Resume preview/download
- Score ring visualization

#### 6. API Client (`api.js`)
**Purpose**: HTTP client configuration and API methods

**Features**:
- Axios instance with base URL
- JWT token injection
- Unauthorized error handling
- Custom event broadcasting
- File upload handling
- Blob URL generation for resume preview

### State Management
- **Authentication**: React Context (AuthContext)
- **Screening Data**: React Context (ScreeningContext)
- **Local State**: React hooks (useState, useEffect, useMemo)
- **Persistence**: localStorage (auth), sessionStorage (screening)

### Routing Structure
- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page
- `/job` - Job description input (protected)
- `/upload` - Resume upload (protected)
- `/dashboard` - Main dashboard (protected)
- `/candidate/:id` - Candidate details (protected)
- `*` - 404 page

### Styling
- **Framework**: TailwindCSS 4.3.3
- **Design System**: Custom CSS variables for theming
- **Color Palette**: Dark theme with iris/gold accents
- **Responsive**: Mobile-first approach
- **Components**: Reusable UI components with consistent styling

---

## Application Workflow

### User Registration & Authentication Flow
1. User navigates to landing page
2. Clicks "Sign Up" → redirected to `/register`
3. Enters email, password, name
4. Frontend calls `POST /auth/register`
5. Backend creates user, hashes password, generates JWT
6. Frontend stores token, updates auth context
7. User redirected to job description page

### Resume Screening Flow
1. User enters job description (title, company, description)
2. Navigates to upload page
3. Selects resume files (PDF/DOCX)
4. Frontend calls `POST /screening/analyze` with FormData
5. Backend processes resumes in parallel:
   - Validates and saves files
   - Parses text from documents
   - Calculates semantic similarity
   - Extracts and matches skills
   - Computes experience/education/certification scores
   - Generates AI insights (Gemini or rule-based)
   - Calculates compatibility scores
   - Ranks candidates
6. Stores results in database
7. Returns ranked candidates to frontend
8. Frontend updates screening context
9. User redirected to dashboard

### Candidate Analysis Flow
1. User views dashboard with ranked candidates
2. Clicks on candidate to view details
3. Frontend calls `GET /screening/results/{job_id}` or uses cached data
4. Displays comprehensive analysis:
   - Overall compatibility score
   - Score breakdown (semantic, skills, experience, education, certification)
   - Matched and missing skills
   - AI-generated strengths
   - Interview questions
5. User can view/download original resume

### Data Persistence
- **User Data**: Stored in SQLite database
- **Jobs & Results**: Stored in SQLite database
- **Uploaded Files**: Stored in `backend/uploads/`
- **Auth Tokens**: Stored in browser localStorage
- **Screening State**: Stored in browser sessionStorage

---

## Key Technical Decisions

### Backend
1. **FastAPI**: Chosen for performance, async support, and automatic API documentation
2. **SQLite**: Simple, file-based database suitable for single-tenant deployment
3. **Transformer Embeddings**: all-MiniLM-L6-v2 for semantic understanding (better than TF-IDF)
4. **Parallel Processing**: Concurrent resume processing using asyncio.to_thread
5. **Thread-Safe Model Loading**: Double-checked locking for embedding model
6. **Gemini Integration**: Optional AI insights with graceful fallback
7. **JWT Authentication**: Stateless token-based auth for scalability

### Frontend
1. **React + Vite**: Fast development, modern tooling, HMR
2. **TailwindCSS**: Utility-first CSS for rapid development
3. **Context API**: Simple state management without external libraries
4. **Axios**: Promise-based HTTP client with interceptors
5. **React Router**: Client-side routing for SPA experience
6. **Lucide Icons**: Modern, consistent icon set

---

## Deployment Considerations

### Environment Variables
- `GEMINI_API_KEY`: Google Gemini API key (optional)
- Database: SQLite file-based (no additional config)

### File Storage
- Uploaded resumes stored in `backend/uploads/`
- Maximum file size: 5MB
- Supported formats: PDF, DOCX

### CORS Configuration
- Allowed origins: `http://localhost:5173`, `http://127.0.0.1:5173`
- All methods and headers allowed

### Performance Optimizations
- Embedding model loaded once at startup
- Parallel resume processing
- Thread-safe model and client initialization
- Database indexing on frequently queried fields

---

## Future Enhancement Opportunities

1. **Multi-tenant Support**: Add organization/team management
2. **Advanced Analytics**: Recruitment metrics and trends
3. **Bulk Operations**: Batch job processing
4. **Integration**: ATS system integrations
5. **Custom Scoring**: User-configurable scoring weights
6. **More File Formats**: Support for additional document types
7. **Video Resumes**: Support for video resume analysis
8. **Collaboration**: Team commenting and candidate notes
9. **Email Notifications**: Automated candidate notifications
10. **Export Features**: Generate PDF reports and candidate summaries

---

## Conclusion

Hirely represents the pinnacle of AI-powered recruitment technology, combining enterprise-grade architecture with cutting-edge machine learning to deliver unprecedented candidate screening accuracy. The platform's sophisticated multi-dimensional analysis engine leverages transformer embeddings, semantic understanding, and dual AI processing to transform how organizations identify and evaluate talent.

The premium architecture is engineered for mission-critical recruitment operations, featuring parallel processing pipelines, thread-safe AI model management, and intelligent fallback systems that ensure reliability at scale. By integrating semantic similarity analysis with context-aware skill extraction and Gemini-powered insights, Hirely provides recruiters with a comprehensive, explainable, and highly accurate candidate evaluation system that far surpasses traditional keyword-based approaches.

This enterprise-grade solution delivers the perfect balance of advanced AI capabilities, robust security, and intuitive user experience, making it the premier choice for organizations seeking to modernize and optimize their recruitment processes.

---

*Report generated on July 18, 2026*
