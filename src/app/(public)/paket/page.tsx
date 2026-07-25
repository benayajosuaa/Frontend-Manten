import NavigationBar from "../../../component/navbar/index"
import Footer from "../../../component/footer/index"
import { getSettings } from "@/lib/api/setting";
import { getPackages } from "@/lib/api/package";
import HomeHeroTitle from "@/component/hero-title";
import Link from "next/link";
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

export default async function Home(){
    const settings = await getSettings();
    const packages = await getPackages()

    return (
        <div className={inter.className}>
            {/* Navbar */}
            <div className="fixed z-10 w-full">
                <NavigationBar
                    primaryColor={settings.primary_color}
                    secondaryColor={settings.secondary_color}
                    variant="solid"
                />
            </div>

            {/* SECTION 1 */}
            <div className={questrial.className}>
                <div className="text-black bg-white">
                    <div className="px-6 pb-20 pt-28 sm:px-8 md:pt-32 lg:px-15">
                        <div className="mx-auto flex max-w-7xl flex-col gap-y-10 lg:gap-y-15">
                            {/* Judul */}
                            <div>
                                <h1 className="text-3xl leading-tight sm:text-4xl">
                                    <span>paket yang </span>
                                    <span className="font-medium">{settings.brand_name}</span>
                                    <span> tawarkan</span>
                                </h1>
                            </div>

                            {/* Section Card */}
                            <div>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                                   {
                                        packages.map((pkg:any) => {
                                            const benefits = pkg.WhatYouGet || []
                                            const limitBenefit = benefits.slice(0, 5)
                                            
                                            return (
                                                <div
                                                    key={pkg.ID}
                                                    className="overflow-hidden rounded-lg border border-gray-200 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                                                >
                                                    {/* isi card */}
                                                    <div className="flex flex-col">
                                                        {/* image */}
                                                        <div>
                                                            <img 
                                                                src={pkg.ImageURL}
                                                                alt={pkg.Name}
                                                                className="h-52 w-full object-cover bg-amber-50 sm:h-56"
                                                            /> 
                                                        </div>

                                                        {/* TEXT INFORMATION */}
                                                        <div className="flex flex-col p-5 gap-y-4">
                                                            {/* judul */}
                                                            <div>
                                                                <h2 className="text-2xl font-regular">
                                                                    {pkg.Name}
                                                                </h2>
                                                            </div>
                                                            {/* deskripsi */}
                                                            <div>
                                                                    <p className="text-sm leading-6 text-gray-600">
                                                                    {pkg.Description}
                                                                </p>
                                                            </div>
                                                            {/* benefit */}
                                                            <div>
                                                                <div className="flex flex-col gap-2">
                                                                    {/* judul */}
                                                                    <span className="font-medium">
                                                                        Yang kamu dapat:
                                                                    </span>
                                                                    {/* list */}
                                                                    <ul className="space-y-1 text-sm text-gray-600">
                                                                        {limitBenefit.map((item: string) => (
                                                                            <li key={item}>
                                                                                • {item}
                                                                            </li>
                                                                        ))}
                                                                        {/* etc */}
                                                                        {benefits.length > 5 && (
                                                                            <li className="italic text-gray-400">
                                                                                • dan lain-lain...
                                                                            </li>
                                                                        )}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                            {/* kisaran harga */}
                                                            <div>
                                                                <div className="mt-4 mb-4 text-lg font-semibold">
                                                                    Rp {pkg.PriceFrom?.toLocaleString("id-ID")}
                                                                    {" - "}
                                                                    Rp {pkg.PriceTo?.toLocaleString("id-ID")}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* button lihat detail */}
                                                        <div className="p-5">
                                                            <div className="flex flex-col items-end text-[#848484] underline">
                                                                <Link href={`/paket/${pkg.Slug}`}>
                                                                    Lihat detail lebih lanjut
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            )



                                            
                                        })
                                   }
                                </div>
                            </div> 
                            
                            
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
    )
}
