

## Problema Identificado

O erro "new row violates row-level security policy for table ring_daily_data" aparece por causa de um problema em cascata:

1. O **upsert** usa `onConflict: "user_id,day"` (2 colunas)
2. Mas o unique constraint real no banco e `(user_id, day, source_provider)` (3 colunas)
3. O PostgreSQL rejeita o upsert com erro 42P10 ("no unique or exclusion constraint matching")
4. O codigo tenta um fallback com INSERT simples, que falha com erro de RLS (provavelmente porque o registro ja existe e gera conflito)

As politicas RLS estao corretas (PERMISSIVE). O problema e exclusivamente no parametro `onConflict`.

## Correcao

### Arquivo: `src/lib/healthkit-sync.ts`

Alterar a linha do `onConflict` de:
```typescript
{ onConflict: "user_id,day" }
```
Para:
```typescript
{ onConflict: "user_id,day,source_provider" }
```

Isso corresponde ao unique constraint existente e o upsert funcionara corretamente, tanto para inserir novos registros quanto para atualizar registros existentes do mesmo dia e provider.

## Detalhes Tecnicos

- O unique index atual e: `ring_daily_data_user_id_day_source_provider_key ON (user_id, day, source_provider)`
- O campo `source_provider` ja e incluido no payload com valor `"apple_health"`, entao a unica mudanca necessaria e no parametro `onConflict`
- Apos essa correcao, o fluxo completo de conexao com Apple Health deve funcionar sem erros

