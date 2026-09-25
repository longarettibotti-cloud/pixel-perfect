import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — Regula Vitae" },
      { name: "description", content: "Acesse sua conta do Regula Vitae." },
      { property: "og:title", content: "Entrar — Regula Vitae" },
      { property: "og:description", content: "Acesse sua conta do Regula Vitae." },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setMessage(error.message);
    else navigate({ to: "/", replace: true });
  }

  async function handleSignUp() {
    setLoading(true);
    setMessage(null);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (error) setMessage(error.message);
    else if (!data.session) setMessage("Conta criada. Confirme o e-mail para entrar.");
    else navigate({ to: "/", replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form onSubmit={handleSignIn} className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold text-foreground">Regula Vitae</h1>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
        />
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            Entrar
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleSignUp}
            className="flex-1 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent disabled:opacity-50"
          >
            Criar conta
          </button>
        </div>
      </form>
    </div>
  );
}
