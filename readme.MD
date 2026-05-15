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


# password pass12345