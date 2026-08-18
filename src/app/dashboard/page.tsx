"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { Receipt, Stats } from '@/lib/types';
import { formatCurrency } from '@/app/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Filter, Download, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentReceipts, setRecentReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/api/receipts?limit=10', { cache: 'no-store' });
        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();
        setRecentReceipts(data.receipts || []);
      } catch (error) {
        console.error('Failed to load dashboard receipts:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const stats: Stats = useMemo(() => ({
    totalRevenueToday: recentReceipts.reduce((acc, curr) => acc + curr.amount, 0),
    totalReceiptsToday: recentReceipts.length,
    totalVisitorsToday: recentReceipts.reduce((acc, curr) => acc + curr.numPeople, 0),
  }), [recentReceipts]);

  const filteredHistory = recentReceipts.filter(r =>
    r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.controlNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-svh bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1"><h1 className="text-2xl md:text-3xl font-headline font-bold text-primary">Admin Control Center</h1><p className="text-sm md:text-base text-muted-foreground">Welcome back, Admin. Summary of recent transactions.</p></div>
          <Link href="/new-receipt" className="w-full md:w-auto"><Button className="w-full md:w-auto gap-2 shadow-lg h-11 px-6"><Plus className="w-5 h-5" />New Receipt</Button></Link>
        </div>

        <StatsOverview stats={stats} />

        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            <h2 className="text-xl font-headline font-semibold">Recent Transactions</h2>
            <div className="flex flex-wrap w-full lg:w-auto gap-2">
              <div className="relative flex-1 min-w-[200px] lg:w-80"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search Control # or Name..." className="pl-9 h-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
              <div className="flex gap-2"><Button variant="outline" size="icon" className="shrink-0"><Filter className="h-4 w-4" /></Button><Button variant="outline" size="icon" className="shrink-0"><Download className="h-4 w-4" /></Button></div>
            </div>
          </div>

          <Card className="border-accent/20 overflow-hidden">
            {loading ? <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary/40" /></div> : <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Date / Time</TableHead><TableHead>Control Number</TableHead><TableHead>Customer</TableHead><TableHead>Amount</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>
              {filteredHistory.length > 0 ? filteredHistory.map((receipt) => <TableRow key={receipt.id}><TableCell className="font-medium text-xs md:text-sm whitespace-nowrap">{receipt.printedAt}</TableCell><TableCell className="font-code text-primary font-bold text-xs md:text-sm whitespace-nowrap">{receipt.controlNumber}</TableCell><TableCell className="text-xs md:text-sm whitespace-nowrap">{receipt.customerName}</TableCell><TableCell className="text-xs md:text-sm whitespace-nowrap">{formatCurrency(receipt.amount)}</TableCell><TableCell className="text-right whitespace-nowrap"><Button variant="ghost" size="sm" className="h-8">Details</Button></TableCell></TableRow>) : <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground italic">No transactions found.</TableCell></TableRow>}
            </TableBody></Table></div>}
          </Card>
        </div>
      </div>
    </div>
  );
}
