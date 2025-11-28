# VetLink / VetFinder 🐾

Sistema completo para agendamento de consultas veterinárias, gestão de clínicas e histórico de saúde de pets.

## 🚀 Tecnologias Utilizadas

### Frontend (`/frontend`)
*   **React** (Vite)
*   **TypeScript**
*   **Tailwind CSS**
*   **Shadcn/ui** (Componentes de UI)
*   **React Query** (Gerenciamento de estado e cache)
*   **Lucide React** (Ícones)
*   **Google Maps API** (Geolocalização e Autocomplete)

### Backend (`/backend`)
*   **Node.js**
*   **Express**
*   **PostgreSQL** (Banco de dados)
*   **JWT** (Autenticação)
*   **Bcrypt** (Criptografia de senhas)

---

## 🛠️ Pré-requisitos

*   **Node.js** (v18 ou superior)
*   **PostgreSQL** (instalado e rodando)

---

## ⚙️ Instalação e Configuração

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd PDS
```

### 2. Configuração do Backend

Entre na pasta do backend e instale as dependências:
```bash
cd backend
npm install
```

Crie um arquivo `.env` na pasta `backend` com as seguintes variáveis (exemplo):
```env
PORT=3000
DATABASE_URL=postgresql://seu_usuario:sua_senha@localhost:5432/vetfinder_db
JWT_SECRET=sua_chave_secreta_super_segura
GOOGLE_MAPS_API_KEY=sua_chave_da_api_do_google
FRONTEND_URL=http://localhost:5173
```

Inicie o servidor:
```bash
npm start
```
*O servidor rodará em `http://localhost:3000`*

### 3. Configuração do Frontend

Abra um novo terminal, entre na pasta do frontend e instale as dependências:
```bash
cd frontend
npm install
```

Crie um arquivo `.env` na pasta `frontend` (opcional, se necessário para configurar a URL da API):
```env
VITE_API_URL=http://localhost:3000/api
```

Inicie o servidor de desenvolvimento:
```bash
npm run dev
```
*O frontend rodará em `http://localhost:5173` (ou porta similar)*

---

## ✨ Funcionalidades Principais

*   **Busca de Clínicas:** Encontre clínicas veterinárias próximas usando geolocalização.
*   **Agendamento Online:** Marque consultas para seus pets diretamente pelo app.
*   **Gestão de Pets:** Cadastre seus pets (Cachorro, Gato, Pássaro, etc.) com ícones personalizados.
*   **Histórico de Saúde:** Acompanhe vacinas e consultas anteriores.
*   **Sistema de Avaliações:** Avalie clínicas e veja a opinião de outros tutores.
*   **Dashboard da Clínica:** Área exclusiva para clínicas gerenciarem sua agenda, serviços e horários.
*   **Status em Tempo Real:** Veja se a clínica está "Aberta" ou "Fechada" agora.

---

## 📂 Estrutura do Projeto

```
PDS/
├── backend/            # API Node.js e Express
│   ├── dist/           # Código compilado
│   ├── src/            # Código fonte do backend
│   └── ...
├── frontend/           # Aplicação React (antigo vetlink-hub-main)
│   ├── src/            # Componentes e páginas
│   └── ...
└── README.md           # Documentação do projeto
```

## 📝 Notas
*   Certifique-se de que o PostgreSQL está rodando antes de iniciar o backend.
*   Para rodar em modo de desenvolvimento no backend (com auto-reload), use `npm run dev`.
