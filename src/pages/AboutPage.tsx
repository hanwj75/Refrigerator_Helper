import { PageTopBar } from "@/components/layout/PageTopBar";
import { SeoMeta } from "@/components/seo/SeoMeta";
import { useRecipeStore } from "@/store/useRecipeStore";

const copy = {
  ko: {
    title: "사이트 소개",
    description:
      "냉장고를 도와줘는 냉장고에 남은 재료를 정리하고 집에서 실천할 수 있는 메뉴 아이디어와 조리 흐름을 보여 주기 위해 만든 서비스입니다.",
    missionTitle: "사이트가 하는 일",
    missionBody:
      "이 사이트는 사용자가 냉장고 속 재료를 바탕으로 현실적인 집밥 메뉴를 찾고, 저장하고, 단계별로 따라갈 수 있도록 돕는 것을 목표로 합니다.",
    valueTitle: "제공 가치",
    values: [
      "남은 재료를 버리지 않고 활용할 수 있도록 재료 중심으로 메뉴를 정리합니다.",
      "복잡한 설명보다 실제로 오늘 바로 시도할 수 있는 흐름을 우선합니다.",
      "추천 결과, 상세 조리 흐름, 저장 목록을 한 사이트 안에서 이어서 확인할 수 있게 구성합니다.",
    ],
    operationTitle: "운영 및 업데이트 방향",
    operationBody:
      "현재는 로컬 상태와 mock 데이터를 기반으로 동작하며, 서비스 품질과 사용성 검증 후 점진적으로 기능을 확장할 예정입니다. 운영 관련 문의는 문의 페이지를 통해 접수할 수 있습니다.",
  },
  en: {
    title: "About",
    description:
      "Refrigerator Helper is designed to organize leftover fridge ingredients into practical meal ideas and step-by-step cooking flow for home users.",
    missionTitle: "What this site does",
    missionBody:
      "The site helps users turn fridge ingredients into realistic home-cooking ideas, save recipes they like, and follow the cooking flow from start to finish.",
    valueTitle: "What users get",
    values: [
      "Ingredient-first meal ideas that help reduce waste.",
      "Practical cooking guidance focused on what people can actually cook today.",
      "A connected flow from recommendation to detail, cooking steps, and saved recipes.",
    ],
    operationTitle: "How the site is operated",
    operationBody:
      "The current version runs on local state and mock data while the product flow is being refined. Questions or feedback can be submitted through the contact page.",
  },
} as const;

export function AboutPage() {
  const language = useRecipeStore((state) => state.language);
  const currentCopy = copy[language];

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-12 pt-5 sm:px-6 lg:px-8">
      <SeoMeta
        title={currentCopy.title}
        description={currentCopy.description}
      />
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
