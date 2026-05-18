
"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { Receipt, Stats } from '@/lib/types';
import { formatCurrency } from '@/app/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Filter, Download, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const firestore = useFirestore();

  const receiptsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'receipts'), orderBy('printedAt', 'desc'), limit(10));
  }, [firestore]);

  const { data: recentReceipts, loading } = useCollection<Receipt>(receiptsQuery);

  // For stats, we'd normally want a specific aggregation or a broader query
  // For this MVP, we'll calculate from the loaded data or assume it's today's data
  const stats: Stats = {
    totalRevenueToday: recentReceipts?.reduce((acc, curr) => acc + curr.amount, 0) || 0,
    totalReceiptsToday: recentReceipts?.length || 0,
    totalVisitorsToday: recentReceipts?.reduce((acc, curr) => acc + curr.numPeople, 0) || 0,
  };

  const filteredHistory = recentReceipts?.filter(r => 
    r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.controlNumber.includes(searchQuery)
  ) || [];

  return (
    <div className="min-h-svh bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold text-primary">Admin Control Center</h1>
            <p className="text-muted-foreground">Welcome back, Admin. Here is a summary of recent transactions.</p>
          </div>
          <Link href="/new-receipt">
            <Button className="gap-2 shadow-lg h-11 px-6">
              <Plus className="w-5 h-5" />
              New Receipt
            </Button>
          </Link>
        </div>

        <StatsOverview stats={stats} />

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <h2 className="text-xl font-headline font-semibold">Recent Transactions</h2>
            <div className="flex w-full sm:w-auto gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search Control # or Name..."
                  className="pl-9 h-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Card className="border-accent/20">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date / Time</TableHead>
                    <TableHead>Control Number</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.length > 0 ? (
                    filteredHistory.map((receipt) => (
                      <TableRow key={receipt.id}>
                        <TableCell className="font-medium">{receipt.printedAt}</TableCell>
                        <TableCell className="font-code text-primary font-bold">{receipt.controlNumber}</TableCell>
                        <TableCell>{receipt.customerName}</TableCell>
                        <TableCell>{formatCurrency(receipt.amount)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8">Details</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-muted-foreground italic">
                        No transactions found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
