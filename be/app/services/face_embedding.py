from keras_facenet import FaceNet
embedder = FaceNet()

def get_embedding(face):
    embedding = embedder.embeddings([face])
    return embedding[0]