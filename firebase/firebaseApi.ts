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

export async function getData(path: string) {
  const token = await getToken();

  const response = await fetch(`${DATABASE_URL}/${path}.json?auth=${token}`);

  if (!response.ok) {
    throw new Error("Greška pri učitavanju podataka.");
  }

  return await response.json();
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

  return await response.json();
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

  return await response.json();
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

  return await response.json();
}

export async function deleteData(path: string) {
  const token = await getToken();

  const response = await fetch(`${DATABASE_URL}/${path}.json?auth=${token}`, {
    method: "DELETE",
  });

  return await response.json();
}