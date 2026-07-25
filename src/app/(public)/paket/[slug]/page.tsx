import { Inter, Montserrat, Questrial } from "next/font/google";
import { GoArrowLeft } from "react-icons/go";
import { getSettings } from "@/lib/api/setting";
import { GoArrowRight } from "react-icons/go";
import { getPackageBySlug } from "@/lib/api/package";
import NavigationBar from "@/component/navbar";
import Footer from "@/component/footer"
import Link from "next/link";

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

type Props = {
    params: Promise<{
        slug: string;
    }>;
};

export default async function PackageDetail({ params }: Props) {
    const { slug } = await params;

    const settings = await getSettings();
    const pkg = await getPackageBySlug(slug);

    return (
        <div className={montserrat.className}>
            {/* NAVBAR */}
            <div className="fixed z-10 w-full">
                <NavigationBar
                    primaryColor={settings.primary_color}
                    secondaryColor={settings.secondary_color}
                    variant="solid"
                />
            </div>
            
            {/* KONTEN */}
            <div className="px-6 pb-24 pt-28 sm:px-8 lg:px-15 lg:pb-46">
                <div  className="mx-auto flex max-w-7xl flex-col gap-y-8 lg:gap-y-10">
                    {/* BUTTON BACK */}
                    <div>
                        <Link href="/paket">
                            <div className="flex flex-row items-center gap-x-2 text-lg text-[#6b6b6b]">
                                <span className="text-xl"><GoArrowLeft /></span>
                                <span>Kembali ke paket</span>
                            </div>   
                        </Link>    
                    </div>   


                    {/* Nama Paket */}
                    <div style={{ color: settings.primary_color }}>
                        <h1 className="break-words text-4xl font-semibold leading-tight sm:text-5xl lg:text-7xl">{pkg.Name ?? slug}</h1>
                    </div>

                    {/* foto, harga, dan deskripsi */}
                    <div>
                        <div className="grid gap-8 lg:grid-cols-[1.45fr_1fr] lg:gap-13">
                            <div>
                                <img
                                    src={pkg.ImageURL}
                                    alt={pkg.Name}
                                    width={900}
                                    className="h-auto w-full rounded-lg object-cover"
                                />
                            </div>
                            <div>
                                <div className="flex flex-col ">
                                    <span>
                                        <h1 className="text-3xl font-semibold">Benefit Paket</h1>
                                    </span>
                                    <span className="mt-4">
                                        <ul className="list-disc pl-5 space-y-2">
                                            {(pkg.WhatYouGet ?? []).map((item: string, index: number) => (
                                                <li key={index}>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </span>
                                </div>            
                            </div>
                        </div>
                    </div>

                    {/* Benefit */}
                    <div className="flex flex-col pt-8">
                        <span>
                            <h1 className="text-2xl font-regular leading-tight sm:text-3xl">
                                <span>apa itu paket </span>
                                <span style={{ color: settings.primary_color }} className="font-semibold">{pkg.Name} ?</span>
                            </h1>
                        </span>
                        <span className="mt-4">
                            <div className="flex flex-col ">
                                    {/* Deskripsi */}
                                    <div>
                                        <span className="text-base leading-8 sm:text-lg">
                                            {pkg.Description}
                                        </span>
                                    </div>

                                    {/* harga paket */}
                                    <div className="pb-7 pt-12 text-2xl leading-tight sm:text-3xl lg:pt-25">
                                        <span>estimasi harga paket </span>
                                        <span>{pkg.Name}</span>
                                        <span></span>
                                    </div>
                                    {/* Harga */}
                                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-x-10">
                                        {/* mulai dari */}
                                        <div className="flex flex-col text-xl gap-y-2">
                                            <span>mulai dari:</span>
                                            <span className="break-words text-3xl sm:text-4xl lg:text-5xl">Rp {pkg.PriceFrom.toLocaleString("id-ID")}</span>
                                        </div>
                                        <div className="hidden flex-row items-center text-3xl sm:flex">
                                            <GoArrowRight />
                                        </div>
                                        {/* hingga dari */}
                                        <div className="flex flex-col text-xl gap-y-2">
                                            <span>hingga:</span>
                                            <span className="break-words text-3xl sm:text-4xl lg:text-5xl">Rp {pkg.PriceTo.toLocaleString("id-ID")}</span>
                                        </div>
                                    </div>
                               </div>
                        </span>
                    </div>
                    
                    {/* button konsultation */}
                    <div className="pt-10 flex-col">
                        <div className="border-l-2">
                            <p className="p-5 text-left text-base leading-8 italic sm:p-10 sm:text-lg">
                                "Setiap pernikahan memiliki kebutuhan yang berbeda, <br/>Konsultasikan konsep, jumlah tamu, dan anggaran Anda bersama tim Manten,<br/> Kami akan membantu merekomendasikan paket yang paling sesuai"
                            </p>
                        </div>
                        <div className="flex flex-col items-stretch justify-center pt-10 sm:items-end">
                            <Link
                                href="/konsultasi"
                                style={{
                                    backgroundColor: settings.primary_color,
                                }}
                                className="
                                    inline-flex items-center justify-center rounded-lg px-8 py-4 text-center font-medium text-white shadow-md transition-all duration-150 hover:brightness-110 hover:shadow-lg active:scale-95 active:shadow-sm
                                "
                            >
                                Simulasi & Konsultasi
                            </Link>
                        </div>
                    </div>



                </div>
            </div>


            {/* FOOTER */}
              <div>
                <div>
                    <Footer settings={settings} />
                </div>
            </div>
        </div>
    );
}
