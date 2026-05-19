my_fastapi_project/
│
├── app/                        # Main application package
│   ├── __init__.py             # Makes app a Python module
│   ├── main.py                 # App initialization and entry point
│   ├── config.py               # Environment variables and settings
│   │
│   ├── api/                    # API routers (v1, v2, etc.)
│   │   ├── __init__.py
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── api.py          # Includes all sub-routers
│   │       └── endpoints/      # Route controllers
│   │           ├── auth.py
│   │           └── users.py
│   │
│   ├── core/                   # Security and global configurations
│   │   ├── database.py         # DB connection and session setup
│   │   └── security.py         # Password hashing and JWT tokens
│   │
│   ├── models/                 # SQLAlchemy DB models (Data layer)
│   │   ├── __init__.py
│   │   └── user.py
│   │
│   ├── schemas/                # Pydantic schemas (Validation layer)
│   │   ├── __init__.py
│   │   └── user.py
│   │
│   └── services/               # Business logic layer
│       └── user_service.py
│
├── requirements.txt            # Project dependencies
└── .env                        # Private environment variables

# frontend setup cd frontend
npm install
npm run dev

# password pass12345


# Project Structure:
my_fastapi_project/
│
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── config.py
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── api.py
│   │       └── endpoints/
│   │           ├── auth.py
│   │           ├── users.py
│   │           ├── prediction.py
│   │           ├── training.py
│   │           └── analytics.py
│   │
│   ├── core/
│   │   ├── database.py
│   │   ├── security.py
│   │   └── ml_pipeline.py
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── student.py
│   │   └── prediction.py
│   │
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── student.py
│   │   └── prediction.py
│   │
│   ├── services/
│   │   ├── user_service.py
│   │   ├── prediction_service.py
│   │   └── ml_service.py
│   │
│   ├── ml_models/
│   │   ├── __init__.py
│   │   ├── data_processor.py
│   │   ├── student_performance.py
│   │   ├── model_trainer.py
│   │   └── saved_models/
│   │       └── .gitkeep
│   │
│   └── utils/
│       ├── __init__.py
│       └── validators.py
│
├── frontend/
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── api.js
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   ├── Dashboard/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── StatsCard.jsx
│   │   │   │   └── Charts.jsx
│   │   │   ├── Prediction/
│   │   │   │   ├── PredictionForm.jsx
│   │   │   │   ├── PredictionResult.jsx
│   │   │   │   └── FeatureImportance.jsx
│   │   │   ├── Training/
│   │   │   │   ├── ModelTraining.jsx
│   │   │   │   └── TrainingHistory.jsx
│   │   │   └── Common/
│   │   │       ├── LoadingSpinner.jsx
│   │   │       └── ErrorBoundary.jsx
│   │   └── pages/
│   │       ├── Login.jsx
│   │       ├── Register.jsx
│   │       ├── DashboardPage.jsx
│   │       ├── PredictPage.jsx
│   │       ├── TrainingPage.jsx
│   │       └── AnalyticsPage.jsx
│   └── public/
│       └── vite.svg
│
├── requirements.txt
├── .env
├── .gitignore
└── README.md



# Student Performance Predictor

An enterprise-grade machine learning system for predicting student academic performance with FastAPI backend and React frontend.

## 🚀 Features

- 🤖 **Machine Learning Models**: Random Forest, Gradient Boosting, XGBoost
- 📊 **Real-time Predictions**: Predict student scores based on multiple factors
- 📈 **Analytics Dashboard**: Visualize trends and insights
- 🔐 **Authentication**: JWT-based secure authentication
- 🎨 **Modern UI**: Responsive design with dark mode
- 📱 **Mobile Ready**: Fully responsive frontend
- 🔄 **Batch Predictions**: Process multiple students at once
- 📚 **Training History**: Track model performance over time

## 📋 Prerequisites

- Python 3.9+
- Node.js 18+
- SQLite (default) or PostgreSQL

## 🛠️ Installation

### Backend Setup

```bash
# Clone the repository
cd my_fastapi_project

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload --port 8000