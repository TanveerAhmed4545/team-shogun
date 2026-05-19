"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, RefreshCw, X, ArrowRight, User as UserIcon, LayoutDashboard, Briefcase, Trophy, Users, Bell, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<{projects: any[], users: any[], navigation: any[]}>({projects: [], users: [], navigation: []});
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Keyboard Shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Auto-focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSearchQuery("");
      setResults({projects: [], users: [], navigation: []});
    }
  }, [open]);

  // Debounced Search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults({projects: [], users: [], navigation: []});
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const json = await res.json();
        if (json.success) {
          setResults(json.data);
        }
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const navigateTo = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  const hasResults = results.projects.length > 0 || results.users.length > 0 || results.navigation.length > 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-2xl bg-card/95 backdrop-blur-2xl border border-border/10 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col"
            >
              {/* Search Header */}
              <div className="flex items-center px-4 py-3 border-b border-border/10">
                <Search className="w-5 h-5 text-muted-foreground/40 mr-3 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search projects, members, or navigate..."
                  className="flex-1 bg-transparent border-none text-foreground text-lg placeholder:text-muted-foreground/20 focus:outline-none focus:ring-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searching && <RefreshCw className="w-4 h-4 text-primary animate-spin ml-3 shrink-0" />}
                <Badge className="ml-3 hidden sm:flex bg-accent/5 text-muted-foreground/30 hover:bg-accent/5 border-border/10 text-[10px] font-mono px-1.5 h-6">
                  ESC
                </Badge>
              </div>

              {/* Results Area */}
              <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-thin">
                {!searchQuery.trim() ? (
                  <div className="p-12 flex flex-col items-center justify-center text-center">
                    <Search className="w-10 h-10 text-muted-foreground/10 mb-4" />
                    <p className="text-muted-foreground/40 font-bold">What are you looking for?</p>
                    <p className="text-muted-foreground/20 text-sm mt-1">Start typing to search across the entire workspace.</p>
                  </div>
                ) : !hasResults && !searching ? (
                  <div className="p-12 flex flex-col items-center justify-center text-center">
                    <p className="text-muted-foreground/40 font-bold">No results found for "{searchQuery}"</p>
                  </div>
                ) : (
                  <div className="space-y-4 p-2">
                    {/* Navigation */}
                    {results.navigation.length > 0 && (
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/20 mb-2 px-2">Navigation</p>
                        {results.navigation.map((item: any) => (
                          <button
                            key={item.link}
                            onClick={() => navigateTo(item.link)}
                            className="w-full flex items-center justify-between p-3 hover:bg-accent/5 rounded-xl transition-colors group text-left"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-accent/5 flex items-center justify-center text-muted-foreground/40 group-hover:text-foreground transition-colors">
                                <ArrowRight className="w-4 h-4" />
                              </div>
                              <span className="font-bold text-foreground/80 group-hover:text-foreground">{item.title}</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground/10 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Projects */}
                    {results.projects.length > 0 && (
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/20 mb-2 px-2">Projects</p>
                        {results.projects.map((project: any) => (
                          <button
                            key={project.orderId}
                            onClick={() => navigateTo(`/projects`)}
                            className="w-full flex items-center justify-between p-3 hover:bg-accent/5 rounded-xl transition-colors group text-left"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <Briefcase className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-foreground/90 truncate">{project.clientName}</p>
                                <p className="text-[10px] text-muted-foreground/40 uppercase tracking-widest">{project.orderId}</p>
                              </div>
                            </div>
                            <Badge className="bg-accent/5 border-border/10 text-muted-foreground/60 hover:bg-accent/5">
                              {project.orderStatus}
                            </Badge>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Team */}
                    {results.users.length > 0 && (
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/20 mb-2 px-2">Team</p>
                        {results.users.map((user: any) => (
                          <button
                            key={user._id}
                            onClick={() => navigateTo(`/team`)}
                            className="w-full flex items-center justify-between p-3 hover:bg-accent/5 rounded-xl transition-colors group text-left"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <UserIcon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-foreground/90 truncate">{user.name}</p>
                                <p className="text-[10px] text-muted-foreground/40 uppercase tracking-widest">{user.role}</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="px-4 py-3 border-t border-border/10 flex items-center justify-between bg-accent/5">
                <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground/30 uppercase tracking-wider">
                  <span className="flex items-center gap-1"><Badge className="bg-accent/5 border-border/10 text-muted-foreground/40 px-1 py-0 h-5">↑</Badge><Badge className="bg-accent/5 border-border/10 text-muted-foreground/40 px-1 py-0 h-5">↓</Badge> Navigate</span>
                  <span className="flex items-center gap-1"><Badge className="bg-accent/5 border-border/10 text-muted-foreground/40 px-1 py-0 h-5">↵</Badge> Select</span>
                </div>
                <div className="text-[9px] font-black text-muted-foreground/20 uppercase tracking-[0.2em]">
                  Team Shogun
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
