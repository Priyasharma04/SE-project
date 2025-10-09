from pydantic import BaseModel

class User(BaseModel):
    username: str
    email: str
    password: str

class UserOut(BaseModel):
    username: str
    email: str

class Token(BaseModel):
    access_token: str
    token_type: str
