import { Brain, Moon, TrendingUp, Shield, Zap, Target, Clock, BarChart3 } from "lucide-react";

const benefits = [
  {
    icon: Brain,
    title: "Clareza Sob Pressão",
    description: "Tome decisões críticas com lucidez, mesmo em cenários de alta volatilidade e deadlines apertados",
    color: "text-violet-400",
    bgColor: "bg-violet-500/10",
  },
  {
    icon: Target,
    title: "Deep Work Elevado",
    description: "Entre em estado de flow mais rápido e mantenha foco absoluto por sessões longas sem fadiga mental",
    color: "text-fuchsia-400",
    bgColor: "bg-fuchsia-500/10",
  },
  {
    icon: Clock,
    title: "Produtividade 24h",
    description: "Manhãs produtivas e reuniões noturnas. Performance consistente independente do horário",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
  },
  {
    icon: Moon,
    title: "Sono Reparador",
    description: "Otimize a recuperação do seu cérebro durante a noite para acordar pronto para performar",
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
  },
  {
    icon: Zap,
    title: "Zero Crash",
    description: "Energia sustentada sem os picos e quedas do café. Sem dependência, sem abstinência",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
  {
    icon: BarChart3,
    title: "Dados Precisos",
    description: "Acompanhe sua evolução com métricas reais. Saiba exatamente o que funciona para você",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
  },
];

const comparisons = [
  { label: "Café tradicional", cons: ["Picos de energia", "Crash às 14h", "Ansiedade", "Dependência"] },
  { label: "NZT Performance", pros: ["Energia sustentada", "Foco por 12h+", "Calma focada", "Sem dependência"] },
];

export function BenefitSection() {
  return (
    <section id="beneficios" className="py-24 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-300 font-medium">Performance Comprovada</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Por que os melhores escolhem NZT
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Desenvolvido para quem não pode se dar ao luxo de um dia medíocre. 
            Traders, founders e desenvolvedores de elite confiam na nossa fórmula.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="relative group p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm hover:border-violet-500/30 hover:bg-slate-800/50 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${benefit.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {benefit.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Comparison Section */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            A diferença que você vai sentir
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Traditional */}
            <div className="p-6 rounded-2xl bg-slate-800/20 border border-slate-700/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <span className="text-red-400 text-lg">☕</span>
                </div>
                <span className="text-lg font-semibold text-slate-300">{comparisons[0].label}</span>
              </div>
              <ul className="space-y-3">
                {comparisons[0].cons?.map((con, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center">
                      <span className="text-red-400 text-xs">✕</span>
                    </span>
                    <span className="text-slate-400">{con}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* NZT */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-900/20 to-fuchsia-900/20 border border-violet-500/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-semibold rounded-bl-xl">
                RECOMENDADO
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-violet-400" />
                </div>
                <span className="text-lg font-semibold text-white">{comparisons[1].label}</span>
              </div>
              <ul className="space-y-3">
                {comparisons[1].pros?.map((pro, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center">
                      <span className="text-emerald-400 text-xs">✓</span>
                    </span>
                    <span className="text-slate-200">{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Trust Statement */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-slate-800/30 border border-slate-700/50">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="text-slate-300">
              <span className="text-white font-semibold">Garantia de 30 dias</span> — Se não sentir diferença, devolvemos seu dinheiro
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
