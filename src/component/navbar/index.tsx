"use client";

import { useEffect, useState } from "react";
import { Inter, Montserrat, Questrial } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

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


interface NavigationBarProps {
    primaryColor: string;
    secondaryColor: string;
    variant?: "transparent" | "solid";
}


const navItems = [
    {index:"1", href:"/portofolio", label:"Portofolio"},
    {index:"2", href:"/jadwal", label:"Jadwal Kami"},
    {index:"3", href:"/paket", label:"Paket"},
    {index:"4", href:"/konsultasi", label:"Konsultasi"},
]




export default function NavigationBar({ primaryColor, secondaryColor, variant = "transparent",}: NavigationBarProps){
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const isSolid = variant === "solid" || isScrolled;
    const logoSrc = isSolid ? "/logo/manten.png" : "/logo/manten-putih.png";

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 24);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className={montserrat.className}>
            <div
                className="px-5 py-4 transition-all duration-300 sm:px-8 lg:px-15"
                style={{
                    backgroundColor: isSolid ? secondaryColor : "transparent",
                    color: isSolid ? primaryColor : "#ffffff",
                    boxShadow: isSolid ? "0 8px 30px rgba(0, 0, 0, 0.08)" : "none",
                }}
            >
                <div className="flex items-center justify-between">
                    <div className="relative h-9 w-28 sm:h-10 sm:w-32">
                        <Link href="/">
                            <Image
                                src={logoSrc}
                                alt="Manten"
                                fill
                                priority
                                className="object-contain object-left"
                            />
                        </Link>
                    </div>
                    <div className="hidden items-center gap-x-8 text-sm font-medium lg:flex">
                        {
                            navItems.map((x) => {
                                return(
                                    <Link
                                        key={x.index}
                                        href={x.href} 
                                    >
                                        {x.label}
                                    </Link>
                                )
                            })
                        }
                    </div>
                    <button
                        type="button"
                        aria-label={isOpen ? "Tutup menu" : "Buka menu"}
                        onClick={() => setIsOpen((value) => !value)}
                        className="grid h-10 w-10 place-items-center rounded-lg border border-current/20 lg:hidden"
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>  

                {isOpen ? (
                    <div className="mt-4 grid gap-2 rounded-lg border border-black/10 bg-white p-3 text-[#394322] shadow-lg lg:hidden">
                        {navItems.map((x) => (
                            <Link
                                key={x.index}
                                href={x.href}
                                onClick={() => setIsOpen(false)}
                                className="rounded-md px-3 py-3 text-sm font-medium hover:bg-gray-50"
                            >
                                {x.label}
                            </Link>
                        ))}
                    </div>
                ) : null}
            </div>
        </div>
    )
}
