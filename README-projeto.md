# 🙏 Conecta Igreja

Sistema SaaS moderno e modular para gestão de igrejas.

## 📋 Sobre o Projeto

O **Conecta Igreja** é uma plataforma completa de gestão de igrejas que centraliza e otimiza as operações administrativas, financeiras e de comunicação. Construído com tecnologias modernas e arquitetura multitenant.

### ✨ Funcionalidades Principais (MVP)

- 🔐 **Autenticação Multitenant** - Múltiplas igrejas na mesma plataforma, dados completamente isolados
- 👥 **Gestão de Membros** - Cadastro completo, histórico, filtros e busca avançada
- 🏘️ **Gestão de Células** - Controle de grupos pequenos, reuniões e frequência
- 💰 **Finanças** - Controle de dízimos, ofertas, despesas e relatórios financeiros
- 📊 **Dashboard** - Visão geral com métricas e indicadores importantes

### 🚀 Tecnologias

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + shadcn/ui
- Zustand (estado global)
- React Query (cache e data fetching)
- React Hook Form + Zod (formulários e validação)

**Backend:**
- Supabase (PostgreSQL + Auth + Storage + Realtime)
- Row Level Security (RLS) para multitenancy
- Edge Functions para lógica serverless

**Deploy:**
- Frontend: Vercel
- Database: Supabase Cloud

---

## 📁 Estrutura do Projeto

```
conecta-igreja/
├── docs/                    # Documentação técnica
│   ├── 01-ARQUITETURA.md
│   ├── 02-ESTRUTURA-DIRETORIOS.md
│   ├── 03-STACK-TECNOLOGIAS.md
│   ├── 04-GUIA-DESENVOLVIMENTO.md
│   ├── 05-SUPABASE-INTEGRACAO.md
│   └── 06-ROADMAP-MVP.md
│
├── frontend/                # Aplicação React
│   ├── src/
│   │   ├── app/            # Configuração da aplicação
│   │   ├── components/     # Componentes compartilhados
│   │   ├── modules/        # Módulos (feature-based)
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Bibliotecas e utilitários
│   │   ├── stores/         # Zustand stores
│   │   └── types/          # Types globais
│   │
│   ├── .env.local          # Variáveis de ambiente locais
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── supabase/               # Configuração do Supabase
│   ├── migrations/         # Migrations SQL
│   ├── functions/          # Edge Functions
│   └── seed.sql            # Dados de teste
│
└── README.md               # Este arquivo
```

---

## 🚀 Como Começar

### Pré-requisitos

- Node.js 20+ e npm 10+
- Conta no Supabase (gratuita)
- Git

### 1. Clone o Repositório

```bash
git clone https://github.com/sua-org/conecta-igreja.git
cd conecta-igreja
```

### 2. Configure o Supabase

1. Crie um projeto em [supabase.com/dashboard](https://supabase.com/dashboard)
2. Anote as credenciais:
   - **Project URL**: `https://xxx.supabase.co`
   - **Anon Key**: `eyJhbGc...`

### 3. Configure o Frontend

```bash
cd frontend
npm install
```

Crie o arquivo `.env.local`:

```bash
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### 4. Rode as Migrations

```bash
# Instalar Supabase CLI
npm install -g supabase

# Linkar projeto
supabase link --project-ref xxx

# Aplicar migrations
supabase db push
```

### 5. Inicie o Projeto

```bash
cd frontend
npm run dev
```

Acesse: http://localhost:5173

---

## 📖 Documentação

### Documentos Técnicos

- [📐 Arquitetura Técnica](docs/01-ARQUITETURA.md) - Visão geral da arquitetura, multitenant, segurança
- [📁 Estrutura de Diretórios](docs/02-ESTRUTURA-DIRETORIOS.md) - Organização de pastas e arquivos
- [🛠️ Stack de Tecnologias](docs/03-STACK-TECNOLOGIAS.md) - Tecnologias usadas e justificativas
- [🚀 Guia de Desenvolvimento](docs/04-GUIA-DESENVOLVIMENTO.md) - Como adicionar novos módulos
- [🗄️ Integração Supabase](docs/05-SUPABASE-INTEGRACAO.md) - Setup e uso do Supabase
- [🗺️ Roadmap MVP](docs/06-ROADMAP-MVP.md) - Plano de desenvolvimento detalhado

---

## 🗺️ Roadmap

### ✅ Fase 1: MVP (12 semanas)
- Autenticação multitenant
- Gestão de Membros
- Gestão de Células
- Finanças básicas
- Dashboard

### 🔄 Fase 2: Expansão (8 semanas)
- CRM com Kanban
- Módulo de Ministérios
- Módulo de Comunicação (Email)
- Módulo de Eventos
- Relatórios avançados

### 🚀 Fase 3: Avançado (12 semanas)
- Comunicação via WhatsApp
- Construtor de Fluxos (Automator)
- Carteirinhas digitais
- API Pública
- App Mobile (React Native)

---

## 🤝 Como Contribuir

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

**Padrão de Commits:** [Conventional Commits](https://www.conventionalcommits.org/)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 📞 Suporte

- 📧 Email: suporte@conectaigreja.com
- 💬 Discord: [Link do servidor]
- 📚 Documentação: [docs/](docs/)

---

## 🙏 Agradecimentos

- [Supabase](https://supabase.com) - Backend-as-a-Service incrível
- [shadcn/ui](https://ui.shadcn.com) - Componentes UI modernos
- [Tailwind CSS](https://tailwindcss.com) - Framework CSS utility-first

---

**Feito com ❤️ para transformar a gestão de igrejas**
