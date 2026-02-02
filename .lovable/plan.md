
# Plano: Sistema de Conexão com Wearable

## Objetivo
Criar a experiência completa de conexão com wearables, onde o usuário:
1. Entende que precisa conectar um dispositivo
2. Faz a conexão (fluxo simulado de OAuth)
3. Vê confirmação qualitativa (sem biomarcadores brutos)
4. Tem visibilidade contínua do status de sincronização

---

## Arquitetura da Solução

### Fluxo do Usuário

```text
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   [Primeiro Acesso]                                             │
│         │                                                       │
│         ▼                                                       │
│   ┌─────────────┐                                               │
│   │ Onboarding  │  "O VYR lê sinais do seu corpo               │
│   │  Wearable   │   através de um wearable"                    │
│   └──────┬──────┘                                               │
│          │                                                      │
│          ▼                                                      │
│   ┌─────────────┐                                               │
│   │  Seleção    │  Apple Watch | Garmin | Oura | etc.          │
│   │  Wearable   │                                               │
│   └──────┬──────┘                                               │
│          │                                                      │
│          ▼                                                      │
│   ┌─────────────┐                                               │
│   │   OAuth     │  Permissões de saúde (simulado)              │
│   │   Flow      │                                               │
│   └──────┬──────┘                                               │
│          │                                                      │
│          ▼                                                      │
│   ┌─────────────┐                                               │
│   │ Confirmação │  "Conexão estabelecida.                      │
│   │ Qualitativa │   Primeira leitura em algumas horas."        │
│   └──────┬──────┘                                               │
│          │                                                      │
│          ▼                                                      │
│   ┌─────────────┐                                               │
│   │    Home     │  Indicador sutil de conexão ativa            │
│   │  (normal)   │                                               │
│   └─────────────┘                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Componentes a Criar

### 1. Tela de Conexão de Wearable

**Arquivo:** `src/pages/WearableSetup.tsx`

```text
┌─────────────────────────────────────┐
│                                     │
│  Conecte seu wearable               │
│                                     │
│  O VYR lê sinais fisiológicos para  │
│  interpretar seu estado cognitivo.  │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  Apple Watch / Apple Health │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │  Garmin Connect             │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │  Oura Ring                  │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │  Samsung Health             │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │  Whoop                      │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │  Outros (Google Fit)        │    │
│  └─────────────────────────────┘    │
│                                     │
│  O VYR nunca mostra seus dados      │
│  brutos. Apenas interpreta          │
│  o significado para você.           │
│                                     │
└─────────────────────────────────────┘
```

### 2. Tela de Permissões (OAuth Simulado)

**Arquivo:** `src/pages/WearablePermissions.tsx`

```text
┌─────────────────────────────────────┐
│                                     │
│  [Logo do Wearable]                 │
│                                     │
│  Autorizar acesso                   │
│                                     │
│  O VYR solicita permissão para:     │
│                                     │
│  ✓ Dados de sono                    │
│  ✓ Frequência cardíaca              │
│  ✓ Atividade física                 │
│  ✓ Variabilidade cardíaca           │
│                                     │
│  Esses dados são processados        │
│  internamente e nunca exibidos.     │
│                                     │
│  [ Autorizar ]                      │
│                                     │
│  Ao autorizar, você concorda com    │
│  a política de privacidade.         │
│                                     │
└─────────────────────────────────────┘
```

### 3. Confirmação de Conexão

**Arquivo:** `src/components/vyr/WearableConnected.tsx`

```text
┌─────────────────────────────────────┐
│                                     │
│         ✓ Conexão estabelecida      │
│                                     │
│  O VYR agora recebe sinais do seu   │
│  Apple Watch automaticamente.       │
│                                     │
│  A primeira leitura estará          │
│  disponível após a próxima noite    │
│  de sono.                           │
│                                     │
│  [ Continuar para o VYR ]           │
│                                     │
└─────────────────────────────────────┘
```

### 4. Indicador de Status na Home

**Arquivo:** `src/components/vyr/ConnectionStatus.tsx`

Aparece sutilmente no topo ou como badge:

```text
Conectado: 🟢 Apple Watch
Última sincronização: há 2 horas
```

Ou quando desconectado/problema:

```text
Atenção: 🟡 Sincronização pendente
```

### 5. Tela de Configurações (nova aba ou seção no Labs)

**Arquivo:** `src/pages/Settings.tsx` ou seção em `Labs.tsx`

```text
┌─────────────────────────────────────┐
│  CONFIGURAÇÕES                      │
│                                     │
│  ── Wearable ──                     │
│                                     │
│  🟢 Apple Watch conectado           │
│  Última sincronização: há 2 horas   │
│                                     │
│  [ Reconectar ]  [ Desconectar ]    │
│                                     │
│  ── Dados ──                        │
│                                     │
│  7 dias de histórico disponível     │
│  Baseline em construção (3/7 dias)  │
│                                     │
│  ── Privacidade ──                  │
│                                     │
│  Seus dados fisiológicos são        │
│  processados localmente e nunca     │
│  exibidos diretamente.              │
│                                     │
└─────────────────────────────────────┘
```

---

## Novos Tipos

```typescript
// Em vyr-types.ts

