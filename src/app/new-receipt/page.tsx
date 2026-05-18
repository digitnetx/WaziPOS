
"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { ReceiptForm } from '@/components/receipt/ReceiptForm';
import { ThermalReceipt } from '@/components/receipt/ThermalReceipt';
import { Receipt } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Printer, 
  Download, 
  ArrowLeft, 
  CheckCircle2, 
  Maximize2, 
  Minimize2,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

export default function NewReceiptPage() {
  const [currentReceipt, setCurrentReceipt] = useState<Receipt | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paperSize, setPaperSize] = useState<'58mm' | '80mm'>('58mm');
  const { toast } = useToast();
  const firestore = useFirestore();

  const handleReceiptGenerated = async (receipt: Receipt) => {
    if (!firestore) return;
    
    setIsSubmitting(true);
    const receiptsRef = collection(firestore, 'receipts');
    
    addDoc(receiptsRef, receipt)
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: receiptsRef.path,
          operation: 'create',
          requestResourceData: receipt,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
    
    setCurrentReceipt(receipt);
    setIsSubmitting(false);
    
    toast({
      title: "Receipt Generated",
      description: `Control Number: ${receipt.controlNumber} issued successfully.`,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const reset = () => {
    setCurrentReceipt(null);
  };

  return (
    <div className="min-h-svh bg-background pb-20">
      <Navbar />
      <div className="container mx-auto px-4 py-6 md:py-8">
        {!currentReceipt ? (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-headline font-bold">New Bill & Receipt</h1>
            </div>
            <Card className="border-accent/20">
              <CardContent className="pt-6">
                <ReceiptForm onSubmit={handleReceiptGenerated} isSubmitting={isSubmitting} />
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 md:w-16 md:h-16 text-primary mx-auto" />
              <h1 className="text-2xl md:text-3xl font-headline font-bold">Payment Order Issued</h1>
              <p className="text-sm md:text-base text-muted-foreground">The government bill has been generated successfully.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-6 space-y-6">
                <Card className="shadow-lg border-primary/10">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Actions & Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/10 space-y-3">
                       <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Control Number</span>
                          <span className="font-code font-bold text-primary">{currentReceipt.controlNumber}</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Total Amount</span>
                          <span className="font-bold text-primary">{new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS' }).format(currentReceipt.amount)}</span>
                       </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Instruction: Ask the visitor to use the Control Number above for payment through Bank (NMB/PBZ) or Mobile Money (T-Pesa/M-Pesa).
                      </p>
                      <div className="flex flex-col gap-3">
                        <Button onClick={handlePrint} className="gap-2 h-14 text-lg font-bold shadow-xl">
                          <Printer className="w-5 h-5" />
                          Print Receipt
                        </Button>
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" className="gap-2 h-11">
                            <Download className="w-4 h-4" />
                            PDF Copy
                          </Button>
                          <Button variant="ghost" onClick={reset} className="gap-2 h-11">
                            <ArrowLeft className="w-4 h-4" />
                            New Bill
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Thermal Preview</h3>
                  <Tabs value={paperSize} onValueChange={(v: any) => setPaperSize(v)}>
                    <TabsList className="h-8 bg-muted/50 p-1">
                      <TabsTrigger value="58mm" className="text-[10px] h-6 px-3">58mm</TabsTrigger>
                      <TabsTrigger value="80mm" className="text-[10px] h-6 px-3">80mm</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                <div className="relative bg-neutral-200 dark:bg-neutral-900 rounded-xl p-8 md:p-12 overflow-hidden flex justify-center border shadow-inner min-h-[500px]">
                  {/* Decorative background stripes to look like a surface */}
                  <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />
                  
                  <div id="thermal-receipt-print-area" className="relative z-10 transition-all duration-500 transform hover:scale-[1.02] cursor-default">
                    <ThermalReceipt 
                      receipt={currentReceipt} 
                      paperWidth={paperSize}
                      className="shadow-2xl ring-1 ring-black/5"
                    />
                    
                    {/* Thermal paper "teeth" effect at bottom */}
                    <div className="absolute -bottom-1 left-0 right-0 h-2 bg-neutral-200 dark:bg-neutral-900 overflow-hidden print:hidden">
                      <div className="flex w-full">
                        {Array.from({ length: 40 }).map((_, i) => (
                          <div key={i} className="w-2 h-2 rotate-45 bg-white -mt-1 shrink-0" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-[10px] text-center text-muted-foreground italic">
                  Preview represents actual thermal printer output. Colors are simulated for clarity.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
