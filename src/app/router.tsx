import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { CompletePage } from "@/pages/CompletePage";
import { CookingPage } from "@/pages/CookingPage";
import { HomePage } from "@/pages/HomePage";
import { RecipeDetailPage } from "@/pages/RecipeDetailPage";
import { ResultsPage } from "@/pages/ResultsPage";
import { SavedRecipesPage } from "@/pages/SavedRecipesPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "result",
        element: <ResultsPage />,
      },
      {
        path: "recipe/:id",
        element: <RecipeDetailPage />,
      },
      {
        path: "cook/:id",
        element: <CookingPage />,
      },
      {
        path: "complete",
        element: <CompletePage />,
      },
      {
        path: "saved",
        element: <SavedRecipesPage />,
      },
    ],
  },
]);
