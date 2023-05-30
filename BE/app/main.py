from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models
from .database import engine
import threading
from .process_mqtt import process_mqtt

# Drop all tables
models.Base.metadata.drop_all(engine)

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

@app.get("/")
async def root():
    return {"message": "Hello World"}

mqtt_thread = threading.Thread(target=process_mqtt)
mqtt_thread.start()