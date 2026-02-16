

# Limpeza de Dados Simulados (Mock → Real)

## Objetivo
Remover todos os dados simulados do frontend e preparar o app para receber exclusivamente dados reais do Apple Health / J-Style, usando o banco de dados como fonte de verdade.

## O que muda para o usuario
- A Home mostrara estado "vazio" quando nao houver dados reais ainda (em vez de dados inventados)
- O historico comecara em branco e sera preenchido conforme dados reais chegam
- Labs mostrara mensagens de "sem dados" ate o usuario ter registros reais
- O fluxo natural sera: conectar wearable -> dados aparecem -> app funciona

## Mudancas Tecnicas

### 1. `src/lib/vyr-mock-data.ts`
- **Manter** `DEMO_SCENARIOS` (usado nos testes automatizados)
- **Remover** `generate30DayHistory`, `getRecentHistory`, `getTodayContext` (geradores de dados falsos)
- **Manter** `toHistoryDay` (funcao de conversao util para dados reais)

### 2. `src/lib/vyr-store.ts` (maior mudanca)
- **Remover** import de `generate30DayHistory`
- **Remover** `initialReviews` (reviews hardcoded)
- **Substituir** `useMemo(() => generate30DayHistory())` por dados do banco (query a `computed_states`, `ring_daily_data`)
- **Adicionar** estado vazio como fallback: score 0, pilares zerados, sem historico
- **Buscar** `daily_reviews` do banco em vez de usar array fixo
- **Buscar** `checkpoints` do banco em vez de usar mock
- **Buscar** `action_logs` do banco em vez de array vazio local

### 3. `src/pages/Labs.tsx`
- **Remover** mock de `perceptionRecords` (linhas 132-136)
- **Remover** mock de `signals` (linhas 150-155)
- **Inicializar** `perceptionRecords` como array vazio `[]`
- Manter a logica de submit (ja grava localmente, depois conectaremos ao banco)

### 4. `src/pages/Home.tsx`
- **Adicionar** estado vazio: quando nao ha dados, mostrar ring com score 0 e mensagem "Conecte um wearable para comecar"
- Manter toda a estrutura visual — so mudar o conteudo quando vazio

### 5. `src/test/vyr-engine.test.ts`
- **Sem alteracao** — os testes usam `DEMO_SCENARIOS` que sera mantido, pois testa o motor de calculo (nao os dados mock do app)

## Fluxo de Dados Pos-Limpeza

```text
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Apple Health │────>│  Banco de    │────>│  vyr-store   │
│ / J-Style    │     │  Dados       │     │  (queries)   │
└──────────────┘     └──────────────┘     └──────────────┘
                      ring_daily_data            │
                      computed_states            ▼
                      action_logs          ┌──────────┐
                      checkpoints          │  Home /  │
                      daily_reviews        │  Labs    │
                                           └──────────┘
```

### Estado Vazio (sem dados)
- VYR Score: exibe "---" ou 0
- Pilares: exibem 0 com visual apagado
- Insight Card: "Conecte seu wearable para iniciar a leitura do seu estado"
- Historico: vazio com mensagem orientadora
- Acao: desabilitada ate haver dados

## O que NAO muda
- Motor de calculo (`vyr-engine.ts`) — continua intacto
- Baseline (`vyr-baseline.ts`) — continua intacto
- Interprete (`vyr-interpreter.ts`) — continua intacto
- Tipos (`vyr-types.ts`) — continuam intactos
- Testes automatizados — continuam funcionando
- Visual/layout das telas — mesmo design

## Riscos e Mitigacao
- **Risco**: app fica "vazio" sem dados reais ainda
  - **Mitigacao**: estados vazios com mensagens orientadoras claras
- **Risco**: queries ao banco ainda nao implementadas para todos os dados
  - **Mitigacao**: implementar queries basicas primeiro (ring_daily_data, computed_states), expandir depois

