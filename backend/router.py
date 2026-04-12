import os
from datetime import datetime
from database import CATEGORY_DEPARTMENT_MAP, update_classification, get_problem_by_id

DEPARTMENT_EXECUTIVES = {
    "Maintenance Department": {
        "name": "Mr. Rajesh Kumar",
        "email": "maintenance@campus.edu",
        "phone": "+91-9800000001",
    },
    "Dean of Students Office": {
        "name": "Dr. Sunita Sharma",
        "email": "dean.students@campus.edu",
        "phone": "+91-9800000002",
    },
    "Hostel & Mess Committee": {
        "name": "Mr. Anil Verma",
        "email": "mess.committee@campus.edu",
        "phone": "+91-9800000003",
    },
    "Academic Office": {
        "name": "Dr. Priya Nair",
        "email": "academics@campus.edu",
        "phone": "+91-9800000004",
    },
    "General Administration": {
        "name": "Ms. Kavita Singh",
        "email": "admin@campus.edu",
        "phone": "+91-9800000005",
    },
}

LOG_FILE = "notifications.log"


def log_notification(tracking_id: str, department: str, executive: dict, problem: dict):
    """Log a routing notification to a file (simulates email)."""
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_entry = f"""
==========================================
[{now}] NEW PROBLEM ROUTED
==========================================
Tracking ID  : {tracking_id}
Category     : {problem.get('category')}
Confidence   : {problem.get('confidence', 0):.0%}
Department   : {department}
Assigned To  : {executive['name']} ({executive['email']})
Description  : {problem.get('description')}
==========================================
"""
    with open(LOG_FILE, "a") as f:
        f.write(log_entry)

    print(log_entry)  # also print to console during dev


def route_problem(tracking_id: str, classification: dict) -> dict:
    """
    Takes a tracking ID and Gemini classification result,
    updates the DB, logs the notification, and returns routing info.
    """
    category = classification.get("category", "Other")
    confidence = classification.get("confidence", 0.0)

    # Save classification to DB
    update_classification(tracking_id, category, confidence)

    # Get department and executive
    department = CATEGORY_DEPARTMENT_MAP.get(category, "General Administration")
    executive = DEPARTMENT_EXECUTIVES.get(department, DEPARTMENT_EXECUTIVES["General Administration"])

    # Fetch updated problem for the log
    problem = get_problem_by_id(tracking_id)

    # Log notification (simulates sending email)
    log_notification(tracking_id, department, executive, problem)

    return {
        "tracking_id": tracking_id,
        "category": category,
        "confidence": confidence,
        "department": department,
        "executive": executive,
        "reasoning": classification.get("reasoning", ""),
        "fallback": classification.get("fallback", False),
    }


def get_executive_for_department(department: str) -> dict:
    """Helper to get executive info for a department."""
    return DEPARTMENT_EXECUTIVES.get(department, DEPARTMENT_EXECUTIVES["General Administration"])