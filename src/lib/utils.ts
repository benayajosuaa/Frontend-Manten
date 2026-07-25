import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



// Helper untuk gabungkan event dengan nama paketnya
export function formatEvents(events: any[], packages: any[]) {
  // 1. Buat peta paket
  const packageMap = new Map(packages.map((pkg) => [pkg.id, pkg.name]));

  // 2. Grouping event berdasarkan Bulan & Tahun
  const grouped: Record<string, any[]> = {};

  events.forEach((event) => {
    const date = new Date(event.event_date);
    const monthYear = date.toLocaleString("en-US", { month: "long", year: "numeric" });

    if (!grouped[monthYear]) grouped[monthYear] = [];

    // Sisipkan nama paket langsung ke dalam object event agar mudah dipanggil di UI
    grouped[monthYear].push({
      ...event,
      formattedDate: date.toLocaleDateString("en-US", { day: "2-digit", month: "short" }),
      packageName: packageMap.get(event.package_id) || "-",
    });
  });

  return grouped;
}