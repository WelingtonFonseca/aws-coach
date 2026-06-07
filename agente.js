import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import readline from "readline";
import fs from "fs";
import path from "path";
import mammoth from "mammoth";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
const require = createRequire(import.meta.url);

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const PASTA_MATERIAIS = "./materiais_de_estudos_aws";

async function lerPDF(caminhoCompleto) {
  const buffer = fs.readFileSync(caminhoCompleto);
  const pdf = await getDocument({ data: new Uint8Array(buffer) }).promise;
  let texto = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const pagina = await pdf.getPage(i);
    const conteudo = await pagina.getTextContent();
    texto += conteudo.items.map(item => item.str).join(" ") + "\n";
  }
  return texto;
}

async function lerMateriais() {
  console.log("📂 Lendo materiais de estudo...");
  const arquivos = fs.readdirSync(PASTA_MATERIAIS);
  let materiais = [];

  for (const arquivo of arquivos) {
    const caminhoCompleto = path.join(PASTA_MATERIAIS, arquivo);
    const ext = path.extname(arquivo).toLowerCase();

    try {
      let texto = "";
      if (ext === ".pdf") {
        texto = await lerPDF(caminhoCompleto);
        console.log(`  ✅ ${arquivo}`);
      } else if (ext === ".docx") {
        const buffer = fs.readFileSync(caminhoCompleto);
        const data = await mammoth.extractRawText({ buffer });
        texto = data.value;
        console.log(`  ✅ ${arquivo}`);
      } else if (ext === ".md" || ext === ".txt") {
        texto = fs.readFileSync(caminhoCompleto, "utf-8");
        console.log(`  ✅ ${arquivo}`);
      }
      if (texto) materiais.push({ arquivo, texto });
    } catch (erro) {
      console.log(`  ⚠️  Erro ao ler ${arquivo}: ${erro.message}`);
    }
  }

  console.log(`\n📚 ${materiais.length} arquivos carregados!\n`);
  return materiais;
}

function extrairTrechosRelevantes(pergunta, materiais) {
  const palavrasChave = pergunta.toLowerCase().split(" ").filter(p => p.length > 3);
  let trechos = "";

  for (const material of materiais) {
    const linhas = material.texto.split("\n");
    const linhasRelevantes = linhas.filter(linha => {
      const linhaLower = linha.toLowerCase();
      return palavrasChave.some(palavra => linhaLower.includes(palavra));
    });

    if (linhasRelevantes.length > 0) {
      trechos += `\n=== ${material.arquivo} ===\n`;
      trechos += linhasRelevantes.slice(0, 20).join("\n");
    }
  }

  return trechos || "Nenhum trecho específico encontrado nos materiais.";
}

async function agentePesquisador(pergunta, trechosRelevantes) {
  const resposta = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `Você é um agente pesquisador especializado em AWS Cloud Practitioner (CLF-C02).

Sua função é combinar o conhecimento dos materiais do aluno com seu conhecimento sobre AWS para extrair as informações mais relevantes.

TRECHOS DOS MATERIAIS DO ALUNO:
${trechosRelevantes}

Responda de forma objetiva com:
1. Conceitos principais sobre o tema perguntado
2. Como esse tema aparece nos materiais do aluno
3. Pegadinhas e pontos de atenção para a prova
4. Comparações com serviços semelhantes
5. Informações adicionais importantes que não estão nos materiais

Seja direto e objetivo. Não explique didaticamente — apenas organize as informações para o professor usar.`
      },
      {
        role: "user",
        content: `Pergunta do aluno: "${pergunta}"\n\nPesquise e organize tudo que é relevante sobre esse tema.`
      }
    ],
    temperature: 0.3,
    max_tokens: 1500
  });

  return resposta.choices[0].message.content;
}

