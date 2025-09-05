import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, ShoppingCart, PlusCircle } from "lucide-react";

const API_URL = "https://dhtrvtytzxpjzpersuhc.supabase.co/rest/v1/compras_online";
const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRodHJ2dHl0enhwanpwZXJzdWhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1MTA5MjMsImV4cCI6MjA3MjA4NjkyM30.RhJqFO0MnZrFw7J0Obx2VWVLCYNTN60j29fT1u9hOhM";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const funcFormatar = {
  moeda: (v) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(v || 0),
  data: (d) => (d ? new Intl.DateTimeFormat("pt-BR").format(new Date(d)) : ""),
};

// Função para tratar valor digitado (moeda)
const formatarMoedaInput = (valorDigitado) => {
  let somenteNumeros = valorDigitado.replace(/\D/g, "");
  let numero = parseFloat(somenteNumeros) / 100;
  if (isNaN(numero)) numero = 0;

  return {
    exibicao: numero.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
    numero,
  };
};

export default function AppD() {
  const [form, setForm] = useState({ id: null, nome: "", quantidade: 1, valor: 0, valorExibicao: "" });
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ show: false, msg: "", action: null });

  // Atualiza campos do formulário
  const handleChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // Limpa formulário
  const clearForm = () => setForm({ id: null, nome: "", quantidade: 1, valor: 0, valorExibicao: "" });

  // Busca lista de compras
  const buscarCompras = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("", { params: { select: "*" } });
      setLista(data || []);
    } catch (e) {
      console.error(e);
      setModal({ show: true, msg: "Erro ao listar compras." });
    } finally {
      setLoading(false);
    }
  };

  // Salva (insert ou update)
  const salvarCompra = async (e) => {
    e.preventDefault();

    // 🔹 Validação antes de salvar
    if (!form.nome.trim()) {
      setModal({ show: true, msg: "O campo Produto é obrigatório.", action: null });
      return;
    }
    if (!form.quantidade || form.quantidade <= 0) {
      setModal({ show: true, msg: "Informe uma quantidade válida (maior que zero).", action: null });
      return;
    }
    if (!form.valor || form.valor <= 0) {
      setModal({ show: true, msg: "Informe um valor válido (maior que zero).", action: null });
      return;
    }

    setLoading(true);
    try {
      const payload = { nome: form.nome, quantidade: form.quantidade, valor: form.valor };

      if (form.id) {
        await api.patch("", payload, { params: { id: `eq.${form.id}` } });
        setModal({ show: true, msg: "Compra atualizada com sucesso!" });
      } else {
        await api.post("", payload, { headers: { Prefer: "return=representation" } });
        setModal({ show: true, msg: "Compra gravada com sucesso!" });
      }

      clearForm();
      await buscarCompras();
    } catch (e) {
      console.error(e);
      setModal({ show: true, msg: "Erro ao salvar compra." });
    } finally {
      setLoading(false);
    }
  };

  // Excluir item
  const excluirCompra = async (id) => {
    setLoading(true);
    try {
      await api.delete("", { params: { id: `eq.${id}` } });
      await buscarCompras();
      setModal({ show: true, msg: "Compra excluída com sucesso!" });
    } catch (e) {
      console.error(e);
      setModal({ show: true, msg: "Erro ao excluir compra." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarCompras();
  }, []);

  const total = lista.reduce((acc, i) => acc + (i?.valor || 0) * (i?.quantidade || 0), 0);

  return (
    <div className="bg-slate-900 min-h-screen p-6 text-white">
      <div className="container mx-auto max-w-lg">
        {/* Header + Total */}
        <motion.h3
          className="text-3xl text-center mb-6 font-bold flex justify-between items-center gap-2 "
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        >
          <div className="flex flex-col justify-center items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-violet-400" />
            <h2 className="text-sm md:text-2xl">Compras Online</h2>
          </div>

          <motion.div
            className="mt-6 bg-slate-800 p-6 rounded-xl flex justify-between items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <h4 className="text-lg font-semibold mr-2">Total:</h4>
            <span className="text-lg md:text-3xl font-bold text-violet-400">
              {funcFormatar.moeda(total)}
            </span>
          </motion.div>
        </motion.h3>

        {/* Formulário */}
        <motion.form
          onSubmit={salvarCompra}
          className="bg-slate-800 p-6 rounded-xl shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Produto */}
          <div className="flex flex-col mb-4">
            <label htmlFor="nome" className="text-slate-300 text-sm mb-1">Produto</label>
            <input
              id="nome"
              type="text"
              value={form.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
              className="bg-slate-700 p-2 rounded-md text-white focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div className="flex gap-4">
            {/* Quantidade */}
            <div className="flex flex-col mb-4 max-w-20">
              <label htmlFor="quantidade" className="text-slate-300 text-sm mb-1">Quantidade</label>
              <input  id="quantidade"  type="number"  min="1"   value={form.quantidade}
                onChange={(e) => handleChange("quantidade", Number(e.target.value))}
                className="bg-slate-700 p-2 rounded-md text-white focus:ring-2 focus:ring-violet-500"
              />
            </div>

            {/* Valor */}
            <div className="flex-1 flex-col mb-4">
              <label htmlFor="valor" className="text-slate-300 text-sm mb-1">Valor (R$)</label>
              <input  id="valor" type="text"  value={form.valorExibicao || ""}
                onChange={(e) => {
                  const { exibicao, numero } = formatarMoedaInput(e.target.value);
                  setForm((f) => ({ ...f, valor: numero, valorExibicao: exibicao }));
                }}
                className="bg-slate-700 p-2 w-full rounded-md text-white focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="p-2 bg-violet-600 rounded-md w-full hover:bg-violet-500 flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              {loading ? "Processando..." : form.id ? "Atualizar" : "Gravar"}
            </button>
            <button
              type="button"
              onClick={clearForm}
              className="p-2 bg-slate-600 rounded-md w-full hover:bg-slate-500"
            >
              Limpar
            </button>
          </div>
        </motion.form>

        {/* Lista */}
        <motion.div className="mt-6 bg-slate-800 p-6 rounded-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          
          <AnimatePresence>
            {lista.length === 0 ? (
              <motion.p className="text-center text-slate-400" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                Nenhum item cadastrado.
              </motion.p>
            ) : (
              <div className="mt-2 bg-slate-800 p-6 rounded-xl ">
                <div className="flex justify-between items-center mb-2 sticky top-0 bg-slate-800 z-10">
                  <h4 className="text-lg mb-4 font-semibold">Itens cadastrados:</h4>
                  <span className="text-white bg-violet-500 w-10 h-10 flex items-center justify-center rounded-full">
                    {lista.length}
                  </span>
                </div>

                <AnimatePresence>
                  {lista.length === 0 ? (
                    <motion.p
                      className="text-center text-slate-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      Nenhum item cadastrado.
                    </motion.p>
                  ) : (
                    <ul className="space-y-4 pr-2"> {/* pr-2 = evita cortar conteúdo pela barra */}
                      {lista.map((c) => (
                        <motion.li
                          key={c.id}
                          className="bg-slate-700 p-4 rounded-md flex flex-col sm:flex-row justify-between items-center"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex items-center w-full">
                            <div className="flex flex-col items-center flex-1">
                              <p className="font-bold text-md text-sm mb-2 w-full">{c.nome}</p>
                              <div className="text-sm text-slate-200 flex gap-2 items-center w-full">
                                <div className="w-6 h-6 md:w-9 md:h-9 bg-violet-500 rounded-full 
                                  flex items-center justify-center text-xs font-bold">
                                  {c.quantidade}
                                </div>
                                un.
                                <div>
                                  <span className="pl-2">{funcFormatar.moeda(c.valor)}</span>
                                  <span className="text-xs text-slate-400 ml-2 hidden md:flex">
                                    Criado em: {funcFormatar.data(c.created_at)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col gap-1 sm:mt-0 max-w-20 h-18">
                              <button
                                onClick={() =>
                                  setForm({
                                    id: c.id,
                                    nome: c.nome,
                                    quantidade: c.quantidade,
                                    valor: c.valor,
                                    valorExibicao: funcFormatar.moeda(c.valor),
                                  })
                                }
                                className="bg-blue-500 px-3 py-2 rounded-md hover:bg-blue-400 flex items-center"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  setModal({
                                    show: true,
                                    msg: "Confirmar exclusão?",
                                    action: () => excluirCompra(c.id),
                                  })
                                }
                                className="bg-red-500 px-3 py-2 rounded-md hover:bg-red-400 flex items-center"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </AnimatePresence>
              </div>

            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal.show && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          >
            <motion.div
              className="bg-slate-800 p-6 rounded-xl max-w-sm text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <p className="mb-4">{modal.msg}</p>
              {modal.action ? (
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => {
                      modal.action();
                      setModal({ show: false, msg: "", action: null });
                    }}
                    className="bg-green-500 px-4 py-2 rounded-md hover:bg-green-400"
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={() => setModal({ show: false, msg: "", action: null })}
                    className="bg-gray-500 px-4 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setModal({ show: false, msg: "", action: null })}
                  className="bg-violet-600 px-4 py-2 rounded-md hover:bg-violet-500"
                >
                  OK
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
