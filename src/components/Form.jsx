import { motion } from "framer-motion";
import { PlusCircle } from "lucide-react";
import { formatCurrencyInput } from "../utils/formatters";

export default function Form({ form, setForm, onSubmit, loading }) {
  const handleChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <form
        onSubmit={onSubmit}
        className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-sm p-6 rounded-2xl border border-slate-600/50 shadow-xl h-full"
      >
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-violet-400" />
          {form.id ? "Editar Item" : "Novo Item"}
        </h2>
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
          <div>
            <label htmlFor="valor" className="block text-slate-300 text-sm font-medium mb-2">
              Valor (R$)
            </label>
            <motion.input
              id="valor"
              type="text"
              value={form.valorExibicao || ""}
              onChange={(e) => {
                const { exibicao, numero } = formatCurrencyInput(e.target.value);
                setForm((f) => ({ ...f, valor: numero, valorExibicao: exibicao }));
              }}
              className="w-full bg-slate-700/80 border border-slate-600/50 p-3 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
              placeholder="R$ 0,00"
              whileFocus={{ scale: 1.02 }}
            />
          </div>
        </div>
        <div className="flex gap-3 md:mt-72">
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
            onClick={() => setForm({ id: null, nome: "", quantidade: 1, valor: 0, valorExibicao: "" })}
            className="px-6 py-3 bg-slate-600/80 hover:bg-slate-500/80 text-white font-semibold rounded-xl transition-all duration-200 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Limpar
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}