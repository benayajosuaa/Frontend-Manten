import { apiFetch } from "../fetch";

export interface Setting {
  id: string;
  brand_name: string;
  logo_url: string;
  slogan: string;
  whatsapp_number: string;
  email: string;
  address: string;
  instagram_url: string;
  primary_color: string;
  secondary_color: string;
  created_at: string;
  updated_at: string;
}

export async function getSettings(): Promise<Setting> {
  const data = await apiFetch("/settings", { cache: "no-store" });
  return data.data;
}

export async function updateSettings(body: any, token?: string) {
  return apiFetch("/settings", {
    method: "PUT",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: JSON.stringify(body),
  });
}
