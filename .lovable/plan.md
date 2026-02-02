
# Proposta de Evolução — VYR Labs v3
## Simulação Realista + Interação Aprimorada

---

## 1. CENÁRIO REAL DO USUÁRIO

### Perfil do Usuário Simulado

**Nome:** Diego  
**Produto:** Kit 30 dias (BOOT + HOLD + CLEAR)  
**Wearable:** Pulseira inteligente (ex: Mi Band, Galaxy Fit, Amazfit)  
**Integração:** API do app da pulseira sincroniza dados noturnos

### Dados que a Pulseira Entrega (via API)

| Biomarcador | Fonte Real | O que a VYR Recebe |
|-------------|------------|-------------------|
| RHR | Sensor cardíaco | Valor numérico (bpm) |
| HRV | Derivado do sono | Índice de variabilidade |
| Sono total | Acelerômetro + HR | Horas decimais |
| Sono REM/Profundo | Análise do fabricante | Percentuais |
| Despertares | Detecção de movimento | Contagem |
| Regularidade | Histórico de horários | Delta vs média |
| Atividade dia anterior | Passos + calorias | Nível (baixo/médio/alto) |
| Stress score | Derivado do fabricante | Índice 0-100 |

**Importante:** O usuário NUNCA vê esses dados. Eles alimentam o modelo interno.

---

## 2. FLUXO DIÁRIO REAL (Jornada de 24h)

### Fase 1 — Sincronização Noturna (automática)
```
03:00 - 06:00
├── API da pulseira envia dados do sono
├── VYR processa: sono, HRV, RHR, regularidade
├── Sistema calcula estado base do dia
└── Define pilares iniciais (Energia, Clareza, Estabilidade)
```

### Fase 2 — Abertura do App (manhã)
```
07:00 - 09:00 (primeiro acesso)
├── Usuário abre o app
├── VYR já processou a noite
├── Home exibe estado atual + ação recomendada
└── Exemplo: "Sistema pronto para BOOT"
```

### Fase 3 — Ciclo Ativo (dia)
```
09:00 - 18:00
├── Usuário toma sachê conforme ação (BOOT)
├── VYR monitora contexto ao longo do dia
├── Transições: BOOT → HOLD → CLEAR
└── Checkpoints opcionais registram momentos
```

### Fase 4 — Encerramento (noite)
```
18:00 - 22:00
├── Sistema sugere CLEAR
├── Usuário toma sachê noturno
├── VYR gera revisão do dia
└── Prepara próximo ciclo
```

---

## 3. NOVA ARQUITETURA DE DADOS

### Tipos Novos (vyr-types.ts)

```typescript
// Dados crus da pulseira (NUNCA exibidos)
interface WearableData {
  date: string;
  rhr: number;                    // 55-80 bpm típico
  hrvIndex: number;               // 0-100 (normalizado)
  sleepDuration: number;          // em horas decimais
  sleepQuality: number;           // 0-100
  sleepRegularity: number;        // -60 a +60 min vs média
  awakenings: number;             // 0-10+
  previousDayActivity: "low" | "medium" | "high";
  stressScore: number;            // 0-100
}

// Estado computado pela VYR
interface ComputedState {
  // Pilares derivados (0-5)
  energia: number;
  clareza: number;
  estabilidade: number;
  
  // Score final (0-100)
  vyrScore: number;
  
  // Interpretações
  stateLabel: string;
  dominantPillar: "energia" | "clareza" | "estabilidade";
  limitingPillar: "energia" | "clareza" | "estabilidade";
  
  // Ação recomendada
  recommendedAction: MomentAction;
  actionReason: string;
}

// Contexto do dia
interface DayContext {
  date: string;
  wearableData: WearableData;
  computedState: ComputedState;
  sachetsUsed: MomentAction[];
  checkpoints: Checkpoint[];
}
```

---

## 4. ALGORITMO DE CÁLCULO (invisível ao usuário)

### 4.1 Cálculo do Pilar ENERGIA

