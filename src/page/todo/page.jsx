import { useState, useEffect, useMemo } from "react";
// Adicionamos Circle e CheckCircle para o botão de concluir
import { Plus, Trash2, Edit, X, Check, Circle, CheckCircle } from "lucide-react";

function App() {
  const [nome, setNome] = useState("");
  const [lista, setLista] = useState([]);
  
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // Carrega a lista do localStorage ao iniciar
  useEffect(() => {
    const dados = localStorage.getItem("pessoas");
    if (dados) {
      setLista(JSON.parse(dados));
    }
  }, []);

  // Salva a lista no localStorage sempre que ela muda
  useEffect(() => {
    localStorage.setItem("pessoas", JSON.stringify(lista));
  }, [lista]);

  const handleInserir = (e) => {
    e.preventDefault();
    if (!nome.trim()) return;

    // Agora cada novo item já nasce com o estado 'concluido: false'
    const novoItem = { id: Date.now(), nome: nome.trim(), concluido: false };
    setLista([novoItem, ...lista]); // Adiciona no início da lista
    setNome("");
  };

  const handleExcluir = (id) => {
    setLista(lista.filter((item) => item.id !== id));
  };
  
  // --- NOVA FUNÇÃO ---
  // Alterna o estado 'concluido' de um item
  const handleToggleConcluido = (id) => {
    setLista(
      lista.map((item) =>
        item.id === id ? { ...item, concluido: !item.concluido } : item
      )
    );
  };

  const handleEditar = (item) => {
    setEditingId(item.id);
    setEditingText(item.nome);
  };

  const handleCancelarEdicao = () => {
    setEditingId(null);
    setEditingText("");
  };

  const handleSalvarEdicao = (id) => {
    if (!editingText.trim()) return;

    setLista(
      lista.map((item) =>
        item.id === id ? { ...item, nome: editingText.trim() } : item
      )
    );
    setEditingId(null);
    setEditingText("");
  };

  // --- BÔNUS: REORDENAÇÃO AUTOMÁTICA ---
  // Usamos useMemo para otimizar. A lista só é reordenada se 'lista' mudar.
  const listaOrdenada = useMemo(() => {
    const concluidos = lista.filter(item => item.concluido);
    const naoConcluidos = lista.filter(item => !item.concluido);
    return [...naoConcluidos, ...concluidos];
  }, [lista]);

  return (
    <div className="min-h-screen px-3 bg-slate-900 text-white flex flex-col items-center pt-10 font-sans">
      <h1 className="mx-auto text-3xl text-violet-600 font-semibold shadow-2xs text-center mb-7">Treina DEV  ✨ </h1>
      <div className="w-full max-w-lg p-6 bg-slate-800 rounded-xl shadow-lg">
        
        <h1 className="text-3xl font-bold text-center mb-6 text-violet-400">
          Lista de Tarefas
        </h1>

        <form onSubmit={handleInserir} className="flex gap-2 mb-6">
          <input
            type="text"
            value={nome}
            placeholder="Digite uma nova tarefa"
            className="flex-grow bg-slate-700 px-4 py-2 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-300"
            onChange={(e) => setNome(e.target.value)}
          />
          <button
            type="submit"
            className="bg-violet-600 p-2 rounded-lg hover:bg-violet-700 transition-colors duration-300 flex items-center justify-center disabled:bg-slate-600 disabled:cursor-not-allowed"
            disabled={!nome.trim()}
          >
            <Plus size={20} />
          </button>
        </form>

        {/* Usamos a 'listaOrdenada' para renderizar */}
        <ul className="space-y-3">
          {listaOrdenada.map((item) => (
            <li
              key={item.id}
              // Adiciona classes condicionalmente para o item concluído
              className={`flex justify-between items-center bg-slate-700 p-3 rounded-lg group transition-colors duration-300 ${
                item.concluido ? 'bg-slate-800/50' : ''
              }`}
            >
              {editingId === item.id ? (
                // --- MODO DE EDIÇÃO ---
                <div className="flex w-full items-center gap-2">
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="flex-grow bg-slate-600 px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    autoFocus
                  />
                  <button onClick={() => handleSalvarEdicao(item.id)} className="p-1 text-green-400 hover:text-green-300">
                    <Check size={18} />
                  </button>
                  <button onClick={handleCancelarEdicao} className="p-1 text-red-400 hover:text-red-300">
                    <X size={18} />
                  </button>
                </div>
              ) : (
                // --- MODO DE VISUALIZAÇÃO ---
                <>
                  <div className="flex items-center gap-3">
                    {/* Botão para Marcar como Concluído */}
                    <button onClick={() => handleToggleConcluido(item.id)} className="p-1">
                      {item.concluido ? <CheckCircle size={20} className="text-green-400" /> : <Circle size={20} className="text-slate-500 group-hover:text-slate-300"/>}
                    </button>
                    {/* Estilo condicional para o texto */}
                    <span className={`transition-colors duration-300 ${
                      item.concluido ? 'line-through text-slate-500' : 'text-lg'
                    }`}>
                      {item.nome}
                    </span>
                  </div>

                  {/* Esconde botões de ação se a tarefa estiver concluída */}
                  {!item.concluido && (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button onClick={() => handleEditar(item)} className="p-1 text-blue-400 hover:text-blue-300">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleExcluir(item.id)} className="p-1 text-red-400 hover:text-red-300">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>

        {lista.length === 0 && (
            <p className="text-center text-slate-500 mt-6">
                Nenhuma tarefa na lista. Adicione uma!
            </p>
        )}
      </div>
    </div>
  );
}

export default App;