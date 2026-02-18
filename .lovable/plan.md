

# Tratamento de erros e logs visuais no healthkit-sync.ts

## Problema
A funcao `upsertIntegration()` falha silenciosamente -- nao captura erros do Supabase e nao retorna resultado. Isso esconde o erro real que impede a conexao do Apple Health no iPhone.

## Mudancas planejadas

Arquivo unico: **src/lib/healthkit-sync.ts**

### 1. upsertIntegration() -- capturar erros
- Alterar retorno para `Promise<{ error?: string }>`
- Capturar erro do `select`, `update` e `insert` com logging
- Retornar `{ error: mensagem }` se qualquer operacao falhar

### 2. connectAppleHealth() -- verificar resultado
- Checar retorno do `upsertIntegration`
- Se houver erro, retornar `{ success: false, error }` imediatamente com toast visual mostrando o codigo do erro
- Nao prosseguir para `syncHealthKitData()` se a integracao falhou

### 3. Toasts com detalhes do erro
- Substituir mensagens genericas "Tente novamente mais tarde" por mensagens que incluam o codigo e texto real do erro
- Formato: `"[code] message"` na descricao do toast
- Permite debug visual no iPhone sem Xcode

## Secao tecnica

### upsertIntegration -- antes vs depois

Antes: funcao `async` sem retorno, sem try/catch, ignora erros silenciosamente.

Depois:
```text
async function upsertIntegration(...): Promise<{ error?: string }> {
  const { data: existing, error: selectErr } = await supabase...select...
  if (selectErr) return { error: `[select] ${selectErr.code}: ${selectErr.message}` };

  if (existing) {
    const { error: updateErr } = await supabase...update...
    if (updateErr) return { error: `[update] ${updateErr.code}: ${updateErr.message}` };
  } else {
    const { error: insertErr } = await supabase...insert...
    if (insertErr) return { error: `[insert] ${insertErr.code}: ${insertErr.message}` };
  }
  return {};
}
```

### connectAppleHealth -- adicionar verificacao

```text
const intResult = await upsertIntegration(user.id, "apple_health", "active");
if (intResult.error) {
  toast({ title: "Erro na integração", description: intResult.error, variant: "destructive" });
  return { success: false, error: intResult.error };
}
```

### Toasts em syncHealthKitData -- antes vs depois

Antes: `description: "Tente novamente mais tarde."`
Depois: `description: \`[\${error.code}] \${error.message}\``

