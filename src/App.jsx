"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { Pencil, Trash2, ShoppingCart, PlusCircle, Package, TrendingUp } from "lucide-react"

const API_URL = "https://dhtrvtytzxpjzpersuhc.supabase.co/rest/v1/compras_online"
const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRodHJ2dHl0enhwanpwZXJzdWhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1MTA5MjMsImV4cCI6MjA3MjA4NjkyM30.RhJqFO0MnZrFw7J0Obx2VWVLCYNTN60j29fT1u9hOhM"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

const funcFormatar = {
  moeda: (v) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(v || 0),
  data: (d) => (d ? new Intl.DateTimeFormat("pt-BR").format(new Date(d)) : ""),
}

// Função para tratar valor digitado (moeda)
const formatarMoedaInput = (valorDigitado) => {
  const somenteNumeros = valorDigitado.replace(/\D/g, "")
  let numero = Number.parseFloat(somenteNumeros) / 100
  if (isNaN(numero)) numero = 0

  return {
    exibicao: numero.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
    numero,
  }
}

export default function App() {
  const [form, setForm] = useState({ id: null, nome: "", quantidade: 1, valor: 0, valorExibicao: "" })
  const [lista, setLista] = useState([])
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState({ show: false, msg: "", action: null })

  // Atualiza campos do formulário
  const handleChange = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  // Limpa formulário
  const clearForm = () => setForm({ id: null, nome: "", quantidade: 1, valor: 0, valorExibicao: "" })

  // Busca lista de compras
  const buscarCompras = async () => {
    setLoading(true)
    try {
      const { data } = await api.get("", { params: { select: "*" } })
      setLista(data || [])
    } catch (e) {
      console.error(e)
      setModal({ show: true, msg: "Erro ao listar compras." })
    } finally {
      setLoading(false)
    }
  }

  // Salva (insert ou update)
  const salvarCompra = async (e) => {
    e.preventDefault()

    // 🔹 Validação antes de salvar
    if (!form.nome.trim()) {
      setModal({ show: true, msg: "O campo Produto é obrigatório.", action: null })
      return
    }
    if (!form.quantidade || form.quantidade <= 0) {
      setModal({ show: true, msg: "Informe uma quantidade válida (maior que zero).", action: null })
      return
    }
    if (!form.valor || form.valor <= 0) {
      setModal({ show: true, msg: "Informe um valor válido (maior que zero).", action: null })
      return
    }

    setLoading(true)
    try {
      const payload = { nome: form.nome, quantidade: form.quantidade, valor: form.valor }

      if (form.id) {
        await api.patch("", payload, { params: { id: `eq.${form.id}` } })
        setModal({ show: true, msg: "Compra atualizada com sucesso!" })
      } else {
        await api.post("", payload, { headers: { Prefer: "return=representation" } })
        setModal({ show: true, msg: "Compra gravada com sucesso!" })
      }

      clearForm()
      await buscarCompras()
    } catch (e) {
      console.error(e)
      setModal({ show: true, msg: "Erro ao salvar compra." })
    } finally {
      setLoading(false)
    }
  }

  // Excluir item
  const excluirCompra = async (id) => {
    setLoading(true)
    try {
      await api.delete("", { params: { id: `eq.${id}` } })
      await buscarCompras()
      setModal({ show: true, msg: "Compra excluída com sucesso!" })
    } catch (e) {
      console.error(e)
      setModal({ show: true, msg: "Erro ao excluir compra." })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    buscarCompras()
  }, [])

  const total = lista.reduce((acc, i) => acc + (i?.valor || 0) * (i?.quantidade || 0), 0)

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen p-4 md:p-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <div className="flex items-center justify-center gap-3 mb-3  md:mt-0">
            <motion.div
              className="p-3 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ShoppingCart className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Calcular Compras</h1>
          </div>

          <motion.div
            className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm p-6 
            rounded-2xl border border-slate-600/50 shadow-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
                <span className="text-lg font-semibold text-slate-300">Total Geral:</span>
              </div>
              <motion.span
                className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
                key={total}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {funcFormatar.moeda(total)}
              </motion.span>
            </div>
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <form
              onSubmit={salvarCompra}
              className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-sm p-6 
              rounded-2xl border border-slate-600/50 shadow-xl h-full"
            >
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-violet-400" />
                {form.id ? "Editar Item" : "Novo Item"}
              </h2>

              {/* Produto */}
              <div className="mb-6">
                <label htmlFor="nome" className="block text-slate-300 text-sm font-medium mb-2">
                  Produto
                </label>
                <motion.input
                  id="nome"
                  type="text"
                  value={form.nome}
                  onChange={(e) => handleChange("nome", e.target.value)}
                  className="w-full bg-slate-700/80 border border-slate-600/50 p-3 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                  placeholder="Digite o nome do produto..."
                  whileFocus={{ scale: 1.02 }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Quantidade */}
                <div>
                  <label htmlFor="quantidade" className="block text-slate-300 text-sm font-medium mb-2">
                    Quantidade
                  </label>
                  <motion.input
                    id="quantidade"
                    type="number"
                    min="1"
                    value={form.quantidade}
                    onChange={(e) => handleChange("quantidade", Number(e.target.value))}
                    className="w-full bg-slate-700/80 border border-slate-600/50 p-3 rounded-xl text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                    whileFocus={{ scale: 1.02 }}
                  />
                </div>

                {/* Valor */}
                <div>
                  <label htmlFor="valor" className="block text-slate-300 text-sm font-medium mb-2">
                    Valor (R$)
                  </label>
                  <motion.input
                    id="valor"
                    type="text"
                    value={form.valorExibicao || ""}
                    onChange={(e) => {
                      const { exibicao, numero } = formatarMoedaInput(e.target.value)
                      setForm((f) => ({ ...f, valor: numero, valorExibicao: exibicao }))
                    }}
                    className="w-full bg-slate-700/80 border border-slate-600/50 p-3 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                    placeholder="R$ 0,00"
                    whileFocus={{ scale: 1.02 }}
                  />
                </div>
              </div>

              <div className="flex gap-3 md:mt-40">
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r cursor-pointer from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <motion.div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full cursor-pointer"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    />
                  ) : (
                    <PlusCircle className="w-5 h-5" />
                  )}
                  {loading ? "Processando..." : form.id ? "Atualizar" : "Adicionar"}
                </motion.button>

                <motion.button
                  type="button"
                  onClick={clearForm}
                  className="px-6 py-3 bg-slate-600/80 hover:bg-slate-500/80 
                  text-white font-semibold rounded-xl transition-all duration-200 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Limpar
                </motion.button>
              </div>
            </form>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-sm rounded-2xl border border-slate-600/50 shadow-xl overflow-hidden"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="p-6 border-b border-slate-600/50">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-violet-400" />
                  Itens Cadastrados
                </h3>
                <motion.div
                  className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold"
                  key={lista.length}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {lista.length}
                </motion.div>
              </div>
            </div>

            <div className="p-6 max-h-full overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {lista.length === 0 ? (
                  <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Package className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                    <p className="text-slate-400">Nenhum item cadastrado ainda.</p>
                  </motion.div>
                ) : (
                  <div className="space-y-3">
                    {lista.map((c, index) => (
                      <motion.div
                        key={c.id}
                        className="bg-slate-700/50 border border-slate-600/30 p-4 rounded-xl hover:bg-slate-700/70 transition-all duration-200"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        layout
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-white mb-2">{c.nome}</h4>
                            <div className="flex items-center gap-4 text-sm text-slate-300">
                              <div className="flex items-center gap-2">
                                <motion.div
                                  className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                  whileHover={{ scale: 1.1 }}
                                >
                                  {c.quantidade}
                                </motion.div>
                                <span>unidades</span>
                              </div>
                              <div className="text-emerald-400 font-semibold">{funcFormatar.moeda(c.valor)}</div>
                            </div>
                            <div className="text-xs text-slate-500 mt-1">{funcFormatar.data(c.created_at)}</div>
                          </div>

                          <div className="flex gap-2 ml-4">
                            <motion.button
                              onClick={() =>
                                setForm({
                                  id: c.id,
                                  nome: c.nome,
                                  quantidade: c.quantidade,
                                  valor: c.valor,
                                  valorExibicao: funcFormatar.moeda(c.valor),
                                })
                              }
                              className="p-2 bg-blue-500/80 hover:bg-blue-500 text-white rounded-lg transition-all duration-200"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Pencil className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              onClick={() =>
                                setModal({
                                  show: true,
                                  msg: "Confirmar exclusão deste item?",
                                  action: () => excluirCompra(c.id),
                                })
                              }
                              className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-all duration-200"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {modal.show && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-gradient-to-br from-slate-800 to-slate-700 p-6 rounded-2xl max-w-md w-full text-center border border-slate-600/50 shadow-2xl"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <p className="text-white mb-6 text-lg">{modal.msg}</p>
              {modal.action ? (
                <div className="flex gap-3">
                  <motion.button
                    onClick={() => {
                      modal.action()
                      setModal({ show: false, msg: "", action: null })
                    }}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Confirmar
                  </motion.button>
                  <motion.button
                    onClick={() => setModal({ show: false, msg: "", action: null })}
                    className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancelar
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  onClick={() => setModal({ show: false, msg: "", action: null })}
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  OK
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
