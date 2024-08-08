from firebase_admin import firestore
from app.models.user import UserInDB, UserUpdate

db = firestore.client()

def create_user(user: UserInDB):
    user_ref = db.collection('users').document(user.uid)
    user_ref.set(user.dict())
    return user

def get_user(uid: str) -> UserInDB:
    user_ref = db.collection('users').document(uid)
    user_doc = user_ref.get()
    if user_doc.exists:
        return UserInDB(**user_doc.to_dict())
    return None

def update_user(uid: str, user_update: UserUpdate) -> UserInDB:
    user_ref = db.collection('users').document(uid)
    update_data = user_update.dict(exclude_unset=True)
    user_ref.update(update_data)
    updated_user_doc = user_ref.get()
    return UserInDB(**updated_user_doc.to_dict())