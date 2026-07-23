"use client";

import { useEffect, useState } from "react";
import { Inter, Montserrat, Questrial } from "next/font/google";
import Image from "next/image";
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


interface NavigationBarProps {
    primaryColor: string;
    secondaryColor: string;
}


const navItems = [
    {index:"1", href:"/", label:"Portofolio"},
    {index:"2", href:"/", label:"Jadwal Kami"},
    {index:"3", href:"/", label:"Paket"},
    {index:"4", href:"/", label:"Kontak"},
]




export default function NavigationBar({ primaryColor, secondaryColor,}: NavigationBarProps){
    const [isScrolled, setIsScrolled] = useState(false);
    const logoSrc = isScrolled ? "/logo/manten.png" : "/logo/manten-putih.png";

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
                className="px-15 py-4 transition-all duration-300"
                style={{
                    backgroundColor: isScrolled ? secondaryColor : "transparent",
                    color: isScrolled ? primaryColor : "#ffffff",
                    boxShadow: isScrolled ? "0 8px 30px rgba(0, 0, 0, 0.08)" : "none",
                }}
            >
                <div className="flex flex-row text-xxl items-center justify-between">
                    <div className="relative h-10 w-32">
                        <Image
                            src={logoSrc}
                            alt="Manten"
                            fill
                            priority
                            className="object-contain object-left"
                        />
                    </div>
                    <div className="flex flex-row gap-x-10">
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
                </div>  
            </div>
        </div>
    )
}