```typescript
function computeEnergia(data: WearableData): number {
  // Inputs: RHR, sono, atividade anterior
  
  let base = 3; // neutro
  
  // RHR baixo = mais energia
  if (data.rhr < 58) base += 1;
  if (data.rhr > 70) base -= 1;
  
  // Sono suficiente = mais energia
  if (data.sleepDuration >= 7) base += 0.5;
  if (data.sleepDuration < 5.5) base -= 1.5;
  
  // Atividade alta ontem = menos energia hoje
  if (data.previousDayActivity === "high") base -= 0.5;
  
  return clamp(base, 1, 5);
}
```

### 4.2 Cálculo do Pilar CLAREZA

```typescript
function computeClareza(data: WearableData): number {
  // Inputs: regularidade, qualidade do sono, despertares
  
  let base = 3;
  
  // Sono regular = mais clareza
  if (Math.abs(data.sleepRegularity) < 20) base += 1;
  if (Math.abs(data.sleepRegularity) > 45) base -= 1;
  
  // Qualidade alta = mais clareza
  if (data.sleepQuality > 75) base += 0.5;
  if (data.sleepQuality < 50) base -= 1;
  
  // Muitos despertares = menos clareza
  if (data.awakenings > 5) base -= 0.5;
  
  return clamp(base, 1, 5);
}
```

### 4.3 Cálculo do Pilar ESTABILIDADE

```typescript
function computeEstabilidade(data: WearableData): number {
  // Inputs: HRV, stress score
  
  let base = 3;
  
  // HRV alto = mais estabilidade
  if (data.hrvIndex > 70) base += 1.5;
  if (data.hrvIndex < 40) base -= 1;
  
  // Stress baixo = mais estabilidade
  if (data.stressScore < 30) base += 0.5;
  if (data.stressScore > 60) base -= 1;
  
  return clamp(base, 1, 5);
}
```

### 4.4 Score Final

```typescript
function computeVYRScore(pillars: VYRPillars): number {
  // Média ponderada com penalização por limitante
  const avg = (pillars.energia + pillars.clareza + pillars.estabilidade) / 3;
  const min = Math.min(pillars.energia, pillars.clareza, pillars.estabilidade);
  
  // O pilar mais baixo "puxa" o score
  const weighted = (avg * 0.6) + (min * 0.4);
  
  // Converte para 0-100
  return Math.round((weighted / 5) * 100);
}
```

---

## 5. SISTEMA DE INTERPRETAÇÃO (o que o usuário vê)

### Tradução: Biomarcador → Insight

| Biomarcador (invisível) | Insight (visível) |
|-------------------------|-------------------|
| RHR alto + sono curto | "O sistema indica maior custo fisiológico hoje" |
| HRV baixo | "Menor tolerância a sobrecarga detectada" |
| Sono irregular | "Ritmo inconsistente, economia cognitiva sugerida" |
| Qualidade sono alta | "O sistema iniciou o dia com boa recuperação" |
| Stress score alto | "Sinais de tensão fisiológica acima do ideal" |
| Muitos despertares | "Fragmentação detectada, clareza pode variar" |

### Tradução: Estado → Ação Recomendada

| Estado | Ação | Razão |
|--------|------|-------|
| E4+ C4+ Es3+ | BOOT | "Sistema pronto para ativação cognitiva" |
| E3 C4+ Es3 | HOLD | "Janela de sustentação favorável" |
| E2 C3 Es2 | HOLD (leve) | "Manutenção conservadora sugerida" |
| E2- ou Es2- | CLEAR | "Encerramento cognitivo disponível" |

---

## 6. SIMULAÇÃO DE 7 DIAS (cenário realista)

### Dia 1 (Segunda) — Início do Protocolo

**Dados da Pulseira (invisíveis):**
```
RHR: 62 bpm
HRV: 58
Sono: 6.5h
Qualidade: 72%
Regularidade: +15 min
Despertares: 3
Atividade ontem: média
Stress: 42
```

**Estado Computado:**
```
Energia: 3/5
Clareza: 4/5
Estabilidade: 3/5
VYR Score: 68
```

**O que o usuário vê:**

