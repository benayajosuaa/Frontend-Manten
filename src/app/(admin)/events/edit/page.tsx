"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiTrash2 } from "react-icons/fi";

import { deleteEvent, getEventById, updateEvent } from "@/lib/api/event";
import { getPackages } from "@/lib/api/package";

type EventForm = {
  couple_name: string;
  event_date: string;
  location: string;
  package_id: string;
};

function formatDateInput(value: string) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toISOString().slice(0, 10);
}

export default function EditEventPage() {
  const router = useRouter();

  const [eventId, setEventId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [packages, setPackages] = useState<any[]>([]);

  const [form, setForm] = useState<EventForm>({
    couple_name: "",
    event_date: "",
    location: "",
    package_id: "",
  });

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id") ?? "";
    setEventId(id);

    async function fetchEvent() {
      if (!id) {
        alert("Event ID is missing.");
        router.push("/events");
        return;
      }

      try {
        const [eventData, packagesData] = await Promise.all([
          getEventById(id),
          getPackages(),
        ]);

        setPackages(Array.isArray(packagesData) ? packagesData : []);
        setForm({
          couple_name: eventData.couple_name ?? eventData.CoupleName ?? "",
          event_date: formatDateInput(eventData.event_date ?? eventData.EventDate ?? ""),
          location: eventData.location ?? eventData.Location ?? "",
          package_id: eventData.package_id ?? eventData.PackageID ?? "",
        });
      } catch (error) {
        console.error(error);
        alert("Failed to load event.");
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [router]);

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

      await updateEvent(eventId, form);

      alert("Event updated successfully.");
      router.push("/events");
    } catch (error: any) {
      alert(error?.message || "Failed to update event.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete event "${form.couple_name || "this event"}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      await deleteEvent(eventId);

      alert("Event deleted successfully.");
      router.push("/events");
    } catch (error: any) {
      alert(error?.message || "Failed to delete event.");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        Loading event...
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Edit Event</h1>
          <p className="mt-2 text-gray-500">
            Update wedding schedule information.
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
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
              required
            >
              <option value="">Select package</option>
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

        <div className="mt-8 flex items-center justify-between gap-4 border-t pt-6">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting || saving}
            className="flex items-center gap-2 rounded-lg border border-red-200 px-5 py-3 font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiTrash2 />
            {deleting ? "Deleting..." : "Delete Event"}
          </button>

          <div className="flex items-center gap-4">
            <Link
              href="/events"
              className="rounded-lg border px-5 py-3 transition hover:bg-gray-100"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving || deleting}
              className="rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Event"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
