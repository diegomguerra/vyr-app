

## Problema

O plugin `@perfood/capacitor-healthkit` (v1.3.2) suporta apenas Capacitor 4, mas o projeto usa Capacitor 8. Isso causa o erro `ERESOLVE` no `npm install` do projeto nativo (vyr-project).

No Lovable (vyr-app), o build funciona porque roda apenas web e o plugin nunca e de fato chamado. Mas no projeto nativo, a incompatibilidade impede a instalacao.

## Solucao

Migrar de `@perfood/capacitor-healthkit` para `@capgo/capacitor-health`, que suporta Capacitor 8 nativamente e oferece a mesma funcionalidade (leitura de HealthKit).

## Alteracoes

### 1. Trocar dependencia no package.json

- Remover: `@perfood/capacitor-healthkit`
- Adicionar: `@capgo/capacitor-health`

### 2. Reescrever `src/lib/healthkit.ts`

Adaptar as chamadas para a API do `@capgo/capacitor-health`:

- `isHealthKitAvailable()` -- usar `Health.isAvailable()`
- `requestHealthKitPermissions()` -- usar `Health.requestAuthorization()` com os tipos correspondentes
- `readHealthKitData()` -- usar `Health.query()` para cada tipo de dado (heart_rate, heart_rate.variability, sleep, steps, oxygen_saturation, body_temperature)
- Manter a mesma interface `WearableData` de saida para que nenhum outro arquivo precise mudar

### 3. Atualizar `src/lib/healthkit-sync.ts`

Revisar os imports para apontar ao novo modulo. A logica de sincronizacao e persistencia em `ring_daily_data` permanece igual.

### 4. Atualizar `src/pages/Integrations.tsx`

Nenhuma mudanca necessaria -- ja usa apenas funcoes exportadas de `healthkit-sync.ts`.

### 5. Workflow de sync (`.github/workflows/sync-to-vyr-project.yml`)

Nenhuma mudanca necessaria -- o `package.json` ja e mergeado com jq e as dependencias do Capacitor sao injetadas automaticamente.

---

### Secao tecnica

**API do @capgo/capacitor-health (resumo):**

```typescript
import { Health } from '@capgo/capacitor-health';

// Verificar disponibilidade
await Health.isAvailable();

// Solicitar permissoes
await Health.requestAuthorization({
  read: ['steps', 'heart_rate', 'heart_rate.variability', 'sleep', 'oxygen_saturation', 'body_temperature'],
  write: []
});

// Consultar dados
const result = await Health.query({
  startDate: new Date('2026-02-15').toISOString(),
  endDate: new Date('2026-02-16').toISOString(),
  dataType: 'heart_rate',
  limit: 1000
});
```

**Mapeamento de tipos:**

| Antes (@perfood)             | Depois (@capgo)              |
|------------------------------|------------------------------|
| heartRate                    | heart_rate                   |
| heartRateVariabilitySDNN     | heart_rate.variability       |
| restingHeartRate             | heart_rate (filtrado)        |
| sleepAnalysis                | sleep                        |
| stepCount                    | steps                        |
| oxygenSaturation             | oxygen_saturation            |
| bodyTemperature              | body_temperature             |

**Impacto:**
- Apenas 2 arquivos modificados: `healthkit.ts` e possivelmente `healthkit-sync.ts`
- Zero mudancas na UI ou na logica de negocio
- Resolve o conflito de peer dependency permanentemente

**Apos aprovar**, no terminal local:
```bash
git pull
npm install
npm run build && npx cap sync ios
```
