"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import NavigationBar from "@/component/navbar";
import ConsultationWizard from "@/component/consultation-wizard";
import Footer from "@/component/footer";
import { getAddons, getPackageAddons } from "@/lib/api/package";
import { getSettings, type Setting } from "@/lib/api/setting";
import { useConsultation, type Addon } from "@/lib/consultation-context";
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

const fallbackSettings: Setting = {
  id: "",
  brand_name: "Manten",
  logo_url: "",
  slogan: "",
  whatsapp_number: "6281263110320",
  email: "",
  address: "",
  instagram_url: "",
  primary_color: "#394322",
  secondary_color: "#ffffff",
  created_at: "",
  updated_at: "",
};

export default function ConsultationPackagePage() {
  const router = useRouter();
  const { consultation, isHydrated, toggleAddon } = useConsultation();
  const [settings, setSettings] = useState<Setting>(fallbackSettings);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isHydrated) return;

    if (!consultation.package) {
      router.replace("/konsultasi");
      return;
    }

    async function loadData() {
      try {
        const packageId =
          consultation.package!.ID ?? consultation.package!.id ?? "";
        const [settingsData, addonsData] = await Promise.all([
          getSettings(),
          getPackageAddons(packageId),
        ]);
        const availableAddons =
          Array.isArray(addonsData) && addonsData.length > 0
            ? addonsData
            : await getAddons();

        setSettings(settingsData);
        setAddons(
          availableAddons.filter((addon: any) => {
            if ("is_active" in addon && addon.is_active === false) return false;
            if ("is_available" in addon && addon.is_available === false) {
              return false;
            }
            return true;
          })
        );
      } catch (err: any) {
        setError(err?.message || "Gagal memuat addon paket.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [consultation.package, isHydrated, router]);

  const selectedIds = consultation.addons.map((item) => item.id);

  return (
    <div className={montserrat.className}>
      <div className="min-h-screen bg-white text-black">
        <div className="fixed z-10 w-full">
          <NavigationBar
            primaryColor={settings.primary_color}
            secondaryColor={settings.secondary_color}
            variant="solid"
          />
        </div>

        <main className="px-6 pb-24 pt-28 sm:px-8 md:px-15">
          <div className="mx-auto flex max-w-5xl flex-col gap-10">
            <ConsultationWizard
              currentStep={2}
              primaryColor={settings.primary_color}
            />

            <section className="flex flex-col gap-4">
              <p className="text-sm uppercase tracking-[0.18em] text-gray-500">
                {consultation.package?.Name}
              </p>
              <h1 className="max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
                Tambahkan layanan yang kamu minati.
              </h1>
            </section>

            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">
                {error}
              </div>
            ) : loading ? (
              <div className="rounded-lg border border-gray-200 p-8 text-center text-gray-500">
                Loading addon...
              </div>
            ) : addons.length === 0 ? (
              <div className="rounded-lg border border-gray-200 p-8 text-center text-gray-500">
                Belum ada addon untuk paket ini.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {addons.map((addon) => {
                  const isSelected = selectedIds.includes(addon.id);
                  const price = addon.price_override ?? addon.price;

                  return (
                    <label
                      key={addon.id}
                      className="flex cursor-pointer gap-4 rounded-lg border bg-white p-5 shadow-sm transition hover:shadow-md"
                      style={{
                        borderColor: isSelected
                          ? settings.primary_color
                          : "#e5e7eb",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleAddon(addon)}
                        className="mt-1 h-5 w-5 accent-[#394322]"
                      />
                      <span className="flex min-w-0 flex-1 flex-col gap-2">
                        <span className="text-xl font-semibold">
                          {addon.name}
                        </span>
                        {addon.description ? (
                          <span className="text-sm leading-6 text-gray-600">
                            {addon.description}
                          </span>
                        ) : null}
                        {typeof price === "number" ? (
                          <span className="text-sm font-semibold text-gray-900">
                            Rp {price.toLocaleString("id-ID")}
                          </span>
                        ) : null}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => router.push("/konsultasi")}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-7 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                <ArrowLeft size={18} />
                Back
              </button>
              <button
                type="button"
                onClick={() => router.push("/konsultasi-addon")}
                className="inline-flex items-center justify-center gap-2 rounded-lg px-7 py-3 font-semibold text-white transition"
                style={{ backgroundColor: settings.primary_color }}
              >
                Next
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </main>

        <Footer settings={settings} />
      </div>
    </div>
  );
}
