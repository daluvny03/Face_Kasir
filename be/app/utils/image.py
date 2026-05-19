import base64
import cv2
import numpy as np

def base64_to_image(base64_string):
    encoded_data = base64_string.split(",")[1]
    nparr = np.frombuffer(
        base64.b64decode(encoded_data),
        np.uint8
    )
    image = cv2.imdecode(
        nparr,
        cv2.IMREAD_COLOR
    )
    return image