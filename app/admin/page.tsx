'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  BarChart3, 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut,
  ChevronRight,
  Eye,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MapPin
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Report } from '@/lib/db/schema';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/reports');
      const data = await res.json();
      if (Array.isArray(data)) {
        setReports(data);
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const getUrgencyBadge = (urgency: string) => {
    const u = urgency.toLowerCase();
    if (u.includes('tinggi')) return <Badge variant="destructive">Tinggi</Badge>;
    if (u.includes('sedang')) return <Badge className="bg-amber-500 hover:bg-amber-600">Sedang</Badge>;
    return <Badge className="bg-emerald-500 hover:bg-emerald-600">Rendah</Badge>;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return <Badge className="bg-blue-500">Selesai</Badge>;
      case 'in-progress':
        return <Badge className="bg-amber-500">Diproses</Badge>;
      default:
        return <Badge variant="outline">Menunggu</Badge>;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">AdminVibe</span>
          </div>
          
          <nav className="space-y-1">
            <SidebarItem icon={<BarChart3 className="w-4 h-4" />} label="Ringkasan" active />
            <SidebarItem icon={<Users className="w-4 h-4" />} label="Laporan Warga" />
            <SidebarItem icon={<Settings className="w-4 h-4" />} label="Pengaturan" />
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-slate-200 dark:border-slate-800">
          <SidebarItem icon={<LogOut className="w-4 h-4" />} label="Keluar" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-lg font-semibold">Dashboard Laporan</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">Admin: diaztmuhammad</span>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">D</div>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard label="Total Laporan" value={reports.length} icon={<Eye className="text-blue-600" />} />
            <StatsCard label="Menunggu" value={reports.filter(r => r.status === 'pending').length} icon={<Clock className="text-amber-500" />} />
            <StatsCard label="Terselesaikan" value={reports.filter(r => r.status === 'resolved').length} icon={<CheckCircle2 className="text-emerald-500" />} />
          </div>

          <Card className="shadow-sm border-slate-200 dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Daftar Laporan Terbaru</CardTitle>
              <Button variant="outline" size="sm" onClick={fetchReports}>Refresh</Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : reports.length === 0 ? (
                <div className="text-center py-12 text-slate-500">Belum ada laporan yang masuk.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Foto</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Urgensi</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          <div className="w-12 h-12 rounded-md overflow-hidden bg-slate-100 border border-slate-200 relative">
                            {report.imageUrl.startsWith('data:') ? (
                              <img src={report.imageUrl} alt="Damage" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <Image 
                                src={report.imageUrl} 
                                alt="Damage" 
                                fill 
                                className="object-cover" 
                                referrerPolicy="no-referrer"
                              />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-slate-700 dark:text-slate-300">
                          {report.category}
                        </TableCell>
                        <TableCell>
                          {getUrgencyBadge(report.urgency)}
                        </TableCell>
                        <TableCell className="text-slate-500 text-sm">
                          {report.createdAt ? format(new Date(report.createdAt), 'dd MMM yyyy') : '-'}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(report.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-3">
                              Detail <ChevronRight className="w-4 h-4 ml-1" />
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  Detail Laporan
                                  {getUrgencyBadge(report.urgency)}
                                </DialogTitle>
                                <DialogDescription>
                                  Dilaporkan pada {report.createdAt && format(new Date(report.createdAt), 'PPP p')}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                <div className="space-y-4">
                                  <div className="relative w-full aspect-video rounded-xl border border-slate-200 overflow-hidden">
                                    {report.imageUrl.startsWith('data:') ? (
                                      <img 
                                        src={report.imageUrl} 
                                        alt="Full scale" 
                                        className="w-full h-full object-cover"
                                        referrerPolicy="no-referrer"
                                      />
                                    ) : (
                                      <Image 
                                        src={report.imageUrl} 
                                        alt="Full scale" 
                                        fill
                                        className="object-cover"
                                        referrerPolicy="no-referrer"
                                      />
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <MapPin className="w-4 h-4" />
                                    <span>Lokasi Otomatis (GPS metadata)</span>
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Analisis Visual</h4>
                                    <p className="text-slate-700 italic border-l-4 border-blue-200 pl-4">
                                      &quot;{report.analysisText}&quot;
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Draf Laporan</h4>
                                    <pre className="whitespace-pre-wrap font-sans text-sm p-4 bg-slate-50 rounded-lg text-slate-800 h-[200px] overflow-y-auto border border-slate-200">
                                      {report.draftReport}
                                    </pre>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${active ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}>
      {icon}
      <span className="text-sm font-medium">{label}</span>
      {active && <div className="w-1.5 h-1.5 rounded-full bg-blue-600 ml-auto" />}
    </div>
  );
}

function StatsCard({ label, value, icon }: { label: string, value: number | string, icon: React.ReactNode }) {
  return (
    <Card className="shadow-sm border-slate-200 dark:border-slate-800">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