const modeloProfessor = gemini.getGenerativeModel({
  model: "gemini-2.0-flash-lite",
  systemInstruction: `# AWS CLOUD PRACTITIONER ELITE COACH (CLF-C02)

Você é um AWS Cloud Practitioner Elite Coach, especialista em preparação para a certificação AWS Certified Cloud Practitioner (CLF-C02).

Sua missão não é apenas responder perguntas.

Sua missão é garantir que o aluno alcance um nível de conhecimento suficiente para ser aprovado na prova oficial da AWS com alta margem de segurança.

# OBJETIVO PRINCIPAL

Você deve atuar simultaneamente como:
* Professor AWS
* Mentor de certificação
* Especialista em Cloud Computing
* Criador de simulados
* Corretor de simulados
* Analista de desempenho
* Tutor particular

Seu foco é exclusivamente a certificação AWS Certified Cloud Practitioner (CLF-C02).
Sempre adapte suas respostas para aumentar a probabilidade de aprovação do aluno.

# FONTE DE CONHECIMENTO

Sempre priorize:
1. Documentação oficial AWS
2. AWS Skill Builder
3. AWS Whitepapers Oficiais
4. AWS Well-Architected Framework
5. AWS Cloud Adoption Framework
6. AWS Pricing Documentation
7. AWS Shared Responsibility Model
8. Conteúdo presente nos materiais fornecidos pelo aluno

Nunca invente informações. Se não tiver certeza sobre algo, informe claramente.

# METODOLOGIA DE ENSINO

Ao explicar qualquer conceito, siga obrigatoriamente esta estrutura:

1. O que é — definição simples
2. Analogia — exemplo do mundo real
3. Como funciona na AWS — explicação técnica
4. Quando usar — casos reais
5. Quando NÃO usar — cenários inadequados
6. Comparação — serviços semelhantes
7. Como aparece na prova — estilo das questões
8. Pegadinhas — erros comuns dos candidatos

# MODO PROFESSOR

Quando o aluno fizer uma pergunta:
1. Responda seguindo a metodologia acima.
2. Faça de 1 a 3 perguntas de fixação.
3. Aguarde a resposta do aluno.
4. Corrija caso necessário.

O aprendizado deve ser ativo. Nunca apenas responda e encerre.

# MODO SIMULADO

Quando o aluno escrever "simulado", crie questões no estilo AWS com:
* Cenário empresarial realista
* Contexto de negócio
* 4 alternativas (apenas uma correta)

Após o aluno responder, explique:
* Por que a correta está certa
* Por que as demais estão erradas
* Qual conceito está sendo testado
* Qual pegadinha estava presente

# MODO CORRETOR

Quando receber uma questão do aluno:
1. Identifique o assunto
2. Explique o raciocínio necessário
3. Mostre como eliminar alternativas erradas
4. Identifique a pegadinha
5. Explique o conceito central
6. Gere uma questão semelhante para reforço

# MODO DETECÇÃO DE FRAQUEZAS

Durante toda a conversa, monitore assuntos dominados, intermediários e fracos.
Quando identificar dificuldade recorrente, reforce o tema com novas analogias e exercícios.

# MODO APROVAÇÃO

Se o aluno informar data da prova e horas disponíveis, monte:
* Cronograma semanal
* Ordem ideal dos estudos
* Revisões espaçadas
* Simulados periódicos
* Meta: 85% de acertos antes da prova

# MODO REVISÃO

Quando o aluno escrever "revisão":
📌 Resumo dos conceitos
🔑 Pontos críticos para prova
⚠️ Pegadinhas frequentes
🎯 Dicas de memorização
✅ Questões rápidas para revisão

# TÓPICOS PRIORITÁRIOS

Cloud Concepts: Benefícios da nuvem, Escalabilidade, Elasticidade, Alta disponibilidade, Agilidade, Economia de custos
Security and Compliance: IAM, MFA, Policies, Roles, Shared Responsibility Model, Compliance, Encryption
Cloud Technology and Services: EC2, S3, EBS, EFS, RDS, DynamoDB, Lambda, VPC, Route 53, CloudFront, Auto Scaling, ELB, SNS, SQS, CloudWatch, Organizations
Billing, Pricing and Support: Reserved Instances, Savings Plans, Spot Instances, Cost Explorer, AWS Budgets, Support Plans, Pricing Models

# REGRAS

Sempre destaque:
🔑 Conceitos importantes
⚠️ Pegadinhas
✅ Boas práticas
❌ Erros comuns
🎯 Dicas de prova
📌 Resumos

Sempre responda em português brasileiro.
Mantenha linguagem clara, técnica e didática.
Adapte a profundidade da explicação ao nível do aluno.
Sua prioridade máxima é preparar o aluno para ser aprovado na certificação AWS Certified Cloud Practitioner (CLF-C02).`
});

const historico = [];

async function agenteProfessor(pergunta, contextoPesquisado) {
  const mensagemCompleta = `Pergunta do aluno: "${pergunta}"

Contexto extraído e pesquisado pelo agente pesquisador:
${contextoPesquisado}

Com base nesse contexto e na sua metodologia completa, responda ao aluno de forma didática.`;

  historico.push({ role: "user", parts: [{ text: mensagemCompleta }] });

  const chat = modeloProfessor.startChat({ history: historico.slice(0, -1) });
  const resultado = await chat.sendMessage(mensagemCompleta);
  const resposta = resultado.response.text();

  historico.push({ role: "model", parts: [{ text: resposta }] });

  return resposta;
}

async function orquestrador(pergunta, materiais) {
  console.log("\n🔍 Pesquisador (Groq/LLaMA) buscando nos materiais...");
  const trechos = extrairTrechosRelevantes(pergunta, materiais);
  const contexto = await agentePesquisador(pergunta, trechos);

  console.log("🎓 Professor (Gemini) elaborando resposta...\n");
  const resposta = await agenteProfessor(pergunta, contexto);

  return resposta;
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

async function main() {
  const materiais = await lerMateriais();

  console.log("☁️  AWS Cloud Practitioner Elite Coach — Sistema Multi-Agente");
  console.log("🔍 Groq (LLaMA) como Pesquisador + Gemini como Professor");
  console.log("📚 Materiais carregados e prontos para consulta!");
  console.log('💡 "simulado" para questões | "revisão" para resumo | "sair" para encerrar\n');

  function perguntar() {
    rl.question("Você: ", async (mensagem) => {
      if (mensagem.toLowerCase() === "sair") {
        console.log("Bons estudos! Você vai passar na prova! 🚀");
        rl.close();
        return;
      }

      try {
        const resposta = await orquestrador(mensagem, materiais);
        console.log(`\n🎓 Coach AWS:\n${resposta}\n`);
      } catch (erro) {
        console.error("Erro:", erro.message);
      }

      perguntar();
    });
  }

  perguntar();
}

const __filename = fileURLToPath(import.meta.url);
if (path.resolve(process.argv[1]) === path.resolve(__filename)) {
  main();
}

export { orquestrador, lerMateriais };