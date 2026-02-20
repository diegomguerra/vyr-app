
# Auditoria Técnica: Autenticação e Persistência de Dados — VYR App

---

## 1. MAPA COMPLETO DE OPERAÇÕES DE ESCRITA

### Tabela de operações encontradas:

| Arquivo | Linha | Operação | Tabela | Side | user_id no payload? |
|---|---|---|---|---|---|
| `src/lib/healthkit-sync.ts` | 72-84 | `.upsert()` | `user_integrations` | Client (iOS) | Sim — `session.user.id` |
| `src/lib/healthkit-sync.ts` | 103-107 | `.update()` | `user_integrations` | Client (iOS) | Via `.eq()` |
| `src/lib/healthkit-sync.ts` | 188-190 | `.upsert()` | `ring_daily_data` | Client (iOS) | Sim — `session.user.id` |
| `src/lib/healthkit-sync.ts` | 203 | `.insert()` (fallback 42P10) | `ring_daily_data` | Client (iOS) | Sim |
| `src/lib/healthkit-sync.ts` | 220-224 | `.update()` | `user_integrations` | Client (iOS) | Via `.eq()` |
| `src/lib/vyr-store.ts` | 302-305 | `.insert()` | `checkpoints` | Client | Sim — `user.id` |
| `src/lib/vyr-store.ts` | 312-315 | `.insert()` | `action_logs` | Client | Sim — `user.id` |
| `src/lib/api.ts` | 51-63 | `.insert()` | `participantes` | Client | Sim — `user.id` |
| `src/lib/api.ts` | 69-74 | `.update()` | `participantes` | Client | Via `.eq(id)` |
| `src/lib/api.ts` | 79-96 | `.upsert()` | `registros_dose` | Client | Via `participante_id` |
| `src/lib/api.ts` | 101-118 | `.upsert()` | `resumos_diarios` | Client | Via `participante_id` |
| `src/pages/Profile.tsx` | 57-68 | `.update()` | `participantes` | Client | Via `.eq("user_id", user.id)` |
| `src/hooks/use-notifications.ts` | 47 | `.update()` | `notifications` | Client | Via `.eq("id", id)` |
| `src/hooks/use-notifications.ts` | 56-60 | `.update()` | `notifications` | Client | Via `.eq("user_id", user.id)` |
| `src/hooks/use-notifications.ts` | 106-109 | `.update()` | `notification_preferences` | Client | Via `.eq("user_id")` |
| `src/hooks/use-notifications.ts` | 111-113 | `.insert()` | `notification_preferences` | Client | Sim — `user.id` |
| `src/components/vyr/AvatarUpload.tsx` | 31 | `.upload()` | Storage `avatars` | Client | Via path `user.id/...` |

**Todas as operações são client-side (iOS ou browser).** Não há backend server-side intermediário — o app conecta diretamente no banco via SDK.

---

## 2. FLUXO DE AUTENTICAÇÃO — AUDITORIA

### 2.1 Onde o usuário faz login
- `src/pages/Login.tsx` — Email/senha via `supabase.auth.signInWithPassword()` e OAuth (Google/Apple) via `lovable.auth.signInWithOAuth()`

### 2.2 Onde a sessão é armazenada
- No SDK do Supabase com `persistSession: true` (configurado em `src/integrations/supabase/client.ts`)
- No iOS, o token é persistido no `localStorage` do WebView (WKWebView) — **este é um ponto crítico**

### 2.3 Onde o access_token é obtido
- `src/hooks/use-auth.tsx` — via `supabase.auth.getSession()` e `onAuthStateChange()`
- `src/lib/healthkit-sync.ts` — via helper `getValidSession()` que faz `getSession()` + fallback `refreshSession()`
- `src/lib/vyr-store.ts` — via `supabase.auth.getUser()` direto (linha 300, 309) — **ponto de risco**
- `src/lib/api.ts` — via `supabase.auth.getUser()` (linhas 28, 46) — **ponto de risco**

### 2.4 Onde o token é renovado
- Somente em `src/lib/healthkit-sync.ts` via `getValidSession()`:
  ```
  getSession() → se sem token → refreshSession()
  ```
- Em `vyr-store.ts` e `api.ts`: **sem refresh explícito** — usa apenas `getUser()` que pode retornar usuário do cache sem validar token

