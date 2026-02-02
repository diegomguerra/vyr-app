
# Plano: Reestruturar VYR Labs com Riqueza de Conteudo

## Problema Identificado
A implementacao atual segue uma filosofia "minimalista vazia" - apenas score + botao na Home. O prompt definitivo exige uma filosofia "rica em significado" onde cada tela entrega valor cognitivo atraves de 3 camadas: Estado + Interpretacao + Acao.

---

## Mudancas Necessarias

### 1. Modelo de Dados Expandido

**vyr-types.ts** - Adicionar campos:
```typescript
interface VYRState {
  // Existentes...
  
  // NOVOS - para Home rica
  microDescription: string;        // "Foco sustentado com boa clareza mental"
  systemReading: {
    whyScore: string;              // Por que o score e esse
    limitingFactor: string;        // Qual o limitante
    dayRisk: string;               // Qual o risco do dia
  };
  todayMeaning: string[];          // 2 bullets de consequencia pratica
  actionConsequence: string;       // Texto abaixo do botao
  
  // NOVOS - para pilares interpretados
  pillarDescriptions: {
    energia: string;
    clareza: string;
    estabilidade: string;
  };
  systemDiagnosis: string;         // 2+ frases de diagnostico
}

interface DailyReview {
  // Existentes...
  
  // NOVO - valor gerado obrigatorio
  valueGenerated: string;
}

interface HistoryDay {
  date: string;
  score: number;
  dominantState: string;           // "foco sustentado"
  systemNote: string;              // "dia consistente, sem quedas"
}
```

---

### 2. HOME - Reestruturacao Completa

**De (atual):**
- Saudacao
- Score + label curto
- Botao sozinho

**Para (novo):**

```text
[Saudacao]

┌─────────────────────────────────┐
│ CARD 1 - ESTADO GERAL           │
│                                 │
│ VYR STATE                       │
│ 78                              │
│                                 │
│ Estado atual:                   │
│ Foco sustentado com boa         │
│ clareza mental.                 │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ CARD 2 - LEITURA DO SISTEMA     │
│                                 │
│ Clareza elevada e energia       │
│ controlada.                     │
│ O limitante hoje e a            │
│ estabilidade ao longo do tempo. │
│ Evite sobrecarga cognitiva      │
│ prolongada.                     │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ CARD 3 - HOJE ISSO SIGNIFICA    │
│                                 │
│ * Boa capacidade de manter      │
│   foco continuo                 │
│ * Melhor desempenho com pausas  │
│   estrategicas                  │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ CARD 4 - ACAO                   │
│                                 │
│    [ Ativar HOLD ]              │
│                                 │
│ Manter foco estavel pelas       │
│ proximas horas, priorizando     │
│ economia cognitiva.             │
└─────────────────────────────────┘
```

---

### 3. STATE DETAIL - Adicionar Interpretacao

**Pilares com texto:**
```text
Energia ●●●●○
Energia disponivel, porem controlada.

Clareza ●●●●●
Boa capacidade de foco e processamento.

Estabilidade ●●●○○
Sustentacao moderada ao longo do tempo.
```

**Novo bloco de diagnostico:**
```text
Diagnostico do sistema

O sistema indica um estado favoravel para execucao.
O principal cuidado hoje e evitar longos periodos sem pausa.
```

---

### 4. MOMENT ACTION - Expandir Texto

**De:**
```text
Sustentacao
Janela de sustentacao detectada.
Manutencao do estado atual.
```

**Para:**
```text
Sustentacao
Janela de sustentacao detectada.

O sistema ira priorizar estabilidade cognitiva,
evitando picos e quedas bruscas de energia.

Voce deve esperar uma sensacao de constancia
ao longo das proximas horas.

[ Ativar HOLD ]
```

---

### 5. DAY REVIEW - Adicionar Valor Gerado

**Estrutura nova:**
```text
Encerramento do dia

Inicio do dia
Voce iniciou o dia com estabilidade moderada.

Ao longo do dia
Ajustou o ritmo conforme as demandas cognitivas.

Encerramento
Finalizou o dia com clareza funcional.

────────────────────────────────

O sistema manteve coerencia entre estado
e estrategia ao longo do dia.

Ciclo concluido.
```

---

### 6. CHECKPOINT - Ajuste de Copy

**De:** "Deseja registrar como esta agora?"
**Para:** "Como voce percebe este momento agora?"

---

### 7. LABS - Historico Rico

**De:**
```text
01 fev.     78
```

**Para:**
```text
01 de fev.
Estado dominante: foco sustentado
Nota do sistema: dia consistente, sem quedas abruptas
Score: 78
```

---

## Arquivos a Modificar

1. **src/lib/vyr-types.ts** - Expandir interfaces
2. **src/lib/vyr-store.ts** - Adicionar dados mock ricos
3. **src/pages/Home.tsx** - Reescrever com 4 cards
4. **src/pages/StateDetail.tsx** - Adicionar interpretacoes
5. **src/pages/MomentAction.tsx** - Expandir textos
6. **src/pages/DayReview.tsx** - Adicionar valor gerado
7. **src/pages/Checkpoint.tsx** - Ajustar copy
8. **src/pages/Labs.tsx** - Enriquecer historico

---

## Design Visual

- Cards com fundo `bg-vyr-bg-surface` e `rounded-2xl`
- Titulos pequenos em `text-vyr-text-muted` uppercase
- Textos principais em `text-vyr-text-secondary`
- Muito espaco negativo entre cards
- Nada "flat vazio" - cada card deve ter presenca visual

---

## Resultado Esperado

Usuario abre o app e sente:
- "Eu entendi meu estado"
- "Eu sei o que fazer agora"
- "Isso faz sentido para hoje"
- "O sistema esta comigo"

Nenhuma tela sera "apenas bonita" - todas entregarao valor cognitivo explicito.
