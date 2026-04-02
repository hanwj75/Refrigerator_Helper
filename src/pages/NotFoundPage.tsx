import { Link } from "react-router-dom";
import { PageTopBar } from "@/components/layout/PageTopBar";
import { SeoMeta } from "@/components/seo/SeoMeta";
import { useRecipeStore } from "@/store/useRecipeStore";

const copy = {
  ko: {
    title: "페이지를 찾을 수 없습니다",
    description:
      "요청하신 페이지가 없거나 주소가 변경되었습니다. 홈이나 주요 메뉴에서 다시 이동해 주세요.",
    home: "홈으로 이동",
    results: "추천 결과 보기",
  },
  en: {
    title: "Page not found",
    description:
      "The page you requested does not exist or may have moved. Please use the main navigation to continue.",
    home: "Go home",
    results: "View results",
  },
} as const;

export function NotFoundPage() {
  const language = useRecipeStore((state) => state.language);
  const currentCopy = copy[language];

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 pb-12 pt-5 sm:px-6 lg:px-8">
      <SeoMeta
        title={currentCopy.title}
        description={currentCopy.description}
      />
      <PageTopBar />

      <section className="mt-12 rounded-[2rem] border border-dashed border-stone-300 bg-white p-10 text-center shadow-[0_20px_60px_rgba(73,98,56,0.08)]">
        <h1 className="text-3xl font-semibold text-stone-900">{currentCopy.title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-stone-600">
          {currentCopy.description}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white">
            {currentCopy.home}
          </Link>
          <Link
            to="/result"
            className="rounded-full border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-700"
          >
            {currentCopy.results}
          </Link>
        </div>
      </section>
    </div>
  );
}
