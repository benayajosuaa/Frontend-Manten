import NavigationBar from "../../../component/navbar/index"
import Footer from "../../../component/footer/index"
import { getSettings } from "@/lib/api/setting";
import { getTestimonials } from "@/lib/api/testimonial";
import HomeHeroTitle from "@/component/hero-title";
import TestimonialSlider from "@/component/review-card";
import ScrollReveal from "@/component/scroll-reveal";
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
    const [settings, testimonialsData] = await Promise.all([
        getSettings(),
        getTestimonials(),
    ]);
    const slogan = settings.slogan;
    const testimonials = Array.isArray(testimonialsData) ? testimonialsData : [];

    return (
        <div className={inter.className}>
            {/* Navbar */}
            <div className="fixed z-10 w-full">
                <NavigationBar
                    primaryColor={settings.primary_color}
                    secondaryColor={settings.secondary_color}
                />
            </div>

            {/* SECTION 1 */}
            <div>
                <div className="bg-white text-black">
                    <div className="relative min-h-[620px] h-screen max-h-[980px] overflow-hidden">
                        <img className="h-full w-full object-cover" src="/web/wed.jpg" alt="Wedding" /> 
                        <div className="absolute inset-0 bg-black/25" />
                        <div className="absolute inset-0 flex items-center justify-center px-6 py-24 text-center text-3xl font-bold text-white sm:px-10 sm:text-4xl lg:px-20">
                            <HomeHeroTitle text={slogan} />
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 2 */}
            <div className={questrial.className}>
                <div style={{ color: settings.primary_color }}>
                    <div className="bg-white px-6 py-16 sm:px-8 lg:px-20 lg:py-24"> 
                        <div className="mx-auto flex max-w-7xl flex-col gap-10">
                            <ScrollReveal className="pt-0 lg:pt-8">
                                <h1 className="text-3xl sm:text-4xl">
                                    <span>tentang </span>
                                    <span className="font-semibold">{settings.brand_name}</span>
                                </h1>
                            </ScrollReveal>
                            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
                                <ScrollReveal>
                                    <img className="h-auto w-full rounded-lg object-cover" src="web/home1.png" alt="Manten wedding moment" />
                                </ScrollReveal>
                                <ScrollReveal delay={120}>
                                    <p className="text-base leading-8 sm:text-lg"> 
                                        Manten mendampingi setiap pasangan dalam mewujudkan pernikahan impian melalui perencanaan yang matang, koordinasi yang profesional, dan perhatian pada setiap detail. Kami percaya bahwa setiap pernikahan adalah cerita yang unik, sehingga setiap konsep dirancang secara personal sesuai kebutuhan dan karakter pasangan.
                                        <br/><br/>
                                        Didukung oleh tim yang berpengalaman, Manten menghadirkan pelayanan yang ramah, transparan, dan dapat dipercaya. Mulai dari intimate wedding hingga resepsi berskala besar, kami memastikan setiap rangkaian acara berjalan dengan lancar sehingga Anda dapat menikmati setiap momen tanpa rasa khawatir.
                                        <br/><br/>
                                        Bagi Manten, keberhasilan sebuah pernikahan bukan hanya tentang kemegahan acara, tetapi tentang kebahagiaan pasangan, keluarga, dan kenangan indah yang tercipta. Karena itu, kami berkomitmen untuk menghadirkan pengalaman pernikahan yang berkesan, berkualitas, dan penuh makna.
                                    </p>
                                </ScrollReveal>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* SECTION 3 */}
            <div className={questrial.className}>
                <div className="overflow-hidden bg-white px-6 py-16 sm:px-8 md:px-20">
                    <div className="mx-auto max-w-7xl">
                        <ScrollReveal className="mb-10">
                            <h1 className="text-3xl font-medium text-slate-900 md:text-4xl">
                                "kata mereka tentang kami"
                            </h1>
                            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                                Pengalaman nyata dari pasangan yang telah mempercayakan momen bahagia mereka bersama kami.
                            </p>
                        </ScrollReveal>

                        <ScrollReveal delay={120}>
                            <TestimonialSlider testimonials={testimonials} />
                        </ScrollReveal>
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
