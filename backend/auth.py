from database import users_db
import bcrypt
import jwt as pyjwt
from datetime import datetime, timedelta
from fastapi import HTTPException
import os

SECRET_KEY = os.environ.get("SECRET_KEY", "dev_secret_key_for_testing")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def hash_password(password: str):
    """
    Hash password using bcrypt directly
    """
    # Convert to bytes and hash
    password_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode("utf-8")

def verify_password(plain: str, hashed: str):
    """
    Verify password using bcrypt directly
    """
    try:
        print(f"Verifying password... Plain length: {len(plain)}, Hash length: {len(hashed)}")
        plain_bytes = plain.encode("utf-8")
        hashed_bytes = hashed.encode("utf-8")
        result = bcrypt.checkpw(plain_bytes, hashed_bytes)
        print(f"Bcrypt checkpw result: {result}")
        return result
    except Exception as e:
        print(f"Error in verify_password: {str(e)}")
        import traceback
        traceback.print_exc()
        return False
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return pyjwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
def verify_token(token: str):
    try:
        payload = pyjwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None or username not in users_db:
            raise HTTPException(status_code=401, detail="Invalid token or user not found")
        return username
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except pyjwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
