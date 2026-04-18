from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models
class CaseFile(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: f"OWL-{str(uuid.uuid4())[:8].upper()}")
    title: str
    operativeName: str
    date: str
    classification: str
    description: str
    attachments: List[str] = []
    redacted: bool = False
    createdAt: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    createdBy: str = ""

class CaseFileCreate(BaseModel):
    title: str
    operativeName: str
    date: str
    classification: str
    description: str
    attachments: List[str] = []
    redacted: bool = False
    createdBy: str = ""

class CaseFileUpdate(BaseModel):
    title: Optional[str] = None
    operativeName: Optional[str] = None
    date: Optional[str] = None
    classification: Optional[str] = None
    description: Optional[str] = None
    attachments: Optional[List[str]] = None
    redacted: Optional[bool] = None

class MasqueradeReport(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: f"MR-{datetime.now(timezone.utc).strftime('%Y')}-{str(uuid.uuid4())[:6].upper()}")
    type: str
    priority: str
    subject: str
    location: str
    details: str
    status: str = "PENDING"
    operative: str
    date: str = Field(default_factory=lambda: datetime.now(timezone.utc).strftime('%Y-%m-%d'))
    createdAt: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class MasqueradeReportCreate(BaseModel):
    type: str
    priority: str
    subject: str
    location: str
    details: str
    operative: str

class MasqueradeReportUpdate(BaseModel):
    type: Optional[str] = None
    priority: Optional[str] = None
    subject: Optional[str] = None
    location: Optional[str] = None
    details: Optional[str] = None
    status: Optional[str] = None

# Root endpoint
@api_router.get("/")
async def root():
    return {"message": "OWL Masquerade Initiative API v4.16.2"}

# ============== CASE FILES ENDPOINTS ==============

@api_router.get("/case-files", response_model=List[CaseFile])
async def get_case_files():
    """Get all case files"""
    files = await db.case_files.find({}, {"_id": 0}).sort("createdAt", -1).to_list(1000)
    return files

@api_router.get("/case-files/{file_id}", response_model=CaseFile)
async def get_case_file(file_id: str):
    """Get a specific case file"""
    file = await db.case_files.find_one({"id": file_id}, {"_id": 0})
    if not file:
        raise HTTPException(status_code=404, detail="Case file not found")
    return file

@api_router.post("/case-files", response_model=CaseFile)
async def create_case_file(file_data: CaseFileCreate):
    """Create a new case file"""
    # Get next ID number
    count = await db.case_files.count_documents({})
    new_file = CaseFile(
        id=f"OWL-{str(count + 1).zfill(3)}",
        **file_data.model_dump()
    )
    doc = new_file.model_dump()
    await db.case_files.insert_one(doc)
    return new_file

