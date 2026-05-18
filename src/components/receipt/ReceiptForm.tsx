
"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Loader2, Sparkles, Printer, Save, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Receipt, VisitorType, PaymentOption } from '@/lib/types';
import { generateControlNumber, generateTransactionId } from '@/app/lib/utils';
import { autoGenerateReceiptInstructions } from '@/ai/flows/auto-generate-receipt-instructions';

const formSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerPhone: z.string().min(10, "Valid phone number is required"),
  visitorType: z.enum(['International Tourist', 'Local Resident', 'School Group', 'EAC Resident']),
  numPeople: z.coerce.number().min(1, "At least 1 person"),
  amount: z.coerce.number().min(0, "Amount must be positive"),
  paymentOption: z.enum(['Exact', 'Partial']),
  posCenterName: z.string().min(2, "POS Center name is required"),
  notes: z.string(),
});

interface ReceiptFormProps {
  onSubmit: (receipt: Receipt) => void;
  isSubmitting?: boolean;
}

export const ReceiptForm: React.FC<ReceiptFormProps> = ({ onSubmit, isSubmitting }) => {
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [language, setLanguage] = useState<'English' | 'Swahili'>('English');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      visitorType: 'International Tourist',
      numPeople: 1,
      amount: 0,
      paymentOption: 'Exact',
      posCenterName: 'CHANGU BAWE MINERAL CONSERVATION AREA',
      notes: '',
    },
  });

  const visitorType = form.watch('visitorType');
  const posCenterName = form.watch('posCenterName');

  const handleGenerateInstructions = async () => {
    setIsGeneratingAI(true);
    try {
      const result = await autoGenerateReceiptInstructions({
        visitorType,
        posCenterName,
        language
      });
      form.setValue('notes', result.instructions);
    } catch (error) {
      console.error("AI Generation failed", error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    const now = new Date();
    const expiry = new Date(now);
    expiry.setDate(expiry.getDate() + 1); // Default 24h expiry

    const receipt: Receipt = {
      ...values,
      id: crypto.randomUUID(),
      billItem: `Entrance Fees per day/person (x${values.numPeople})`,
      controlNumber: generateControlNumber(),
      transactionId: generateTransactionId(),
      printedAt: format(now, 'yyyy-MM-dd HH:mm:ss'),
      expiryDate: format(expiry, 'yyyy-MM-dd HH:mm:ss'),
      printedBy: 'Admin Staff', // In a real app, this comes from auth
    };
    onSubmit(receipt);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payer Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Juma Kassim" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customerPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payer Phone</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 0777000000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="visitorType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Visitor Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select visitor type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="International Tourist">International Tourist</SelectItem>
                    <SelectItem value="Local Resident">Local Resident</SelectItem>
                    <SelectItem value="School Group">School Group</SelectItem>
                    <SelectItem value="EAC Resident">EAC Resident</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numPeople"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of People</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount (TZS)</FormLabel>
                <FormControl>
                  <Input type="number" step="100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentOption"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Option</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Exact">Exact</SelectItem>
                    <SelectItem value="Partial">Partial</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="posCenterName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>POS Center</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <FormLabel className="flex items-center gap-2">
              Instructions & Notes
              <Sparkles className="w-4 h-4 text-accent-foreground" />
            </FormLabel>
            <div className="flex gap-2">
              <Select 
                value={language} 
                onValueChange={(v: any) => setLanguage(v)}
              >
                <SelectTrigger className="w-[110px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Swahili">Swahili</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleGenerateInstructions}
                disabled={isGeneratingAI}
              >
                {isGeneratingAI ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Sparkles className="w-3 h-3 mr-1" />}
                Auto-generate
              </Button>
            </div>
          </div>
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea 
                    placeholder="Transaction details or additional instructions..." 
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-6">
          <Button type="submit" className="w-full gap-2 text-lg h-12" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                Generate Bill & Receipt
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
