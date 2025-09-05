import { useEffect, useState } from "react";
import axios from "axios";

// 💡 Nota: Este arquivo utiliza classes do Tailwind CSS para estilização.
// A inclusão do script do Tailwind é feita automaticamente no ambiente de execução.

function AppB() {
  const [nome, setNome] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [valor, setValor] = useState(0);
  const [lista, setLista] = useState([]);
  const [id, setId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalAction, setModalAction] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = "https://dhtrvtytzxpjzpersuhc.supabase.co/rest/v1/compras_online";
  const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRodHJ2dHl0enhwanpwZXJzdWhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1MTA5MjMsImV4cCI6MjA3MjA4NjkyM30.RhJqFO0MnZrFw7J0Obx2VWVLCYNTN60j29fT1u9hOhM";

  // Formata o valor para a moeda brasileira
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Formata a data para o padrão brasileiro
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  };

  const clearForm = () => {
    setNome("");
    setQuantidade(1);
    setValor(0);
    setId(null);
  };

  // 🔹 Gravar ou Editar
  const salvarCompra = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        // Atualizar compra existente
        await axios.patch(
          `${API_URL}?id=eq.${id}`,
          { nome, quantidade, valor },
          {
            headers: {
              apikey: API_KEY,
              Authorization: `Bearer ${API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );
        clearForm();
        setModalMessage("Compra atualizada com sucesso!");
        setShowModal(true);
      } else {
        // Criar nova compra
        await axios.post(
          API_URL,
          { nome, quantidade, valor },
          {
            headers: {
              apikey: API_KEY,
              Authorization: `Bearer ${API_KEY}`,
              "Content-Type": "application/json",
              Prefer: "return=representation",
            },
          }
        );
        clearForm();
        setModalMessage("Compra gravada com sucesso!");
        setShowModal(true);
      }

      buscarCompras();
    } catch (error) {
      console.error("Erro ao salvar no Supabase:", error);
      setModalMessage("Erro ao salvar compra.");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Excluir
  const handleExcluirCompra = (id) => {
    setModalMessage("Tem certeza que deseja excluir esta compra?");
    setModalAction(() => () => excluirCompra(id));
    setShowModal(true);
  };

  const excluirCompra = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}?id=eq.${id}`, {
        headers: {
          apikey: API_KEY,
          Authorization: `Bearer ${API_KEY}`,
        },
      });
      buscarCompras();
      setModalMessage("Compra excluída com sucesso!");
      setShowModal(true);
    } catch (error) {
      console.error("Erro ao excluir:", error);
      setModalMessage("Erro ao excluir compra.");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Listar
  const buscarCompras = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}?select=*`, {
        headers: {
          apikey: API_KEY,
          Authorization: `Bearer ${API_KEY}`,
        },
      });
      setLista(data);
    } catch (error) {
      console.error("Erro ao buscar compras:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Carrega a lista
  useEffect(() => {
    buscarCompras();
  }, []);
  
  // Calcula o total
  const total = lista.reduce((acc, currentItem) => acc + (currentItem.valor * currentItem.quantidade), 0);

  return (
    <div className="bg-slate-900 min-h-screen p-6 font-sans antialiased text-white">
      <script src="https://cdn.tailwindcss.com"></script>
      <div className="container mx-auto max-w-lg p-4">
        <h3 className="text-white pt-5 text-3xl text-center mb-6 font-bold">
          Compras Online
        </h3>

        {/* Formulário */}
        <form
          onSubmit={salvarCompra}
          className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700"
        >
          <div className="flex flex-col mb-4">
            <label htmlFor="nome" className="text-slate-300 text-sm font-medium mb-1">
              Produto
            </label>
            <input
              id="nome"
              type="text"
              placeholder="Digite o nome do produto"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="bg-slate-700 p-3 rounded-md px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
              required
            />
          </div>

          <div className="flex flex-col mb-4">
            <label htmlFor="quantidade" className="text-slate-300 text-sm font-medium mb-1">
              Quantidade
            </label>
            <input
              id="quantidade"
              type="number"
              min="1"
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              className="bg-slate-700 p-3 rounded-md px-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
              required
            />
          </div>

          <div className="flex flex-col mb-4">
            <label htmlFor="valor" className="text-slate-300 text-sm font-medium mb-1">
              Valor (R$)
            </label>
            <input
              id="valor"
              type="number"
              step="0.01"
              value={valor}
              onChange={(e) => setValor(Number(e.target.value))}
              className="bg-slate-700 p-3 rounded-md px-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="p-3 bg-violet-600 rounded-md mt-2 text-white font-semibold hover:bg-violet-500 cursor-pointer w-full transition"
              disabled={loading}
            >
              {loading ? "Processando..." : (id ? "Atualizar" : "Gravar")}
            </button>
            <button
              type="button"
              onClick={clearForm}
              className="p-3 bg-slate-600 rounded-md mt-2 text-white font-semibold hover:bg-slate-500 cursor-pointer w-full transition"
            >
              Limpar
            </button>
          </div>
        </form>
        
        {/* Visor do Total */}
        <div className="mt-6 bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 flex justify-between items-center">
            <h4 className="text-lg font-semibold">Total Geral:</h4>
            <span className="text-2xl font-bold text-violet-400">{formatCurrency(total)}</span>
        </div>

        {/* Lista */}
        <div className="mt-6 bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
          <h4 className="text-lg mb-4 font-semibold">Itens cadastrados:</h4>
          {lista.length === 0 ? (
            <p className="text-center text-slate-400">Nenhum item cadastrado ainda.</p>
          ) : (
            <ul className="space-y-4">
              {lista.map((compra) => (
                <li
                  key={compra.id}
                  className="bg-slate-700 p-4 rounded-md flex flex-col sm:flex-row justify-between items-center transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <div className="text-center sm:text-left mb-2 sm:mb-0">
                    <span className="font-bold text-lg text-white block">{compra.nome}</span>
                    <p className="text-sm text-slate-400">
                      {compra.quantidade} un. - {formatCurrency(compra.valor)}
                      <br/>
                      <span className="text-xs text-slate-500">
                        Criado em: {formatDate(compra.created_at)}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setNome(compra.nome);
                        setQuantidade(compra.quantidade);
                        setValor(compra.valor);
                        setId(compra.id);
                      }}
                      className="bg-blue-500 px-3 py-1 rounded-md text-sm text-white font-semibold hover:bg-blue-400 transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleExcluirCompra(compra.id)}
                      className="bg-red-500 px-3 py-1 rounded-md text-sm text-white font-semibold hover:bg-red-400 transition"
                    >
                      Excluir
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-slate-800 p-6 rounded-xl shadow-xl border border-slate-700 max-w-sm w-full text-center">
            <p className="mb-4 text-white">{modalMessage}</p>
            {modalAction ? (
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    modalAction();
                    setShowModal(false);
                    setModalAction(null);
                  }}
                  className="bg-green-500 px-4 py-2 rounded-md text-white font-semibold hover:bg-green-400 transition"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setModalAction(null);
                  }}
                  className="bg-gray-500 px-4 py-2 rounded-md text-white font-semibold hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowModal(false)}
                className="bg-violet-600 px-4 py-2 rounded-md text-white font-semibold hover:bg-violet-500 transition"
              >
                OK
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AppB;
