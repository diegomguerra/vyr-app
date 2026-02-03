
## Correção do Workflow de Sincronização

### Problema
O workflow atual copia o `package.json` inteiro deste projeto para o VYR Project, sobrescrevendo as dependências nativas do Capacitor necessárias para o build iOS.

### Solução
Fazer um **merge inteligente** do `package.json` usando `jq`, preservando as dependências do Capacitor no VYR Project enquanto atualiza as dependências do frontend.

---

## Implementação

### Arquivo: `.github/workflows/sync-to-vyr-project.yml`

**Mudança:** Substituir a cópia direta do `package.json` por um merge com `jq`

```yaml
# ANTES (linha 39):
cp -f ./package.json target/package.json

# DEPOIS:
# Merge package.json preservando deps nativas do target
jq -s '
  .[0] as $source | .[1] as $target |
  $target * {
    dependencies: ($target.dependencies + $source.dependencies),
    devDependencies: ($target.devDependencies + $source.devDependencies),
    scripts: ($target.scripts + $source.scripts)
  }
' ./package.json target/package.json > target/package.json.tmp
mv target/package.json.tmp target/package.json
```

---

## Como Funciona

```text
+-------------------+     +-------------------+     +-------------------+
|    VYR App        |     |     Merge         |     |   VYR Project     |
|   package.json    | --> |   com jq          | --> |   package.json    |
+-------------------+     +-------------------+     +-------------------+
| react, tailwind   |     | Mantém @capacitor |     | react + capacitor |
| radix, recharts   |     | Adiciona frontend |     | todas dependências|
+-------------------+     +-------------------+     +-------------------+
```

---

## Detalhes Técnicos

O merge com `jq`:
- Mantém o `package.json` do target como base
- Adiciona/atualiza `dependencies` do source
- Adiciona/atualiza `devDependencies` do source  
- Mantém `@capacitor/*` e outras deps nativas que existem apenas no target
- Preserva campos específicos do target (name, version se diferentes)
