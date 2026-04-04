import { getCurrentUser } from "@/features/auth/api";
import { apiClient } from "@/api/client";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { slugifyRecipeName } from "@/features/recipes/utils";
import type {
  RecipeDetailRequest,
  RecipeDetailResponse,
  RecipeVoteRow,
  RecommendRecipeRequest,
  RecommendRecipeResponse,
  SavedRecipeRow,
  SavedRecipeWithRecipe,
} from "@/features/recipes/types";

async function requireUserId() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("You need to sign in with Google before using this feature.");
  }

  return user.id;
}

export async function saveRecipe(recipeId: string) {
  const client = getSupabaseClient();
  const userId = await requireUserId();
  const { data, error } = await client
    .from("saved_recipes")
    .insert({ user_id: userId, recipe_id: recipeId })
    .select("id, user_id, recipe_id, created_at")
    .single();

  if (error) {
    throw error;
  }

  return data as SavedRecipeRow;
}

export async function unsaveRecipe(recipeId: string) {
  const client = getSupabaseClient();
  const userId = await requireUserId();
  const { error } = await client
    .from("saved_recipes")
    .delete()
    .eq("user_id", userId)
    .eq("recipe_id", recipeId);

  if (error) {
    throw error;
  }
}

export async function upvoteRecipe(recipeId: string) {
  const client = getSupabaseClient();
  const userId = await requireUserId();
  const { data, error } = await client
    .from("recipe_votes")
    .insert({ user_id: userId, recipe_id: recipeId })
    .select("id, user_id, recipe_id, created_at")
    .single();

  if (error) {
    throw error;
  }

  return data as RecipeVoteRow;
}

export async function removeVote(recipeId: string) {
  const client = getSupabaseClient();
  const userId = await requireUserId();
  const { error } = await client
    .from("recipe_votes")
    .delete()
    .eq("user_id", userId)
    .eq("recipe_id", recipeId);

  if (error) {
    throw error;
  }
}

export async function getMySavedRecipes() {
  const client = getSupabaseClient();
  const userId = await requireUserId();
  const { data, error } = await client
    .from("saved_recipes")
    .select(
      "id, user_id, recipe_id, created_at, recipe:recipes(id, slug, name, description, difficulty, cooking_time_minutes, total_vote_count, total_save_count)",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as Array<
    SavedRecipeRow & {
      recipe:
        | Array<
            NonNullable<SavedRecipeWithRecipe["recipe"]>
          >
        | NonNullable<SavedRecipeWithRecipe["recipe"]>
        | null;
    }
  >).map((entry) => ({
    ...entry,
    recipe: Array.isArray(entry.recipe) ? entry.recipe[0] ?? null : entry.recipe,
  }));
}

export async function getMyVotes() {
  const client = getSupabaseClient();
  const userId = await requireUserId();
  const { data, error } = await client
    .from("recipe_votes")
    .select("id, user_id, recipe_id, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as RecipeVoteRow[];
}

export async function getRecipeMetricsByNames(recipeNames: string[]) {
  if (!isSupabaseConfigured()) {
    return {};
  }

  const slugs = Array.from(
    new Set(
      recipeNames
        .map((name) => slugifyRecipeName(name))
        .filter((slug) => slug.length > 0),
    ),
  );

  if (slugs.length === 0) {
    return {};
  }

  const client = getSupabaseClient();
  const { data, error } = await client
    .from("recipes")
    .select("slug, total_save_count, total_vote_count")
    .in("slug", slugs);

  if (error) {
    throw error;
  }

  return Object.fromEntries(
    (data ?? []).map((row) => [
      row.slug,
      {
        total_save_count: row.total_save_count ?? 0,
        total_vote_count: row.total_vote_count ?? 0,
      },
    ]),
  ) as Record<string, { total_save_count: number; total_vote_count: number }>;
}

export function requestRecipeRecommendations(input: RecommendRecipeRequest) {
  return apiClient<RecommendRecipeResponse>({
    path: "/api/recommend",
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function requestRecipeDetail(input: RecipeDetailRequest) {
  return apiClient<RecipeDetailResponse>({
    path: "/api/recipe-detail",
    method: "POST",
    body: JSON.stringify(input),
  });
}
