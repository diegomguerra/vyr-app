
# Correção definitiva: healthkit-sync.ts

## Diagnóstico confirmado

**Banco:** OK. 4 policies PERMISSIVE confirmadas no projeto `jjuuexzrfcnjngxbxine`. Nenhuma mudança necessária no banco.

**Problema:** 100% no código de `src/lib/healthkit-sync.ts`. Três funções usam `supabase.auth.getUser()`, que no iOS retorna o usuário do cache local mesmo quando o JWT expirou. Resultado: o request chega no Postgres sem `Authorization` válido, `auth.uid()` retorna `null`, RLS bloqueia com `42501`.

---

## O que será corrigido

### Função 1 — `connectAppleHealth()` (linha 32)

**Problema atual:**
```typescript
const { data: { user } } = await supabase.auth.getUser();
```

**Correção:** substituir por `getSession()` com refresh explícito — o mesmo padrão já usado corretamente em `syncHealthKitData()`:
```typescript
const { data: sessionData } = await supabase.auth.getSession();
let session = sessionData?.session;

if (!session?.access_token) {
  const { data: refreshData } = await supabase.auth.refreshSession();
  session = refreshData.session;
}

if (!session?.access_token || !session?.user?.id) {
  return { success: false, error: "Sessão expirada. Faça login novamente." };
}
const userId = session.user.id;
```

### Função 2 — `upsertIntegration()` (linhas 268–321)

**Problema atual:** SELECT → depois INSERT ou UPDATE separados. Race condition: se o SELECT retornar erro de RLS (sessão inválida), cai no branch INSERT e falha.

**Correção:** eliminar a função `upsertIntegration()` e substituir por upsert atômico direto, aproveitando o índice único `(user_id, provider)` que já existe na tabela:

```typescript
const { error: upsertErr } = await supabase
  .from("user_integrations")
  .upsert(
    {
      user_id: userId,
      provider: "apple_health" as const,
      status: "active",
      last_error: null,
      scopes: ["heart_rate", "hrv", "sleep", "steps", "spo2", "body_temperature", "workouts"],
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,provider" }
  );
```

### Função 3 — `disconnectAppleHealth()` (linha 48)

**Problema atual:** `getUser()` sem refresh.

**Correção:** mesma troca para `getSession()` + refresh.

### Função 4 — `getAppleHealthStatus()` (linha 244)

**Problema atual:** `getUser()` sem refresh — pode retornar dados do cache.

**Correção:** mesma troca para `getSession()` com refresh.

---

## Arquivo alterado

- `src/lib/healthkit-sync.ts` — único arquivo modificado

---

## Sequência de rebuild iOS após a correção

```text
git pull
npm install
npm run build
npx cap sync ios
node scripts/patch-ios.mjs
```

Abrir no Xcode: `ios/App/App.xcodeproj`
Clean Build Folder (⇧⌘K) → Run no iPhone
