from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, chat, user

app = FastAPI(title="Linkaura API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(chat.router)
app.include_router(user.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Linkaura API"}