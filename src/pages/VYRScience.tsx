import { Link } from "react-router-dom";
import { ArrowRight, Brain, Activity, BarChart3, Waves, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingNav } from "@/components/landing/LandingNav";
import { Footer } from "@/components/landing/Footer";
import { ScrollReveal } from "@/components/labs";

const PILLARS = [
  {
    icon: Brain,
    title: "Carga cognitiva é o problema central",
    description: `Fadiga mental raramente vem da falta de estímulo.
Ela surge do acúmulo de carga mal recuperada ao longo do dia.

Decisão, foco e energia não colapsam de uma vez.
Eles se degradam silenciosamente.

A ciência da VYR começa aqui.`,
  },
  {
    icon: Waves,
    title: "Ritmo importa mais do que intensidade",
    description: `Sistemas biológicos funcionam melhor com constância do que com picos.

Em vez de empurrar o cérebro,
trabalhamos com ciclos de ativação, sustentação e recuperação
alinhados ao funcionamento natural do sistema nervoso.

Menos ruído.
Mais fluidez.`,
  },
  {
    icon: Activity,
    title: "Percepção + fisiologia constroem entendimento real",
    description: `A experiência subjetiva importa.
Mas ela se torna mais confiável quando observada ao longo do tempo.

A VYR cruza percepção consciente com sinais fisiológicos
para identificar padrões individuais — não para rotular pessoas.

O sistema aprende com você.`,
  },
];

const NOT_PROMISES = [
  "aumento de QI",
  "performance extrema",
  "causalidade clínica",
  "resultados universais",
];

const WHAT_WE_MEASURE = [
  "variabilidade de energia mental",
  "estabilidade ao longo do dia",
  "qualidade de recuperação",
  "prontidão percebida",
  "consistência ao longo do tempo",
];

const FOUNDATIONS = [
  "neurociência da carga cognitiva",
  "fisiologia do estresse e recuperação",
  "ritmos circadianos",
  "variabilidade autonômica",
  "metabolismo energético neural",
];

