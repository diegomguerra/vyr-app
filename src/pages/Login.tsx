import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Brain, LineChart, Shield, Sparkles } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (searchParams.get("signup") === "true") {
      setIsSignUp(true);
    }
  }, [searchParams]);

  // Check if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/painel", { replace: true });
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha email e senha.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/painel`,
          },
        });

        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Email já cadastrado",
              description: "Este email já está em uso. Tente fazer login.",
              variant: "destructive",
            });
          } else {
            throw error;
          }
        } else {
          toast({
            title: "Conta criada",
            description: "Verifique seu email para confirmar o cadastro.",
          });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast({
              title: "Credenciais inválidas",
              description: "Email ou senha incorretos.",
              variant: "destructive",
            });
          } else {
            throw error;
          }
        } else {
          navigate("/painel", { replace: true });
        }
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const highlights = [
    {
      title: "Protocolos inteligentes",
      description: "Rotinas guiadas por dados para foco, energia e clareza.",
      icon: Sparkles,
    },
    {
      title: "Insights acionáveis",
      description: "Painéis com sinais cognitivos e tendências semanais.",
      icon: LineChart,
    },
    {
      title: "Privacidade e segurança",
      description: "Dados sensíveis protegidos em cada sessão.",
      icon: Shield,
    },
  ];

  return (
    <div className="min-h-screen vyr-gradient-bg safe-area-inset">
      {/* Subtle radial glow */}
      <div className="fixed inset-0 vyr-gradient-radial opacity-30 pointer-events-none" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-10 sm:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_420px]">
          {/* Hero */}
          <section className="order-2 space-y-6 lg:order-1">
            <div className="vyr-badge-accent w-fit">
              <Brain className="w-4 h-4" />
              <span className="text-sm font-mono tracking-wider">VYR APP</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-semibold text-vyr-white">
                Controle total sobre performance cognitiva
              </h1>
              <p className="text-sm sm:text-base text-vyr-gray-400 max-w-xl">
                O novo front da VYR App combina análise biométrica, check-ins inteligentes e
                métricas de foco em um painel elegante e direto ao ponto.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="vyr-card-graphite p-4 space-y-3">
                    <div className="w-9 h-9 rounded-sm bg-vyr-graphite-dark/80 border border-vyr-graphite/60 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-vyr-gray-200" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-vyr-white">{item.title}</p>
                      <p className="text-xs text-vyr-gray-500 mt-1">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3 text-xs text-vyr-gray-500 font-mono">
              <span className="px-3 py-1 rounded-sm border border-vyr-graphite/60 bg-vyr-graphite-dark/60">
                Check-ins diários
              </span>
              <span className="px-3 py-1 rounded-sm border border-vyr-graphite/60 bg-vyr-graphite-dark/60">
                Baselines cognitivos
              </span>
              <span className="px-3 py-1 rounded-sm border border-vyr-graphite/60 bg-vyr-graphite-dark/60">
                KPIs em tempo real
              </span>
            </div>
          </section>

          {/* Login Card */}
          <section className="order-1 lg:order-2">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-vyr-graphite to-vyr-accent flex items-center justify-center shadow-xl shadow-vyr-accent/20">
                  <Brain className="w-6 h-6 text-vyr-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-vyr-white font-mono tracking-wide">
                    VYR App
                  </h2>
                  <p className="text-xs text-vyr-gray-500 font-mono mt-1">
                    Performance cognitiva mensurável
                  </p>
                </div>
              </div>

              <div className="vyr-card-graphite p-6 sm:p-8">
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium text-vyr-white">
                      {isSignUp ? "Criar conta" : "Entrar"}
                    </h3>
                    <p className="text-xs text-vyr-gray-500 font-mono">
                      {isSignUp ? "Registre-se para começar" : "Acesse sua conta"}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs text-vyr-gray-400">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-vyr-graphite-dark border-vyr-graphite text-vyr-white text-sm placeholder:text-vyr-gray-600"
                        autoComplete="email"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-xs text-vyr-gray-400">
                        Senha
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-vyr-graphite-dark border-vyr-graphite text-vyr-white text-sm placeholder:text-vyr-gray-600"
                        autoComplete={isSignUp ? "new-password" : "current-password"}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-vyr-white hover:bg-vyr-gray-100 text-vyr-black text-sm font-medium h-11"
                    >
                      {isLoading ? "Processando..." : isSignUp ? "Criar conta" : "Entrar"}
                    </Button>
                  </form>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="text-xs text-vyr-gray-500 hover:text-vyr-white transition-colors"
                    >
                      {isSignUp ? "Já tem conta? Entrar" : "Não tem conta? Criar"}
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-center text-[10px] text-vyr-gray-600 font-mono">
                Clareza mental é construída com consistência.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
