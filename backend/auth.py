from database import users_db
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta
from fastapi import HTTPException
import os
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.environ.get("SECRET_KEY", "dev_secret_key_for_testing")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
def safe_truncate(password: str) -> str:
    """Ensures password length is <= 72 bytes for bcrypt compatibility."""
    if isinstance(password, str):
        password = password.encode("utf-8")
    return password[:72].decode("utf-8", errors="ignore")
def hash_password(password: str):
    """
    Hash password safely with bcrypt (truncate to 72 bytes)
    """
    safe_password = safe_truncate(password)
    return pwd_context.hash(safe_password)
def verify_password(plain: str, hashed: str):
    """
    Verify password safely (truncate to 72 bytes before verifying)
    """
    safe_plain = safe_truncate(plain)
    try:
        return pwd_context.verify(safe_plain, hashed)
    except ValueError:
        raise HTTPException(status_code=400, detail="Password verification failed")
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None or username not in users_db:
            raise HTTPException(status_code=401, detail="Invalid token or user not found")
        return username
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
