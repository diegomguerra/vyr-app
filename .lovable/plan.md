
# Plano: Transformar em App VYR Labs (iOS/Android)

## Objetivo
Remover todas as páginas de marketing/landing e manter apenas a funcionalidade do app VYR Labs - login, onboarding, dashboard e perfil.

---

## Estrutura Final do App

```text
VYR Labs App
├── Login (tela inicial)
├── Welcome/Onboarding (primeiro acesso)
└── App Autenticado
    ├── Painel (Dashboard)
    ├── Anamnese (Onboarding editavel)
    └── Perfil
```

---

## O Que Sera Mantido

### Paginas Core
- `VYRLabs.tsx` → Sera a tela de Login (entrada do app)
- `Welcome.tsx` → Fluxo de primeiro acesso
- `Dashboard.tsx` → Painel principal
- `Onboarding.tsx` → Anamnese editavel
- `Profile.tsx` → Perfil do usuario

### Componentes Essenciais
- `src/components/mvp/` - Todos os componentes do painel
- `src/components/cognitive/` - Dashboard cognitivo
- `src/components/nzt/` - Navegacao e cards
- `src/components/onboarding/` - Steps do onboarding
- `src/components/ui/` - Biblioteca de UI (shadcn)

### Infraestrutura
- `src/lib/` - API, tipos, utilitarios
- `src/hooks/` - Hooks customizados
- `src/integrations/supabase/` - Conexao com banco

---

## O Que Sera Removido

### Paginas de Marketing (16 arquivos)
- Landing.tsx
- Products.tsx, ProductDetail.tsx
- RotinaCompleta.tsx, SistemaCompleto.tsx
- VYRSystem.tsx, VYRNutrition.tsx, VYRNode.tsx, VYRScience.tsx
- ComoFunciona.tsx
- BrandPreview.tsx, BrandExport.tsx
- Contact.tsx
- Login.tsx (redirecionamento antigo)
- NotFound.tsx

### Componentes de Marketing
- `src/components/landing/` - 17 arquivos (Hero, Nav, Footer, etc)
- `src/components/labs/` - Componentes da pagina Labs

### Assets de Marketing
- `src/brand/` - Especificacoes de marca
- `src/assets/` - Imagens de produtos e marketing

---

## Mudancas no App.tsx

### De (atual - 40+ rotas):
```typescript
<Route path="/" element={<Landing />} />
<Route path="/nutrition" element={<VYRNutrition />} />
<Route path="/produtos" element={<Products />} />
// ... muitas rotas de marketing
<Route path="/labs" element={<VYRLabs />} />
<Route path="/app/*" element={<AuthenticatedApp />} />
```

### Para (simplificado - 5 rotas):
```typescript
// Nao autenticado → Login
<Route path="/" element={user ? <Navigate to="/painel" /> : <Login />} />

// Autenticado → App
<Route path="/painel" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
<Route path="/anamnese" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
<Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

// Fallback
<Route path="*" element={<Navigate to="/" />} />
```

---

## Adaptacoes Mobile

### Layout
- Remover sidebar desktop (usar apenas bottom nav)
- Header mais compacto para apps
- Safe area insets para iOS (notch, home indicator)

### Navegacao
- Bottom navigation sempre visivel
- Transicoes mais fluidas entre telas
- Pull-to-refresh onde aplicavel

### Capacitor Ready
- Estrutura pronta para `npx cap add ios/android`
- Configuracao de `capacitor.config.ts`
- Assets de icones e splash screen

---

## Ordem de Execucao

1. **Limpar App.tsx**
   - Remover imports das paginas de marketing
   - Simplificar rotas
   - Ajustar fluxo de autenticacao

2. **Deletar Paginas Desnecessarias**
   - Remover 16 arquivos de paginas
   - Manter apenas: Dashboard, Onboarding, Profile, Welcome, VYRLabs (→ Login)

3. **Deletar Componentes de Marketing**
   - Remover pasta `src/components/landing/`
   - Remover pasta `src/components/labs/`
   - Remover pasta `src/brand/`

4. **Renomear VYRLabs para Login**
   - Simplificar a tela de login
   - Remover conteudo informativo (blocos de texto)
   - Manter apenas formulario de login/cadastro

5. **Ajustar Layout Mobile**
   - Otimizar Header para app
   - Garantir bottom nav funcional
   - Testar em diferentes tamanhos de tela

6. **Limpar Assets**
   - Remover imagens de marketing
   - Manter apenas icones e assets do app

---

## Resultado Esperado

Um app mobile-first com:
- Tela de login simples e direta
- Fluxo de onboarding completo
- Dashboard de gestao cognitiva
- Perfil editavel
- Pronto para deploy via Capacitor (iOS/Android)

---

## Proximos Passos Apos Aprovacao

1. Executar as alteracoes no codigo
2. Testar fluxo completo no preview
3. Configurar Capacitor (se ainda nao configurado)
4. Sincronizar com GitHub para o Bruno baixar no Xcode
