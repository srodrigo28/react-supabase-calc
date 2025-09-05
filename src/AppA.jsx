import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://dhtrvtytzxpjzpersuhc.supabase.co/rest/v1/compras_online";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRodHJ2dHl0enhwanpwZXJzdWhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1MTA5MjMsImV4cCI6MjA3MjA4NjkyM30.RhJqFO0MnZrFw7J0Obx2VWVLCYNTN60j29fT1u9hOhM"; // use a mesma do seu código

// Criando instância do axios com configuração base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Formatação de moeda e data
const funcFormatar = {
  moeda: (v) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v || 0),
  data: (d) => (d ? new Intl.DateTimeFormat("pt-BR").format(new Date(d)) : ""),
};

export default function AppC() {
  const [form, setForm] = useState({ id: null, nome: "", quantidade: 1, valor: 0 });
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ show: false, msg: "", action: null });

  const handleChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const clearForm = () => setForm({ id: null, nome: "", quantidade: 1, valor: 0 });

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

  const salvarCompra = async (e) => {
    e.preventDefault();
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
        <h3 className="text-3xl text-center mb-6 font-bold">Compras Online</h3>

        {/* Formulário */}
        <form onSubmit={salvarCompra} className="bg-slate-800 p-6 rounded-xl shadow-lg">
          {[
            { id: "nome", label: "Produto", type: "text", parser: (v) => v },
            { id: "quantidade", label: "Quantidade", type: "number", min: 1, parser: (v) => Number(v) },
            { id: "valor", label: "Valor (R$)", type: "number", step: "0.01", parser: (v) => Number(v) },
          ].map(({ id, label, parser, ...rest }) => (
            <div key={id} className="flex flex-col mb-4">
              <label htmlFor={id} className="text-slate-300 text-sm mb-1">{label}</label>
              <input
                id={id}
                value={form[id]}
                onChange={(e) => handleChange(id, parser(e.target.value))}
                className="bg-slate-700 p-3 rounded-md text-white focus:ring-2 focus:ring-violet-500"
                required
                {...rest}
              />
            </div>
          ))}
          <div className="flex gap-4">
            <button type="submit" disabled={loading} className="p-3 bg-violet-600 rounded-md w-full hover:bg-violet-500">
              {loading ? "Processando..." : form.id ? "Atualizar" : "Gravar"}
            </button>
            <button type="button" onClick={clearForm} className="p-3 bg-slate-600 rounded-md w-full hover:bg-slate-500">
              Limpar
            </button>
          </div>
        </form>

        {/* Total */}
        <div className="mt-6 bg-slate-800 p-6 rounded-xl flex justify-between items-center">
          <h4 className="text-lg font-semibold">Total Geral:</h4>
          <span className="text-2xl font-bold text-violet-400">{funcFormatar.moeda(total)}</span>
        </div>

        {/* Lista */}
        <div className="mt-6 bg-slate-800 p-6 rounded-xl">
          <h4 className="text-lg mb-4 font-semibold">Itens cadastrados:</h4>
          {lista.length === 0 ? (
            <p className="text-center text-slate-400">Nenhum item cadastrado.</p>
          ) : (
            <ul className="space-y-4">
              {lista.map((c) => (
                <li key={c.id} className="bg-slate-700 p-4 rounded-md flex flex-col sm:flex-row justify-between items-center">
                  <div>
                    <span className="font-bold text-lg">{c.nome}</span>
                    <p className="text-sm text-slate-400">
                      {c.quantidade} un. — {funcFormatar.moeda(c.valor)}<br />
                      <span className="text-xs text-slate-500">Criado em: {funcFormatar.data(c.created_at)}</span>
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setForm({ id: c.id, nome: c.nome, quantidade: c.quantidade, valor: c.valor })} className="bg-blue-500 px-3 py-1 rounded-md hover:bg-blue-400">Editar</button>
                    <button onClick={() => setModal({ show: true, msg: "Confirmar exclusão?", action: () => excluirCompra(c.id) })} className="bg-red-500 px-3 py-1 rounded-md hover:bg-red-400">Excluir</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
          <div className="bg-slate-800 p-6 rounded-xl max-w-sm text-center">
            <p className="mb-4">{modal.msg}</p>
            {modal.action ? (
              <div className="flex justify-center gap-4">
                <button onClick={() => { modal.action(); setModal({ show: false, msg: "", action: null }); }} className="bg-green-500 px-4 py-2 rounded-md hover:bg-green-400">Confirmar</button>
                <button onClick={() => setModal({ show: false, msg: "", action: null })} className="bg-gray-500 px-4 py-2 rounded-md hover:bg-gray-400">Cancelar</button>
              </div>
            ) : (
              <button onClick={() => setModal({ show: false, msg: "", action: null })} className="bg-violet-600 px-4 py-2 rounded-md hover:bg-violet-500">OK</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
