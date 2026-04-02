import { PageTopBar } from "@/components/layout/PageTopBar";
import { SeoMeta } from "@/components/seo/SeoMeta";
import { SITE_ISSUES_URL } from "@/lib/site";
import { useRecipeStore } from "@/store/useRecipeStore";

const copy = {
  ko: {
    title: "개인정보처리방침",
    description:
      "냉장고를 도와줘의 개인정보 처리, 쿠키 사용, 광고 및 제3자 서비스 사용 방식에 대한 안내입니다.",
    sections: [
      {
        title: "1. 수집 및 처리되는 정보",
        body: "현재 사이트는 계정 가입 기능 없이 이용할 수 있으며, 사용자가 입력한 재료나 저장 목록은 브라우저의 로컬 저장소에 보관될 수 있습니다. 서버 데이터베이스에 회원 정보를 저장하는 구조는 현재 적용되어 있지 않습니다.",
      },
      {
        title: "2. 광고 및 쿠키",
        body: "본 사이트는 Google AdSense 광고 스크립트를 사용할 수 있으며, 이 과정에서 쿠키 또는 기기 식별 정보가 광고 제공, 빈도 제한, 성과 측정 목적으로 활용될 수 있습니다. Google의 광고 처리 방식은 Google의 정책과 개인정보 보호 문서를 따릅니다.",
      },
      {
        title: "3. 제3자 서비스",
        body: "사이트 운영 과정에서 Cloudflare Pages와 같은 호스팅 또는 배포 플랫폼이 접속 로그를 처리할 수 있습니다. 추가 분석 도구가 도입되는 경우 이 문서를 업데이트합니다.",
      },
      {
        title: "4. 이용자 선택권",
        body: "브라우저 설정을 통해 쿠키를 제한하거나 로컬 저장소 데이터를 직접 삭제할 수 있습니다. 단, 일부 사용자 설정은 초기화될 수 있습니다.",
      },
      {
        title: "5. 문의 방법",
        body: "개인정보와 정책 관련 문의는 GitHub Issues 채널을 통해 접수할 수 있으며, 운영 측은 확인 가능한 범위에서 응답합니다.",
      },
    ],
    contact: "문의 채널 열기",
  },
  en: {
    title: "Privacy Policy",
    description:
      "How Refrigerator Helper handles local data, cookies, advertising, and third-party services.",
    sections: [
      {
        title: "1. Information handled by the site",
        body: "The site currently works without account registration. Ingredients entered by users and saved recipe data may be stored in the browser's local storage. A member database is not currently used.",
      },
      {
        title: "2. Advertising and cookies",
        body: "This site may use Google AdSense ad scripts. Cookies or device-related identifiers may be used for ad delivery, frequency control, and performance measurement, subject to Google's own policies and privacy practices.",
      },
      {
        title: "3. Third-party services",
        body: "Hosting or deployment services such as Cloudflare Pages may process access logs as part of site operation. If more analytics tools are added later, this policy will be updated.",
      },
      {
        title: "4. User choices",
        body: "Users can restrict cookies or clear local storage through browser settings. Doing so may reset saved preferences on this site.",
      },
      {
        title: "5. Contact",
        body: "Privacy and policy-related requests can be sent through the GitHub Issues contact channel, and the operator will review them within a reasonable scope.",
      },
    ],
    contact: "Open contact channel",
  },
} as const;

export function PrivacyPage() {
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

        <a
          href={SITE_ISSUES_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white"
        >
          {currentCopy.contact}
        </a>
      </article>
    </div>
  );
}
