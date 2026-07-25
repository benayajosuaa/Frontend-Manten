"use client";

import { useEffect, useState } from "react";
import { Montserrat } from "next/font/google";
import { FiEdit2, FiPlus, FiTrash2, FiUpload, FiX } from "react-icons/fi";

import {
  createGallery,
  deleteGallery,
  getGalleries,
  updateGallery,
} from "@/lib/api/gallery";
import { uploadImage } from "@/lib/api/upload";

export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});

type GalleryForm = {
  couple_name: string;
  event_date: string;
  location: string;
  image_url: string;
  orientation: "landscape" | "portrait";
  sort_order: number;
  is_active: boolean;
};

const initialForm: GalleryForm = {
  couple_name: "",
  event_date: "",
  location: "",
  image_url: "",
  orientation: "landscape",
  sort_order: 0,
  is_active: true,
};

function toDateInput(value: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

function toDisplayDate(value: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function GalleryPage() {
  const [galleries, setGalleries] = useState<any[]>([]);
  const [form, setForm] = useState<GalleryForm>(initialForm);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function fetchGalleries() {
    try {
      setLoading(true);
      const data = await getGalleries();
      setGalleries(Array.isArray(data) ? data : []);
      setErrorMessage("");
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error?.message || "Failed to load galleries.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGalleries();
  }, []);

  function handleChange(
    field: keyof GalleryForm,
    value: string | number | boolean
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleEdit(item: any) {
    setEditingId(item.ID);
    setForm({
      couple_name: item.CoupleName ?? "",
      event_date: toDateInput(item.EventDate),
      location: item.Location ?? "",
      image_url: item.ImageURL ?? "",
      orientation: item.Orientation === "portrait" ? "portrait" : "landscape",
      sort_order: item.SortOrder ?? 0,
      is_active: item.IsActive ?? true,
    });
  }

  function resetForm() {
    setEditingId("");
    setForm(initialForm);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar.");
      e.target.value = "";
      return;
    }

    try {
      setUploading(true);
      const data = await uploadImage(file, "galleries");
      handleChange("image_url", data.url);
    } catch (error: any) {
      alert(error?.message || "Failed to upload image.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setSaving(true);

      if (editingId) {
        await updateGallery(editingId, form);
        alert("Gallery updated successfully.");
      } else {
        const { is_active, ...createBody } = form;
        await createGallery(createBody);
        alert("Gallery created successfully.");
      }

      resetForm();
      await fetchGalleries();
    } catch (error: any) {
      alert(error?.message || "Failed to save gallery.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: any) {
    const confirmed = window.confirm(
      `Delete gallery "${item.CoupleName}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await deleteGallery(item.ID);
      alert("Gallery deleted successfully.");
      await fetchGalleries();
      if (editingId === item.ID) resetForm();
    } catch (error: any) {
      alert(error?.message || "Failed to delete gallery.");
    }
  }

  return (
    <div className={montserrat.className}>
      <div className="p-5">
        <div className="flex flex-col gap-y-10">
          <div className="flex flex-row justify-between">
            <div className="flex flex-col">
              <span className="text-2xl font-semibold">Gallery</span>
              <span className="text-sm">
                Manage wedding gallery photos shown on your website.
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="border-b pb-8">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {editingId ? "Edit Gallery" : "Create Gallery"}
              </h2>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition hover:bg-gray-100"
                >
                  <FiX />
                  Cancel Edit
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Couple Name
                </label>
                <input
                  type="text"
                  value={form.couple_name}
                  onChange={(e) => handleChange("couple_name", e.target.value)}
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                  placeholder="Kevin & Angel"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Event Date
                </label>
                <input
                  type="date"
                  value={form.event_date}
                  onChange={(e) => handleChange("event_date", e.target.value)}
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                  placeholder="Jakarta"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Orientation
                </label>
                <select
                  value={form.orientation}
                  onChange={(e) =>
                    handleChange(
                      "orientation",
                      e.target.value as GalleryForm["orientation"]
                    )
                  }
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                  required
                >
                  <option value="landscape">Landscape</option>
                  <option value="portrait">Portrait</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) =>
                    handleChange("sort_order", Number(e.target.value))
                  }
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div className="flex items-center">
                <label className="mr-3 text-sm font-medium">Active</label>
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => handleChange("is_active", e.target.checked)}
                  className="h-5 w-5"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">Image</label>
                <div className="flex flex-col gap-3 md:flex-row">
                  <input
                    type="url"
                    value={form.image_url}
                    onChange={(e) => handleChange("image_url", e.target.value)}
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                    placeholder="https://..."
                    required
                  />
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm transition hover:bg-gray-50 md:w-52">
                    <FiUpload />
                    {uploading ? "Uploading..." : "Upload"}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploading}
                      onChange={handleImageUpload}
                      className="sr-only"
                    />
                  </label>
                </div>

                {form.image_url && (
                  <img
                    src={form.image_url}
                    alt="Gallery preview"
                    className="mt-4 h-28 w-44 rounded-md object-cover"
                  />
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={saving || uploading}
                className="flex items-center gap-2 rounded-lg bg-[#394322] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiPlus />
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save Gallery"
                    : "Create Gallery"}
              </button>
            </div>
          </form>

          <div>
            <h2 className="text-lg font-semibold">List Gallery</h2>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm uppercase text-gray-500">
                    <th className="pb-4">Photo</th>
                    <th className="pb-4">Couple</th>
                    <th className="pb-4">Event Date</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4">Sort</th>
                    <th className="pb-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : errorMessage ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-red-600">
                        {errorMessage}
                      </td>
                    </tr>
                  ) : galleries.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center">
                        No gallery found
                      </td>
                    </tr>
                  ) : (
                    galleries.map((item) => (
                      <tr key={item.ID} className="border-b">
                        <td className="py-5">
                          <img
                            src={item.ImageURL}
                            alt={item.CoupleName}
                            className="h-16 w-24 rounded-md object-cover"
                          />
                        </td>
                        <td className="py-5">
                          <p className="font-medium">{item.CoupleName}</p>
                          <p className="text-sm text-gray-500">
                            {item.Location || "-"} / {item.Orientation}
                          </p>
                        </td>
                        <td className="py-5">{toDisplayDate(item.EventDate)}</td>
                        <td className="py-5">
                          {item.IsActive ? "Active" : "Inactive"}
                        </td>
                        <td className="py-5">{item.SortOrder}</td>
                        <td className="py-5">
                          <div className="flex justify-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleEdit(item)}
                              className="text-gray-600 hover:underline"
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item)}
                              className="text-red-600 hover:underline"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
