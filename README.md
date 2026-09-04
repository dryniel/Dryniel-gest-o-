# DRYNIEL Gestão — primeira versão

Base funcional em Flutter para Android do aplicativo **DRYNIEL Gestão**.

## O que já está nesta versão

- Painel inicial com faturamento, gastos, diárias e lucro estimado.
- Cadastro simples de orçamentos.
- Transformação visual de orçamento/cliente em obra.
- Lançamento de gastos por categoria e obra.
- Lançamento de diárias de funcionários por obra.
- Resumo financeiro por obra e geral.
- Persistência local simples usando SharedPreferences.
- Geração/visualização de orçamento em PDF.
- Identidade visual baseada no logo oficial DRYNIEL: azul `#1E2C59` e bege `#9B8F7B`.

## Como executar

1. Instale Flutter e Android Studio no computador.
2. Na pasta deste projeto, execute:

```bash
flutter create --platforms=android .
flutter pub get
flutter run
```

> O comando `flutter create` adiciona a pasta Android necessária para compilar o APK. Os arquivos `lib/`, `assets/` e `pubspec.yaml` deste pacote são a base do app.

## Gerar APK

```bash
flutter build apk --release
```

O APK normalmente será criado em:

`build/app/outputs/flutter-apk/app-release.apk`

## Próximas melhorias previstas

- Cadastro completo de clientes e serviços recorrentes.
- Status de orçamento (rascunho, enviado, aprovado, recusado).
- Contas a receber e pagamentos parciais.
- Fotos e documentos por obra.
- Foto de comprovantes de gastos.
- Relatórios por período e exportação.
- Backup em nuvem e login.
- Compartilhamento direto do PDF pelo WhatsApp.
