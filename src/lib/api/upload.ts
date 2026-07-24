import { apiFetch } from "../fetch";

type UploadResponse = {
  url: string;
  path: string;
  file_name: string;
};

export async function uploadImage(file: File, folder = "packages") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  return apiFetch("/upload", {
    method: "POST",
    body: formData,
  }) as Promise<UploadResponse>;
}
