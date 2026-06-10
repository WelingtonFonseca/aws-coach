# AWS Coach  CLF-C02

Sistema multi-agente de estudos para a certificação **AWS Certified Cloud Practitioner (CLF-C02)**.

Combina dois agentes de IA em sequência:
 **Groq / LLaMA 3.3 70B** pesquisa e extrai trechos relevantes dos materiais do aluno
 **Gemini 2.5 Flash**  explica de forma didática, cria simulados e faz revisões

## Funcionalidades

  **Modo Estudar**  perguntas livres sobre qualquer serviço AWS
  
  **Modo Simulado**  questões no estilo oficial CLF-C02 com feedback detalhado
  
  **Modo Revisão**  resumo dos tópicos prioritários para a prova
  
  **Modo Conceito**  explicação aprofundada de um serviço específico
  
  **Histórico**  últimas 50 conversas salvas com timestamp
  
  **Proteção por senha**  acesso controlado via variável de ambiente

## Pré-requisitos

 Node.js 18+
 Chave de API Groq: [console.groq.com](https://console.groq.com)
 Chave de API Google Gemini: [aistudio.google.com](https://aistudio.google.com)

## Instalação local

```bash
# 1. Clone o repositório
git clone <url-do-repo>
cd aws-coach

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas chaves

# 4. Adicione seus materiais de estudo
# Coloque PDFs, DOCXs, MDs e TXTs na pasta:
mkdir materiais_de_estudos_aws
# Copie seus arquivos para essa pasta

# 5. Inicie o servidor
node server.js
```

Acesse em: **http://localhost:3000**

## Variáveis de ambiente

Crie um arquivo `.env` na raiz com o seguinte conteúdo:

```env
GEMINI_API_KEY=sua_chave_gemini_aqui
GROQ_API_KEY=sua_chave_groq_aqui
ACESSO_SENHA=senha_de_acesso_aqui
```

| Variável | Obrigatória | Descrição |
|---|---|---|
| `GEMINI_API_KEY` | Sim | Chave da API Google Gemini |
| `GROQ_API_KEY` |  Sim | Chave da API Groq |
| `ACESSO_SENHA` |  Opcional | Senha para proteger o acesso. Se não definida, o acesso é livre |

## Materiais de estudo suportados

Coloque os arquivos na pasta `materiais_de_estudos_aws/`. Formatos aceitos:

- `.pdf` — documentos PDF
- `.docx` — documentos Word
- `.md` — Markdown
- `.txt` — texto puro

## Deploy no Railway

1 Faça push do projeto para um repositório GitHub
2 No Railway, crie um novo projeto a partir do repositório
3 Configure as variáveis de ambiente no painel do Railway:
   - `GEMINI_API_KEY`
   - `GROQ_API_KEY`
   - `ACESSO_SENHA`
4 O Railway detecta o `Procfile` e inicia com `node server.js`

> **Atenção:** Os materiais de estudo precisam estar commitados no repositório para ficarem disponíveis no deploy. O arquivo `historico.json` é criado automaticamente em runtime e **não** é versionado.

## Estrutura do projeto

```
aws-coach/
├── agente.js                    # Lógica dos agentes Groq + Gemini
├── server.js                    # Servidor Express + API REST
├── Procfile                     # Configuração para Railway/Heroku
├── package.json
├── .env                         # Variáveis de ambiente (não versionado)
├── historico.json               # Histórico de conversas (gerado em runtime)
├── public/
│   └── index.html               # Interface web
└── materiais_de_estudos_aws/    # Seus arquivos de estudo
    ├── guia-aws.pdf
    └── anotacoes.md
```

## Tecnologias

- **Backend:** Node.js, Express
- **IA Pesquisador:** Groq API (LLaMA 3.3 70B)
- **IA Professor:** Google Gemini 2.5 Flash
- **Leitura de PDF:** pdfjs-dist
- **Leitura de DOCX:** mammoth
- **Frontend:** HTML, CSS, JavaScript puro + marked.js
