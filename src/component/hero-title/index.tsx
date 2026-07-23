"use client";

import SplitText from "@/decoration/SplitText";

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

interface HomeHeroTitleProps {
  text: string;
}

export default function HomeHeroTitle({ text }: HomeHeroTitleProps) {
  return (
    <div className={montserrat.className}>
        <SplitText
            text={text}
            className="text-3xl font-semibold text-center"
            delay={50}
            duration={1.25}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            animateOnScroll={false}
            textAlign="center"
            onLetterAnimationComplete={() => {
                console.log("All letters have animated!");
            }}
        />
    </div>
  );
}