export default function VYRScience() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      
      {/* Grid pattern background */}
      <div 
        className="fixed inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }}
      />

      <main className="relative">
        {/* HERO */}
        <section className="min-h-[85vh] flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <ScrollReveal>
              <div className="max-w-3xl space-y-8">
                {/* Label */}
                <span className="block font-mono text-[10px] sm:text-xs tracking-[0.3em] text-muted-foreground/60 uppercase">
                  VYR Science
                </span>
                
                {/* H1 */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-medium text-foreground leading-[1.1] tracking-tight">
                  Ciência aplicada à redução de fricção cognitiva
                </h1>
                
                {/* Subtitle */}
                <div className="space-y-4 text-muted-foreground text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl">
                  <p>
                    A ciência da VYR não busca picos artificiais de desempenho.
                  </p>
                  <p>
                    Ela existe para sustentar fluidez mental, reduzir esforço invisível
                    e permitir que o sistema funcione melhor ao longo do tempo.
                  </p>
                </div>
                
                {/* Statement */}
                <div className="pt-4 border-l-2 border-muted-foreground/20 pl-6">
                  <p className="text-foreground text-sm sm:text-base font-medium">
                    Não prometemos atalhos.
                  </p>
                  <p className="text-foreground text-sm sm:text-base font-medium">
                    Construímos método.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* O QUE É / O QUE NÃO É */}
        <section className="py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="space-y-4 mb-12">
                  <h2 className="text-2xl sm:text-3xl font-medium text-foreground">
                    O que a ciência da VYR é — e o que ela não é
                  </h2>
                  <p className="text-muted-foreground text-base sm:text-lg">
                    A ciência orienta tudo o que construímos.<br />
                    Mas ela não é usada como argumento de venda.
                  </p>
                </div>
                
                {/* Not promises */}
                <div className="bg-card/30 border border-border/30 rounded-sm p-6 sm:p-8 space-y-6">
                  <p className="text-muted-foreground font-medium">
                    Nós não prometemos:
                  </p>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {NOT_PROMISES.map((item, i) => (
                      <li 
                        key={i} 
                        className="flex items-center gap-3 text-muted-foreground/70"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4 border-t border-border/30">
                    <p className="text-sm text-muted-foreground/60">
                      A ciência séria começa quando se reconhecem os limites.<br />
                      O nosso trabalho acontece dentro deles.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* 3 PILARES */}
        <section className="py-24 sm:py-32 relative overflow-hidden">
          {/* Background gradient effect */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(ellipse 80% 50% at 50% 50%, 
                hsl(var(--vyr-cold-blue) / 0.15) 0%, 
                hsl(var(--vyr-graphite) / 0.08) 40%,
                transparent 70%)`
            }}
          />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-2xl sm:text-3xl font-medium text-foreground">
                  Nosso modelo científico se apoia em três pilares
                </h2>
              </div>
            </ScrollReveal>
            
            {/* Connecting line - animated */}
            <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-px z-0">
              <div 
                className="h-full w-full opacity-0 animate-[expand-line_1s_ease-out_0.6s_forwards]"
                style={{
                  background: `linear-gradient(90deg, 
                    transparent 0%,
                    hsl(var(--vyr-gray-600) / 0.3) 10%,
                    hsl(var(--vyr-cold-blue) / 0.5) 30%,
                    hsl(var(--vyr-accent) / 0.6) 50%,
                    hsl(var(--vyr-cold-blue) / 0.5) 70%,
                    hsl(var(--vyr-gray-600) / 0.3) 90%,
                    transparent 100%)`
                }}
              />
              {/* Animated glow pulse on line */}
              <div 
                className="absolute top-0 left-0 h-full w-full opacity-0 animate-[pulse-glow_3s_ease-in-out_1.5s_infinite]"
                style={{
                  background: `linear-gradient(90deg, 
                    transparent 0%,
                    transparent 40%,
                    hsl(var(--vyr-accent-glow) / 0.4) 50%,
                    transparent 60%,
                    transparent 100%)`
                }}
              />
            </div>
            
            {/* Node dots on line */}
            <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] justify-between z-10 pointer-events-none">
              {[0, 1, 2].map((i) => (
                <div 
                  key={i}
                  className="w-2 h-2 rounded-full opacity-0 animate-[fade-scale-in_0.4s_ease-out_forwards]"
                  style={{
                    animationDelay: `${0.8 + i * 0.15}s`,
                    background: `linear-gradient(135deg, 
                      hsl(var(--vyr-gray-400)) 0%, 
                      hsl(var(--vyr-cold-blue)) 100%)`,
                    boxShadow: `0 0 12px hsl(var(--vyr-cold-blue) / 0.5), 
                                0 0 24px hsl(var(--vyr-accent) / 0.3)`
                  }}
                />
              ))}
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 relative z-20">
              {PILLARS.map((pillar, i) => (
                <div 
                  key={i}
                  className="group h-full rounded-sm p-6 sm:p-8 space-y-5 
                    opacity-0 translate-y-6 
                    animate-[fade-in_0.6s_ease-out_forwards,slide-up_0.6s_ease-out_forwards]
                    transition-all duration-500 relative"
                  style={{ 
                    animationDelay: `${i * 200}ms`,
                    background: `linear-gradient(145deg, 
                      hsl(var(--vyr-gray-800) / 0.4) 0%, 
                      hsl(var(--vyr-graphite-dark) / 0.3) 50%,
                      hsl(var(--vyr-cold-blue) / 0.08) 100%)`,
                    border: '1px solid hsl(var(--vyr-gray-600) / 0.25)',
                  }}
                >
                  {/* Hover glow effect */}
                  <div 
                    className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse at 50% 0%, 
                        hsl(var(--vyr-cold-blue) / 0.1) 0%, 
                        transparent 70%)`,
                      boxShadow: `inset 0 1px 0 hsl(var(--vyr-gray-400) / 0.1)`
                    }}
                  />
                  
                  <pillar.icon 
                    className="w-6 h-6 text-muted-foreground/60 group-hover:text-vyr-coldBlue transition-colors duration-300 relative z-10" 
                    strokeWidth={1.5} 
                  />
                  <h3 className="text-lg font-medium text-foreground leading-tight group-hover:text-foreground/90 transition-colors duration-300 relative z-10">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-muted-foreground/80 leading-relaxed whitespace-pre-line relative z-10">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* O QUE MEDIMOS */}
        <section className="py-24 sm:py-32 bg-card/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="max-w-3xl mx-auto text-center space-y-8">
                <div className="space-y-4">
                  <h2 className="text-2xl sm:text-3xl font-medium text-foreground">
                    Medimos sinais. Observamos padrões. Reduzimos fricção.
                  </h2>
                  <div className="space-y-1 text-muted-foreground">
                    <p>Não medimos "inteligência".</p>
                    <p>Não medimos "performance cognitiva absoluta".</p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <p className="text-muted-foreground mb-6 font-medium">Observamos:</p>
                  <div className="grid sm:grid-cols-2 gap-3 text-left max-w-xl mx-auto">
                    {WHAT_WE_MEASURE.map((item, i) => (
                      <div 
                        key={i} 
                        className="flex items-center gap-3 text-muted-foreground/80"
                      >
                        <BarChart3 className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-8 border-t border-border/30 max-w-lg mx-auto">
                  <p className="text-sm text-muted-foreground/60">
                    Esses sinais não definem quem você é.<br />
                    Eles mostram onde o sistema encontra resistência.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* CIÊNCIA ≠ PROMESSA */}
        <section className="py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="max-w-2xl mx-auto text-center space-y-8">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-foreground">
                  Ciência não é promessa. É método.
                </h2>
                
                <div className="space-y-6 text-muted-foreground text-base sm:text-lg leading-relaxed">
                  <p>
                    A ciência da VYR não entrega respostas prontas.<br />
                    Ela constrói <span className="text-foreground">referências individuais</span>.
                  </p>
                  <p>
                    O objetivo não é prever comportamento.<br />
                    É reduzir o que atrapalha o funcionamento natural do sistema.
                  </p>
                </div>
                
                <div className="pt-6 space-y-1 text-foreground font-medium">
                  <p>Mais fluidez para funcionar bem.</p>
                  <p>Menos esforço invisível.</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* FUNDAMENTOS */}
        <section className="py-24 sm:py-32 bg-card/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-2xl sm:text-3xl font-medium text-foreground mb-4">
                    Áreas que fundamentam nosso modelo
                  </h2>
                  <p className="text-muted-foreground">
                    Nosso trabalho é orientado por evidências consolidadas nas áreas de:
                  </p>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto">
                  {FOUNDATIONS.map((item, i) => (
                    <div 
                      key={i} 
                      className="flex items-center gap-3 text-muted-foreground/80 bg-card/30 border border-border/20 rounded-sm px-4 py-3"
                    >
                      <Zap className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
                
                <p className="text-center text-xs text-muted-foreground/50 mt-8">
                  Referências científicas são usadas como base metodológica,
                  não como promessa de resultado.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* BLOCO FINAL */}
        <section className="py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="max-w-2xl mx-auto text-center space-y-8">
                <h2 className="text-2xl sm:text-3xl font-medium text-foreground">
                  Ciência aplicada. Sistema em evolução.
                </h2>
                
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    A VYR Science não existe isolada.
                  </p>
                  <p>
                    Ela orienta o VYR System, o Labs e o Node<br />
                    como partes de um único processo:
                  </p>
                </div>
                
                <p className="text-foreground font-medium text-lg">
                  reduzir fricção → sustentar fluidez → permitir constância.
                </p>
                
                <div className="pt-8">
                  <Link to="/system">
                    <Button 
                      variant="outline" 
                      className="border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                    >
                      Conheça o VYR System
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
