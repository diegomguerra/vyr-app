

# Algoritmo VYR State — Production-Ready

## Objetivo

Tornar o algoritmo de calculo do VYR State robusto o suficiente para funcionar corretamente com dados reais, independente da fonte (mock ou wearable). Os dados podem continuar fictícios, mas o algoritmo precisa ser correto.

## Problemas Atuais

1. **Thresholds fixos para todos os usuarios** — RHR < 58 e bom para um atleta, mas otimo para alguem sedentario. Sem baseline pessoal, o algoritmo erra para a maioria dos usuarios reais.

2. **Hora do dia ignorada** — O algoritmo recomenda BOOT, HOLD ou CLEAR sem considerar o horario. BOOT as 22h ou CLEAR as 8h nao faz sentido.

3. **Historico de sachets ignorado** — Se o usuario ja tomou BOOT, o sistema ainda pode recomendar BOOT novamente.

4. **Sem validacao de entrada** — Dados fora de range (RHR = -5, HRV = 999) passam sem erro.

5. **Label de estado simplista** — `getStateLabel` usa apenas o score numerico, ignorando a composicao dos pilares.

---

## Plano de Implementacao

### 1. Baseline Pessoal (`src/lib/vyr-baseline.ts`) — NOVO ARQUIVO

Criar um sistema de baseline que normaliza os biomarcadores em relacao ao proprio usuario:

- Tipo `PersonalBaseline` com media e desvio padrao para cada biomarcador (RHR, HRV, sleepDuration, etc.)
- Funcao `computeBaselineFromHistory(data: WearableData[]): PersonalBaseline` que calcula a partir dos ultimos 7-14 dias
- Funcao `normalizeToBaseline(value: number, mean: number, std: number): number` que converte valor absoluto em desvio relativo (-2 a +2)
- Baseline padrao (fallback) para usuarios sem historico suficiente

Assim, em vez de "RHR < 58 = bom", o calculo sera "RHR esta 1 desvio abaixo da sua media = bom".

### 2. Validacao de Entrada (`src/lib/vyr-engine.ts`)

Adicionar funcao `validateWearableData(data: WearableData): WearableData` que:

- Aplica clamp em todos os campos para ranges fisiologicamente possiveis
- RHR: 35-120 bpm
- HRV: 0-100
- Sleep duration: 0-14h
- Sleep quality: 0-100
- Awakenings: 0-30
- Stress: 0-100
- Retorna dados sanitizados

### 3. Contexto Temporal na Acao (`src/lib/vyr-engine.ts`)

Modificar `getRecommendedAction` para receber hora do dia e historico de sachets:

```text
Regras temporais:
- 05h-11h: BOOT permitido (janela de ativacao)
- 11h-17h: HOLD preferido (sustentacao)
- 17h-22h: CLEAR preferido (recuperacao)
- 22h-05h: Sempre CLEAR

Regras de historico:
- Se ja tomou BOOT hoje: nao recomendar BOOT
- Se ja tomou HOLD hoje: nao recomendar HOLD
- Sequencia esperada: BOOT -> HOLD -> CLEAR
```

### 4. StateLabel Rico (`src/lib/vyr-engine.ts`)

Reescrever `getStateLabel` para considerar a composicao dos pilares:

```text
Exemplos:
- Score 85 + clareza dominante = "Foco sustentado"
- Score 85 + energia dominante = "Energia plena"
- Score 60 + estabilidade baixa = "Foco instavel"
- Score 40 + energia baixa = "Recuperacao necessaria"
```

### 5. Atualizar Types (`src/lib/vyr-types.ts`)

- Adicionar `PersonalBaseline` ao tipo
- Adicionar `timeOfDay: number` (hora) ao contexto
- Adicionar `sachetsTakenToday: MomentAction[]` ao contexto

### 6. Atualizar Store (`src/lib/vyr-store.ts`)

- Passar hora atual e sachets tomados para `getRecommendedAction`
- Computar baseline a partir do historico mock
- Usar baseline nos calculos dos pilares

### 7. Atualizar Mock Data (`src/lib/vyr-mock-data.ts`)

- Gerar baseline a partir dos 30 dias simulados
- Incluir hora do dia nos cenarios

---

## Arquivos Afetados

| Arquivo | Tipo |
|---|---|
| `src/lib/vyr-baseline.ts` | Novo |
| `src/lib/vyr-types.ts` | Modificado |
| `src/lib/vyr-engine.ts` | Modificado |
| `src/lib/vyr-interpreter.ts` | Ajuste menor |
| `src/lib/vyr-store.ts` | Modificado |
| `src/lib/vyr-mock-data.ts` | Modificado |

Nenhum arquivo de UI precisa mudar — as interfaces `VYRState` e `ComputedState` mantem a mesma forma, apenas os valores serao mais precisos.

---

## Resultado Esperado

O algoritmo passa a ser correto para qualquer usuario real:
- Alguem com RHR 50 e alguem com RHR 70 recebem scores justos (relativos ao proprio baseline)
- As recomendacoes respeitam o horario do dia
- Nao ha recomendacao duplicada de sachet
- Dados invalidos sao tratados silenciosamente
- Os labels refletem a composicao real do estado, nao apenas o numero

