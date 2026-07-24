"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiPlus, FiTrash2, FiUpload } from "react-icons/fi";

import { createPackage } from "@/lib/api/package";
import { uploadImage } from "@/lib/api/upload";

type PackageForm = {
  name: string;
  description: string;
  image_url: string;
  what_you_get: string[];
  price_from: number;
  price_to: number;
  sort_order: number;
  is_active: boolean;
};

export default function CreatePackage() {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [imageInputMode, setImageInputMode] = useState<"url" | "upload">("url");
  const [uploadingImage, setUploadingImage] = useState(false);

  const [form, setForm] = useState<PackageForm>({
    name: "",
    description: "",
    image_url: "",
    what_you_get: [],
    price_from: 0,
    price_to: 0,
    sort_order: 0,
    is_active: true,
  });

  function handleChange(
    field: keyof PackageForm,
    value: string | number | boolean
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function addBenefit() {
    setForm((prev) => ({
      ...prev,
      what_you_get: [...prev.what_you_get, ""],
    }));
  }

  function updateBenefit(index: number, value: string) {
    const items = [...form.what_you_get];
    items[index] = value;

    setForm((prev) => ({
      ...prev,
      what_you_get: items,
    }));
  }

  function removeBenefit(index: number) {
    setForm((prev) => ({
      ...prev,
      what_you_get: prev.what_you_get.filter((_, i) => i !== index),
    }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar.");
      e.target.value = "";
      return;
    }

    try {
      setUploadingImage(true);
      const data = await uploadImage(file, "packages");
      handleChange("image_url", data.url);
    } catch (error: any) {
      alert(error?.message || "Failed to upload image.");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setSaving(true);

      await createPackage({
        ...form,
        what_you_get: form.what_you_get
          .map((item) => item.trim())
          .filter(Boolean),
      });

      alert("Package created successfully.");
      router.push("/package");
    } catch (error: any) {
      alert(error?.message || "Failed to create package.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-5">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create Package</h1>
          <p className="mt-2 text-gray-500">
            Add a new wedding package to your website.
          </p>
        </div>

        <Link
          href="/package"
          className="flex items-center gap-2 rounded-lg border px-4 py-2 transition hover:bg-gray-100"
        >
          <FiArrowLeft />
          Back
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">
              Package Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
              placeholder="Traditional Wedding"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>
            <textarea
              rows={5}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
              placeholder="Write package description..."
            />
          </div>

          <div className="md:col-span-2">
            <div className="mb-2 flex items-center justify-between gap-4">
              <label className="block text-sm font-medium">Package Image</label>

              <div className="flex rounded-lg border p-1 text-sm">
                <button
                  type="button"
                  onClick={() => setImageInputMode("url")}
                  className={`rounded-md px-3 py-1.5 transition ${
                    imageInputMode === "url"
                      ? "bg-[#394322] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Public URL
                </button>
                <button
                  type="button"
                  onClick={() => setImageInputMode("upload")}
                  className={`rounded-md px-3 py-1.5 transition ${
                    imageInputMode === "upload"
                      ? "bg-[#394322] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Upload File
                </button>
              </div>
            </div>

            {imageInputMode === "url" ? (
              <input
                type="url"
                value={form.image_url}
                onChange={(e) => handleChange("image_url", e.target.value)}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                placeholder="https://..."
              />
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-4 py-8 text-center transition hover:bg-gray-50">
                <FiUpload className="text-2xl text-[#394322]" />
                <span className="text-sm font-medium">
                  {uploadingImage ? "Uploading..." : "Choose image from device"}
                </span>
                <span className="text-xs text-gray-500">
                  JPG, PNG, WEBP, or other image file
                </span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingImage}
                  onChange={handleImageUpload}
                  className="sr-only"
                />
              </label>
            )}

            {form.image_url && (
              <div className="mt-4 flex items-start gap-4 rounded-lg border p-3">
                <img
                  src={form.image_url}
                  alt="Package preview"
                  className="h-24 w-32 rounded-md object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">Current image URL</p>
                  <p className="mt-1 break-all text-xs text-gray-500">
                    {form.image_url}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Price From
            </label>
            <input
              type="number"
              value={form.price_from}
              onChange={(e) =>
                handleChange("price_from", Number(e.target.value))
              }
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Price To</label>
            <input
              type="number"
              value={form.price_to}
              onChange={(e) =>
                handleChange("price_to", Number(e.target.value))
              }
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

          <div className="flex items-center">
            <label className="mr-3 text-sm font-medium">Active</label>
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => handleChange("is_active", e.target.checked)}
              className="h-5 w-5"
            />
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">What You Get</h2>
            <button
              type="button"
              onClick={addBenefit}
              className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
            >
              <FiPlus />
              Add Item
            </button>
          </div>

          <div className="space-y-3">
            {form.what_you_get.length === 0 && (
              <p className="text-sm text-gray-500">No benefits yet.</p>
            )}

            {form.what_you_get.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateBenefit(index, e.target.value)}
                  placeholder="Example: Decoration"
                  className="flex-1 rounded-lg border px-4 py-3 outline-none focus:border-black"
                />

                <button
                  type="button"
                  onClick={() => removeBenefit(index)}
                  className="rounded-lg border p-3 text-red-600 hover:bg-red-50"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end gap-4 border-t pt-6">
          <Link
            href="/package"
            className="rounded-lg border px-5 py-3 transition hover:bg-gray-100"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving || uploadingImage}
            className="rounded-lg bg-[#394322] px-6 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Create Package"}
          </button>
        </div>
      </form>
    </div>
  );
}
