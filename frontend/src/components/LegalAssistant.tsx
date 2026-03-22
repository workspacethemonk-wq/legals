"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { FloatingCard } from "./FloatingCard";
import { Search, Shield, Gavel, FileText, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const LegalAssistant = () => {
  const {
    query,
    setQuery,
    response,
    setResponse,
    loading,
    setLoading,
    addToHistory,
  } = useStore();
  const [error, setError] = useState<string | null>(null);

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: query, language: "en" }),
      });

      if (!res.ok) throw new Error("Failed to fetch legal guidance");

      const data = await res.json();
      setResponse({
        answer: data.reply,
        model_used: data.metadata.model,
        verified: data.metadata.judge_verified,
        judge_feedback: data.metadata.feedback,
      });
      addToHistory(query, data.reply);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Search Input */}
      <FloatingCard className="p-2" floatIntensity={0.2}>
        <form onSubmit={handleQuery} className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 h-5 w-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything about Indian Law (BNS, BNSS, BSA)..."
              className="w-full bg-transparent border-none focus:ring-0 text-white pl-12 py-4 placeholder:text-white/20"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-accent-primary hover:bg-accent-primary/80 text-white px-8 py-3 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Consult"}
          </button>
        </form>
      </FloatingCard>

      {/* Error Message */}
      {error && (
        <div className="text-red-400 text-center text-sm bg-red-400/10 p-4 rounded-xl border border-red-400/20">
          {error}
        </div>
      )}

      {/* Response Display */}
      {response && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <FloatingCard
            floatIntensity={0.5}
            className="border-accent-primary/30"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-accent-success">
                <Shield className="h-5 w-5" />
                <span className="text-sm font-semibold uppercase tracking-wider">
                  Legal Guidance
                </span>
              </div>
              <div className="text-[10px] text-white/40 font-mono">
                MODEL: {response.model_used.toUpperCase()} | VERIFIED:{" "}
                {response.verified ? "YES" : "NO"}
              </div>
            </div>

            <div className="prose prose-invert max-w-none prose-p:my-2 prose-headings:my-4 prose-ul:my-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {response.answer
                  .replace(/\*\*(✅ DIRECT ANSWER|📖 LEGAL BASIS|🛠️ ACTIONABLE STEPS|⚠️ YOUR RIGHTS & CAUTIONS|❓ NEXT STEP)\*\*/g, "\n\n### $1\n\n")
                  .trim()}
              </ReactMarkdown>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <FileText className="h-3 w-3" /> BNSS/BNS/BSA
                </span>
                <span className="flex items-center gap-1">
                  <Gavel className="h-3 w-3" /> Sahayak Expert
                </span>
              </div>
              <p className="italic">
                AI guidance - Consult a lawyer for official matters.
              </p>
            </div>
          </FloatingCard>
        </motion.div>
      )}
    </div>
  );
};
