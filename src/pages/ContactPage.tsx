import { useMemo, useState } from "react";
import clsx from "clsx";
import { PageTopBar } from "@/components/layout/PageTopBar";
import { SeoMeta } from "@/components/seo/SeoMeta";
import { useRecipeStore } from "@/store/useRecipeStore";

type InquiryType = "partnership" | "bug" | "feature";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mdapaqyw";

const copy = {
  ko: {
    title: "문의하기",
    description: "원하는 문의 유형을 선택한 뒤 해당 유형에 맞는 내용으로 폼을 작성해 주세요.",
    sectionTitle: "문의 유형 선택",
    nameLabel: "이름",
    emailLabel: "이메일",
    subjectLabel: "제목",
    messageLabel: "문의 내용",
    submitLabel: "문의 보내기",
    noteTitle: "문의 전에 확인하면 좋은 내용",
    notes: [
      "1. 버그 문의는 문제가 발생한 페이지와 재현 순서를 함께 적어 주세요.",
      "2. 기능추가 건의는 필요한 이유와 기대하는 사용 방식을 함께 적어 주세요.",
      "3. 제휴문의는 제안 목적과 회신 가능한 연락처를 함께 남겨 주세요.",
    ],
    placeholders: {
      name: "이름 또는 팀명을 입력해 주세요",
      email: "회신 받을 이메일을 입력해 주세요",
      subject: "문의 제목을 간단히 입력해 주세요",
      message: "문의 내용을 자세히 작성해 주세요",
    },
    types: {
      partnership: {
        button: "제휴문의",
        title: "제휴문의",
        description: "콘텐츠 협업, 브랜드 협업, 캠페인 제안 등 비즈니스 관련 문의에 사용해 주세요.",
        subjectPrefix: "[제휴문의]",
      },
      bug: {
        button: "버그 문의",
        title: "버그 문의",
        description: "오류 화면, 버튼 동작 문제, 저장 실패 등 사이트 사용 중 발견한 문제를 알려 주세요.",
        subjectPrefix: "[버그 문의]",
      },
      feature: {
        button: "기능추가 건의",
        title: "기능추가 건의",
        description: "사용 중 있으면 좋겠다고 느낀 기능이나 개선 아이디어를 자세히 적어 주세요.",
        subjectPrefix: "[기능추가 건의]",
      },
    },
  },
  en: {
    title: "Contact",
    description: "Choose the inquiry type you need and fill out the matching form.",
    sectionTitle: "Select inquiry type",
    nameLabel: "Name",
    emailLabel: "Email",
    subjectLabel: "Title",
    messageLabel: "Inquiry details",
    submitLabel: "Send inquiry",
    noteTitle: "Helpful points before submitting",
    notes: [
      "1. For bug reports, include the page where it happened and how to reproduce it.",
      "2. For feature suggestions, explain why it is needed and how you expect it to be used.",
      "3. For partnership inquiries, include the purpose and a reliable reply contact.",
    ],
    placeholders: {
      name: "Enter your name or team name",
      email: "Enter the email address for reply",
      subject: "Enter a short inquiry title",
      message: "Write the details of your inquiry",
    },
    types: {
      partnership: {
        button: "Partnership",
        title: "Partnership",
        description: "Use this for business discussions such as content collaborations, brand partnerships, or campaign proposals.",
        subjectPrefix: "[Partnership]",
      },
      bug: {
        button: "Bug report",
        title: "Bug report",
        description: "Use this to report broken pages, button issues, saving failures, or other site problems.",
        subjectPrefix: "[Bug Report]",
      },
      feature: {
        button: "Feature request",
        title: "Feature request",
        description: "Use this to suggest new features or improvements that would make the service more useful.",
        subjectPrefix: "[Feature Request]",
      },
    },
  },
} as const;

export function ContactPage() {
  const language = useRecipeStore((state) => state.language);
  const currentCopy = copy[language];
  const [selectedType, setSelectedType] = useState<InquiryType>("partnership");

  const inquiryConfig = useMemo(() => currentCopy.types[selectedType], [currentCopy.types, selectedType]);
  const inquiryTypes: InquiryType[] = ["partnership", "bug", "feature"];

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-12 pt-5 sm:px-6 lg:px-8">
      <SeoMeta title={currentCopy.title} description={currentCopy.description} />
      <PageTopBar />

      <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_360px]">
        <article className="rounded-[2rem] border border-white/70 bg-white p-8 shadow-[0_20px_60px_rgba(73,98,56,0.12)]">
          <h1 className="text-3xl font-semibold text-stone-900">{currentCopy.title}</h1>
          <p className="mt-4 text-sm leading-7 text-stone-600">{currentCopy.description}</p>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-stone-900">{currentCopy.sectionTitle}</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {inquiryTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={clsx(
                    "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                    selectedType === type
                      ? "bg-brand-700 text-white"
                      : "border border-stone-200 bg-white text-stone-700 hover:border-brand-200 hover:text-brand-800",
                  )}
                >
                  {currentCopy.types[type].button}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-[1.5rem] bg-brand-50/70 p-5">
            <h2 className="text-xl font-semibold text-stone-900">{inquiryConfig.title}</h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">{inquiryConfig.description}</p>
          </div>

          <form action={FORMSPREE_ENDPOINT} method="POST" className="mt-8 space-y-5">
            <input type="hidden" name="inquiryType" value={inquiryConfig.title} />
            <input type="hidden" name="_subject" value={`${inquiryConfig.subjectPrefix} ${currentCopy.title}`} />

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-stone-800">{currentCopy.nameLabel}</span>
                <input
                  required
                  type="text"
                  name="name"
                  placeholder={currentCopy.placeholders.name}
                  className="w-full rounded-[1rem] border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-brand-300 focus:bg-white"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-stone-800">{currentCopy.emailLabel}</span>
                <input
                  required
                  type="email"
                  name="email"
                  placeholder={currentCopy.placeholders.email}
                  className="w-full rounded-[1rem] border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-brand-300 focus:bg-white"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-stone-800">{currentCopy.subjectLabel}</span>
              <input
                required
                type="text"
                name="subject"
                placeholder={currentCopy.placeholders.subject}
                className="w-full rounded-[1rem] border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-brand-300 focus:bg-white"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-stone-800">{currentCopy.messageLabel}</span>
              <textarea
                required
                name="message"
                rows={7}
                placeholder={currentCopy.placeholders.message}
                className="w-full rounded-[1rem] border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-6 text-stone-900 outline-none transition focus:border-brand-300 focus:bg-white"
              />
            </label>

            <button
              type="submit"
              className="rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-800"
            >
              {currentCopy.submitLabel}
            </button>
          </form>
        </article>

        <aside className="rounded-[2rem] border border-white/70 bg-[#f7f3ea] p-6 shadow-[0_18px_50px_rgba(93,76,53,0.08)]">
          <h2 className="text-lg font-semibold text-stone-900">{currentCopy.noteTitle}</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-600">
            {currentCopy.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </aside>
      </section>
    </div>
  );
}
