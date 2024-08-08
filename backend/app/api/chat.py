from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
from pydantic import BaseModel
from app.core.security import get_current_user
from app.db.firebase import db
from app.services.llm import generate_response
from firebase_admin import firestore
import json

router = APIRouter()

class RoomCreate(BaseModel):
    name: str

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict = {}

    async def connect(self, websocket: WebSocket, room_id: str):
        await websocket.accept()
        if room_id not in self.active_connections:
            self.active_connections[room_id] = []
        self.active_connections[room_id].append(websocket)

    def disconnect(self, websocket: WebSocket, room_id: str):
        if room_id in self.active_connections:
            self.active_connections[room_id].remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str, room_id: str):
        if room_id in self.active_connections:
            for connection in self.active_connections[room_id]:
                await connection.send_text(message)

manager = ConnectionManager()

@router.websocket("/chat/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    await manager.connect(websocket, room_id)
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # Store message in Firestore
            doc_ref = db.collection('rooms').document(room_id).collection('messages').add({
                'user_id': message_data['user_id'],
                'content': message_data['content'],
                'timestamp': firestore.SERVER_TIMESTAMP
            })

            # Check if AI assistance is requested
            if message_data.get('request_ai', False):
                ai_response = await generate_response(message_data['content'])
                ai_message = json.dumps({
                    'user_id': 'AI',
                    'content': ai_response,
                    'timestamp': firestore.SERVER_TIMESTAMP
                })
                await manager.broadcast(ai_message, room_id)

            # Broadcast the message to all users in the room
            await manager.broadcast(data, room_id)
    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id)
        await manager.broadcast(json.dumps({"user_id": "system", "content": "A user has left the chat"}), room_id)
    except Exception as e:
        print(f"Error in WebSocket connection: {str(e)}")
        manager.disconnect(websocket, room_id)

@router.post("/create_room")
async def create_room(room: RoomCreate, current_user: dict = Depends(get_current_user)):
    try:
        room_ref = db.collection('rooms').add({
            'name': room.name,
            'created_by': current_user['uid'],
            'created_at': firestore.SERVER_TIMESTAMP
        })
        return {"room_id": room_ref[1].id, "message": "Room created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create room: {str(e)}")

@router.get("/rooms")
async def get_rooms(current_user: dict = Depends(get_current_user)):
    try:
        rooms = db.collection('rooms').stream()
        return [{"id": room.id, "name": room.to_dict()['name']} for room in rooms]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch rooms: {str(e)}")

@router.get("/chat/room/{room_id}/messages")
async def get_room_messages(room_id: str, current_user: dict = Depends(get_current_user)):
    try:
        messages = db.collection('rooms').document(room_id).collection('messages').order_by('timestamp').limit(50).stream()
        return [message.to_dict() for message in messages]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch messages: {str(e)}")