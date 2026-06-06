import "dotenv/config";
import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import { orquestrador, lerMateriais } from "./agente.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HISTORICO_PATH = path.join(__dirname, "historico.json");
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let materiais = [];
let materiaisCarregados = false;
let erroCarregamento = null;

// ── Histórico ─────────────────────────────────────────────────
function carregarHistorico() {
  try {
    if (!fs.existsSync(HISTORICO_PATH)) return [];
    return JSON.parse(fs.readFileSync(HISTORICO_PATH, "utf-8"));
  } catch {
    return [];
  }
}

function salvarNoHistorico(pergunta, resposta) {
  const historico = carregarHistorico();
  historico.push({
    timestamp: new Date().toISOString(),
    pergunta,
    resposta,
  });
  fs.writeFileSync(HISTORICO_PATH, JSON.stringify(historico, null, 2), "utf-8");
}

// ── Autenticação ──────────────────────────────────────────────
function verificarSenha(req, res, next) {
  const senhaEsperada = process.env.ACESSO_SENHA;
  if (!senhaEsperada) return next(); // sem senha configurada = acesso livre
  if (req.headers['x-senha'] !== senhaEsperada) {
    return res.status(401).json({ erro: 'Acesso não autorizado.' });
  }
  next();
}

// ── Inicialização ─────────────────────────────────────────────
async function inicializar() {
  try {
    console.log("🚀 Iniciando AWS Coach Web...");
    materiais = await lerMateriais();
    materiaisCarregados = true;
  } catch (erro) {
    erroCarregamento = erro.message;
    console.error("❌ Erro ao carregar materiais:", erro.message);
  }
}

// ── Rotas ─────────────────────────────────────────────────────
app.get("/api/status", (req, res) => {
  res.json({
    carregado: materiaisCarregados,
    erro: erroCarregamento,
    quantidadeArquivos: materiais.length,
    arquivos: materiais.map(m => m.arquivo),
  });
});

app.get("/api/historico", verificarSenha, (req, res) => {
  const historico = carregarHistorico();
  res.json(historico.slice(-50).reverse());
});

app.post("/api/perguntar", verificarSenha, async (req, res) => {
  const { pergunta } = req.body;

  if (!pergunta?.trim()) {
    return res.status(400).json({ erro: "Pergunta não pode estar vazia." });
  }

  if (!materiaisCarregados) {
    return res.status(503).json({ erro: "Materiais ainda sendo carregados. Aguarde alguns segundos." });
  }

  try {
    const resposta = await orquestrador(pergunta.trim(), materiais);
    salvarNoHistorico(pergunta.trim(), resposta);
    res.json({ resposta });
  } catch (erro) {
    console.error("Erro ao processar:", erro.message);
    res.status(500).json({ erro: "Erro ao processar a pergunta. Tente novamente." });
  }
});

inicializar().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ AWS Coach disponível em http://localhost:${PORT}`);
  });
});
