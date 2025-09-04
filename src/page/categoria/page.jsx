"use client";

import { useEffect, useState } from "react";
import axios from "axios";


export default function CategoriaPage() {
    const [nome, setNome] = useState("");
    const [categoriaLista, setCategoriaLista] = useState<[]>([]);
    const [id, setId] = useState<number | null>(null);

    const API_URL="https://jyrimgynflxmtjhhkyrs.supabase.co/rest/v1/acad_categoria_treino";
    const API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5cmltZ3luZmx4bXRqaGhreXJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4ODYwNzIsImV4cCI6MjA1NTQ2MjA3Mn0.H_5D1uvr2cLHYxa-bvk8bpc-ya6IPTcoPKx2cONIa00";

    // 🔹 Gravar ou Editar
    const salvarCategoria = async (e) => {
        e.preventDefault();

        try {
            if (id) {
                // Atualizar categoria existente
                await axios.patch(
                    `${API_URL}?id=eq.${id}`,
                    { categoria_nome: nome },
                    {
                        headers: {
                            apikey: API_KEY,
                            Authorization: `Bearer ${API_KEY}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                setId(null);
            } else {
                // Criar nova categoria
                await axios.post(
                    API_URL,
                    { categoria_nome: nome },
                    {
                        headers: {
                            apikey: API_KEY,
                            Authorization: `Bearer ${API_KEY}`,
                            "Content-Type": "application/json",
                            Prefer: "return=representation",
                        },
                    }
                );
            }

            buscarCategorias();
            setNome("");
        } catch (error) {
            console.error("Erro ao salvar no Supabase:", error);
            alert("Erro ao salvar categoria.");
        }
    };

    // 🔹 Excluir
    const excluirCategoria = async (id) => {
        if (!confirm("Tem certeza que deseja excluir?")) return;

        try {
            await axios.delete(`${API_URL}?id=eq.${id}`, {
                headers: {
                    apikey: API_KEY,
                    Authorization: `Bearer ${API_KEY}`,
                },
            });
            buscarCategorias();
        } catch (error) {
            console.error("Erro ao excluir:", error);
            alert("Erro ao excluir categoria.");
        }
    };

    // 🔹 Listar
    const buscarCategorias = async () => {
        try {
            const { data } = await axios.get(`${API_URL}?select=*`, {
                headers: {
                    apikey: API_KEY,
                    Authorization: `Bearer ${API_KEY}`,
                },
            });
            setCategoriaLista(data);
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
        }
    };

    // 🔹 Carrega a lista
    useEffect(() => {
        buscarCategorias();
    }, []);

    return (
        <div className="bg-slate-900 min-h-screen p-6">
            
            <h3 className="text-white pt-5 text-3xl text-center mb-3">
                Confirmar Categoria
            </h3>

            {/* Adicionar ou Alterar  */}
            <form
                onSubmit={salvarCategoria}
                className="w-96 mx-auto bg-slate-600 p-5 rounded-xl"
            >
                <div className="flex flex-col">
                    <label htmlFor="nome" className="text-slate-400">
                        Nome
                    </label>
                    <input
                        id="nome"
                        type="text"
                        placeholder="Digite o nome da categoria"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="bg-slate-700 p-2 rounded-full px-3 text-white"
                    />
                </div>

                <button
                    type="submit"
                    className="p-2 bg-violet-700 rounded-md mt-3 text-white hover:bg-violet-600 cursor-pointer"
                >
                    {id ? "Atualizar" : "Gravar"}
                </button>
            </form>

            {/* Lista Listar / Excluir / Habilitar edição */}
            <div className="w-96 mx-auto mt-6 bg-slate-800 p-5 rounded-xl text-white">
                <h4 className="text-lg mb-3">Categorias cadastradas:</h4>
                {categoriaLista.length === 0 ? (
                    <p>Nenhuma categoria cadastrada ainda.</p>
                ) : (
                    <ul className="space-y-2">
                        {categoriaLista.map((categoria) => (
                            <li
                                key={categoria.id}
                                className="bg-slate-700 p-2 rounded-md flex justify-between items-center"
                            >
                                <span>{categoria.categoria_nome}</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setNome(categoria.categoria_nome);
                                            setId(categoria.id);
                                        }}
                                        className="bg-blue-500 px-2 py-1 rounded-md text-sm"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => excluirCategoria(categoria.id)}
                                        className="bg-red-500 px-2 py-1 rounded-md text-sm"
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
    );
}