"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import NavigationBar from "@/component/navbar";
import ConsultationWizard from "@/component/consultation-wizard";
import Footer from "@/component/footer";
import { getSettings, type Setting } from "@/lib/api/setting";
import { useConsultation } from "@/lib/consultation-context";
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

export default function ConsultationAddonPage() {
  const router = useRouter();
  const { consultation, isHydrated } = useConsultation();
  const [settings, setSettings] = useState<Setting>(fallbackSettings);

  useEffect(() => {
    if (!isHydrated) return;

    if (!consultation.package) {
      router.replace("/konsultasi");
      return;
    }

    getSettings()
      .then(setSettings)
      .catch(() => setSettings(fallbackSettings));
  }, [consultation.package, isHydrated, router]);

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
          <div className="mx-auto flex max-w-4xl flex-col gap-10">
            <ConsultationWizard
              currentStep={3}
              primaryColor={settings.primary_color}
            />

            <section className="flex flex-col gap-4">
              <p className="text-sm uppercase tracking-[0.18em] text-gray-500">
                Review
              </p>
              <h1 className="max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
                Cek lagi pilihan konsultasimu.
              </h1>
            </section>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="border-b border-gray-200 pb-6">
                <p className="mb-2 text-sm uppercase tracking-[0.18em] text-gray-500">
                  Package
                </p>
                <h2 className="text-3xl font-semibold">
                  {consultation.package?.Name}
                </h2>
                {consultation.package?.Description ? (
                  <p className="mt-3 leading-7 text-gray-600">
                    {consultation.package.Description}
                  </p>
                ) : null}
              </div>

              <div className="pt-6">
                <p className="mb-4 text-sm uppercase tracking-[0.18em] text-gray-500">
                  Addons
                </p>
                {consultation.addons.length === 0 ? (
                  <p className="text-gray-600">Tidak ada addon yang dipilih.</p>
                ) : (
                  <ul className="space-y-3">
                    {consultation.addons.map((addon) => (
                      <li
                        key={addon.id}
                        className="flex items-center justify-between gap-4 rounded-lg bg-gray-50 px-4 py-3"
                      >
                        <span className="font-medium">{addon.name}</span>
                        {typeof (addon.price_override ?? addon.price) ===
                        "number" ? (
                          <span className="text-sm text-gray-600">
                            Rp{" "}
                            {(addon.price_override ?? addon.price)!.toLocaleString(
                              "id-ID"
                            )}
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => router.push("/konsultasi-paket")}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-7 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                <ArrowLeft size={18} />
                Back
              </button>
              <button
                type="button"
                onClick={() => router.push("/check-konsultasi")}
                className="inline-flex items-center justify-center gap-2 rounded-lg px-7 py-3 font-semibold text-white transition"
                style={{ backgroundColor: settings.primary_color }}
              >
                Continue
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
