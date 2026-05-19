from mtcnn import MTCNN
import cv2

detector = MTCNN()

def detect_faces(image):
    results = detector.detect_faces(image)
    return results

def get_largest_face(faces):
    if not faces:
        return None
    return max(
        faces,
        key=lambda face:
        face['box'][2] * face['box'][3]
    )

def crop_face(image, face):
    x, y, w, h = face['box']
    x = abs(x)
    y = abs(y)
    cropped_face = image[
        y:y+h,
        x:x+w
    ]
    if cropped_face.size == 0:
        return None
    cropped_face = cv2.resize(
        cropped_face,
        (160, 160)
    )
    return cropped_face