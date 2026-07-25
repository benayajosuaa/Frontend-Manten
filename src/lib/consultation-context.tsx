"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type WeddingPackage = {
  ID: string;
  id?: string;
  Name: string;
  name?: string;
  Slug?: string;
  Description?: string;
  ImageURL?: string;
  PriceFrom?: number;
  PriceTo?: number;
  WhatYouGet?: string[];
};

export type Addon = {
  id: string;
  name: string;
  description?: string | null;
  image_url?: string | null;
  price?: number | null;
  price_override?: number | null;
};

type Consultation = {
  package: WeddingPackage | null;
  addons: Addon[];
};

type ConsultationContextValue = {
  consultation: Consultation;
  isHydrated: boolean;
  setPackage: (pkg: WeddingPackage) => void;
  setAddons: (addons: Addon[]) => void;
  toggleAddon: (addon: Addon) => void;
  clearConsultation: () => void;
};

const STORAGE_KEY = "manten-consultation";

const defaultConsultation: Consultation = {
  package: null,
  addons: [],
};

const ConsultationContext = createContext<ConsultationContextValue | null>(null);

export function ConsultationProvider({ children }: { children: ReactNode }) {
  const [consultation, setConsultation] =
    useState<Consultation>(defaultConsultation);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Consultation;
        setConsultation({
          package: parsed.package ?? null,
          addons: Array.isArray(parsed.addons) ? parsed.addons : [],
        });
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consultation));
  }, [consultation, isHydrated]);

  const value = useMemo<ConsultationContextValue>(
    () => ({
      consultation,
      isHydrated,
      setPackage: (pkg) => {
        setConsultation((current) => ({
          package: pkg,
          addons: current.package?.ID === pkg.ID ? current.addons : [],
        }));
      },
      setAddons: (addons) => {
        setConsultation((current) => ({ ...current, addons }));
      },
      toggleAddon: (addon) => {
        setConsultation((current) => {
          const exists = current.addons.some((item) => item.id === addon.id);

          return {
            ...current,
            addons: exists
              ? current.addons.filter((item) => item.id !== addon.id)
              : [...current.addons, addon],
          };
        });
      },
      clearConsultation: () => {
        setConsultation(defaultConsultation);
        localStorage.removeItem(STORAGE_KEY);
      },
    }),
    [consultation, isHydrated]
  );

  return (
    <ConsultationContext.Provider value={value}>
      {children}
    </ConsultationContext.Provider>
  );
}

export function useConsultation() {
  const context = useContext(ConsultationContext);

  if (!context) {
    throw new Error("useConsultation must be used inside ConsultationProvider");
  }

  return context;
}
