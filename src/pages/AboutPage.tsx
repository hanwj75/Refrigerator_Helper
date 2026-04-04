import { PageTopBar } from "@/components/layout/PageTopBar";
import { SeoMeta } from "@/components/seo/SeoMeta";
import { useRecipeStore } from "@/store/useRecipeStore";

const copy = {
  ko: {
    title: "사이트 소개",
    description:
      "냉장고를 도와줘는 지금 있는 재료를 정리하고, 그 재료로 만들 수 있는 현실적인 집밥 메뉴와 조리 흐름을 보여주기 위한 서비스입니다.",
    missionTitle: "이 사이트가 하는 일",
    missionBody:
      "냉장고 속 재료를 바탕으로 메뉴를 고르고, 필요한 추가 재료와 요리 순서를 빠르게 확인할 수 있도록 돕습니다.",
    valueTitle: "사용자가 얻는 것",
    values: [
      "재료를 먼저 기준으로 보는 현실적인 메뉴 제안",
      "집에서 바로 따라 하기 쉬운 단계형 조리 흐름",
      "저장과 재방문을 고려한 실용적인 사용 경험",
    ],
    operationTitle: "운영 방향",
    operationBody:
      "현재 서비스는 추천 흐름과 저장 기능을 점진적으로 보강하는 단계이며, 문의 페이지를 통해 제안과 피드백을 받을 수 있습니다.",
  },
  en: {
    title: "About",
    description:
      "Help My Fridge is a service built to organize what you already have and turn those ingredients into practical home meal ideas and cooking flow.",
    missionTitle: "What this site does",
    missionBody:
      "It helps users choose meals from fridge ingredients and quickly review extra ingredients and cooking steps.",
    valueTitle: "What users get",
    values: [
      "Practical meal ideas built around ingredients first",
      "Step-by-step cooking flow that is easy to follow at home",
      "A useful experience designed for saving and revisiting recipes",
    ],
    operationTitle: "How the site is operated",
    operationBody:
      "The service is being improved step by step around recommendation flow and saving features, and feedback can be submitted through the contact page.",
  },
} as const;

export function AboutPage() {
  const language = useRecipeStore((state) => state.language);
  const currentCopy = copy[language];

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-12 pt-5 sm:px-6 lg:px-8">
      <SeoMeta title={currentCopy.title} description={currentCopy.description} />
      <PageTopBar />

      <section className="mt-8 rounded-[2rem] border border-white/70 bg-white p-8 shadow-[0_20px_60px_rgba(73,98,56,0.12)]">
        <h1 className="text-3xl font-semibold text-stone-900">{currentCopy.title}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-600">{currentCopy.description}</p>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <article className="rounded-[1.5rem] bg-stone-50 p-5">
            <h2 className="text-lg font-semibold text-stone-900">{currentCopy.missionTitle}</h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">{currentCopy.missionBody}</p>
          </article>
          <article className="rounded-[1.5rem] bg-brand-50/70 p-5">
            <h2 className="text-lg font-semibold text-stone-900">{currentCopy.valueTitle}</h2>
            <ul className="mt-3 space-y-3 text-sm leading-6 text-stone-600">
              {currentCopy.values.map((value) => (
                <li key={value}>{value}</li>
              ))}
            </ul>
          </article>
          <article className="rounded-[1.5rem] bg-stone-50 p-5">
            <h2 className="text-lg font-semibold text-stone-900">{currentCopy.operationTitle}</h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">{currentCopy.operationBody}</p>
          </article>
        </div>
      </section>
    </div>
  );
}
