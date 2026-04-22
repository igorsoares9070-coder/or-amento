# Orçamento App

Aplicativo mobile de gerenciamento de orçamentos, desenvolvido com **React Native** e **Expo**.

## Funcionalidades

- Listagem de orçamentos com status (pendente, aprovado, recusado)
- Criação e edição de orçamentos
- Adição de itens/serviços com valores
- Cálculo automático de totais
- Confirmação de exclusão

## Tecnologias

- [Expo](https://expo.dev) ~54
- React Native 0.81
- TypeScript
- @expo/vector-icons

## Estrutura

```
├── App.tsx                  # Entrada da aplicação
├── index.ts                 # Registro do app
├── src/
│   ├── components/          # Componentes reutilizáveis
│   ├── constants/           # Status e constantes
│   ├── data/                # Dados mock
│   ├── screens/             # Telas da aplicação
│   ├── theme/               # Cores e espaçamentos
│   ├── types/               # Tipos TypeScript
│   └── utils/               # Funções utilitárias
└── assets/                  # Ícones e imagens
```

## Como rodar

### Pré-requisitos

- [Node.js](https://nodejs.org) 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Instalação

```bash
npm install
```

### Iniciar o servidor de desenvolvimento

```bash
npx expo start
```

| Plataforma | Comando | Requisito |
|------------|---------|-----------|
| Web        | Pressione `w` no terminal | — |
| Android    | Pressione `a` | Android Studio + SDK |
| iOS        | Pressione `i` | macOS + Xcode |
| Celular    | Escaneie o QR Code | App [Expo Go](https://expo.dev/go) |

### Rodar direto na web

```bash
npx expo start --web
```
