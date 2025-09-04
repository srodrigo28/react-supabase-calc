import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [nome, setNome] = useState("");
  const [lista, setLista] = useState([]);

  // Carregar do localStorage ao iniciar
  useEffect(() => {
    const dados = localStorage.getItem("pessoas");
    if (dados) {
      setLista(JSON.parse(dados));
    }
  }, []);

  // Atualizar localStorage sempre que lista mudar
  useEffect(() => {
    localStorage.setItem("pessoas", JSON.stringify(lista));
  }, [lista]);

  const handleInserir = (e) => {
    e.preventDefault();
    if (!nome.trim()) return;

    const novoItem = { id: Date.now(), nome };
    setLista([...lista, novoItem]);
    setNome("");
  };

  const handleExcluir = (id) => {
    setLista(lista.filter((item) => item.id !== id));
  };

  const handleEditar = (id) => {
    const novoNome = prompt("Digite o novo nome:");
    if (novoNome) {
      setLista(
        lista.map((item) =>
          item.id === id ? { ...item, nome: novoNome } : item
        )
      );
    }
  };

  return (
    <div className="flex flex-col items-center pt-10 h-screen bg-slate-900 text-white">
      <h1 className="text-3xl font-bold">CRUD com LocalStorage</h1>

      {/* Formulário */}
      <form onSubmit={handleInserir} className="flex gap-2 my-3">
        <input
          type="text"
          value={nome}
          placeholder="Digite um nome"
          className="bg-slate-800 px-3 text-white rounded-full"
          onChange={(e) => setNome(e.target.value)}
        />
        <button
          type="submit"
          className="bg-violet-700 px-5 py-2 rounded-full cursor-pointer"
        >
          Gravar
        </button>
      </form>

      {/* Lista */}
      <ul className="w-80">
        {lista.map((item) => (
          <li
            key={item.id}
            className="flex justify-between items-center bg-slate-800 px-3 py-2 my-2 rounded-lg"
          >
            <span>{item.nome}</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleEditar(item.id)}
                className="bg-blue-500 px-3 py-1 rounded-full text-sm"
              >
                Editar
              </button>
              <button
                onClick={() => handleExcluir(item.id)}
                className="bg-red-500 px-3 py-1 rounded-full text-sm"
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
