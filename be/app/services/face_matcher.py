import numpy as np

def euclidean_distance(
    embedding1,
    embedding2
):
    embedding1 = np.array(
        embedding1
    )
    embedding2 = np.array(
        embedding2
    )
    return np.linalg.norm(
        embedding1 - embedding2
    )