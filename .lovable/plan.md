

# Corrigir client.ts apontando para projeto Supabase errado

## Problema
O arquivo `src/integrations/supabase/client.ts` foi manualmente editado para apontar para `uirbicdwikvgnuounlia.supabase.co` (um projeto externo). As tabelas do app existem no Lovable Cloud (`jjuuexzrfcnjngxbxine.supabase.co`), causando 404 em todas as queries.

## Solucao
Reverter `src/integrations/supabase/client.ts` para usar o client auto-gerado pelo Lovable Cloud. Este arquivo e gerenciado automaticamente e nao deve ser editado manualmente.

O arquivo correto importa de `@/integrations/supabase/client` e aponta para:
- URL: `https://jjuuexzrfcnjngxbxine.supabase.co`  
- Anon Key: a chave do `.env` (`VITE_SUPABASE_PUBLISHABLE_KEY`)

## Detalhes tecnicos

1. **Restaurar `src/integrations/supabase/client.ts`** para o formato padrao do Lovable Cloud, removendo as credenciais hardcoded do projeto externo.

2. **Verificar `src/lib/supabase.ts`** — se houver outro client duplicado, remover ou redirecionar para o client oficial.

3. **Impacto**: Todos os 404s serao resolvidos imediatamente (action_logs, checkpoints, daily_reviews, computed_states, notifications).

4. **Sync para vyr-project**: O workflow de GitHub Actions ira propagar a correcao automaticamente para o repositorio nativo.