### 2.5 O token é validado antes do INSERT?
- Em `healthkit-sync.ts`: **Sim** — `getValidSession()` valida e renova antes de qualquer escrita
- Em `vyr-store.ts` (checkpoints/action_logs): **Não** — apenas verifica se `user` existe, sem verificar token
- Em `api.ts` (participantes): **Não** — usa `getUser()` que pode retornar dados cacheados

---

## 3. ANÁLISE DO ENVIO DO TOKEN

### Como o SDK envia o Authorization header
O `supabase-js` injeta automaticamente o `Bearer <access_token>` em toda requisição quando há sessão ativa. Isso está correto na configuração.

### Problema identificado: `getUser()` vs `getSession()`

No iOS com Capacitor (WKWebView):

```
getUser()   → lê user do CACHE LOCAL → pode retornar user mesmo com token expirado
getSession() → lê sessão do storage → retorna token atual (possivelmente nulo se expirado)
```

Quando o token expira no iOS:
1. `getUser()` ainda retorna um user (do cache)
2. O código acha que está autenticado e tenta o INSERT
3. O SDK não injeta o Bearer header com token válido (ou injeta token expirado)
4. O banco recebe a requisição com token inválido → `auth.uid()` retorna `null` → RLS bloqueia → **42501**

### Arquivos afetados por este padrão inseguro:

- `src/lib/vyr-store.ts`, linha 300: `supabase.auth.getUser()` antes de INSERT em `checkpoints`
- `src/lib/vyr-store.ts`, linha 309: `supabase.auth.getUser()` antes de INSERT em `action_logs`
- `src/lib/api.ts`, linha 28: `supabase.auth.getUser()` para obter `user_id` dos participantes
- `src/lib/api.ts`, linha 46: `supabase.auth.getUser()` antes de INSERT em `participantes`

---

## 4. AUDITORIA DAS RLS POLICIES

### Status verificado no banco real (projeto `jjuuexzrfcnjngxbxine`):

**Todas as tabelas têm RLS habilitado** (`rls_enabled: true`). Todas as políticas são `PERMISSIVE` (correto — não restrictive).

### Tabelas críticas para o erro 42501:

#### `ring_daily_data`
- INSERT policy: `WITH CHECK (user_id = auth.uid())` — PERMISSIVE ✓
- UPDATE policy: `USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid())` — PERMISSIVE ✓
- **Unique constraint confirmada**: `(user_id, day, source_provider)` — existe DOIS índices duplicados com o mesmo propósito (criados em migrações diferentes):
  - `ring_daily_data_user_id_day_source_key`
  - `ring_daily_data_user_id_day_source_provider_key`
  - Isso é inofensivo mas indica migrações redundantes

#### `user_integrations`
- INSERT policy: `WITH CHECK (auth.uid() = user_id)` — PERMISSIVE ✓
- UPDATE policy: `USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)` — PERMISSIVE ✓
- **Unique constraint confirmada**: `(user_id, provider)` — existe DOIS índices duplicados:
  - `user_integrations_user_id_provider_key`
  - `user_integrations_user_provider_key`
  - Mesma situação: inofensivo mas redundante

### Conclusão sobre as policies:
**As policies em si estão corretas e completas.** O problema NÃO é a configuração das policies — é o token que chega no banco.

---

## 5. DIAGNÓSTICO ESTRUTURADO

### 5.1 Causa raiz do erro 42501

```
iOS WKWebView → token expira em background
→ app retoma (foreground)
→ getUser() retorna user do cache (sem validar token)
→ código executa INSERT/UPSERT
→ SDK envia requisição com token expirado (ou sem token)
→ banco: auth.uid() = null
→ RLS WITH CHECK (user_id = auth.uid()) → false
→ PostgreSQL: 42501 insufficient_privilege
```

### 5.2 Tabela de riscos por operação:

| Operação | Arquivo | Risco de 42501 | Causa |
|---|---|---|---|
| INSERT `checkpoints` | `vyr-store.ts:302` | **Alto** | `getUser()` sem refresh |
| INSERT `action_logs` | `vyr-store.ts:312` | **Alto** | `getUser()` sem refresh |
| INSERT `participantes` | `api.ts:51` | **Alto** | `getUser()` sem refresh |
| UPDATE `participantes` | `api.ts:69` | **Médio** | sem validação de token |
| UPSERT `user_integrations` | `healthkit-sync.ts:72` | **Baixo** | tem `getValidSession()` |
| UPSERT `ring_daily_data` | `healthkit-sync.ts:188` | **Baixo** | tem `getValidSession()` |
| UPDATE `notifications` | `use-notifications.ts:47` | **Médio** | sem validação de token |
| INSERT `notification_preferences` | `use-notifications.ts:111` | **Alto** | `user.id` do hook, sem refresh |

