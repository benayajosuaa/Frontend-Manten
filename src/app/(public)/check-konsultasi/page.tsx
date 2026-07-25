"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
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

function buildWhatsAppMessage(packageName: string, addonNames: string[]) {
  const addonsText =
    addonNames.length > 0
      ? addonNames.map((name) => `• ${name}`).join("\n")
      : "• Tidak ada";

  return `Halo,

Saya tertarik untuk melakukan konsultasi mengenai paket pernikahan.

Paket yang saya pilih:
• ${packageName}

Tambahan yang saya minati:
${addonsText}

Mohon informasi lebih lanjut mengenai:

- Detail fasilitas
- Estimasi harga
- Jadwal yang masih tersedia

*saya juga tertarik untuk menggunakan jasa dari kamar320

Terima kasih.`;
}

export default function CheckConsultationPage() {
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

  function handleSendToWhatsApp() {
    if (!consultation.package) return;

    const phone = settings.whatsapp_number || "628970052654";
    const cleanPhone = phone.replace(/[^\d]/g, "") || "628970052654";
    const message = buildWhatsAppMessage(
      consultation.package.Name,
      consultation.addons.map((addon) => addon.name)
    );

    window.location.href = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
      message
    )}`;
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
          <div className="mx-auto flex max-w-4xl flex-col gap-10">
            <ConsultationWizard
              currentStep={4}
              primaryColor={settings.primary_color}
            />

            <section className="flex flex-col gap-4">
              <p className="text-sm uppercase tracking-[0.18em] text-gray-500">
                WhatsApp
              </p>
              <h1 className="max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
                Ringkasan konsultasi siap dikirim.
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
              </div>

              <div className="pt-6">
                <p className="mb-4 text-sm uppercase tracking-[0.18em] text-gray-500">
                  Addons
                </p>
                {consultation.addons.length === 0 ? (
                  <p className="text-gray-600">Tidak ada</p>
                ) : (
                  <ul className="space-y-3">
                    {consultation.addons.map((addon) => (
                      <li key={addon.id} className="text-lg">
                        • {addon.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => router.push("/konsultasi-addon")}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-7 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                <ArrowLeft size={18} />
                Back
              </button>
              <button
                type="button"
                onClick={handleSendToWhatsApp}
                className="inline-flex items-center justify-center gap-2 rounded-lg px-7 py-3 font-semibold text-white transition hover:brightness-110"
                style={{ backgroundColor: settings.primary_color }}
              >
                <Send size={18} />
                Send to WhatsApp
              </button>
            </div>
          </div>
        </main>

        <Footer settings={settings} />
      </div>
    </div>
  );
}
