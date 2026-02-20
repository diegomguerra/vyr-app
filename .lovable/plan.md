
## Problema

O arquivo `scripts/patch-ios.mjs` chegou ao disco com os backticks das template literals corrompidos (provavelmente foram escapados ou omitidos durante a criação manual anterior). Por isso o Node.js não consegue parsear o módulo.

A linha problemática é:
```
const green  = (t) => \x1b[32m${t}\x1b[0m;
```
Deveria ser:
```js
const green  = (t) => `\x1b[32m${t}\x1b[0m`;
```

## Solução

Sobrescrever o arquivo `scripts/patch-ios.mjs` com o conteúdo correto — garantindo que todos os backticks das template literals de cores ANSI estejam presentes.

## Arquivos que serão alterados

- `scripts/patch-ios.mjs` — reescrito com a sintaxe correta das template literals

## Impacto

Nenhuma mudança em banco de dados, autenticação ou componentes de UI. Apenas o script de automação do iOS será corrigido.

## Próximos passos após aprovação

1. O arquivo será reescrito com a sintaxe correta
2. Você roda `node scripts/patch-ios.mjs` no terminal
3. O resultado esperado é `✅ Patch concluído!` com as 3 camadas aplicadas
4. Abrir `ios/App/App.xcodeproj` no Xcode, selecionar o Team e fazer Archive