interface WearableConnection {
  connected: boolean;
  provider: WearableProvider | null;
  lastSync: Date | null;
  syncStatus: "synced" | "pending" | "error";
  baselineDays: number; // 0-7
}

type WearableProvider = 
  | "apple_health"
  | "garmin"
  | "oura"
  | "samsung"
  | "whoop"
  | "google_fit"
  | "fitbit";

interface WearableProviderInfo {
  id: WearableProvider;
  name: string;
  icon: string;
  description: string;
}
```

---

## Estado Global (vyr-store.ts)

Adicionar ao store:

```typescript
// Novo estado
wearableConnection: WearableConnection;

// Novas ações
connectWearable: (provider: WearableProvider) => void;
disconnectWearable: () => void;
syncWearable: () => void;
```

---

## Fluxo de Telas no App.tsx

```typescript
type Screen = 
  | "home" 
  | "stateDetail" 
  | "momentAction" 
  | "checkpoint" 
  | "dayReview" 
  | "labs"
  | "wearableSetup"      // NOVO
  | "wearablePermissions" // NOVO
  | "settings";           // NOVO
```

---

## O Que NÃO Fazer

1. **NUNCA mostrar valores numéricos de biomarcadores** (HRV, BPM, etc.)
2. **NUNCA usar o SmartDataPanel atual** (viola os princípios)
3. **NUNCA exibir gráficos fisiológicos** ao usuário

O usuário vê apenas:
- Status qualitativo de conexão (🟢 Conectado / 🟡 Pendente / 🔴 Erro)
- Tempo desde última sincronização
- Progresso do baseline (dias)

---

## Arquivos a Criar/Modificar

| Arquivo | Ação | Descrição |
|---------|------|-----------|
| `src/lib/vyr-types.ts` | Modificar | Adicionar tipos WearableConnection, WearableProvider |
| `src/lib/vyr-store.ts` | Modificar | Adicionar estado e ações de conexão |
| `src/pages/WearableSetup.tsx` | Criar | Tela de seleção de wearable |
| `src/pages/WearablePermissions.tsx` | Criar | Tela de permissões (OAuth simulado) |
| `src/components/vyr/ConnectionStatus.tsx` | Criar | Indicador de status na Home |
| `src/components/vyr/WearableConnected.tsx` | Criar | Modal de confirmação de conexão |
| `src/pages/Settings.tsx` | Criar | Tela de configurações |
| `src/pages/Home.tsx` | Modificar | Adicionar ConnectionStatus |
| `src/App.tsx` | Modificar | Adicionar novas telas e fluxo |

---

## Resultado Esperado

Após implementação:

1. **Usuário novo** entra e vê tela de conexão de wearable
2. **Seleciona** seu dispositivo (Apple Watch, Garmin, etc.)
3. **Autoriza** permissões (simulado)
4. **Vê confirmação** qualitativa ("Conexão estabelecida")
5. **Na Home** aparece indicador sutil de conexão
6. **Nas Configurações** pode gerenciar a conexão
7. **NUNCA** vê HRV, BPM, ou qualquer dado bruto

O sistema transmite confiança de que está conectado e funcionando, sem expor a complexidade técnica.
