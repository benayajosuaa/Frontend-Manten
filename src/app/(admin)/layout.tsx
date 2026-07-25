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



export default function AdminLayout({ children,}: { children: React.ReactNode;}) {
    return (
        <div className={montserrat.className}>
            <div className="min-h-screen flex">

                {/* Sidebar */}
                <aside className="w-64 bg-[#394322] text-white p-5">

                    <h1 className="text-2xl font-bold mb-10">
                        Manten
                    </h1>

                    <nav className="flex flex-col gap-4">

                        <a href="/dashboard">Dashboard</a>

                        <a href="/package">Package</a>

                        <a href="/gallery">Gallery</a>

                        <a href="/testimonial">Testimonial</a>

                        <a href="/events">Event</a>

                        <a href="/settings">Settings</a>

                    </nav>

                </aside>

                {/* Content */}
                <main className="flex-1 p-8">

                    {children}

                </main>

            </div>
        </div>
    );
}