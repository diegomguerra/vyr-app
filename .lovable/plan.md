
# Corrigir importacao do plugin HealthKit

## Problema
O arquivo `src/lib/healthkit.ts` registra o plugin manualmente com `registerPlugin("CapacitorHealthkit")`. Porem, a biblioteca `@perfood/capacitor-healthkit` ja exporta o plugin pronto. O registro manual cria uma instancia "vazia" que nao encontra o codigo nativo, fazendo `isHealthKitAvailable()` sempre retornar `false` -- mesmo no simulador iOS.

## O que vai mudar

### Arquivo: `src/lib/healthkit.ts`

**Antes (codigo atual):**
```typescript
import { Capacitor, registerPlugin } from "@capacitor/core";

interface HealthKitPlugin { ... } // interface manual

let CapacitorHealthkit: HealthKitPlugin | null = null;
try {
  if (Capacitor.isNativePlatform()) {
    CapacitorHealthkit = registerPlugin<HealthKitPlugin>("CapacitorHealthkit");
  }
} catch { }
```

**Depois (corrigido):**
```typescript
import { Capacitor } from "@capacitor/core";
import {
  CapacitorHealthkit,
  type OtherData,
  type SampleNames,
} from "@perfood/capacitor-healthkit";
```

- Remove a interface `HealthKitPlugin` definida manualmente
- Remove o bloco `try/catch` com `registerPlugin`
- Importa diretamente o plugin exportado pela biblioteca
- Nas funcoes que checam `if (!CapacitorHealthkit)`, troca para `if (!Capacitor.isNativePlatform())` -- isso garante que no web continua mostrando o toast, e no iOS o plugin nativo e chamado corretamente

## Resultado esperado
- **No Lovable/web**: toast "HealthKit disponivel apenas no dispositivo iOS" continua aparecendo (correto)
- **No simulador iOS**: o prompt de permissao do Apple Health aparece ao clicar "Conectar"
- **No iPhone fisico**: conexao real funciona

## Apos aprovar
No terminal local:
1. `git pull`
2. `npm install`
3. `npx cap sync ios`
4. No Xcode: `Shift+Cmd+K` (Clean) depois `Cmd+R` (Run)
