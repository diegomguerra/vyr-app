
# Corrigir Conexão com Apple Health

## Problema
O plugin nativo `@perfood/capacitor-healthkit` nao esta instalado no projeto. Sem ele, a funcao `isHealthKitAvailable()` sempre retorna `false`, exibindo o toast "HealthKit disponivel apenas no dispositivo iOS" mesmo no simulador.

Alem disso, ha um bug: quando o HealthKit nao esta disponivel, o codigo chama `onConnectAppleHealth()` mesmo assim, o que pode marcar a conexao como ativa incorretamente.

## Plano de Correcao

### 1. Instalar o plugin @perfood/capacitor-healthkit
Adicionar a dependencia ao `package.json`. Isso permite que o Capacitor registre o plugin nativo no iOS.

### 2. Corrigir o bug na logica de conexao (Integrations.tsx)
Remover a chamada `onConnectAppleHealth()` do bloco `if (!available)`. Quando o HealthKit nao esta disponivel, o botao deve apenas mostrar o aviso, sem alterar o estado de conexao.

Codigo atual (com bug):
```typescript
if (!available) {
  onConnectAppleHealth();  // BUG: marca como conectado sem estar
  toast.info("HealthKit disponível apenas no dispositivo iOS.");
  return;
}
```

Codigo corrigido:
```typescript
if (!available) {
  toast.info("HealthKit disponível apenas no dispositivo iOS.");
  return;
}
```

### 3. Apos aprovar o plano
Depois que eu fizer as alteracoes no Lovable, o Bruno precisara:
1. Fazer `git pull` no repositorio
2. Rodar `npm install` (para instalar o plugin novo)
3. Rodar `npx cap sync ios` (para sincronizar o plugin nativo)
4. No Xcode, adicionar a capability "HealthKit" no target do app (se ainda nao estiver):
   - Xcode > Target > Signing and Capabilities > + Capability > HealthKit
5. Buildar novamente (`Cmd+R` para teste local ou Archive para TestFlight)

## Detalhes Tecnicos

**Dependencia a instalar:**
- `@perfood/capacitor-healthkit` (compativel com Capacitor 8)

**Arquivos modificados:**
- `package.json` - adicionar dependencia
- `src/pages/Integrations.tsx` - remover `onConnectAppleHealth()` do bloco de fallback

**Resultado esperado:**
- No Lovable/web: toast continua aparecendo (correto, pois nao ha HealthKit)
- No simulador iOS: o prompt de permissao do Apple Health deve aparecer ao clicar "Conectar"
- No iPhone fisico: conexao real com Apple Health funciona
