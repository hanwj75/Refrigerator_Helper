import clsx from "clsx";
import type { UiLanguage } from "@/types/ui";

type LanguageToggleProps = {
  value: UiLanguage;
  onChange: (language: UiLanguage) => void;
};

const languageOptions: { value: UiLanguage; label: string }[] = [
  { value: "ko", label: "KR" },
  { value: "en", label: "EN" },
];

export function LanguageToggle({ value, onChange }: LanguageToggleProps) {
  return (
    <div className="inline-flex rounded-full border border-white/70 bg-white/80 p-1 shadow-sm backdrop-blur">
      {languageOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={clsx(
            "rounded-full px-3 py-2 text-xs font-semibold tracking-[0.2em] transition-colors sm:px-4",
            value === option.value
              ? "bg-brand-700 text-white"
              : "text-stone-500 hover:text-stone-900",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
