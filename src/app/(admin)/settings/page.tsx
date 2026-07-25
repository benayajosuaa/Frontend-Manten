"use client";

import { useEffect, useState } from "react";
import { Montserrat } from "next/font/google";
import { FiSave, FiUpload } from "react-icons/fi";

import { getSettings, updateSettings } from "@/lib/api/setting";
import { uploadImage } from "@/lib/api/upload";

export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});

type SettingsForm = {
  brand_name: string;
  logo_url: string;
  slogan: string;
  whatsapp_number: string;
  email: string;
  address: string;
  instagram_url: string;
  primary_color: string;
  secondary_color: string;
};

const initialForm: SettingsForm = {
  brand_name: "",
  logo_url: "",
  slogan: "",
  whatsapp_number: "",
  email: "",
  address: "",
  instagram_url: "",
  primary_color: "#394322",
  secondary_color: "#ffffff",
};

export default function SettingsPage() {
  const [form, setForm] = useState<SettingsForm>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await getSettings();
        setForm({
          brand_name: data?.brand_name ?? "",
          logo_url: data?.logo_url ?? "",
          slogan: data?.slogan ?? "",
          whatsapp_number: data?.whatsapp_number ?? "",
          email: data?.email ?? "",
          address: data?.address ?? "",
          instagram_url: data?.instagram_url ?? "",
          primary_color: data?.primary_color ?? "#394322",
          secondary_color: data?.secondary_color ?? "#ffffff",
        });
        setErrorMessage("");
      } catch (error: any) {
        console.error(error);
        setErrorMessage(error?.message || "Failed to load settings.");
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  function handleChange(field: keyof SettingsForm, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar.");
      e.target.value = "";
      return;
    }

    try {
      setUploading(true);
      const data = await uploadImage(file, "settings");
      handleChange("logo_url", data.url);
    } catch (error: any) {
      alert(error?.message || "Failed to upload logo.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setSaving(true);
      await updateSettings(form);
      alert("Settings updated successfully.");
    } catch (error: any) {
      alert(error?.message || "Failed to update settings.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        Loading settings...
      </div>
    );
  }

  return (
    <div className={montserrat.className}>
      <div className="p-5">
        <div className="flex flex-col gap-y-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col">
              <span className="text-2xl font-semibold">Settings</span>
              <span className="text-sm">
                Manage brand identity and contact information.
              </span>
            </div>
          </div>

          {errorMessage ? (
            <div className="rounded-lg border border-red-200 px-4 py-3 text-red-600">
              {errorMessage}
            </div>
          ) : null}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={form.brand_name}
                    onChange={(e) => handleChange("brand_name", e.target.value)}
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={form.whatsapp_number}
                    onChange={(e) =>
                      handleChange("whatsapp_number", e.target.value)
                    }
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={form.instagram_url}
                    onChange={(e) =>
                      handleChange("instagram_url", e.target.value)
                    }
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium">Slogan</label>
                  <input
                    type="text"
                    value={form.slogan}
                    onChange={(e) => handleChange("slogan", e.target.value)}
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium">Address</label>
                  <textarea
                    rows={4}
                    value={form.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Primary Color
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={form.primary_color}
                      onChange={(e) =>
                        handleChange("primary_color", e.target.value)
                      }
                      className="h-12 w-14 rounded-lg border bg-white p-1"
                    />
                    <input
                      type="text"
                      value={form.primary_color}
                      onChange={(e) =>
                        handleChange("primary_color", e.target.value)
                      }
                      className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Secondary Color
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={form.secondary_color}
                      onChange={(e) =>
                        handleChange("secondary_color", e.target.value)
                      }
                      className="h-12 w-14 rounded-lg border bg-white p-1"
                    />
                    <input
                      type="text"
                      value={form.secondary_color}
                      onChange={(e) =>
                        handleChange("secondary_color", e.target.value)
                      }
                      className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Logo</label>
                <div className="rounded-lg border p-4">
                  {form.logo_url ? (
                    <img
                      src={form.logo_url}
                      alt="Brand logo"
                      className="mx-auto h-28 max-w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-28 items-center justify-center rounded-md bg-gray-50 text-sm text-gray-500">
                      No logo
                    </div>
                  )}

                  <input
                    type="url"
                    value={form.logo_url}
                    onChange={(e) => handleChange("logo_url", e.target.value)}
                    className="mt-4 w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                    placeholder="https://..."
                    required
                  />

                  <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm transition hover:bg-gray-50">
                    <FiUpload />
                    {uploading ? "Uploading..." : "Upload Logo"}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploading}
                      onChange={handleLogoUpload}
                      className="sr-only"
                    />
                  </label>
                </div>

                <div
                  className="mt-4 rounded-lg px-4 py-5 text-white"
                  style={{ backgroundColor: form.primary_color }}
                >
                  <p className="text-sm opacity-80">Preview</p>
                  <p className="mt-1 text-xl font-semibold">{form.brand_name}</p>
                  <p style={{ color: form.secondary_color }} className="mt-2 text-sm">
                    {form.slogan}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-end gap-4 border-t pt-6">
              <button
                type="submit"
                disabled={saving || uploading}
                className="flex items-center gap-2 rounded-lg bg-[#394322] px-6 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiSave />
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
