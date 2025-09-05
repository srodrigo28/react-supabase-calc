import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { formatCurrency } from "../utils/formatters";

export default function Total({ total }) {
  return (
    <motion.div
      className="bg-gradient-to-r mb-4 from-slate-800/80 to-slate-700/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-600/50 shadow-xl"
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
          {formatCurrency(total)}
        </motion.span>
      </div>
    </motion.div>
  );
}