import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: [
      { title: "Regula Vitae — Início" },
      { name: "description", content: "App pessoal de hábitos Regula Vitae." },
      { property: "og:title", content: "Regula Vitae — Início" },
      { property: "og:description", content: "App pessoal de hábitos Regula Vitae." },
    ],
  }),
  component: Home,
});

function Home() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4">
      <h1 className="text-xl font-semibold text-foreground">
        Regula Vitae — logado como {user.email}
      </h1>
      <button
        onClick={signOut}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Sair
      </button>
    </div>
  );
}
