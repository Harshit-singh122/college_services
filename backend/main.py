from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional
import sys
import os
import shutil
import uuid

sys.path.append(os.path.dirname(__file__))

from database import (
    insert_problem,
    get_problem_by_id,
    get_all_problems,
    update_status,
    get_stats,
    get_connection,
)
from agent import classify_complaint
from router import route_problem

app = FastAPI(title="Campus Problem Solver API")

# Serve uploaded images as static files
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Request / Response Models ----------

class UpdateStatusRequest(BaseModel):
    status: str
    resolution: Optional[str] = None


# ---------- Routes ----------

@app.get("/")
def root():
    return {"message": "Campus Problem Solver API is running."}


@app.post("/problems")
async def submit_problem(
    description: str = Form(...),
    image: Optional[UploadFile] = File(None),
):
    description = description.strip()

    if not description:
        raise HTTPException(status_code=400, detail="Description cannot be empty.")
    if len(description) < 10:
        raise HTTPException(status_code=400, detail="Description is too short.")

    # Save image if uploaded
    image_url = None
    if image and image.filename:
        ext = os.path.splitext(image.filename)[1]
        filename = f"{uuid.uuid4().hex}{ext}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        with open(filepath, "wb") as f:
            shutil.copyfileobj(image.file, f)
        image_url = f"/uploads/{filename}"

    # Save to DB
    tracking_id = insert_problem(description, image_url)

    # Classify with Gemini
    classification = classify_complaint(description)

    # Route to department
    routing = route_problem(tracking_id, classification)

    return {
        "tracking_id": tracking_id,
        "category": routing["category"],
        "confidence": routing["confidence"],
        "department": routing["department"],
        "reasoning": routing["reasoning"],
        "fallback": routing["fallback"],
        "executive": routing["executive"],
        "image_url": image_url,
    }


@app.get("/problems")
def get_problems(status: Optional[str] = None, department: Optional[str] = None):
    problems = get_all_problems()
    if status and status != "All":
        problems = [p for p in problems if p["status"] == status]
    if department and department != "All":
        problems = [p for p in problems if p.get("department") == department]
    return problems


@app.get("/problems/{tracking_id}")
def get_problem(tracking_id: str):
    problem = get_problem_by_id(tracking_id.upper())
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found.")
    return problem


@app.patch("/problems/{tracking_id}")
def update_problem_status(tracking_id: str, body: UpdateStatusRequest):
    problem = get_problem_by_id(tracking_id.upper())
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found.")

    valid_statuses = ["Submitted", "In Progress", "Resolved"]
    if body.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Status must be one of {valid_statuses}")

    update_status(tracking_id.upper(), body.status, body.resolution)
    return {"message": "Updated successfully."}


@app.delete("/problems/{tracking_id}")
def delete_problem(tracking_id: str):
    problem = get_problem_by_id(tracking_id.upper())
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found.")
    conn = get_connection()
    conn.execute("DELETE FROM problems WHERE id = ?", (tracking_id.upper(),))
    conn.commit()
    conn.close()
    return {"message": "Deleted successfully."}


@app.get("/stats")
def get_dashboard_stats():
    return get_stats()