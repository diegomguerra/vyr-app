
## Correção definitiva: criar as UNIQUE constraints ausentes

### Diagnóstico confirmado

O banco de dados tem as RLS policies corretas (PERMISSIVE), mas **não possui as UNIQUE constraints** que o código `upsert({ onConflict: "user_id,provider" })` precisa para funcionar. Sem essas constraints, o Postgres não consegue resolver o conflito e retorna erro.

Isso explica por que o 42501 persiste mesmo com o código correto: o upsert atômico depende de constraints UNIQUE que simplesmente não existem nas tabelas.

---

### O que será feito

#### Migration 1 — UNIQUE constraint em `user_integrations`

```sql
ALTER TABLE public.user_integrations
  ADD CONSTRAINT user_integrations_user_id_provider_key
  UNIQUE (user_id, provider);
```

#### Migration 2 — UNIQUE constraint em `ring_daily_data`

```sql
ALTER TABLE public.ring_daily_data
  ADD CONSTRAINT ring_daily_data_user_id_day_source_key
  UNIQUE (user_id, day, source_provider);
```

Essas duas constraints são as únicas mudanças necessárias. O código `healthkit-sync.ts` já está correto e não precisa de mais alterações.

---

### Por que isso resolve o 42501

O fluxo após as constraints:

```text
connectAppleHealth()
  → getValidSession()          [JWT válido, user_id confirmado]
  → upsert user_integrations   [onConflict: "user_id,provider" → constraint encontrada → INSERT ou UPDATE atômico]
  → syncHealthKitData()
  → upsert ring_daily_data     [onConflict: "user_id,day,source_provider" → constraint encontrada → INSERT ou UPDATE atômico]
  → update last_sync_at        [UPDATE simples com eq filters]
```

Sem as constraints, o Postgres rejeita o upsert ou cai em erro de permissão ao tentar resolver o conflito internamente.

---

### Arquivo alterado

- Nenhum arquivo de código será alterado
- Apenas duas migrations de banco de dados serão executadas

---

### Sequência de rebuild iOS após a migration

Após aplicar as migrations:

```text
git pull
npm run build
npx cap sync ios
node scripts/patch-ios.mjs
```

No Xcode:
1. Abrir `ios/App/App.xcodeproj`
2. Clean Build Folder (⇧⌘K)
3. Run no iPhone

### Verificação pós-rebuild

No banco, após clicar em "Conectar Apple Health" no iPhone:

```sql
SELECT * FROM user_integrations WHERE provider = 'apple_health';
-- Deve retornar 1 linha com status = 'active'

SELECT * FROM ring_daily_data WHERE source_provider = 'apple_health';
-- Deve retornar 1 linha com as métricas do dia
```

---

### Nota sobre as sugestões recebidas

As sugestões de `pod install`, `rm -rf ios/Pods`, e reinstalar React Native CLI **não se aplicam** a este projeto. O VYR usa Capacitor 8 com Swift Package Manager (SPM), sem CocoaPods e sem React Native. Executar esses comandos não vai resolver nada e pode corromper a estrutura do projeto iOS.
