import { apiFetch } from "../fetch";

const BASE_PATH = "/galleries/";

export async function getGalleries() {
  const data = await apiFetch(BASE_PATH, {
    cache: "no-store",
  });

  return data.data;
}

export async function createGallery(body: any) {
  return apiFetch(BASE_PATH, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateGallery(id: string, body: any) {
  return apiFetch(`${BASE_PATH}${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteGallery(id: string) {
  return apiFetch(`${BASE_PATH}${id}`, {
    method: "DELETE",
  });
}
