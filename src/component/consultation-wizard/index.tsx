"use client";

import Link from "next/link";
import { Check } from "lucide-react";

const steps = [
  { step: "Step 1", label: "Choose Package", href: "/konsultasi" },
  { step: "Step 2", label: "Choose Addons", href: "/konsultasi-paket" },
  { step: "Step 3", label: "Review", href: "/konsultasi-addon" },
  { step: "Step 4", label: "WhatsApp", href: "/check-konsultasi" },
];

type ConsultationWizardProps = {
  currentStep: number;
  primaryColor?: string;
};

export default function ConsultationWizard({
  currentStep,
  primaryColor = "#394322",
}: ConsultationWizardProps) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="grid min-w-180 grid-cols-4 gap-3">
        {steps.map((item, index) => {
          const stepNumber = index + 1;
          const isDone = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <Link
              key={item.step}
              href={item.href}
              className="flex items-center gap-3 border-b-2 pb-4 transition"
              style={{
                borderColor: isActive || isDone ? primaryColor : "#e5e7eb",
                color: isActive || isDone ? primaryColor : "#6b7280",
              }}
            >
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border text-sm font-semibold"
                style={{
                  borderColor: isActive || isDone ? primaryColor : "#d1d5db",
                  backgroundColor: isActive ? primaryColor : "#ffffff",
                  color: isActive ? "#ffffff" : undefined,
                }}
              >
                {isDone ? <Check size={16} /> : stepNumber}
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="text-xs uppercase tracking-wide">
                  {item.step}
                </span>
                <span className="truncate text-sm font-semibold">
                  {item.label}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
