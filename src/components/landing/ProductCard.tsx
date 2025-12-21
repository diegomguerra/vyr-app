import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const products = [
  {
    id: "dia",
    name: "NZT Dia",
    tagline: "Performance Diurna",
    description: "Fórmula para máxima performance cognitiva durante o dia. Ideal para trabalho intenso e tomada de decisões.",
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    accentColor: "text-amber-600",
    borderAccent: "border-amber-500/30",
    features: ["Foco intenso", "Clareza mental", "Energia sustentada"],
    originalPrice: "R$ 197,00",
    price: "R$ 147,00",
    discount: "25% OFF",
  },
  {
    id: "tarde",
    name: "NZT Tarde",
    tagline: "Criatividade & Flow",
    description: "Potencializa o pensamento criativo e mantém o flow produtivo até o final do expediente.",
    gradient: "from-purple-500/20 via-pink-500/10 to-transparent",
    accentColor: "text-purple-600",
    borderAccent: "border-purple-500/30",
    features: ["Estado de flow", "Criatividade", "Resistência mental"],
    originalPrice: "R$ 197,00",
    price: "R$ 147,00",
    discount: "25% OFF",
  },
  {
    id: "noite",
    name: "NZT Noite",
    tagline: "Recuperação & Memória",
    description: "Otimiza a consolidação da memória e prepara o cérebro para uma recuperação profunda.",
    gradient: "from-indigo-500/20 via-blue-500/10 to-transparent",
    accentColor: "text-indigo-600",
    borderAccent: "border-indigo-500/30",
    features: ["Memória consolidada", "Sono reparador", "Recuperação neural"],
    originalPrice: "R$ 197,00",
    price: "R$ 147,00",
    discount: "25% OFF",
  },
];

export function ProductCard() {
  return (
    <section id="produto" className="py-24 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm text-muted-foreground uppercase tracking-widest mb-3">
            Nossa Linha
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
            Suplementação Cognitiva Avançada
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {products.map((product) => (
            <div 
              key={product.id} 
              className={`bg-card border ${product.borderAccent} rounded-2xl p-8 flex flex-col h-full hover:shadow-lg transition-all duration-300`}
            >
              {/* Tag */}
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                {product.tagline}
              </p>
              
              {/* Product Name */}
              <h3 className={`text-xl font-semibold ${product.accentColor} mb-4`}>
                {product.name}
              </h3>

              {/* Product Visual - Clean placeholder for future product image */}
              <div className={`w-full h-48 mb-6 rounded-xl bg-gradient-to-br ${product.gradient} border border-border/30 flex items-center justify-center`}>
                <span className="text-4xl font-light text-muted-foreground/50">NZT</span>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-muted-foreground line-through">{product.originalPrice}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold text-foreground">{product.price}</span>
                  <span className="text-xs font-medium text-secondary">{product.discount}</span>
                </div>
              </div>

              {/* CTA */}
              <Link to="/login?signup=true" className="mt-auto">
                <Button variant="outline" className="w-full py-5 rounded-lg">
                  Saiba mais
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Bundle CTA */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-card border border-border/50 rounded-2xl px-10 py-8">
            <p className="text-sm text-muted-foreground mb-1">Pacote Completo</p>
            <p className="text-xs text-muted-foreground mb-4">Dia + Tarde + Noite</p>
            <div className="flex items-baseline justify-center gap-3 mb-6">
              <span className="text-muted-foreground line-through">R$ 591,00</span>
              <span className="text-3xl font-semibold text-foreground">R$ 397,00</span>
              <span className="text-sm font-medium text-secondary">33% OFF</span>
            </div>
            <Link to="/login?signup=true">
              <Button className="bg-primary hover:bg-primary/90 px-10 py-5 rounded-lg">
                Adquirir Pacote
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
