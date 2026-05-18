
"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { ReceiptForm } from '@/components/receipt/ReceiptForm';
import { ThermalReceipt } from '@/components/receipt/ThermalReceipt';
import { Receipt } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, Download, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function NewReceiptPage() {
  const [currentReceipt, setCurrentReceipt] = useState<Receipt | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();

  const handleReceiptGenerated = async (receipt: Receipt) => {
    if (!firestore) return;
    
    setIsSubmitting(true);
    
    const receiptsRef = collection(firestore, 'receipts');
    
    // Initiate write to Firestore (optimistic by default in Firebase SDK)
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
      <div className="container mx-auto px-4 py-8">
        {!currentReceipt ? (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-3xl font-headline font-bold">New Bill & Receipt</h1>
            </div>
            <Card className="border-accent/20">
              <CardContent className="pt-6">
                <ReceiptForm onSubmit={handleReceiptGenerated} isSubmitting={isSubmitting} />
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <CheckCircle2 className="w-16 h-16 text-primary mx-auto" />
              <h1 className="text-3xl font-headline font-bold">Payment Order Issued</h1>
              <p className="text-muted-foreground">The government bill has been generated successfully.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Next Steps</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Ask the visitor to use the Control Number for payment through Bank or Mobile Money.
                    </p>
                    <div className="flex flex-col gap-3">
                      <Button onClick={handlePrint} className="gap-2 h-12 text-lg">
                        <Printer className="w-5 h-5" />
                        Print Thermal Receipt
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Download className="w-5 h-5" />
                        Download PDF Copy
                      </Button>
                      <Button variant="ghost" onClick={reset} className="gap-2 mt-4">
                        <ArrowLeft className="w-4 h-4" />
                        Create Another Bill
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4 flex flex-col items-center">
                <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Thermal Preview</h3>
                <div id="thermal-receipt-print-area">
                  <ThermalReceipt receipt={currentReceipt} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {!currentReceipt && (
        <div className="fixed bottom-0 left-0 right-0 p-4 md:hidden bg-background border-t z-50">
           <p className="text-[10px] text-center mb-2 opacity-50">Wazi POS - Standard Government POS Interface</p>
        </div>
      )}
    </div>
  );
}
