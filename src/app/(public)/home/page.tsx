import NavigationBar from "../../../component/navbar/index"
import Footer from "../../../component/footer/index"
import { getSettings } from "@/lib/api/setting";
import HomeHeroTitle from "@/component/hero-title";
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
    const slogan = settings.slogan;

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
                <div className="text-black bg-white">
                    <div className="relative h-screen">
                        <img className="w-screen h-screen object-cover" src="/web/wed.jpg" alt="Wedding" /> 
                        <div className="absolute inset-10 flex items-center justify-center p-20 text-center text-white font-bold text-4xl">
                            <HomeHeroTitle text={slogan} />
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 2 */}
            <div className={questrial.className}>
                <div style={{ color: settings.primary_color }}>
                    <div className="p-20 bg-white"> 
                        <div className="flex flex-col gap-10">
                            <div className="pt-8">
                                <h1 className="text-4xl">
                                    <span>tentang </span>
                                    <span className="font-semibold">{settings.brand_name}</span>
                                </h1>
                            </div>
                            <div className="flex flex-row gap-x-10">
                                <div className="basis-4/10 ">
                                    <img className="w-200 h-auto" src="web/home1.png" alt="" />
                                </div>
                                <div  className="basis-6/10 ">
                                    <p className="text-lg"> 
                                        Manten mendampingi setiap pasangan dalam mewujudkan pernikahan impian melalui perencanaan yang matang, koordinasi yang profesional, dan perhatian pada setiap detail. Kami percaya bahwa setiap pernikahan adalah cerita yang unik, sehingga setiap konsep dirancang secara personal sesuai kebutuhan dan karakter pasangan.
                                        <br/><br/>
                                        Didukung oleh tim yang berpengalaman, Manten menghadirkan pelayanan yang ramah, transparan, dan dapat dipercaya. Mulai dari intimate wedding hingga resepsi berskala besar, kami memastikan setiap rangkaian acara berjalan dengan lancar sehingga Anda dapat menikmati setiap momen tanpa rasa khawatir.
                                        <br/><br/>
                                        Bagi Manten, keberhasilan sebuah pernikahan bukan hanya tentang kemegahan acara, tetapi tentang kebahagiaan pasangan, keluarga, dan kenangan indah yang tercipta. Karena itu, kami berkomitmen untuk menghadirkan pengalaman pernikahan yang berkesan, berkualitas, dan penuh makna.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* SECTION 3 */}
            <div className={questrial.className}>
                <div style={{ color: settings.primary_color }}>
                    <div className="p-20 bg-white"> 
                       
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
