

# Ranges e Niveis do VYR State + Contexto alinhado aos Pilares

## Problema Atual

**1. Sem niveis formais:** O score 0-100 usa thresholds diferentes em cada funcao (85, 80, 75, 70, 65, 55, 50, 45...), sem uma definicao unica de "ruim", "moderado" ou "otimo".

**2. Contexto do Dia desconectado dos pilares:** O card "Contexto do Dia" mostra 3 items genericos (Recuperacao, Ritmo, Reserva fisiologica) baseados em thresholds fixos de biomarcadores brutos (RHR < 62, HRV > 60, etc.). Esses items nao refletem os pilares computados (Energia, Clareza, Estabilidade) e podem contradizer o estado calculado.

---

## Solucao

### 1. Definir Ranges e Niveis Oficiais do VYR State

Tabela de referencia unica para todo o sistema:

```text
Score       Nivel          Label interno     Cor semantica
------      -----          -------------     -------------
85-100      Otimo          "optimal"         Slate Blue (favoravel)
70-84       Bom            "good"            Slate Blue (favoravel)
55-69       Moderado       "moderate"        Dust Gray (atencao)
40-54       Baixo          "low"             Energy Slate (limitante)
0-39        Critico        "critical"        Energy Slate (limitante)
```

Isso sera exportado como tipo `StateLevel` e funcao `getStateLevel(score)` no `vyr-engine.ts`, unificando todos os thresholds do sistema.

### 2. Alinhar Contexto do Dia aos 3 Pilares

Substituir os 3 items genericos por items derivados diretamente dos pilares computados:

```text
Antes (generico)                    Depois (alinhado)
-----------------                   ------------------
Recuperacao adequada/parcial/...  -> Energia: [status baseado no pilar]
Ritmo consistente/irregular/...   -> Clareza: [status baseado no pilar]
Reserva fisiologica preservada... -> Estabilidade: [status baseado no pilar]
```

Cada pilar tera seu proprio mapeamento para status qualitativo:

```text
Pilar >= 4.0  -> "favorable"  (ex: "Energia preservada")
Pilar >= 3.0  -> "attention"  (ex: "Clareza parcial")
Pilar <  3.0  -> "limiting"   (ex: "Estabilidade reduzida")
```

---

## Detalhes Tecnicos

### Arquivos modificados

**`src/lib/vyr-engine.ts`**
- Adicionar tipo `StateLevel` ("optimal" | "good" | "moderate" | "low" | "critical")
- Adicionar funcao `getStateLevel(score): { level: StateLevel, label: string }`
- Refatorar `getStateLabel()` para usar os ranges definidos

**`src/lib/vyr-types.ts`**
- Exportar `StateLevel` type

**`src/lib/vyr-interpreter.ts`**
- Reescrever `generatePhysiologicalContext()` para receber `ComputedState` alem de `WearableData`
- Novos items derivados dos pilares computados com labels descritivos por faixa
- Manter funcoes antigas como internas (podem alimentar diagnostico)

**`src/lib/vyr-mock-data.ts`**
- Atualizar chamada de `generatePhysiologicalContext()` para passar o `computedState`

**`src/components/vyr/ContextCard.tsx`**
- Sem mudanca estrutural (ja consome `PhysiologicalContext` corretamente)

**`src/test/vyr-engine.test.ts`**
- Adicionar testes para `getStateLevel()` validando cada range

