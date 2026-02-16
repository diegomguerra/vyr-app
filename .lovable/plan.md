
# Simplificar Integrações: Apple Health + J-Style

## Objetivo
Reduzir a lista de provedores para apenas os dois que funcionam hoje, e adicionar uma nota informativa sobre compatibilidade futura via Apple Health.

## Mudanças

### 1. `src/pages/Integrations.tsx`
- **Remover** a lista `OTHER_PROVIDERS` com 16 provedores
- **Manter** apenas o card Apple Health (já existente, sem alterações)
- **Adicionar** um card J-Style Ring logo abaixo do Apple Health, com o mesmo padrão visual (ícone, status conectado/desconectado, botão de conectar)
- **Substituir** a seção "Outros dispositivos" por uma nota informativa:
  - Titulo: "Outros wearables"
  - Texto: "Garmin, Whoop, Oura, Fitbit e demais dispositivos compatíveis serão integrados automaticamente via Apple Health."
  - Estilo: card sutil com ícone informativo, texto em `text-vyr-text-muted`

### 2. `src/components/vyr/ConnectionStatus.tsx`
- Sem alterações necessarias -- o menu dropdown ja mostra apenas Apple Health

## Resultado Visual

```text
┌─────────────────────────────┐
│  Apple Health               │
│  Conectado / Não conectado  │
│  [Conectar / Gerenciar]     │
└─────────────────────────────┘

┌─────────────────────────────┐
│  J-Style Ring               │
│  Conectado / Não conectado  │
│  [Conectar]                 │
└─────────────────────────────┘

┌─────────────────────────────┐
│ ℹ Outros wearables          │
│ Garmin, Whoop, Oura, Fitbit │
│ e demais serao integrados   │
│ via Apple Health.            │
└─────────────────────────────┘
```

## Detalhes Tecnicos

- O card J-Style usara o mesmo padrao visual do Apple Health card, com icone `Activity` e cor neutra
- O J-Style tera estados conectado/desconectado identicos ao Apple Health (status pill, ultima sync, botao desconectar)
- A nota informativa sera um `div` estatico com icone `Info` do lucide-react, sem interacao
- Nenhuma alteracao nos tipos (`vyr-types.ts`) -- `jstyle` ja existe como `WearableProvider`
