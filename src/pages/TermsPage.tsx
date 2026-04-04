import { PageTopBar } from "@/components/layout/PageTopBar";
import { SeoMeta } from "@/components/seo/SeoMeta";
import { useRecipeStore } from "@/store/useRecipeStore";

const copy = {
  ko: {
    title: "이용약관",
    description:
      "냉장고를 도와줘 사이트 이용 시 적용되는 기본적인 이용 조건과 사용자 책임을 안내합니다.",
    sections: [
      {
        title: "1. 서비스 성격",
        body: "이 사이트는 냉장고 재료 기반 메뉴 아이디어와 조리 흐름을 제공하는 정보성 서비스입니다.",
      },
      {
        title: "2. 사용자 책임",
        body: "사용자는 재료 상태, 알레르기, 위생, 조리 안전 여부를 직접 확인해야 합니다.",
      },
      {
        title: "3. 기능 및 콘텐츠 변경",
        body: "사이트의 기능, 문구, 제공 정보는 운영 상황에 따라 변경되거나 중단될 수 있습니다.",
      },
      {
        title: "4. 외부 서비스",
        body: "사이트는 Google AdSense 등 외부 서비스를 함께 사용할 수 있으며, 각 서비스의 정책은 해당 제공자의 기준을 따릅니다.",
      },
      {
        title: "5. 책임의 한계",
        body: "법이 허용하는 범위 내에서 사이트 이용과 관련된 직접적 또는 간접적 손해에 대한 책임은 제한될 수 있습니다.",
      },
    ],
  },
  en: {
    title: "Terms of Service",
    description:
      "Basic terms and user responsibilities for using the Help My Fridge website.",
    sections: [
      {
        title: "1. Nature of the service",
        body: "This site provides meal ideas and cooking flow based on fridge ingredients.",
      },
      {
        title: "2. User responsibility",
        body: "Users are responsible for checking ingredient condition, allergy concerns, hygiene, and cooking safety.",
      },
      {
        title: "3. Changes to content and features",
        body: "Site features, text, and available information may change or be discontinued as the service evolves.",
      },
      {
        title: "4. Third-party services",
        body: "The site may use third-party services such as Google AdSense, and each provider's policies apply to those services.",
      },
      {
        title: "5. Limitation of liability",
        body: "To the extent permitted by law, liability related to the use of this site may be limited.",
      },
    ],
  },
} as const;

export function TermsPage() {
  const language = useRecipeStore((state) => state.language);
  const currentCopy = copy[language];

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 pb-12 pt-5 sm:px-6 lg:px-8">
      <SeoMeta title={currentCopy.title} description={currentCopy.description} />
      <PageTopBar />

      <article className="mt-8 rounded-[2rem] border border-white/70 bg-white p-8 shadow-[0_20px_60px_rgba(73,98,56,0.12)]">
        <h1 className="text-3xl font-semibold text-stone-900">{currentCopy.title}</h1>
        <p className="mt-4 text-sm leading-7 text-stone-600">{currentCopy.description}</p>

        <div className="mt-8 space-y-8">
          {currentCopy.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold text-stone-900">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-stone-600">{section.body}</p>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
