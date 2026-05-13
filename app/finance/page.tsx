"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { DashboardSidebar, SidebarProvider } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  Receipt,
  Download,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

const typeConfig: Record<string, { icon: any; color: string; sign: string; bg: string }> = {
  income: { icon: ArrowUpRight, color: "text-emerald-500", sign: "+", bg: "bg-emerald-500/10" },
  expense: { icon: ArrowDownLeft, color: "text-rose-500", sign: "-", bg: "bg-rose-500/10" },
  payout: { icon: ArrowDownLeft, color: "text-amber-500", sign: "-", bg: "bg-amber-500/10" },
  refund: { icon: ArrowDownLeft, color: "text-purple-500", sign: "-", bg: "bg-purple-500/10" },
};

export default function FinancePage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch("/api/transactions");
        const data = await res.json();
        if (data.transactions) setTransactions(data.transactions);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, []);

  const filtered = transactions.filter((t: any) => {
    const matchesType = filterType === "all" || t.type === filterType;
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const totalIncome = transactions
    .filter((t: any) => t.type === "income")
    .reduce((s: number, t: any) => s + t.amount, 0);
  const totalPayouts = transactions
    .filter((t: any) => t.type === "payout")
    .reduce((s: number, t: any) => s + t.amount, 0);
  const totalExpenses = transactions
    .filter((t: any) => t.type === "expense")
    .reduce((s: number, t: any) => s + t.amount, 0);
  const totalRefunds = transactions
    .filter((t: any) => t.type === "refund")
    .reduce((s: number, t: any) => s + t.amount, 0);
  const netProfit = totalIncome - totalPayouts - totalExpenses - totalRefunds;

  const kpis = [
    {
      title: "Total Revenue",
      value: totalIncome,
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/10",
    },
    {
      title: "Developer Payouts",
      value: totalPayouts,
      icon: ArrowDownLeft,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/10",
    },
    {
      title: "Net Profit",
      value: netProfit,
      icon: Wallet,
      color: netProfit >= 0 ? "text-emerald-500" : "text-rose-500",
      bg: netProfit >= 0 ? "bg-emerald-500/10" : "bg-rose-500/10",
      border: netProfit >= 0 ? "border-emerald-500/10" : "border-rose-500/10",
    },
    {
      title: "Transactions",
      value: transactions.length,
      icon: Receipt,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/10",
      noPrefix: true,
    },
  ];

  const handleExport = () => {
    const csvContent = [
      "Date,Type,Description,Amount,Status,Reference",
      ...transactions.map(
        (t: any) =>
          `${new Date(t.createdAt).toLocaleDateString()},${t.type},${t.description},${t.amount},${t.status},${t.reference}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `team-shogun-finance-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Exported to CSV");
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen mesh-bg text-white">
        <DashboardSidebar />
        <main className="flex-1 flex flex-col relative overflow-x-hidden min-w-0">
          <DashboardHeader />
          <div className="p-4 sm:p-6 lg:p-10 max-w-[1600px] mx-auto w-full space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Badge className="mb-3 bg-emerald-500/[0.08] text-emerald-400 border-emerald-500/20 font-black tracking-[0.2em] uppercase text-[9px]">
                Financial HQ
              </Badge>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.04em]">
                    Revenue Tracker
                  </h1>
                  <p className="text-white/30 mt-1 text-sm sm:text-base font-medium">
                    Full financial overview of Team Shogun operations
                  </p>
                </div>
                <Button
                  onClick={handleExport}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl px-6 w-full sm:w-auto"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </motion.div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {kpis.map((kpi, i) => (
                <motion.div
                  key={kpi.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Card
                    className={`bg-white/[0.02] border ${kpi.border} overflow-hidden group hover:bg-white/[0.04] transition-all`}
                  >
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-2 sm:p-2.5 rounded-xl ${kpi.bg}`}>
                          <kpi.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${kpi.color}`} />
                        </div>
                      </div>
                      <p className="text-[9px] uppercase tracking-[0.2em] font-black text-white/20 mb-1">
                        {kpi.title}
                      </p>
                      <p className={`text-xl sm:text-2xl font-black ${kpi.color} truncate`}>
                        {kpi.noPrefix
                          ? kpi.value
                          : `$${kpi.value.toLocaleString()}`}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Filter Bar */}
            <motion.div
              className="flex flex-col md:flex-row gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="relative flex-1 group">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15 group-focus-within:text-emerald-500 transition-colors" />
                <Input
                  placeholder="Search transactions..."
                  className="pl-11 bg-white/[0.03] border-white/[0.04] focus:border-emerald-500/40 rounded-xl h-11"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {["all", "income", "payout", "expense", "refund"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
                      filterType === type
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        : "text-white/20 hover:text-white/50 hover:bg-white/[0.03] border border-transparent"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Transactions Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-white/[0.02] overflow-hidden border border-white/[0.04]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-black">
                    Transaction History
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/[0.04] hover:bg-transparent h-12">
                          <TableHead className="pl-4 sm:pl-6 text-[9px] uppercase tracking-[0.2em] font-black text-white/20">
                            Description
                          </TableHead>
                          <TableHead className="text-[9px] uppercase tracking-[0.2em] font-black text-white/20">
                            Type
                          </TableHead>
                          <TableHead className="text-[9px] uppercase tracking-[0.2em] font-black text-white/20">
                            Amount
                          </TableHead>
                          <TableHead className="text-[9px] uppercase tracking-[0.2em] font-black text-white/20 hidden md:table-cell">
                            Status
                          </TableHead>
                          <TableHead className="text-[9px] uppercase tracking-[0.2em] font-black text-white/20 pr-4 sm:pr-6 hidden sm:table-cell">
                            Date
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading
                          ? Array.from({ length: 5 }).map((_, i) => (
                              <TableRow
                                key={i}
                                className="border-white/[0.03] animate-pulse"
                              >
                                <TableCell className="pl-4 sm:pl-6 py-4">
                                  <div className="h-4 w-32 sm:w-48 bg-white/5 rounded" />
                                </TableCell>
                                <TableCell>
                                  <div className="h-5 w-16 bg-white/5 rounded-full" />
                                </TableCell>
                                <TableCell>
                                  <div className="h-4 w-16 bg-white/5 rounded" />
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  <div className="h-5 w-20 bg-white/5 rounded-full" />
                                </TableCell>
                                <TableCell className="pr-4 sm:pr-6 hidden sm:table-cell">
                                  <div className="h-4 w-20 bg-white/5 rounded" />
                                </TableCell>
                              </TableRow>
                            ))
                          : filtered.length === 0
                          ? (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-16">
                                <Receipt className="w-10 h-10 text-white/10 mx-auto mb-3" />
                                <p className="text-white/20 font-bold">No transactions found.</p>
                              </TableCell>
                            </TableRow>
                          )
                          : filtered.map((txn: any) => {
                              const cfg = typeConfig[txn.type] || typeConfig.income;
                              const Icon = cfg.icon;
                              return (
                                <TableRow
                                  key={txn._id}
                                  className="border-white/[0.03] hover:bg-white/[0.02] transition-all group"
                                >
                                  <TableCell className="pl-4 sm:pl-6 py-4">
                                    <div className="flex items-center space-x-3">
                                      <div className={`p-2 rounded-xl ${cfg.bg} hidden sm:flex`}>
                                        <Icon
                                          className={`w-3.5 h-3.5 ${cfg.color}`}
                                        />
                                      </div>
                                      <div className="min-w-0">
                                        <p className="font-bold text-sm text-white/70 group-hover:text-emerald-500 transition-colors truncate">
                                          {txn.description}
                                        </p>
                                        <p className="text-[10px] text-white/15 font-bold uppercase tracking-widest">
                                          {txn.reference}
                                        </p>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant="outline"
                                      className={`${cfg.color} border-current/20 font-bold text-[10px] uppercase rounded-full`}
                                    >
                                      {txn.type}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <span
                                      className={`font-mono font-bold text-sm ${cfg.color}`}
                                    >
                                      {cfg.sign}${txn.amount.toLocaleString()}
                                    </span>
                                  </TableCell>
                                  <TableCell className="hidden md:table-cell">
                                    <Badge
                                      className={`${
                                        txn.status === "completed"
                                          ? "bg-emerald-500/10 text-emerald-500"
                                          : "bg-amber-500/10 text-amber-500"
                                      } border-none font-bold text-[10px] uppercase`}
                                    >
                                      {txn.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="pr-4 sm:pr-6 text-white/30 text-xs font-medium hidden sm:table-cell">
                                    {new Date(txn.createdAt).toLocaleDateString()}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
