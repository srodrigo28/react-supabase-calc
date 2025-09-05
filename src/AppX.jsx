import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import Total from "./components/Total";
import Form from "./components/Form";
import List from "./components/List";
import Modal from "./components/Modal";
import { getPurchases, savePurchase, deletePurchase } from "./utils/api";
import { formatCurrency, formatDate } from "./utils/formatters";

export default function App() {
  const [form, setForm] = useState({ id: null, nome: "", quantidade: 1, valor: 0, valorExibicao: "" });
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ show: false, msg: "", action: null });

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const data = await getPurchases();
      setLista(data || []);
    } catch {
      setModal({ show: true, msg: "Erro ao listar compras." });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.nome.trim()) {
      setModal({ show: true, msg: "O campo Produto é obrigatório." });
      return;
    }
    if (!form.quantidade || form.quantidade <= 0) {
      setModal({ show: true, msg: "Informe uma quantidade válida (maior que zero)." });
      return;
    }
    if (!form.valor || form.valor <= 0) {
      setModal({ show: true, msg: "Informe um valor válido (maior que zero)." });
      return;
    }

    setLoading(true);
    try {
      await savePurchase(form);
      setModal({ show: true, msg: form.id ? "Compra atualizada com sucesso!" : "Compra gravada com sucesso!" });
      setForm({ id: null, nome: "", quantidade: 1, valor: 0, valorExibicao: "" });
      await fetchPurchases();
    } catch {
      setModal({ show: true, msg: "Erro ao salvar compra." });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deletePurchase(id);
      setModal({ show: true, msg: "Compra excluída com sucesso!" });
      await fetchPurchases();
    } catch {
      setModal({ show: true, msg: "Erro ao excluir compra." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const total = lista.reduce((acc, i) => acc + (i?.valor || 0) * (i?.quantidade || 0), 0);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen p-4 md:p-6">
      <div className="container mx-auto max-w-4xl">
        <Header />
        <Total total={total} />
        <div className="grid lg:grid-cols-2 gap-8">
          <Form
            form={form}
            setForm={setForm}
            onSubmit={handleSave}
            loading={loading}
          />
          <List
            lista={lista}
            setForm={setForm}
            setModal={setModal}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
          />
        </div>
        <AnimatePresence>
          {modal.show && (
            <Modal
              message={modal.msg}
              onConfirm={modal.action ? () => { modal.action(); setModal({ show: false, msg: "", action: null }); } : null}
              onClose={() => setModal({ show: false, msg: "", action: null })}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}