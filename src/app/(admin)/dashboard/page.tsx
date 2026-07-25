"use client";

import { useEffect, useState } from "react";
import { Inter, Montserrat, Questrial } from "next/font/google";
import { useRouter } from "next/navigation";
import { getSettings } from "@/lib/api/setting";

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

export default function DashboardPagee() {
  const router = useRouter();
  const [settings, setSettings] = useState<any>(null);

  // Ambil data settings di client-side
  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (error) {
        console.error("Gagal mengambil settings:", error);
      }
    }
    fetchSettings();
  }, []);

  // Client-side logout handler
  const handleLogout = () => {
    try {
      // 1. Hapus token dari Storage (jika kamu menyimpannya di sini)
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.clear();

      // 2. Hapus cookie di browser (sesuaikan nama cookie kamu, misal 'token')
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

      // 3. Redirect ke halaman /login
      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout gagal:", error);
    }
  };

  return (
    <div className={montserrat.className}>
      <div className="p-5">
        <div className="flex flex-col gap-y-10">
          {/* judul */}
          <div className="text-2xl font-semibold">Dashboard Admin</div>

          {/* section link */}
          <div className="p-6 border-l pl-5 italic">
            "hai selamat datang di halaman utama dashboard dari sistem ini,
            <br />
            untuk mengatur segala jenis tampilan client web, bisa pilih menu
            yang ada
            <br />
            pada bagian samping dashboard
            <br />
            terima kasih"
          </div>

          <div>
            <button
              style={{ backgroundColor: settings?.primary_color || "#000" }}
              onClick={handleLogout}
              className="rounded-lg px-5 py-2 text-white"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}