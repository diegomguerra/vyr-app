
# Corrigir toast de HealthKit no preview web

## Problema
No preview web (Lovable), ao clicar "Conectar Apple Health", o codigo chama `isHealthKitAvailable()` que retorna `false` (correto, nao e iOS), e entao mostra o toast "HealthKit disponivel apenas no dispositivo iOS". Esse toast nao deveria aparecer no web -- e irrelevante para quem esta testando o layout.

## Solucao

### Arquivo: `src/pages/Integrations.tsx`

Alterar a funcao `handleConnect` para verificar primeiro se estamos no ambiente nativo antes de tentar conectar:

```typescript
const handleConnect = async () => {
  // No web, nao mostrar toast de erro -- apenas informar
  if (!Capacitor.isNativePlatform()) {
    toast.info("Abra o app no seu iPhone para conectar o Apple Health.");
    return;
  }
  
  setLoading(true);
  try {
    const result = await connectAppleHealth();
    if (result.success) {
      onConnectAppleHealth();
      toast.success("Apple Health conectado com sucesso!");
    } else {
      toast.error(result.error ?? "Erro ao conectar Apple Health.");
    }
  } catch {
    toast.error("Erro inesperado ao conectar.");
  } finally {
    setLoading(false);
  }
};
```

Mudancas:
1. Importar `Capacitor` de `@capacitor/core` no topo do arquivo
2. Verificar `Capacitor.isNativePlatform()` diretamente no handler, **antes** de chamar `isHealthKitAvailable()`
3. No web: mostrar toast informativo "Abra o app no seu iPhone para conectar o Apple Health" (mensagem mais clara)
4. No nativo (simulador/device): pular o check de `isHealthKitAvailable()` redundante e ir direto para `connectAppleHealth()`, que internamente ja faz a verificacao

### Arquivo: `src/lib/healthkit.ts`
Nenhuma mudanca -- o codigo ja esta correto com a importacao direta do plugin.

## Resultado
- **No Lovable/web**: toast informativo dizendo para abrir no iPhone (nao parece erro)
- **No simulador iOS**: vai direto para `connectAppleHealth()` sem o toast de bloqueio
- **No iPhone fisico**: funciona normalmente
