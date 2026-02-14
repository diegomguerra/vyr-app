

# Plano: Notificacoes e Gestao de Usuario Completa

## Resumo

Este plano cobre duas grandes areas: sistema de notificacoes (push + in-app) e gestao completa de usuario (login social, recuperacao de senha, perfil editavel, foto). Varias funcionalidades ja existem (cadastro, login email/senha, logout) e serao mantidas.

---

## Parte 1 -- Notificacoes

### 1.1 Tabela de notificacoes in-app

Criar tabela `notifications` no banco para armazenar notificacoes internas do usuario:

```text
notifications
- id (uuid, PK)
- user_id (uuid, NOT NULL)
- title (text)
- body (text)
- type (text) -- ex: 'insight', 'reminder', 'system'
- read (boolean, default false)
- created_at (timestamptz)
```

RLS: usuarios so acessam as proprias notificacoes.

### 1.2 Tabela de preferencias de notificacao

Criar tabela `notification_preferences`:

```text
notification_preferences
- id (uuid, PK)
- user_id (uuid, UNIQUE)
- push_enabled (boolean, default true)
- insights_enabled (boolean, default true)
- reminders_enabled (boolean, default true)
- created_at / updated_at
```

### 1.3 UI -- Centro de notificacoes

- Adicionar icone de sino (Bell) no header da Home com badge de contagem de nao lidas.
- Nova tela "Notificacoes" acessivel pelo icone, listando notificacoes com swipe/tap para marcar como lida.
- Notificacoes agrupadas por data.

### 1.4 UI -- Preferencias de notificacao

- Adicionar secao "Notificacoes" na pagina de Settings com toggles (switches) para:
  - Push notifications (ativar/desativar)
  - Insights cognitivos
  - Lembretes de sachets

### 1.5 Push Notifications

- Registrar Service Worker para receber push via Web Push API.
- Armazenar push subscription token no banco (nova coluna ou tabela `push_subscriptions`).
- Edge function para enviar push via Web Push quando notificacoes forem criadas.
- Nota: Push nativo (iOS/Android) requer o setup Capacitor que ja esta parcialmente configurado. Para web, usaremos a Web Push API padrao.

---

## Parte 2 -- Gestao de Usuario

### 2.1 Login Social (Google e Apple)

- Configurar Google e Apple OAuth usando o Lovable Cloud (solucao gerenciada, sem necessidade de credenciais externas).
- Adicionar botoes "Continuar com Google" e "Continuar com Apple" na tela de login/cadastro abaixo do formulario atual.
- Usar `lovable.auth.signInWithOAuth()` para ambos os provedores.

### 2.2 Recuperacao de Senha

- Adicionar link "Esqueci minha senha" na tela de login.
- Nova tela/modal com campo de email que dispara `supabase.auth.resetPasswordForEmail()`.
- Tela de confirmacao informando que o email foi enviado.

### 2.3 Perfil do Usuario

- Nova tela "Perfil" acessivel via Settings.
- Campos editaveis baseados na tabela `participantes` ja existente:
  - Nome publico
  - Data de nascimento
  - Sexo
  - Altura / Peso
  - Objetivo principal
- Upload de foto de perfil:
  - Criar bucket `avatars` no Storage.
  - Componente de avatar com camera/galeria para upload.
  - Salvar URL da foto no perfil.

### 2.4 Autenticacao em Dois Fatores (2FA)

- Nao sera implementado neste momento pois o Lovable Cloud nao suporta TOTP/MFA configuravel via API. Sera documentado como melhoria futura.

---

## Sequencia de Implementacao

1. **Migracao DB**: Criar tabelas `notifications`, `notification_preferences`, `push_subscriptions` e bucket `avatars`.
2. **Login Social**: Configurar OAuth Google/Apple + botoes na LoginLayout.
3. **Recuperacao de Senha**: Link + tela de reset na LoginLayout/Login.
4. **Tela de Perfil**: Nova pagina com formulario de edicao + upload de avatar.
5. **Notificacoes In-App**: Hook `useNotifications` + tela de listagem + icone com badge na Home.
6. **Preferencias de Notificacao**: Secao nova em Settings com toggles.
7. **Push Notifications**: Service worker + edge function de envio.

---

## Detalhes Tecnicos

### Arquivos novos
- `src/pages/Profile.tsx` -- tela de edicao de perfil
- `src/pages/Notifications.tsx` -- central de notificacoes
- `src/pages/ForgotPassword.tsx` -- recuperacao de senha
- `src/hooks/use-notifications.ts` -- hook para buscar/gerenciar notificacoes
- `src/components/vyr/NotificationBell.tsx` -- icone com badge
- `src/components/vyr/AvatarUpload.tsx` -- componente de upload de foto
- `supabase/functions/send-push/index.ts` -- edge function para Web Push

### Arquivos modificados
- `src/App.tsx` -- novas telas no router + screen type
- `src/pages/Login.tsx` -- botoes OAuth + link esqueci senha
- `src/components/LoginLayout.tsx` -- novos props para OAuth e reset
- `src/pages/Settings.tsx` -- secoes de perfil + notificacoes + preferencias

### Migracoes SQL
- Tabelas: `notifications`, `notification_preferences`, `push_subscriptions`
- Storage bucket: `avatars`
- Politicas RLS para todas as novas tabelas

