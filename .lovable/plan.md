
# Plano: Configuração Completa de Deploy para TestFlight

## Visão Geral
O workflow atual está falhando porque o repositório `vyr-project` não possui os arquivos de configuração do Fastlane necessários. Vou criar toda a estrutura necessária.

## Arquivos a Criar

### 1. Gemfile (ios/App/Gemfile)
Define as dependências Ruby para o Fastlane.

### 2. Fastfile (ios/App/fastlane/Fastfile)
Contém as lanes de automação, incluindo:
- Configuração do App Store Connect API
- Match para gerenciar certificados
- Build e upload para TestFlight

### 3. Matchfile (ios/App/fastlane/Matchfile)
Configura o Fastlane Match para gerenciar certificados e provisioning profiles automaticamente.

### 4. Appfile (ios/App/fastlane/Appfile)
Contém informações do app (bundle ID, team ID).

---

## Detalhes Técnicos

### Estrutura de Arquivos
```text
ios/
└── App/
    ├── Gemfile
    └── fastlane/
        ├── Appfile
        ├── Fastfile
        └── Matchfile
```

### Configuração do Fastfile
- Usa API Key do App Store Connect (sem senha de Apple ID)
- Match em modo `readonly` para CI (certificados já devem existir no repo)
- Incrementa build number automaticamente
- Build com `gym` e upload com `pilot`

### Pré-requisito Importante
**Antes do primeiro deploy**, você precisa executar o Match localmente no seu Mac uma única vez para gerar os certificados:

```bash
cd ios/App
bundle install
bundle exec fastlane match appstore
```

Isso vai criar os certificados no repositório privado definido em `MATCH_GIT_URL`.

---

## Workflow Atualizado
O workflow `.github/workflows/deploy-testflight.yml` permanece o mesmo, mas agora terá os arquivos de suporte necessários.

## Próximos Passos Após Aprovação
1. Criar os 4 arquivos de configuração do Fastlane
2. Sincronizar com vyr-project via workflow
3. Executar Match localmente para gerar certificados (uma única vez)
4. Re-executar o workflow de deploy
