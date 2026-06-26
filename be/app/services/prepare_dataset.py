import os
import cv2
import json

from sqlalchemy.orm import Session
from app.database.database import SessionLocal
from app.model.model_user import User
from app.model.model_face_embedding import FaceEmbedding
from app.services.face_detector import (
    detect_faces,
    get_largest_face,
    crop_face
)

from app.services.face_embedding import get_embedding
from app.services.face_augmentation import augment_face

ORIGINAL_PATH = "dataset/original"
CROPPED_PATH = "dataset/cropped"
AUGMENTED_PATH = "dataset/augmented"

def prepare_dataset():
    db: Session = SessionLocal()
    files = [
        f for f in os.listdir(ORIGINAL_PATH)
        if f.lower().endswith((".jpg", ".jpeg", ".png"))
    ]
    print("=" * 50)
    print(" DATASET PREPARATION ")
    print("=" * 50)
    total_user = 0
    total_embedding = 0
    for file_name in files:
        print(f"\nProcessing : {file_name}")
        image_path = os.path.join(
            ORIGINAL_PATH,
            file_name
        )
        image = cv2.imread(image_path)
        if image is None:
            print("❌ Failed read image")
            continue
        faces = detect_faces(image)
        if len(faces) == 0:
            print("❌ No face detected")
            continue
        largest_face = get_largest_face(faces)
        cropped_face = crop_face(
            image,
            largest_face
        )
        if cropped_face is None:
            print("❌ Invalid face")
            continue
        user_name = os.path.splitext(
            file_name
        )[0]
        crop_path = os.path.join(
            CROPPED_PATH,
            f"{user_name}_crop.jpg"
        )
        cv2.imwrite(
            crop_path,
            cropped_face
        )
        print("✅ Crop saved")
        existing_user = db.query(User).filter(
            User.name == user_name
        ).first()
        if existing_user:
            print("⚠ User already exists")
            db.query(FaceEmbedding).filter(
                FaceEmbedding.user_id == existing_user.id
            ).delete()
            user = existing_user
        else:
            user = User(name=user_name)
            db.add(user)
            db.commit()
            db.refresh(user)
            total_user += 1
        augmented_faces = augment_face(
            cropped_face
        )
        aug_names = [
            "original",
            "bright",
            "dark",
            "left",
            "right"
        ]
        for i, face in enumerate(augmented_faces):
            aug_path = os.path.join(
                AUGMENTED_PATH,
                f"{user_name}_{aug_names[i]}.jpg"
            )
            cv2.imwrite(
                aug_path,
                face
            )
            embedding = get_embedding(face)
            embedding_data = FaceEmbedding(
                user_id=user.id,
                embedding=json.dumps(
                    embedding.tolist()
                )
            )
            db.add(embedding_data)
            total_embedding += 1
        db.commit()
        print("✅ Augmentation saved")
        print("✅ Embedding saved")

    print("\n")
    print("=" * 50)
    print("DATASET PREPARATION FINISHED")
    print(f"Total User      : {total_user}")
    print(f"Total Embedding : {total_embedding}")
    print("=" * 50)

    db.close()
if __name__ == "__main__":
    prepare_dataset()