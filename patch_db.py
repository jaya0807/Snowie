import sqlite3
import os

DB_PATH = "backend/src/observe.db"

def patch():
    if not os.path.exists(DB_PATH):
        return
        
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        
        # Add columns to sessions if they don't exist
        try:
            cursor.execute("ALTER TABLE sessions ADD COLUMN activity_id TEXT;")
            cursor.execute("ALTER TABLE sessions ADD COLUMN difficulty TEXT;")
            cursor.execute("ALTER TABLE sessions ADD COLUMN accuracy REAL;")
            cursor.execute("ALTER TABLE sessions ADD COLUMN response_time_sec REAL;")
        except sqlite3.OperationalError:
            pass # Columns probably already exist
            
        # Create goals table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS goals (
                goal_id TEXT PRIMARY KEY,
                participant_id TEXT,
                domain TEXT,
                goal_text TEXT,
                baseline TEXT,
                target TEXT,
                status TEXT
            )
        ''')
        
        conn.commit()

patch()
