"use client";

import { useMemo, useState } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

type TestimonialItem = {
  ID?: string;
  id?: string;
  ClientName?: string;
  client_name?: string;
  PhotoURL?: string;
  photo_url?: string;
  Content?: string;
  content?: string;
  Rating?: number;
  rating?: number;
  SortOrder?: number;
  sort_order?: number;
};

type NormalizedTestimonial = {
  id: string;
  name: string;
  photoUrl: string;
  content: string;
  rating: number;
  sortOrder: number;
};

function normalizeTestimonials(items: TestimonialItem[]) {
  return items
    .map((item, index) => ({
      id: item.ID ?? item.id ?? String(index),
      name: item.ClientName ?? item.client_name ?? "Client Manten",
      photoUrl: item.PhotoURL ?? item.photo_url ?? "",
      content:
        item.Content ??
        item.content ??
        "Pengalaman bersama Manten terasa rapi, hangat, dan penuh perhatian.",
      rating: item.Rating ?? item.rating ?? 5,
      sortOrder: item.SortOrder ?? item.sort_order ?? index,
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

function InitialAvatar({ name, active }: { name: string; active: boolean }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
        active ? "bg-white text-[#394322]" : "bg-[#394322] text-white"
      }`}
    >
      {initials || "M"}
    </div>
  );
}

export default function TestimonialSlider({
  testimonials,
}: {
  testimonials: TestimonialItem[];
}) {
  const items = useMemo(
    () => normalizeTestimonials(testimonials),
    [testimonials]
  );
  const [activeIndex, setActiveIndex] = useState(0);

  if (items.length === 0) {
    return (
      <div className="border-y py-10 text-sm text-gray-500">
        Belum ada testimonial yang ditampilkan.
      </div>
    );
  }

  const goTo = (direction: "previous" | "next") => {
    setActiveIndex((current) => {
      if (direction === "previous") {
        return current === 0 ? items.length - 1 : current - 1;
      }

      return current === items.length - 1 ? 0 : current + 1;
    });
  };

  const visibleItems = [
    ...items.slice(activeIndex),
    ...items.slice(0, activeIndex),
  ];
  const progressWidth = `${((activeIndex + 1) / items.length) * 100}%`;

  return (
    <div className="w-full overflow-hidden">
      <div className="flex gap-5 overflow-hidden pb-8">
        {visibleItems.map((item, index) => {
          const active = index === 0;

          return (
            <article
              key={`${item.id}-${index}`}
              className={`flex min-h-65 w-[82vw] shrink-0 flex-col justify-between rounded-lg p-6 transition-all duration-300 sm:w-105 md:w-115 ${
                active
                  ? "bg-[#3F4A2C] text-white shadow-lg"
                  : "border border-gray-100 bg-[#f8f8f6] text-[#101828]"
              }`}
            >
              <div>
                <div
                  className={`mb-6 text-sm font-semibold ${
                    active ? "text-[#dbcd35]" : "text-[#394322]"
                  }`}
                >
                  {Math.max(1, Math.min(5, item.rating))} / 5
                </div>
                <p className="text-xl leading-snug md:text-2xl">
                  {item.content}
                </p>
              </div>

              <div className="mt-8 flex items-center gap-3">
                {item.photoUrl ? (
                  <img
                    src={item.photoUrl}
                    alt={item.name}
                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <InitialAvatar name={item.name} active={active} />
                )}
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold">{item.name}</h3>
                  <p
                    className={`mt-0.5 text-xs ${
                      active ? "text-slate-300" : "text-gray-500"
                    }`}
                  >
                    Manten Client
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="h-1 w-full max-w-4xl overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-[#3F4A2C] transition-all duration-300"
          style={{ width: progressWidth }}
        />
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={() => goTo("previous")}
          className="flex h-10 w-10 items-center justify-center rounded bg-[#3F4A2C] text-white transition hover:bg-[#a86139]"
          aria-label="Previous testimonial"
        >
          <FiArrowLeft />
        </button>
        <button
          type="button"
          onClick={() => goTo("next")}
          className="flex h-10 w-10 items-center justify-center rounded bg-[#3F4A2C] text-white transition hover:bg-[#a86139]"
          aria-label="Next testimonial"
        >
          <FiArrowRight />
        </button>
      </div>
    </div>
  );
}
