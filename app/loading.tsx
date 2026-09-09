// app/loading.tsx

"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <motion.main
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <img src="/mascot.svg" className="w-32 md:w-40" />
      </motion.div>
    </motion.main>
  );
}