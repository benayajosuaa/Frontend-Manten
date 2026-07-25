import NavigationBar from "../../../component/navbar/index"
import Footer from "../../../component/footer/index"
import { getSettings } from "@/lib/api/setting";
import { getGalleries } from "@/lib/api/gallery";
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
    const [settings, galleriesData] = await Promise.all([
        getSettings(),
        getGalleries(),
    ]);
    const galleries = (Array.isArray(galleriesData) ? galleriesData : [])
        .filter((item: any) => item.IsActive ?? true)
        .sort((a: any, b: any) => (a.SortOrder ?? 0) - (b.SortOrder ?? 0));

    function getTileClass(item: any, index: number) {
        const orientation = String(item.Orientation ?? "").toLowerCase();

        if (orientation === "portrait") {
            return "md:row-span-2";
        }

        if (orientation === "landscape") {
            return index % 5 === 0 ? "md:col-span-2" : "";
        }

        return index % 6 === 0 ? "md:col-span-2" : index % 4 === 0 ? "md:row-span-2" : "";
    }

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

            {/* Section */}
            <div className={questrial.className}>
                <div className="text-black bg-white">
                    <main className="px-6 pb-20 pt-28 sm:px-8 md:px-15 md:pt-32">
                        <div className="flex flex-col gap-y-10">
                            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                                <h1 className={`${montserrat.className} max-w-2xl text-4xl font-semibold leading-tight md:text-6xl`}>
                                    Photo Gallery
                                </h1>
                                <p className="max-w-xs text-sm leading-relaxed text-gray-500 md:text-right">
                                    Momen pilihan dari pasangan yang sudah mempercayakan hari bahagianya bersama {settings.brand_name}.
                                </p>
                            </div>

                            {galleries.length === 0 ? (
                                <div className="border-y py-16 text-center text-sm text-gray-500">
                                    Belum ada foto portofolio yang ditampilkan.
                                </div>
                            ) : (
                                <div className="grid auto-rows-[220px] grid-cols-1 gap-2 sm:grid-cols-2 md:auto-rows-[240px] md:grid-cols-4">
                                    {galleries.map((item: any, index: number) => (
                                        <article
                                            key={item.ID ?? index}
                                            className={`group relative overflow-hidden rounded-lg bg-gray-100 ${getTileClass(item, index)}`}
                                        >
                                            <img
                                                src={item.ImageURL}
                                                alt={item.CoupleName ?? "Wedding gallery"}
                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent opacity-80 transition group-hover:opacity-100" />
                                            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                                                <h2 className="text-lg font-semibold">
                                                    {item.CoupleName}
                                                </h2>
                                                <p className="mt-1 text-sm text-white/80">
                                                    {item.Location || "Wedding Moment"}
                                                </p>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>

        
            {/* FOOTER */}
            <div className="pt-10">
                <div>
                    <Footer settings={settings} />
                </div>
            </div>
            
        </div>
    )
}
