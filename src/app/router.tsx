import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { AboutPage } from "@/pages/AboutPage";
import { CompletePage } from "@/pages/CompletePage";
import { ContactPage } from "@/pages/ContactPage";
import { CookingPage } from "@/pages/CookingPage";
import { HomePage } from "@/pages/HomePage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { PrivacyPage } from "@/pages/PrivacyPage";
import { RecipeDetailPage } from "@/pages/RecipeDetailPage";
import { ResultsPage } from "@/pages/ResultsPage";
import { SavedRecipesPage } from "@/pages/SavedRecipesPage";
import { TermsPage } from "@/pages/TermsPage";

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
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
      {
        path: "privacy",
        element: <PrivacyPage />,
      },
      {
        path: "terms",
        element: <TermsPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
