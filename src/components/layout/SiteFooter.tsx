import { Link } from "react-router-dom";
import { SITE_NAME } from "@/lib/site";
import { useRecipeStore } from "@/store/useRecipeStore";

const footerCopy = {
  ko: {
    description:
      "냉장고 재료를 정리하고 집에서 바로 시도할 수 있는 현실적인 메뉴 아이디어를 살펴보는 서비스입니다.",
    about: "사이트 소개",
    privacy: "개인정보처리방침",
    terms: "이용약관",
    contact: "문의하기",
    notice:
      "이 사이트는 메뉴 아이디어와 요리 흐름을 정리해 주는 서비스입니다. 실제 조리 전에는 재료 신선도, 알레르기 여부, 조리 안전을 꼭 확인해 주세요.",
  },
  en: {
    description:
      "A practical service for organizing fridge ingredients and reviewing realistic meal ideas you can try at home.",
    about: "About",
    privacy: "Privacy",
    terms: "Terms",
    contact: "Contact",
    notice:
      "This site is designed to organize meal ideas and cooking flow. Always check ingredient freshness, allergy risks, and cooking safety before you cook.",
  },
} as const;

export function SiteFooter() {
  const language = useRecipeStore((state) => state.language);
  const currentCopy = footerCopy[language];

  return (
    <footer className="border-t border-stone-200 bg-white/80">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">{SITE_NAME}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
              {currentCopy.description}
            </p>
            <p className="mt-4 text-sm leading-6 text-stone-500">{currentCopy.notice}</p>
          </div>

          <div className="grid gap-3 text-sm text-stone-600 sm:grid-cols-2">
            <Link to="/about" className="hover:text-stone-900">
              {currentCopy.about}
            </Link>
            <Link to="/privacy" className="hover:text-stone-900">
              {currentCopy.privacy}
            </Link>
            <Link to="/terms" className="hover:text-stone-900">
              {currentCopy.terms}
            </Link>
            <Link to="/contact" className="hover:text-stone-900">
              {currentCopy.contact}
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-stone-200 pt-5 text-xs text-stone-500">
          © 2026 {SITE_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
