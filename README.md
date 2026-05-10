# BS Notes 📝

Um blog pessoal e repositório de artigos criado com o intuito de compartilhar aprendizados e experiências sobre meus assuntos de interesse. O objetivo principal do projeto é funcionar como um espaço documental de conhecimento e, ao mesmo tempo, ajudar outras pessoas que buscam informações sobre esses temas, além de contar com um dicionário técnico integrado.



## 🛠 Tecnologias Utilizadas

### Frontend
- **React 19** com **TypeScript** e **Vite**
- **Tailwind CSS**
- **Google OAuth**
- **React Icons**

### Backend
- **Python 3** com **FastAPI**
- **SQLAlchemy**
- **Pydantic**
- **JWT**


## ✨ Funcionalidades

- **Autenticação Administrativa:** Login restrito via Google, gerando tokens JWT exclusivo para administradores da plataforma.
- **Blog (Posts):** Criação, edição, listagem e visualização de posts.
- **Dicionário:** Área dedicada ao cadastramento de termos e definições com paginação e ordenação alfabética.
- **Painel de Administração:** Controle de acesso restrito para edição e deleção de conteúdos, escondido da interface pública.


## 📂 Estrutura do Projeto

```text
bs-notes/
├── backend/                  # API FastAPI e lógica de negócios
│   ├── database.py           # Configuração do banco
│   ├── dependencies.py       # Dependências de autenticação (verify_admin, etc)
│   ├── main.py               # Ponto de entrada e configuração do app FastAPI
│   ├── models.py             # Modelos de banco de dados (SQLAlchemy)
│   ├── routers/              # Rotas da API separadas por contexto
│   └── schemas.py            # Validações e tipagens de entrada/saída (Pydantic)
│
└── frontend/                 # Interface
    ├── package.json          # Configuração de dependências
    └── src/
        ├── App.tsx           # Ponto de entrada do Frontend/Rotas Base
        ├── components/       # Componentes React
        └── services/         # Serviços de chamadas HTTP (API)
```
