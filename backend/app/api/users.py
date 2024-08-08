from fastapi import APIRouter, Depends
from app.core.security import get_current_user

router = APIRouter()

@router.get("/me")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user

@router.put("/me")
async def update_user_me(user_update: dict, current_user: dict = Depends(get_current_user)):
    # Implement user update logic
    return {"message": "User updated successfully"}