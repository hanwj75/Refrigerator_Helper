import clsx from "clsx";
import { Link, NavLink } from "react-router-dom";
import { LanguageToggle } from "@/components/common/LanguageToggle";
import { GoogleLoginButton } from "@/features/auth/components/GoogleLoginButton";
import { useRecipeStore } from "@/store/useRecipeStore";

const navigationCopy = {
  ko: [
    { to: "/", label: "홈", end: true },
    { to: "/result", label: "추천 결과" },
    { to: "/saved", label: "저장한 레시피" },
    { to: "/about", label: "사이트 소개" },
    { to: "/contact", label: "문의하기" },
  ],
  en: [
    { to: "/", label: "Home", end: true },
    { to: "/result", label: "Results" },
    { to: "/saved", label: "Saved Recipes" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ],
} as const;

type NavigationItem = {
  to: string;
  label: string;
  end?: boolean;
};

export function PageTopBar() {
  const language = useRecipeStore((state) => state.language);
  const setLanguage = useRecipeStore((state) => state.setLanguage);
  const navigationItems = navigationCopy[language] as readonly NavigationItem[];

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <Link
        to="/"
        className="inline-flex self-start rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-200 transition hover:bg-brand-800"
      >
        {language === "ko" ? "냉장고를 도와줘" : "Help My Fridge"}
      </Link>

      <div className="flex flex-col gap-3 sm:items-end">
        <nav className="flex flex-wrap justify-end gap-2 text-sm text-stone-500">
          {navigationItems.map((item) => (
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

        <div className="flex flex-wrap items-center justify-end gap-3">
          <LanguageToggle value={language} onChange={setLanguage} />
          <GoogleLoginButton language={language} />
        </div>
      </div>
    </header>
  );
}
