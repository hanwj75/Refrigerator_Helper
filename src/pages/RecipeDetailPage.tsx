import { useParams } from "react-router-dom";

export function RecipeDetailPage() {
  const { id } = useParams();

  return (
    <section className="space-y-4">
      <p className="text-sm font-medium uppercase tracking-[0.24em] text-brand-700">
        Recipe Detail
      </p>
      <h2 className="text-3xl font-semibold">레시피 상세 페이지</h2>
      <p className="text-sm leading-6 text-stone-600">선택한 레시피 ID: {id ?? "unknown"}</p>
    </section>
  );
}
