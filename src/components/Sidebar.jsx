import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  // 1. Ambil lokasi URL yang sedang aktif
  const location = useLocation();

  // 2. Deklarasikan fungsi isActive di sini agar tidak 'is not defined'
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen p-4 space-y-2">
      <div className="px-4 py-3 font-bold text-white text-lg border-b border-slate-800 mb-4">
        E-Tender App
      </div>

      <nav className="space-y-1">
        <Link
          to="/dashboard"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
            isActive('/dashboard') ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'
          }`}
        >
          📊 Dashboard
        </Link>

        <Link
          to="/Perusahaan"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
            isActive('/Perusahaan') ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'
          }`}
        >
          🏢 Data Perusahaan
        </Link>

        <Link
          to="/personel"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
            isActive('/personel') ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'
          }`}
        >
          👨‍💼 Data Personel
        </Link>

        <Link
          to="/pengalaman"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
            isActive('/pengalaman') ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'
          }`}
        >
          💼 Pengalaman
        </Link>

        <Link
          to="/tender"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
            isActive('/tender') ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'
          }`}
        >
          📂 Data Tender
        </Link>

        <Link
          to="/dokumenpendukung"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
            isActive('/dokumenpendukung') ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'
          }`}
        >
          📁 Dokumen Pendukung
        </Link>

        {/* Menu Generate MDP */}
        <Link
          to="/generate-mdp"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
            isActive('/generate-mdp')
              ? 'bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-900/40'
              : 'hover:bg-slate-800 text-emerald-400'
          }`}
        >
          📄 Generate Dokumen MDP
        </Link>
      </nav>
    </aside>
  );
}