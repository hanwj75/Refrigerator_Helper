import { Link } from "react-router-dom";
import { mockRecipes } from "@/features/recipes/mockRecipes";

export function ResultsPage() {
  return (
    <section className="space-y-4">
      <p className="text-sm font-medium uppercase tracking-[0.24em] text-brand-700">Results</p>
      <h2 className="text-3xl font-semibold">추천 결과 페이지</h2>
      <p className="text-sm leading-6 text-stone-600">
        mock 데이터 기반 리스트 UI를 붙이기 위한 자리입니다.
      </p>
      <div className="grid gap-4 pt-4">
        {mockRecipes.map((recipe) => (
          <Link
            key={recipe.id}
            to={`/recipe/${recipe.id}`}
            className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:border-brand-500"
          >
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{recipe.title}</h3>
              <p className="text-sm text-stone-600">{recipe.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
