'use client';

import React from 'react';
import { motion } from 'motion/react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  AlertCircle, 
  FileText, 
  Eye, 
  CheckCircle2, 
  Clock,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

export interface AnalysisResult {
  category: string;
  urgency: 'Rendah' | 'Sedang' | 'Tinggi' | string;
  visualAnalysis: string;
  formalReportDraft: string;
}

interface ReportResultProps {
  result: AnalysisResult;
}

const getUrgencyConfig = (urgency: string) => {
  const u = urgency.toLowerCase();
  if (u.includes('tinggi')) {
    return {
      color: 'bg-red-500 hover:bg-red-600',
      icon: <AlertTriangle className="w-4 h-4 mr-1" />,
      label: 'Tinggi'
    };
  }
  if (u.includes('sedang')) {
    return {
      color: 'bg-amber-500 hover:bg-amber-600',
      icon: <Clock className="w-4 h-4 mr-1" />,
      label: 'Sedang'
    };
  }
  return {
    color: 'bg-emerald-500 hover:bg-emerald-600',
    icon: <CheckCircle2 className="w-4 h-4 mr-1" />,
    label: 'Rendah'
  };
};

export function ReportResult({ result }: ReportResultProps) {
  const urgencyConfig = getUrgencyConfig(result.urgency);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto"
      id="analysis-result-container"
    >
      <Card className="border-2 border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <CardHeader className="bg-slate-50 dark:bg-slate-900/50 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <AlertCircle className="text-blue-600" />
                Hasil Analisis Laporan
              </CardTitle>
              <CardDescription className="mt-1">
                Laporan otomatis dihasilkan oleh AI LaporVibe
              </CardDescription>
            </div>
            <Badge className={`${urgencyConfig.color} text-white px-3 py-1 flex items-center`}>
              {urgencyConfig.icon}
              {urgencyConfig.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Category Section */}
          <section>
            <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-slate-500 uppercase tracking-wider">
              <Badge variant="outline" className="rounded-sm px-1.5 py-0.5">Kategori</Badge>
            </div>
            <p className="text-lg font-medium text-slate-800 dark:text-slate-200">
              {result.category}
            </p>
          </section>

          <Separator className="bg-slate-100 dark:bg-slate-800" />

          {/* Visual Analysis Section */}
          <section>
            <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-slate-500 uppercase tracking-wider">
              <Eye className="w-4 h-4" />
              <span>Analisis Visual</span>
            </div>
            <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-800/30">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">
                &quot;{result.visualAnalysis}&quot;
              </p>
            </div>
          </section>

          {/* Formal Draft Section */}
          <section>
            <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-slate-500 uppercase tracking-wider">
              <FileText className="w-4 h-4" />
              <span>Draf Laporan Formal</span>
            </div>
            <div className="relative group">
              <pre className="whitespace-pre-wrap font-sans p-5 rounded-xl bg-slate-900 text-slate-100 text-sm leading-relaxed border border-slate-800 shadow-inner">
                {result.formalReportDraft}
              </pre>
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <Badge variant="secondary" className="cursor-pointer hover:bg-slate-700">Salin Draf</Badge>
              </div>
            </div>
          </section>
        </CardContent>

        <CardFooter className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 p-4">
          <div className="flex items-start gap-3 text-xs text-slate-500 dark:text-slate-400">
            <Lightbulb className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p>
              Gunakan draf di atas untuk mengirimkan laporan resmi melalui aplikasi pemda setempat atau media sosial terkait.
            </p>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
