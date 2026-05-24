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
from app.model.model_face_embedding import (
    FaceEmbedding
)
from sqlalchemy.orm import Session
from fastapi import Depends
from app.services.face_augmentation import (
    augment_face
)
import json

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
            "status": "no_face",
            "total_faces": 0
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
    embeddings = db.query(
        FaceEmbedding
    ).all()
    if len(embeddings) == 0:
        return {
            "status": "no_registered_user"
        }
    best_user = None
    lowest_distance = 999

    for item in embeddings:
        saved_embedding = json.loads(
            item.embedding
        )
        distance = euclidean_distance(
            new_embedding,
            saved_embedding
        )
        if distance < lowest_distance:
            lowest_distance = distance
            user = db.query(User).filter(
                User.id == item.user_id
            ).first()
            best_user = user
    THRESHOLD = 0.8
    if lowest_distance < THRESHOLD:
        return {
        "status": "recognized",
        "name": best_user.name,
        "distance":
            float(lowest_distance),
        "total_faces":
            len(faces),
        "active_face_box":
            largest_face['box']
    }
    return {
        "status": "unknown",
        "distance":
            float(lowest_distance),
        "total_faces":
            len(faces),
        "active_face_box":
            largest_face['box']
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
    augmented_faces = augment_face(
        cropped_face
    )
    user = db.query(User).filter(
        User.name == data.name
    ).first()
    if not user:
        user = User(
            name=data.name
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    total_embeddings = 0
    for face in augmented_faces:
        embedding = get_embedding(face)
        new_embedding = FaceEmbedding(
            user_id=user.id,
            embedding=json.dumps(
                embedding.tolist()
            )
        )
        db.add(new_embedding)
        total_embeddings += 1
    db.commit()
    return {
        "status": "success",
        "user_id": user.id,
        "name": user.name,
        "total_embeddings":
            total_embeddings
    }
   