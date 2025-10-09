from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from auth import create_access_token, verify_token, hash_password, verify_password
from models import UserOut, Token
from database import users_db, uploads_db
from pipeline import process_paper
import os, shutil
app = FastAPI()
origins = [
    "http://localhost:5173",
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
        if username in users_db:
            raise HTTPException(status_code=400, detail="User already exists")
        if len(password) < 8 or not any(c.isupper() for c in password) or not any(c.isdigit() for c in password):
            raise HTTPException(
                status_code=400,
                detail="Password must be at least 8 characters, include 1 uppercase and 1 number."
            )
        safe_password = password.encode("utf-8")[:72].decode("utf-8", errors="ignore")
        password_hash = hash_password(safe_password)
        users_db[username] = {"email": email, "password": password_hash, "files": []}
        try:
            os.makedirs(os.path.join(UPLOAD_FOLDER, username), exist_ok=True)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to create user folder: {str(e)}")
        return {"username": username, "email": email}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
@app.post("/login", response_model=Token)
def login(username: str = Form(...), password: str = Form(...)):
    try:
        user = users_db.get(username)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        safe_password = password.encode("utf-8")[:72].decode("utf-8", errors="ignore")
        if not verify_password(safe_password, user["password"]):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        token = create_access_token({"sub": username})
        return {"access_token": token, "token_type": "bearer"}

    except HTTPException as e:
        raise e
    except Exception as e:
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
