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
            <div className="flex min-h-screen flex-col lg:flex-row">

                {/* Sidebar */}
                <aside className="w-full bg-[#394322] p-5 text-white lg:min-h-screen lg:w-64">

                    <h1 className="mb-5 text-2xl font-bold lg:mb-10">
                        Manten
                    </h1>

                    <nav className="flex gap-3 overflow-x-auto pb-1 text-sm lg:flex-col lg:gap-4 lg:overflow-visible lg:pb-0 lg:text-base">

                        <a className="shrink-0 rounded-md px-2 py-1 hover:bg-white/10" href="/dashboard">Dashboard</a>

                        <a className="shrink-0 rounded-md px-2 py-1 hover:bg-white/10" href="/package">Package</a>

                        <a className="shrink-0 rounded-md px-2 py-1 hover:bg-white/10" href="/gallery">Gallery</a>

                        <a className="shrink-0 rounded-md px-2 py-1 hover:bg-white/10" href="/testimonial">Testimonial</a>

                        <a className="shrink-0 rounded-md px-2 py-1 hover:bg-white/10" href="/events">Event</a>

                        <a className="shrink-0 rounded-md px-2 py-1 hover:bg-white/10" href="/settings">Settings</a>

                    </nav>

                </aside>

                {/* Content */}
                <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">

                    {children}

                </main>

            </div>
        </div>
    );
}
