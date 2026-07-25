"use client";

import { useEffect, useState } from "react";
import { Montserrat } from "next/font/google";
import { FiEdit2, FiPlus, FiTrash2, FiUpload, FiX } from "react-icons/fi";

import {
  createTestimonial,
  deleteTestimonial,
  getTestimonials,
  updateTestimonial,
} from "@/lib/api/testimonial";
import { uploadImage } from "@/lib/api/upload";

export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});

type TestimonialForm = {
  client_name: string;
  photo_url: string;
  content: string;
  rating: number;
  event_date: string;
  sort_order: number;
};

const initialForm: TestimonialForm = {
  client_name: "",
  photo_url: "",
  content: "",
  rating: 5,
  event_date: "",
  sort_order: 0,
};

function toDateInput(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

function toDisplayDate(value: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function toApiPayload(form: TestimonialForm) {
  return {
    ...form,
    event_date: form.event_date ? `${form.event_date}T00:00:00Z` : null,
  };
}

export default function TestimonialPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [form, setForm] = useState<TestimonialForm>(initialForm);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function fetchTestimonials() {
    try {
      setLoading(true);
      const data = await getTestimonials();
      setTestimonials(Array.isArray(data) ? data : []);
      setErrorMessage("");
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error?.message || "Failed to load testimonials.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTestimonials();
  }, []);

  function handleChange(
    field: keyof TestimonialForm,
    value: string | number
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleEdit(item: any) {
    setEditingId(item.ID);
    setForm({
      client_name: item.ClientName ?? "",
      photo_url: item.PhotoURL ?? "",
      content: item.Content ?? "",
      rating: item.Rating ?? 5,
      event_date: toDateInput(item.EventDate),
      sort_order: item.SortOrder ?? 0,
    });
  }

  function resetForm() {
    setEditingId("");
    setForm(initialForm);
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar.");
      e.target.value = "";
      return;
    }

    try {
      setUploading(true);
      const data = await uploadImage(file, "testimonials");
      handleChange("photo_url", data.url);
    } catch (error: any) {
      alert(error?.message || "Failed to upload photo.");
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
        await updateTestimonial(editingId, toApiPayload(form));
        alert("Testimonial updated successfully.");
      } else {
        await createTestimonial(toApiPayload(form));
        alert("Testimonial created successfully.");
      }

      resetForm();
      await fetchTestimonials();
    } catch (error: any) {
      alert(error?.message || "Failed to save testimonial.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: any) {
    const confirmed = window.confirm(
      `Delete testimonial "${item.ClientName}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await deleteTestimonial(item.ID);
      alert("Testimonial deleted successfully.");
      await fetchTestimonials();
      if (editingId === item.ID) resetForm();
    } catch (error: any) {
      alert(error?.message || "Failed to delete testimonial.");
    }
  }

  return (
    <div className={montserrat.className}>
      <div className="p-5">
        <div className="flex flex-col gap-y-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col">
              <span className="text-2xl font-semibold">Testimonial</span>
              <span className="text-sm">
                Manage client testimonials shown on your website.
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="border-b pb-8">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {editingId ? "Edit Testimonial" : "Create Testimonial"}
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
                  Client Name
                </label>
                <input
                  type="text"
                  value={form.client_name}
                  onChange={(e) => handleChange("client_name", e.target.value)}
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                  placeholder="Kenny & Kelly"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Rating</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={form.rating}
                  onChange={(e) => handleChange("rating", Number(e.target.value))}
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
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
                />
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

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">Photo</label>
                <div className="flex flex-col gap-3 md:flex-row">
                  <input
                    type="url"
                    value={form.photo_url}
                    onChange={(e) => handleChange("photo_url", e.target.value)}
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                    placeholder="https://..."
                  />
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm transition hover:bg-gray-50 md:w-52">
                    <FiUpload />
                    {uploading ? "Uploading..." : "Upload"}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploading}
                      onChange={handlePhotoUpload}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">Content</label>
                <textarea
                  rows={4}
                  value={form.content}
                  onChange={(e) => handleChange("content", e.target.value)}
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                  placeholder="Write testimonial..."
                  required
                />
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
                    ? "Save Testimonial"
                    : "Create Testimonial"}
              </button>
            </div>
          </form>

          <div>
            <h2 className="text-lg font-semibold">List Testimonial</h2>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm uppercase text-gray-500">
                    <th className="pb-4">Client</th>
                    <th className="pb-4">Rating</th>
                    <th className="pb-4">Event Date</th>
                    <th className="pb-4">Sort</th>
                    <th className="pb-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : errorMessage ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-red-600">
                        {errorMessage}
                      </td>
                    </tr>
                  ) : testimonials.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center">
                        No testimonial found
                      </td>
                    </tr>
                  ) : (
                    testimonials.map((item) => (
                      <tr key={item.ID} className="border-b align-top">
                        <td className="py-5">
                          <div className="flex items-center gap-3">
                            {item.PhotoURL && (
                              <img
                                src={item.PhotoURL}
                                alt={item.ClientName}
                                className="h-12 w-12 rounded-full object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium">{item.ClientName}</p>
                              <p className="line-clamp-2 max-w-md text-sm text-gray-500">
                                {item.Content}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-5">{item.Rating}/5</td>
                        <td className="py-5">{toDisplayDate(item.EventDate)}</td>
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
