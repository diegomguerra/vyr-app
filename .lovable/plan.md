

# Plano: Deixar "Wearable não conectado" em vermelho

## Objetivo
Alterar a cor do status "Wearable não conectado" de cinza dessaturado para vermelho, acionando o pipeline de deploy no GitHub Actions.

## Alteração

**Arquivo:** `src/components/vyr/ConnectionStatus.tsx`

**Mudança:** Substituir as classes de cor do estado desconectado de `text-vyr-status-negative` para `text-red-500` (vermelho direto do Tailwind).

```diff
  // Linhas 50-58: Estado não conectado
  <button
    onClick={onTap}
-   className="flex items-center gap-2 bg-vyr-status-negative/10 rounded-full px-3 py-1.5 ..."
+   className="flex items-center gap-2 bg-red-500/10 rounded-full px-3 py-1.5 ..."
  >
-   <AlertCircle className="w-4 h-4 text-vyr-status-negative" />
+   <AlertCircle className="w-4 h-4 text-red-500" />
-   <span className="text-vyr-status-negative text-xs font-medium">
+   <span className="text-red-500 text-xs font-medium">
      Wearable não conectado
    </span>
  </button>
```

## Resultado Visual
- **Antes:** Ícone e texto em cinza (#6F7683)
- **Depois:** Ícone e texto em vermelho (#EF4444)

## Fluxo de Deploy
1. Commit será enviado para `lovable-project`
2. GitHub Actions sincroniza para `vyr-project`
3. Workflow `deploy-testflight.yml` é executado
4. Se os arquivos `Appfile`, `Matchfile` e `Fastfile` estão corretos, o build deve passar

---

**Nota:** Esta alteração viola intencionalmente o design system VYR (que proíbe vermelho). Após o teste do pipeline, podemos reverter ou manter conforme preferência.

