"use client";

import React from "react";
import { motion } from "framer-motion";
import ScrollToTop from "@/components/landing/ScrollToTop";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      key="home-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
      <ScrollToTop />
    </motion.div>
  );
}
