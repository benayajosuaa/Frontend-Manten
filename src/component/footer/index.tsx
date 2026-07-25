import Link from "next/link";
import { Inter, Montserrat, Questrial } from "next/font/google";
import type { Setting } from "@/lib/api/setting";

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


interface FooterProps {
  settings: Setting;
}

export default function Footer({ settings }: FooterProps){
    return (
        <div className={questrial.className}>
            <div className="bg-[#3F4A2C] px-6 py-12 text-white sm:px-8 lg:px-15 lg:py-15">
                <div className="flex flex-col gap-10">
                  {/* LOGO & HYPERLINK & KONTAK*/}
                  <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
                    {/* ROW 1 */}
                    <div className="flex max-w-xl flex-col justify-between gap-y-1 text-base sm:text-lg">
                      {/* Logo */}
                      <div className="pb-5">
                        <img src="/logo/manten-putih.png" className="h-5 w-auto" alt={settings.brand_name} />
                      </div>
                      {/* Tulisan Keterangan */}
                      <div className="flex flex-col">
                         <div>
                          <span>{settings.slogan}</span>
                        </div>
                        <div>
                          <span className="text-base">{settings.address}</span>
                        </div>
                        <div>
                          <span className="text-base">{settings.email}</span>
                        </div>
                        <div className="mt-5 underline">
                          <Link className="text-base text-[#b1b1b1]" href="/login">
                            masuk ke sistem
                          </Link>
                        </div>
                      </div>
                    </div>
                    {/* ROW 2 */}
                    {/* hyperlink */}
                    <div className="grid gap-8 sm:grid-cols-2 lg:gap-x-20 lg:pr-12">
                      {/* 1 */}
                      <div className="flex flex-col text-lg ">
                        <div className="pb-4 font-bold text-[#b9b9b9]">Link</div>
                        <div className="text-base">Portofolio</div>
                        <div className="text-base">Jadwal Kami</div>
                        <div className="text-base">Paket</div>
                        <div className="text-base">Kontak</div>
                      </div>
                      {/* 2 */}
                      <div className="flex flex-col text-lg ">
                        <div className="pb-4 font-bold text-[#b9b9b9]">Kontak Kami</div>
                        <div>
                          <span className="text-base">email: {settings.email}</span>
                        </div>
                        <div>
                          <span className="text-base">whatsapp: +{settings.whatsapp_number}</span>
                        </div>
                      </div>
                    </div>                  
                  </div>

                  <div className="pt-8 lg:pt-20">
                    <h1 className="text-center text-base">Manten © 2026. All rights reserved, part of <span><Link target="blank" href="https://www.kamar320.com/" className="underline">kamar320</Link></span></h1>
                  </div>   
                </div>
            </div>
        </div>
    )
}
