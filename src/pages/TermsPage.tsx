import { PageTopBar } from "@/components/layout/PageTopBar";
import { SeoMeta } from "@/components/seo/SeoMeta";
import { useRecipeStore } from "@/store/useRecipeStore";

const copy = {
  ko: {
    title: "이용약관",
    description:
      "냉장고를 도와줘 사이트 이용 시 적용되는 기본 이용 조건과 사용자 책임에 대한 안내입니다.",
    sections: [
      {
        title: "1. 서비스 성격",
        body: "본 사이트는 냉장고 재료 기반 메뉴 아이디어와 조리 흐름을 제공하는 정보성 서비스입니다. 제공되는 정보는 일반적인 참고용이며, 실제 조리 결과는 재료 상태와 조리 환경에 따라 달라질 수 있습니다.",
      },
      {
        title: "2. 사용자 책임",
        body: "이용자는 재료 신선도, 알레르기 유무, 위생 상태, 조리 안전을 직접 확인해야 합니다. 사이트에서 제공하는 안내만으로 안전성을 보장하지 않습니다.",
      },
      {
        title: "3. 콘텐츠와 기능 변경",
        body: "사이트의 기능, 문구, 제공 정보는 운영 목적에 따라 변경되거나 중단될 수 있습니다. 중요한 정책 변경이 있을 경우 관련 문서를 갱신합니다.",
      },
      {
        title: "4. 외부 링크 및 제3자 서비스",
        body: "사이트는 GitHub, Google AdSense 등 외부 서비스를 함께 사용할 수 있습니다. 외부 서비스의 정책과 처리 방식은 각 제공자의 기준을 따릅니다.",
      },
      {
        title: "5. 면책",
        body: "운영자는 사이트 이용으로 발생한 직접적 또는 간접적 손해에 대해 법에서 허용하는 범위 내에서 책임을 제한할 수 있습니다.",
      },
    ],
  },
  en: {
    title: "Terms of Service",
    description:
      "Basic terms and user responsibilities for using the Refrigerator Helper website.",
    sections: [
      {
        title: "1. Nature of the service",
        body: "This website provides meal ideas and cooking flow based on fridge ingredients. The information is for general guidance only, and real results may vary based on ingredient condition and cooking environment.",
      },
      {
        title: "2. User responsibility",
        body: "Users are responsible for checking ingredient freshness, allergy concerns, hygiene, and cooking safety. The site does not independently guarantee food safety.",
      },
      {
        title: "3. Changes to content and features",
        body: "Site features, text, and available information may change or be discontinued as the service evolves. Important policy changes will be reflected in the relevant documents.",
      },
      {
        title: "4. External links and third-party services",
        body: "The site may use third-party services such as GitHub and Google AdSense. Their policies and data handling are governed by each provider.",
      },
      {
        title: "5. Limitation of liability",
        body: "To the extent permitted by law, the operator may limit liability for direct or indirect damages related to the use of this site.",
      },
    ],
  },
} as const;

export function TermsPage() {
  const language = useRecipeStore((state) => state.language);
  const currentCopy = copy[language];

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 pb-12 pt-5 sm:px-6 lg:px-8">
      <SeoMeta
        title={currentCopy.title}
        description={currentCopy.description}
      />
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
