

## Script de automacao iOS completo (Info.plist + Entitlements + Capability)

### Problema
Cada `npx cap sync ios` ou `npx cap add ios` regenera o projeto nativo e apaga:
- Chaves de privacidade do `Info.plist`
- Arquivo `App.entitlements` com HealthKit
- Referencia ao entitlements e capability HealthKit no `.pbxproj`

### Solucao

Criar `scripts/patch-ios.mjs` que restaura **todas as tres camadas** automaticamente.

### O que o script fara

**Camada 1 — Info.plist**
- Verifica se `NSHealthShareUsageDescription` e `NSHealthUpdateUsageDescription` existem
- Se nao existirem, injeta antes do `</dict>` final
- Textos em portugues descrevendo o uso dos dados

**Camada 2 — App.entitlements**
- Cria (ou sobrescreve) `ios/App/App/App.entitlements` com:
  - `com.apple.developer.healthkit` = true
  - `com.apple.developer.healthkit.access` = ["health-records"] (necessario para leitura)

**Camada 3 — .pbxproj**
- Localiza o arquivo `ios/App/App.xcodeproj/project.pbxproj`
- Injeta `CODE_SIGN_ENTITLEMENTS = App/App.entitlements` nos buildSettings do target App (Debug e Release)
- Adiciona o `App.entitlements` como PBXFileReference e ao PBXGroup do target se ainda nao estiver la
- Registra o SystemCapability HealthKit no `TargetAttributes`

### Arquivos

**Novo: `scripts/patch-ios.mjs`**
- Node.js puro (sem dependencias externas)
- Usa `fs` para ler/escrever os tres arquivos
- Usa regex para localizar e injetar trechos no `.pbxproj`
- Log colorido no terminal mostrando o que foi adicionado ou ja existia

**Modificado: `package.json`**
- Adicionar scripts:
  - `"patch:ios": "node scripts/patch-ios.mjs"`
  - `"sync:ios": "npx cap sync ios && node scripts/patch-ios.mjs"`

### Uso

```text
# Apos qualquer sync ou recreacao do iOS:
npm run sync:ios

# Ou separadamente:
npx cap add ios
npm run patch:ios
```

Depois so precisa abrir o Xcode para configurar o **Team** (signing) e dar Run. Todo o resto (Info.plist, entitlements, capability) estara restaurado automaticamente.

### Detalhes tecnicos

O `.pbxproj` e um formato baseado em plist da Apple com UUIDs. O script:
- Busca o bloco `buildSettings` do target "App" via regex
- Injeta `CODE_SIGN_ENTITLEMENTS` se ausente
- Busca a secao `TargetAttributes` e adiciona `SystemCapabilities` com HealthKit
- Adiciona o `App.entitlements` como `PBXFileReference` (tipo `text.plist.entitlements`) se nao existir
- Todas as modificacoes sao idempotentes (rodar varias vezes nao duplica nada)

### Nota sobre Team/Bundle ID

O script **nao** configura Team nem Bundle ID — esses sao vinculados a conta Apple pessoal do Bruno e devem ser configurados manualmente no Xcode (apenas uma vez apos cada `cap add`). Tudo mais sera automatico.

