import { ScaleBlock } from "@/components/nzt";
import { cn } from "@/lib/utils";

interface StepSonoProps {
  qualidadeSono: number | null;
  horasSono: number | null;
  horarioAcordar: string;
  horarioDormir: string;
  onQualidadeSonoChange: (v: number) => void;
  onHorasSonoChange: (v: number) => void;
  onHorarioAcordarChange: (v: string) => void;
  onHorarioDormirChange: (v: string) => void;
}

const HORAS_SONO = [4, 5, 6, 7, 8, 9, 10];

export function StepSono({ 
  qualidadeSono, 
  horasSono, 
  horarioAcordar, 
  horarioDormir,
  onQualidadeSonoChange,
  onHorasSonoChange,
  onHorarioAcordarChange,
  onHorarioDormirChange
}: StepSonoProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h3 className="text-lg font-bold text-vyr-white mb-2">
          Como você avalia sua qualidade de sono geral?
        </h3>
        <p className="text-sm text-vyr-gray-400 mb-4">
          Considere as últimas semanas de forma geral.
        </p>
        
        <ScaleBlock
          title="Qualidade geral do sono"
          question="Como você classificaria a qualidade do seu sono nas últimas semanas?"
          anchor="0=péssimo • 10=excelente"
          value={qualidadeSono ?? 5}
          onChange={onQualidadeSonoChange}
        />
      </div>

      <div>
        <h3 className="text-lg font-bold text-vyr-white mb-2">
          Quantas horas você costuma dormir por noite?
        </h3>
        
        <div className="flex flex-wrap gap-2">
          {HORAS_SONO.map((h) => (
            <button
              key={h}
              onClick={() => onHorasSonoChange(h)}
              className={cn(
                "w-14 h-14 rounded-xl border font-bold transition-all duration-200",
                horasSono === h
                  ? "border-vyr-accent bg-vyr-accent/20 text-vyr-accent"
                  : "border-vyr-gray-700/50 bg-vyr-graphite-dark/60 text-vyr-gray-300 hover:bg-vyr-graphite/80 hover:border-vyr-gray-600"
              )}
            >
              {h}h
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <h3 className="text-base font-bold text-vyr-white mb-2">
            Horário que costuma acordar
          </h3>
          <input
            type="time"
            value={horarioAcordar}
            onChange={(e) => onHorarioAcordarChange(e.target.value)}
            className="w-full p-4 rounded-xl border border-vyr-gray-700/50 bg-vyr-graphite-dark/60 text-vyr-white focus:outline-none focus:ring-2 focus:ring-vyr-accent/50 focus:border-vyr-accent"
          />
        </div>
        
        <div>
          <h3 className="text-base font-bold text-vyr-white mb-2">
            Horário que costuma dormir
          </h3>
          <input
            type="time"
            value={horarioDormir}
            onChange={(e) => onHorarioDormirChange(e.target.value)}
            className="w-full p-4 rounded-xl border border-vyr-gray-700/50 bg-vyr-graphite-dark/60 text-vyr-white focus:outline-none focus:ring-2 focus:ring-vyr-accent/50 focus:border-vyr-accent"
          />
        </div>
      </div>
    </div>
  );
}
