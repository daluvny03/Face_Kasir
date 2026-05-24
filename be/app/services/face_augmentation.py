import cv2
import numpy as np

def augment_face(face):
    augmented_faces = []
    augmented_faces.append(face)
    # brightness +
    bright = cv2.convertScaleAbs(
        face,
        alpha=1.2,
        beta=20
    )
    augmented_faces.append(bright)
    # brightness -
    dark = cv2.convertScaleAbs(
        face,
        alpha=0.8,
        beta=-20
    )
    augmented_faces.append(dark)
    # rotate left
    matrix_left = cv2.getRotationMatrix2D(
        (80, 80),
        -10,
        1
    )
    rotated_left = cv2.warpAffine(
        face,
        matrix_left,
        (160, 160)
    )
    augmented_faces.append(rotated_left)
    # rotate right
    matrix_right = cv2.getRotationMatrix2D(
        (80, 80),
        10,
        1
    )
    rotated_right = cv2.warpAffine(
        face,
        matrix_right,
        (160, 160)
    )
    augmented_faces.append(rotated_right)
    return augmented_faces