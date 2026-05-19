from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.utils.image import base64_to_image
from app.services.face_detector import (
    detect_faces,
    get_largest_face,
    crop_face
)
from app.services.face_matcher import (
    euclidean_distance
)
from app.services.face_embedding import (
    get_embedding
)
from app.database.database import (
    engine,
    Base,
    SessionLocal
)
from app.model.model_user import User
from sqlalchemy.orm import Session
from fastapi import Depends
import json
import numpy as np

app = FastAPI()
Base.metadata.create_all(bind=engine)
origins = [
    "http://localhost:5173"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class ImageData(BaseModel):
    image: str
    
class RegisterData(BaseModel):
    name: str
    image: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def home():
    return {
        "message": "Face Recognition API Running"
    }

@app.post("/identify")
def identify(
    data: ImageData,
    db: Session = Depends(get_db)
):
    image = base64_to_image(data.image)
    faces = detect_faces(image)
    if len(faces) == 0:
        return {
            "status": "no_face"
        }
    largest_face = get_largest_face(faces)
    cropped_face = crop_face(
        image,
        largest_face
    )
    if cropped_face is None:
        return {
            "status": "invalid_face"
        }
    new_embedding = get_embedding(
        cropped_face
    )
    users = db.query(User).all()
    if len(users) == 0:
        return {
            "status": "no_registered_user"
        }
    best_match = None
    lowest_distance = 999
    for user in users:
        saved_embedding = json.loads(
            user.embedding
        )
        distance = euclidean_distance(
            new_embedding,
            saved_embedding
        )
        if distance < lowest_distance:
            lowest_distance = distance
            best_match = user
    THRESHOLD = 0.8
    if lowest_distance < THRESHOLD:
        return {
            "status": "recognized",
            "name": best_match.name,
            "distance":
                float(lowest_distance)
        }
    return {
        "status": "unknown",
        "distance":
            float(lowest_distance)
    }
 
@app.post("/register")
def register(
    data: RegisterData,
    db: Session = Depends(get_db)
):
    image = base64_to_image(data.image)
    faces = detect_faces(image)
    if len(faces) == 0:
        return {
            "status": "no_face"
        }
    largest_face = get_largest_face(faces)
    cropped_face = crop_face(
        image,
        largest_face
    )
    if cropped_face is None:
        return {
            "status": "invalid_face"
        }
    embedding = get_embedding(
        cropped_face
    )
    new_user = User(
        name=data.name,
        embedding=json.dumps(
            embedding.tolist()
        )
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {
        "status": "success",
        "user_id": new_user.id,
        "name": new_user.name
    }
   