'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  Upload, 
  X, 
  Search, 
  ArrowRight, 
  Loader2, 
  Info,
  ShieldCheck,
  Zap,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AnalysisResult, ReportResult } from '@/components/ReportResult';
import { Badge } from '@/components/ui/badge';

// Initialize Gemini API
const genAI = new GoogleGenAI({ 
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '' 
});

export default function LaporVibePage() {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  const analyzeImage = async () => {
    if (!image) return;

    setAnalyzing(true);
    setError(null);

    try {
      // Remove base64 prefix
      const base64Data = image.split(',')[1];
      
      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Data
              }
            },
            {
              text: `Analisis gambar fasilitas umum yang rusak ini. Berikan output dalam format JSON yang valid dengan skema berikut:
              {
                "category": "Kategori fasilitas (contoh: Jalan Raya, Penerangan, Saluran Air, Fasilitas Sosial, dll)",
                "urgency": "Tingkat urgensi (Rendah, Sedang, atau Tinggi)",
                "visualAnalysis": "Deskripsi singkat hasil pengamatan visual Anda terhadap kerusakan yang nampak.",
                "formalReportDraft": "Tuliskan draf laporan formal bahasa Indonesia yang sopan dan jelas ditujukan kepada instansi pemerintah terkait (seperti Dinas Pekerjaan Umum atau Pemda). Sertakan deskripsi kerusakan dan permintaan perbaikan segera."
              }`
            }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              urgency: { type: Type.STRING },
              visualAnalysis: { type: Type.STRING },
              formalReportDraft: { type: Type.STRING }
            },
            required: ["category", "urgency", "visualAnalysis", "formalReportDraft"]
          }
        }
      });

      const responseText = response.text;
      if (responseText) {
        const parsed = JSON.parse(responseText.trim());
        setResult(parsed);
      } else {
        throw new Error("Tidak ada respon dari AI.");
      }
    } catch (err: any) {
      console.error("Analysis Error:", err);
      setError("Gagal menganalisis gambar. Pastikan gambar jelas dan coba lagi.");
    } finally {
      setAnalyzing(false);
    }
  };

  const resetForm = () => {
    setImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans" id="laporvibe-app">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md border-slate-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Zap className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">LaporVibe</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Cara Kerja</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Daftar Laporan</a>
            <Button variant="outline" size="sm" className="rounded-full">Masuk</Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight"
          >
            Ubah Keluhan Menjadi <span className="text-blue-600">Perubahan Nyata.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed"
          >
            Ambil foto kerusakan fasilitas umum, biarkan AI kami menganalisisnya, 
            dan dapatkan draf laporan formal yang profesional dalam sekejap.
          </motion.p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Verifikasi AI</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span>Lokasi Akurat</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
              <Zap className="w-4 h-4 text-amber-500" fill="currentColor" />
              <span>Selesai Cepat</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
          {/* Upload Area */}
          <div className="space-y-6">
            <Card className="border-2 border-dashed border-slate-300 bg-white hover:border-blue-400 transition-colors overflow-hidden">
              <CardContent className="p-0">
                {!image ? (
                  <div 
                    {...getRootProps()} 
                    className="flex flex-col items-center justify-center p-12 cursor-pointer min-h-[300px]"
                    id="dropzone"
                  >
                    <input {...getInputProps()} />
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                      <Camera className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      {isDragActive ? 'Lepaskan Gambar Di Sini' : 'Ambil Foto atau Seret Gambar'}
                    </h3>
                    <p className="text-slate-500 text-sm text-center max-w-[200px]">
                      Pilih foto fasilitas umum yang rusak untuk dianalisis.
                    </p>
                  </div>
                ) : (
                  <div className="relative group">
                    <img 
                      src={image} 
                      alt="Preview" 
                      className="w-full h-auto max-h-[500px] object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <Button variant="secondary" onClick={resetForm} size="sm" className="rounded-full">
                        <X className="w-4 h-4 mr-2" />
                        Ganti Gambar
                      </Button>
                    </div>
                    <button 
                      onClick={resetForm} 
                      className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>

            <AnimatePresence>
              {image && !result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col gap-4"
                >
                  <Button 
                    onClick={analyzeImage} 
                    disabled={analyzing}
                    size="lg"
                    className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
                    id="analyze-button"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                        Menganalisis Laporan...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-3" />
                        Analisis Laporan AI
                        <ArrowRight className="w-5 h-5 ml-auto" />
                      </>
                    )}
                  </Button>
                  
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 items-start">
                    <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-700 leading-relaxed">
                      AI kami akan mendeteksi kategori kerusakan, tingkat urgensi, dan merumuskan draf laporan otomatis untuk mempermudah Anda.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>

          {/* Analysis Result */}
          <div className="lg:sticky lg:top-24">
            <AnimatePresence mode="wait">
              {result ? (
                <ReportResult result={result} key="result" />
              ) : !analyzing ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 rounded-3xl min-h-[400px] text-slate-400"
                >
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                    <Search className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Belum Ada Hasil</h3>
                  <p className="max-w-[280px]">
                    Unggah foto fasilitas rusak dan klik &quot;Analisis Laporan&quot; untuk melihat hasil di sini.
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center p-12 text-center space-y-4 min-h-[400px]"
                >
                  <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900">Menganalisis Visual...</h3>
                    <p className="text-slate-500 animate-pulse">Memproses detail foto dan menyiapkan draf laporan</p>
                  </div>
                  <div className="flex gap-2 text-xs font-mono text-slate-400">
                    <Badge variant="outline" className="bg-white">Detecting Damage</Badge>
                    <Badge variant="outline" className="bg-white">Assessing Urgency</Badge>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className="mt-20 border-t border-slate-200 py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">&copy; 2024 LaporVibe. Dibuat untuk warga Indonesia yang peduli lingkungan.</p>
        </div>
      </footer>
    </div>
  );
}
