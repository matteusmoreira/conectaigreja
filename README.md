# 🙏 Conecta Igreja

Sistema SaaS de gerenciamento completo para igrejas, desenvolvido com React, TypeScript, Supabase e Tailwind CSS.

## 🚀 Tecnologias

- **Frontend:** React 18 + TypeScript + Vite
- **Estilização:** Tailwind CSS + Shadcn/UI
- **Backend:** Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **State Management:** Zustand + React Query
- **Roteamento:** React Router DOM

## 📁 Estrutura do Projeto

```
conecta-igreja/
├── docs/                    # Documentação técnica completa
│   ├── 01-ARQUITETURA.md
│   ├── 02-ESTRUTURA-DIRETORIOS.md
│   ├── 03-STACK-TECNOLOGIAS.md
│   ├── 04-GUIA-DESENVOLVIMENTO.md
│   ├── 05-SUPABASE-INTEGRACAO.md
│   └── 06-ROADMAP-MVP.md
├── src/
│   ├── assets/             # Imagens, ícones, etc
│   ├── components/         # Componentes reutilizáveis
│   │   ├── ui/            # Componentes base (Shadcn/UI)
│   │   └── layout/        # Layouts da aplicação
│   ├── features/          # Módulos/features por domínio
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Configurações (Supabase, Query Client)
│   ├── styles/            # Estilos globais
│   ├── types/             # Tipos TypeScript globais
│   ├── utils/             # Funções utilitárias
│   ├── App.tsx
│   └── main.tsx
└── ...
```

## 🛠️ Como Executar

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Supabase

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/matteusmoreira/conectaigreja.git
cd conectaigreja
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:

Copie o arquivo `.env.example` para `.env.local` e preencha com suas credenciais do Supabase:

```bash
cp .env.example .env.local
```

4. Execute o projeto:
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

## 📚 Documentação

Toda a documentação técnica está na pasta `docs/`:

- **[Arquitetura](docs/01-ARQUITETURA.md)** - Visão geral da arquitetura e estratégias
- **[Estrutura](docs/02-ESTRUTURA-DIRETORIOS.md)** - Organização de pastas e arquivos
- **[Stack](docs/03-STACK-TECNOLOGIAS.md)** - Tecnologias e dependências
- **[Guia de Desenvolvimento](docs/04-GUIA-DESENVOLVIMENTO.md)** - Como desenvolver features
- **[Supabase](docs/05-SUPABASE-INTEGRACAO.md)** - Configuração e uso do Supabase
- **[Roadmap MVP](docs/06-ROADMAP-MVP.md)** - Planejamento das 12 semanas

## 🎯 Módulos do Sistema

1. **Autenticação & Gestão de Usuários**
2. **Gestão de Membros**
3. **Gestão de Células/Pequenos Grupos**
4. **Gestão Financeira**
5. **Gestão de Eventos**
6. **Gestão de Comunicação**
7. **Gestão de Voluntários e Escalas**
8. **Relatórios e Dashboards**
9. **Gestão de Patrimônio**
10. **Multitenant (Múltiplas Igrejas)**

## 📝 Comandos Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview da build
npm run preview
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👥 Time

Desenvolvido por Matteus Moreira

---

**Status:** 🚧 Em desenvolvimento - Fase 0 (Setup Inicial)
