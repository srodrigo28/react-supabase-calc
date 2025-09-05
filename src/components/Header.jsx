import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";

export default function Header() {
  return (
    <motion.div
      className="text-center mb-8"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex items-center justify-center gap-3 mb-8 md:mt-10">
        <motion.div
          className="p-3 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl shadow-lg"
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <ShoppingCart className="w-8 h-8 text-white" />
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-bold text-white">Calcular Compras</h1>
      </div>
    </motion.div>
  );
}