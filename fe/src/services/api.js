export async function identifyFace(image) {
  const response = await fetch(
    "http://127.0.0.1:8000/identify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: image,
      }),
    }
  );
  return response.json();
}

export async function registerFace(
  name,
  image
) {
  const response = await fetch(
    "http://127.0.0.1:8000/register",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        name,
        image,
      }),
    }
  );
  return response.json();
}