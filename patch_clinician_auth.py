import re

with open("backend/src/api.py", "r") as f:
    content = f.read()

clinician_endpoint = """
@app.post("/api/auth/clinician/login")
def clinician_login_endpoint(data: ParentLoginRequest):
    email = data.email.strip()
    password = data.password or "default_pass"
    
    if not email:
        return {"status": "error", "message": "Email is required"}
    
    db = Database(DB_PATH)
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    
    user = db.get_user_by_email(email)
    
    if not user:
        # Auto-register Clinician
        user_id = "U-" + str(uuid.uuid4())[:8]
        username = email.split("@")[0].replace(".", " ").title()
        db.create_user(user_id, email, password_hash, username, "clinician")
        user = {"id": user_id, "email": email, "name": username, "role": "clinician"}
    else:
        if user["password_hash"] != password_hash:
            return {"status": "error", "message": "Invalid credentials"}
        if user["role"] != "clinician":
            return {"status": "error", "message": "Account is not a clinician account"}
            
    return {
        "status": "success",
        "user": {
            "id":       user["id"],
            "role":     user["role"],
            "email":    user["email"],
            "name":     user["name"],
            "token":    f"auth_tok_{user['id']}_{int(time.time())}",
        },
    }
"""

if "/api/auth/clinician/login" not in content:
    # Insert right after parent login
    content = re.sub(r'(@app\.post\("/api/auth/logout"\))', clinician_endpoint + r'\n\1', content)

with open("backend/src/api.py", "w") as f:
    f.write(content)
