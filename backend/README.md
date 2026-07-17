# Hirely Backend

Backend API for the Hirely application.

## Directory Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── routes/      # API route handlers
│   │   └── router.py    # Main router configuration
│   ├── services/        # Business logic services
│   ├── models/          # Database models
│   ├── schemas/         # Pydantic schemas
│   ├── database/        # Database configuration
│   ├── utils/           # Utility functions
│   ├── core/            # Core configuration
│   └── main.py          # Application entry point
├── uploads/             # File upload directory
├── parsed/              # Parsed resume storage
├── requirements.txt     # Python dependencies
├── .env                 # Environment variables
└── README.md            # This file
```

## Installation

Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Application

```bash
python app/main.py
```
