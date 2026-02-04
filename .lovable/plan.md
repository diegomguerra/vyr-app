

# Plano: Adicionar Debug Detalhado ao Deploy TestFlight

## Contexto

O Copilot sugeriu adicionar `FASTLANE_DEBUG=1` para obter logs mais detalhados durante a execução do Fastlane. Isso ajudará a identificar exatamente onde está falhando a autenticação com a App Store Connect API.

## Alteracao Necessaria

### Arquivo: `.github/workflows/deploy-testflight.yml`

**Antes:**
```yaml
- name: Deploy to TestFlight
  env:
    APP_STORE_CONNECT_API_KEY_ID: ${{ secrets.APP_STORE_CONNECT_API_KEY_ID }}
    # ... outros secrets
  run: |
    cd ios/App
    bundle exec fastlane beta
```

**Depois:**
```yaml
- name: Deploy to TestFlight
  env:
    APP_STORE_CONNECT_API_KEY_ID: ${{ secrets.APP_STORE_CONNECT_API_KEY_ID }}
    # ... outros secrets
  run: |
    cd ios/App
    FASTLANE_DEBUG=1 bundle exec fastlane beta
```

## Beneficio

Com `FASTLANE_DEBUG=1`, o log vai mostrar:
- Detalhes da comunicacao com App Store Connect API
- Valores de configuracao sendo usados (mascarados)
- Passo-a-passo detalhado do processo de autenticacao
- Mensagens de erro mais especificas

## Lembrete Importante

Como a pasta `.github/workflows/` e sincronizada automaticamente do `vyr-app` para `vyr-project`, essa alteracao feita aqui sera propagada automaticamente na proxima sincronizacao.

## Secao Tecnica

A variavel `FASTLANE_DEBUG=1` ativa o modo verbose do Fastlane, que inclui:
- Stack traces completos
- Logs de requisicoes HTTP (sem dados sensiveis)
- Estado interno das acoes executadas

