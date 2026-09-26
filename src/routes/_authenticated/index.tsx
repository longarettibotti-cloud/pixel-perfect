import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { mountRegula } from "@/regula/app";
import regulaCss from "@/regula/regula.css?url";

const FONTS =
  "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=JetBrains+Mono:wght@500;700&family=Source+Sans+3:wght@400;600;700&display=swap";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: [
      { title: "Regula Vitae" },
      { name: "description", content: "App pessoal de hábitos: treino, leitura, sono, saúde e vida espiritual." },
      { name: "theme-color", content: "#0E7A5E" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: FONTS },
      { rel: "stylesheet", href: regulaCss },
    ],
  }),
  component: Home,
});

function Home() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    return mountRegula(ref.current, {
      supabase,
      userId: user.id,
      firstName: "Gabriel",
      onSignOut: async () => {
        await supabase.auth.signOut();
        navigate({ to: "/login", replace: true });
      },
    });
  }, [user.id, navigate]);

  return <div ref={ref} className="rv" />;
}
