"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import NavigationBar from "@/component/navbar";
import ConsultationWizard from "@/component/consultation-wizard";
import Footer from "@/component/footer";
import { getPackages } from "@/lib/api/package";
import { getSettings, type Setting } from "@/lib/api/setting";
import {
  useConsultation,
  type WeddingPackage,
} from "@/lib/consultation-context";
import { useRouter } from "next/navigation";
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

export default function ConsultationPage() {
  const router = useRouter();
  const { consultation, setPackage } = useConsultation();
  const [settings, setSettings] = useState<Setting>(fallbackSettings);
  const [packages, setPackages] = useState<WeddingPackage[]>([]);
  const [selectedId, setSelectedId] = useState(
    consultation.package?.ID ?? ""
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [settingsData, packagesData] = await Promise.all([
          getSettings(),
          getPackages(),
        ]);

        setSettings(settingsData);
        setPackages(Array.isArray(packagesData) ? packagesData : []);
      } catch (err: any) {
        setError(err?.message || "Gagal memuat paket konsultasi.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    setSelectedId(consultation.package?.ID ?? "");
  }, [consultation.package?.ID]);

  function handleNext() {
    const selectedPackage = packages.find((item) => item.ID === selectedId);
    if (!selectedPackage) return;

    setPackage(selectedPackage);
    router.push("/konsultasi-paket");
  }

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
          <div className="mx-auto flex max-w-6xl flex-col gap-10">
            <ConsultationWizard
              currentStep={1}
              primaryColor={settings.primary_color}
            />

            <section className="flex flex-col gap-4">
              <p className="text-sm uppercase tracking-[0.18em] text-gray-500">
                Konsultasi Pernikahan
              </p>
            <h1 className="max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
                Pilih paket yang paling dekat dengan rencana hari bahagiamu.
              </h1>
            </section>

            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">
                {error}
              </div>
            ) : loading ? (
              <div className="rounded-lg border border-gray-200 p-8 text-center text-gray-500">
                Loading paket...
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {packages.map((pkg) => {
                  const isSelected = selectedId === pkg.ID;

                  return (
                    <button
                      key={pkg.ID}
                      type="button"
                      onClick={() => setSelectedId(pkg.ID)}
                      className="overflow-hidden rounded-lg border bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                      style={{
                        borderColor: isSelected
                          ? settings.primary_color
                          : "#e5e7eb",
                        boxShadow: isSelected
                          ? `0 0 0 2px ${settings.primary_color}22`
                          : undefined,
                      }}
                    >
                      {pkg.ImageURL ? (
                        <img
                          src={pkg.ImageURL}
                          alt={pkg.Name}
                          className="h-48 w-full object-cover"
                        />
                      ) : null}
                      <div className="flex min-h-56 flex-col gap-4 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <h2 className="text-2xl font-semibold">{pkg.Name}</h2>
                          <span
                            className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border"
                            style={{
                              borderColor: isSelected
                                ? settings.primary_color
                                : "#d1d5db",
                              backgroundColor: isSelected
                                ? settings.primary_color
                                : "#ffffff",
                            }}
                          >
                            {isSelected ? (
                              <span className="h-2 w-2 rounded-full bg-white" />
                            ) : null}
                          </span>
                        </div>
                        <p className="line-clamp-3 text-sm leading-6 text-gray-600">
                          {pkg.Description}
                        </p>
                        {typeof pkg.PriceFrom === "number" &&
                        typeof pkg.PriceTo === "number" ? (
                          <p className="mt-auto text-lg font-semibold">
                            Rp {pkg.PriceFrom.toLocaleString("id-ID")} - Rp{" "}
                            {pkg.PriceTo.toLocaleString("id-ID")}
                          </p>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                disabled={!selectedId}
                className="inline-flex items-center gap-2 rounded-lg px-7 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
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
