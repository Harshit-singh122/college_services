import sqlite3
import uuid
from datetime import datetime

DB_PATH = "campus_problems.db"

CATEGORY_DEPARTMENT_MAP = {
    "Bathroom & Hygiene": "Maintenance Department",
    "Anti-Ragging & Safety": "Dean of Students Office",
    "Mess & Food Quality": "Hostel & Mess Committee",
    "Academic Issues": "Academic Office",
    "Infrastructure/Maintenance": "Maintenance Department",
    "Other": "General Administration",
}

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # lets us access columns by name
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS problems (
            id TEXT PRIMARY KEY,
            description TEXT NOT NULL,
            image_path TEXT,
            category TEXT,
            confidence REAL,
            department TEXT,
            status TEXT DEFAULT 'Submitted',
            resolution TEXT,
            submitted_at TEXT,
            updated_at TEXT
        )
    """)

    conn.commit()
    conn.close()

def insert_problem(description: str, image_path: str = None) -> str:
    """Insert a new problem and return its tracking ID."""
    tracking_id = str(uuid.uuid4())[:8].upper()  # short, readable ID
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    conn = get_connection()
    conn.execute("""
        INSERT INTO problems (id, description, image_path, status, submitted_at, updated_at)
        VALUES (?, ?, ?, 'Submitted', ?, ?)
    """, (tracking_id, description, image_path, now, now))
    conn.commit()
    conn.close()

    return tracking_id

def update_classification(tracking_id: str, category: str, confidence: float):
    """Update problem with AI classification results."""
    department = CATEGORY_DEPARTMENT_MAP.get(category, "General Administration")
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    conn = get_connection()
    conn.execute("""
        UPDATE problems
        SET category = ?, confidence = ?, department = ?, updated_at = ?
        WHERE id = ?
    """, (category, confidence, department, now, tracking_id))
    conn.commit()
    conn.close()

def get_problem_by_id(tracking_id: str):
    """Fetch a single problem by its tracking ID."""
    conn = get_connection()
    row = conn.execute(
        "SELECT * FROM problems WHERE id = ?", (tracking_id,)
    ).fetchone()
    conn.close()
    return dict(row) if row else None

def get_all_problems():
    """Fetch all problems, newest first."""
    conn = get_connection()
    rows = conn.execute(
        "SELECT * FROM problems ORDER BY submitted_at DESC"
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_problems_by_department(department: str):
    """Fetch problems assigned to a specific department."""
    conn = get_connection()
    rows = conn.execute(
        "SELECT * FROM problems WHERE department = ? ORDER BY submitted_at DESC",
        (department,)
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]

def update_status(tracking_id: str, status: str, resolution: str = None):
    """Admin updates status and optionally adds resolution text."""
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    conn = get_connection()
    conn.execute("""
        UPDATE problems
        SET status = ?, resolution = ?, updated_at = ?
        WHERE id = ?
    """, (status, resolution, now, tracking_id))
    conn.commit()
    conn.close()

def get_stats():
    """Return summary counts for the admin dashboard."""
    conn = get_connection()
    total = conn.execute("SELECT COUNT(*) FROM problems").fetchone()[0]
    submitted = conn.execute("SELECT COUNT(*) FROM problems WHERE status = 'Submitted'").fetchone()[0]
    in_progress = conn.execute("SELECT COUNT(*) FROM problems WHERE status = 'In Progress'").fetchone()[0]
    resolved = conn.execute("SELECT COUNT(*) FROM problems WHERE status = 'Resolved'").fetchone()[0]
    conn.close()
    return {"total": total, "submitted": submitted, "in_progress": in_progress, "resolved": resolved}

# Initialize DB when this module is imported
init_db()