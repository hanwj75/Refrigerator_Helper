import clsx from "clsx";
import { Link, NavLink } from "react-router-dom";
import { LanguageToggle } from "@/components/common/LanguageToggle";
import { useRecipeStore } from "@/store/useRecipeStore";

const navigationCopy = {
  ko: [
    { to: "/", label: "홈", end: true },
    { to: "/result", label: "추천 결과" },
    { to: "/saved", label: "저장 목록" },
    { to: "/about", label: "사이트 소개" },
    { to: "/contact", label: "문의" },
  ],
  en: [
    { to: "/", label: "Home", end: true },
    { to: "/result", label: "Results" },
    { to: "/saved", label: "Saved" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ],
};

export function PageTopBar() {
  const language = useRecipeStore((state) => state.language);
  const setLanguage = useRecipeStore((state) => state.setLanguage);

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <Link
        to="/"
        className="inline-flex self-start rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-200 transition hover:bg-brand-800"
      >
        냉장고를 도와줘
      </Link>

      <div className="flex flex-col gap-3 sm:items-end">
        <nav className="flex flex-wrap justify-end gap-2 text-sm text-stone-500">
          {navigationCopy[language].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                clsx(
                  "rounded-full px-3 py-2 transition-colors",
                  isActive ? "bg-brand-50 text-brand-800" : "hover:text-stone-900",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex justify-end">
          <LanguageToggle value={language} onChange={setLanguage} />
        </div>
      </div>
    </header>
  );
}
