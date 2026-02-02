
# Proposta de Evolução — VYR Labs v2

## Diagnóstico do Estado Atual

O app já está sólido com:
- Ring gauges visuais (estilo Whoop)
- Cards interpretativos ricos
- Fluxo Home → Detalhe → Ação funcional
- Design system coerente

## Oportunidades de Evolução

### 1. Gráfico de Evolução no Labs (Alto Impacto)

**Problema:** O histórico mostra apenas lista de dias. Não há visualização temporal.

**Solução:** Adicionar um gráfico de linha/área no topo da aba "Histórico" mostrando a evolução do VYR State nos últimos 7-14 dias.

```text
┌─────────────────────────────────┐
│     Últimos 7 dias              │
│                                 │
│      ╭─╮                        │
│  ╭───╯ ╰──╮   ╭──╮             │
│ ─╯        ╰───╯  ╰──           │
│                                 │
│ seg ter qua qui sex sab dom    │
└─────────────────────────────────┘
```

### 2. Weekly Digest / Resumo Semanal

**Problema:** Não há visão consolidada da semana.

**Solução:** Criar um card no Labs que aparece aos domingos/segundas com:
- Score médio da semana
- Dia mais forte
- Padrão detectado
- Uma frase de interpretação

```text
┌─────────────────────────────────┐
│ Resumo da semana                │
│                                 │
│ Score médio: 74                 │
│ Melhor dia: quinta-feira        │
│                                 │
│ "Padrão de queda ao final do    │
│ dia. Considere ajustar ritmo    │
│ à tarde."                       │
└─────────────────────────────────┘
```

### 3. Comparativo Visual (Ontem vs Hoje)

**Problema:** O usuário não tem contexto comparativo imediato.

**Solução:** Adicionar na Home um indicador sutil mostrando a variação em relação a ontem:

```text
VYR STATE
   78
   ▲ +6 vs ontem
```

Sutil, sem julgamento, apenas informativo.

### 4. Animações de Entrada Refinadas

**Problema:** As transições são funcionais mas não premium.

**Solução:**
- Ring principal: animação de "draw" progressivo ao carregar
- Pilares: entrada escalonada (stagger) de 100ms entre cada
- Cards: slide-up sequencial suave
- Transições entre telas com fade crossover

### 5. Check-in Funcional com Cálculo de Score

**Problema:** O score é hardcoded. Não há input real do usuário.

**Solução:** Criar um fluxo de check-in matinal/noturno:

```text
┌─────────────────────────────────┐
│ Check-in da manhã               │
│                                 │
│ Como você dormiu?               │
│ ○ Muito bem  ○ Ok  ○ Mal        │
│                                 │
│ Nível de energia agora?         │
│ ○ Alto  ○ Médio  ○ Baixo        │
│                                 │
│ Clareza mental?                 │
│ ○ Alta  ○ Média  ○ Baixa        │
│                                 │
│ [ Calcular VYR State ]          │
└─────────────────────────────────┘
```

O score passa a ser calculado com base nas respostas.

### 6. Streak/Consistência (Sem Gamificação)

**Problema:** Não há incentivo sutil para uso contínuo.

**Solução:** Mostrar dias consecutivos de uso de forma neutra:

```text
"7 dias de acompanhamento contínuo"
```

Sem estrelas, sem troféus, sem urgência. Apenas informação.

### 7. Tela de Boas-Vindas Refinada

**Problema:** O Login vai direto para Home sem contexto.

**Solução:** Adicionar uma tela de primeiro uso que explica o conceito do VYR em 3 slides:

- Slide 1: "O VYR lê seu sistema cognitivo"
- Slide 2: "Interpreta o que isso significa hoje"
- Slide 3: "Sugere a ação certa para o momento"

### 8. Pilares com Micro-Sparkline

**Problema:** Os 3 mini-rings mostram apenas o valor atual.

**Solução:** Adicionar uma micro-linha de tendência (últimas 24h ou 7 dias) abaixo de cada pilar na tela de Detalhe:

```text
Energia ●●●●○
Energia disponível, porém controlada.
[sparkline: ─╮╭─╮╭──]
```

### 9. Haptic Feedback

**Problema:** Interações são visuais mas não táteis.

**Solução:** Adicionar vibração sutil em:
- Confirmação de ação (BOOT/HOLD/CLEAR)
- Registro de checkpoint
- Mudança de estado detectada

### 10. Horário Ideal Detectado

**Problema:** O sistema não indica quando agir proativamente.

**Solução:** Adicionar na Home um indicador de "janela cognitiva":

```text
┌─────────────────────────────────┐
│ ⏰ Janela ideal                 │
│ Próximas 2-3 horas são          │
│ favoráveis para foco profundo   │
└─────────────────────────────────┘
```

---

## Priorização Sugerida

### Fase 1 — Impacto Visual Imediato
1. Animações de entrada refinadas
2. Comparativo Ontem vs Hoje
3. Gráfico de evolução no Labs

### Fase 2 — Funcionalidade Real
4. Check-in funcional com cálculo
5. Streak/consistência
6. Weekly digest

### Fase 3 — Refinamento Premium
7. Sparklines nos pilares
8. Haptic feedback
9. Janela ideal
10. Onboarding refinado

---

## Resumo Técnico

| Evolução | Complexidade | Arquivos Afetados |
|----------|--------------|-------------------|
| Animações refinadas | Baixa | StateRing, PillarRing, Home |
| Comparativo vs ontem | Baixa | Home, vyr-store |
| Gráfico evolução | Média | Labs (novo componente) |
| Check-in funcional | Média | Nova página + store |
| Weekly digest | Média | Labs + vyr-store |
| Sparklines | Média | PillarRing, StateDetail |
| Streak | Baixa | Home + store |
| Haptic | Baixa | Hooks + componentes de ação |
| Janela ideal | Média | Home + store |
| Onboarding | Média | Nova página |

---

## Próximos Passos

Posso implementar qualquer combinação dessas evoluções. Recomendo começar pela **Fase 1** para impacto visual imediato, seguido do **check-in funcional** para dar vida real ao score.
