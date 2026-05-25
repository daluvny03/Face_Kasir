import os
import cv2
import json
from sqlalchemy.orm import Session
from app.database.database import (
    SessionLocal
)
from app.model.model_user import User
from app.model.model_face_embedding import (
    FaceEmbedding
)
from app.services.face_detector import (
    detect_faces,
    get_largest_face,
    crop_face
)
from app.services.face_embedding import (
    get_embedding
)
from app.services.face_augmentation import (
    augment_face
)
DATASET_PATH = "uploads/dataset"
db: Session = SessionLocal()
files = os.listdir(DATASET_PATH)
for file_name in files:
    image_path = os.path.join(
        DATASET_PATH,
        file_name
    )
    image = cv2.imread(image_path)
    if image is None:
        print(
            f"FAILED READ: {file_name}"
        )
        continue
    faces = detect_faces(image)
    if len(faces) == 0:
        print(
            f"NO FACE: {file_name}"
        )
        continue
    largest_face = get_largest_face(
        faces
    )
    cropped_face = crop_face(
        image,
        largest_face
    )
    if cropped_face is None:
        print(
            f"INVALID FACE: {file_name}"
        )
        continue
    user_name = os.path.splitext(
        file_name
    )[0]
    user = User(
        name=user_name
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    augmented_faces = augment_face(
        cropped_face
    )
    total_embedding = 0
    for face in augmented_faces:
        embedding = get_embedding(
            face
        )
        embedding_data = FaceEmbedding(
            user_id=user.id,
            embedding=json.dumps(
                embedding.tolist()
            )
        )
        db.add(embedding_data)
        total_embedding += 1
    db.commit()
    print(
        f"{user_name} -> "
        f"{total_embedding} embeddings"
    )
print("DATASET PREPARATION DONE")