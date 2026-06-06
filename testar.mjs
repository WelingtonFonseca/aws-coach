import "dotenv/config";

const chave = process.env.GEMINI_API_KEY;
const resposta = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${chave}`);
const dados = await resposta.json();

if (dados.models) {
  console.log("Modelos disponíveis:");
  dados.models.forEach(m => console.log(" -", m.name));
} else {
  console.log("Erro:", JSON.stringify(dados));
}