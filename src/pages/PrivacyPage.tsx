import { PageTopBar } from "@/components/layout/PageTopBar";
import { SeoMeta } from "@/components/seo/SeoMeta";
import { useRecipeStore } from "@/store/useRecipeStore";

const copy = {
  ko: {
    title: "개인정보처리방침",
    description:
      "냉장고를 도와줘에서 로컬 데이터, 쿠키, 광고, 외부 서비스 사용 방식을 어떻게 다루는지 안내합니다.",
    sections: [
      {
        title: "1. 수집 및 처리 정보",
        body: "현재 사이트는 재료 입력, 저장 정보, 언어 설정 등의 일부 데이터를 브라우저 저장소에 보관할 수 있습니다.",
      },
      {
        title: "2. 광고 및 쿠키",
        body: "이 사이트는 광고 제공을 위해 Google AdSense를 사용할 수 있으며, 그 과정에서 쿠키나 기기 관련 정보가 활용될 수 있습니다.",
      },
      {
        title: "3. 외부 서비스",
        body: "배포와 운영 과정에서 Cloudflare Pages와 같은 외부 인프라가 접속 로그를 처리할 수 있습니다.",
      },
      {
        title: "4. 사용자 선택",
        body: "브라우저 설정을 통해 쿠키를 제한하거나 로컬 저장 데이터를 직접 삭제할 수 있습니다.",
      },
      {
        title: "5. 문의",
        body: "개인정보 또는 정책 관련 문의는 사이트 내 문의 페이지를 통해 접수할 수 있습니다.",
      },
    ],
    contact: "문의 페이지로 이동",
  },
  en: {
    title: "Privacy Policy",
    description:
      "How Help My Fridge handles local data, cookies, advertising, and third-party services.",
    sections: [
      {
        title: "1. Information handled by the site",
        body: "The site may store some data such as ingredient input, saved data, and language settings in the browser.",
      },
      {
        title: "2. Advertising and cookies",
        body: "This site may use Google AdSense, and cookies or device-related information may be used for ad delivery and measurement.",
      },
      {
        title: "3. Third-party services",
        body: "Infrastructure services such as Cloudflare Pages may process access logs as part of hosting and operations.",
      },
      {
        title: "4. User choices",
        body: "Users can limit cookies or remove locally stored data through browser settings.",
      },
      {
        title: "5. Contact",
        body: "Privacy or policy-related questions can be submitted through the contact page on this site.",
      },
    ],
    contact: "Go to contact page",
  },
} as const;

export function PrivacyPage() {
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

        <a
          href="/contact"
          className="mt-8 inline-flex rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white"
        >
          {currentCopy.contact}
        </a>
      </article>
    </div>
  );
}
