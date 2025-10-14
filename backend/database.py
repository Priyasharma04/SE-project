import json
import os

# File to store users
USERS_FILE = "users_data.json"

# Load users from file if it exists
def load_users():
    if os.path.exists(USERS_FILE):
        try:
            with open(USERS_FILE, 'r') as f:
                return json.load(f)
        except:
            return {}
    return {}

# Save users to file
def save_users(users_dict):
    with open(USERS_FILE, 'w') as f:
        json.dump(users_dict, f, indent=2)

# Initialize with persisted data
users_db = load_users()
uploads_db = {}
