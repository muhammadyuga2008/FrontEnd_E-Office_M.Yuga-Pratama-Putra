import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import AdminLayout from './components/AdminLayout';

export default function Dashboard() {
    const navigate = useNavigate();
    const [perusahaanList, setPerusahaanList] = useState([]);
    const [personelList, setPersonelList] = useState([]);
    const [pengalamanList, setPengalamanList] = useState([]);
    const [dokumenList, setDokumenList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [resPerusahaan, resPersonel, resPengalaman, resDokumen] = await Promise.all([
                    api.get('/perusahaan').catch(() => ({ data: [] })),
                    api.get('/personel').catch(() => ({ data: [] })),
                    api.get('/pp').catch(() => ({ data: [] })),
                    api.get('/generate').catch(() => ({ data: [] }))
                ]);

                const pData = resPerusahaan.data?.perusahaan || resPerusahaan.data?.data || resPerusahaan.data || [];
                const perData = resPersonel.data?.personel || resPersonel.data?.data || resPersonel.data || [];
                const ppData = resPengalaman.data?.['pengalaman Proyek'] || resPengalaman.data?.pengalaman || resPengalaman.data?.data || resPengalaman.data || [];
                const dokData = resDokumen.data?.dokumen || resDokumen.data?.generate || resDokumen.data?.data || resDokumen.data || [];

                setPerusahaanList(Array.isArray(pData) ? pData : []);
                setPersonelList(Array.isArray(perData) ? perData : []);
                setPengalamanList(Array.isArray(ppData) ? ppData : []);
                setDokumenList(Array.isArray(dokData) ? dokData : []);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <AdminLayout title="Dashboard Overview">
            <div className="space-y-8">
                {/* Banner Selamat Datang & Quick Action */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white shadow-lg shadow-blue-500/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">Selamat Datang di E-Office Tender 👋</h1>
                        <p className="text-blue-100 text-sm md:text-base max-w-xl">
                            Kelola data perusahaan, kualifikasi tenaga ahli, dan dokumen penawaran MDP secara otomatis dan terintegrasi.
                        </p>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        <button
                            onClick={() => navigate('/perusahaan/tambah')}
                            className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-4 py-2.5 rounded-xl text-sm transition shadow"
                        >
                            + Tambah Perusahaan
                        </button>
                        <button
                            onClick={() => navigate('/personel/tambah')}
                            className="bg-blue-500/40 border border-white/30 text-white hover:bg-blue-500/60 font-bold px-4 py-2.5 rounded-xl text-sm transition"
                        >
                            + Tambah Personel
                        </button>
                    </div>
                </div>

                {/* Kartu Statistik Interactive (Clickable) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Card Total Perusahaan -> Direct to /perusahaan */}
                    <div 
                        onClick={() => navigate('/perusahaan')}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:shadow-md hover:border-blue-300 hover:-translate-y-1 transition-all group"
                    >
                        <div>
                            <p className="text-sm font-semibold text-slate-500 mb-1 group-hover:text-blue-600 transition">Total Perusahaan</p>
                            <h3 className="text-3xl font-extrabold text-slate-800">
                                {loading ? '...' : perusahaanList.length}
                            </h3>
                            <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
                                <span>●</span> Terdaftar di sistem
                            </p>
                        </div>
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-blue-600 group-hover:text-white transition">
                            🏢
                        </div>
                    </div>

                    {/* Card Total Personel -> Direct to /personel */}
                    <div 
                        onClick={() => navigate('/personel')}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:shadow-md hover:border-indigo-300 hover:-translate-y-1 transition-all group"
                    >
                        <div>
                            <p className="text-sm font-semibold text-slate-500 mb-1 group-hover:text-indigo-600 transition">Total Tenaga Ahli</p>
                            <h3 className="text-3xl font-extrabold text-slate-800">
                                {loading ? '...' : personelList.length}
                            </h3>
                            <p className="text-xs text-blue-600 font-medium mt-2 flex items-center gap-1">
                                <span>●</span> Terverifikasi
                            </p>
                        </div>
                        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-indigo-600 group-hover:text-white transition">
                            👥
                        </div>
                    </div>

                    {/* Card Pengalaman Proyek -> Direct to /pengalaman */}
                    <div 
                        onClick={() => navigate('/pengalaman')}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:shadow-md hover:border-amber-300 hover:-translate-y-1 transition-all group"
                    >
                        <div>
                            <p className="text-sm font-semibold text-slate-500 mb-1 group-hover:text-amber-600 transition">Pengalaman Proyek</p>
                            <h3 className="text-3xl font-extrabold text-slate-800">
                                {loading ? '...' : pengalamanList.length}
                            </h3>
                            <p className="text-xs text-slate-400 font-medium mt-2">
                                Modul Siap Digunakan
                            </p>
                        </div>
                        <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-amber-500 group-hover:text-white transition">
                            💼
                        </div>
                    </div>

                    {/* Card Dokumen MDP -> Direct to /generate */}
                    <div 
                        onClick={() => navigate('/generate')}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:shadow-md hover:border-emerald-300 hover:-translate-y-1 transition-all group"
                    >
                        <div>
                            <p className="text-sm font-semibold text-slate-500 mb-1 group-hover:text-emerald-600 transition">Dokumen MDP</p>
                            <h3 className="text-3xl font-extrabold text-slate-800">
                                {loading ? '...' : dokumenList.length}
                            </h3>
                            <p className="text-xs text-slate-400 font-medium mt-2">
                                Siap di-generate
                            </p>
                        </div>
                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-emerald-600 group-hover:text-white transition">
                            📄
                        </div>
                    </div>
                </div>

                {/* Ringkasan Data Terbaru */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Perusahaan Terbaru */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-slate-800">Perusahaan Terbaru</h2>
                            <button
                                onClick={() => navigate('/perusahaan')}
                                className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                            >
                                Lihat Semua →
                            </button>
                        </div>

                        {loading ? (
                            <p className="text-sm text-slate-400 py-4">Memuat data...</p>
                        ) : perusahaanList.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {perusahaanList.slice(0, 4).map((item) => (
                                    <div key={item.id} className="py-3 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 font-bold">
                                                {(item.nama_perusahaan || item.nama || 'P').charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800 text-sm">
                                                    {item.nama_perusahaan || item.nama}
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    NPWP: {item.npwp || '-'}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-medium">
                                            Aktif
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400 py-4 text-center">Belum ada data perusahaan.</p>
                        )}
                    </div>

                    {/* Tenaga Ahli Terbaru */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-slate-800">Tenaga Ahli Terbaru</h2>
                            <button
                                onClick={() => navigate('/personel')}
                                className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                            >
                                Lihat Semua →
                            </button>
                        </div>

                        {loading ? (
                            <p className="text-sm text-slate-400 py-4">Memuat data...</p>
                        ) : personelList.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {personelList.slice(0, 4).map((item) => (
                                    <div key={item.id} className="py-3 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
                                                {(item.nama_personel || 'T').charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800 text-sm">
                                                    {item.nama_personel}
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    {item.jabatan} • {item.pendidikan}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md font-medium">
                                            {item.pengalaman_kerja ? `${item.pengalaman_kerja} Thn` : 'Personel'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400 py-4 text-center">Belum ada data tenaga ahli.</p>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}