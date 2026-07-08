import { auth } from "./firebaseConfig";

const DATABASE_URL =
  "https://zakazivanjetermina-92914-default-rtdb.europe-west1.firebasedatabase.app";

async function getToken() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Korisnik nije prijavljen.");
  }

  return await user.getIdToken();
}

async function handleResponse(response: Response) {
  const data = await response.json();

  if (!response.ok) {
    console.error("Firebase REST greška:", data);
    throw new Error(data?.error || "Greška pri komunikaciji sa bazom.");
  }

  return data;
}

export async function getData(path: string) {
  const token = await getToken();

  const response = await fetch(`${DATABASE_URL}/${path}.json?auth=${token}`);

  return await handleResponse(response);
}

export async function postData(path: string, data: any) {
  const token = await getToken();

  const response = await fetch(`${DATABASE_URL}/${path}.json?auth=${token}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await handleResponse(response);
}

export async function putData(path: string, data: any) {
  const token = await getToken();

  const response = await fetch(`${DATABASE_URL}/${path}.json?auth=${token}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await handleResponse(response);
}

export async function patchData(path: string, data: any) {
  const token = await getToken();

  const response = await fetch(`${DATABASE_URL}/${path}.json?auth=${token}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await handleResponse(response);
}

export async function deleteData(path: string) {
  const token = await getToken();

  const response = await fetch(`${DATABASE_URL}/${path}.json?auth=${token}`, {
    method: "DELETE",
  });

  return await handleResponse(response);
}