### 5.3 Verificação: user_id payload vs auth.uid()

Nos INSERTs confirmados, o `user_id` do payload SEMPRE vem de `user.id` retornado pelo `getUser()` ou `useAuth()`. Portanto, quando o token é válido, a policy `user_id = auth.uid()` é satisfeita. O problema é exclusivamente **token ausente/expirado**, não divergência de UUID.

---

## 6. CORREÇÕES PROPOSTAS

### A) Correção do Fluxo de Sessão — Criar helper global seguro

O padrão `getValidSession()` que já existe em `healthkit-sync.ts` deve ser extraído para um helper compartilhado e usado em **todos** os pontos de escrita:

**Novo arquivo: `src/lib/auth-session.ts`**
```typescript
import { supabase } from "@/integrations/supabase/client";

export async function getValidSession() {
  const { data: sessionData } = await supabase.auth.getSession();
  let session = sessionData?.session;

  if (!session?.access_token) {
    const { data: refreshData } = await supabase.auth.refreshSession();
    session = refreshData.session;
  }

  return session;
}

export async function getValidUserId(): Promise<string | null> {
  const session = await getValidSession();
  return session?.user?.id ?? null;
}
```

### B) Correção em `vyr-store.ts` — addCheckpoint e logAction

**Antes (inseguro):**
```typescript
const { data: { user } } = await supabase.auth.getUser();
if (!user) return;
await supabase.from("checkpoints").insert({ user_id: user.id, ... });
```

**Depois (seguro):**
```typescript
const userId = await getValidUserId();
if (!userId) return;
await supabase.from("checkpoints").insert({ user_id: userId, ... });
```

### C) Correção em `api.ts` — getParticipante, createParticipante

**Antes:**
```typescript
const { data: { user } } = await supabase.auth.getUser();
```

**Depois:**
```typescript
const userId = await getValidUserId();
if (!userId) return null; // ou throw
```

### D) Correção em `use-notifications.ts` — insert de notification_preferences

Quando o `user` vem do hook `useAuth()` (via `getSession()` — seguro), mas o INSERT de `notification_preferences` usa esse `user.id` que pode ser stale em sessão longa. Adicionar verificação antes de qualquer escrita.

### E) Ajuste de policies (NÃO necessário)

As policies estão corretas e não precisam de alteração. A causa é 100% no lado do cliente — token não renovado antes das escritas.

---

## 7. RESUMO EXECUTIVO

| Pergunta | Resposta |
|---|---|
| O problema é a policy RLS? | Não — policies estão corretas e PERMISSIVE |
| O problema é o schema/estrutura? | Não — unique constraints existem corretamente |
| O problema é token expirado? | **Sim — causa primária** |
| O auth.uid() pode ser null? | **Sim — quando token expirado no iOS** |
| Há divergência de user_id? | Não — user_id do payload bate com auth.uid() quando o token é válido |
| A solução precisa de alteração no banco? | Não |
| A solução exige rebuild do app iOS? | Sim — a correção é no código TypeScript |

**Ação mínima e segura:**
1. Criar `src/lib/auth-session.ts` com `getValidSession()` e `getValidUserId()`
2. Substituir todos os `supabase.auth.getUser()` por `getValidUserId()` antes de qualquer INSERT/UPDATE
3. Retirar o `getValidSession()` duplicado de `healthkit-sync.ts` e importar do helper compartilhado
4. Rebuild + `cap sync` + archive para TestFlight

**Arquivos que precisam de alteração:**
- `src/lib/auth-session.ts` (novo — extrair helper)
- `src/lib/vyr-store.ts` (2 pontos: addCheckpoint, logAction)
- `src/lib/api.ts` (2 pontos: getParticipante, createParticipante)
- `src/lib/healthkit-sync.ts` (refatorar para usar helper compartilhado)
- `src/hooks/use-notifications.ts` (1 ponto: insert de notification_preferences)
