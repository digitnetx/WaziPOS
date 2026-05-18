
"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Receipt } from '@/lib/types';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Printer, FileDown, Eye, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ThermalReceipt } from '@/components/receipt/ThermalReceipt';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const firestore = useFirestore();

  const historyQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'receipts'), orderBy('printedAt', 'desc'));
  }, [firestore]);

  const { data: history, loading } = useCollection<Receipt>(historyQuery);

  const filtered = (history || []).filter(r => 
    r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.controlNumber.includes(searchQuery) ||
    r.customerPhone.includes(searchQuery)
  );

  return (
    <div className="min-h-svh bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-headline font-bold">Transaction History</h1>
            <p className="text-muted-foreground">Comprehensive log of all issued government bills.</p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search name, phone or control number..." 
                className="pl-10 h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2">
              <FileDown className="w-4 h-4" />
              Export CSV
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
                  <TableHead>Control Number</TableHead>
                  <TableHead>Payer</TableHead>
                  <TableHead>Visitor Type</TableHead>
                  <TableHead>People</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date Issued</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length > 0 ? (
                  filtered.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-code font-bold text-primary">{r.controlNumber}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{r.customerName}</span>
                          <span className="text-xs text-muted-foreground">{r.customerPhone}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">{r.visitorType}</TableCell>
                      <TableCell>{r.numPeople}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(r.amount)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{r.printedAt}</TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="gap-1.5 h-8">
                              <Eye className="w-4 h-4" />
                              Preview
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-fit">
                            <DialogHeader>
                              <DialogTitle>Thermal Receipt Preview</DialogTitle>
                            </DialogHeader>
                            <div className="p-4 bg-muted/50 rounded-lg flex justify-center">
                              <ThermalReceipt receipt={r} />
                            </div>
                            <div className="flex gap-2 justify-end mt-4">
                              <Button variant="outline" className="gap-2" onClick={() => window.print()}>
                                <Printer className="w-4 h-4" />
                                Print
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-20 text-muted-foreground">
                      No matching receipts found in archives.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </div>
  );
}
