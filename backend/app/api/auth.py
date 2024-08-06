from fastapi import APIRouter, HTTPException, Depends
from firebase_admin import auth
from app.core.security import get_current_user

router = APIRouter()

@router.post("/login")
async def login(id_token: str):
    try:
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']
        # Here you would typically create a session or JWT
        return {"uid": uid, "message": "Logged in successfully"}
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

@router.post("/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    # Implement logout logic (e.g., invalidate session)
    return {"message": "Logged out successfully"}