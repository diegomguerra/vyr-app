

# Corrigir RLS: RESTRICTIVE para PERMISSIVE em 10 tabelas

## Problema

As mesmas tabelas que causaram o erro 42501 em `ring_daily_data` tem policies RESTRICTIVE. Sem pelo menos uma policy PERMISSIVE, o PostgreSQL nega todo acesso mesmo com `user_id = auth.uid()` correto.

## Tabelas afetadas

| Tabela | Policy atual | Tipo |
|--------|-------------|------|
| action_logs | "Users manage own action_logs" (ALL, RESTRICTIVE) | user_id direto |
| checkpoints | "Users manage own checkpoints" (ALL, RESTRICTIVE) | user_id direto |
| computed_states | "Users manage own computed_states" (ALL, RESTRICTIVE) | user_id direto |
| daily_reviews | "Users manage own daily_reviews" (ALL, RESTRICTIVE) | user_id direto |
| notification_preferences | "Users manage own notification_preferences" (ALL, RESTRICTIVE) | user_id direto |
| notifications | "Users manage own notifications" (ALL, RESTRICTIVE) | user_id direto |
| push_subscriptions | "Users manage own push_subscriptions" (ALL, RESTRICTIVE) | user_id direto |
| user_baselines | "Users manage own baselines" (ALL, RESTRICTIVE) | user_id direto |
| user_consents | "Users manage own user_consents" (ALL, RESTRICTIVE) | user_id direto |
| participantes | "Users manage own participante" (ALL, RESTRICTIVE) | user_id direto |

## Plano

Uma unica migracao SQL que, para cada tabela:

1. Remove a policy RESTRICTIVE antiga
2. Cria 4 policies PERMISSIVE (SELECT, INSERT, UPDATE, DELETE) com `TO authenticated` e `user_id = auth.uid()`

Nenhuma alteracao de codigo e necessaria.

## Secao Tecnica

A migracao executara o seguinte padrao para cada tabela:

```text
DROP POLICY IF EXISTS "<nome_antigo>" ON public.<tabela>;

CREATE POLICY "<tabela>_select_own" ON public.<tabela>
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "<tabela>_insert_own" ON public.<tabela>
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "<tabela>_update_own" ON public.<tabela>
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "<tabela>_delete_own" ON public.<tabela>
  FOR DELETE TO authenticated USING (user_id = auth.uid());
```

Isso sera aplicado a todas as 10 tabelas de uma vez. As tabelas `registros_dose`, `resumos_diarios`, `referencias_populacionais`, `user_roles` e `webhook_logs` nao serao alteradas pois tem logica diferente (participante_id, service role, etc).

