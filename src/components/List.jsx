import { motion, AnimatePresence } from "framer-motion";
import { Package, Pencil, Trash2 } from "lucide-react";

export default function PurchaseList({ lista, setForm, setModal, formatCurrency, formatDate }) {
  return (
    <motion.div
      className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-sm rounded-2xl 
      border border-slate-600/50 shadow-xl overflow-hidden"
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
       <div className="p-6 h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-violet-700 scrollbar-track-slate-800 scrollbar-thumb-rounded hover:scrollbar-thumb-violet-600 scroll-smooth">
        <style jsx>{`
          div::-webkit-scrollbar {
            width: 8px;
          }
          div::-webkit-scrollbar-track {
            background: #1e293b;
            border-radius: 8px;
          }
          div::-webkit-scrollbar-thumb {
            background: #6d28d9;
            border-radius: 8px;
            transition: background 0.2s ease;
            box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3);
          }
          div::-webkit-scrollbar-thumb:hover {
            background: #7c3aed;
          }
        `}</style>
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
                        <div className="text-emerald-400 font-semibold">{formatCurrency(c.valor)}</div>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{formatDate(c.created_at)}</div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <motion.button
                        onClick={() =>
                          setForm({
                            id: c.id,
                            nome: c.nome,
                            quantidade: c.quantidade,
                            valor: c.valor,
                            valorExibicao: formatCurrency(c.valor),
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
                            action: () => setModal((prev) => ({ ...prev, action: () => {} })), // Action will be handled in App
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
  );
}