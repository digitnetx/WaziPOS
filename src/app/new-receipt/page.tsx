
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
    
    // Save to Firestore
    addDoc(receiptsRef, receipt)
      .then(() => {
        setCurrentReceipt(receipt);
        setIsSubmitting(false);
        toast({
          title: "Bill Issued",
          description: `Control Number: ${receipt.controlNumber} saved successfully.`,
        });
      })
      .catch(async (error) => {
        setIsSubmitting(false);
        const permissionError = new FirestorePermissionError({
          path: receiptsRef.path,
          operation: 'create',
          requestResourceData: receipt,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const handlePrint = () => {
    window.print();
  };

  const reset = () => {
    setCurrentReceipt(null);
  };

  return (
    <div className="min-h-svh bg-background pb-10">
      <Navbar />
      <div className="container mx-auto px-4 py-4 md:py-8">
        {!currentReceipt ? (
          <div className="max-w-4xl mx-auto">
            <div className="mb-4 md:mb-6">
              <h1 className="text-xl md:text-3xl font-headline font-bold text-primary">Issue Government Bill</h1>
            </div>
            <Card className="border-accent/20">
              <CardContent className="p-4 md:p-6">
                <ReceiptForm onSubmit={handleReceiptGenerated} isSubmitting={isSubmitting} />
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 md:w-16 md:h-16 text-primary mx-auto" />
              <h1 className="text-xl md:text-3xl font-headline font-bold">Payment Order Ready</h1>
              <p className="text-xs md:text-base text-muted-foreground">The government bill has been generated and saved.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              <div className="lg:col-span-5 space-y-4 md:space-y-6">
                <Card className="shadow-lg border-primary/10">
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle className="text-base md:text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Bill Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0 space-y-6">
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/10 space-y-3">
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Control Number</span>
                          <span className="font-code font-bold text-primary text-sm md:text-base">{currentReceipt.controlNumber}</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Total Amount</span>
                          <span className="font-bold text-primary text-sm md:text-base">TZS {new Intl.NumberFormat('en-TZ').format(currentReceipt.amount)}</span>
                       </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-col gap-3">
                        <Button onClick={handlePrint} className="gap-2 h-12 md:h-14 text-base md:text-lg font-bold shadow-xl">
                          <Printer className="w-5 h-5" />
                          Print Receipt
                        </Button>
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" className="gap-2 h-10 md:h-11 text-xs md:text-sm">
                            <Download className="w-4 h-4" />
                            Download
                          </Button>
                          <Button variant="ghost" onClick={reset} className="gap-2 h-10 md:h-11 text-xs md:text-sm">
                            <ArrowLeft className="w-4 h-4" />
                            New Entry
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-muted-foreground">Printer Preview</h3>
                  <Tabs value={paperSize} onValueChange={(v: any) => setPaperSize(v)}>
                    <TabsList className="h-7 md:h-8 bg-muted/50 p-1">
                      <TabsTrigger value="58mm" className="text-[9px] md:text-[10px] h-5 md:h-6 px-2 md:px-3">58mm</TabsTrigger>
                      <TabsTrigger value="80mm" className="text-[9px] md:text-[10px] h-5 md:h-6 px-2 md:px-3">80mm</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                <div className="relative bg-neutral-100 dark:bg-neutral-900 rounded-xl p-4 md:p-12 overflow-hidden flex justify-center border shadow-inner min-h-[400px]">
                  <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />
                  
                  <div id="thermal-receipt-print-area" className="relative z-10 transition-all duration-500 scale-90 sm:scale-100 origin-top">
                    <ThermalReceipt 
                      receipt={currentReceipt} 
                      paperWidth={paperSize}
                      className="shadow-2xl ring-1 ring-black/5"
                    />
                    
                    <div className="absolute -bottom-1 left-0 right-0 h-2 bg-neutral-100 dark:bg-neutral-900 overflow-hidden print:hidden">
                      <div className="flex w-full">
                        {Array.from({ length: 40 }).map((_, i) => (
                          <div key={i} className="w-2 h-2 rotate-45 bg-white -mt-1 shrink-0" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
