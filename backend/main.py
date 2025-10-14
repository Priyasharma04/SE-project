from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from auth import create_access_token, verify_token, hash_password, verify_password
from models import UserOut, Token
from database import users_db, uploads_db, save_users, chats_db, save_chats
from pipeline import process_paper
from pydantic import BaseModel
from typing import List, Optional
import os, shutil
import time
app = FastAPI()

# Log loaded users on startup
print(f"Loaded {len(users_db)} users from database")
if users_db:
    print(f"Users: {list(users_db.keys())}")

origins = [
    "http://localhost:5173",
    "http://localhost:8080",
    "http://localhost:3000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.get("/")
def root():
    return {"message": "FastAPI backend running successfully!"}
def get_current_user(authorization: str = Header(...)):
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid auth scheme")
    except:
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    username = verify_token(token)
    if not username:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return username

@app.post("/signup", response_model=UserOut)
def signup(username: str = Form(...), email: str = Form(...), password: str = Form(...)):
    try:
        print(f"Signup attempt - Username: {username}, Email: {email}")
        if username in users_db:
            print(f"User already exists: {username}")
            raise HTTPException(status_code=400, detail="User already exists")
        if len(password) < 8 or not any(c.isupper() for c in password) or not any(c.isdigit() for c in password):
            print(f"Password validation failed for user: {username}")
            raise HTTPException(
                status_code=400,
                detail="Password must be at least 8 characters, include 1 uppercase and 1 number."
            )
        
        password_hash = hash_password(password)
        users_db[username] = {"email": email, "password": password_hash, "files": []}
        save_users(users_db)  # Persist to file
        print(f"User created successfully: {username}")
        try:
            os.makedirs(os.path.join(UPLOAD_FOLDER, username), exist_ok=True)
            print(f"User folder created: {username}")
        except Exception as e:
            print(f"Failed to create user folder: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to create user folder: {str(e)}")
        return {"username": username, "email": email}
    except HTTPException as e:
        print(f"HTTPException in signup: {e.detail}")
        raise e
    except Exception as e:
        print(f"Unexpected error in signup: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@app.post("/login", response_model=Token)
def login(username: str = Form(...), password: str = Form(...)):
    try:
        print(f"Login attempt - Username: {username}")
        user = users_db.get(username)
        if not user:
            print(f"User not found: {username}")
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        print(f"User found, verifying password...")
        print(f"Stored hash: {user['password'][:50]}...")
        
        password_valid = verify_password(password, user["password"])
        print(f"Password verification result: {password_valid}")
        
        if not password_valid:
            print(f"Password verification failed for user: {username}")
            raise HTTPException(status_code=401, detail="Invalid credentials")

        token = create_access_token({"sub": username})
        print(f"Login successful for user: {username}")
        return {"access_token": token, "token_type": "bearer"}

    except HTTPException as e:
        print(f"HTTPException in login: {e.detail}")
        raise e
    except Exception as e:
        print(f"Unexpected error in login: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...), current_user: str = Depends(get_current_user)):
    try:
        user_folder = os.path.join(UPLOAD_FOLDER, current_user)
        filepath = os.path.join(user_folder, file.filename)
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        result = process_paper(filepath)
        users_db[current_user]["files"].append(file.filename)
        save_users(users_db)  # Persist to file
        return result
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

    
@app.get("/history")
def get_history(current_user: str = Depends(get_current_user)):
    try:
        return {"uploaded_files": users_db[current_user]["files"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch history: {str(e)}")

# Pydantic models for chat endpoints
class MessageModel(BaseModel):
    id: str
    role: str
    content: str
    timestamp: str

class SaveChatRequest(BaseModel):
    chat_id: str
    title: str
    messages: List[MessageModel]
    pdf_name: Optional[str] = None

# Save chat history
@app.post("/chats/save")
async def save_chat(chat_data: SaveChatRequest, current_user: str = Depends(get_current_user)):
    try:
        if current_user not in chats_db:
            chats_db[current_user] = {}
        
        chats_db[current_user][chat_data.chat_id] = {
            "title": chat_data.title,
            "messages": [msg.dict() for msg in chat_data.messages],
            "timestamp": chat_data.messages[-1].timestamp if chat_data.messages else str(time.time()),
            "pdf_name": chat_data.pdf_name
        }
        
        save_chats(chats_db)
        return {"status": "success", "message": "Chat saved successfully"}
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Failed to save chat: {str(e)}")

# Get all chats for user
@app.get("/chats")
async def get_chats(current_user: str = Depends(get_current_user)):
    try:
        user_chats = chats_db.get(current_user, {})
        
        # Transform to list format with chat_id included
        chat_list = []
        for chat_id, chat_data in user_chats.items():
            chat_list.append({
                "id": chat_id,
                "title": chat_data.get("title", "Untitled Chat"),
                "lastMessage": chat_data["messages"][-1]["content"][:50] if chat_data.get("messages") else "",
                "timestamp": chat_data.get("timestamp", ""),
                "pdf_name": chat_data.get("pdf_name")
            })
        
        # Sort by timestamp (newest first)
        chat_list.sort(key=lambda x: x["timestamp"], reverse=True)
        
        return {"chats": chat_list}
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Failed to fetch chats: {str(e)}")

# Get specific chat messages
@app.get("/chats/{chat_id}")
async def get_chat(chat_id: str, current_user: str = Depends(get_current_user)):
    try:
        user_chats = chats_db.get(current_user, {})
        
        if chat_id not in user_chats:
            raise HTTPException(status_code=404, detail="Chat not found")
        
        chat_data = user_chats[chat_id]
        return {
            "chat_id": chat_id,
            "title": chat_data.get("title", "Untitled Chat"),
            "messages": chat_data.get("messages", []),
            "pdf_name": chat_data.get("pdf_name")
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Failed to fetch chat: {str(e)}")
