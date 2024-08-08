from fastapi import APIRouter, Depends
from app.core.security import get_current_user

router = APIRouter()

@router.get("/user")
async def get_user(current_user: dict = Depends(get_current_user)):
    return current_user