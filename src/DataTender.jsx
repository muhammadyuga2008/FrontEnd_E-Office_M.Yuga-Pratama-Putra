import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import AdminLayout from './components/AdminLayout';

export default function DataTender() {
    const [tenderList, setTenderList] = useState([]);
    const [perusahaanList, setPerusahaanList] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            setLoading(true);
            const [resTender, resPerusahaan] = await Promise.all([
                api.get('/tender').catch(() => api.get('/tender')),
                api.get('/perusahaan').catch(() => ({ data: [] }))
            ]);

            const dataTender = resTender.data.tender || resTender.data.data || resTender.data || [];
            const dataPerusahaan = resPerusahaan.data.perusahaan || resPerusahaan.data.data || resPerusahaan.data || [];

            setTenderList(Array.isArray(dataTender) ? dataTender : []);
            setPerusahaanList(Array.isArray(dataPerusahaan) ? dataPerusahaan : []);
        } catch (error) {
            console.error('Gagal mengambil data tender:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Fungsi untuk mencari Nama Perusahaan berdasarkan perusahaan_id
    const getNamaPerusahaan = (perusahaanId) => {
        if (!perusahaanId) return '-';
        const p = perusahaanList.find(item => Number(item.id) === Number(perusahaanId));
        return p ? (p.nama_perusahaan || p.nama) : '-';
    };

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus data tender ini?')) {
            try {
                await api.delete(`/tender/${id}`).catch(() => api.delete(`/deletetender/${id}`));
                alert('Data tender berhasil dihapus!');
                fetchData();
            } catch (error) {
                console.error('Gagal menghapus data tender:', error);
                alert('Gagal menghapus data tender.');
            }
        }
    };

    return (
        <AdminLayout title="Data Tender / Penawaran">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Daftar Tender</h2>
                        <p className="text-sm text-slate-500">Kelola data tender dan pembuatan dokumen penawaran</p>
                    </div>
                    <button 
                        onClick={() => navigate('/tender/tambah')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2"
                    >
                        <span>+</span> Tambah Tender
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-slate-400">Memuat data tender...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                                    <th className="p-4 rounded-l-lg">No</th>
                                    <th className="p-4">Nama Perusahaan</th>
                                    <th className="p-4">Nama Tender</th>
                                    <th className="p-4">Instansi & Lokasi</th>
                                    <th className="p-4">Nilai Penawaran</th>
                                    <th className="p-4">Tahun / Durasi</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 rounded-r-lg text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {tenderList.length > 0 ? (
                                    tenderList.map((item, index) => (
                                        <tr key={item.id || index} className="hover:bg-slate-50/80 transition">
                                            <td className="p-4 font-medium text-slate-500">{index + 1}</td>
                                            <td className="p-4 font-semibold text-slate-700">
                                                {item.perusahaan?.nama_perusahaan || getNamaPerusahaan(item.perusahaan_id)}
                                            </td>
                                            <td className="p-4 font-bold text-slate-800">{item.nama_tender}</td>
                                            <td className="p-4 text-slate-600 text-sm">
                                                <div>{item.instansi || '-'}</div>
                                                <div className="text-xs text-slate-400">
                                                    {item.lokasi_pekerjaan || item.kota_pengadaan || '-'}
                                                </div>
                                            </td>
                                            <td className="p-4 text-emerald-600 font-semibold">
                                                {item.nilai_penawaran 
                                                    ? `Rp ${Number(item.nilai_penawaran).toLocaleString('id-ID')}` 
                                                    : '-'}
                                            </td>
                                            <td className="p-4 text-slate-600 text-sm">
                                                <div>{item.tahun_anggaran || '-'}</div>
                                                <div className="text-xs text-slate-400">{item.durasi || '-'}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                                                    item.status_generate === 'Selesai' || item.status_generate === 'Generated'
                                                        ? 'bg-emerald-50 text-emerald-700'
                                                        : 'bg-amber-50 text-amber-700'
                                                }`}>
                                                    {item.status_generate || 'Draft'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button 
                                                        onClick={() => navigate(`/tender/edit/${item.id}`)}
                                                        className="px-3 py-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg text-xs font-bold transition"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(item.id)}
                                                        className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-bold transition"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center py-8 text-slate-400">
                                            Belum ada data tender. Klik tombol **+ Tambah Tender** untuk menambahkan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}