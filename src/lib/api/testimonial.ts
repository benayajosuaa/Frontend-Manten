import { apiFetch } from "../fetch";

const BASE_PATH = "/testimonials/";

export async function getTestimonials() {
  const data = await apiFetch(BASE_PATH, {
    cache: "no-store",
  });

  return data.data;
}

export async function createTestimonial(body: any) {
  return apiFetch(BASE_PATH, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateTestimonial(id: string, body: any) {
  return apiFetch(`${BASE_PATH}${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteTestimonial(id: string) {
  return apiFetch(`${BASE_PATH}${id}`, {
    method: "DELETE",
  });
}