```
VYR STATE: 68
"Início de ciclo"

Leitura do sistema:
"Clareza preservada, energia moderada.
O limitante hoje é a reserva energética."

Hoje isso significa:
• Capacidade de foco disponível, mas com limite de duração
• Pausas estratégicas preservam melhor o rendimento

Ação: BOOT
"Sistema pronto para ativação inicial."
```

---

### Dia 4 (Quinta) — Dia de Alta Performance

**Dados da Pulseira:**
```
RHR: 56 bpm
HRV: 75
Sono: 7.8h
Qualidade: 88%
Regularidade: -5 min
Despertares: 1
Atividade ontem: baixa
Stress: 25
```

**Estado Computado:**
```
Energia: 5/5
Clareza: 5/5
Estabilidade: 4/5
VYR Score: 91
```

**O que o usuário vê:**

```
VYR STATE: 91
"Janela aberta"

Leitura do sistema:
"O sistema identificou condições favoráveis em todos os pilares.
Hoje há espaço para exigência cognitiva elevada."

Hoje isso significa:
• Boa capacidade para trabalho profundo e contínuo
• O sistema suporta demandas intensas com menor desgaste

Ação: BOOT
"Janela ideal para ativação completa."
```

---

### Dia 6 (Sábado) — Dia de Recuperação

**Dados da Pulseira:**
```
RHR: 68 bpm
HRV: 42
Sono: 5.2h
Qualidade: 55%
Regularidade: +90 min (dormiu tarde)
Despertares: 6
Atividade ontem: alta (festa)
Stress: 58
```

**Estado Computado:**
```
Energia: 2/5
Clareza: 2/5
Estabilidade: 2/5
VYR Score: 38
```

**O que o usuário vê:**

```
VYR STATE: 38
"Recuperação necessária"

Leitura do sistema:
"O sistema indica sinais de sobrecarga residual.
Recuperação tende a ser mais eficaz que exigência hoje."

Hoje isso significa:
• Não é o momento ideal para demandas intensas
• O sistema prioriza restauração sobre performance

Ação: CLEAR
"Encerramento cognitivo disponível."
```

---

## 7. MELHORIAS NA INTERAÇÃO

### 7.1 Novo Card: Contexto Fisiológico (sem dados brutos)

Em vez de mostrar RHR, HRV, etc., mostrar uma leitura qualitativa:

```
┌─────────────────────────────────────┐
│ CONTEXTO DO DIA                     │
│                                     │
│ 🟢 Recuperação adequada             │
│ 🟡 Ritmo ligeiramente irregular     │
│ 🟢 Reserva fisiológica preservada   │
└─────────────────────────────────────┘
```

Cores semânticas:
- 🟢 Verde: favorável
- 🟡 Âmbar: atenção
- 🔴 Vermelho: limitante

### 7.2 Novo Card: Janela Cognitiva

Indica proativamente quando há condições ideais:

```
┌─────────────────────────────────────┐
│ ⏰ JANELA COGNITIVA                 │
│                                     │
│ Próximas 3-4 horas são favoráveis   │
│ para foco profundo.                 │
│                                     │
│ Considere priorizar tarefas         │
│ que exigem concentração.            │
└─────────────────────────────────────┘
```

Só aparece quando o estado permite.

### 7.3 Confirmação de Sachê (novo fluxo)

Após ativar BOOT/HOLD/CLEAR:

```
┌─────────────────────────────────────┐
│ ✓ BOOT ativado                      │
│                                     │
│ O sistema registrou o início do     │
│ ciclo às 08:45.                     │
│                                     │
│ Próxima leitura disponível em       │
│ aproximadamente 2-3 horas.          │
│                                     │
│ [ Adicionar observação ]            │
└─────────────────────────────────────┘
```

### 7.4 Transições Sugeridas

O sistema indica quando mudar de fase:

```
┌─────────────────────────────────────┐
│ 💡 TRANSIÇÃO DISPONÍVEL             │
│                                     │
│ O sistema sugere transição          │
│ para HOLD.                          │
│                                     │
│ Sinais de estabilização detectados. │
│                                     │
│ [ Ver detalhes ] [ Ativar HOLD ]    │
└─────────────────────────────────────┘
```

