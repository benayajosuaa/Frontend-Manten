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


export default function DashboardPagee(){
    return (
        <div className={montserrat.className}>
            <div className="p-5">
                <div className="flex flex-col gap-y-10">
                    {/* judul */}
                    <div className="text-2xl font-semibold">Dashboard Admin</div>
                    {/* section link */}
                    <div>

                    </div>
                    <div>1</div>
                    <div>1</div>
                    <div>1</div>
                </div>
            </div>
        </div>
    )
}