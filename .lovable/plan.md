

# VYR Full Supabase Backend Stack

## Resumo Executivo

O projeto VYR hoje roda inteiramente com **dados mock** no frontend. Todas as tabelas que existem no Supabase (`participantes`, `registros_dose`, `resumos_diarios`, `ring_daily_data`, `user_integrations`, etc.) estao criadas mas **nao sao consumidas pelo app**. O objetivo e migrar todo o stack para o Supabase, criando autenticacao real, persistencia de dados, e preparando para o lancamento nas lojas Apple e Google Play.

---

## O Que Ja Existe no Supabase

| Tabela | Status |
|--------|--------|
| `participantes` | Criada com RLS, nao usada pelo app |
| `registros_dose` | Criada com RLS, nao usada |
| `resumos_diarios` | Criada com RLS, nao usada |
| `referencias_populacionais` | Criada, dados seed inseridos |
| `ring_daily_data` | Criada, schema generico (metrics JSON) |
| `user_integrations` | Criada, para tokens OAuth dos wearables |
| `user_consents` | Criada, para LGPD/consentimento |
| `webhook_logs` | Criada, para logs de ingestao |

## O Que Falta

1. **Autenticacao real** (login/signup com Supabase Auth)
2. **Tabelas novas** para dados VYR-especificos (baselines, checkpoints, action_logs, daily_reviews, computed_states)
3. **RLS completo** em todas as tabelas novas
4. **Hooks de dados reais** substituindo o mock store
5. **Edge functions** para ingestao de dados do QRing via webhook
6. **Trigger de auto-criacao** de perfil no signup

---

## Plano de Implementacao

### Fase 1 -- Autenticacao e Perfil

- Criar tela de **Login/Signup** com email + senha (Supabase Auth)
- Criar **trigger** que auto-cria registro em `participantes` no signup
- Criar componente de **rota protegida** que redireciona para login se nao autenticado
- Integrar o `user_id` do Supabase Auth em todo o fluxo

### Fase 2 -- Novas Tabelas e Migracao

Criar via migration as tabelas que faltam:

**`user_baselines`** -- baseline pessoal calculado
```text
id, user_id, computed_at,
rhr_mean, rhr_std, hrv_mean, hrv_std,
sleep_duration_mean, sleep_duration_std,
sleep_quality_mean, sleep_quality_std,
stress_mean, stress_std,
spo2_mean, spo2_std,
temp_mean, temp_std,
days_used
```

**`checkpoints`** -- observacoes do usuario
```text
id, user_id, created_at, note
```

**`action_logs`** -- sachets tomados
```text
id, user_id, action (BOOT/HOLD/CLEAR), created_at
```

**`daily_reviews`** -- revisao diaria gerada pelo sistema
```text
id, user_id, date,
narrative_start, narrative_middle, narrative_end,
value_generated, closing_line, created_at
```

**`computed_states`** -- snapshot do estado VYR calculado
```text
id, user_id, date,
vyr_score, state_label,
energia, clareza, estabilidade,
dominant_pillar, limiting_pillar,
recommended_action, action_reason,
created_at
```

### Fase 3 -- RLS e Seguranca

- Todas as tabelas novas com RLS habilitado
- Politica padrao: usuario so ve/edita seus proprios dados (`auth.uid() = user_id`)
- `user_consents` validado antes de permitir uso do app (LGPD)
- Tabela `user_roles` separada para admin futuro (seguindo best practice)

### Fase 4 -- Hooks de Dados Reais

Substituir o `useVYRStore()` mock por hooks reais:

- **`useWearableData()`** -- busca `ring_daily_data` do usuario logado
- **`useBaseline()`** -- busca/computa baseline de `user_baselines`
- **`useComputedState()`** -- computa estado via engine + dados reais
- **`useActionLogs()`** -- CRUD em `action_logs`
- **`useCheckpoints()`** -- CRUD em `checkpoints`
- **`useDailyReviews()`** -- leitura de `daily_reviews`

Todos usando React Query para cache e sincronizacao.

### Fase 5 -- Edge Function de Ingestao

- **`ingest-wearable-data`** -- recebe webhook do QRing, valida assinatura, normaliza dados e insere em `ring_daily_data`
- Loga em `webhook_logs` para auditoria
- Atualiza `user_integrations.last_sync_at`

### Fase 6 -- Onboarding Completo

- Conectar as telas de onboarding existentes (`StepPerfil`, `StepObjetivo`, etc.) ao Supabase
- Salvar dados em `participantes` conforme o usuario avanca
- Marcar `onboarding_completo = true` ao finalizar

---

## Detalhes Tecnicos

### Arquitetura de Dados

```text
auth.users
    |
    +-- participantes (1:1, auto-criado via trigger)
    +-- ring_daily_data (1:N, um por dia por provider)
    +-- user_baselines (1:N, recalculado periodicamente)
    +-- computed_states (1:N, um por dia)
    +-- action_logs (1:N)
    +-- checkpoints (1:N)
    +-- daily_reviews (1:N, um por dia)
    +-- user_integrations (1:N, uma por provider)
    +-- user_consents (1:N)
```

### Fluxo de Dados

```text
QRing Webhook --> Edge Function (ingest) --> ring_daily_data
                                          --> webhook_logs

App abre --> useWearableData() --> ring_daily_data
         --> computeState() (client-side, engine puro)
         --> salva em computed_states (snapshot)
         --> UI renderiza estado real
```

### Seguranca para App Store

- RLS em 100% das tabelas
- JWT validation nas edge functions
- Consentimento LGPD obrigatorio antes de processar dados
- Tokens de wearable nunca expostos ao client (ficam no Supabase)

### Arquivos Principais Modificados

| Arquivo | Mudanca |
|---------|---------|
| `src/App.tsx` | Adicionar rota de auth, proteger rotas |
| `src/lib/vyr-store.ts` | Substituir mock por hooks Supabase |
| `src/pages/Login.tsx` | Implementar login real |
| `supabase/migrations/` | Nova migration com tabelas |
| `supabase/functions/ingest-wearable-data/` | Edge function |
| Novos: `src/hooks/use-auth.ts`, `use-wearable-data.ts`, etc. | Hooks de dados |

### Estimativa

- Fase 1 (Auth): 1 sessao
- Fase 2 (Tabelas): 1 sessao
- Fase 3 (RLS): junto com Fase 2
- Fase 4 (Hooks): 2 sessoes
- Fase 5 (Edge Function): 1 sessao
- Fase 6 (Onboarding): 1 sessao

Total: ~6 sessoes de trabalho

