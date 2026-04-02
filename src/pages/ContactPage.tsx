import { PageTopBar } from "@/components/layout/PageTopBar";
import { SeoMeta } from "@/components/seo/SeoMeta";
import { SITE_ISSUES_URL, SITE_REPOSITORY_URL } from "@/lib/site";
import { useRecipeStore } from "@/store/useRecipeStore";

const copy = {
  ko: {
    title: "문의하기",
    description:
      "사이트 이용 중 불편, 오류, 정책 관련 문의는 GitHub Issues 채널을 통해 접수할 수 있습니다.",
    channelTitle: "문의 채널",
    channelBody:
      "현재 운영 문의와 버그 제보는 GitHub Issues를 통해 받고 있습니다. 재현 방법이나 화면 설명을 함께 남겨 주시면 확인에 도움이 됩니다.",
    supportTitle: "문의 전 확인하면 좋은 내용",
    supportPoints: [
      "문제가 발생한 페이지 경로",
      "사용한 재료 입력 또는 클릭 흐름",
      "브라우저 또는 기기 정보",
      "광고/정책 관련 문의일 경우 스크린샷 또는 상황 설명",
    ],
    issues: "GitHub Issues로 문의하기",
    repository: "저장소 보기",
  },
  en: {
    title: "Contact",
    description:
      "Questions, bug reports, and policy-related requests can be submitted through the GitHub Issues channel.",
    channelTitle: "Support channel",
    channelBody:
      "The current project accepts support and bug reports through GitHub Issues. Sharing the page path and reproduction steps will help us review the issue faster.",
    supportTitle: "Helpful information to include",
    supportPoints: [
      "The page where the issue occurred",
      "Ingredients entered or the flow you used",
      "Your browser or device",
      "A screenshot or context for ads/policy questions",
    ],
    issues: "Open GitHub Issues",
    repository: "View repository",
  },
} as const;

export function ContactPage() {
  const language = useRecipeStore((state) => state.language);
  const currentCopy = copy[language];

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-12 pt-5 sm:px-6 lg:px-8">
      <SeoMeta
        title={currentCopy.title}
        description={currentCopy.description}
      />
      <PageTopBar />

      <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_360px]">
        <article className="rounded-[2rem] border border-white/70 bg-white p-8 shadow-[0_20px_60px_rgba(73,98,56,0.12)]">
          <h1 className="text-3xl font-semibold text-stone-900">{currentCopy.title}</h1>
          <p className="mt-4 text-sm leading-7 text-stone-600">{currentCopy.description}</p>

          <h2 className="mt-8 text-xl font-semibold text-stone-900">{currentCopy.channelTitle}</h2>
          <p className="mt-3 text-sm leading-7 text-stone-600">{currentCopy.channelBody}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={SITE_ISSUES_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white"
            >
              {currentCopy.issues}
            </a>
            <a
              href={SITE_REPOSITORY_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-700"
            >
              {currentCopy.repository}
            </a>
          </div>
        </article>

        <aside className="rounded-[2rem] border border-white/70 bg-[#f7f3ea] p-6 shadow-[0_18px_50px_rgba(93,76,53,0.08)]">
          <h2 className="text-lg font-semibold text-stone-900">{currentCopy.supportTitle}</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-600">
            {currentCopy.supportPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </aside>
      </section>
    </div>
  );
}
