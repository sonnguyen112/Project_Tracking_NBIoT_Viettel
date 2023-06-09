from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from . import models
from .database import engine
import threading
from sqlalchemy.orm import Session
from .database import get_db
from typing import List

# Drop all tables
# models.Base.metadata.drop_all(engine)

# Create all tables
models.Base.metadata.create_all(engine)

app = FastAPI()

# app.include_router(course_activation.router)
# app.include_router(student_management.router)
# app.include_router(kafka_router.router)
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.options("/")
@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.options("/info")
@app.get("/info")
async def get_info(db: Session = Depends(get_db)):
    records = db.query(models.DeviceInfo).all()
    return records
