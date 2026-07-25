import NavigationBar from "../../../component/navbar/index";
import Footer from "../../../component/footer/index";
import { getSettings } from "@/lib/api/setting";
import { getPackages } from "@/lib/api/package";
import { getEvent } from "@/lib/api/event";
import { Inter, Montserrat, Questrial } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});

export const questrial = Questrial({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-questrial",
});

export const dynamic = "force-dynamic";

export default async function Home() {
  // 1. Fetch data secara paralel
  const [settings, packagesData, eventsData] = await Promise.all([
    getSettings(),
    getPackages(),
    getEvent(),
  ]);

  // Pastikan data berbentuk array (fallback ke empty array jika null/undefined)
  const packages = Array.isArray(packagesData) ? packagesData : [];
  const events = Array.isArray(eventsData) ? eventsData : [];

  // 2. PERBAIKAN: Buat Map untuk lookup nama paket berdasarkan package_id
  const packageMap = new Map(
    packages.map((pkg: any) => [pkg.id, pkg.name || pkg.title || "Unknown Package"])
  );

  // 3. Grouping event berdasarkan Bulan & Tahun
  const groupedEvents = events.reduce(
    (acc: Record<string, typeof events>, event: any) => {
      if (!event.event_date) return acc;

      const date = new Date(event.event_date);
      const key = date.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });

      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(event);
      return acc;
    },
    {}
  );

  // 4. Urutkan event di setiap bulan secara kronologis (Awal -> Akhir)
  Object.values(groupedEvents).forEach((monthEvents) => {
    monthEvents.sort(
      (a, b) =>
        new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
    );
  });

  return (
    <div className={`${inter.className} ${montserrat.variable} ${questrial.variable} min-h-screen bg-white text-black`}>
      {/* Navbar */}
      <div className="fixed top-0 z-10 w-full">
        <NavigationBar
          primaryColor={settings?.primary_color}
          secondaryColor={settings?.secondary_color}
          variant="solid"
        />
      </div>

      {/* SECTION 1 */}
      <main className={questrial.className}>
        <div className="px-6 py-16 pt-25 md:px-16 md:pt-36">
          <div className="flex flex-col gap-y-4">
            {/* Judul */}
            <div>
              <h1 className="text-3xl">
                <span>kegiatan terbaru </span>
                <span style={{ color: settings.primary_color }} className="font-semibold">{settings.brand_name}</span>
              </h1>
            </div>

            {/* List Event Berdasarkan Bulan */}
            <div className="mt-8 flex flex-col gap-16">
              {Object.keys(groupedEvents).length === 0 ? (
                <p className="text-gray-500">Belum ada kegiatan terbaru.</p>
              ) : (
                Object.entries(groupedEvents).map(([month, monthEvents]) => (
                  <div key={month}>
                    {/* Header Bulan */}
                    <div style={{ color: settings.primary_color }} className="mb-6 flex flex-row justify-end">
                      <h2 className={`${montserrat.className} text-4xl md:text-5xl font-semibold`}>
                        {month}
                      </h2>
                    </div>

                    {/* Garis Pemisah */}
                     <div className="border-t border-[#bfbfbf]" />


                    {/* List Event */}
                    <div className="flex flex-col">
                      {monthEvents.map((event: any) => {
                        const date = new Date(event.event_date);

                        return (
                          <div
                            key={event.id || event.event_date}
                            className="flex flex-row  items-center border-b  border-[#d8d8d8] 
                            py-8 hover:bg-neutral-50 transition-all cursor-pointer"
                          >
                            {/* Date */}
                            <div className="basis-4/10">
                              <div className="flex flex-row items-start ">
                                <p className="uppercase tracking-widest text-gray-600 text-2xl">
                                    {date.toLocaleDateString("en-US", {
                                    day: "2-digit",
                                    month: "short",
                                    })}
                                </p>
                              </div>
                            </div>

                            {/* Content */}
                            <div className="basis-6-/10">
                              <h3 className="text-2xl md:text-3xl font-medium">
                                {event.couple_name}
                              </h3>
                              <p className="mt-1 text-gray-500 text-sm md:text-base">
                                {event.location}
                              </p>
                              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-gray-400 font-semibold">
                                {packageMap.get(event.package_id) || "Standard Package"}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer>
        <Footer settings={settings} />
      </footer>
    </div>
  );
}