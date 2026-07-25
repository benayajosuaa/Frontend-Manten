"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

import { createEvent } from "@/lib/api/event";
import { getPackages } from "@/lib/api/package";

type EventForm = {
  couple_name: string;
  event_date: string;
  location: string;
  package_id: string;
};

export default function CreateEventPage() {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [packages, setPackages] = useState<any[]>([]);

  const [form, setForm] = useState<EventForm>({
    couple_name: "",
    event_date: "",
    location: "",
    package_id: "",
  });

  useEffect(() => {
    async function fetchPackages() {
      try {
        const data = await getPackages();
        setPackages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        alert("Failed to load packages.");
      } finally {
        setLoadingPackages(false);
      }
    }

    fetchPackages();
  }, []);

  function handleChange(field: keyof EventForm, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setSaving(true);

      await createEvent(form);

      alert("Event created successfully.");
      router.push("/events");
    } catch (error: any) {
      alert(error?.message || "Failed to create event.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-5">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create Event</h1>
          <p className="mt-2 text-gray-500">
            Add a new wedding schedule to your website.
          </p>
        </div>

        <Link
          href="/events"
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
              Couple Name
            </label>
            <input
              type="text"
              value={form.couple_name}
              onChange={(e) => handleChange("couple_name", e.target.value)}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
              placeholder="Raffi Ahmad & Nagita Slavina"
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
            <label className="mb-2 block text-sm font-medium">Package</label>
            <select
              value={form.package_id}
              onChange={(e) => handleChange("package_id", e.target.value)}
              disabled={loadingPackages}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black disabled:cursor-not-allowed disabled:bg-gray-50"
              required
            >
              <option value="">
                {loadingPackages ? "Loading packages..." : "Select package"}
              </option>
              {packages.map((pkg) => {
                const packageId = pkg.ID ?? pkg.id;
                const packageName = pkg.Name ?? pkg.name ?? pkg.title ?? "-";

                return (
                  <option key={packageId} value={packageId}>
                    {packageName}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
              placeholder="Jakarta"
              required
            />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end gap-4 border-t pt-6">
          <Link
            href="/events"
            className="rounded-lg border px-5 py-3 transition hover:bg-gray-100"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving || loadingPackages}
            className="rounded-lg bg-[#394322] px-6 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
}
