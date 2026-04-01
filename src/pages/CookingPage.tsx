import { useParams } from "react-router-dom";

export function CookingPage() {
  const { id } = useParams();

  return (
    <section className="space-y-4">
      <p className="text-sm font-medium uppercase tracking-[0.24em] text-brand-700">Cooking</p>
      <h2 className="text-3xl font-semibold">요리 진행 페이지</h2>
      <p className="text-sm leading-6 text-stone-600">
        단계별 진행 UI가 들어갈 자리입니다. 현재 레시피 ID: {id ?? "unknown"}
      </p>
    </section>
  );
}
