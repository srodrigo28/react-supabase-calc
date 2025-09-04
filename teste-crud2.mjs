// teste-crud.mjs
import axios from "axios";

const API_URL = "https://dhtrvtytzxpjzpersuhc.supabase.co/rest/v1/compras_online";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRodHJ2dHl0enhwanpwZXJzdWhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1MTA5MjMsImV4cCI6MjA3MjA4NjkyM30.RhJqFO0MnZrFw7J0Obx2VWVLCYNTN60j29fT1u9hOhM";

const headers = {
  apikey: API_KEY,
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

// Função principal de teste CRUD
async function testCRUD() {
  try {
    console.log("=== TESTE CRUD COMPRAS ONLINE ===");

    // 1️⃣ CREATE
    console.log("\n🔹 Inserindo nova compra...");
    const novoItem = { nome: "Produto Teste", quantidade: 5, valor: 99.9 };
    const { data: criado } = await axios.post(API_URL, novoItem, { headers });
    console.log("Inserido:", criado);

    const id = criado[0].id;

    // 2️⃣ READ
    console.log("\n🔹 Listando compras...");
    const { data: lista } = await axios.get(`${API_URL}?select=*`, { headers });
    console.log("Lista atual:", lista);

    // Verificando lista final
    const { data: listaFinal } = await axios.get(`${API_URL}?select=*`, { headers });
    console.log("Lista final:", listaFinal);

    console.log("\n✅ CRUD concluído com sucesso!");
  } catch (error) {
    console.error("Erro no teste CRUD:", error.response?.data || error.message);
  }
}

testCRUD();