@api_router.put("/case-files/{file_id}", response_model=CaseFile)
async def update_case_file(file_id: str, updates: CaseFileUpdate):
    """Update a case file (admin only - validated on frontend)"""
    update_data = {k: v for k, v in updates.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No updates provided")
    
    result = await db.case_files.update_one(
        {"id": file_id},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Case file not found")
    
    updated = await db.case_files.find_one({"id": file_id}, {"_id": 0})
    return updated

@api_router.delete("/case-files/{file_id}")
async def delete_case_file(file_id: str):
    """Delete a case file (admin only - validated on frontend)"""
    result = await db.case_files.delete_one({"id": file_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Case file not found")
    return {"message": "Case file deleted"}

# ============== MASQUERADE REPORTS ENDPOINTS ==============

@api_router.get("/reports", response_model=List[MasqueradeReport])
async def get_reports():
    """Get all masquerade reports"""
    reports = await db.masquerade_reports.find({}, {"_id": 0}).sort("createdAt", -1).to_list(1000)
    return reports

@api_router.post("/reports", response_model=MasqueradeReport)
async def create_report(report_data: MasqueradeReportCreate):
    """Create a new masquerade report"""
    new_report = MasqueradeReport(**report_data.model_dump())
    doc = new_report.model_dump()
    await db.masquerade_reports.insert_one(doc)
    return new_report

@api_router.put("/reports/{report_id}", response_model=MasqueradeReport)
async def update_report(report_id: str, updates: MasqueradeReportUpdate):
    """Update a report (admin only)"""
    update_data = {k: v for k, v in updates.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No updates provided")
    
    result = await db.masquerade_reports.update_one(
        {"id": report_id},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Report not found")
    
    updated = await db.masquerade_reports.find_one({"id": report_id}, {"_id": 0})
    return updated

@api_router.delete("/reports/{report_id}")
async def delete_report(report_id: str):
    """Delete a report (admin only)"""
    result = await db.masquerade_reports.delete_one({"id": report_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"message": "Report deleted"}

# ============== SEED DATA ==============

@api_router.post("/seed")
async def seed_database():
    """Seed initial data if empty"""
    # Check if already seeded
    case_count = await db.case_files.count_documents({})
    if case_count > 0:
        return {"message": "Database already seeded"}
    
    # Initial case files based on OWL lore
    initial_cases = [
        {
            "id": "OWL-001",
            "title": "Site-416 Ethics Violation - Class D Abuse",
            "operativeName": "Agent Whisper",
            "date": "20██-08-██",
            "classification": "HIGH PRIORITY",
            "description": "Documentation of systematic abuse of Class-D personnel by Security Department operatives. Multiple witnesses report a group of 4-5 SDs pinning a Class-I TBB designated 'Mercy' against a wall, resulting in severe injuries including an unrecognizable arm. Subject was admitted to Medical Sector for 1 month. During this period, subject received no food, water, or medical attention despite EC orders confining her to MS. EC member 'Alcazarr' personally threatened subject's life. Full testimony and bodycam footage secured.",
            "attachments": ["MERCY_TESTIMONY.txt", "BODYCAM_FOOTAGE_01.mp4", "INJURY_DOCUMENTATION.pdf"],
            "redacted": False,
            "createdAt": "2024-08-15T00:00:00.000Z",
            "createdBy": "TaskMaster"
        },
        {
            "id": "OWL-002",
            "title": "O-1 Misconduct Investigation - ASC Incident",
            "operativeName": "Masquerade Lead",
            "date": "20██-09-██",
            "classification": "CRITICAL",
            "description": "Following the gunning down of ASC, O-1 operatives E. Martin, Raphael D., and L. Sorrentino were questioned. TBB Michael witnessed the event and was found covered in blood, emotionally distraught and dissociative. O-1 operatives allegedly asked Michael for a 'review' of the massacre. Raphael D. denied asking for review but admitted checking on Michael. E. Martin denied claims despite not being present. L. Sorrentino remained silent throughout questioning. Conflicting stories regarding LMDV presence indicate potential cover-up.",
            "attachments": ["INTERVIEW_TRANSCRIPT.txt", "MICHAEL_BODYCAM.mp4", "O1_STATEMENT.pdf"],
            "redacted": False,
            "createdAt": "2024-09-22T00:00:00.000Z",
            "createdBy": "TaskMaster"
        },
        {
            "id": "OWL-003",
            "title": "O-1 Code of Ethics Inquiry",
            "operativeName": "Lead Investigator",
            "date": "20██-09-██",
            "classification": "STANDARD",
            "description": "Direct questioning of Raphael D. regarding O-1's adherence to CoE. Subject stated he is 'simply different' from other O-1 operatives, claiming 'I care about people' while others 'ask questions and leave.' When pressed on whether entire O-1 task force follows CoE vehemently, subject repeatedly deflected. After persistent questioning, subject eventually answered 'yes' but behavior suggests internal integrity issues within O-1. Quote: 'They ask them questions and leave to deal with it, while I help the people who are injured back up on their feet.'",
            "attachments": ["RAPHAEL_D_INTERVIEW.txt"],
            "redacted": False,
            "createdAt": "2024-09-25T00:00:00.000Z",
            "createdBy": "TaskMaster"
        },
        {
            "id": "OWL-004",
            "title": "Asset Recovery - Class D Supply Network",
            "operativeName": "Agent Shadow",
            "date": "20██-10-██",
            "classification": "CONFIDENTIAL",
            "description": "Subject 'Mercy' disclosed location of supply stash on Research Complex balcony. Location used by CDs, Foundation personnel, and GOIs for drops. Further investigation required to map full network. Note: Subject is kindhearted, follows code of helping all in need, and is beloved within CD community. As head Class-I handling medical aid for both CD and Foundation, she maintains significant influence. Approach with care - subject has PTSD regarding EC/civil departments.",
            "attachments": ["STASH_LOCATION.jpg", "NETWORK_MAP_DRAFT.pdf"],
            "redacted": True,
            "createdAt": "2024-10-03T00:00:00.000Z",
            "createdBy": "TaskMaster"
        }
    ]
    
    await db.case_files.insert_many(initial_cases)
    
    # Initial masquerade reports
    initial_reports = [
        {
            "id": "MR-2025-001",
            "type": "INTEL",
            "priority": "HIGH",
            "subject": "EC Banquet Surveillance",
            "location": "Site-416 Cafeteria",
            "details": "Large group of EC observed with O-1 guard detail near cafeteria wall. 1-2 EC members conducting kitchen tour. Subject 'Mercy' present, showing signs of emotional distress likely due to EC presence.",
            "status": "VERIFIED",
            "operative": "Agent Whisper",
            "date": "2025-01-14",
            "createdAt": "2025-01-14T00:00:00.000Z"
        },
        {
            "id": "MR-2025-002",
            "type": "WITNESS",
            "priority": "CRITICAL",
            "subject": "TBB Michael - ASC Witness Interview",
            "location": "MS Reception",
            "details": "Subject found covered in blood, front half red, stuttering, unable to form coherent sentences. Eyewitness to ASC being gunned down. O-1 operatives questioned him about 'what he thought of the event' - described as 'not unlike giving a review at a restaurant.'",
            "status": "VERIFIED",
            "operative": "Masquerade Lead",
            "date": "2025-01-13",
            "createdAt": "2025-01-13T00:00:00.000Z"
        },
        {
            "id": "MR-2025-003",
            "type": "MEDICAL",
            "priority": "HIGH",
            "subject": "Subject Mercy - Ongoing Welfare Check",
            "location": "S2 Lift Lounge",
            "details": "Subject spotted with sprained ankle, additional medical wrap. Heavy emotional distress, talking to self, fidgety. Had not eaten in one month. Coaxed into eating and drinking. Relocated to breach shelter for focused interview. Subject maintains medical care for self, refuses outside help.",
            "status": "ONGOING",
            "operative": "Agent Shadow",
            "date": "2025-01-12",
            "createdAt": "2025-01-12T00:00:00.000Z"
        }
    ]
    
    await db.masquerade_reports.insert_many(initial_reports)
    
    return {"message": "Database seeded successfully"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    # Auto-seed on startup if empty
    case_count = await db.case_files.count_documents({})
    if case_count == 0:
        logger.info("Seeding initial data...")
        # Call seed logic directly
        initial_cases = [
            {
                "id": "OWL-001",
                "title": "Site-416 Ethics Violation - Class D Abuse",
                "operativeName": "Agent Whisper",
                "date": "20██-08-██",
                "classification": "HIGH PRIORITY",
                "description": "Documentation of systematic abuse of Class-D personnel by Security Department operatives. Multiple witnesses report a group of 4-5 SDs pinning a Class-I TBB designated 'Mercy' against a wall, resulting in severe injuries including an unrecognizable arm. Subject was admitted to Medical Sector for 1 month. During this period, subject received no food, water, or medical attention despite EC orders confining her to MS. EC member 'Alcazarr' personally threatened subject's life.",
                "attachments": ["MERCY_TESTIMONY.txt", "BODYCAM_FOOTAGE_01.mp4"],
                "redacted": False,
                "createdAt": "2024-08-15T00:00:00.000Z",
                "createdBy": "TaskMaster"
            },
            {
                "id": "OWL-002", 
                "title": "O-1 Misconduct Investigation - ASC Incident",
                "operativeName": "Masquerade Lead",
                "date": "20██-09-██",
                "classification": "CRITICAL",
                "description": "Following the gunning down of ASC, O-1 operatives E. Martin, Raphael D., and L. Sorrentino were questioned. TBB Michael witnessed the event and was found covered in blood, emotionally distraught. O-1 operatives allegedly asked Michael for a 'review' of the massacre.",
                "attachments": ["INTERVIEW_TRANSCRIPT.txt", "MICHAEL_BODYCAM.mp4"],
                "redacted": False,
                "createdAt": "2024-09-22T00:00:00.000Z",
                "createdBy": "TaskMaster"
            }
        ]
        await db.case_files.insert_many(initial_cases)
        logger.info("Initial data seeded")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
