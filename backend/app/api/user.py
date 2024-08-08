from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import get_current_user
from app.models.user import UserCreate, UserUpdate, UserResponse, UserInDB
from app.db.user_operations import create_user, get_user, update_user
from firebase_admin import auth

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user_create: UserCreate):
    try:
        # Create the user in Firebase Authentication
        firebase_user = auth.create_user(
            email=user_create.email,
            password=user_create.password
        )
        
        # Now use the Firebase UID to create the user in your database
        new_user = create_user(UserInDB(
            uid=firebase_user.uid,
            email=user_create.email,
            display_name=user_create.display_name
        ))
        return UserResponse(**new_user.dict())
    except auth.EmailAlreadyExistsError:
        raise HTTPException(status_code=400, detail="Email already registered")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    user = get_user(current_user['uid'])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(**user.dict())

@router.put("/me", response_model=UserResponse)
async def update_user_me(user_update: UserUpdate, current_user: dict = Depends(get_current_user)):
    updated_user = update_user(current_user['uid'], user_update)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(**updated_user.dict())