### 7.5 Labs: Padrões Detectados (novo)

Na aba Histórico, adicionar seção de padrões:

```
┌─────────────────────────────────────┐
│ PADRÕES DETECTADOS                  │
│ Últimos 14 dias                     │
│                                     │
│ • Clareza tende a ser maior às      │
│   manhãs de segunda e terça.        │
│                                     │
│ • Dias após exercício intenso       │
│   mostram menor estabilidade.       │
│                                     │
│ • Regularidade do sono correlaciona │
│   positivamente com clareza.        │
└─────────────────────────────────────┘
```

### 7.6 Revisão Diária Aprimorada

Narrativa em 3 blocos + valor gerado:

```
┌─────────────────────────────────────┐
│ REVISÃO DO DIA                      │
│ 31 de janeiro                       │
│                                     │
│ INÍCIO                              │
│ "Você iniciou o dia com energia     │
│ moderada e clareza preservada."     │
│                                     │
│ DESENVOLVIMENTO                     │
│ "O ciclo BOOT foi ativado às 08:45. │
│ Transição para HOLD às 14:20        │
│ manteve estabilidade."              │
│                                     │
│ ENCERRAMENTO                        │
│ "CLEAR ativado às 19:30.            │
│ O sistema registrou fechamento      │
│ adequado do ciclo."                 │
│                                     │
│ ─────────────────────────────────── │
│                                     │
│ VALOR GERADO                        │
│ "O sistema manteve coerência entre  │
│ estado e estratégia ao longo do     │
│ dia. Boa adequação detectada."      │
└─────────────────────────────────────┘
```

---

## 8. ARQUIVOS A CRIAR/MODIFICAR

| Arquivo | Ação | Descrição |
|---------|------|-----------|
| `src/lib/vyr-types.ts` | Modificar | Adicionar tipos WearableData, ComputedState, DayContext |
| `src/lib/vyr-engine.ts` | Criar | Algoritmos de cálculo dos pilares e score |
| `src/lib/vyr-interpreter.ts` | Criar | Tradução de biomarcadores para insights |
| `src/lib/vyr-mock-data.ts` | Criar | Dados simulados de 30 dias realistas |
| `src/components/vyr/ContextCard.tsx` | Criar | Card de contexto fisiológico qualitativo |
| `src/components/vyr/CognitiveWindow.tsx` | Criar | Card de janela cognitiva |
| `src/components/vyr/TransitionCard.tsx` | Criar | Card de transição sugerida |
| `src/components/vyr/PatternCard.tsx` | Criar | Card de padrões detectados |
| `src/components/vyr/SachetConfirmation.tsx` | Criar | Modal de confirmação de sachê |
| `src/pages/Home.tsx` | Modificar | Adicionar novos cards e interações |
| `src/pages/Labs.tsx` | Modificar | Adicionar seção de padrões |
| `src/pages/DayReview.tsx` | Modificar | Implementar narrativa em 3 blocos |

---

## 9. PRÓXIMOS PASSOS

### Fase 1 — Foundation (prioridade)
1. Criar `vyr-engine.ts` com algoritmos de cálculo
2. Criar `vyr-interpreter.ts` com tradução de biomarcadores
3. Criar `vyr-mock-data.ts` com simulação de 30 dias

### Fase 2 — Novos Componentes
4. Card de Contexto Fisiológico
5. Card de Janela Cognitiva
6. Card de Transição Sugerida

### Fase 3 — Integração
7. Atualizar Home com novos cards
8. Atualizar Labs com padrões detectados
9. Implementar revisão diária completa

---

## 10. RESULTADO ESPERADO

Após implementação, o usuário terá:

- **Experiência realista** baseada em biomarcadores invisíveis
- **Interpretações contextuais** que explicam o "porquê" do estado
- **Proatividade** do sistema sugerindo transições
- **Padrões detectados** ao longo do tempo
- **Narrativa de valor** clara e não-técnica

Tudo isso sem NUNCA mostrar um número de HRV, BPM ou gráfico fisiológico.
