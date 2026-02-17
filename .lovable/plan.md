

# Blindar RLS em `ring_daily_data`

## Situacao Atual

- **RLS policy**: Existe com `USING (user_id = auth.uid())` e `WITH CHECK (user_id = auth.uid())`, porem aplica a **todos os roles** (incluindo `anon`). Isso significa que um request anonimo com `user_id` nulo simplesmente nao retorna dados, mas idealmente a policy deveria ser restrita ao role `authenticated`.
- **Frontend (healthkit-sync.ts)**: Ja possui a logica de `getSession()` seguida de `refreshSession()` antes do upsert. **Nenhuma alteracao necessaria no codigo.**

## Plano

### Passo 1 — Recriar a policy com `TO authenticated`

Executar via migration SQL:

```text
DROP POLICY IF EXISTS "Users manage own ring_daily_data" ON public.ring_daily_data;

CREATE POLICY "Users manage own ring_daily_data"
  ON public.ring_daily_data
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
```

Isso garante que:
- Somente usuarios autenticados podem acessar a tabela
- Cada usuario so ve/edita seus proprios registros
- Requests anonimos sao bloqueados por completo

### Passo 2 — Nenhum (frontend ja esta correto)

O arquivo `src/lib/healthkit-sync.ts` ja implementa:
1. `supabase.auth.getSession()` para obter sessao ativa
2. Fallback para `supabase.auth.refreshSession()` se sessao estiver expirada
3. Rejeicao explicita se nenhuma sessao valida existir

Nenhuma alteracao de codigo e necessaria.

## Secao Tecnica

A diferenca entre a policy atual (sem `TO`) e a nova (com `TO authenticated`):
- Sem `TO`: aplica a todos os roles, incluindo `anon`. Um request anonimo passa pela policy mas `auth.uid()` retorna `NULL`, entao a condicao falha silenciosamente.
- Com `TO authenticated`: requests anonimos nem chegam a avaliar a policy — sao rejeitados pelo Postgres antes. Isso e mais seguro e explicito.

